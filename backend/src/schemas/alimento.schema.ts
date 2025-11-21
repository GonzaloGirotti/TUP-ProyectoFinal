import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createAlimentoSchema = z.object({
  body: z.object({
    nombre: z.string().min(3, "El nombre del alimento es requerido"),

    //     El constructor z.number() debe ir VACÍO.
    //     Zod manejará el error de tipo automáticamente.
    //     .positive() ya implica que es requerido y > 0
    carbohidratos: z
      .number()
      .positive("Los carbohidratos deben ser un número positivo"),
    proteinas: z
      .number()
      .positive("Las proteinas deben ser un número positivo"),
    grasas: z.number().positive("Las grasas deben ser un número positivo"),
    calorias: z.number().positive("Las calorias deben ser un número positivo"),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateAlimentoInput = z.infer<typeof createAlimentoSchema>["body"];
