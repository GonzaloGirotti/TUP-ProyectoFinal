import { Request, Response } from "express";
import Usuario from "../models/usuario.model";
import { RegisterInput,  } from "../schemas/usuario.schema";
import { 
  RefreshTokenInput,
  LogoutInput,
  VerifyEmailInput,
  ResendVerificationInput, 
  LoginInput
} from "../schemas/auth.schema";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// Variables de entorno
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// Simulación de almacenamiento de refresh tokens
const refreshTokens = new Map<string, { userId: number, expiresAt: Date }>();

// Controlador de Registro
export const registerHandler = async (
  // Usamos 'unknown' en lugar de '{}' para evitar un error de lint 'no-empty-object-type'
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
) => {
  try {
    const { nombre, email, password, fecha_nacimiento, genero, altura, nivel_actividad, tipo_objetivo } =
      req.body;

    // 1. Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    // 2. Crear el nuevo usuario
    // El schema nos da un string, el modelo espera un Date. Lo convertimos.
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      fecha_nacimiento,
      genero: genero || undefined,
      altura: altura || undefined,
      nivel_actividad: nivel_actividad || undefined,
      tipo_objetivo: tipo_objetivo || undefined,
    });

    // 3. Omitir la contraseña de la respuesta
    const { password: _, ...userResponse } = nuevoUsuario.toJSON();

    // 4. Enviar respuesta
    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: userResponse,
    });
  } catch (error: unknown) {
    console.error("[AUTH_REGISTER]:", error);

    // Manejo seguro del error 'unknown'
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador de Login
export const loginHandler = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;

    // 1. Encontrar al usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    // 2. Comparar la contraseña
    const isPasswordCorrect = await usuario.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    // 3. Generar access token
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      nombre: usuario.nombre,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    // 4. Generar refresh token
    const refreshToken = jwt.sign(
      { id: usuario.id_usuario, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );

    // Guardar refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    refreshTokens.set(refreshToken, {
      userId: usuario.id_usuario,
      expiresAt
    });

    // 5. Enviar respuesta con ambos tokens
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      refreshToken,
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    });
  } catch (error: unknown) {
    console.error("[AUTH_LOGIN]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};





// Handler para refresh token
export const refreshTokenHandler = async (
  req: Request<unknown, unknown, RefreshTokenInput>,
  res: Response,
) => {
  try {
    const { refreshToken } = req.body;

    // Verificar que el refresh token exista
    const storedToken = refreshTokens.get(refreshToken);
    if (!storedToken) {
      return res.status(401).json({ message: "Refresh token inválido" });
    }

    // Verificar expiración
    if (new Date() > storedToken.expiresAt) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({ message: "Refresh token expirado" });
    }

    // Buscar usuario
    const usuario = await Usuario.findByPk(storedToken.userId);
    if (!usuario) {
      refreshTokens.delete(refreshToken);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar nuevo access token
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      nombre: usuario.nombre,
    };

    const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    // Opcional: Rotar refresh token (mejor seguridad)
    refreshTokens.delete(refreshToken);
    const newRefreshToken = jwt.sign(
      { id: usuario.id_usuario, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    refreshTokens.set(newRefreshToken, {
      userId: usuario.id_usuario,
      expiresAt
    });

    return res.json({
      message: "Token refrescado exitosamente",
      token: newAccessToken,
      refreshToken: newRefreshToken,
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    });
  } catch (error: unknown) {
    console.error("[REFRESH_TOKEN]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Handler para logout
export const logoutHandler = async (
  req: Request<unknown, unknown, LogoutInput>,
  res: Response,
) => {
  try {
    const { refreshToken } = req.body;

    // Eliminar refresh token si se proporciona
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    // En producción, podrías agregar el access token a una blacklist

    return res.json({ 
      message: "Sesión cerrada exitosamente" 
    });
  } catch (error: unknown) {
    console.error("[LOGOUT]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Handler para verificación de email
export const verifyEmailHandler = async (
  req: Request<unknown, unknown, VerifyEmailInput>,
  res: Response,
) => {
  try {
    const { token } = req.body;

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { 
        id: number; 
        email: string; 
        type: string;
      };
    } catch (error) {
      return res.status(400).json({ message: "Token de verificación inválido o expirado" });
    }

    // Verificar que el token sea de tipo email_verification
    if (decoded.type !== 'email_verification') {
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

    // Marcar email como verificado (necesitarías agregar este campo al modelo)
    // await usuario.update({ email_verified: true, email_verified_at: new Date() });

    return res.json({ 
      message: "Email verificado exitosamente. Ahora puedes iniciar sesión." 
    });
  } catch (error: unknown) {
    console.error("[VERIFY_EMAIL]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Handler para reenviar verificación de email
export const resendVerificationHandler = async (
  req: Request<unknown, unknown, ResendVerificationInput>,
  res: Response,
) => {
  try {
    const { email } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      // Por seguridad, no revelamos si el email existe
      return res.json({ 
        message: "Si el email existe en nuestro sistema, recibirás un nuevo correo de verificación." 
      });
    }

    // Verificar si ya está verificado
    // if (usuario.email_verified) {
    //   return res.status(400).json({ message: "El email ya está verificado" });
    // }

    // Generar nuevo token de verificación
    const verificationToken = jwt.sign(
      { 
        id: usuario.id_usuario,
        email: usuario.email,
        type: 'email_verification' 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // En producción: Enviar email con el token
    // await sendVerificationEmail(usuario.email, verificationToken);
    
    console.log(`[DEBUG] Token de verificación para ${email}: ${verificationToken}`);
    
    return res.json({ 
      message: "Si el email existe en nuestro sistema, recibirás un nuevo correo de verificación.",
      // En desarrollo: enviar token en respuesta
      verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
    });
  } catch (error: unknown) {
    console.error("[RESEND_VERIFICATION]:", error);
    
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

