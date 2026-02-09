import React, { useState } from 'react';

interface ModalAgregarAguaProps {
  onGuardar: (cantidadMl: number) => Promise<void>;
  onCancelar: () => void;
  guardando: boolean;
}

export const ModalAgregarAgua: React.FC<ModalAgregarAguaProps> = ({
  onGuardar,
  onCancelar,
  guardando
}) => {
  const [aguaInput, setAguaInput] = useState(250);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGuardar(aguaInput);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Cantidad (ml)
        </label>
        <input 
          type="number" 
          className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
          value={aguaInput} 
          onChange={e => setAguaInput(Number(e.target.value))} 
          min="1" 
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