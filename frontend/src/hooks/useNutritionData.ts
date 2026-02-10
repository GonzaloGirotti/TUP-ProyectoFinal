import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { nutritionService } from '../services/nutritionService';
import type { SectionKey, ItemDiario, ResumenDiario } from '../layout/types';
import { normalizarSeccion } from '../utils/normalizadores';

export const useNutritionData = () => {
  const [registroDiarioId, setRegistroDiarioId] = useState<number | null>(null);
  const [resumen, setResumen] = useState<ResumenDiario>({
    objetivo: 2000,
    alimento: 0,
    ejercicio: 0,
    peso: 0
  });
  const [itemsPorSeccion, setItemsPorSeccion] = useState<Record<SectionKey, ItemDiario[]>>({
    desayuno: [], almuerzo: [], cena: [], aperitivo: [],
    ejercicio: [], agua: [], peso: []
  });

  const cargarDiarioCompleto = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;

    try {
      const [resComidas, resAgua, resEjercicios, resPesos] = await Promise.all([
        nutritionService.comidas.listarComidas(token),
        nutritionService.agua.obtenerAguaHoy(token),
        nutritionService.ejercicio.obtenerEjerciciosHoy(token),
        nutritionService.peso.verHistorialPesos(token)
      ]);

      const todasLasComidas = resComidas.data as any[];
      const fechaLocal = new Date().toLocaleDateString('en-CA');

      const tempItems: Record<SectionKey, ItemDiario[]> = {
        desayuno: [], almuerzo: [], cena: [], aperitivo: [],
        ejercicio: [], agua: [], peso: [] 
      };

      let totalCaloriasComida = 0;

      const hoy = new Date();
      const anio = hoy.getFullYear();
      const mes = hoy.getMonth();
      const dia = hoy.getDate();

      const comidasHoy = todasLasComidas.filter(c => {
        const fechaComida = new Date(c.fecha);
        // Comparamos año, mes y día de forma absoluta
        return fechaComida.getFullYear() === anio &&
          fechaComida.getMonth() === mes &&
          fechaComida.getDate() === dia;
      });

      console.log("Comidas filtradas para hoy:", comidasHoy.length);

      await Promise.all(comidasHoy.map(async (comida) => {
        try {
          const seccionKey = normalizarSeccion(comida.nombre_comida) as SectionKey;
          const resDetalle = await nutritionService.comidas.verAlimentosDeComida(comida.id_comida, token);
          const detalles = resDetalle.data;

          if (Array.isArray(detalles)) {
            detalles.forEach((d: any) => {
              const alim = d.Alimento || d.alimento;
              const gramos = Number(d.cantidad_gramos) || 0;
              const calCalculadas = Number(d.calorias_total) || (alim.calorias * (gramos / 100));

              tempItems[seccionKey].push({
                id_relacion: d.id_comida_alimento || d.id,
                texto: `${alim.nombre} (${gramos}g) - ${Math.round(calCalculadas)} kcal`
              });

              totalCaloriasComida += calCalculadas;
            });
          }
        } catch (err) {
          console.warn('Error detalle comida', comida.id_comida, err);
        }
      }));

      if (resAgua.data.registros) {
        resAgua.data.registros.forEach((reg: any) => {
          tempItems.agua.push({ id_relacion: reg.id_agua, texto: `${reg.cantidad_ml} ml` });
        });
      }

      if (resEjercicios.data.ejercicios) {
        resEjercicios.data.ejercicios.forEach((reg: any) => {
          tempItems.ejercicio.push({
            id_relacion: reg.id_ejercicio,
            texto: `${reg.tipo} (${reg.duracion_minutos || '-'} min) - ${reg.calorias_quemadas} kcal`
          });
        });
      }

      console.log("Pesos: ", resPesos.data);

      if(resPesos.data) {
        resPesos.data.forEach((reg: any) => {
            tempItems.peso.push({
              id_relacion: reg.id_peso,
              texto: `${reg.peso_kg} kg`
            });
            setResumen(prev => ({ ...prev, peso: reg.peso_kg }));
        });
      }

      setItemsPorSeccion({ ...tempItems });
      setResumen({
        objetivo: 2000,
        alimento: Math.round(totalCaloriasComida),
        ejercicio: resEjercicios.data.total_calorias || 0,
        peso: resPesos.data.pesos.length > 0 ? resPesos.data.pesos[resPesos.data.pesos.length - 1].peso_kg : 0
      });
    } catch (error) {
      console.error("Error cargando diario:", error);
    }
  }, []);

  const iniciarRegistroDiario = async () => {
    const usuario = authService.getUsuario();
    const token = authService.getToken();

    if (!usuario?.id || !token) {
      throw new Error("Usuario no autenticado");
    }

    const res = await nutritionService.registroDiario.iniciarRegistroDiario(usuario.id, token);
    const id = res.data.id_registro_diario;
    setRegistroDiarioId(id);
    return id;
  };

  const eliminarItem = async (seccion: SectionKey, id: number) => {
    const token = authService.getToken();
    if (!token) return;

    if (seccion === 'agua') await nutritionService.agua.eliminarAgua(id, token);
    else if (seccion === 'ejercicio') await nutritionService.ejercicio.eliminarEjercicio(id, token);
    else if (seccion === 'peso') await nutritionService.peso.eliminarPeso(id, token);
    else await nutritionService.comidas.eliminarAlimentoDeComida(id, token);
  };

  return {
    registroDiarioId,
    resumen,
    itemsPorSeccion,
    setRegistroDiarioId,
    cargarDiarioCompleto,
    iniciarRegistroDiario,
    eliminarItem,
  };
};