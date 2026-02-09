// src/services/pesoService.ts
import { BaseService } from './baseService';

export interface PesoPayload {
  peso_kg: number;
  fecha?: string | Date;
  comentario?: string;
}

export interface ObjetivoPesoPayload {
  id_usuario: number | undefined;
  fecha?: string | Date;
  peso_kg: number;
}

export interface PesoRecord {
  id_peso: number;
  peso_kg: number;
  fecha: string;
  comentario?: string;
}

export interface ObjetivoPesoRecord {
  id_objetivo_peso: number;
  fecha_objetivo: string | Date;
  peso_kg: number;
  fecha_creacion: string;
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

  async registrarObjetivoPeso(payload: ObjetivoPesoPayload, token: string) {
    return await this.axiosInstance.post(
      '/objetivoPeso',
      payload,
      this.getAuthConfig(token)
    );
  }

  async verHistorialObjetivosPeso(token: string) {
    return await this.axiosInstance.get('/objetivoPeso', this.getAuthConfig(token));
  }

  async eliminarPeso(id_peso: number, token: string) {
    return await this.axiosInstance.delete(
      `/pesos/${id_peso}`,
      this.getAuthConfig(token)
    );
  }
}