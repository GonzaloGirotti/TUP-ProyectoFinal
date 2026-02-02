import { z } from "zod";

export const createAguaSchema = z.object({
  body: z.object({
    cantidad_ml: z
      .number()
      .min(1, "La cantidad en ml es requerida y debe ser mayor a 0"), // Usamos .min(1) para validar que sea positivo y exista valor numérico

    // Fecha opcional (si no se envía, usa la actual)
    // Aceptamos string ISO o objeto Date
    fecha: z.string().datetime().optional().or(z.date().optional()),
  }),
});

export type CreateAguaInput = z.infer<typeof createAguaSchema>["body"];
