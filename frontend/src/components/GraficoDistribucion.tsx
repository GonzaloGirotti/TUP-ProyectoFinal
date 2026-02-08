import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import type { SectionKey } from '../layout/types';
import { SECTION_LABELS } from '../layout/types';

interface GraficoDistribucionProps {
  itemsPorSeccion: Record<SectionKey, any[]>;
}

export const GraficoDistribucion: React.FC<GraficoDistribucionProps> = ({ itemsPorSeccion }) => {
  const mealSections: SectionKey[] = ['desayuno', 'almuerzo', 'cena', 'aperitivo'];
  const valoresPie = mealSections.map(sec => itemsPorSeccion[sec].length || 0);
  const totalItems = valoresPie.reduce((a, b) => a + b, 0);

  const pieData = {
    labels: mealSections.map(sec => SECTION_LABELS[sec]),
    datasets: [{
      data: valoresPie, 
      backgroundColor: ['#4ade80', '#60a5fa', '#f97373', '#fbbf24'], 
      borderWidth: 0 
    }],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'bottom' as const, 
        labels: { color: '#cbd5e1' } 
      } 
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
      <h3 className="text-base font-semibold mb-3 text-center text-white">Distribución de comidas</h3>
      <div className="max-w-xs mx-auto h-48">
        {totalItems === 0 ? (
          <p className="text-xs opacity-40 italic text-center py-10 text-slate-300">
            Sin registros de comida hoy.
          </p>
        ) : (
          <Pie data={pieData} options={pieOptions} />
        )}
      </div>
    </div>
  );
};