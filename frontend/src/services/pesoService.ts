// src/services/pesoService.ts
import { BaseService } from './baseService';

export interface PesoPayload {
  peso_kg: number;
  fecha?: string | Date;
  comentario?: string;
}

export interface PesoRecord {
  id_peso: number;
  peso_kg: number;
  fecha: string;
  comentario?: string;
}

export class PesoService extends BaseService {
  async registrarPeso(payload: PesoPayload, token: string) {
    return await this.axiosInstance.post(
      '/pesos',
      payload,
      this.getAuthConfig(token)
    );
  }

  async verHistorialPesos(token: string) {
    return await this.axiosInstance.get('/pesos', this.getAuthConfig(token));
  }

  async eliminarPeso(id_peso: number, token: string) {
    return await this.axiosInstance.delete(
      `/pesos/${id_peso}`,
      this.getAuthConfig(token)
    );
  }
}