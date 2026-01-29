import { getApiConfig } from './baseService';
import { PesoService } from './pesoService';
import { AlimentosService } from './alimentosService';
import { ComidasService } from './comidasService';

class NutritionService {
  // Instancias privadas
  private _pesoService: PesoService;
  private _alimentosService: AlimentosService;
  private _comidasService: ComidasService;

  constructor() {
    const { baseURL } = getApiConfig();
    
    this._pesoService = new PesoService(baseURL);
    this._alimentosService = new AlimentosService(baseURL);
    this._comidasService = new ComidasService(baseURL);
  }

  // Getters para acceso a los servicios
  get peso(): PesoService {
    return this._pesoService;
  }

  get alimentos(): AlimentosService {
    return this._alimentosService;
  }

  get comidas(): ComidasService {
    return this._comidasService;
  }
}

// Exportar una instancia única (singleton)
export const nutritionService = new NutritionService();

// También exportar los servicios individuales por si se necesitan por separado
export { PesoService, AlimentosService, ComidasService };