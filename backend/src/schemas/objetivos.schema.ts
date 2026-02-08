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

export const updateObjetivosSchema = z.object({
  calorias: z.number().positive().optional(),
  proteinas_proporcion: z.number().min(0).max(100).optional(),
  carbohidratos_proporcion: z.number().min(0).max(100).optional(),
  grasas_proporcion: z.number().min(0).max(100).optional(),
  peso_deseado: z.number().positive().optional(),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateObjetivosInput = z.infer<
  typeof createObjetivosSchema
>["body"];

export type UpdateObjetivosInput = z.infer<typeof updateObjetivosSchema>;