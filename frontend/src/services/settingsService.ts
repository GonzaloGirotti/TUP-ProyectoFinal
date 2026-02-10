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
        const pesoYaCargado = await this.axiosInstance.get(`/pesos/`, this.getAuthConfig(token));
        const settingsResponse = await this.axiosInstance.get<SettingsResponse>(`/settings/${id_usuario}`, this.getAuthConfig(token));
        
        if (pesoYaCargado.data.length === 0) {
            // Si no hay pesos cargados, retornar la configuracion guardada en settings
            return settingsResponse;
        } else {
            // Si hay pesos cargados, actualizar el peso con el valor más reciente
            const pesoMasReciente = pesoYaCargado.data[0]; 
            const settings = settingsResponse.data.settings[0]; // Asumimos que solo hay un registro de settings por usuario
            return {
                data: {
                    settings: [{
                        ...settings,
                        peso: pesoMasReciente.peso_kg, // Sobrescribimos el peso con el valor más reciente
                    }]
                }
            };
        }
    }

    async updateSettings(id_usuario: number, payload: SettingsPayLoad, token: string) {
        return await this.axiosInstance.put(
            `/settings/${id_usuario}`,
            payload,
            this.getAuthConfig(token)
        );
    }
}