import { Request, Response } from "express";
import ComidaAlimento from "../models/comida_alimento.model"; 
import AlimentoConsumido from "../models/alimento_consumido.model";    //Cambiar POR: import AlimentoConsumido from "../models/alimento_consumido.model"
import Comida from "../models/comida.model"; 
import { CreateComidaAlimentoInput } from "../schemas/comida_alimento.schema"; 

/*
 Controla la creación de un nuevo registro de comida_alimento.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createComidaAlimentoHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateComidaAlimentoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { id_comida, id_alimento_consumido, cantidad_gramos } = req.body;

    // 2. Obtener el ID del usuario (del token verificado por authMiddleware)
    if (!req.usuario) {
      return res.status(401).json({
        message: "No se encontró información de usuario en la sesión.",
      });
    }
    const id_usuario = req.usuario.id;

    // Verificamos que la Comida exista Y pertenezca al usuario
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

    // 3. Buscar el alimento original para obtener sus macros base
    const alimento = await AlimentoConsumido.findByPk(id_alimento_consumido);
    if (!alimento) {
      return res.status(404).json({ message: "Alimento no encontrado" });
    }

    // 4. Calcular los totales basados en la cantidad (Regla de tres simple)
    // Los macros del alimento base son por cada 100g
    const factor = cantidad_gramos / 100;

    const carbohidratos_total = alimento.carbohidratos * factor;
    const proteinas_total = alimento.proteinas * factor;
    const grasas_total = alimento.grasas * factor;
    const calorias_total = alimento.calorias * factor;

    // 5. Crear primero un Alimento_Consumido con los datos específicos
    const alimentoConsumido = await AlimentoConsumido.create({
      nombre: alimento.nombre,
      gramos: cantidad_gramos,
      carbohidratos: alimento.carbohidratos,
      proteinas: alimento.proteinas,
      grasas: alimento.grasas,
      calorias: alimento.calorias
    });

    // 6. Objeto para crear la relación Comida_Alimento
    const dataParaCrear = {
      id_comida,
      id_alimento_consumido: alimentoConsumido.id_alimento_consumido,
      cantidad_gramos,
      carbohidratos_total,
      grasas_total,
      proteinas_total,
      calorias_total,
    };

    // 7. Crear registro
    const nuevaComidaAlimento = await ComidaAlimento.create(dataParaCrear);

    // 8. Responder
    return res.status(201).json(nuevaComidaAlimento);
  } catch (error: unknown) {
    console.error("[COMIDA_ALIMENTO_CONTROLLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener registros de comida_alimento.
// AHORA SOPORTA FILTRADO POR id_comida
export const getComidasAlimentosHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;

    // 1. CAPTURAR QUERY PARAM
    const { id_comida } = req.query;

    // 2. Construir filtro dinámico
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    // Si el frontend envía ?id_comida=5, filtramos por eso.
    if (id_comida) {
      whereClause.id_comida = id_comida;
    }

    // 3. Buscar con el filtro aplicado
    const comidas_alimentos = await ComidaAlimento.findAll({
      where: whereClause, // <--- Aplicamos el filtro aquí
      include: [
        {
          // Seguridad: Aseguramos que la Comida padre pertenezca al usuario
          association: "comida",
          where: { id_usuario },
        },
        {
          association: "alimento",
        },
      ],
      order: [["fecha_creacion", "DESC"]],
    });

    return res.status(200).json(comidas_alimentos);
  } catch (error: unknown) {
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
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "No se encontró información de usuario." });
    }
    const id_usuario = req.usuario.id;

    const { id_comida_alimento } = req.params;

    // Buscamos el registro verificando que la comida asociada sea del usuario
    const comida_alimento = await ComidaAlimento.findOne({
      where: {
        id_comida_alimento: Number(id_comida_alimento),
      },
      include: [
        {
          association: "comida",
          where: { id_usuario }, // Candado de seguridad
        },
      ],
    });

    if (!comida_alimento) {
      return res.status(404).json({
        message: "Registro de comida_alimento no encontrado o no autorizado.",
      });
    }

    await comida_alimento.destroy();

    return res.status(204).json({
      message: `La comida_alimento con ID ${id_comida_alimento} ha sido eliminada con éxito`,
    });
  } catch (error: unknown) {
    console.error("[DELETE_COMIDA_ALIMENTO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
