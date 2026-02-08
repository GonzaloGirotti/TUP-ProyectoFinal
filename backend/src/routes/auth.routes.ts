import { Router } from "express";
import { 
  registerHandler, 
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
  verifyEmailHandler,
  resendVerificationHandler
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { 
  registerSchema
} from "../schemas/usuario.schema";
import { 
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  verifyEmailSchema,
  resendVerificationSchema
} from "../schemas/auth.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Rutas públicas de autenticación
router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);
router.post("/refresh-token", validate(refreshTokenSchema), refreshTokenHandler);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmailHandler);
router.post("/resend-verification", validate(resendVerificationSchema), resendVerificationHandler);

// Ruta protegida de autenticación
router.post("/logout", authMiddleware, validate(logoutSchema), logoutHandler);

export default router;