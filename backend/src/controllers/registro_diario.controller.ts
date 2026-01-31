import { Request, Response } from "express";
import { CreateRegistroDiarioInput } from "../schemas/registro_diario.schema"; // Importamos el tipo de Zod
import Registro_Diario from "../models/registro_diario.model";

/*
 Controlador para crear un nuevo registro peso.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createRegistroDiarioHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateRegistroDiarioInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { id_usuario, fecha, agua_total_litros } = req.body;

    // 2. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      id_usuario: number;
      fecha: Date;
      agua_total_litros: number;
    } = {
      id_usuario,
      fecha,
      agua_total_litros,
    };

    // 3. Crear el nuevo registro de registro diario en la BD
    const nuevoRegistroDiario = await Registro_Diario.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoRegistroDiario);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[Registro_Diario_CONTROLLER]:", error);
    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los registros diario en la BD
export const getRegistroDiarioHandler = async (req: Request, res: Response) => {
  try {
    // 1. Buscar todos los registros diario en la BD
    const registros_diario = await Registro_Diario.findAll({});
    // 3. Enviar respuesta
    return res.status(200).json(registros_diario);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_Registro_Diario_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un registro diario
export const deleteRegistroDiarioHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del registro diario (de los parámetros de la URL)
    const { id_registro_diario } = req.params;

    // 2. Buscar el registro del registro diario
    //    Buscamos un registro diario que coincida con el ID

    const registro_diario = await Registro_Diario.findOne({
      where: {
        id_registro_diario: Number(id_registro_diario), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!registro_diario) {
      return res
        .status(404)
        .json({ message: "Registro diario no encontrado." });
    }

    // 5. Si se encontró, borrarlo
    await registro_diario.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `El registro diario con ID ${id_registro_diario} ha sido eliminado con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_REGISTRO_DIARIO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para actualizar un registro diario
export const updateRegistroDiarioHandler = async (
  req: Request<
    { id_registro_diario: string },
    unknown,
    CreateRegistroDiarioInput
  >,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del registro diario (de los parámetros de la URL)
    const { id_registro_diario } = req.params;

    // 2. Obtener los datos actualizados del body (ya validados por Zod)
    const { id_usuario, fecha, agua_total_litros } = req.body;

    // 3. Buscar el registro diario a actualizar
    const registro_diario = await Registro_Diario.findOne({
      where: {
        id_registro_diario: Number(id_registro_diario), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!registro_diario) {
      return res
        .status(404)
        .json({ message: "Registro diario no encontrado." });
    }

    // 5. Actualizar los campos del registro diario
    registro_diario.id_usuario = id_usuario;
    registro_diario.fecha = fecha;
    registro_diario.agua_total_litros = agua_total_litros;

    // 6. Guardar los cambios en la BD
    await registro_diario.save();

    // 7. Enviar respuesta con el registro diario actualizado
    return res.status(200).json(registro_diario);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[UPDATE_REGISTRO_DIARIO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
