// src/components/ObjetivosPanel.tsx
import { useState, useMemo, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';

import { nutritionService } from '../services/nutritionService';
import { authService } from '../services/authService';

ChartJS.register(ArcElement, Tooltip, Legend);

type MacrosState = {
  proteinas: number;
  carbohidratos: number;
  grasas: number;
};

export function ObjetivosPanel() {
  const [calorias, setCalorias] = useState<number>(2000);
  const [pesoDeseado, setPesoDeseado] = useState<number>(70);

  const [macros, setMacros] = useState<MacrosState>({
    proteinas: 30,
    carbohidratos: 50,
    grasas: 20,
  });

  // Suma de porcentajes de macros
  const totalPorcentaje = useMemo(
    () => macros.proteinas + macros.carbohidratos + macros.grasas,
    [macros]
  );

  const esTotalValido = totalPorcentaje === 100;

  const handleMacroChange = (macro: keyof MacrosState, value: string) => {
    const numero = Number(value);
    // Permitimos vacío o NaN -> 0
    const limpio = isNaN(numero) ? 0 : numero;

    setMacros((prev) => ({
      ...prev,
      [macro]: limpio,
    }));
  };

  // Cálculo de gramos en base a calorías y porcentaje
  const gramosProteinas = useMemo(() => {
    return Math.round((calorias * (macros.proteinas / 100)) / 4);
  }, [calorias, macros.proteinas]);

  const gramosCarbohidratos = useMemo(() => {
    return Math.round((calorias * (macros.carbohidratos / 100)) / 4);
  }, [calorias, macros.carbohidratos]);

  const gramosGrasas = useMemo(() => {
    return Math.round((calorias * (macros.grasas / 100)) / 9);
  }, [calorias, macros.grasas]);

  const data: ChartData<'doughnut', number[], string> = {
    labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
    datasets: [
      {
        data: [macros.proteinas, macros.carbohidratos, macros.grasas],
        // puedes cambiar estos colores a tu paleta Tailwind
        backgroundColor: ['#22c55e', '#3b82f6', '#f97316'],
        borderWidth: 0,
      },
    ],
  };

  const loadObjetivos = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        console.warn('Usuario no autenticado');
        return;
      }
      
      const objetivosService = nutritionService.objetivos;
      const response = await objetivosService.obtenerObjetivosHoy(token);
      const objetivos = response.data.objetivos;

      console.log('Objetivos obtenidos:', response.data);

      if (objetivos && objetivos.length > 0) {
        const objetivoHoy = objetivos[0]; // El primero es el más reciente (ordenado DESC)

        setCalorias(objetivoHoy.calorias);
        setPesoDeseado(objetivoHoy.peso_deseado);
        setMacros({
          proteinas: objetivoHoy.proteinas_proporcion,
          carbohidratos: objetivoHoy.carbohidratos_proporcion,
          grasas: objetivoHoy.grasas_proporcion,
        });
      }
    } catch (error) {
      console.error('Error al cargar objetivos:', error);
    }
  };

  // Cargar objetivos al montar el componente
  useEffect(() => {
    void loadObjetivos();
  }, []);

  const saveObjetivos = async () => {
    if (!esTotalValido) {
      alert('La suma de los porcentajes de macros debe ser 100%');
      return;
    }

    try {
      const token = authService.getToken();
      if (!token) {
        alert('Usuario no autenticado');
        return;
      }

      const objetivosService = nutritionService.objetivos;
      await objetivosService.registrarObjetivos(
        {
          id_usuario: authService.getUsuario()?.id,
          calorias: calorias,
          proteinas_proporcion: macros.proteinas,
          carbohidratos_proporcion: macros.carbohidratos,
          grasas_proporcion: macros.grasas,
          peso_deseado: pesoDeseado,
        },
        token
      );

      const pesosService = nutritionService.peso;
      await pesosService.registrarObjetivoPeso(
        {
          id_usuario: authService.getUsuario()?.id,
          fecha: new Date(),
          peso_kg: pesoDeseado,
        },
        token
      );
      await pesosService.eliminarObjetivosPesoViejos(token);
      alert('Objetivos y objetivo peso guardados exitosamente');
    } catch (error) {
        console.log('Objetivo peso: ', {
        id_usuario: authService.getUsuario()?.id,
        fecha: new Date().toISOString(),
        peso_kg: pesoDeseado,
      });
      console.error('Error al guardar objetivos / objetivo peso:', error);
      alert('Hubo un error al guardar los objetivos / objetivo peso. Por favor, intenta nuevamente.');
    }
    
  };

  return (
    <div className="panel-item p-5 w-full max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold mb-2">Objetivos</h2>

      {/* Calorías totales */}
      <section className=" rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="text-lg font-medium">Calorías diarias totales</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            className="border border-slate-300 rounded-xl px-3 py-2 w-32 text-right"
            value={calorias}
            min={800}
            max={8000}
            onChange={(e) => setCalorias(Number(e.target.value) || 0)}
          />
          <span className="text-sm text-slate-500">kcal/día</span>
        </div>
      </section>

      {/* Macros: porcentajes + donut + gramos */}
      <section className=" rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-medium">Distribución de macros</h3>
          <span
            className={`text-sm font-medium ${
              esTotalValido ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            Total: {totalPorcentaje}% {esTotalValido ? '(OK)' : '(debe ser 100%)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Inputs de porcentaje */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700">
                  Proteínas
                </label>
                <span className="text-xs text-slate-500">
                  4 kcal por gramo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border border-slate-300 rounded-xl px-3 py-1.5 w-20 text-right"
                  value={macros.proteinas}
                  min={0}
                  max={100}
                  onChange={(e) => handleMacroChange('proteinas', e.target.value)}
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700">
                  Carbohidratos
                </label>
                <span className="text-xs text-slate-500">
                  4 kcal por gramo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border border-slate-300 rounded-xl px-3 py-1.5 w-20 text-right"
                  value={macros.carbohidratos}
                  min={0}
                  max={100}
                  onChange={(e) =>
                    handleMacroChange('carbohidratos', e.target.value)
                  }
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700">
                  Grasas
                </label>
                <span className="text-xs text-slate-500">
                  9 kcal por gramo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border border-slate-300 rounded-xl px-3 py-1.5 w-20 text-right"
                  value={macros.grasas}
                  min={0}
                  max={100}
                  onChange={(e) => handleMacroChange('grasas', e.target.value)}
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>

            {!esTotalValido && (
              <p className="text-xs text-rose-600 mt-2">
                La suma de Proteínas + Carbohidratos + Grasas debe ser exactamente
                100% para que el objetivo sea válido.
              </p>
            )}
          </div>

          {/* Donut chart */}
          <div className="max-w-xs mx-auto">
            <Doughnut
              data={data}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                    },
                  },
                },
                cutout: '65%',
              }}
            />
          </div>
        </div>

        {/* Tabla de gramos calculados */}
        <div className="mt-4 border-t border-slate-200 pt-3">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Equivalente aproximado en gramos / día
          </h4>
          <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
            <div className="bg-white rounded-xl border border-slate-200 p-2 flex flex-col items-center">
              <span className="font-medium text-slate-700">Proteínas</span>
              <span className="text-slate-500 mb-1">{macros.proteinas}%</span>
              <span className="text-emerald-600 font-semibold">
                {isNaN(gramosProteinas) ? '-' : `${gramosProteinas} g`}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-2 flex flex-col items-center">
              <span className="font-medium text-slate-700">Carbohidratos</span>
              <span className="text-slate-500 mb-1">
                {macros.carbohidratos}%
              </span>
              <span className="text-blue-600 font-semibold">
                {isNaN(gramosCarbohidratos) ? '-' : `${gramosCarbohidratos} g`}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-2 flex flex-col items-center">
              <span className="font-medium text-slate-700">Grasas</span>
              <span className="text-slate-500 mb-1">{macros.grasas}%</span>
              <span className="text-orange-600 font-semibold">
                {isNaN(gramosGrasas) ? '-' : `${gramosGrasas} g`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Peso deseado */}
      <section className=" rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="text-lg font-medium">Peso deseado</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            className="border border-slate-300 rounded-xl px-3 py-2 w-32 text-right"
            value={pesoDeseado}
            min={30}
            max={250}
            onChange={(e) => setPesoDeseado(Number(e.target.value) || 0)}
          />
          <span className="text-sm text-slate-500">kg</span>
        </div>
      </section>

      <button
        onClick={async () => { await saveObjetivos(); }}
        className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
        disabled={!esTotalValido}
      >
        Guardar cambios
      </button>
    </div>
  );
}
