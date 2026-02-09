// src/config/axiosInstance.ts
import axios, { type AxiosResponse, type InternalAxiosRequestConfig, AxiosError } from 'axios';
import { authService } from '../services/authService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para la cola de requests fallidas
interface FailedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

// Variables para manejar refresh token
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Procesar la cola de requests
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor con refresh token
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Verificar si es error 401 y no es un endpoint de auth
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      
      // Si ya estamos refrescando, encolar la request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (typeof token === 'string') {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Hacer refresh del token
        const refreshResponse = await axiosInstance.post<{
          token: string;
          refreshToken: string;
          usuario: any;
        }>('/auth/refresh-token', { refreshToken });
        
        const { token: newToken, refreshToken: newRefreshToken, usuario } = refreshResponse.data;
        
        // Guardar nueva sesión
        authService.saveSession(newToken, usuario, newRefreshToken);
        
        // Actualizar el header de la request original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Procesar la cola de requests en espera
        processQueue(null, newToken);
        
        // Reintentar la request original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si el refresh falla, procesar la cola con error
        processQueue(refreshError as AxiosError, null);
        
        // Limpiar sesión
        authService.clearSession();
        
        // Redirigir a login si no estamos ya allí
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;