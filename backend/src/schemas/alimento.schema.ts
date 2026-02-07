import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createAlimentoSchema = z.object({
  body: z.object({
    nombre: z.string().min(3, "El nombre del alimento es requerido"),

    //     El constructor z.number() debe ir VACÍO.
    //     Zod manejará el error de tipo automáticamente.
    //     .nonnegative() permite 0 o valores positivos
    carbohidratos: z
      .number()
      .nonnegative("Los carbohidratos deben ser un número no negativo"),
    proteinas: z
      .number()
      .nonnegative("Las proteinas deben ser un número no negativo"),
    grasas: z.number().nonnegative("Las grasas deben ser un número no negativo"),
    calorias: z.number().nonnegative("Las calorias deben ser un número no negativo"),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateAlimentoInput = z.infer<typeof createAlimentoSchema>["body"];
