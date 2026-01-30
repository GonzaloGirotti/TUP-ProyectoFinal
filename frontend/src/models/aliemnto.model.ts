import type { Macros } from "../types/registro";
import {KCAL_PER_GRAM} from "./registro.model";

class Alimento {

    id: number;
    nombre: string;
    macros_proportion: Macros;
    gramos?: number;

    
    constructor(id: number, nombre: string, macros: Macros) {
        this.id = id;
        this.nombre = nombre;
        this.macros_proportion = macros;
    }
    
    
    get calorias(): number {
        const grams = this.gramos ?? 100;
        return (
            (this.macros_proportion.protein ?? 0) * KCAL_PER_GRAM.protein +
            (this.macros_proportion.carbs ?? 0) * KCAL_PER_GRAM.carbs +
            (this.macros_proportion.fat ?? 0) * KCAL_PER_GRAM.fat
        ) * (grams / 100);
    }


}

export default Alimento;
