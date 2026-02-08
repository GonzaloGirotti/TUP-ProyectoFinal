import { Router } from "express";
import { 
  getProfileHandler,
  updateProfileHandler,
  changePasswordHandler,
  resetPasswordRequestHandler,
  resetPasswordHandler} from "../controllers/usuario.controller";
import { validate } from "../middlewares/validate";
import { 
  updateUsuarioSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema
} from "../schemas/usuario.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a TODAS las rutas
router.use(authMiddleware);

// Rutas protegidas de gestión de usuario
router.get("/profile", getProfileHandler);
router.put("/profile", validate(updateUsuarioSchema), updateProfileHandler);
router.put("/change-password", validate(changePasswordSchema), changePasswordHandler);
//router.delete("/account", deleteAccountHandler); TODO implementar esta ruta para eliminar cuenta (opcional, no es un requisito)

// Rutas públicas de usuario (reset password)
router.post("/reset-password-request", validate(resetPasswordRequestSchema), resetPasswordRequestHandler);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordHandler);

export default router;