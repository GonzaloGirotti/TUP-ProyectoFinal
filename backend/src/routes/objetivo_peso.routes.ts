import { Router } from "express";
import {
  getObjetivoPesoHandler,
  deleteObjetivoPesoHandler,
  createObjetivoPesoHandler,
  updateObjetivoPesoHandler,
} from "../controllers/objetivo_peso.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createObjetivoPesoSchema } from "../schemas/objetivo_peso.schema";

const router = Router();
/**
 * @route POST /api/v1/objetivoPeso
 * @desc Crear un nuevo objetivo peso
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createObjetivoPesoSchema), // 2. (Validador) ¿Tus datos son válidos?
  createObjetivoPesoHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/objetivoPeso
  @desc Obtener todos los registros de objetivos peso
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getObjetivoPesoHandler, // (Controlador) Obtener todos los objetivos peso
);

/**
 * @route DELETE /api/v1/objetivoPeso/:id_objetivoPeso
 * @desc Eliminar un registro de objetivo peso específico
 * @access Private (requiere token)
 */
// Usamos :id_objetivoPeso para que coincida con el nombre en la BD
router.delete(
  "/:id_objetivoPeso",
  authMiddleware, // (Guardia) Estás logueado?
  deleteObjetivoPesoHandler, // (Controlador) Borrar el objetivo peso
);
export default router;

/**
 * @route PUT /api/v1/objetivoPeso/:id_objetivoPeso
 * @desc Actualizar un registro de objetivo peso específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_objetivoPeso",
  authMiddleware, // (Guardia) Estás logueado?
  validate(createObjetivoPesoSchema), // (Validador) ¿Tus datos son válidos?
  updateObjetivoPesoHandler, // (Controlador) Actualizar el objetivo peso
);
