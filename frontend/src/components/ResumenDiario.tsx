import React from 'react';
import type { ResumenDiario as ResumenDiarioType } from '../layout/types';

interface ResumenDiarioProps {
  resumen: ResumenDiarioType;
}

export const ResumenDiario: React.FC<ResumenDiarioProps> = ({ resumen }) => {
  const caloriasRestantes = resumen.objetivo - resumen.alimento + resumen.ejercicio;

  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
      <div className="flex w-full justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white">Resumen Diario</h2>
      </div>
      <div className="flex w-full gap-4 text-center calorias-grid text-sm md:text-base text-slate-200">
        <div className="flex flex-col flex-1">
          <p className="text-xl font-bold">{resumen.objetivo}</p>
          <p className="text-xs uppercase opacity-50">Meta</p>
        </div>
        <span className="self-center font-bold text-slate-500">-</span>
        <div className="flex flex-col flex-1">
          <p className="text-xl font-bold">{resumen.alimento}</p>
          <p className="text-xs uppercase opacity-50">Comida</p>
        </div>
        <span className="self-center font-bold text-slate-500">+</span>
        <div className="flex flex-col flex-1">
          <p className="text-xl font-bold">{resumen.ejercicio}</p>
          <p className="text-xs uppercase opacity-50">Ejercicio</p>
        </div>
        <span className="self-center font-bold text-slate-500">=</span>
        <div className="flex flex-col flex-1">
          <p className={`text-xl font-extrabold ${caloriasRestantes < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
            {caloriasRestantes}
          </p>
          <p className="text-xs uppercase opacity-50">Restantes</p>
        </div>
      </div>
    </div>
  );
};