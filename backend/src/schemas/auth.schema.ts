import { z } from "zod";

// Esquema para el inicio de sesión
export const loginSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido")
      .max(100, "El email no puede exceder 100 caracteres")
      .toLowerCase()
      .transform((email) => email.trim()), // Limpiar espacios

    password: z.string()
      .min(1, "La contraseña es requerida")
      .max(100, "La contraseña no puede exceder 100 caracteres"),
  }),
});

// Esquema para refresh token
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string()
      .min(1, "El refresh token es requerido"),
  }),
});

// Esquema para logout (podría necesitar token)
export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string()
      .min(1, "El refresh token es requerido")
      .optional(), // Opcional si usas blacklist de tokens
  }),
});

// Esquema para verificación de email
export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string()
      .min(1, "El token de verificación es requerido"),
  }),
});

// Esquema para reenvío de verificación de email
export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, "El email es requerido")
      .email("El formato del email no es válido")
      .toLowerCase(),
  }),
});

// Tipos para inferir
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
export type LogoutInput = z.infer<typeof logoutSchema>["body"];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["body"];
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>["body"];