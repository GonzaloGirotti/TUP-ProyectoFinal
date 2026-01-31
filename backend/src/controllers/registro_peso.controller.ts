import { Request, Response } from "express";
import { CreateRegistroPesoInput } from "../schemas/registro_peso.schema"; // Importamos el tipo de Zod
import Registro_Peso from "../models/registro_peso.model";

/*
 Controlador para crear un nuevo registro peso.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createRegistroPesoHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateRegistroPesoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { id_usuario, fecha, peso_kg } = req.body;

    // 2. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      id_usuario: number;
      fecha: Date;
      peso_kg: number;
    } = {
      id_usuario,
      fecha,
      peso_kg,
    };

    // 3. Crear el nuevo registro de registro peso en la BD
    const nuevoRegistroPeso = await Registro_Peso.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoRegistroPeso);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[Registro_Peso_CONTROLLER]:", error);
    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los registros peso en la BD
export const getRegistroPesoHandler = async (req: Request, res: Response) => {
  try {
    // 1. Buscar todos los objetivos peso en la BD
    const registros_peso = await Registro_Peso.findAll({});
    // 3. Enviar respuesta
    return res.status(200).json(registros_peso);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_Registro_Peso_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un registro peso
export const deleteRegistroPesoHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del registro peso (de los parámetros de la URL)
    const { id_registro_peso } = req.params;

    // 2. Buscar el registro del registro peso
    //    Buscamos un registro peso que coincida con el ID

    const registro_peso = await Registro_Peso.findOne({
      where: {
        id_registro_peso: Number(id_registro_peso), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!registro_peso) {
      return res.status(404).json({ message: "Registro peso no encontrado." });
    }

    // 5. Si se encontró, borrarlo
    await registro_peso.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `El registro peso con ID ${id_registro_peso} ha sido eliminado con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_REGISTRO_PESO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para actualizar un registro peso
export const updateRegistroPesoHandler = async (
  req: Request<{ id_registro_peso: string }, unknown, CreateRegistroPesoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del registro peso (de los parámetros de la URL)
    const { id_registro_peso } = req.params;

    // 2. Obtener los datos actualizados del body (ya validados por Zod)
    const { id_usuario, fecha, peso_kg } = req.body;

    // 3. Buscar el registro del registro peso
    const registro_peso = await Registro_Peso.findOne({
      where: {
        id_registro_peso: Number(id_registro_peso), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!registro_peso) {
      return res.status(404).json({ message: "Registro peso no encontrado." });
    }

    // 5. Actualizar los campos con los datos del body
    registro_peso.id_usuario = id_usuario;
    registro_peso.fecha = fecha;
    registro_peso.peso_kg = peso_kg;

    // 6. Guardar los cambios en la BD
    await registro_peso.save();

    // 7. Enviar respuesta con el registro peso actualizado
    return res.status(200).json(registro_peso);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[UPDATE_REGISTRO_PESO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
