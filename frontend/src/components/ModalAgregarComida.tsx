import React, { useState } from 'react';
import type { AlimentoBackend } from '../layout/types';
import { useAlimentos } from '../hooks/useAlimentos';

interface ModalAgregarComidaProps {
  listaAlimentos: AlimentoBackend[];
  onGuardar: (idAlimento: number, cantidad: number) => Promise<void>;
  onCancelar: () => void;
  guardando: boolean;
  onAlimentoCreado?: () => Promise<void>;
}

export const ModalAgregarComida: React.FC<ModalAgregarComidaProps> = ({
  listaAlimentos,
  onGuardar,
  onCancelar,
  guardando,
  onAlimentoCreado
}) => {
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState<string>('');
  const [cantidadInput, setCantidadInput] = useState(1);
  const {
    creandoAlimento,
    nuevoAlimento,
    setCreandoAlimento,
    setNuevoAlimento,
    crearAlimento,
    calcularCaloriasAuto
  } = useAlimentos();

  const handleGuardarComida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alimentoSeleccionado) return;
    await onGuardar(Number(alimentoSeleccionado), cantidadInput);
  };

const handleMacroChange = (macro: string, valor: number) => {
  const actualizado = { ...nuevoAlimento, [macro]: valor };
  const caloriasCalculadas = (actualizado.proteinas * 4) +
    (actualizado.carbohidratos * 4) +
    (actualizado.grasas * 9);
  setNuevoAlimento({ ...actualizado, calorias: caloriasCalculadas });
};

const handleCrearAlimento = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!nuevoAlimento.nombre || nuevoAlimento.nombre.length < 3) {
    alert('El nombre debe tener al menos 3 caracteres');
    return;
  }

  try {
    const nuevo = await crearAlimento();
    
    // Recargar la lista del padre ANTES de cerrar el modal
    if (onAlimentoCreado) {
      await onAlimentoCreado();
    }
    
    // Ahora sí, actualizar la selección y cerrar el modal
    setAlimentoSeleccionado(String(nuevo.id));
    setCreandoAlimento(false);
  } catch (error) {
    console.error('Error al crear alimento:', error);
  }
};

return !creandoAlimento ? (
  <form onSubmit={handleGuardarComida} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Selecciona un alimento
      </label>
      <select
        className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
        value={alimentoSeleccionado}
        onChange={(e) => setAlimentoSeleccionado(e.target.value)}
        required
      >
        <option value="" className="text-slate-500">-- Buscar --</option>
        {listaAlimentos
          .filter(ali => ali.id_alimento)
          .map(ali => (
            <option key={ali.id_alimento} value={String(ali.id_alimento)}>
              {ali.nombre} ({ali.calorias} kcal)
            </option>
          ))}
      </select>
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={() => setCreandoAlimento(true)}
          className="text-xs text-emerald-400 hover:underline"
        >
          ¿No está? Crear nuevo
        </button>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Cantidad (100 = 1 unidad)
      </label>
      <input
        type="number"
        className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
        value={cantidadInput}
        onChange={e => setCantidadInput(Number(e.target.value))}
        required
      />
      <p className="text-xs text-slate-500 mt-1">* Se divide por 100.</p>
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
        {guardando ? 'Agregando...' : 'Agregar'}
      </button>
    </div>
  </form>
) : (
  <form onSubmit={handleCrearAlimento} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Nombre
      </label>
      <input
        type="text"
        className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
        value={nuevoAlimento.nombre}
        onChange={e => setNuevoAlimento({ ...nuevoAlimento, nombre: e.target.value })}
        required
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-slate-300">Calorías (Auto)</label>
        <input
          type="number"
          min="0"
          step="0.1"
          className="w-full bg-slate-900 text-white border-emerald-500 p-2 rounded outline-none"
          value={nuevoAlimento.calorias}
          onChange={e => setNuevoAlimento({ ...nuevoAlimento, calorias: Number(e.target.value) || 0 })}
          readOnly
        />
      </div>
      <div>
        <label className="text-sm text-slate-300">Proteínas</label>
        <input
          type="number"
          min="0"
          step="0.1"
          className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none"
          value={nuevoAlimento.proteinas}
          onChange={e => handleMacroChange('proteinas', Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <label className="text-sm text-slate-300">Carbos</label>
        <input
          type="number"
          min="0"
          step="0.1"
          className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none"
          value={nuevoAlimento.carbohidratos}
          onChange={e => handleMacroChange('carbohidratos', Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <label className="text-sm text-slate-300">Grasas</label>
        <input
          type="number"
          min="0"
          step="0.1"
          className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none"
          value={nuevoAlimento.grasas}
          onChange={e => handleMacroChange('grasas', Number(e.target.value) || 0)}
        />
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={() => setCreandoAlimento(false)}
        className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
      >
        Volver
      </button>
      <button
        type="submit"
        disabled={guardando}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        {guardando ? 'Creando...' : 'Crear'}
      </button>
    </div>
  </form>
);
};