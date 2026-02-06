import { Router } from "express";
import {
  getAllRegistroDiariByIdHandler,
  getAllRegistroDiarioByUserBodyHandler,
  deleteRegistroDiarioHandler,
  createRegistroDiarioHandler,
  updateRegistroDiarioHandler,
  getRegistroDiarioHoyByUserIdHandler,
} from "../controllers/registro_diario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createRegistroDiarioSchema } from "../schemas/registro_diario.schema";

const router = Router();
/**
 * @route POST /api/v1/registroDiario
 * @desc Crear un nuevo Registro peso
 * @access Private (requiere token)
 */
router.post(
  "/",
  authMiddleware, // 1. (Guardia) ¿Estás logueado?
  validate(createRegistroDiarioSchema), // 2. (Validador) ¿Tus datos son válidos?
  createRegistroDiarioHandler, // 3. (Controlador) Si todo ok, ejecuta la lógica
);

/**
 @route GET /api/v1/registroDiario
 @desc Obtener todos los Registros diarios para un usuario (desde body)
 @access Private (requiere token)
*/
router.get(
  "/",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getAllRegistroDiarioByUserBodyHandler, // (Controlador) Obtener todos los registros por usuario
);

/**
 @route GET /api/v1/registroDiario/all/:id_usuario
 @desc Obtener todos los Registros diarios para un usuario (desde path param)
 @access Private (requiere token)
*/
router.get(
  "/all/:id_usuario",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getAllRegistroDiariByIdHandler, // (Controlador) Obtener todos los registros por usuario
);

router.get(
  "/:id_usuario",
  authMiddleware, // (Guardia) ¿Estás logueado?
  getRegistroDiarioHoyByUserIdHandler, // (Controlador) Obtener registro de hoy
);

/**
 * @route DELETE /api/v1/registroDiario/:id_registroDiario
 * @desc Eliminar un Registro de Registro diario específico
 * @access Private (requiere token)
 */
// Usamos :id_registroDiario para que coincida con el nombre en la BD
router.delete(
  "/:id_registroDiario",
  authMiddleware, // (Guardia) Estás logueado?
  deleteRegistroDiarioHandler, // (Controlador) Borrar el Registro peso
);
export default router;

/**
 * @route PUT /api/v1/registroDiario/:id_registroDiario
 * @desc Actualizar un Registro de Registro diario específico
 * @access Private (requiere token)
 */
router.put(
  "/:id_registroDiario",
  authMiddleware, // (Guardia) Estás logueado?
  validate(createRegistroDiarioSchema), // (Validador) ¿Tus datos son válidos?
  updateRegistroDiarioHandler, // (Controlador) Actualizar el Registro diario
);
