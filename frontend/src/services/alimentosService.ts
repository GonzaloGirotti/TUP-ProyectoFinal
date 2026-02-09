// src/services/alimentosService.ts
import { BaseService, getApiConfig } from './baseService';
const { baseURL } = getApiConfig();

export interface Alimento {
  nombre: string;
  carbohidratos: number;
  proteinas: number;
  grasas: number;
  calorias: number;
}

export interface AlimentoConsumido extends Alimento {
  gramos: number; // en gramos
}

export interface AlimentoConId extends Alimento {
  id_alimento: number;
}

export class AlimentosService extends BaseService {
  async crearAlimentoConsumido(alimentoConsumido: AlimentoConsumido, token: string) {
    return await this.axiosInstance.post(
      `${baseURL}/alimentos`,
      alimentoConsumido,
      this.getAuthConfig(token)
    );
  }

  async crearAlimento(alimento: Alimento, token: string) {
    return await this.axiosInstance.post(
      `${baseURL}/alimentos_normales`,
      alimento,
      this.getAuthConfig(token)
    );
  }

  async listarAlimentos(token: string) {
    return await this.axiosInstance.get('/alimentos_normales', this.getAuthConfig(token));
  }

  async eliminarAlimento(id_alimento: number, token: string) {
    return await this.axiosInstance.delete(
      `/alimentos/${id_alimento}`,
      this.getAuthConfig(token)
    );
  }
}