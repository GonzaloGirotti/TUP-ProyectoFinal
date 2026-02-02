import { z } from "zod";

export const createEjercicioSchema = z.object({
  body: z.object({
    // Validamos 'tipo'
    tipo: z
      .string()
      .min(1, "El tipo de ejercicio es requerido (ej: Correr, Pesas)"),

    calorias_quemadas: z.number().min(1, "Las calorías deben ser mayor a 0"),

    duracion_minutos: z.number().optional(),

    fecha: z.string().datetime().optional().or(z.date().optional()),
  }),
});

export type CreateEjercicioInput = z.infer<
  typeof createEjercicioSchema
>["body"];
