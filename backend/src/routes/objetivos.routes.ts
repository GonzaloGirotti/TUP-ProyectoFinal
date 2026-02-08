import { Router } from "express";
import {
  create,
  getObjetivosHandler,
  deleteObjetivoHandler,
  createObjetivosHandler,
  updateObjetivoHandler,
} from "../controllers/objetivos.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createObjetivosSchema, updateObjetivosSchema } from "../schemas/objetivos.schema";

const router = Router();
/**
 * @route POST /api/v1/objetivos
 * @desc Crear un nuevo objetivo
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createObjetivosSchema), // 2. (Validador) ¿Tus datos son válidos?
  createObjetivosHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/objetivos
 @desc Obtener todos los registros de objetivos
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getObjetivosHandler, // (Controlador) Obtener todos los objetivos
);

/**
 * @route DELETE /api/v1/objetivos/:id
 * @desc Eliminar un registro de objetivo específico
 * @access Private (requiere token)
 */
// Usamos :id_objetivo para que coincida con el nombre en la BD
router.delete(
  "/:id_objetivo",
  authMiddleware, // (Guardia) Estás logueado?
  deleteObjetivoHandler, // (Controlador) Borrar el objetivo
);
export default router;

/**
 * @route PUT /api/v1/objetivos/:id_objetivo
 * @desc Actualizar un registro de objetivo específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_objetivo",
  authMiddleware,
  validate(updateObjetivosSchema), // Usar schema de actualización
  updateObjetivoHandler, // Usar handler correcto
);

export default router;