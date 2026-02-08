import { z } from "zod";

// Esuel esquema para crear un nuevo registro diario
export const createRegistroDiarioSchema = z.object({
  body: z.object({
    id_usuario: z.number().int().positive("El ID de usuario debe ser un número positivo"),
  }),
});

export const updateRegistroDiarioSchema = z.object({
  // El registro diario probablemente solo tenga id_usuario
  // Pero se podrías querer actualizar la fecha u otros campos
  id_usuario: z.number().int().positive().optional(),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateRegistroDiarioInput = z.infer<
  typeof createRegistroDiarioSchema
>["body"];
export type UpdateRegistroDiarioInput = z.infer<typeof updateRegistroDiarioSchema>;