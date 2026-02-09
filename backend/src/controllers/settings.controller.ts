import { Request, Response } from "express";
import Usuario from "../models/usuario.model";
import { SettingsInput } from "../schemas/usuario.schema";

export const createSettingsHandler = async (
  req: Request<unknown, unknown, SettingsInput>,
  res: Response,
) => {
  try {
    const { nombre, apellido, email, password, fecha_nacimiento, genero, altura, nivel_actividad, tipo_objetivo } = req.body;

    // Usamos el ID del usuario logueado (Token)
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const id_usuario = req.usuario.id;

    const updateData: Partial<SettingsInput> = {
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

export const getSettingsHandler = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const id_usuario = req.usuario.id;

    const settings = await Usuario.findAll({
      where: {
        id_usuario,
      },
    });

    return res.json({ settings });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return res.status(500).json({ message: "Error obteniendo settings" });
  }
};

export const updateSettingsHandler = async (
  req: Request<unknown, unknown, SettingsInput>,
  res: Response,
) => {
  try {
    const { nombre, apellido, email, password, fecha_nacimiento, genero, altura, nivel_actividad, tipo_objetivo } = req.body;

    // Usamos el ID del usuario logueado (Token)
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const id_usuario = req.usuario.id;

    const updateData: Partial<SettingsInput> = { // Partial permite campos opcionales
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

    const [updatedRows] = await Usuario.update(updateData, {
      where: { id_usuario },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    return res.json({ message: "Configuración actualizada correctamente" });
  } catch (error) {
    console.error("[SETTINGS_CONTROLLER_UPDATE]", error);
    return res.status(500).json({ message: "Error al actualizar settings" });
  }
};