import { Router } from "express";
import {
  createComidaHandler,
  getComidasHandler,
  deleteComidaHandler,
} from "../controllers/comida.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createComidaSchema } from "../schemas/comida.schema";

const router = Router();
/**
 * @route POST /api/v1/comidas
 * @desc Crear un nuevo registro de comida para el usuario logueado
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createComidaSchema), // 2. (Validador) ¿Tus datos son válidos?
  createComidaHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/comidas
 @desc Obtener todos los registros de comida del usuario logueado
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getComidasHandler, // (Controlador) Obtener todos las comidas
);

/**
 * @route DELETE /api/v1/comidas/:id
 * @desc Eliminar un registro de comida específico
 * @access Private (requiere token)
 */
// Usamos :id_comida para que coincida con el nombre en la BD
router.delete(
  "/:id_comida",
  authMiddleware, // (Guardia) Estás logueado?
  deleteComidaHandler, // (Controlador) Borrar la comida
);
export default router;
