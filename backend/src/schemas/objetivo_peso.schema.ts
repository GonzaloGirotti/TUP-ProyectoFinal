import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createObjetivoPesoSchema = z.object({
  body: z.object({
    id_usuario: z
      .number()
      .int()
      .positive("El ID de usuario debe ser un número positivo"),
    fecha_objetivo: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "La fecha objetivo debe ser una fecha válida",
      }),
    peso_kg: z
      .number()
      .positive("El peso objetivo debe ser un número positivo"),
  }),
});

export const updateObjetivoPesoSchema = z.object({
  fecha_objetivo: z.date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "La fecha objetivo debe ser una fecha válida",
    })
    .optional(),
  peso_kg: z.number().positive().optional(),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateObjetivoPesoInput = z.infer<
  typeof createObjetivoPesoSchema
>["body"];
export type UpdateObjetivoPesoInput = z.infer<typeof updateObjetivoPesoSchema>;