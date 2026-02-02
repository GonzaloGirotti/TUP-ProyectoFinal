import { Request, Response } from "express";
import Agua from "../models/agua.model";
import { CreateAguaInput } from "../schemas/agua.schema";
import { Op } from "sequelize";

// REGISTRAR AGUA
export const createAguaHandler = async (
  req: Request<unknown, unknown, CreateAguaInput>,
  res: Response,
) => {
  try {
    const { cantidad_ml, fecha } = req.body;

    if (!req.usuario) {
      return res.status(401).json({ message: "No autorizado" });
    }
    const id_usuario = req.usuario.id;

    const nuevoRegistro = await Agua.create({
      id_usuario,
      cantidad_ml,
      fecha: fecha ? new Date(fecha) : new Date(),
    });

    return res.status(201).json(nuevoRegistro);
  } catch (error) {
    console.error("[AGUA_CONTROLLER_CREATE]", error);
    return res.status(500).json({ message: "Error al registrar agua" });
  }
};

// OBTENER AGUA DE HOY
export const getAguaHoyHandler = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
    const id_usuario = req.usuario.id;

    // Calcular inicio (00:00) y fin (23:59) del día actual
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const registros = await Agua.findAll({
      where: {
        id_usuario,
        fecha: {
          [Op.between]: [start, end],
        },
      },
    });

    // Calculamos el total aquí para facilitarle la vida al Frontend
    const total_ml = registros.reduce((acc, curr) => acc + curr.cantidad_ml, 0);

    // Devolvemos el total y también el detalle por si se necesita
    return res.json({ total_ml, registros });
  } catch (error) {
    console.error("[AGUA_CONTROLLER_GET]", error);
    return res.status(500).json({ message: "Error obteniendo agua" });
  }
};

// BORRAR REGISTRO
export const deleteAguaHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.usuario) return res.status(401).json({ message: "No autorizado" });

    const registro = await Agua.findOne({
      where: { id_agua: id, id_usuario: req.usuario.id },
    });

    if (!registro) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    await registro.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("[AGUA_CONTROLLER_DELETE]", error);
    return res.status(500).json({ message: "Error al eliminar registro" });
  }
};
