import { Request, Response } from "express";
import ComidaAlimento from "../models/comida_alimento.model"; // Importamos el modelo comida_alimento
import Alimento from "../models/alimento_consumido.model"; // Importamos el modelo Alimento para calcular macros
import Comida from "../models/comida.model"; // Importamos Comida para validar propiedad
import { CreateComidaAlimentoInput } from "../schemas/comida_alimento.schema"; // Importamos el tipo de Zod

/*
 Controlador para crear un nuevo registro de comida_alimento.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createComidaAlimentoHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateComidaAlimentoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    // Nota: No pedimos los totales porque los calcularemos aquí. Solo pedimos IDs y cantidad.
    const { id_comida, id_alimento, cantidad_gramos } = req.body;

    // 2. Obtener el ID del usuario (del token verificado por authMiddleware)
    // Hacemos una comprobación por si acaso, aunque el middleware ya lo hizo.
    if (!req.usuario) {
      return res.status(401).json({
        message: "No se encontró información de usuario en la sesión.",
      });
    }
    const id_usuario = req.usuario.id; // 'id' es como lo definimos en el payload del JWT

    // Verificamos que la Comida exista Y pertenezca al usuario antes de agregarle nada.
    const comida = await Comida.findOne({
      where: {
        id_comida: id_comida,
        id_usuario: id_usuario,
      },
    });

    if (!comida) {
      return res
        .status(404)
        .json({ message: "Comida no encontrada o no te pertenece." });
    }

    // 3. Buscar el alimento original para obtener sus macros base (por 100g)
    const alimento = await Alimento.findByPk(id_alimento);
    if (!alimento) {
      return res.status(404).json({ message: "Alimento no encontrado" });
    }

    // 4. Calcular los totales basados en la cantidad (Lógica de Negocio)
    // (Regla de tres: si 100g tiene X, 'cantidad_gramos' tiene Y)
    const factor = cantidad_gramos / 100;

    const carbohidratos_total = alimento.carbohidratos * factor;
    const proteinas_total = alimento.proteinas * factor;
    const grasas_total = alimento.grasas * factor;
    const calorias_total = alimento.calorias * factor;

    // 5. Creamos un objeto de creación base con los datos calculados
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear = {
      id_comida,
      id_alimento,
      cantidad_gramos,
      carbohidratos_total,
      grasas_total,
      proteinas_total,
      calorias_total,
    };

    // 6. Crear el nuevo registro de comida_alimento en la BD
    const nuevaComidaAlimento = await ComidaAlimento.create(dataParaCrear);

    // 7. Enviar respuesta exitosa
    return res.status(201).json(nuevaComidaAlimento);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[COMIDA_ALIMENTO_CONTROLLER]:", error);

    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los registros de comida_alimento del usuario logueado.
export const getComidasAlimentosHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del usuario (del token)
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;

    // 2. Buscar todos las comidas_alimentos que coincidan con el id_usuario
    // Ordenamos por fecha descendente (los más nuevos primero)
    const comidas_alimentos = await ComidaAlimento.findAll({
      /* Obtener solo los registros cuyos comidas pertenezcan al usuario 
        (podría ser tambien mediante los alimentos, pero es más lógico por las comidas)
      */
      include: [
        {
          // Incluir la asociación con Comida para filtrar por id_usuario
          association: "comida", // Nombre de la asociación definida en el modelo
          where: { id_usuario }, // Filtrar por id_usuario
        },
        {
          association: "alimento", // (Opcional) Para ver qué alimento es
        },
      ],
      order: [["fecha_creacion", "DESC"]],
    });

    // 3. Enviar respuesta
    return res.status(200).json(comidas_alimentos);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_COMIDAS_ALIMENTOS_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un registro de comida_alimento.
export const deleteComidaAlimentoHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del usuario (del token)
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;

    // 2. Obtener el ID de la comida_alimento (de los parámetros de la URL)
    const { id_comida_alimento } = req.params;

    // 3. Buscar el registro de comida
    /* Buscamos una comida que coincida con el ID Y que además pertenezca al usuario que está haciendo la petición.
       Esto evita que un usuario borre las comidas de otro.
       */
    const comida_alimento = await ComidaAlimento.findOne({
      where: {
        id_comida_alimento: Number(id_comida_alimento), // Convertimos el ID de string a número
      },
      include: [
        {
          // Incluir la asociación con Comida para filtrar por id_usuario
          association: "comida", // Nombre de la asociación definida en el modelo
          where: { id_usuario }, // Filtrar por id_usuario
        },
      ],
    });

    // 4. Si no se encuentra (o no le pertenece), devolver 404
    if (!comida_alimento) {
      return res.status(404).json({
        message: "Registro de comida_alimento no encontrado o no autorizado.",
      });
    }

    // 5. Si se encontró y le pertenece, borrarlo
    await comida_alimento.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `La comida_alimento con ID ${id_comida_alimento} ha sido eliminada con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_COMIDA_ALIMENTO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
