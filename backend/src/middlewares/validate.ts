import { Request, Response, NextFunction } from "express";
// Importa ZodError para el chequeo de tipo
import { z, ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate =
  (schema: z.ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Parsear y validar el request
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        // Si es válido, continuar
        return next();
      } catch (error: unknown) {
        // Usamos 'unknown'
        // Si falla la validación, devolver un error 400

        // Chequeo de tipo para ZodError
        if (error instanceof ZodError) {
          const errors = error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          }));
          return res.status(400).json({ status: "error", errors });
        }

        // Manejar otros errores inesperados

        // eslint-disable-next-line no-console
        console.error("Validation middleware error:", error);
        return res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    };