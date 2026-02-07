import { z } from "zod";

export const createEjercicioSchema = z.object({
  body: z.object({
    // Eliminamos id_registro_diario para simplificar la relación
    tipo: z.string().min(1, "El tipo de ejercicio es requerido"),

    calorias_quemadas: z
      .number()
      .min(1, "Las calorías deben ser mayor a 0"),

    duracion_minutos: z.number().optional(),

    fecha: z.string().datetime().optional().or(z.date().optional()),
  }),
});

export type CreateEjercicioInput = z.infer<typeof createEjercicioSchema>["body"];