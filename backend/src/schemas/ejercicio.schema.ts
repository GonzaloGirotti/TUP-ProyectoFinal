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

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateEjercicioInput = z.infer<
  typeof createEjercicioSchema
>["body"];
