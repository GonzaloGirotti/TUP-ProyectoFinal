import { z } from "zod";

// Esquema para el registro de un nuevo usuario
export const registerSchema = z.object({
  body: z.object({
    nombre_usuario: z.string().min(1, "El nombre de usuario es requerido"),

    email: z
      .string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido"),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    // Campos opcionales
    fecha_nacimiento: z.string().datetime().optional().or(z.literal("")), // Acepta string de fecha o vacío
    genero: z.string().optional(),
    altura: z
      .number()
      .positive("La altura debe ser un número positivo")
      .optional(),
  }),
});

// Esquema para el inicio de sesión
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido"),

    password: z.string().min(1, "La contraseña es requerida"),
  }),
});

// Tipo para inferir del schema de registro
export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
