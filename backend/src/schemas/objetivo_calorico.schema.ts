import { z } from "zod";

// CORREGIR nombre del schema principal:
export const createObjetivoCaloricoSchema = z.object({  // Cambiar nombre
  body: z.object({
    id_usuario: z.number().int().positive("El ID de usuario debe ser un número positivo"),
    calorias_diarias: z.number().positive("Las calorías diarias deben ser un número positivo"),
    proteinas_diarias: z.number().positive("Las proteínas diarias deben ser un número positivo"),
    grasas_diarias: z.number().positive("Las grasas diarias deben ser un número positivo"),
    carbohidratos_diarios: z.number().positive("Los carbohidratos diarios deben ser un número positivo"),
  }),
});

// Agregar schema de actualización:
export const updateObjetivoCaloricoSchema = z.object({
  calorias_diarias: z.number().positive().optional(),
  proteinas_diarias: z.number().positive().optional(),
  grasas_diarias: z.number().positive().optional(),
  carbohidratos_diarios: z.number().positive().optional(),
});

// Corregir tipo:
export type CreateObjetivoCaloricoInput = z.infer<typeof createObjetivoCaloricoSchema>["body"];
export type UpdateObjetivoCaloricoInput = z.infer<typeof updateObjetivoCaloricoSchema>;
