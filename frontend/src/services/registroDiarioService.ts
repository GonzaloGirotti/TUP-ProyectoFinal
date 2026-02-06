import { BaseService } from "./baseService";

export interface RegistroDiarioResponse {
    id_registro_diario: number;
    fecha: string;
}


export class RegistroDiarioService extends BaseService {
  async obtenerRegistroDiario(id_usuario: number, token: string) {

    return await this.axiosInstance.get<RegistroDiarioResponse>(
      `${this.baseURL}/registroDiario/${id_usuario}`,
      this.getAuthConfig(token)
    );

  }
}