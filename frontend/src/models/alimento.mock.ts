import type { Alimento } from "../types/registro";


const fakeDbAlimentos: Alimento[] = [
    {
        id: "1",
        nombre: "Manzana",
        calorias: 52,
        macros: { protein: 0.3, carbs: 14, fat: 0.2 },
    },
    {   
        id: "2",
        nombre: "Banana",
        calorias: 96,
        macros: { protein: 1.3, carbs: 27, fat: 0.3 },
    },
    {
        id: "3",
        nombre: "Pollo a la plancha",
        calorias: 165,
        macros: { protein: 31, carbs: 0, fat: 3.6 },
    },
    {
        id: "4",
        nombre: "Arroz integral",
        calorias: 111,
        macros: { protein: 2.6, carbs: 23, fat: 0.9 },
    }
];

export default fakeDbAlimentos;