import { z } from "zod";

// Esquema para la creación de un nuevo registro de comida
export const createComidaSchema = z.object({
  body: z.object({
    // Coerción de fecha: acepta strings y los convierte a Date.
    // Zod dará un error de tipo por defecto si la coerción falla.
    fecha: z.coerce.date(),
    nombre_comida: z.string(),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateComidaInput = z.infer<typeof createComidaSchema>["body"];
