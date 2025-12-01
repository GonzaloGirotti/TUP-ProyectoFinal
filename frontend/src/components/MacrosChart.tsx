import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import type { Macros } from "../types/registro";
import { toCalories, toPercentages } from "../models/registro.model";


ChartJS.register(ArcElement, Tooltip, Legend);





export default function ChartPanel({
  title = "Macros (kcal)",
  macros,
  height = 250,
  colors,
}: {
  title?: string;
  macros: Macros;
  height?: number;
  colors?: {
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}) {

  const kcal = toCalories(macros);
  const percentages = toPercentages(macros);

  const defaultColors = {
    protein: colors?.protein || "#3b82f6", // azul
    carbs: colors?.carbs || "#f59e0b",   // ámbar
    fat: colors?.fat || "#ef4444",       // rojo
  };

  const baseOptions: ChartOptions<"doughnut"> = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  const createData = (label: string, percent: number, color: string) => ({
    labels: [label, "resto"],
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: [color, "oklch(14.7% 0.004 49.25)"],
        borderWidth: 0,
      },
    ],
  });

  return (
    <div className="w-full shadow-sm p-6 ">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div
        style={{ minHeight: height }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center"
      >
        <MacroDonut
          label="Proteínas"
          percent={percentages.protein}
          color={defaultColors.protein}
          data={createData("Proteínas", percentages.protein, defaultColors.protein)}
          options={baseOptions}
        />

        <MacroDonut
          label="Carbohidratos"
          percent={percentages.carbs}
          color={defaultColors.carbs}
          data={createData("Carbohidratos", percentages.carbs, defaultColors.carbs)}
          options={baseOptions}
        />

        <MacroDonut
          label="Grasas"
          percent={percentages.fat}
          color={defaultColors.fat}
          data={createData("Grasas", percentages.fat, defaultColors.fat)}
          options={baseOptions}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <MacroStat name="Proteínas" grams={macros.protein} kcal={kcal.protein} />
        <MacroStat name="Carbohidratos" grams={macros.carbs} kcal={kcal.carbs} />
        <MacroStat name="Grasas" grams={macros.fat} kcal={kcal.fat} />
      </div>
    </div>
  );
}

function MacroDonut({
  label,
  percent,
  color,
  data,
  options,
}: {
  label: string;
  percent: number;
  color: string;
  data: any;
  options: ChartOptions<"doughnut">;
}) {
  return (
    <div className="flex flex-col items-center gap-3 relative">
      <div className="w-44 relative flex justify-center items-center">
        <Doughnut data={data} options={options} />
         <span className="text-gray-500 z-1 absolute">{percent.toFixed(1)}%</span>
      </div>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

function MacroStat({ name, grams, kcal }: { name: string; grams: number; kcal: number }) {
  return (
    <div className="rounded-xl border p-3 shadow-sm flex items-center justify-between">
      <div className="font-medium">{name}</div>
      <div className="tabular-nums text-gray-600">
        {grams.toFixed(1)} g · {kcal.toFixed(0)} kcal
      </div>
    </div>
  );
}
