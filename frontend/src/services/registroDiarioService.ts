import { BaseService } from "./baseService";

export interface RegistroDiarioResponse {
    id_registro_diario: number;
    fecha: string;
}


export class RegistroDiarioService extends BaseService {
  async obtenerRegistroDiario(id_usuario: number, token: string) {

    return await this.axiosInstance.get<RegistroDiarioResponse>(
      `/registroDiario/${id_usuario}`,
      this.getAuthConfig(token)
    );
  }
    async  iniciarRegistroDiario(id_usuario: number, token: string) {
      try {
        const response = await this.axiosInstance.post(
          `/registroDiario`,
          { id_usuario },
          this.getAuthConfig(token)
        );
        return response;
      } catch (error) {
        throw error;
      }
    }

  
}