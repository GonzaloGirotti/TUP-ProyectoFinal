import { Request, Response } from "express";
import Usuario from "../models/usuario.model";
import { RegisterInput, LoginInput } from "../schemas/usuario.schema";
import jwt from "jsonwebtoken";

// Controlador de Registro
export const registerHandler = async (
  // Usamos 'unknown' en lugar de '{}' para evitar un error de lint 'no-empty-object-type'
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
) => {
  try {
    const { nombre_usuario, email, password, fecha_nacimiento, genero, altura, peso } =
      req.body;

    // 1. Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    // 2. Crear el nuevo usuario
    // El schema nos da un string, el modelo espera un Date. Lo convertimos.
    const nuevoUsuario = await Usuario.create({
      nombre_usuario,
      email,
      password,
      fecha_nacimiento,
      genero: genero || undefined,
      altura: altura || undefined,
      peso: peso || undefined,
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

    // 2. Comparar la contraseña (usando el método del modelo)
    const isPasswordCorrect = await usuario.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    // 3. Generar el JWT
    const jwtSecret = process.env.JWT_SECRET;

    if (typeof jwtSecret !== "string") {
      throw new Error(
        "JWT_SECRET no está definido o no es un string en las variables de entorno",
      );
    }

    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      nombre: usuario.nombre_usuario,
    };

    const options: jwt.SignOptions = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
    };

    const token = jwt.sign(payload, jwtSecret, options);

    // 4. Enviar respuesta con el token
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre_usuario,
      },
    });
  } catch (error: unknown) {
    // Usamos 'unknown'
    // Silenciamos 'no-console'

    console.error("[AUTH_LOGIN]:", error);

    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
