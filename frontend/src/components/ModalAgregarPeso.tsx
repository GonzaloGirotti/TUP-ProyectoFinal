import React, { useState } from 'react';

interface ModalAgregarPesoProps {
  onGuardar: (peso_kg: number, fecha: Date, comentario: string) => Promise<void>;
  onCancelar: () => void;
  guardando: boolean;
}

export const ModalAgregarPeso: React.FC<ModalAgregarPesoProps> = ({
  onGuardar,
  onCancelar,
  guardando
}) => {
  const [pesoInput, setPesoInput] = useState({
    peso_kg: 0,
    fecha: new Date(),
    comentario: 'Peso registrado desde el panel diario'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGuardar(pesoInput.peso_kg, pesoInput.fecha, pesoInput.comentario);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Peso (kg)
        </label>
        <input 
          type="number" 
          className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
          value={pesoInput.peso_kg} 
          onChange={e => setPesoInput({ ...pesoInput, peso_kg: Number(e.target.value) })} 
          placeholder="Ej: 70" 
          required 
        />
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