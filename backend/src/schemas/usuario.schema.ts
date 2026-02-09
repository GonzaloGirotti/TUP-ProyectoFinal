import { z } from "zod";


const fechaNacimientoSchema = z.preprocess(
  (val) => {
    if (!val || val === "") return undefined;
    if (val instanceof Date) return val;
    if (typeof val === 'string') return new Date(val);
    return undefined;
  },
  z.date()
    .max(new Date(), { message: "La fecha no puede ser futura" })
    .min(new Date('1900-01-01'), { message: "Fecha demasiado antigua" })
    .optional()
);


// Esquema para el registro de un nuevo usuario
export const registerSchema = z.object({
  body: z.object({
    nombre: z.string()
      .min(1, "El nombre es requerido")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),

      apellido: z.string()
      .min(1, "El apellido es requerido")
      .max(50, "El apellido no puede exceder 50 caracteres"),

    email: z.string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido")
      .max(100, "El email no puede exceder 100 caracteres")
      .toLowerCase(), // Normalizar a minúsculas

    password: z.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),

    fecha_nacimiento: fechaNacimientoSchema,

    genero: z.enum(["masculino", "femenino", "otro", "prefiero_no_decir"], {
    }).optional(),

    altura: z.number()
      .positive("La altura debe ser un número positivo")
      .min(50, "La altura mínima es 50 cm")
      .max(250, "La altura máxima es 250 cm")
      .optional(),
  

  nivel_actividad: z.enum(["sedentario", "ligero", "moderado", "intenso"], {
  }).optional(),

  tipo_objetivo: z.enum(["perder_peso", "mantener_peso", "ganar_musculo"], {
  }).optional(),
  }).strict() // No permite campos extraños

});


// Esquema para actualizar perfil de usuario (sin password")



export const updateUsuarioSchema = z.object({
  body: z.object({
    nombre: z.string()
      .min(1, "El nombre de usuario es requerido")
      .max(50, "El nombre de usuario no puede exceder 50 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos")
      .optional(),

      apellido: z.string()
      .min(1, "El apellido es requerido")
      .max(50, "El apellido no puede exceder 50 caracteres")
      .optional(),

    email: z.string()
      .email("El formato del email no es válido")
      .max(100, "El email no puede exceder 100 caracteres")
      .toLowerCase()
      .optional(),

    fecha_nacimiento: fechaNacimientoSchema,

    genero: z.enum(["masculino", "femenino", "otro", "prefiero_no_decir"] as const).optional(),

    altura: z.number()
      .positive("La altura debe ser un número positivo")
      .min(50, "La altura mínima es 50 cm")
      .max(250, "La altura máxima es 250 cm")
      .optional(),

    nivel_actividad: z.enum(["sedentario", "ligero", "moderado", "intenso"] as const).optional(),

    tipo_objetivo: z.enum(["perder_peso", "mantener_peso", "ganar_musculo"] as const).optional(),

  }).strict() // No permite campos extraños
});

// Esquema para cambio de contraseña
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string()
      .min(1, "La contraseña actual es requerida"),

    newPassword: z.string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),
    
    confirmPassword: z.string()
      .min(1, "La confirmación de contraseña es requerida"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }).refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  }),
});

// Esquema para reset de contraseña (olvidé mi contraseña)
export const resetPasswordRequestSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido")
      .toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string()
      .min(1, "El token es requerido"),
    
    newPassword: z.string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),
    
    confirmPassword: z.string()
      .min(1, "La confirmación de contraseña es requerida"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }),
});

// Tipos para inferir
export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];