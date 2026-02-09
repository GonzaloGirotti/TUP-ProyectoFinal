import { BaseService } from './baseService';

export interface AguaPayload {
    cantidad_ml: number;
    fecha?: string | Date;
}

export interface AguaRecord {
    id_agua: number;
    cantidad_ml: number;
    fecha: string;
}

export interface AguaResponse {
    total_ml: number;
    registros: AguaRecord[];
}

export class AguaService extends BaseService {
    async registrarAgua(payload: AguaPayload, token: string) {
        return await this.axiosInstance.post(
            '/agua',
            payload,
            this.getAuthConfig(token)
        );
    }

    async obtenerAguaHoy(token: string) {
        return await this.axiosInstance.get<AguaResponse>('/agua', this.getAuthConfig(token));
    }

    async eliminarAgua(id_agua: number, token: string) {
        return await this.axiosInstance.delete(
            `/agua/${id_agua}`,
            this.getAuthConfig(token)
        );
    }
}