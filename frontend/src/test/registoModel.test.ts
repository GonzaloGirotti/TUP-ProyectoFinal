import { describe, it, expect } from 'vitest';
import {
  sumarMacros,
  macrosPorTipo,
  macrosTotales,
  toCalories,
  toPercentages
} from '../models/registro.model';
import type { Macros, Registro } from '../types/registro';
import { toPercentage } from 'chart.js/helpers';


describe('registroModel', () => {
  it('sumarMacros suma correctamente los macros de una lista de alimentos', () => {
    const alimentos = [
      {
        id: '1',
        nombre: 'Pollo',
        macros: { protein: 30, carbs: 0, fat: 5 },
      },
      {
        id: '2',
        nombre: 'Arroz',
        macros: { protein: 5, carbs: 40, fat: 1 },
      },
    ];

    const resultado = sumarMacros(alimentos);

    expect(resultado).toEqual({
      protein: 35,
      carbs: 40,
      fat: 6,
    });
  });

  it('sumarMacros maneja lista vacía devolviendo ceros', () => {
    const resultado = sumarMacros([]);

    expect(resultado).toEqual({
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it('sumarMacros maneja macros parciales (faltan campos)', () => {
    const alimentos = [
      {
        id: '1',
        nombre: 'Alimento 1',
        macros: { protein: 10 }, // solo proteína
      },
      {
        id: '2',
        nombre: 'Alimento 2',
        macros: { carbs: 20 }, // solo carbs
      },
      {
        id: '3',
        nombre: 'Alimento 3',
        macros: { fat: 5 }, // solo grasa
      },
    ];

    const resultado = sumarMacros(alimentos);

    expect(resultado).toEqual({
      protein: 10,
      carbs: 20,
      fat: 5,
    });
  });

  it('macrosPorTipo devuelve los macros correctos para un tipo de comida', () => {
    const registro: Registro = {
      fecha: '2025-11-12',
      comidas: {
        desayuno: [
          {
            id: '1',
            nombre: 'Tostadas',
            macros: { protein: 6, carbs: 30, fat: 3 },
          },
        ],
        almuerzo: [
          {
            id: '2',
            nombre: 'Pasta con carne',
            macros: { protein: 25, carbs: 60, fat: 15 },
          },
        ],
        cena: [],
        aperitivo: [],
      },
    };

    const desayuno = macrosPorTipo(registro, 'desayuno');
    const almuerzo = macrosPorTipo(registro, 'almuerzo');
    const cena = macrosPorTipo(registro, 'cena');

    expect(desayuno).toEqual({ protein: 6, carbs: 30, fat: 3 });
    expect(almuerzo).toEqual({ protein: 25, carbs: 60, fat: 15 });
    expect(cena).toEqual({ protein: 0, carbs: 0, fat: 0 });
  });

  it('macrosTotales suma los macros de todos los tipos de comida', () => {
    const registro: Registro = {
      fecha: '2025-11-12',
      comidas: {
        desayuno: [
          {
            id: '1',
            nombre: 'Tostadas',
            macros: { protein: 6, carbs: 30, fat: 3 },
          },
        ],
        almuerzo: [
          {
            id: '2',
            nombre: 'Pasta con carne',
            macros: { protein: 25, carbs: 60, fat: 15 },
          },
        ],
        cena: [
          {
            id: '3',
            nombre: 'Yogur',
            macros: { protein: 8, carbs: 10, fat: 4 },
          },
        ],
        aperitivo: [],
      },
    };

    const totales = macrosTotales(registro);

    expect(totales).toEqual({
      protein: 6 + 25 + 8,
      carbs: 30 + 60 + 10,
      fat: 3 + 15 + 4,
    });
  });

  it('Convierte gramos de Macros a calorias', ()=>{
    const macros: Macros = {protein: 10, carbs:10, fat:10}
    const calorias = toCalories(macros)
    expect(calorias).toEqual({protein: 40, carbs: 40, fat:90})
  })

  it('Convierte el total de Macros/kal a porcentaje', ()=>{
    const macros: Macros = {protein: (1*2.25), carbs: (1*2.25), fat: 1}
    const per = toPercentages(macros  )
    expect(per).toEqual({protein: 33.33, carbs: 33.33, fat:33.33})
  })
});
