import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createEjercicioSchema = z.object({
  body: z.object({
    id_registro_diario: z
      .number()
      .int()
      .positive("El ID de registro diario debe ser un número positivo"),
    tipo: z.string().min(3, "El tipo del ejercicio es requerido"),
    duracion_minutos: z
      .number()
      .positive("La duración debe ser un número positivo"),
    calorias_quemadas: z
      .number()
      .positive("Las calorías quemadas deben ser un número positivo"),
  }),
});

export const updateEjercicioSchema = z.object({
  tipo: z.string().min(1).optional(),
  calorias_quemadas: z.number().min(1).optional(),
  duracion_minutos: z.number().optional(),
  fecha: z.string().datetime().optional().or(z.date().optional()),
});

export type CreateEjercicioInput = z.infer<typeof createEjercicioSchema>["body"];
export type UpdateEjercicioInput = z.infer<typeof updateEjercicioSchema>;