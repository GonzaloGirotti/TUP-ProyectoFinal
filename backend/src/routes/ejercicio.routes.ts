import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createEjercicioSchema } from "../schemas/ejercicio.schema";
import {
  createEjercicioHandler,
  getEjerciciosHoyHandler,
  deleteEjercicioHandler,
} from "../controllers/ejercicio.controller";

const router = Router();

// Todas las rutas requieren token
router.use(authMiddleware);

// Crear un ejercicio
router.post("/", validate(createEjercicioSchema), createEjercicioHandler);

// Obtener los de hoy
router.get("/", getEjerciciosHoyHandler);

// Eliminar
router.delete("/:id", deleteEjercicioHandler);

export default router;