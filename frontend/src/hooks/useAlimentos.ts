import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { nutritionService } from '../services/nutritionService';
import type { AlimentoBackend } from '../layout/types';

export const useAlimentos = () => {
  const [listaAlimentosDB, setListaAlimentosDB] = useState<AlimentoBackend[]>([]);
  const [creandoAlimento, setCreandoAlimento] = useState(false);
  const [nuevoAlimento, setNuevoAlimento] = useState({
    nombre: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  const cargarListaAlimentos = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;

    try {
      const res = await nutritionService.alimentos.listarAlimentos(token);
      console.log("ALIMENTOS RECIBIDOS DEL BACKEND:", res.data);

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
      throw err;
    }
  }, []);

  const crearAlimento = async () => {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token');

    const payloadAlimento = {
      ...nuevoAlimento,
      gramos: 100
    };

    const res = await nutritionService.alimentos.crearAlimento(payloadAlimento as any, token);
    const nuevo = res.data as any;
    const nuevoId = nuevo.id_alimento_consumido || nuevo.id_alimento || nuevo.id;

    await cargarListaAlimentos();
    
    return {
      id: nuevoId,
      nombre: nuevoAlimento.nombre,
      calorias: nuevoAlimento.calorias
    };
  };

  const calcularCaloriasAuto = () => {
    const cals = (nuevoAlimento.proteinas * 4) + 
                 (nuevoAlimento.carbohidratos * 4) + 
                 (nuevoAlimento.grasas * 9);
    setNuevoAlimento(prev => ({ ...prev, calorias: Math.round(cals) }));
  };

  return {
    listaAlimentosDB,
    creandoAlimento,
    nuevoAlimento,
    setCreandoAlimento,
    setNuevoAlimento,
    cargarListaAlimentos,
    crearAlimento,
    calcularCaloriasAuto,
  };
};