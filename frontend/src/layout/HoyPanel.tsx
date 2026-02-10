import { useEffect, useState } from "react";
import ChartPanel from "../components/MacrosChart";
import { nutritionService } from "../services/nutritionService";
import { authService } from "../services/authService";
import { isSameDay } from 'date-fns';

interface ComidaBackend {
  id_comida: number;
  nombre_comida: string;
  fecha: string;
}

interface PesoBackend {
  id_peso: number;
  peso_kg: number;
  fecha: string;
}

export function HoyPanel() {
  const [loading, setLoading] = useState(true);

  // Datos calculados desde el Backend
  const [caloriasConsumidas, setCaloriasConsumidas] = useState(0);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [pesoActual, setPesoActual] = useState(0);

  // Datos reales de Agua y Ejercicio
  const [aguaLitros, setAguaLitros] = useState(0);
  const [ejercicioCal, setEjercicioCal] = useState(0);

  const META_CALORIAS = 2000;

  useEffect(() => {
    cargarDatosReales();
  }, []);

  // LÓGICA DE CARGA DE DATOS
  const cargarDatosReales = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1. Pedimos TODO en paralelo
      const [resPesos, resComidas, resAgua, resEjercicios] = await Promise.all([
        nutritionService.peso.verHistorialPesos(token),
        nutritionService.comidas.listarComidas(token),
        nutritionService.agua.obtenerAguaHoy(token),
        nutritionService.ejercicio.obtenerEjerciciosHoy(token)
      ]);

      const listaPesos = resPesos.data as PesoBackend[];
      const listaComidas = resComidas.data as ComidaBackend[];

      // PROCESAMIENTO AGUA Y EJERCICIO
      // Convertimos ml a Litros para mostrar
      // El backend de agua devuelve { total_ml, registros: [...] }
      const totalAgua = (resAgua.data as any).total_ml || 0;
      setAguaLitros(totalAgua / 1000);

      // El backend de ejercicios devuelve { total_calorias, ejercicios: [...] }
      const totalEjercicio = (resEjercicios.data as any).total_calorias || 0;
      setEjercicioCal(totalEjercicio);

      // PROCESAMIENTO DE PESO
      if (listaPesos && listaPesos.length > 0) {
        const historialOrdenado = listaPesos.sort((a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        const ultimo = historialOrdenado[historialOrdenado.length - 1];
        setPesoActual(Number(ultimo.peso_kg));
      }

      // PROCESAMIENTO DE COMIDAS
      const comidasDeHoy = listaComidas.filter((comida) => 
        isSameDay(new Date(comida.fecha), new Date())
      );

      let sumaCals = 0;
      let sumaProt = 0;
      let sumaCarbs = 0;
      let sumaGrasas = 0;

      // Hidratación (Detalles de cada comida)
      for (const comida of comidasDeHoy) {
        try {
          const resDetalle = await nutritionService.comidas.verAlimentosDeComida(comida.id_comida, token);
          const listaDetalles = resDetalle.data;

          if (Array.isArray(listaDetalles)) {
            const detallesDeEstaComida = listaDetalles.filter((d: any) => d.id_comida === comida.id_comida);

            detallesDeEstaComida.forEach((registro: any) => {
              const alimento = registro.Alimento || registro.alimento;
              const cantidad = Number(registro.cantidad) || 0;
              const gramos = Number(registro.cantidad_gramos) || 0;

              let multiplicador = 1;
              if (cantidad > 0) multiplicador = cantidad;
              else if (gramos > 0) multiplicador = gramos / 100;

              if (alimento) {
                sumaCals += Number(alimento.calorias || 0) * multiplicador;
                sumaProt += Number(alimento.proteinas || 0) * multiplicador;
                sumaCarbs += Number(alimento.carbohidratos || 0) * multiplicador;
                sumaGrasas += Number(alimento.grasas || 0) * multiplicador;
              }
            });
          }
        } catch (err) {
          console.warn(`Error cargando detalles comida ID ${comida.id_comida}`);
        }
      }

      setCaloriasConsumidas(Math.round(sumaCals));
      setMacros({
        protein: Math.round(sumaProt),
        carbs: Math.round(sumaCarbs),
        fat: Math.round(sumaGrasas)
      });

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const caloriasRestantes = META_CALORIAS - caloriasConsumidas + ejercicioCal;
  const imc = pesoActual > 0 ? (pesoActual / (1.75 * 1.75)).toFixed(1) : "--";

  if (loading && caloriasConsumidas === 0) return <div className="p-10 text-center text-slate-400">Sincronizando resumen...</div>;

  return (
    <div className="flex flex-col gap-4 animate-fade-in">

      {/* SECCIÓN SUPERIOR */}
      <div className="flex w-full justify-between gap-2">

        {/* PANEL CALORÍAS */}
        <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700 col-span-2 grid grid-cols-2 grid-rows-2 w-1/2">
          <div>
            <h2 className="text-gray-400 text-sm font-semibold uppercase">Restantes</h2>
            <h4 className={`text-3xl font-bold ${caloriasRestantes < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              {caloriasRestantes} kcal
            </h4>
          </div>
          <div className="flex justify-end items-start">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ef4444">
              <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z" />
            </svg>
          </div>
          <div className="col-span-2 mt-2 text-xs text-slate-500">
            <p>Meta ({META_CALORIAS}) - Alimentos ({caloriasConsumidas}) + Ejercicio ({ejercicioCal})</p>
          </div>
        </div>

        {/* PANEL EJERCICIO (SOLO LECTURA) */}
        <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700 w-1/4 flex flex-col justify-between">
          <div>
            <h2 className="text-gray-400 text-sm font-semibold uppercase">Ejercicio</h2>
            <h4 className="text-xl font-bold text-white">{ejercicioCal} kcal</h4>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#64748b" className="self-end opacity-50">
            <path d="m826-585-56-56 30-31-128-128-31 30-57-57 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L104-233q-23-23-23-56.5t23-56.5l30-30 57 57-31 30 129 129 30-31 57 57-30 30Zm397-336 57-57-303-303-57 57 303 303ZM463-160l57-58-302-302-58 57 303 303Zm-6-234 110-109-64-64-109 110 63 63Zm63 290q-23 23-57 23t-57-23L104-406q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l63 63 110-110-63-62q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l303 303q23 23 23 56.5T857-441l-57 57q-23 23-57 23t-57-23l-62-63-110 110 63 63q23 23 23 56.5T577-161l-57 57Z" />
          </svg>
        </div>

        {/* PANEL AGUA (SOLO LECTURA) */}
        <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700 w-1/4 flex flex-col justify-between">
          <div>
            <h2 className="text-gray-400 text-sm font-semibold uppercase">Agua</h2>
            <h4 className="text-xl font-bold text-white">{aguaLitros} L</h4>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3b82f6" className="self-end opacity-50">
            <path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35ZM480-80q-137 0-228.5-94T160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Z" />
          </svg>
        </div>
      </div>

      {/* GRÁFICO DE MACROS */}
      <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
        <h2 className="text-lg font-bold mb-4 text-white">Macros del Día</h2>
        <ChartPanel macros={macros} />
      </div>

      {/* SECCIÓN INFERIOR: PESO E IMC */}
      <div className="flex w-full justify-between gap-2">
        <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700 w-1/2">
          <h2 className="text-gray-400 text-sm font-semibold uppercase">Peso Actual</h2>
          <h4 className="text-2xl font-bold text-white">{pesoActual > 0 ? `${pesoActual} kg` : '--'}</h4>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700 w-1/2">
          <h2 className="text-gray-400 text-sm font-semibold uppercase">IMC Estimado</h2>
          <h4 className="text-2xl font-bold text-white">{imc}</h4>
        </div>
      </div>
    </div>
  );
}