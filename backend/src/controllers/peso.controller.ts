import { Request, Response } from "express";
import Peso from "../models/peso.model"; // Importamos el modelo Peso
import { CreatePesoInput } from "../schemas/peso.schema"; // Importamos el tipo de Zod
import { UpdatePesoInput } from "../schemas/peso.schema"; 

/*
 Controlador para crear un nuevo registro de peso.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createPesoHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreatePesoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { peso_kg, fecha, comentario } = req.body;
    // 2. Obtener el ID del usuario (del token verificado por authMiddleware)
    // Hacemos una comprobación por si acaso, aunque el middleware ya lo hizo.
    if (!req.usuario) {
      return res
        .status(401)
        .json({
          message: "No se encontró información de usuario en la sesión.",
        });
    }
    const id_usuario = req.usuario.id; // 'id' es como lo definimos en el payload del JWT

    // 1. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      peso_kg: number;
      id_usuario: number;
      comentario: string | null;
      fecha?: Date; // Hacemos 'fecha' opcional
    } = {
      peso_kg,
      id_usuario, // ID del token
      comentario: comentario || null, // Convertir 'undefined' a 'null' si es necesario
    };

    // 2. Si el usuario SÍ mandó una fecha (no es undefined), la añadimos
    if (fecha) {
      dataParaCrear.fecha = fecha;
    }

    // 3. Crear el nuevo registro de peso en la BD
    // Si no pasamos 'fecha', Sequelize usará el 'defaultValue' del modelo.
    const nuevoPeso = await Peso.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoPeso);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[PESO_CONTROLLER]:", error);

    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los registros de peso del usuario logueado.
export const getPesosHandler = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el ID del usuario (del token)
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;
    // 2. Buscar todos los pesos que coincidan con el id_usuario
    // Ordenamos por fecha descendente (los más nuevos primero)
    const pesos = await Peso.findAll({
      where: { id_usuario },
      order: [["fecha", "DESC"]],
    });

    // 3. Enviar respuesta
    return res.status(200).json(pesos);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_PESOS_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

/**
 * Controlador para actualizar un registro de peso existente
 */
export const updatePesoHandler = async (
  req: Request<{ id_peso: string }, unknown, UpdatePesoInput>,
  res: Response,
) => {
  try {
    const { id_peso } = req.params;
    
    // Verificar autenticación
    if (!req.usuario) {
      return res.status(401).json({ message: "No autorizado" });
    }
    const id_usuario = req.usuario.id;

    // Buscar el registro de peso
    const peso = await Peso.findOne({
      where: {
        id_peso: Number(id_peso),
        id_usuario: id_usuario, // Solo puede actualizar sus propios registros
      },
    });

    if (!peso) {
      return res.status(404).json({ 
        message: "Registro de peso no encontrado o no tienes permiso para modificarlo" 
      });
    }

    // Preparar datos para actualizar
    const datosActualizados: Partial<{
      peso_kg: number;
      fecha: Date;
      comentario: string | null;
    }> = {};

    // Solo actualizar campos que se envían en el body
    if (req.body.peso_kg !== undefined) datosActualizados.peso_kg = req.body.peso_kg;
    if (req.body.fecha !== undefined) datosActualizados.fecha = req.body.fecha;
    if (req.body.comentario !== undefined) {
      datosActualizados.comentario = req.body.comentario || null;
    }

    // Actualizar el registro
    await peso.update(datosActualizados);

    // Obtener el registro actualizado
    const pesoActualizado = await Peso.findByPk(peso.id_peso);

    return res.status(200).json({
      message: "Registro de peso actualizado exitosamente",
      peso: pesoActualizado,
    });
  } catch (error: unknown) {
    console.error("[UPDATE_PESO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un registro de peso.
export const deletePesoHandler = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el ID del usuario (del token)
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;

    // 2. Obtener el ID del peso (de los parámetros de la URL)
    const { id_peso } = req.params;

    // 3. Buscar el registro de peso
    /* 
        Buscamos un peso que coincida con el ID Y que además pertenezca al usuario que está haciendo la petición.
        Esto evita que un usuario borre los pesos de otro.
        */
    const peso = await Peso.findOne({
      where: {
        id_peso: Number(id_peso), // Convertimos el ID de string a número
        id_usuario: id_usuario, // La comprobación de seguridad
      },
    });

    // 4. Si no se encuentra (o no le pertenece), devolver 404
    if (!peso) {
      return res
        .status(404)
        .json({ message: "Registro de peso no encontrado o no autorizado." });
    }

    // 5. Si se encontró y le pertenece, borrarlo
    await peso.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res
      .status(204)
      .json({
        message: `El peso con ID ${id_peso} ha sido eliminado con éxito`,
      });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_PESO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
