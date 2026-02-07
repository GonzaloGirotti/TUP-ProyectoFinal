import React, { useState } from 'react';

interface ModalAgregarEjercicioProps {
  onGuardar: (tipo: string, calorias: number, minutos: number) => Promise<void>;
  onCancelar: () => void;
  guardando: boolean;
}

export const ModalAgregarEjercicio: React.FC<ModalAgregarEjercicioProps> = ({
  onGuardar,
  onCancelar,
  guardando
}) => {
  const [ejercicioInput, setEjercicioInput] = useState({
    tipo: '',
    calorias: 0,
    minutos: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGuardar(ejercicioInput.tipo, ejercicioInput.calorias, ejercicioInput.minutos);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Tipo de ejercicio
        </label>
        <input 
          type="text" 
          className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
          value={ejercicioInput.tipo} 
          onChange={e => setEjercicioInput({ ...ejercicioInput, tipo: e.target.value })} 
          placeholder="Ej: Correr, Gym..." 
          required 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Calorías quemadas
          </label>
          <input 
            type="number" 
            className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
            value={ejercicioInput.calorias} 
            onChange={e => setEjercicioInput({ ...ejercicioInput, calorias: Number(e.target.value) })} 
            min="1" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Duración (min)
          </label>
          <input 
            type="number" 
            className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
            value={ejercicioInput.minutos} 
            onChange={e => setEjercicioInput({ ...ejercicioInput, minutos: Number(e.target.value) })} 
            min="1" 
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button 
          type="button" 
          onClick={onCancelar}
          className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={guardando}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};