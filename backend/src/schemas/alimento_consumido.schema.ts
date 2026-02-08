import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createAlimentoConsumidoSchema = z.object({
  body: z.object({
    nombre: z.string().min(3, "El nombre del alimento es requerido"),

    //     El constructor z.number() debe ir VACÍO.
    //     Zod manejará el error de tipo automáticamente.
    //     .positive() ya implica que es requerido y > 0
    gramos: z.number().positive("Los gramos deben ser un número positivo"),
    calorias: z.number().positive("Las calorias deben ser un número positivo"),
    proteinas: z
      .number()
      .positive("Las proteinas deben ser un número positivo"),
    grasas: z.number().positive("Las grasas deben ser un número positivo"),
    carbohidratos: z
      .number()
      .positive("Los carbohidratos deben ser un número positivo"),
  }),
});

export const updateAlimentoConsumidoSchema = z.object({
  nombre: z.string().min(3).optional(),
  gramos: z.number().positive().optional(),
  calorias: z.number().positive().optional(),
  proteinas: z.number().positive().optional(),
  grasas: z.number().positive().optional(),
  carbohidratos: z.number().positive().optional(),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateAlimentoConsumidoInput = z.infer<
  typeof createAlimentoConsumidoSchema
>["body"];

export type UpdateAlimentoConsumidoInput = z.infer<typeof updateAlimentoConsumidoSchema>;