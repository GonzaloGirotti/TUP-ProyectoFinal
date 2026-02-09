import { Op } from "sequelize";
import { Request, Response } from "express";
import Comida from "../models/comida.model";
import ComidaAlimento from "../models/comida_alimento.model";
import Ejercicio from "../models/ejercicio.model";
import Agua from "../models/agua.model";

export const getReporteDiario = async (req: Request, res: Response) => {
    try {
        const usuarioId = (req as any).usuario.id;
        const fecha = req.query.fecha as string;

        if (!fecha) {
            return res.status(400).json({ error: "La fecha es requerida" });
        }

        const rangoFecha = {
            [Op.between]: [`${fecha} 00:00:00`, `${fecha} 23:59:59`],
        };

        // 🔹 AGUA
        const aguaTotal = await Agua.sum("cantidad_ml", {
            where: { id_usuario: usuarioId, fecha: rangoFecha },
        });

        // 🔹 EJERCICIOS
        const caloriasQuemadas = await Ejercicio.sum("calorias_quemadas", {
            where: { id_usuario: usuarioId, fecha: rangoFecha },
        });

        // 🔹 COMIDAS + ALIMENTOS
        const comidas = await Comida.findAll({
            where: { id_usuario: usuarioId, fecha: rangoFecha },
            include: [
                {
                    model: ComidaAlimento,
                    as: "comidas_alimentos",
                },
            ],
        });

        // 🔹 CÁLCULOS
        let caloriasConsumidas = 0;

        comidas.forEach((comida: any) => {
            comida.comidas_alimentos?.forEach((ca: any) => {
                caloriasConsumidas += ca.calorias_total || 0;
            });
        });

        return res.json({
            status: "ok",
            data: {
                usuarioId,
                fecha,
                resumen: {
                    caloriasConsumidas,
                    caloriasQuemadas: caloriasQuemadas || 0,
                    aguaTotalMl: aguaTotal || 0,
                },
                comidas,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error generando reporte diario" });
    }
};
