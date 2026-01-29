// src/services/baseService.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export interface ApiConfig {
  baseURL: string;
  useMockAuth: boolean;
}

export interface AuthHeaders {
  headers: {
    Authorization: string;
  };
}

export abstract class BaseService {
  protected axiosInstance: AxiosInstance;
  protected baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
  }

  protected getAuthHeaders(token: string): AuthHeaders {
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  protected getAuthConfig(token: string): AxiosRequestConfig {
    return this.getAuthHeaders(token);
  }
}

export const getApiConfig = (): ApiConfig => {
  const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1';
  const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
  
  return { baseURL, useMockAuth };
};