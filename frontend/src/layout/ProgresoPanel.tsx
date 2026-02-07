import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions, ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { nutritionService } from "../services/nutritionService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type EntradaPeso = {
  fecha: string;
  peso: number;
};

type EntradaObjetivo = {
  fecha: string;
  objetivo: number;
};

export function ProgresoPanel() {
  // Entradas reales del usuario (fetched desde la API)
  const [entradas, setEntradas] = useState<EntradaPeso[]>([]);
  const auth = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!auth.token) return;
        const res = await nutritionService.peso.verHistorialPesos(auth.token);
        // Asumimos que la API devuelve un array de objetos con 'fecha' y 'peso_kg' o 'peso'
        const data = res.data.map((p: any) => ({
          fecha: new Date(p.fecha).toISOString().slice(0, 10),
          peso: p.peso_kg ?? p.peso,
        }));
        if (mounted) setEntradas(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error cargando historial de pesos:", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [auth.token]);

  // Progreso / objetivo – va cambiando en el tiempo – step line chart
  const objetivos: EntradaObjetivo[] = [
    { fecha: "2025-10-01", objetivo: 77 },
    { fecha: "2025-10-20", objetivo: 76.5 },
    { fecha: "2025-11-04", objetivo: 75.5 },
  ];

  const labels = useMemo(
    () =>
      Array.from(
        new Set([
          ...entradas.map((e) => e.fecha),
          ...objetivos.map((o) => o.fecha),
        ])
      ).sort(),
    [entradas, objetivos]
  );

  const data = useMemo<ChartData<"line", (number | null)[], string>>(
    () => ({
      labels,
      datasets: [
        // 🔵 Entries: line chart normal
        {
          label: "Peso",
          data: labels.map((fecha) => {
            const entrada = entradas.find((e) => e.fecha === fecha);
            return entrada ? entrada.peso : null;
          }),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.3)",
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          spanGaps: true,
          stepped: false, // line normal
        },

        // 🟢 Progreso: step line chart
        {
          label: "Objetivo",

          data: (() => {
            let lastObjetivo: number | null = null;

            return labels.map((fecha) => {
              const obj = objetivos.find((o) => o.fecha === fecha);
              if (obj) {
                lastObjetivo = obj.objetivo; // (forward fill).
              }
              return lastObjetivo;
            });
          })(),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          pointRadius: 4,
          spanGaps: true,
          // 👇 clave: literal + 'as const' para que no sea string genérico
          stepped: "before" as const,
          fill: false,
          borderDash: [6, 4],
        },
      ],
    }),
    [labels, entradas, objetivos]
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#555",
          font: { size: 14 },
          useBorderRadius: true,
          borderRadius: 10,
          boxWidth: 20,
          boxHeight: 20,
        },
      },
      title: {
        display: false,
        text: "Progreso de Peso y Objetivos",
        color: "#111",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#666" },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      y: {
        ticks: {
          color: "#666",
          callback: (value) => `${value} kg`,
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  function calcularIMC(peso: number, alturaM: number) {
    return (peso / (alturaM * alturaM)).toFixed(1);
  }

  return (

    <div className="flex flex-col gap-4 p-6 w-full">
      <div className="panel-item p-6 w-full">
        <h2>Progreso</h2>
        <Line data={data} options={options} />
      </div>

      <div className="flex w-full justify-between gap-2">
        <div className="panel-item w-1/2">
          <h2>Peso</h2>
          <h4>80kg</h4>
        </div>
        <div className="panel-item w-1/2">
          <h2>IMC</h2>
          <h4>{calcularIMC(80, 1.75)}</h4>
        </div>
      </div>

    </div>
    
  );
}
