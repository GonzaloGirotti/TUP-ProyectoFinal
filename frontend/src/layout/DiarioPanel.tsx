import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './diarioPanel.css';
import { nutritionService } from '../services/nutritionService';
import { authService } from '../services/authService';
import { ComidaCard, type ItemDiario } from '../components/ComidaCard';

// --- TIPOS ---
type SectionKey = 'desayuno' | 'almuerzo' | 'cena' | 'aperitivo' | 'ejercicio' | 'agua';
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

interface AlimentoBackend {
  id_alimento: number;
  nombre: string;
  calorias: number;
}

export function DiarioPanel() {
  const [loading, setLoading] = useState(true);
  const [registro_diario_id, setRegistro_diario_id] = useState<number | null>(null);

  // Resumen
  const [resumen, setResumen] = useState({
    objetivo: 2000,
    alimento: 0,
    ejercicio: 0
  });

  // Items visuales
  const [itemsPorSeccion, setItemsPorSeccion] = useState<Record<SectionKey, ItemDiario[]>>({
    desayuno: [], almuerzo: [], cena: [], aperitivo: [],
    ejercicio: [], agua: [],
  });

  // ESTADOS DEL MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<SectionKey | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Estados Comidas
  const [listaAlimentosDB, setListaAlimentosDB] = useState<AlimentoBackend[]>([]);

  // Usamos string para el select
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState<string>('');

  const [cantidadInput, setCantidadInput] = useState(1);

  // Estados Crear Alimento
  const [modoCrearAlimento, setModoCrearAlimento] = useState(false);
  const [nuevoAlimento, setNuevoAlimento] = useState({
    nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0
  });

  // Estados Agua/Ejercicio
  const [aguaInput, setAguaInput] = useState(250);
  const [ejercicioInput, setEjercicioInput] = useState({ tipo: '', calorias: 0, minutos: 0 });

  // Efecto: Calcular calorías auto
  useEffect(() => {
    if (modoCrearAlimento) {
      const cals = (nuevoAlimento.proteinas * 4) + (nuevoAlimento.carbohidratos * 4) + (nuevoAlimento.grasas * 9);
      setNuevoAlimento(prev => ({ ...prev, calorias: Math.round(cals) }));
    }
  }, [nuevoAlimento.proteinas, nuevoAlimento.carbohidratos, nuevoAlimento.grasas, modoCrearAlimento]);

  useEffect(() => {

    const userId = authService.getUsuario()?.id;
    const token = authService.getToken();

    const diarioID = nutritionService.registroDiario.obtenerRegistroDiario(userId!, token!);
    diarioID.then(res => {
      console.log("Registro Diario ID:", res.data.id_registro_diario);
      setRegistro_diario_id(res.data.id_registro_diario);
    }).catch(err => {
      console.error("Error obteniendo registro diario:", err);
    });

    if (registro_diario_id){
      cargarDiarioCompleto();
      cargarListaAlimentos();
    }
  }, []);


  const iniciarRegistroDiario = async () => {
    const userId = authService.getUsuario()?.id;
    const token = authService.getToken();
    if (!userId || !token) {
      alert("Usuario no autenticado");
      return;
    }
    try {
      const res = await nutritionService.registroDiario.iniciarRegistroDiario(userId!, token!);
      console.log("Registro Diario Iniciado:", res.data);
      setRegistro_diario_id(res.data.id_registro_diario);
    } catch (err) {
      console.error("Error iniciando registro diario:", err);
    }
  };

  // CARGA DE DATOS (Backend Real)
  const cargarDiarioCompleto = async () => {
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

      const tempItems: Record<SectionKey, ItemDiario[]> = {
        desayuno: [], almuerzo: [], cena: [], aperitivo: [],
        ejercicio: [], agua: []
      };

      let totalCaloriasComida = 0;

      // 1. Procesar Comidas
      const comidasHoy = todasLasComidas.filter(c => String(c.fecha).substring(0, 10) === fechaLocal);

      for (const comida of comidasHoy) {
        let seccionKey: SectionKey = 'aperitivo';
        const nombreNorm = comida.nombre_comida.toLowerCase();
        for (const key in NORMALIZAR_SECCION) {
          if (nombreNorm.includes(key)) { seccionKey = NORMALIZAR_SECCION[key]; break; }
        }

        try {
          const resDetalle = await nutritionService.comidas.verAlimentosDeComida(comida.id_comida, token);
          const detalles = resDetalle.data;

          if (Array.isArray(detalles)) {
            const detallesFiltrados = detalles.filter((d: any) => d.id_comida === comida.id_comida);

            detallesFiltrados.forEach((d: any) => {
              const alim = d.Alimento || d.alimento;
              const cantidad = Number(d.cantidad) || 0;
              const gramos = Number(d.cantidad_gramos) || 0;

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

              // Intentamos obtener el ID de la relación de varias formas posibles
              const idRelacion = d.id_comida_alimento || d.id;

              tempItems[seccionKey].push({
                id_relacion: idRelacion,
                texto: `${alim.nombre} (${textoCant}) - ${Math.round(calCalculadas)} kcal`
              });

              totalCaloriasComida += calCalculadas;
            });
          }
        } catch (err) { console.warn('Error detalle comida', comida.id_comida); }
      }

      // 2. Procesar Agua
      if (dataAgua.registros) {
        dataAgua.registros.forEach((reg: any) => {
          tempItems.agua.push({
            id_relacion: reg.id_agua,
            texto: `${reg.cantidad_ml} ml`
          });
        });
      }

      // 3. Procesar Ejercicio
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
  };

  //  Diagnóstico de datos
  const cargarListaAlimentos = async () => {
    const token = authService.getToken();
    if (token) {
      try {
        const res = await nutritionService.alimentos.listarAlimentos(token);

        // Mira la consola del navegador
        console.log("ALIMENTOS RECIBIDOS DEL BACKEND:", res.data);

        // Aseguramos que sea array
        const rawData = Array.isArray(res.data) ? res.data : [];

        const listaLimpia = rawData.map((item: any) => ({
          id_alimento: item.id_alimento_consumido || item.id_alimento || item.id,
          nombre: item.nombre || "Sin nombre",
          calorias: item.calorias || 0
        })).filter((item: any) => item.id_alimento); // Eliminar si no tiene ID

        setListaAlimentosDB(listaLimpia);
      } catch (err) {
        console.error("Error cargando lista de alimentos", err);
      }
    }
  };

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
        await nutritionService.comidas.eliminarAlimentoDeComida(id, token);
      }
      await cargarDiarioCompleto();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar.");
      setLoading(false);
    }
  };

  // ABRIR MODAL ---
  const handleAbrirAgregar = (seccion: SectionKey) => {
    setSeccionActiva(seccion);
    setModalOpen(true);
    setGuardando(false);

    if (seccion === 'agua') setAguaInput(250);
    if (seccion === 'ejercicio') setEjercicioInput({ tipo: '', calorias: 0, minutos: 0 });

    setModoCrearAlimento(false);
    setAlimentoSeleccionado('');
    setCantidadInput(1);
    setNuevoAlimento({ nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  };

  // HANDLERS DE GUARDADO
  const handleGuardarComida = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = authService.getToken();
    // Validar string no vacío
    if (!token || !seccionActiva || !alimentoSeleccionado) return;

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
          nombre_comida: nombreSeccion, fecha: fechaHoraHoy
        }, token);
        idComida = resNueva.data.id_comida;
      }

      // Usamos 'as any' para bypassear la restricción de TS si el servicio aún no está actualizado
      await nutritionService.comidas.agregarAlimentoAComida({
        id_comida: idComida,
        id_alimento_consumido: Number(alimentoSeleccionado),
        id_alimento: Number(alimentoSeleccionado),
        cantidad_gramos: cantidadInput
      } as any, token);

      setModalOpen(false);
      cargarDiarioCompleto();
    } catch (err) {
      console.error(err);
      alert("Error al guardar comida. Verifica la consola.");
    }
    finally { setGuardando(false); }
  };

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

      // Convertir ID a string para el estado. Buscamos el ID correcto.
      const nuevoId = nuevo.id_alimento_consumido || nuevo.id_alimento || nuevo.id;
      setAlimentoSeleccionado(String(nuevoId));

      setModoCrearAlimento(false);
    } catch (err) {
      console.error(err);
      alert("Error creando alimento.");
    }
    finally { setGuardando(false); }
  };

  const handleGuardarAgua = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = authService.getToken();
    if (!token) return;
    setGuardando(true);
    try {
      await nutritionService.agua.registrarAgua({ cantidad_ml: aguaInput }, token);
      setModalOpen(false);
      cargarDiarioCompleto();
    } catch (err) { alert("Error guardando agua"); }
    finally { setGuardando(false); }
  };

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
      cargarDiarioCompleto();
    } catch (err) { alert("Error guardando ejercicio"); }
    finally { setGuardando(false); }
  };

  // RENDER 
  const mealSections: SectionKey[] = ['desayuno', 'almuerzo', 'cena', 'aperitivo'];
  const valoresPie = mealSections.map(sec => itemsPorSeccion[sec].length || 0);
  const totalItems = valoresPie.reduce((a, b) => a + b, 0);

  const pieData = {
    labels: mealSections.map(sec => SECTION_LABELS[sec]),
    datasets: [{ data: valoresPie, backgroundColor: ['#4ade80', '#60a5fa', '#f97373', '#fbbf24'], borderWidth: 0 }],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#cbd5e1' } } }
  };

  if(registro_diario_id === null) return <div className="p-10 text-center text-slate-400">
    <button className="text-xl text-emerald-400 hover:underline" onClick={() => iniciarRegistroDiario()}>Iniciar registro</button>
  </div>;

  if (loading && resumen.alimento === 0) return <div className="p-10 text-center text-slate-400">Cargando diario...</div>;

  return (
    <section className="w-full diario-panel relative flex flex-col gap-4">
      {/* ... RESUMEN ... */}
      <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
        <div className="flex w-full justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-white">Resumen Diario</h2>
        </div>
        <div className="flex w-full gap-4 text-center calorias-grid text-sm md:text-base text-slate-200">
          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold">{resumen.objetivo}</p>
            <p className="text-xs uppercase opacity-50">Meta</p>
          </div>
          <span className="self-center font-bold text-slate-500">-</span>
          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold">{resumen.alimento}</p>
            <p className="text-xs uppercase opacity-50">Comida</p>
          </div>
          <span className="self-center font-bold text-slate-500">+</span>
          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold">{resumen.ejercicio}</p>
            <p className="text-xs uppercase opacity-50">Ejercicio</p>
          </div>
          <span className="self-center font-bold text-slate-500">=</span>
          <div className="flex flex-col flex-1">
            <p className={`text-xl font-extrabold ${resumen.objetivo - resumen.alimento + resumen.ejercicio < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              {resumen.objetivo - resumen.alimento + resumen.ejercicio}
            </p>
            <p className="text-xs uppercase opacity-50">Restantes</p>
          </div>
        </div>
      </div>

      {/* ... GRÁFICO ... */}
      <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
        <h3 className="text-base font-semibold mb-3 text-center text-white">Distribución de comidas</h3>
        <div className="max-w-xs mx-auto h-48">
          {totalItems === 0 ? (
            <p className="text-xs opacity-40 italic text-center py-10 text-slate-300">Sin registros de comida hoy.</p>
          ) : (
            <Pie data={pieData} options={pieOptions} />
          )}
        </div>
      </div>

      {/* SECCIONES */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-slate-700">
            <div className="bg-emerald-700/20 p-4 border-b border-emerald-500/20">
              <h3 className="text-emerald-400 font-bold text-lg">
                Agregar a {SECTION_LABELS[seccionActiva]}
              </h3>
            </div>

            <div className="p-6">

              {/* FORM AGUA */}
              {seccionActiva === 'agua' && (
                <form onSubmit={handleGuardarAgua} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad (ml)</label>
                    <input type="number" className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
                      value={aguaInput} onChange={e => setAguaInput(Number(e.target.value))} min="1" required />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" disabled={guardando} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">{guardando ? '...' : 'Guardar'}</button>
                  </div>
                </form>
              )}

              {/* FORM EJERCICIO */}
              {seccionActiva === 'ejercicio' && (
                <form onSubmit={handleGuardarEjercicio} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de ejercicio</label>
                    <input type="text" className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
                      value={ejercicioInput.tipo} onChange={e => setEjercicioInput({ ...ejercicioInput, tipo: e.target.value })} placeholder="Ej: Correr, Gym..." required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Calorías quemadas</label>
                      <input type="number" className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
                        value={ejercicioInput.calorias} onChange={e => setEjercicioInput({ ...ejercicioInput, calorias: Number(e.target.value) })} min="1" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Duración (min)</label>
                      <input type="number" className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
                        value={ejercicioInput.minutos} onChange={e => setEjercicioInput({ ...ejercicioInput, minutos: Number(e.target.value) })} min="1" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" disabled={guardando} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">{guardando ? '...' : 'Guardar'}</button>
                  </div>
                </form>
              )}

              {/* FORM COMIDAS */}
              {['desayuno', 'almuerzo', 'cena', 'aperitivo'].includes(seccionActiva) && (
                !modoCrearAlimento ? (
                  <form onSubmit={handleGuardarComida} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Selecciona un alimento</label>

                      {/* FIX: Select robusto que maneja strings y vacíos correctamente */}
                      <select className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
                        value={alimentoSeleccionado}
                        onChange={(e) => setAlimentoSeleccionado(e.target.value)}
                        required>
                        <option value="" className="text-slate-500">-- Buscar --</option>
                        {/* Filtro de seguridad y Mapeo de ID correcto */}
                        {listaAlimentosDB
                          .filter(ali => ali.id_alimento) // Asegura que tenga ID
                          .map(ali => (
                            <option key={ali.id_alimento} value={String(ali.id_alimento)}>
                              {ali.nombre} ({ali.calorias} kcal)
                            </option>
                          ))}
                      </select>

                      <div className="mt-2 text-right">
                        <button type="button" onClick={() => setModoCrearAlimento(true)} className="text-xs text-emerald-400 hover:underline">¿No está? Crear nuevo</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad (100 = 1 unidad)</label>
                      <input type="number" className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
                        value={cantidadInput} onChange={e => setCantidadInput(Number(e.target.value))} required />
                      <p className="text-xs text-slate-500 mt-1">* Se divide por 100.</p>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
                      <button type="submit" disabled={guardando} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">{guardando ? '...' : 'Agregar'}</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleCrearAlimento} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                      <input type="text" className="w-full border border-slate-600 rounded-lg p-2.5 bg-slate-900 text-white focus:ring-emerald-500 outline-none"
                        value={nuevoAlimento.nombre} onChange={e => setNuevoAlimento({ ...nuevoAlimento, nombre: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm text-slate-300">Calorías (Auto)</label><input type="number" className="w-full bg-slate-900 text-white border-emerald-500 p-2 rounded outline-none" value={nuevoAlimento.calorias} onChange={e => setNuevoAlimento({ ...nuevoAlimento, calorias: Number(e.target.value) })} /></div>
                      <div><label className="text-sm text-slate-300">Proteínas</label><input type="number" className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none" value={nuevoAlimento.proteinas} onChange={e => setNuevoAlimento({ ...nuevoAlimento, proteinas: Number(e.target.value) })} /></div>
                      <div><label className="text-sm text-slate-300">Carbos</label><input type="number" className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none" value={nuevoAlimento.carbohidratos} onChange={e => setNuevoAlimento({ ...nuevoAlimento, carbohidratos: Number(e.target.value) })} /></div>
                      <div><label className="text-sm text-slate-300">Grasas</label><input type="number" className="w-full bg-slate-900 text-white border-slate-600 p-2 rounded outline-none" value={nuevoAlimento.grasas} onChange={e => setNuevoAlimento({ ...nuevoAlimento, grasas: Number(e.target.value) })} /></div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button type="button" onClick={() => setModoCrearAlimento(false)} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">Volver</button>
                      <button type="submit" disabled={guardando} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">Crear</button>
                    </div>
                  </form>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}