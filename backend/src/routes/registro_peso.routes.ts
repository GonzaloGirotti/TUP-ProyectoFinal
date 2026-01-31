import { Router } from "express";
import {
  getRegistroPesoHandler,
  deleteRegistroPesoHandler,
  createRegistroPesoHandler,
  updateRegistroPesoHandler,
} from "../controllers/registro_peso.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createRegistroPesoSchema } from "../schemas/registro_peso.schema";

const router = Router();
/**
 * @route POST /api/v1/registroPeso
 * @desc Crear un nuevo Registro peso
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createRegistroPesoSchema), // 2. (Validador) ¿Tus datos son válidos?
  createRegistroPesoHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);
/**
 @route GET /api/v1/registroPeso
  @desc Obtener todos los Registros de Registros peso
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getRegistroPesoHandler, // (Controlador) Obtener todos los Registros peso
);

/**
 * @route DELETE /api/v1/registroPeso/:id_registroPeso
 * @desc Eliminar un Registro de Registro peso específico
 * @access Private (requiere token)
 */
// Usamos :id_registroPeso para que coincida con el nombre en la BD
router.delete(
  "/:id_registroPeso",
  authMiddleware, // (Guardia) Estás logueado?
  deleteRegistroPesoHandler, // (Controlador) Borrar el Registro peso
);
export default router;

/**
 * @route PUT /api/v1/registroPeso/:id_registroPeso
 * @desc Actualizar un Registro de Registro peso específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_registroPeso",
  authMiddleware, // (Guardia) Estás logueado?
  validate(createRegistroPesoSchema), // (Validador) ¿Tus datos son válidos?
  updateRegistroPesoHandler, // (Controlador) Actualizar el Registro peso
);
