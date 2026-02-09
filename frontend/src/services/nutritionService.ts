import { getApiConfig } from './baseService';
import { PesoService } from './pesoService';
import { AlimentosService } from './alimentosService';
import { ComidasService } from './comidasService';
import { AguaService } from './aguaService';
import { EjercicioService } from './ejercicioService';
import { ObjetivosService } from './objetivosService';
import { RegistroDiarioService } from './registroDiarioService';
import { SettingsService } from './settingsService';


class NutritionService {
  // Instancias privadas
  private _pesoService: PesoService;
  private _alimentosService: AlimentosService;
  private _comidasService: ComidasService;
  private _aguaService: AguaService;
  private _ejercicioService: EjercicioService;
  private _objetivosService: ObjetivosService;
  private _registroDiarioService: RegistroDiarioService;
  private _settingsService: SettingsService;

  constructor() {
    const { baseURL } = getApiConfig();
    
    this._pesoService = new PesoService(baseURL);
    this._alimentosService = new AlimentosService(baseURL);
    this._comidasService = new ComidasService(baseURL);
    this._aguaService = new AguaService(baseURL);
    this._ejercicioService = new EjercicioService(baseURL);
    this._objetivosService = new ObjetivosService(baseURL);
    this._registroDiarioService = new RegistroDiarioService(baseURL);
    this._settingsService = new SettingsService(baseURL);
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

  get agua(): AguaService {
    return this._aguaService;
  }

  get ejercicio(): EjercicioService {
    return this._ejercicioService;
  }

  get objetivos(): ObjetivosService {
    return this._objetivosService;
  }

  get registroDiario() {
    return this._registroDiarioService;
  }
  
  get settings(): SettingsService {
    return this._settingsService;
  }
}

// Exportar una instancia única (singleton)
export const nutritionService = new NutritionService();

// También exportar los servicios individuales por si se necesitan por separado
export { PesoService, AlimentosService, ComidasService, ObjetivosService, SettingsService };