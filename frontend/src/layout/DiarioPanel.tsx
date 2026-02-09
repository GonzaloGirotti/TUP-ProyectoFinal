import React, { useEffect, useState } from 'react';
import './diarioPanel.css';
import { ComidaCard } from '../components/ComidaCard';
import { useNutritionData } from '../hooks/useNutritionData';
import { useModalHandlers } from '../hooks/useModalHandlers';
import { useAlimentos } from '../hooks/useAlimentos';
import { ResumenDiario } from '../components/ResumenDiario';
import { GraficoDistribucion } from '../components/GraficoDistribucion';
import { ModalAgregarComida } from '../components/ModalAgregarComida';
import { ModalAgregarAgua } from '../components/ModalAgregarAgua';
import { ModalAgregarEjercicio } from '../components/ModalAgregarEjercicio';
import { PanelReportes } from '../components/PanelReportes';
import type { SectionKey } from './types';
import { SECTION_LABELS } from './types';
import { nutritionService } from '../services/nutritionService';
import { authService } from '../services/authService';

export function DiarioPanel() {
  const [loading, setLoading] = useState(true);

  const {
    registroDiarioId,
    resumen,
    itemsPorSeccion,
    setRegistroDiarioId,
    cargarDiarioCompleto,
    iniciarRegistroDiario,
    eliminarItem,
  } = useNutritionData();

  const {
    modalOpen,
    seccionActiva,
    guardando,
    setGuardando,
    abrirModal,
    cerrarModal,
  } = useModalHandlers();

  const {
    listaAlimentosDB,
    cargarListaAlimentos,
  } = useAlimentos();

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (registroDiarioId) {
          await Promise.all([
            cargarDiarioCompleto(),
            cargarListaAlimentos()
          ]);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [registroDiarioId, cargarDiarioCompleto, cargarListaAlimentos]);

  const handleEliminarItem = async (seccion: SectionKey, id: number) => {
    if (!confirm("¿Eliminar este registro?")) return;

    try {
      setLoading(true);
      await eliminarItem(seccion, id);
      await cargarDiarioCompleto();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar.");
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarRegistro = async () => {
    try {
      const id = await iniciarRegistroDiario();
      setRegistroDiarioId(id);
    } catch (error) {
      console.error("Error iniciando registro:", error);
      alert("Error al iniciar el registro diario");
    }
  };

  const handleGuardarComida = async (idAlimento: number, cantidad: number) => {
    const token = authService.getToken();
    if (!token || !seccionActiva) return;

    setGuardando(true);
    try {
      const resComidas = await nutritionService.comidas.listarComidas(token);
      const hoy = new Date().toLocaleDateString('en-CA');
      const nombreSeccion = SECTION_LABELS[seccionActiva as SectionKey];

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

      if(cantidad < 100) {
        alert("Cantidad muy baja, ingresa al menos 100 gramos");
        return;
      }

      await nutritionService.comidas.agregarAlimentoAComida({
        id_comida: idComida,
        id_alimento_consumido: idAlimento,
        id_alimento: idAlimento,
        cantidad_gramos: cantidad
      } as any, token);

      cerrarModal();
      await cargarDiarioCompleto();
    } catch (err) {
      console.error(err);
      alert("Error al guardar comida. Verifica la consola.");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarAgua = async (cantidadMl: number) => {
    const token = authService.getToken();
    if (!token) return;

    setGuardando(true);
    try {
      await nutritionService.agua.registrarAgua({ cantidad_ml: cantidadMl }, token);
      cerrarModal();
      await cargarDiarioCompleto();
    } catch (err) {
      alert("Error guardando agua");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarEjercicio = async (tipo: string, calorias: number, minutos: number) => {
    const token = authService.getToken();
    if (!token) return;

    setGuardando(true);
    try {
      await nutritionService.ejercicio.registrarEjercicio({
        tipo,
        calorias_quemadas: calorias,
        duracion_minutos: minutos
      }, token);
      cerrarModal();
      await cargarDiarioCompleto();
    } catch (err) {
      alert("Error guardando ejercicio");
    } finally {
      setGuardando(false);
    }
  };

  if (registroDiarioId === null) {
    return (
      <div className="p-10 text-center text-slate-400">
        <button
          className="text-xl text-emerald-400 hover:underline"
          onClick={handleIniciarRegistro}
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
      <ResumenDiario resumen={resumen} />
      <GraficoDistribucion itemsPorSeccion={itemsPorSeccion} />

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(SECTION_LABELS) as SectionKey[]).map(section => (
          <ComidaCard
            key={section}
            titulo={SECTION_LABELS[section]}
            items={itemsPorSeccion[section]}
            tipo={section === 'agua' ? 'agua' : section === 'ejercicio' ? 'ejercicio' : 'comida'}
            onAgregar={() => abrirModal(section)}
            onEliminar={(id) => handleEliminarItem(section, id)}
          />
        ))}
      </div>

      {/* SECCIÓN DE REPORTES AÑADIDA */}
      <PanelReportes />

      {modalOpen && seccionActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-slate-700">
            <div className="bg-emerald-700/20 p-4 border-b border-emerald-500/20">
              <h3 className="text-emerald-400 font-bold text-lg">
                Agregar a {SECTION_LABELS[seccionActiva as SectionKey]}
              </h3>
            </div>

            <div className="p-6">
              {seccionActiva === 'agua' && (
                <ModalAgregarAgua
                  onGuardar={handleGuardarAgua}
                  onCancelar={cerrarModal}
                  guardando={guardando}
                />
              )}

              {seccionActiva === 'ejercicio' && (
                <ModalAgregarEjercicio
                  onGuardar={handleGuardarEjercicio}
                  onCancelar={cerrarModal}
                  guardando={guardando}
                />
              )}

              {['desayuno', 'almuerzo', 'cena', 'aperitivo'].includes(seccionActiva) && (
                <ModalAgregarComida
                  listaAlimentos={listaAlimentosDB}
                  onGuardar={handleGuardarComida}
                  onCancelar={cerrarModal}
                  guardando={guardando}
                  onAlimentoCreado={cargarListaAlimentos}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}