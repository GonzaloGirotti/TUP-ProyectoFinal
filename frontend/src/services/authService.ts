import axios from 'axios';
import { getApiConfig } from './baseService';
import { crearLoginResponseMock, crearUsuarioMock } from './mockUser';


const { baseURL, useMockAuth } = getApiConfig();

export interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  fecha_nacimiento?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: Usuario;
}

export interface RegisterPayload {
  nombre_usuario: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}


// --- service ---
export const authService = {
  async register(data: RegisterPayload): Promise<Usuario> {
    if (useMockAuth) {
      const usuario = crearUsuarioMock({
        email: data.email,
        nombre_usuario: data.nombre_usuario,
        fecha_nacimiento: data.fecha_nacimiento,
      });
      console.log('[AUTH MOCK] register', usuario);
      return usuario;
    }

    const res = await axios.post<Usuario>(`${baseURL}/auth/register`, data);
    return res.data;
  },

  async login(data: LoginPayload): Promise<LoginResponse> {
    if (useMockAuth) {
      const response = crearLoginResponseMock({ email: data.email });
      console.log('[AUTH MOCK] login', response);
      return response;
    }

    const res = await axios.post<LoginResponse>(`${baseURL}/auth/login`, data);
    return res.data;
  },

  saveSession(token: string, usuario: Usuario) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUsuario(): Usuario | null {
    const raw = localStorage.getItem('usuario');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
