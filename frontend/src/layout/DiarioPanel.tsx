import React, { useEffect, useState, useCallback } from 'react';
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
import type { SectionKey } from './types';
import { SECTION_LABELS } from './types';
import { nutritionService } from '../services/nutritionService';
import { authService } from '../services/authService';
import axios from 'axios';

// Interface para la respuesta de comidas
interface ComidaResponse {
  id_comida: number;
  nombre_comida: string;
  fecha: string;
  id_usuario?: number;
}

const MEAL_SECTIONS = ['desayuno', 'almuerzo', 'cena', 'aperitivo'];

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

  // Helper function para obtener o crear una comida
  const obtenerOCrearComida = useCallback(async (
    token: string, 
    seccion: string
  ): Promise<number> => {
    try {
      const resComidas = await nutritionService.comidas.listarComidas(token);
      const hoy = new Date().toISOString().split('T')[0];
      
      const comidas: ComidaResponse[] = resComidas.data as ComidaResponse[];
      const comidaExistente = comidas.find(c => {
        const fechaComida = new Date(c.fecha).toISOString().split('T')[0];
        return fechaComida === hoy && 
               c.nombre_comida.toLowerCase().includes(seccion);
      });
      
      if (comidaExistente) {
        return comidaExistente.id_comida;
      }
      
      // Crear nueva comida si no existe
      const resNueva = await nutritionService.comidas.crearComida({
        nombre_comida: SECTION_LABELS[seccion as SectionKey],
        fecha: new Date().toISOString()
      }, token);
      
      return (resNueva.data as any).id_comida;
    } catch (error) {
      console.error('Error en obtenerOCrearComida:', error);
      throw error;
    }
  }, []);

  // Cargar datos iniciales con cleanup
  useEffect(() => {
    let isMounted = true;
    
    const cargarDatos = async () => {
      try {
        if (registroDiarioId) {
          await Promise.all([
            cargarDiarioCompleto(),
            cargarListaAlimentos()
          ]);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error cargando datos:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarDatos();
    
    return () => {
      isMounted = false;
    };
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
    
      
      const idComida = await obtenerOCrearComida(token, seccionActiva);
      
      // Payload corregido según la interfaz ComidaAlimentoPayload
      await nutritionService.comidas.agregarAlimentoAComida({
        id_comida: idComida,
        id_alimento: idAlimento, // Solo este campo, no id_alimento_consumido
        cantidad_gramos: cantidad
      }, token);

      cerrarModal();
      await cargarDiarioCompleto();
    } catch (err: unknown) {
    console.error("Error detallado al guardar comida:", err);
    
    // CORRECCIÓN: Hacer type narrowing
    let mensajeError = "Error al guardar comida.";
    
    // Verificar si es un error de axios
    if (axios.isAxiosError(err)) {
      // Ahora TypeScript sabe que err es AxiosError
      if (err.response?.status === 404) {
        mensajeError = "Ruta no encontrada. Verificar configuración de endpoints.";
      } else if (err.response?.status === 400) {
        mensajeError = "Datos inválidos. Verificar los campos enviados.";
      } else if (err.response?.status === 401) {
        mensajeError = "Sesión expirada. Por favor, inicia sesión nuevamente.";
      } else if (err.response?.status === 500) {
        mensajeError = "Error interno del servidor. Intenta nuevamente más tarde.";
      } else if (err.message) {
        mensajeError = err.message;
      }
    } else if (err instanceof Error) {
      // Es un Error estándar de JavaScript
      mensajeError = err.message;
    }
    
    alert(mensajeError);
  } finally {
    setGuardando(false);
  }
};

  const handleGuardarAgua = async (cantidadMl: number) => {
    const token = authService.getToken();
    if (!token) return;

    setGuardando(true);
    
    try {
      await nutritionService.agua.registrarAgua({ 
        cantidad_ml: cantidadMl 
      }, token);
      
      cerrarModal();
      await cargarDiarioCompleto();
    } catch (err) {
      console.error("Error guardando agua:", err);
      alert("Error guardando agua");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarEjercicio = async (
    tipo: string, 
    calorias: number, 
    minutos: number
  ) => {
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
      console.error("Error guardando ejercicio:", err);
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

              {MEAL_SECTIONS.includes(seccionActiva) && (
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