import { Router } from "express";
import {
  createPesoHandler,
  getPesosHandler,
  deletePesoHandler,
  deleteViejosPesosHandler,
} from "../controllers/peso.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createPesoSchema } from "../schemas/peso.schema";
import Peso from "../models/peso.model";
import { Op } from "sequelize/types/operators";

const router = Router();
/**
 * @route POST /api/v1/pesos
 * @desc Crear un nuevo registro de peso para el usuario logueado
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createPesoSchema), // 2. (Validador) ¿Tus datos son válidos?
  createPesoHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/pesos
 @desc Obtener todos los registros de peso del usuario logueado
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getPesosHandler, // (Controlador) Obtener todos los pesos
);

/**
 * @route DELETE /api/v1/pesos/viejos
 * @desc Eliminar todos los registros de peso excepto el más reciente del usuario logueado
 * @access Private (requiere token)
 */
router.delete(
  "/viejos",
  authMiddleware, // (Guardia) Estás logueado?
  deleteViejosPesosHandler, // (Controlador) Eliminar los pesos viejos
);

/**
 * @route DELETE /api/v1/pesos/:id
 * @desc Eliminar un registro de peso específico
 * @access Private (requiere token)
 */
// Usamos :id_peso para que coincida con el nombre en la BD
router.delete(
  "/:id_peso",
  authMiddleware, // (Guardia) Estás logueado?
  deletePesoHandler, // (Controlador) Borrar el peso
);

/**
 * @route PUT /api/v1/pesos/:id_peso
 * @desc Actualizar un registro de peso específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_peso",
  authMiddleware, // (Guardia) Estás logueado?
  validate(createPesoSchema), // (Validador) ¿Tus datos son válidos?
  createPesoHandler, // (Controlador) Actualizar el peso
);

export default router;

