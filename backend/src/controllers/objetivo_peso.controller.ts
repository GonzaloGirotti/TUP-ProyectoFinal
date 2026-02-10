import { Request, Response } from "express";
import { CreateObjetivoPesoInput } from "../schemas/objetivo_peso.schema"; // Importamos el tipo de Zod
import Objetivo_Peso from "../models/objetivo_peso.model";
import { Op } from "sequelize";

/*
 Controlador para crear un nuevo objetivo.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createObjetivoPesoHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateObjetivoPesoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { id_usuario, fecha, peso_kg } = req.body;

    // 2. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      id_usuario: number;
      fecha?: Date;
      peso_kg: number;
    } = {
      id_usuario,
      fecha,
      peso_kg,
    };

    // 3. Crear el nuevo registro de objetivo peso en la BD
    const nuevoObjetivoPeso = await Objetivo_Peso.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoObjetivoPeso);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[Objetivo_Peso_CONTROLLER]:", error);

    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los objetivos en la BD
export const getObjetivoPesoHandler = async (req: Request, res: Response) => {
  try {
    // 1. Buscar todos los objetivos peso en la BD
    const objetivos_peso = await Objetivo_Peso.findAll({});
    // 3. Enviar respuesta
    return res.status(200).json(objetivos_peso);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_Objetivo_Peso_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un objetivo
export const deleteObjetivoPesoHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del objetivo peso (de los parámetros de la URL)
    const { id_objetivo_peso } = req.params;

    // 2. Buscar el registro del objetivo peso
    //    Buscamos un objetivo peso que coincida con el ID

    const objetivo_peso = await Objetivo_Peso.findOne({
      where: {
        id_objetivo_peso: Number(id_objetivo_peso), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!objetivo_peso) {
      return res.status(404).json({ message: "Objetivo peso no encontrado." });
    }

    // 5. Si se encontró, borrarlo
    await objetivo_peso.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `El objetivo peso con ID ${id_objetivo_peso} ha sido eliminado con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_OBJETIVO_PESO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para actualizar un objetivo peso
export const updateObjetivoPesoHandler = async (
  req: Request<{ id_objetivo_peso: string }, unknown, CreateObjetivoPesoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del objetivo peso de los parámetros de la URL
    const { id_objetivo_peso } = req.params;

    // 2. Obtener los datos actualizados del body (ya validados por Zod)
    const { id_usuario, fecha, peso_kg } = req.body;

    // 3. Buscar el registro existente en la BD
    const objetivo_peso = await Objetivo_Peso.findOne({
      where: { id_objetivo_peso: Number(id_objetivo_peso) },
    });

    // 4. Si no se encuentra, devolver 404
    if (!objetivo_peso) {
      return res.status(404).json({ message: "Objetivo peso no encontrado." });
    }

    // 5. Actualizar los campos con los datos del body
    objetivo_peso.id_usuario = id_usuario;
    if (fecha !== undefined) {
      objetivo_peso.fecha = fecha;
    }
    objetivo_peso.peso_kg = peso_kg;

    // 6. Guardar los cambios en la BD
    await objetivo_peso.save();

    // 7. Enviar respuesta con el objetivo peso actualizado
    return res.status(200).json(objetivo_peso);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[UPDATE_OBJETIVO_PESO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

export const deleteObjetivosPesoViejosHandler = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el ID del usuario (del token)
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;
    
    // 2. Obtener los objetivos peso actuales para ver si hay mas de uno.
    const objetivosPeso = await Objetivo_Peso.findAll({
      where: { id_usuario },
      order: [["fecha", "DESC"]],
    });

    if (objetivosPeso.length <= 1) {
      return res.status(200).json({ message: "No hay objetivos peso antiguos para eliminar." });
    }

    // 3. Eliminar todos los pesos excepto el más reciente
    const resultado = await Objetivo_Peso.destroy({
      where: {
        id_usuario,
        id_objetivo_peso: {
          [Op.ne]: objetivosPeso[0].id_objetivo_peso, // 'ne' = 'not equal', mantenemos el más reciente
        },
      },
    });
    
    // 4. Enviar respuesta
    return res.status(200).json({ message: `${resultado} registros de peso antiguos eliminados.` });
  } catch (error: unknown) {
    console.error("[DELETE_VIEJOS_OBJETIVOS_PESO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
