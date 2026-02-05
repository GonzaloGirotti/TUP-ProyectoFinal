import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { settingsSchema } from "../schemas/usuario.schema";
import {
    createSettingsHandler,
    getSettingsHandler,
    updateSettingsHandler,
} from "../controllers/settings.controller";

const router = Router();

// Todas las rutas requieren estar logueado
router.use(authMiddleware);

router.post(
    "/:id_usuario",
    validate(settingsSchema),
    createSettingsHandler,
);

router.get("/:id_usuario", getSettingsHandler);

router.put(
    "/:id_usuario",
    validate(settingsSchema),
    updateSettingsHandler,
);

export default router;
