import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './diarioPanel.css';
import { nutritionService } from '../services/nutritionService';
import { authService } from '../services/authService';
import { ComidaCard } from '../components/ComidaCard';
import type { ItemDiario } from '../components/ComidaCard';

// TIPOS
type SectionKey = 'desayuno' | 'almuerzo' | 'cena' | 'aperitivo' | 'ejercicio' | 'agua';
// Solo estas secciones irán al gráfico
type MealSectionKey = 'desayuno' | 'almuerzo' | 'cena' | 'aperitivo';

const SECTION_LABELS: Record<SectionKey, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  aperitivo: 'Aperitivo',
  ejercicio: 'Ejercicio',
  agua: 'Agua',
};

const NORMALIZAR_SECCION: Record<string, SectionKey> = {
  'desayuno': 'desayuno',
  'almuerzo': 'almuerzo',
  'cena': 'cena',
  'merienda': 'aperitivo',
  'snack': 'aperitivo',
  'aperitivo': 'aperitivo'
};

const MEAL_SECTIONS: SectionKey[] = ['desayuno', 'almuerzo', 'cena', 'aperitivo'];
const NON_MEAL_SECTIONS: SectionKey[] = ['ejercicio', 'agua'];

interface AlimentoBackend {
  id_alimento: number;
  nombre: string;
  calorias: number;
}

interface ResumenDiario {
  objetivo: number;
  alimento: number;
  ejercicio: number;
}

const RESUMEN_INICIAL: ResumenDiario = {
  objetivo: 2000,
  alimento: 0,
  ejercicio: 0
};

const ITEMS_INICIALES: Record<SectionKey, ItemDiario[]> = {
  desayuno: [], almuerzo: [], cena: [], aperitivo: [],
  ejercicio: [], agua: [],
};

export function DiarioPanel() {
  const [loading, setLoading] = useState(false);
  const [registro_diario_id, setRegistro_diario_id] = useState<number | null>(null);
  const [resumen, setResumen] = useState<ResumenDiario>(RESUMEN_INICIAL);
  const [itemsPorSeccion, setItemsPorSeccion] = useState<Record<SectionKey, ItemDiario[]>>(ITEMS_INICIALES);
  
  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<SectionKey | null>(null);
  const [guardando, setGuardando] = useState(false);
  
  // Estados para alimentos
  const [listaAlimentosDB, setListaAlimentosDB] = useState<AlimentoBackend[]>([]);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState<string>('');
  const [cantidadInput, setCantidadInput] = useState(1);
  
  // Estados para crear alimento
  const [modoCrearAlimento, setModoCrearAlimento] = useState(false);
  const [nuevoAlimento, setNuevoAlimento] = useState({
    nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0
  });
  
  // Estados para agua/ejercicio
  const [aguaInput, setAguaInput] = useState(250);

  // Estados para Ejercicio
  const [ejercicioInput, setEjercicioInput] = useState({
    tipo: '',
    calorias: 0,
    minutos: 0
  });

  // Calcular calorías automáticamente cuando se crea alimento
  useEffect(() => {
    if (modoCrearAlimento) {
      const cals = (nuevoAlimento.proteinas * 4) + (nuevoAlimento.carbohidratos * 4) + (nuevoAlimento.grasas * 9);
      setNuevoAlimento(prev => ({ ...prev, calorias: Math.round(cals) }));
    }
  }, [nuevoAlimento.proteinas, nuevoAlimento.carbohidratos, nuevoAlimento.grasas, modoCrearAlimento]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      const userId = authService.getUsuario()?.id;
      const token = authService.getToken();
      
      if (!userId || !token) return;
      
      try {
        const res = await nutritionService.registroDiario.obtenerRegistroDiario(userId, token);
        const diarioId = res.data.id_registro_diario;
        setRegistro_diario_id(diarioId);
        
        if (diarioId) {
          await Promise.all([
            cargarDiarioCompleto(),
            cargarListaAlimentos()
          ]);
        }
      } catch (err) {
        console.error("Error obteniendo registro diario:", err);
      }
    };
    
    loadInitialData();
  }, []);

  const iniciarRegistroDiario = async () => {
    const userId = authService.getUsuario()?.id;
    const token = authService.getToken();
    
    if (!userId || !token) {
      alert("Usuario no autenticado");
      return;
    }
    
    try {
      const res = await nutritionService.registroDiario.iniciarRegistroDiario(userId, token);
      setRegistro_diario_id(res.data.id_registro_diario);
    } catch (err) {
      console.error("Error iniciando registro diario:", err);
    }
  };

  // Cargar datos del diario
  const cargarDiarioCompleto = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;

    try {
      setLoading(true);
      
      const [resComidas, resAgua, resEjercicios] = await Promise.all([
        nutritionService.comidas.listarComidas(token),
        nutritionService.agua.obtenerAguaHoy(token),
        nutritionService.ejercicio.obtenerEjerciciosHoy(token)
      ]);

      const todasLasComidas = resComidas.data as any[];
      const dataAgua = resAgua.data as any;
      const dataEjercicios = resEjercicios.data as any;
      const fechaLocal = new Date().toLocaleDateString('en-CA');

      const tempItems: Record<SectionKey, ItemDiario[]> = { ...ITEMS_INICIALES };
      let totalCaloriasComida = 0;

      // Procesar comidas
      const comidasHoy = todasLasComidas.filter(c => 
        String(c.fecha).substring(0, 10) === fechaLocal
      );

      for (const comida of comidasHoy) {
        const seccionKey = determinarSeccionComida(comida.nombre_comida);
        
        try {
          const resDetalle = await nutritionService.comidas.verAlimentosDeComida(comida.id_comida, token);
          const detalles = resDetalle.data;

          if (Array.isArray(detalles)) {
            const detallesFiltrados = detalles.filter((d: any) => d.id_comida === comida.id_comida);
            
            detallesFiltrados.forEach((d: any) => {
              const { itemDiario, calorias } = procesarDetalleAlimento(d);
              tempItems[seccionKey].push(itemDiario);
              totalCaloriasComida += calorias;
            });
          }
        } catch (err) {
          console.warn('Error detalle comida', comida.id_comida);
        }
      }

      // Procesar agua
      if (dataAgua.registros) {
        dataAgua.registros.forEach((reg: any) => {
          tempItems.agua.push({
            id_relacion: reg.id_agua,
            texto: `${reg.cantidad_ml} ml`
          });
        });
      }

      // Procesar ejercicio
      if (dataEjercicios.ejercicios) {
        dataEjercicios.ejercicios.forEach((reg: any) => {
          tempItems.ejercicio.push({
            id_relacion: reg.id_ejercicio,
            texto: `${reg.tipo} (${reg.duracion_minutos || '-'} min) - ${reg.calorias_quemadas} kcal`
          });
        });
      }

      setItemsPorSeccion(tempItems);
      setResumen({
        objetivo: 2000,
        alimento: Math.round(totalCaloriasComida),
        ejercicio: dataEjercicios.total_calorias || 0
      });
    } catch (error) {
      console.error("Error cargando diario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const determinarSeccionComida = (nombreComida: string): SectionKey => {
    const nombreNorm = nombreComida.toLowerCase();
    for (const key in NORMALIZAR_SECCION) {
      if (nombreNorm.includes(key)) {
        return NORMALIZAR_SECCION[key];
      }
    }
    return 'aperitivo';
  };

  const procesarDetalleAlimento = (detalle: any): { itemDiario: ItemDiario, calorias: number } => {
    const alim = detalle.Alimento || detalle.alimento;
    const cantidad = Number(detalle.cantidad) || 0;
    const gramos = Number(detalle.cantidad_gramos) || 0;
    const idRelacion = detalle.id_comida_alimento || detalle.id;
    
    let textoCant = '';
    let calCalculadas = 0;
    
    if (cantidad > 0) {
      textoCant = `x${cantidad}`;
      calCalculadas = alim.calorias * cantidad;
    } else if (gramos > 0) {
      textoCant = `${gramos}g`;
      calCalculadas = alim.calorias * (gramos / 100);
    } else {
      textoCant = 'x1';
      calCalculadas = alim.calorias;
    }
    
    return {
      itemDiario: {
        id_relacion: idRelacion,
        texto: `${alim.nombre} (${textoCant}) - ${Math.round(calCalculadas)} kcal`
      },
      calorias: calCalculadas
    };
  };

  const cargarListaAlimentos = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;
    
    try {
      const res = await nutritionService.alimentos.listarAlimentos(token);
      const rawData = Array.isArray(res.data) ? res.data : [];
      
      const listaLimpia = rawData
        .map((item: any) => ({
          id_alimento: item.id_alimento_consumido || item.id_alimento || item.id,
          nombre: item.nombre || "Sin nombre",
          calorias: item.calorias || 0
        }))
        .filter((item: any) => item.id_alimento);
      
      setListaAlimentosDB(listaLimpia);
    } catch (err) {
      console.error("Error cargando lista de alimentos", err);
    }
  }, []);

  const eliminarItemReal = async (seccion: SectionKey, id: number) => {
    if (!confirm("¿Eliminar este registro?")) return;
    
    const token = authService.getToken();
    if (!token) return;

    try {
      setLoading(true);
      
      if (seccion === 'agua') {
        await nutritionService.agua.eliminarAgua(id, token);
      } else if (seccion === 'ejercicio') {
        await nutritionService.ejercicio.eliminarEjercicio(id, token);
      } else {
        // Es comida
        await nutritionService.comidas.eliminarAlimentoDeComida(id, token);
      }
      
      await cargarDiarioCompleto();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar.");
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirAgregar = (seccion: SectionKey) => {
    setSeccionActiva(seccion);
    setModalOpen(true);
    setGuardando(false);
    setModoCrearAlimento(false);
    
    // Resetear valores según la sección
    if (seccion === 'agua') {
      setAguaInput(250);
    } else if (seccion === 'ejercicio') {
      setEjercicioInput({ tipo: '', calorias: 0, minutos: 0 });
    } else {
      setAlimentoSeleccionado('');
      setCantidadInput(1);
      setNuevoAlimento({ nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
    }
  };

  const handleGuardarComida = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = authService.getToken();
    if (!token || !seccionActiva || !alimentoSeleccionado || !MEAL_SECTIONS.includes(seccionActiva)) return;
    
    setGuardando(true);
    
    try {
      const resComidas = await nutritionService.comidas.listarComidas(token);
      const hoy = new Date().toLocaleDateString('en-CA');
      const nombreSeccion = SECTION_LABELS[seccionActiva];
      
      let comidaTarget = (resComidas.data as any[]).find(c =>
        String(c.fecha).substring(0, 10) === hoy &&
        c.nombre_comida.toLowerCase().includes(seccionActiva)
      );
      
      let idComida = comidaTarget?.id_comida;
      
      if (!idComida) {
        const fechaHoraHoy = new Date().toISOString();
        const resNueva = await nutritionService.comidas.crearComida({
          nombre_comida: nombreSeccion,
          fecha: fechaHoraHoy
        }, token);
        idComida = resNueva.data.id_comida;
      }
      
      await nutritionService.comidas.agregarAlimentoAComida({
        id_comida: idComida,
        id_alimento: Number(alimentoSeleccionado),
        cantidad_gramos: cantidadInput
      } as any, token);
      
      setModalOpen(false);
      await cargarDiarioCompleto();
    } catch (err) {
      console.error(err);
      alert("Error al guardar comida. Verifica la consola.");
    } finally {
      setGuardando(false);
    }
  };

  // GUARDADO: NUEVO ALIMENTO
  const handleCrearAlimento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = authService.getToken();
    if (!token) return;
    
    setGuardando(true);
    
    try {
      const payloadAlimento = {
        ...nuevoAlimento,
        gramos: 100
      };
      
      const res = await nutritionService.alimentos.crearAlimento(payloadAlimento as any, token);
      const nuevo = res.data as any;
      await cargarListaAlimentos();
      
      const nuevoId = nuevo.id_alimento_consumido || nuevo.id_alimento || nuevo.id;
      setAlimentoSeleccionado(String(nuevoId));
      setModoCrearAlimento(false);
    } catch (err) {
      console.error(err);
      alert("Error creando alimento.");
    } finally {
      setGuardando(false);
    }
  };

  // GUARDADO: AGUA
  const handleGuardarAgua = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = authService.getToken();
    if (!token) return;
    
    setGuardando(true);
    
    try {
      await nutritionService.agua.registrarAgua({ cantidad_ml: aguaInput }, token);
      setModalOpen(false);
      await cargarDiarioCompleto();
    } catch (err) {
      alert("Error guardando agua");
    } finally {
      setGuardando(false);
    }
  };

  // GUARDADO: EJERCICIO
  const handleGuardarEjercicio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = authService.getToken();
    if (!token) return;
    
    setGuardando(true);
    
    try {
      await nutritionService.ejercicio.registrarEjercicio({
        tipo: ejercicioInput.tipo,
        calorias_quemadas: ejercicioInput.calorias,
        duracion_minutos: ejercicioInput.minutos
      }, token);
      
      setModalOpen(false);
      await cargarDiarioCompleto();
    } catch (err) {
      alert("Error guardando ejercicio");
    } finally {
      setGuardando(false);
    }
  };

  // Memoización de datos del gráfico
  const { pieData, totalItems } = useMemo(() => {
    const valoresPie = MEAL_SECTIONS.map(sec => itemsPorSeccion[sec].length || 0);
    const total = valoresPie.reduce((a, b) => a + b, 0);
    
    const data = {
      labels: MEAL_SECTIONS.map(sec => SECTION_LABELS[sec]),
      datasets: [{
        data: valoresPie,
        backgroundColor: ['#4ade80', '#60a5fa', '#f97373', '#fbbf24'],
        borderWidth: 0
      }],
    };
    
    return { pieData: data, totalItems: total };
  }, [itemsPorSeccion]);

  const pieOptions = useMemo(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#cbd5e1' }
      }
    }
  }), []);

  const caloriasRestantes = useMemo(() => 
    resumen.objetivo - resumen.alimento + resumen.ejercicio,
  [resumen]);

  // Render de estados de carga
  if (registro_diario_id === null) {
    return (
      <div className="p-10 text-center text-slate-400">
        <button 
          className="text-xl text-emerald-400 hover:underline transition-all"
          onClick={iniciarRegistroDiario}
        >
          Iniciar registro
        </button>
      </div>
    );
  }

  if (loading && resumen.alimento === 0) {
    return <div className="p-10 text-center text-slate-400">Cargando diario...</div>;
  }

  return (
    <section className="w-full diario-panel relative flex flex-col gap-4">
      {/* RESUMEN */}
      <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
        <div className="flex w-full justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-white">Resumen Diario</h2>
        </div>
        <div className="flex w-full gap-4 text-center calorias-grid text-sm md:text-base text-slate-200">
          <ResumenItem valor={resumen.objetivo} label="Meta" />
          <Separador texto="-" />
          <ResumenItem valor={resumen.alimento} label="Comida" />
          <Separador texto="+" />
          <ResumenItem valor={resumen.ejercicio} label="Ejercicio" />
          <Separador texto="=" />
          <ResumenItem 
            valor={caloriasRestantes} 
            label="Restantes" 
            esRestante 
          />
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
        <h3 className="text-base font-semibold mb-3 text-center text-white">
          Distribución de comidas
        </h3>
        <div className="max-w-xs mx-auto h-48">
          {totalItems === 0 ? (
            <p className="text-xs opacity-40 italic text-center py-10 text-slate-300">
              Sin registros de comida hoy.
            </p>
          ) : (
            <Pie data={pieData} options={pieOptions} />
          )}
        </div>
      </div>

      {/* SECCIONES (Incluye Agua y Ejercicio) */}
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(SECTION_LABELS) as SectionKey[]).map(section => (
          <ComidaCard
            key={section}
            titulo={SECTION_LABELS[section]}
            items={itemsPorSeccion[section]}
            tipo={section === 'agua' ? 'agua' : section === 'ejercicio' ? 'ejercicio' : 'comida'}
            onAgregar={() => handleAbrirAgregar(section)}
            onEliminar={(id) => eliminarItemReal(section, id)}
          />
        ))}
      </div>

      {/* MODAL DINÁMICO */}
      {modalOpen && seccionActiva && (
        <ModalAgregar
          seccionActiva={seccionActiva}
          guardando={guardando}
          onClose={() => setModalOpen(false)}
          
          // Props para agua
          aguaInput={aguaInput}
          onAguaChange={setAguaInput}
          onGuardarAgua={handleGuardarAgua}
          
          // Props para ejercicio
          ejercicioInput={ejercicioInput}
          onEjercicioChange={setEjercicioInput}
          onGuardarEjercicio={handleGuardarEjercicio}
          
          // Props para comidas
          modoCrearAlimento={modoCrearAlimento}
          onToggleModoCrear={() => setModoCrearAlimento(!modoCrearAlimento)}
          listaAlimentosDB={listaAlimentosDB}
          alimentoSeleccionado={alimentoSeleccionado}
          onAlimentoSeleccionado={setAlimentoSeleccionado}
          cantidadInput={cantidadInput}
          onCantidadInput={setCantidadInput}
          onGuardarComida={handleGuardarComida}
          
          // Props para crear alimento
          nuevoAlimento={nuevoAlimento}
          onNuevoAlimentoChange={setNuevoAlimento}
          onCrearAlimento={handleCrearAlimento}
        />
      )}
    </section>
  );
}

// Componentes auxiliares
const ResumenItem: React.FC<{ 
  valor: number; 
  label: string; 
  esRestante?: boolean 
}> = ({ valor, label, esRestante = false }) => (
  <div className="flex flex-col flex-1">
    <p className={`text-xl font-bold ${esRestante ? (valor < 0 ? 'text-red-500' : 'text-emerald-400') : ''}`}>
      {valor}
    </p>
    <p className="text-xs uppercase opacity-50">{label}</p>
  </div>
);

const Separador: React.FC<{ texto: string }> = ({ texto }) => (
  <span className="self-center font-bold text-slate-500">{texto}</span>
);

export interface EjercicioInput {
  tipo: string;
  calorias: number;
  minutos: number;
}

export interface NuevoAlimentoInput {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

// Modal como componente separado para mejorar legibilidad
interface ModalAgregarProps {
  seccionActiva: SectionKey;
  guardando: boolean;
  onClose: () => void;
  
  // Agua
  aguaInput: number;
  onAguaChange: (value: number) => void;
  onGuardarAgua: (e: React.FormEvent) => Promise<void>;
  
  // Ejercicio
  ejercicioInput: EjercicioInput;
  onEjercicioChange: (value: EjercicioInput) => void;
  onGuardarEjercicio: (e: React.FormEvent) => Promise<void>;
  
  // Comidas
  modoCrearAlimento: boolean;
  onToggleModoCrear: () => void;
  listaAlimentosDB: AlimentoBackend[];
  alimentoSeleccionado: string;
  onAlimentoSeleccionado: (value: string) => void;
  cantidadInput: number;
  onCantidadInput: (value: number) => void;
  onGuardarComida: (e: React.FormEvent) => Promise<void>;
  
  // Crear alimento
  nuevoAlimento: NuevoAlimentoInput
  onNuevoAlimentoChange: (value: NuevoAlimentoInput) => void;
  onCrearAlimento: (e: React.FormEvent) => Promise<void>;
}

const ModalAgregar: React.FC<ModalAgregarProps> = ({
  seccionActiva,
  guardando,
  onClose,
  aguaInput,
  onAguaChange,
  onGuardarAgua,
  ejercicioInput,
  onEjercicioChange,
  onGuardarEjercicio,
  modoCrearAlimento,
  onToggleModoCrear,
  listaAlimentosDB,
  alimentoSeleccionado,
  onAlimentoSeleccionado,
  cantidadInput,
  onCantidadInput,
  onGuardarComida,
  nuevoAlimento,
  onNuevoAlimentoChange,
  onCrearAlimento
}) => {
  const renderFormAgua = () => (
    <form onSubmit={onGuardarAgua} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad (ml)</label>
        <input
          type="number"
          className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
          value={aguaInput}
          onChange={e => onAguaChange(Number(e.target.value))}
          min="1"
          required
        />
      </div>
      <ModalButtons onCancel={onClose} guardando={guardando} submitText="Guardar" />
    </form>
  );

  const renderFormEjercicio = () => (
    <form onSubmit={onGuardarEjercicio} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de ejercicio</label>
        <input
          type="text"
          className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
          value={ejercicioInput.tipo}
          onChange={e => onEjercicioChange({ ...ejercicioInput, tipo: e.target.value })}
          placeholder="Ej: Correr, Gym..."
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Calorías quemadas</label>
          <input
            type="number"
            className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
            value={ejercicioInput.calorias}
            onChange={e => onEjercicioChange({ ...ejercicioInput, calorias: Number(e.target.value) })}
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Duración (min)</label>
          <input
            type="number"
            className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
            value={ejercicioInput.minutos}
            onChange={e => onEjercicioChange({ ...ejercicioInput, minutos: Number(e.target.value) })}
            min="1"
          />
        </div>
      </div>
      <ModalButtons onCancel={onClose} guardando={guardando} submitText="Guardar" />
    </form>
  );

  const renderFormComida = () => {
    if (!modoCrearAlimento) {
      return (
        <form onSubmit={onGuardarComida} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Selecciona un alimento</label>
            <select
              className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
              value={alimentoSeleccionado}
              onChange={e => onAlimentoSeleccionado(e.target.value)}
              required
            >
              <option value="" className="text-slate-500">-- Buscar --</option>
              {listaAlimentosDB
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
                onClick={onToggleModoCrear}
                className="text-xs text-emerald-400 hover:underline"
              >
                ¿No está? Crear nuevo
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad (100 = 1 unidad)</label>
            <input
              type="number"
              className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
              value={cantidadInput}
              onChange={e => onCantidadInput(Number(e.target.value))}
              required
            />
            <p className="text-xs text-slate-500 mt-1">* Se divide por 100.</p>
          </div>
          <ModalButtons onCancel={onClose} guardando={guardando} submitText="Agregar" />
        </form>
      );
    }

    return (
      <form onSubmit={onCrearAlimento} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
          <input
            type="text"
            className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
            value={nuevoAlimento.nombre}
            onChange={e => onNuevoAlimentoChange({ ...nuevoAlimento, nombre: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Calorías (Auto)</label>
            <input
              type="number"
              className="w-full bg-slate-900 text-white border-emerald-500 p-2 rounded outline-none"
              value={nuevoAlimento.calorias}
              onChange={e => onNuevoAlimentoChange({ ...nuevoAlimento, calorias: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Proteínas</label>
            <input
              type="number"
              className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none"
              value={nuevoAlimento.proteinas}
              onChange={e => onNuevoAlimentoChange({ ...nuevoAlimento, proteinas: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Carbos</label>
            <input
              type="number"
              className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none"
              value={nuevoAlimento.carbohidratos}
              onChange={e => onNuevoAlimentoChange({ ...nuevoAlimento, carbohidratos: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Grasas</label>
            <input
              type="number"
              className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none"
              value={nuevoAlimento.grasas}
              onChange={e => onNuevoAlimentoChange({ ...nuevoAlimento, grasas: Number(e.target.value) })}
            />
          </div>
        </div>
        <ModalButtons
          onCancel={onToggleModoCrear}
          guardando={guardando}
          cancelText="Volver"
          submitText="Crear"
        />
      </form>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-slate-700">
        <div className="bg-emerald-700/20 p-4 border-b border-emerald-500/20">
          <h3 className="text-emerald-400 font-bold text-lg">
            Agregar a {SECTION_LABELS[seccionActiva]}
          </h3>
        </div>
        <div className="p-6">
          {seccionActiva === 'agua' && renderFormAgua()}
          {seccionActiva === 'ejercicio' && renderFormEjercicio()}
          {MEAL_SECTIONS.includes(seccionActiva) && renderFormComida()}
        </div>
      </div>
    </div>
  );
};

const ModalButtons: React.FC<{
  onCancel: () => void;
  guardando: boolean;
  cancelText?: string;
  submitText?: string;
}> = ({ onCancel, guardando, cancelText = "Cancelar", submitText = "Guardar" }) => (
  <div className="flex justify-end gap-3 mt-6">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
    >
      {cancelText}
    </button>
    <button
      type="submit"
      disabled={guardando}
      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
    >
      {guardando ? '...' : submitText}
    </button>
  </div>
);