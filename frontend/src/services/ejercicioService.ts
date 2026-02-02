import { BaseService } from './baseService';

export interface EjercicioPayload {
  tipo: string;
  calorias_quemadas: number;
  duracion_minutos?: number;
  fecha?: string | Date;
}

export interface EjercicioRecord {
  id_ejercicio: number;
  tipo: string;
  calorias_quemadas: number;
  duracion_minutos?: number;
  fecha: string;
}

export interface EjercicioResponse {
  total_calorias: number;
  ejercicios: EjercicioRecord[];
}

export class EjercicioService extends BaseService {
  async registrarEjercicio(payload: EjercicioPayload, token: string) {
    return await this.axiosInstance.post(
      '/ejercicios',
      payload,
      this.getAuthConfig(token)
    );
  }

  async obtenerEjerciciosHoy(token: string) {
    return await this.axiosInstance.get<EjercicioResponse>('/ejercicios', this.getAuthConfig(token));
  }

  async eliminarEjercicio(id: number, token: string) {
    return await this.axiosInstance.delete(
      `/ejercicios/${id}`,
      this.getAuthConfig(token)
    );
  }
}