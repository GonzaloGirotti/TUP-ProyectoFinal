import { BaseService } from './baseService';

export interface SettingsPayLoad {
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    email: string;
    password?: string;
    urlAvatar?: string;
    fecha_nacimiento: string;
    genero: string;
    altura: number;
    peso: number;
    nivel_actividad: string;
    tipo_objetivo: string;
}

export interface SettingsRecord { // Representa la respuesta del servidor al obtener la configuración del usuario
    id_usuario: number;
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    email: string;
    password?: string;
    urlAvatar?: string;
    fecha_nacimiento: string;
    genero: string;
    altura: number;
    peso: number;
    nivel_actividad: string;
    tipo_objetivo: string;
}

export interface SettingsResponse {
    settings: SettingsRecord[];
}

export class SettingsService extends BaseService {
    async registrarSettings(id_usuario: number, payload: SettingsPayLoad, token: string) {
        return await this.axiosInstance.post(
            `/settings/${id_usuario}`,
            payload,
            this.getAuthConfig(token)
        );
    }

    async obtenerSettings(id_usuario: number | undefined, token: string) {
        return await this.axiosInstance.get<SettingsResponse>(`/settings/${id_usuario}`, this.getAuthConfig(token));
    }

    async updateSettings(id_usuario: number, payload: SettingsPayLoad, token: string) {
        return await this.axiosInstance.put(
            `/settings/${id_usuario}`,
            payload,
            this.getAuthConfig(token)
        );
    }
}