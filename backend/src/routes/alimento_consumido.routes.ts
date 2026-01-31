import { Router } from "express";
import {
  createAlimentoConsumidoHandler,
  getAlimentosConsumidosHandler,
  deleteAlimentoConsumidoHandler,
  updateAlimentoConsumidoHandler,
} from "../controllers/alimento_consumido.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createAlimentoConsumidoSchema } from "../schemas/alimento_consumido.schema";

const router = Router();
/**
 * @route POST /api/v1/alimentos
 * @desc Crear un nuevo alimento
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createAlimentoConsumidoSchema), // 2. (Validador) ¿Tus datos son válidos?
  createAlimentoConsumidoHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/alimentos
 @desc Obtener todos los registros de alimentos
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getAlimentosConsumidosHandler, // (Controlador) Obtener todos los alimentos
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
  deleteAlimentoConsumidoHandler, // (Controlador) Borrar el alimento
);
export default router;

/**
 * @route PUT /api/v1/alimentos/:id_alimento
 * @desc Actualizar un registro de alimento específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_alimento",
  authMiddleware, // (Guardia) Estás logueado?
  validate(createAlimentoConsumidoSchema), // (Validador) ¿Tus datos son válidos?
  updateAlimentoConsumidoHandler, // (Controlador) Actualizar el alimento
);
