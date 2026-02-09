import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getReporteDiario } from "../controllers/reportes.controller";

const router = Router();

/**
 * @route GET /api/v1/reportes/diario
 * @desc Reporte diario del usuario autenticado
 * @access Private
 */
router.get(
    "/diario",
    authMiddleware,
    getReporteDiario
);

export default router;
