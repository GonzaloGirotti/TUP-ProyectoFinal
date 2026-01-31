import { Request, Response } from "express";
import { CreateObjetivosInput } from "../schemas/objetivo_calorico.schema"; // Importamos el tipo de Zod
import Objetivo_Calorico from "../models/objetivo_calorico.model";

/*
 Controlador para crear un nuevo objetivo.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createObjetivoCaloricoHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateObjetivosInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const {
      id_usuario,
      calorias_diarias,
      proteinas_diarias,
      carbohidratos_diarios,
      grasas_diarias,
    } = req.body;

    // 2. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      id_usuario: number;
      calorias_diarias: number;
      proteinas_diarias: number;
      carbohidratos_diarios: number;
      grasas_diarias: number;
    } = {
      id_usuario,
      calorias_diarias,
      proteinas_diarias,
      carbohidratos_diarios,
      grasas_diarias,
    };

    // 3. Crear el nuevo registro de objetivos en la BD
    const nuevoObjetivoCalorico = await Objetivo_Calorico.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoObjetivoCalorico);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[OBJETIVO_CALORICO_CONTROLLER]:", error);

    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los objetivos en la BD
export const getObjetivoCaloricoHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Buscar todos los objetivos caloricos en la BD
    const objetivos_caloricos = await Objetivo_Calorico.findAll({});
    // 3. Enviar respuesta
    return res.status(200).json(objetivos_caloricos);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_OBJETIVO_CALORICO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un objetivo
export const deleteObjetivoCaloricoHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del objetivo calorico (de los parámetros de la URL)
    const { id_objetivo_calorico } = req.params;

    // 2. Buscar el registro del objetivo calorico
    //    Buscamos un objetivo calorico que coincida con el ID

    const objetivo_calorico = await Objetivo_Calorico.findOne({
      where: {
        id_objetivo_calorico: Number(id_objetivo_calorico), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!objetivo_calorico) {
      return res
        .status(404)
        .json({ message: "Objetivo calorico no encontrado." });
    }

    // 5. Si se encontró, borrarlo
    await objetivo_calorico.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `El objetivo calorico con ID ${id_objetivo_calorico} ha sido eliminado con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_OBJETIVOS_CALORICOS_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para actualizar un objetivo calorico
export const updateObjetivoCaloricoHandler = async (
  req: Request<{ id_objetivo_calorico: string }, unknown, CreateObjetivosInput>,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del objetivo calorico de los parámetros
    const { id_objetivo_calorico } = req.params;

    // 2. Buscar el registro del objetivo calorico
    const objetivo_calorico = await Objetivo_Calorico.findOne({
      where: {
        id_objetivo_calorico: Number(id_objetivo_calorico),
      },
    });

    // 3. Si no se encuentra, devolver 404
    if (!objetivo_calorico) {
      return res
        .status(404)
        .json({ message: "Objetivo calorico no encontrado." });
    }

    // 4. Actualizar los campos con los datos del body
    await objetivo_calorico.update(req.body);

    // 5. Enviar la respuesta con el objetivo calorico actualizado
    return res.status(200).json(objetivo_calorico);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[UPDATE_OBJETIVO_CALORICO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
