import { Router } from "express";
import {
  createAlimentoHandler,
  getAlimentosHandler,
  deleteAlimentoHandler,
} from "../controllers/alimento.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createAlimentoSchema } from "../schemas/alimento.schema";

const router = Router();
/**
 * @route POST /api/v1/alimentos
 * @desc Crear un nuevo alimento
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createAlimentoSchema), // 2. (Validador) ¿Tus datos son válidos?
  createAlimentoHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/alimentos
 @desc Obtener todos los registros de alimentos
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getAlimentosHandler, // (Controlador) Obtener todos los alimentos
);

/**
 * @route DELETE /api/v1/alimentos/:id
 * @desc Eliminar un registro de alimento específico
 * @access Private (requiere token)
 */
// Usamos :id_alimento para que coincida con el nombre en la BD
router.delete(
  "/:id_alimento",
  authMiddleware, // (Guardia) Estás logueado?
  deleteAlimentoHandler, // (Controlador) Borrar el alimento
);
export default router;
