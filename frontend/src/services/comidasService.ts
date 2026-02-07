import { BaseService } from './baseService';

export interface Comida {
  nombre_comida: string;
  fecha: string | Date;
}

export interface ComidaConId extends Comida {
  id_comida: number;
}

export interface ComidaAlimentoPayload {
  id_comida: number;
  id_alimento: number;
  cantidad_gramos: number;
}

export class ComidasService extends BaseService {
  async crearComida(comida: Comida, token: string) {
    return await this.axiosInstance.post(
      '/comidas',
      comida,
      this.getAuthConfig(token)
    );
  }

  async listarComidas(token: string) {
    return await this.axiosInstance.get('/comidas', this.getAuthConfig(token));
  }

  async eliminarComida(id_comida: number, token: string) {
    return await this.axiosInstance.delete(
      `/comidas/${id_comida}`,
      this.getAuthConfig(token)
    );
  }

  async agregarAlimentoAComida(payload: ComidaAlimentoPayload, token: string) {
    return await this.axiosInstance.post(
      '/comidas_alimentos',
      payload,
      this.getAuthConfig(token)
    );
  }

  async verAlimentosDeComida(id_comida?: number, token?: string) {
    const url = id_comida ? `/comidas_alimentos?id_comida=${id_comida}` : '/comidas_alimentos';
    const config = token ? this.getAuthConfig(token) : undefined;
    
    return await this.axiosInstance.get(url, config);
  }

  async eliminarAlimentoDeComida(id_comida_alimento: number, token: string) {
    return await this.axiosInstance.delete(
      `/comidas_alimentos/${id_comida_alimento}`,
      this.getAuthConfig(token)
    );
  }
}