import { Router } from "express";
import {
  getEjercicioHandler,
  deleteEjercicioHandler,
  createEjercicioHandler,
  updateEjercicioHandler,
} from "../controllers/ejercicio.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createEjercicioSchema } from "../schemas/ejercicio.schema";

const router = Router();
/**
 * @route POST /api/v1/ejercicio
 * @desc Crear un nuevo ejercicio
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createEjercicioSchema), // 2. (Validador) ¿Tus datos son válidos?
  createEjercicioHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/ejercicios
  @desc Obtener todos los ejercicios
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getEjercicioHandler, // (Controlador) Obtener todos los ejercicios
);

/**
 * @route DELETE /api/v1/ejercicios/:id_ejercicio
 * @desc Eliminar un Registro de Registro diario específico
 * @access Private (requiere token)
 */
// Usamos :id_ejercicio para que coincida con el nombre en la BD
router.delete(
  "/:id_ejercicio",
  authMiddleware, // (Guardia) Estás logueado?
  deleteEjercicioHandler, // (Controlador) Borrar el Registro peso
);
export default router;

/**
 * @route PUT /api/v1/ejercicios/:id_ejercicio
 * @desc Actualizar un Registro de Registro diario específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_ejercicio",
  authMiddleware, // (Guardia) Estás logueado?
  validate(createEjercicioSchema), // (Validador) ¿Tus datos son válidos?
  updateEjercicioHandler, // (Controlador) Actualizar el Registro diario
);
