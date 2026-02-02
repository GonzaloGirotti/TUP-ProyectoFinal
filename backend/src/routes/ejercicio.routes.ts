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

router.use(authMiddleware);

router.post("/", validate(createEjercicioSchema), createEjercicioHandler);
router.get("/", getEjerciciosHoyHandler);
router.delete("/:id", deleteEjercicioHandler);

export default router;
