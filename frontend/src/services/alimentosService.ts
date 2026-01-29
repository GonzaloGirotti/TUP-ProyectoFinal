// src/services/alimentosService.ts
import { BaseService } from './baseService';

export interface Alimento {
  nombre: string;
  carbohidratos: number;
  proteinas: number;
  grasas: number;
  calorias: number;
}

export interface AlimentoConId extends Alimento {
  id_alimento: number;
}

export class AlimentosService extends BaseService {
  async crearAlimento(alimento: Alimento, token: string) {
    return await this.axiosInstance.post(
      '/alimentos',
      alimento,
      this.getAuthConfig(token)
    );
  }

  async listarAlimentos(token: string) {
    return await this.axiosInstance.get('/alimentos', this.getAuthConfig(token));
  }

  async eliminarAlimento(id_alimento: number, token: string) {
    return await this.axiosInstance.delete(
      `/alimentos/${id_alimento}`,
      this.getAuthConfig(token)
    );
  }
}