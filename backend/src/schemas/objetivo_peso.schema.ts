import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createObjetivoPesoSchema = z.object({
  body: z.object({
    id_usuario: z
      .number()
      .int()
      .positive("El ID de usuario debe ser un número positivo"),
    fecha: z.coerce.date().optional(),
    peso_kg: z
      .number()
      .positive("El peso objetivo debe ser un número positivo"),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateObjetivoPesoInput = z.infer<
  typeof createObjetivoPesoSchema
>["body"];
