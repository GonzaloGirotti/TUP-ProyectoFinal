export type SectionKey = 'desayuno' | 'almuerzo' | 'cena' | 'aperitivo' | 'ejercicio' | 'agua' | 'peso';
export type MealSectionKey = 'desayuno' | 'almuerzo' | 'cena' | 'aperitivo';

export interface AlimentoBackend {
  id_alimento: number;
  nombre: string;
  calorias: number;
}

export interface ResumenDiario {
  objetivo: number;
  alimento: number;
  ejercicio: number;
  peso: number;
}

export interface ItemDiario {
  id_relacion: number;
  texto: string;
}

export interface EjercicioInput {
  tipo: string;
  calorias: number;
  minutos: number;
}

export interface NuevoAlimento {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  aperitivo: 'Aperitivo',
  ejercicio: 'Ejercicio',
  agua: 'Agua',
  peso: 'Peso'
};