import React, { useState } from 'react';
import { reporteService } from '../services/reporteService';

export const PanelReportes: React.FC = () => {
  const [descargando, setDescargando] = useState<string | null>(null);

  const handleDescarga = async (tipo: 'excel' | 'pdf') => {
    setDescargando(tipo);
    try {
      if (tipo === 'excel') {
        await reporteService.descargarArchivo('/excel/consumo-global', 'Mi_Consumo.xlsx');
      } else {
        await reporteService.descargarArchivo('/pdf/resumen-usuario', 'Resumen_Nutricional.pdf');
      }
    } catch (error) {
      alert("No se pudo descargar el archivo");
    } finally {
      setDescargando(null);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mt-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📊</span> Centro de Reportes
      </h2>
      <p className="text-slate-400 mb-6 text-sm">
        Descarga tu actividad nutricional en formatos profesionales para compartir con tu nutricionista o seguir tu progreso.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Excel */}
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-emerald-500 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl">Excel</span>
            <span className="text-emerald-500 opacity-50 group-hover:opacity-100">📥</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Ideal para análisis de datos y seguimiento detallado de cada alimento.</p>
          <button 
            onClick={() => handleDescarga('excel')}
            disabled={descargando !== null}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium disabled:opacity-50"
          >
            {descargando === 'excel' ? 'Generando...' : 'Descargar .xlsx'}
          </button>
        </div>

        {/* Card PDF */}
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-rose-500 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl">PDF</span>
            <span className="text-rose-500 opacity-50 group-hover:opacity-100">📄</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Resumen visual estético con tus totales y distribución de comidas.</p>
          <button 
            onClick={() => handleDescarga('pdf')}
            disabled={descargando !== null}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium disabled:opacity-50"
          >
            {descargando === 'pdf' ? 'Generando...' : 'Descargar .pdf'}
          </button>
        </div>
      </div>
    </div>
  );
};