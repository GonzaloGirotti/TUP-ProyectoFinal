import { Request, Response } from "express";
import AlimentoConsumido from "../models/alimento_consumido.model"; // Importamos el modelo Alimento
import { CreateAlimentoConsumidoInput } from "../schemas/alimento_consumido.schema"; // Importamos el tipo de Zod

/*
 Controlador para crear un nuevo alimento.
 Asume que ya pasó por el authMiddleware y el validate middleware.
*/
export const createAlimentoConsumidoHandler = async (
  // Usamos 'unknown' para los genéricos que no usamos y el tipo de Zod para el body
  req: Request<unknown, unknown, CreateAlimentoConsumidoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener los datos del body (ya validados por Zod)
    const { nombre, gramos, calorias, proteinas, grasas, carbohidratos } =
      req.body;

    // 2. Creamos un objeto de creación base
    // Definimos el tipo explícitamente para que TS entienda
    const dataParaCrear: {
      nombre: string;
      gramos: number;
      calorias: number;
      proteinas: number;
      grasas: number;
      carbohidratos: number;
    } = {
      nombre,
      gramos,
      calorias,
      proteinas,
      grasas,
      carbohidratos,
    };

    // 3. Crear el nuevo registro de alimento en la BD
    const nuevoAlimento = await AlimentoConsumido.create(dataParaCrear);
    // 4. Enviar respuesta exitosa
    return res.status(201).json(nuevoAlimento);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[ALIMENTO_CONSUMIDO_CONTROLLER]:", error);

    // Manejo seguro del error
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para obtener todos los alimentos consumidos en la BD
export const getAlimentosConsumidosHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Buscar todos los alimentos
    const alimentos = await AlimentoConsumido.findAll({});

    // 3. Enviar respuesta
    return res.status(200).json(alimentos);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[GET_ALIMENTOS_CONSUMIDOS_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para eliminar un alimento
export const deleteAlimentoConsumidoHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del alimento (de los parámetros de la URL)
    const { id_alimento } = req.params;

    // 2. Buscar el registro del alimento
    //    Buscamos un alimento que coincida con el ID

    const alimento = await AlimentoConsumido.findOne({
      where: {
        id_alimento_consumido: Number(id_alimento), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!alimento) {
      return res.status(404).json({ message: "Alimento no encontrado." });
    }

    // 5. Si se encontró, borrarlo
    await alimento.destroy();

    // 6. Enviar respuesta (204 No Content es el estándar para un DELETE exitoso)
    return res.status(204).json({
      message: `El alimento con ID ${id_alimento} ha sido eliminado con éxito`,
    });
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[DELETE_ALIMENTO_CONSUMIDO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};

// Controlador para actualizar un alimento consumido.
export const updateAlimentoConsumidoHandler = async (
  req: Request<{ id_alimento: string }, unknown, CreateAlimentoConsumidoInput>,
  res: Response,
) => {
  try {
    // 1. Obtener el ID del alimento (de los parámetros de la URL)
    const { id_alimento } = req.params;

    // 2. Obtener los datos del body (ya validados por Zod)
    const { nombre, gramos, calorias, proteinas, grasas, carbohidratos } =
      req.body;

    // 3. Buscar el registro del alimento
    const alimento = await AlimentoConsumido.findOne({
      where: {
        id_alimento_consumido: Number(id_alimento), // Convertimos el ID de string a número
      },
    });

    // 4. Si no se encuentra, devolver 404
    if (!alimento) {
      return res.status(404).json({ message: "Alimento no encontrado." });
    }

    // 5. Actualizar los campos del alimento
    alimento.nombre = nombre;
    alimento.gramos = gramos;
    alimento.calorias = calorias;
    alimento.proteinas = proteinas;
    alimento.grasas = grasas;
    alimento.carbohidratos = carbohidratos;

    // 6. Guardar los cambios en la BD
    await alimento.save();

    // 7. Enviar respuesta con el alimento actualizado
    return res.status(200).json(alimento);
  } catch (error: unknown) {
    // Usamos 'unknown' para ESlint

    console.error("[UPDATE_ALIMENTO_CONSUMIDO_HANDLER]:", error);
    let errorMessage = "Error interno del servidor";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
};
