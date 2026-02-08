import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createAguaSchema } from "../schemas/agua.schema";
import {
  createAguaHandler,
  getAguaHoyHandler,
  deleteAguaHandler,
} from "../controllers/agua.controller";


const router = Router();

//TODO Algunas rutas podrían simplificarse usando router.use(authMiddleware)
// Todas las rutas requieren estar logueado
router.use(authMiddleware);

router.post("/", validate(createAguaSchema), createAguaHandler); // Agregar
router.get("/", getAguaHoyHandler); // Ver total de hoy
router.delete("/:id_agua", deleteAguaHandler); // Borrar un registro específico

export default router;
