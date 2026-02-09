export class ReportesService {
  async generarReporteDiario(usuarioId: number) {
    return {
      usuarioId,
      fecha: new Date().toISOString().substring(0, 10),
      resumen: {
        caloriasConsumidas: 0,
        caloriasQuemadas: 0,
        aguaTotalMl: 0,
      },
      comidas: [],
      ejercicios: [],
    };
  }
}