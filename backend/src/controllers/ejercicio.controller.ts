import { Request, Response } from "express";
import { CreateEjercicioInput } from "../schemas/ejercicio.schema"; // Importamos el tipo de Zod
import Ejercicio from "../models/ejercicio.model";

/*
 Controlador para crear un nuevo registro peso.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createEjercicioHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateEjercicioInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { id_registro_diario, tipo, calorias_quemadas, duracion_minutos } =
      req.body;

    // 2. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      id_registro_diario: number;
      tipo: string;
      calorias_quemadas: number;
      duracion_minutos: number;
    } = {
      id_registro_diario,
      tipo,
      calorias_quemadas,
      duracion_minutos,
    };

    // 3. Crear el nuevo registro de registro peso en la BD
    const nuevoEjercicio = await Ejercicio.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoEjercicio);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[Ejercicio_CONTROLLER]:", error);
    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los ejercicio en la BD
export const getEjercicioHandler = async (req: Request, res: Response) => {
  try {
    // 1. Buscar todos los ejercicio en la BD
    const ejercicios = await Ejercicio.findAll({});
    // 3. Enviar respuesta
    return res.status(200).json(ejercicios);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_Ejercicio_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un ejercicio
export const deleteEjercicioHandler = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el ID del ejercicio (de los parámetros de la URL)
    const { id_ejercicio } = req.params;

    // 2. Buscar el registro del ejercicio
    //    Buscamos un ejercicio que coincida con el ID

    const ejercicio = await Ejercicio.findOne({
      where: {
        id_ejercicio: Number(id_ejercicio), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!ejercicio) {
      return res.status(404).json({ message: "Ejercicio no encontrado." });
    }

    // 5. Si se encontró, borrarlo
    await ejercicio.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `El ejercicio con ID ${id_ejercicio} ha sido eliminado con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_Ejercicio_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para actualizar un ejercicio
export const updateEjercicioHandler = async (
  req: Request<{ id_ejercicio: string }, unknown, CreateEjercicioInput>,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del ejercicio (de los parámetros de la URL)
    const { id_ejercicio } = req.params;

    // 2. Obtener los datos del body (ya validados por Zod)
    const { id_registro_diario, tipo, calorias_quemadas, duracion_minutos } =
      req.body;

    // 3. Buscar el registro del ejercicio
    const ejercicio = await Ejercicio.findOne({
      where: {
        id_ejercicio: Number(id_ejercicio), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!ejercicio) {
      return res.status(404).json({ message: "Ejercicio no encontrado." });
    }

    // 5. Actualizar los campos del ejercicio
    ejercicio.id_registro_diario = id_registro_diario;
    ejercicio.tipo = tipo;
    ejercicio.calorias_quemadas = calorias_quemadas;
    ejercicio.duracion_minutos = duracion_minutos;

    // 6. Guardar los cambios en la BD
    await ejercicio.save();

    // 7. Enviar respuesta con el ejercicio actualizado
    return res.status(200).json(ejercicio);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[UPDATE_Ejercicio_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
