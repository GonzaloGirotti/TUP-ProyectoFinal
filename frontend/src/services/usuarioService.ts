import { BaseService } from './baseService';

export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  fecha_nacimiento?: string;
  genero?: string;
  altura?: number;
  fecha_creacion?: string;
  nivel_actividad?: string;
  tipo_objetivo?: string;
}

export interface UpdateUsuarioPayload {
  nombre_usuario?: string;
  email?: string;
  fecha_nacimiento?: string;
  genero?: string;
  altura?: number;
    nivel_actividad?: string;
    tipo_objetivo?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UsuarioResponse {
  usuario: Usuario;
}

export class UsuarioService extends BaseService {
  
  // ========== PERFIL ==========
  async obtenerPerfil(token: string): Promise<Usuario> {
    const response = await this.axiosInstance.get<UsuarioResponse>(
      '/usuarios',
      this.getAuthConfig(token)
    );
    return response.data.usuario;
  }

  async actualizarPerfil(data: UpdateUsuarioPayload, token: string): Promise<UsuarioResponse> {
    const response = await this.axiosInstance.put<UsuarioResponse>(
      '/usuarios',
      data,
      this.getAuthConfig(token)
    );
    return response.data;
  }

  // ========== CONTRASEÑA ==========
  async cambiarContraseña(data: ChangePasswordPayload, token: string): Promise<{ message: string }> {
    const response = await this.axiosInstance.put<{ message: string }>(
      '/usuarios/change-password',
      data,
      this.getAuthConfig(token)
    );
    return response.data;
  }

  // ========== GESTIÓN DE CUENTA ==========
  async eliminarCuenta(token: string): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete<{ message: string }>(
      '/usuarios/account',
      this.getAuthConfig(token)
    );
    return response.data;
  }

  // ========== OTRAS OPERACIONES (si las necesitas) ==========
  async obtenerUsuarioPorId(id_usuario: number, token: string): Promise<Usuario> {
    // Solo para admin o propósitos específicos
    const response = await this.axiosInstance.get<Usuario>(
      `/usuarios/${id_usuario}`,
      this.getAuthConfig(token)
    );
    return response.data;
  }

  async listarUsuarios(token: string): Promise<Usuario[]> {
    // Solo para admin
    const response = await this.axiosInstance.get<Usuario[]>(
      '/usuarios',
      this.getAuthConfig(token)
    );
    return response.data;
  }
}