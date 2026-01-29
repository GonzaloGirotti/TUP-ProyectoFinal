import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createObjetivosSchema = z.object({
  body: z.object({
    id_usuario: z
      .number()
      .int()
      .positive("El ID de usuario debe ser un número positivo"),
    calorias: z.number(),
    proteinas_proporcion: z.number(),
    carbohidratos_proporcion: z.number(),
    grasas_proporcion: z.number(),
    peso_deseado: z.number(),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateObjetivosInput = z.infer<
  typeof createObjetivosSchema
>["body"];
