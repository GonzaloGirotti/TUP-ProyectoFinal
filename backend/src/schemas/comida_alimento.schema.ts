import { z } from "zod";

// Esquema para la creación de un nuevo registro de comida_alimento
export const createComidaAlimentoSchema = z.object({
  body: z.object({
    // El constructor z.number() debe ir VACÍO.
    // Zod manejará el error de tipo automáticamente.
    id_comida: z
      .number()
      .int()
      .positive("El ID de comida debe ser un número entero positivo"),
    id_alimento: z
      .number()
      .int()
      .positive("El ID de alimento debe ser un número entero positivo"),
    cantidad_gramos: z
      .number()
      .positive("Los gramos deben ser un número positivo"),
    carbohidratos_total: z.number().optional(),
    grasas_total: z.number().optional(),
    proteinas_total: z.number().optional(),
    calorias_total: z.number().optional(),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateComidaAlimentoInput = z.infer<
  typeof createComidaAlimentoSchema
>["body"];
