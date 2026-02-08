import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createRegistroPesoSchema = z.object({
  body: z.object({
    id_usuario: z
      .number()
      .int()
      .positive("El ID de usuario debe ser un número positivo"),
    //Fecha date
    fecha: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "La fecha debe ser una fecha válida",
      }),
    peso_kg: z
      .number()
      .positive("El peso registrado debe ser un número positivo"),
  }),
});

export const updateRegistroPesoSchema = z.object({
  fecha: z.date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "La fecha debe ser una fecha válida",
    })
    .optional(),
  peso_kg: z.number().positive().optional(),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateRegistroPesoInput = z.infer<
  typeof createRegistroPesoSchema
>["body"];
export type UpdateRegistroPesoInput = z.infer<typeof updateRegistroPesoSchema>;