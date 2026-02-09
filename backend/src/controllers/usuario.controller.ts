import { Request, Response } from "express";
import Usuario from "../models/usuario.model";
import { 
  UpdateUsuarioInput,
  ChangePasswordInput,
  ResetPasswordRequestInput,
  ResetPasswordInput, 
  RegisterInput
} from "../schemas/usuario.schema";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

// Variables de entorno
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Simulación de almacenamiento de refresh tokens (mover a Redis en producción)
const refreshTokens = new Map<string, { userId: number, expiresAt: Date }>();

export const createProfileHandler = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
) => {
  try {
    const { nombre, apellido, email, password, fecha_nacimiento, genero, altura, nivel_actividad, tipo_objetivo } = req.body;

    // Usamos el ID del usuario logueado (Token)
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const id_usuario = req.usuario.id;

    const updateData: Partial<RegisterInput> = {
      nombre,
      apellido,
      email,
      fecha_nacimiento,
      genero,
      altura,
      nivel_actividad,
      tipo_objetivo,
    };

    if (password) {
      updateData.password = password;
    }

    const nuevoSettings = await Usuario.update(updateData, {
      where: { id_usuario },
    });

    return res.status(201).json(nuevoSettings);
  } catch (error) {
    console.error("[SETTINGS_CONTROLLER_CREATE]", error);
    return res.status(500).json({ message: "Error al registrar settings" });
  }
};


// Handler para obtener perfil del usuario autenticado
export const getProfileHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "No autorizado" });
    }
    
    const { id } = req.usuario;

    // Buscar usuario
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] } // Excluir contraseña
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ usuario });
  } catch (error: unknown) {
    console.error("[GET_PROFILE]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Handler para actualizar perfil de usuario
export const updateProfileHandler = async (
  req: Request<unknown, unknown, UpdateUsuarioInput>,
  res: Response,
) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "No autorizado" });
    }
    
    const { id } = req.usuario;
    const updateData = req.body;

    // Buscar usuario actual
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el email ya existe (si se está actualizando)
    if (updateData.email && updateData.email !== usuario.email) {
      const existingUser = await Usuario.findOne({ 
        where: { 
          email: updateData.email,
          id_usuario: { [Op.ne]: id }
        } 
      });
      
      if (existingUser) {
        return res.status(409).json({ message: "El email ya está en uso por otro usuario" });
      }
    }

    // Verificar si el nombre de usuario ya existe
    if (updateData.nombre && updateData.nombre !== usuario.nombre) {
      const existingUser = await Usuario.findOne({ 
        where: { 
          nombre: updateData.nombre,
          id_usuario: { [Op.ne]: id }
        } 
      });
      
      if (existingUser) {
        return res.status(409).json({ message: "El nombre ya está en uso por otro usuario" });
      }
    }

    // Actualizar el usuario
    await usuario.update(updateData);
    
    // Generar nuevo token con datos actualizados
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      nombre: usuario.nombre,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    // Omitir la contraseña de la respuesta
    const { password: _, ...userResponse } = usuario.toJSON();
    
    return res.json({
      message: "Perfil actualizado exitosamente",
      token,
      usuario: userResponse,
    });
  } catch (error: unknown) {
    console.error("[UPDATE_PROFILE]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Handler para cambio de contraseña
export const changePasswordHandler = async (
  req: Request<unknown, unknown, ChangePasswordInput>,
  res: Response,
) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "No autorizado" });
    }
    
    const { id } = req.usuario;
    const { currentPassword, newPassword } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña actual
    const isPasswordCorrect = await usuario.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    // Actualizar contraseña
    usuario.password = newPassword;
    await usuario.save();

    // Invalidar todos los refresh tokens del usuario
    for (const [token, data] of refreshTokens.entries()) {
      if (data.userId === id) {
        refreshTokens.delete(token);
      }
    }

    return res.json({ 
      message: "Contraseña actualizada exitosamente. Por favor, inicia sesión nuevamente." 
    });
  } catch (error: unknown) {
    console.error("[CHANGE_PASSWORD]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Handler para solicitar reset de contraseña (olvidé mi contraseña)
export const resetPasswordRequestHandler = async (
  req: Request<unknown, unknown, ResetPasswordRequestInput>,
  res: Response,
) => {
  try {
    const { email } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    
    // Por seguridad, no revelamos si el email existe o no
    if (!usuario) {
      // Simulamos éxito para no revelar información
      return res.json({ 
        message: "Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña." 
      });
    }

    // Generar token de reset (en producción usarías un servicio de email)
    const resetToken = jwt.sign(
      { 
        id: usuario.id_usuario,
        email: usuario.email,
        type: 'password_reset' 
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token válido por 1 hora
    );

    // En producción: Enviar email con el token
    // await sendResetPasswordEmail(usuario.email, resetToken);
    
    console.log(`[DEBUG] Token de reset para ${email}: ${resetToken}`);
    
    return res.json({ 
      message: "Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
      // En desarrollo: enviar token en respuesta (eliminar en producción)
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error: unknown) {
    console.error("[RESET_PASSWORD_REQUEST]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Handler para reset de contraseña con token
export const resetPasswordHandler = async (
  req: Request<unknown, unknown, ResetPasswordInput>,
  res: Response,
) => {
  try {
    const { token, newPassword } = req.body;

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { 
        id: number; 
        email: string; 
        type: string;
        iat: number;
        exp: number;
      };
    } catch (error) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Verificar que el token sea de tipo password_reset
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ message: "Token inválido" });
    }

    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar que el email coincida
    if (usuario.email !== decoded.email) {
      return res.status(400).json({ message: "Token inválido" });
    }

    // Actualizar contraseña
    usuario.password = newPassword;
    await usuario.save();

    // Invalidar todos los refresh tokens del usuario
    for (const [refreshToken, data] of refreshTokens.entries()) {
      if (data.userId === usuario.id_usuario) {
        refreshTokens.delete(refreshToken);
      }
    }

    return res.json({ 
      message: "Contraseña restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña." 
    });
  } catch (error: unknown) {
    console.error("[RESET_PASSWORD]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};