import type { Alimento, Registro, TipoComida, Macros } from '../types/registro';

export function sumarMacros(alimentos: Alimento[]): Macros {
  return alimentos.reduce<Macros>(
    (acc, item) => ({
      protein: acc.protein + (item.macros.protein ?? 0),
      carbs: acc.carbs + (item.macros.carbs ?? 0),
      fat: acc.fat + (item.macros.fat ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );
}

export function macrosPorTipo(
  registro: Registro,
  tipo: TipoComida
): Macros {
  const lista = registro.comidas[tipo];
  return sumarMacros(lista);
}

export function macrosTotales(registro: Registro): Macros {
  const tipos: TipoComida[] = ['desayuno', 'almuerzo', 'cena', 'aperitivo'];

  return tipos.reduce<Macros>(
    (acc, tipo) => {
      const m = macrosPorTipo(registro, tipo);
      return {
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );
}


const KCAL_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

export function toCalories(m: Macros) {
  return {
    protein: m.protein * KCAL_PER_GRAM.protein,
    carbs: m.carbs * KCAL_PER_GRAM.carbs,
    fat: m.fat * KCAL_PER_GRAM.fat,
  };
}

export function toPercentages(m:Macros): Macros{
  const kcal = toCalories(m);
  const total = Math.max(1, kcal.protein + kcal.carbs + kcal.fat);

  return  {
    protein: Number(((kcal.protein / total) * 100).toFixed(2)),
    carbs: Number(((kcal.carbs / total) * 100).toFixed(2)),
    fat: Number(((kcal.fat / total) * 100).toFixed(2)),
  };
}

