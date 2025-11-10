import { useState } from 'react'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import './diarioPanel.css'

type SectionKey =
  | 'desayuno'
  | 'almuerzo'
  | 'cena'
  | 'ejercicio'
  | 'agua'
  | 'aperitivo'

type MealSectionKey = 'desayuno' | 'almuerzo' | 'cena' | 'aperitivo'

const SECTION_LABELS: Record<SectionKey, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  ejercicio: 'Ejercicio',
  agua: 'Agua',
  aperitivo: 'Aperitivo',
}

const MEAL_SECTIONS: MealSectionKey[] = [
  'desayuno',
  'almuerzo',
  'cena',
  'aperitivo',
]

export function DiarioPanel() {

  const objetivo = 2000
  const alimento = 1300
  const ejercicioCal = 300
  const restantes = objetivo - alimento + ejercicioCal

  const [itemsPorSeccion, setItemsPorSeccion] = useState<
    Record<SectionKey, string[]>
  >({
    desayuno: ['Tostadas con huevo', 'Manzana'],
    almuerzo: [],
    cena: [],
    ejercicio: [],
    agua: [],
    aperitivo: [],
  })

  const handleAgregarItem = (section: SectionKey) => {
    const label = SECTION_LABELS[section]
    const nuevoItem = window.prompt(`Agregar registro en ${label}:`)

    if (!nuevoItem) return

    const item = nuevoItem.trim()
    if (!item) return

    setItemsPorSeccion(prev => ({
      ...prev,
      [section]: [...prev[section], item],
    }))
  }

  // ---- Datos para el Pie Chart ----
  const valores = MEAL_SECTIONS.map(sec => itemsPorSeccion[sec].length || 0)
  const totalRegistros = valores.reduce((acc, n) => acc + n, 0)

  const pieData = {
    labels: MEAL_SECTIONS.map(sec => SECTION_LABELS[sec]),
    datasets: [
      {
        data: [25, 25, 35, 15 ], // CAMBIAR LA DATA POR VERDADERA!!! 
        backgroundColor: ['#4ade80', '#60a5fa', '#f97373', '#fbbf24'],
        borderWidth: 1,
      },
    ],
  }

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.raw as number
            if (!totalRegistros) return `${label}: 0`
            const porcentaje = ((value / totalRegistros) * 100).toFixed(1)
            return `${label}: ${value} registro(s) (${porcentaje}%)`
          },
        },
      },
    },
  }

  return (
    <section className="w-full diario-panel">
      {/* BLOQUE CALORÍAS */}
      <div className="panel-item h-fit p-5 mb-4">
        <div className="flex w-full justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Calorías restantes</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="red"
            aria-hidden="true"
          >
            <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z" />
          </svg>
        </div>

        <div className="flex w-full gap-4 text-center calorias-grid">
          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold">{objetivo}</p>
            <p className="text-xs uppercase tracking-wide opacity-70">
              Objetivo
            </p>
          </div>
          <span className="self-center text-xl font-bold">-</span>

          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold">{alimento}</p>
            <p className="text-xs uppercase tracking-wide opacity-70">
              Alimento
            </p>
          </div>
          <span className="self-center text-xl font-bold">+</span>

          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold">{ejercicioCal}</p>
            <p className="text-xs uppercase tracking-wide opacity-70">
              Ejercicio
            </p>
          </div>
          <span className="self-center text-xl font-bold">=</span>

          <div className="flex flex-col flex-1">
            <p className="text-2xl font-extrabold">{restantes}</p>
            <p className="text-xs uppercase tracking-wide opacity-70">
              Restantes
            </p>
          </div>
        </div>
      </div>

      {/* PIE CHART DE PROPORCIONES */}
      <div className="panel-item h-fit p-5 mb-4">
        <h3 className="text-base font-semibold mb-3">
          Proporción de comidas (por cantidad de registros)
        </h3>

        {totalRegistros === 0 ? (
          <p className="text-xs opacity-60 italic">
            Todavía no hay registros en Desayuno, Almuerzo, Cena o Aperitivo.
          </p>
        ) : (
          <div className="max-w-xs mx-auto">
            <Pie data={pieData} options={pieOptions} />
          </div>
        )}
      </div>

      {/* SECCIONES DE REGISTRO */}
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(SECTION_LABELS) as SectionKey[]).map(section => (
          <article key={section} className="panel-item h-fit p-5">
            <header className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">
                {SECTION_LABELS[section]}
              </h3>
              <button
                type="button"
                className="btn-add rounded-full px-2 py-1 text-sm font-semibold"
                onClick={() => handleAgregarItem(section)}
                aria-label={`Agregar a ${SECTION_LABELS[section]}`}
              >
                +
              </button>
            </header>

            {itemsPorSeccion[section].length === 0 ? (
              <p className="text-xs opacity-60 italic">
                No hay registros aún. Presioná “+” para agregar.
              </p>
            ) : (
              <ul className="space-y-1 text-sm">
                {itemsPorSeccion[section].map((item, index) => (
                  <li key={`${section}-${index}`} className="registro-item">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
