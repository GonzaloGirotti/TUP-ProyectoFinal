import { getApiConfig } from './baseService';
import { authService } from './authService'; 
import { UsuarioService } from './usuarioService'; 
import { PesoService } from './pesoService';
import { AlimentosService } from './alimentosService';
import { ComidasService } from './comidasService';
import { AguaService } from './aguaService';
import { EjercicioService } from './ejercicioService';
import { ObjetivosService } from './objetivosService';
import { RegistroDiarioService } from './registroDiarioService';

class NutritionService {
  // Instancias privadas
  private _authService = authService; // authService ya es un objeto
  private _usuarioService: UsuarioService;
  private _pesoService: PesoService;
  private _alimentosService: AlimentosService;
  private _comidasService: ComidasService;
  private _aguaService: AguaService;
  private _ejercicioService: EjercicioService;
  private _objetivosService: ObjetivosService;
  private _registroDiarioService: RegistroDiarioService;

  constructor() {
    const { baseURL } = getApiConfig();
    
    this._usuarioService = new UsuarioService(baseURL);
    this._pesoService = new PesoService(baseURL);
    this._alimentosService = new AlimentosService(baseURL);
    this._comidasService = new ComidasService(baseURL);
    this._aguaService = new AguaService(baseURL);
    this._ejercicioService = new EjercicioService(baseURL);
    this._objetivosService = new ObjetivosService(baseURL);
    this._registroDiarioService = new RegistroDiarioService(baseURL);
  }

  // Getters para acceso a los servicios
  get auth() {
    return this._authService;
  }

  get usuario() {
    return this._usuarioService;
  }

  get peso() {
    return this._pesoService;
  }

  get alimentos() {
    return this._alimentosService;
  }

  get comidas() {
    return this._comidasService;
  }

  get agua() {
    return this._aguaService;
  }

  get ejercicio() {
    return this._ejercicioService;
  }

  get objetivos() {
    return this._objetivosService;
  }

  get registroDiario() {
    return this._registroDiarioService;
  }
}

// Exportar una instancia única (singleton)
export const nutritionService = new NutritionService();

// También exportar los servicios individuales por si se necesitan por separado
export { 
  authService, 
  UsuarioService, 
  PesoService, 
  AlimentosService, 
  ComidasService, 
  ObjetivosService 
};