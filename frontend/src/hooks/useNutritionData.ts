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
    ejercicio: 0
  });
  const [itemsPorSeccion, setItemsPorSeccion] = useState<Record<SectionKey, ItemDiario[]>>({
    desayuno: [], almuerzo: [], cena: [], aperitivo: [],
    ejercicio: [], agua: [],
  });

  const cargarDiarioCompleto = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;

    try {
      const [resComidas, resAgua, resEjercicios] = await Promise.all([
        nutritionService.comidas.listarComidas(token),
        nutritionService.agua.obtenerAguaHoy(token),
        nutritionService.ejercicio.obtenerEjerciciosHoy(token)
      ]);

      const todasLasComidas = resComidas.data as any[];
      const fechaLocal = new Date().toLocaleDateString('en-CA');

      const tempItems: Record<SectionKey, ItemDiario[]> = {
        desayuno: [], almuerzo: [], cena: [], aperitivo: [],
        ejercicio: [], agua: []
      };

      let totalCaloriasComida = 0;

      const comidasHoy = todasLasComidas.filter(c =>
        String(c.fecha).substring(0, 10) === fechaLocal
      );

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

      setItemsPorSeccion({ ...tempItems });
      setResumen({
        objetivo: 2000,
        alimento: Math.round(totalCaloriasComida),
        ejercicio: resEjercicios.data.total_calorias || 0
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