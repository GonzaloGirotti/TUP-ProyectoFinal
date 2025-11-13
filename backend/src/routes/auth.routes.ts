import { Router } from "express";
import { registerHandler, loginHandler } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../schemas/usuario.schema";

const router = Router();

// Ruta de Registro
// POST /api/v1/auth/register
router.post("/register", validate(registerSchema), registerHandler);

// Ruta de Login
// POST /api/v1/auth/login
router.post("/login", validate(loginSchema), loginHandler);

export default router;
