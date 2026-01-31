import { z } from "zod";

// Esquema para la carga de un nuevo alimento
export const createRegistroDiarioSchema = z.object({
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
    agua_total_litros: z
      .number()
      .nonnegative("El agua total debe ser un número no negativo"),
  }),
});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateRegistroDiarioInput = z.infer<
  typeof createRegistroDiarioSchema
>["body"];
