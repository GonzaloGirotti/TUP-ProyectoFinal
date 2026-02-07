import type { SectionKey } from '../layout/types';

export const NORMALIZAR_SECCION: Record<string, SectionKey> = {
  'desayuno': 'desayuno',
  'almuerzo': 'almuerzo',
  'cena': 'cena',
  'merienda': 'aperitivo',
  'snack': 'aperitivo',
  'aperitivo': 'aperitivo'
};

export function normalizarSeccion(nombreComida: string): SectionKey {
  const nombreNorm = nombreComida.toLowerCase();
  for (const key in NORMALIZAR_SECCION) {
    if (nombreNorm.includes(key)) {
      return NORMALIZAR_SECCION[key];
    }
  }
  return 'aperitivo';
}