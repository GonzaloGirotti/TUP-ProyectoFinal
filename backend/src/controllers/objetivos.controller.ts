import { Request, Response } from "express";
import { CreateObjetivosInput } from "../schemas/objetivos.schema"; // Importamos el tipo de Zod
import Objetivos from "../models/objetivos.model";

import { UpdateObjetivosInput } from "../schemas/objetivos.schema"; 

/*
 Controlador para crear un nuevo objetivo.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createObjetivosHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateObjetivosInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const {
      id_usuario,
      calorias,
      proteinas_proporcion,
      carbohidratos_proporcion,
      grasas_proporcion,
      peso_deseado,
    } = req.body;

    // 2. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      id_usuario: number;
      calorias: number;
      proteinas_proporcion: number;
      carbohidratos_proporcion: number;
      grasas_proporcion: number;
      peso_deseado: number;
    } = {
      id_usuario,
      calorias,
      proteinas_proporcion,
      carbohidratos_proporcion,
      grasas_proporcion,
      peso_deseado,
    };

    // 3. Crear el nuevo registro de objetivos en la BD
    const nuevoObjetivo = await Objetivos.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoObjetivo);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[OBJETIVO_CONTROLLER]:", error);

    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los objetivos en la BD
export const getObjetivosHandler = async (req: Request, res: Response) => {
  try {
    // 1. Buscar todos los objetivos
    const objetivos = await Objetivos.findAll({});
    // 3. Enviar respuesta
    return res.status(200).json(objetivos);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_OBJETIVOS_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

/**
 * Controlador para actualizar un objetivo existente
 */
export const updateObjetivoHandler = async (
  req: Request<{ id_objetivo: string }, unknown, UpdateObjetivosInput>,
  res: Response,
) => {
  try {
    const { id_objetivo } = req.params;
    
    // Verificar autenticación
    if (!req.usuario) {
      return res.status(401).json({ message: "No autorizado" });
    }
    const id_usuario = req.usuario.id;

    // Buscar el objetivo
    const objetivo = await Objetivos.findOne({
      where: {
        id_objetivos: Number(id_objetivo),
        id_usuario: id_usuario, // Solo puede actualizar sus propios objetivos
      },
    });

    if (!objetivo) {
      return res.status(404).json({ 
        message: "Objetivo no encontrado o no tienes permiso para modificarlo" 
      });
    }

    // Preparar datos para actualizar
    const datosActualizados: Partial<{
      calorias: number;
      proteinas_proporcion: number;
      carbohidratos_proporcion: number;
      grasas_proporcion: number;
      peso_deseado: number;
    }> = {};

    // Solo actualizar campos que se envían en el body
    if (req.body.calorias !== undefined) datosActualizados.calorias = req.body.calorias;
    if (req.body.proteinas_proporcion !== undefined) datosActualizados.proteinas_proporcion = req.body.proteinas_proporcion;
    if (req.body.carbohidratos_proporcion !== undefined) datosActualizados.carbohidratos_proporcion = req.body.carbohidratos_proporcion;
    if (req.body.grasas_proporcion !== undefined) datosActualizados.grasas_proporcion = req.body.grasas_proporcion;
    if (req.body.peso_deseado !== undefined) datosActualizados.peso_deseado = req.body.peso_deseado;

    // Actualizar el registro
    await objetivo.update(datosActualizados);

    // Obtener el registro actualizado
    const objetivoActualizado = await Objetivos.findByPk(objetivo.id_objetivos);

    return res.status(200).json({
      message: "Objetivo actualizado exitosamente",
      objetivo: objetivoActualizado,
    });
  } catch (error: unknown) {
    console.error("[UPDATE_OBJETIVO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un objetivo
export const deleteObjetivoHandler = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el ID del objetivo (de los parámetros de la URL)
    const { id_objetivo } = req.params;

    // 2. Buscar el registro del objetivo
    //    Buscamos un objetivo que coincida con el ID

    const objetivo = await Objetivos.findOne({
      where: {
        id_objetivos: Number(id_objetivo), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!objetivo) {
      return res.status(404).json({ message: "Objetivo no encontrado." });
    }

    // 5. Si se encontró, borrarlo
    await objetivo.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `El objetivo con ID ${id_objetivo} ha sido eliminado con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_OBJETIVOS_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
