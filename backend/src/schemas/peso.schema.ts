import { z } from "zod";

// Esquema para la creación de un nuevo registro de peso
export const createPesoSchema = z.object({
  body: z.object({
    // El constructor z.number() debe ir VACÍO.
    // Zod manejará el error de tipo automáticamente.
    peso_kg: z.number().positive("El peso debe ser un número positivo"), // .positive() ya implica que es requerido y > 0

    // Coerción de fecha: acepta strings y los convierte a Date.
    // Zod dará un error de tipo por defecto si la coerción falla.
    fecha: z.coerce.date().optional(), // Sigue siendo opcional
    // El comentario también es opcional
    comentario: z.string().optional(),
  }),
});

// Schema para actualización (todos los campos opcionales)
export const updatePesoSchema = z.object({
  peso_kg: z.number().positive().optional(),
  fecha: z.coerce.date().optional(),
  comentario: z.string().max(500).optional().nullable(),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreatePesoInput = z.infer<typeof createPesoSchema>["body"];

export type UpdatePesoInput = z.infer<typeof updatePesoSchema>;
