import { Request, Response } from "express";
import Comida from "../models/comida.model"; // Importamos el modelo comida
import { CreateComidaInput } from "../schemas/comida.schema"; // Importamos el tipo de Zod

/*
 Controlador para crear un nuevo registro de comida.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createComidaHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateComidaInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { fecha, nombre_comida } = req.body;
    // 2. Obtener el ID del usuario (del token verificado por authMiddleware)
    // Hacemos una comprobación por si acaso, aunque el middleware ya lo hizo.
    if (!req.usuario) {
      return res.status(401).json({
        message: "No se encontró información de usuario en la sesión.",
      });
    }
    const id_usuario = req.usuario.id; // 'id' es como lo definimos en el payload del JWT

    // 1. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      id_usuario: number;
      nombre_comida: string;
      fecha: Date;
    } = {
      fecha,
      id_usuario, // ID del token
      nombre_comida: nombre_comida,
    };

    // 2. Crear el nuevo registro de comida en la BD
    const nuevaComida = await Comida.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevaComida);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[COMIDA_CONTROLLER]:", error);

    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los registros de comida del usuario logueado.
export const getComidasHandler = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el ID del usuario (del token)
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;
    // 2. Buscar todos las comidas que coincidan con el id_usuario
    // Ordenamos por fecha descendente (los más nuevos primero)
    const comidas = await Comida.findAll({
      where: { id_usuario },
      order: [["fecha", "DESC"]],
    });

    // 3. Enviar respuesta
    return res.status(200).json(comidas);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_COMIDAS_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un registro de comida.
export const deleteComidaHandler = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el ID del usuario (del token)
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;

    // 2. Obtener el ID de la comida (de los parámetros de la URL)
    const { id_comida } = req.params;

    // 3. Buscar el registro de comida
    /* 
        Buscamos una comida que coincida con el ID Y que además pertenezca al usuario que está haciendo la petición.
        Esto evita que un usuario borre las comidas de otro.
        */
    const comida = await Comida.findOne({
      where: {
        id_comida: Number(id_comida), // Convertimos el ID de string a número
        id_usuario: id_usuario, // La comprobación de seguridad
      },
    });

    // 4. Si no se encuentra (o no le pertenece), devolver 404
    if (!comida) {
      return res
        .status(404)
        .json({ message: "Registro de comida no encontrado o no autorizado." });
    }

    // 5. Si se encontró y le pertenece, borrarlo
    await comida.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `La comida con ID ${id_comida} ha sido eliminada con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_COMIDA_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
