import { BaseService } from './baseService';

export interface ObjetivosPayLoad {
    id_usuario: number | undefined;
    calorias: number;
    proteinas_proporcion: number;
    carbohidratos_proporcion: number;
    grasas_proporcion: number;
    peso_deseado: number;
}

export interface ObjetivosRecord {
    id_objetivos: number;
    calorias: number;
    proteinas_proporcion: number;
    carbohidratos_proporcion: number;
    grasas_proporcion: number;
    peso_deseado: number;
    fecha_creacion: string;
}

export interface ObjetivosResponse {
    objetivos: ObjetivosRecord[];
}

export class ObjetivosService extends BaseService {
    async registrarObjetivos(payload: ObjetivosPayLoad, token: string) {
        return await this.axiosInstance.post(
            '/objetivos',
            payload,
            this.getAuthConfig(token)
        );
    }

  async obtenerObjetivos(token: string) {
    return await this.axiosInstance.get<ObjetivosResponse>(
      '/objetivos',
      this.getAuthConfig(token)
    );
  }

    async obtenerObjetivoActual(token: string) {
    const response = await this.obtenerObjetivos(token);
    // TODO Lógica para encontrar el objetivo actual (más reciente)
    return response.data.objetivos[0];
  }


    async eliminarObjetivos(id_objetivo: number, token: string) {
        return await this.axiosInstance.delete(
            `/objetivos/${id_objetivo}`,
            this.getAuthConfig(token)
        );
    }
}