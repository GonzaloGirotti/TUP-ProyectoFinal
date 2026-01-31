import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createObjetivoCaloricoSchema = z.object({
  body: z.object({
    id_usuario: z
      .number()
      .int()
      .positive("El ID de usuario debe ser un número positivo"),
    calorias_diarias: z
      .number()
      .positive("Las calorías diarias deben ser un número positivo"),
    proteinas_diarias: z
      .number()
      .positive("Las proteínas diarias deben ser un número positivo"),
    grasas_diarias: z
      .number()
      .positive("Las grasas diarias deben ser un número positivo"),
    carbohidratos_diarios: z
      .number()
      .positive("Los carbohidratos diarios deben ser un número positivo"),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateObjetivosInput = z.infer<
  typeof createObjetivoCaloricoSchema
>["body"];
