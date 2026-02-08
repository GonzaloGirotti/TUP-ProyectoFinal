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
 * @route POST /api/v1/alimentos_consumidos
 * @desc Crear un nuevo alimento
 * @access Private (requiere token)
 */
router.post("/", authMiddleware, validate(createAlimentoConsumidoSchema), createAlimentoConsumidoHandler);
/**
 @route GET /api/v1/alimentos_consumidos
 @desc Obtener todos los registros de alimentos consumidos
 @access Private (requiere token)
*/
router.get("/", authMiddleware, getAlimentosConsumidosHandler);

/**
 * @route DELETE /api/v1/alimentos_consumidos/:id_alimento_consumido
 * @desc Eliminar un registro de alimento específico
 * @access Private (requiere token)
 */

router.delete("/:id_alimento_consumido", authMiddleware, deleteAlimentoConsumidoHandler);

/**
 * @route PUT /api/v1/alimentos_consumidos/:id_alimento_consumido
 * @desc Actualizar un registro de alimento específico
 * @access Private (requiere token)
 */
router.put("/:id_alimento_consumido", authMiddleware, validate(createAlimentoConsumidoSchema), updateAlimentoConsumidoHandler);

export default router;