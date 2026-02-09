import { Request, Response } from "express";
import Ejercicio from "../models/ejercicio.model";
import { CreateEjercicioInput } from "../schemas/ejercicio.schema";
import { Op } from "sequelize";

export const createEjercicioHandler = async (
  req: Request<unknown, unknown, CreateEjercicioInput>,
  res: Response,
) => {
  try {
    const { tipo, calorias_quemadas, duracion_minutos, fecha } = req.body;

    // Usamos el ID del usuario logueado (Token)
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const id_usuario = req.usuario.id;

    const nuevoEjercicio = await Ejercicio.create({
      id_usuario,
      tipo,
      calorias_quemadas,
      duracion_minutos,
      fecha: fecha ? new Date(fecha) : new Date(),
    });

    return res.status(201).json(nuevoEjercicio);
  } catch (error) {
    console.error("[EJERCICIO_CONTROLLER_CREATE]", error);
    return res.status(500).json({ message: "Error al registrar ejercicio" });
  }
};
export const getEjerciciosHoyHandler = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const id_usuario = req.usuario.id;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const ejercicios = await Ejercicio.findAll({
      where: {
        id_usuario,
        fecha: { [Op.between]: [start, end] },
      },
    });

    const total_calorias = ejercicios.reduce((acc, curr) => acc + curr.calorias_quemadas, 0);
    return res.json({ total_calorias, ejercicios });
  } catch (error) {
    console.error("[EJERCICIO_GET]", error);
    return res.status(500).json({ message: "Error obteniendo ejercicios" });
  }
};

export const deleteEjercicioHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const registro = await Ejercicio.findOne({ where: { id_ejercicio: id, id_usuario: req.usuario.id } });
    if (!registro) return res.status(404).json({ message: "Ejercicio no encontrado" });
    await registro.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar ejercicio" });
  }
};