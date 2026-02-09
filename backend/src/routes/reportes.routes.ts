import { Router } from "express";
import * as reportesController from "../controllers/reportes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Protegemos los reportes con tu middleware de JWT
router.get("/excel/consumo-global", authMiddleware, reportesController.generarExcelConsumo);

router.get("/pdf/resumen-usuario", authMiddleware, reportesController.generarPdfResumen);
export default router;