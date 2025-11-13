// Tipos base
export type Macros = {
  protein: number;
  carbs: number;
  fat: number;
};

export type Alimento = {
  id: string;              
  nombre: string;
  cantidadGramos?: number; 
  calorias?: number;       
  macros: Partial<Macros>; 
};

export type TipoComida = 'desayuno' | 'almuerzo' | 'cena' | 'aperitivo';

export type Comidas = {
  desayuno: Alimento[];
  almuerzo: Alimento[];
  cena: Alimento[];
  aperitivo: Alimento[];
};

export type Registro = {
  fecha: string;   // ISO string -> más cómodo para guardar en storage / API
  comidas: Comidas;
};



