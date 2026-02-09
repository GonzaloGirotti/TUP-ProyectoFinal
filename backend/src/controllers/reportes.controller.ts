import { Request, Response } from "express";
import Workbook from "exceljs";
import Comida from "../models/comida.model";
import ComidaAlimento from "../models/comida_alimento.model";
import AlimentoConsumido from "../models/alimento_consumido.model";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

export const generarPdfResumen = async (req: Request, res: Response) => {
    try {
        if (!req.usuario) return res.status(401).json({ message: "No autorizado" });
        const usuarioId = req.usuario.id;

        // 1. Obtener datos (usamos la misma lógica de inclusión que en Excel)
        const comidas = await Comida.findAll({
            where: { id_usuario: usuarioId },
            include: [{
                model: ComidaAlimento,
                as: "detalles",
                include: [{ model: AlimentoConsumido, as: "alimento" }]
            }],
            order: [['fecha', 'DESC']]
        });

        // 2. Crear el documento PDF
        const doc = new jsPDF();

        // Estilo del Título
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Resumen Nutricional Personalizado", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Usuario: ${req.usuario.nombre}`, 14, 30);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 35);

        // 3. Calcular Información Relevante (Resumen)
        let totalKcal = 0;
        comidas.forEach(c => {
            // @ts-ignore
            c.detalles?.forEach(d => totalKcal += (d.calorias_total || 0));
        });

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total de calorías registradas: ${totalKcal.toFixed(2)} kcal`, 14, 45);

        // 4. Preparar la tabla de datos
        const tableColumn = ["Fecha", "Momento", "Alimento", "Cantidad", "Calorías"];
        const tableRows: any[] = [];

        comidas.forEach((c: any) => {
            c.detalles?.forEach((d: any) => {
                const rowData = [
                    new Date(c.fecha).toLocaleDateString(),
                    c.nombre_comida,
                    d.alimento?.nombre || "N/A",
                    `${d.cantidad_gramos}g`,
                    `${d.calorias_total?.toFixed(2)}`
                ];
                tableRows.push(rowData);
            });
        });

        // 5. Generar la tabla con autoTable
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }, // Verde esmeralda
        });
        // 6. Enviar el PDF como buffer
        const pdfOutput = doc.output("arraybuffer");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Resumen_Nutricional.pdf");
        return res.send(Buffer.from(pdfOutput));

    } catch (error) {
        console.error("Error PDF:", error);
        return res.status(500).json({ message: "Error al generar el PDF" });
    }
};

export const generarExcelConsumo = async (req: Request, res: Response) => {
    try {
        // Si por alguna razón no hay usuario, cortamos la ejecución
        if (!req.usuario) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const usuarioId = req.usuario.id; // Aquí TS ya sabe que existe

        // Buscamos las comidas con sus detalles de alimentos
        const comidas = await Comida.findAll({
            where: { id_usuario: usuarioId },
            include: [{
                model: ComidaAlimento,
                as: "detalles",
                include: [{
                    model: AlimentoConsumido,
                    as: "alimento"
                }]
            }],
            order: [["fecha", "DESC"]]
        });

        const workbook = new Workbook.Workbook();
        const worksheet = workbook.addWorksheet("Mis Comidas");

        worksheet.columns = [
            { header: "Fecha", key: "fecha", width: 15 },
            { header: "Comida", key: "nombre", width: 15 },
            { header: "Alimento", key: "ali", width: 25 },
            { header: "Kcal", key: "kcal", width: 10 }
        ];

        comidas.forEach((c: any) => {
            c.detalles?.forEach((d: any) => {
                worksheet.addRow({
                    fecha: new Date(c.fecha).toLocaleDateString(),
                    nombre: c.nombre_comida,
                    ali: d.alimento?.nombre || "N/A",
                    kcal: d.calorias_total
                });
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Reporte.xlsx");

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al generar reporte" });
    }
};