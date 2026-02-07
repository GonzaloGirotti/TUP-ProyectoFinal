import { Router } from "express";
import {
  getObjetivoCaloricoHandler,
  deleteObjetivoCaloricoHandler,
  createObjetivoCaloricoHandler,
  updateObjetivoCaloricoHandler,
} from "../controllers/objetivo_calorico.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createObjetivoCaloricoSchema } from "../schemas/objetivo_calorico.schema";

const router = Router();
/**
 * @route POST /api/v1/objetivoCalorico
 * @desc Crear un nuevo objetivo calorico
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createObjetivoCaloricoSchema), // 2. (Validador) ¿Tus datos son válidos?
  createObjetivoCaloricoHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/objetivoCalorico
  @desc Obtener todos los registros de objetivos caloricos
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getObjetivoCaloricoHandler, // (Controlador) Obtener todos los objetivos caloricos
);

/**
 * @route DELETE /api/v1/objetivoCalorico/:id_objetivoCalorico
 * @desc Eliminar un registro de objetivo calorico específico
 * @access Private (requiere token)
 */
// Usamos :id_objetivoCalorico para que coincida con el nombre en la BD
router.delete(
  "/:id_objetivoCalorico",
  authMiddleware, // (Guardia) Estás logueado?
  deleteObjetivoCaloricoHandler, // (Controlador) Borrar el objetivo calorico
);
export default router;

/**
 * @route PUT /api/v1/objetivoCalorico/:id_objetivoCalorico
 * @desc Actualizar un registro de objetivo calorico específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_objetivoCalorico",
  authMiddleware, // (Guardia) Estás logueado?
  validate(createObjetivoCaloricoSchema), // (Validador) ¿Tus datos son válidos?
  updateObjetivoCaloricoHandler, // (Controlador) Actualizar el objetivo calorico
);
