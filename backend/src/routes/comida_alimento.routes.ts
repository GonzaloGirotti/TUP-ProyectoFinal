import { Router } from "express";
import {
  createComidaAlimentoHandler,
  getComidasAlimentosHandler,
  deleteComidaAlimentoHandler,
} from "../controllers/comida_alimento.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createComidaAlimentoSchema } from "../schemas/comida_alimento.schema";

const router = Router();
/**
 * @route POST /api/v1/comidalimento
 * @desc Crear un nueva comida_alimento
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createComidaAlimentoSchema), // 2. (Validador) ¿Tus datos son válidos?
  createComidaAlimentoHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/comidalimento
 @desc Obtener todos los registros de comida_alimento
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getComidasAlimentosHandler, // (Controlador) Obtener todos los alimentos
);

/**
 * @route DELETE /api/v1/comidalimento/:id
 * @desc Eliminar un registro de comida_alimento específico
 * @access Private (requiere token)
 */
// Usamos :id_comida_alimento para que coincida con el nombre en la BD
router.delete(
  "/:id_comida_alimento",
  authMiddleware, // (Guardia) Estás logueado?
  deleteComidaAlimentoHandler, // (Controlador) Borrar el alimento
);
export default router;
