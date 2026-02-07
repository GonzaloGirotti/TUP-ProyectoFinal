import { z } from "zod";

// Esquema para el registro de un nuevo usuario
export const registerSchema = z.object({
  body: z.object({
    nombre_usuario: z.string().min(1, "El nombre de usuario es requerido"),
    nombre: z.string().min(1).optional(),
    apellido: z.string().min(1).optional(),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido"),
    urlAvatar: z.string().optional(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    // Campos opcionales
    fecha_nacimiento: z.string().datetime().optional().or(z.literal("")), // Acepta string de fecha o vacío
    genero: z.string().optional(),
    altura: z.number().optional(),
    nivel_actividad: z.string().optional(),
    tipo_objetivo: z.string().optional(),
  }),
});

export const settingsSchema = z.object({
  body: z.object({
    nombre_usuario: z.string().optional(),
    nombre: z.string().min(1).optional(),
    apellido: z.string().min(1).optional(),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido"),
    urlAvatar: z.string().optional(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .optional()
      .or(z.literal("")),
    fecha_nacimiento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD")
      .optional()
      .or(z.literal("")),
    genero: z.string().optional(),
    altura: z.number().optional(),
    nivel_actividad: z.string().optional(),
    tipo_objetivo: z.string().optional(),
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
export type SettingsInput = z.infer<typeof settingsSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
