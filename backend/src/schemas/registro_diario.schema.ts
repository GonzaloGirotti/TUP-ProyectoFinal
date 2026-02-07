import { z } from "zod";

// Esuel esquema para crear un nuevo registro diario
export const createRegistroDiarioSchema = z.object({
  body: z.object(
    {
    id_usuario: z
      .number()
      .int()
      .positive("El ID de usuario debe ser un número positivo"),
  
  
  }),   


});

// Tipo para inferir del schema (lo usaremos en el controlador)
export type CreateRegistroDiarioInput = z.infer<
  typeof createRegistroDiarioSchema
>["body"];
