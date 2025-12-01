// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

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

// --- helpers mock ---
function crearUsuarioMock(data?: Partial<Usuario>): Usuario {
  return {
    id: 1,
    nombre_usuario: data?.nombre_usuario ?? 'Usuario Mock',
    email: data?.email ?? 'mock@nutriapp.com',
    fecha_nacimiento: data?.fecha_nacimiento ?? '1990-01-01T00:00:00.000Z',
  };
}

function crearLoginResponseMock(data?: { email?: string; nombre_usuario?: string }): LoginResponse {
  const usuario = crearUsuarioMock({
    email: data?.email,
    nombre_usuario: data?.nombre_usuario,
  });

  return {
    message: 'Inicio de sesión exitoso (MOCK)',
    token: 'mock-token-123',
    usuario,
  };
}

// --- service ---
export const authService = {
  async register(data: RegisterPayload): Promise<Usuario> {
    if (USE_MOCK_AUTH) {
      const usuario = crearUsuarioMock({
        email: data.email,
        nombre_usuario: data.nombre_usuario,
        fecha_nacimiento: data.fecha_nacimiento,
      });
      console.log('[AUTH MOCK] register', usuario);
      return usuario;
    }

    const res = await axios.post<Usuario>(`${API_BASE_URL}/auth/register`, data);
    return res.data;
  },

  async login(data: LoginPayload): Promise<LoginResponse> {
    if (USE_MOCK_AUTH) {
      const response = crearLoginResponseMock({ email: data.email });
      console.log('[AUTH MOCK] login', response);
      return response;
    }

    const res = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, data);
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
