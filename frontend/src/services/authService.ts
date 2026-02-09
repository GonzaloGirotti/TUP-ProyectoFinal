import axios from 'axios';
import { getApiConfig } from './baseService';
import { crearLoginResponseMock, crearUsuarioMock } from './mockUser';

const { baseURL, useMockAuth } = getApiConfig();

export interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  fecha_nacimiento?: string;
  genero?: string;
  altura?: number;
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: Usuario;
  refreshToken?: string; // Agregar si usas refresh tokens
}

export interface RegisterPayload {
  nombre_usuario: string;
  email: string;
  password: string;
  fecha_nacimiento?: string;
  genero?: string;
  altura?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken?: string;
}

// --- SERVICE SOLO DE AUTENTICACIÓN ---
export const authService = {
  // ========== AUTENTICACIÓN ==========
  async register(data: RegisterPayload): Promise<LoginResponse> {
    if (useMockAuth) {
      const usuario = crearUsuarioMock({
        email: data.email,
        nombre_usuario: data.nombre_usuario,
        fecha_nacimiento: data.fecha_nacimiento,
        genero: data.genero,
        altura: data.altura,
      });
      const response = crearLoginResponseMock({ 
        email: data.email, 
        nombre_usuario: data.nombre_usuario 
      });
      console.log('[AUTH MOCK] register', response);
      return response;
    }

    const res = await axios.post<LoginResponse>(`${baseURL}/auth/register`, data);
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

  async logout(data: LogoutPayload, token: string): Promise<{ message: string }> {
    if (useMockAuth) {
      console.log('[AUTH MOCK] logout');
      return { message: "Sesión cerrada exitosamente (MOCK)" };
    }
    
    const res = await axios.post<{ message: string }>(
      `${baseURL}/auth/logout`, 
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return res.data;
  },

  async refreshToken(data: RefreshTokenPayload): Promise<LoginResponse> {
    if (useMockAuth) {
      const response = crearLoginResponseMock();
      console.log('[AUTH MOCK] refreshToken', response);
      return response;
    }

    const res = await axios.post<LoginResponse>(`${baseURL}/auth/refresh-token`, data);
    return res.data;
  },

  // ========== VERIFICACIÓN DE EMAIL ==========
  async verifyEmail(token: string): Promise<{ message: string }> {
    if (useMockAuth) {
      console.log('[AUTH MOCK] verifyEmail');
      return { message: "Email verificado exitosamente (MOCK)" };
    }

    const res = await axios.post<{ message: string }>(
      `${baseURL}/auth/verify-email`, 
      { token }
    );
    return res.data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    if (useMockAuth) {
      console.log('[AUTH MOCK] resendVerification');
      return { message: "Email de verificación reenviado (MOCK)" };
    }

    const res = await axios.post<{ message: string }>(
      `${baseURL}/auth/resend-verification`, 
      { email }
    );
    return res.data;
  },

  // ========== RESET PASSWORD (parte pública) ==========
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    if (useMockAuth) {
      console.log('[AUTH MOCK] requestPasswordReset');
      return { message: "Instrucciones enviadas a tu email (MOCK)" };
    }

    const res = await axios.post<{ message: string }>(
      `${baseURL}/usuarios/reset-password-request`, 
      { email }
    );
    return res.data;
  },

  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> {
    if (useMockAuth) {
      console.log('[AUTH MOCK] resetPassword');
      return { message: "Contraseña restablecida exitosamente (MOCK)" };
    }

    const res = await axios.post<{ message: string }>(
      `${baseURL}/usuarios/reset-password`, 
      { token, newPassword, confirmPassword }
    );
    return res.data;
  },

  // ========== GESTIÓN DE SESIÓN (LOCAL) ==========
  saveSession(token: string, usuario: Usuario, refreshToken?: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('refreshToken');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
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