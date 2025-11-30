// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type Usuario, type LoginPayload, type RegisterPayload } from '../services/authService';

interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada al iniciar la app
  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getUsuario();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginPayload) => {
    const res = await authService.login(data);
    authService.saveSession(res.token, res.usuario);
    setToken(res.token);
    setUsuario(res.usuario);
  };

  const register = async (data: RegisterPayload) => {
    // Registro
    const nuevoUsuario = await authService.register(data);
    // Se podria loguear automáticamente después de registrarse:
    const loginRes = await authService.login({
      email: data.email,
      password: data.password,
    });
    authService.saveSession(loginRes.token, loginRes.usuario);
    setToken(loginRes.token);
    setUsuario(loginRes.usuario);
  };

  const logout = () => {
    authService.clearSession();
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};
