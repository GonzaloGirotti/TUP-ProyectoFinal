// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  authService, 
  type Usuario, 
  type LoginPayload, 
  type RegisterPayload,
  type LoginResponse
} from '../services/authService';

interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  isRefreshing: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Guardar sesión
  const saveSession = useCallback((loginResponse: LoginResponse) => {
    const { token, usuario, refreshToken } = loginResponse;
    
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    setToken(token);
    setUsuario(usuario);
  }, []);

  // Limpiar sesión
  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUsuario(null);
  }, []);

  // Obtener tokens actuales
  const getCurrentTokens = useCallback(() => ({
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    usuario: (() => {
      const raw = localStorage.getItem('usuario');
      return raw ? JSON.parse(raw) as Usuario : null;
    })()
  }), []);

  // Refresh token manual
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const { refreshToken: storedRefreshToken } = getCurrentTokens();
    
    if (!storedRefreshToken) {
      console.warn('No hay refresh token disponible');
      return false;
    }

    setIsRefreshing(true);
    try {
      const response = await authService.refreshToken({ 
        refreshToken: storedRefreshToken 
      });
      
      saveSession(response);
      return true;
    } catch (error) {
      console.error('Error refrescando token:', error);
      
      // Si el refresh token es inválido/expiró, hacer logout
      if ((error as any).response?.status === 401) {
        console.log('Refresh token expirado, haciendo logout...');
        clearSession();
      }
      
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [getCurrentTokens, saveSession, clearSession]);

  // Login
  const login = useCallback(async (data: LoginPayload) => {
    const response = await authService.login(data);
    saveSession(response);
  }, [saveSession]);

  // Register
  const register = useCallback(async (data: RegisterPayload) => {
    const response = await authService.register(data);
    saveSession(response);
  }, [saveSession]);

  // Logout - CORREGIDO
  const logout = useCallback(async () => {
    const { token: currentToken, refreshToken: currentRefreshToken } = getCurrentTokens();
    
    // Intentar logout en backend si hay token
    if (currentToken) {
      try {
        // ✅ CORRECCIÓN: Convertir null a undefined
        await authService.logout({ 
          refreshToken: currentRefreshToken || undefined 
        }, currentToken);
      } catch (error) {
        console.warn('Error en logout del backend:', error);
        // Continuamos con logout local aunque falle el backend
      }
    }
    
    // Limpiar sesión local
    clearSession();
  }, [getCurrentTokens, clearSession]);

  // Efecto inicial
  useEffect(() => {
    const initializeAuth = () => {
      const { token: storedToken, usuario: storedUser } = getCurrentTokens();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUsuario(storedUser);
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, [getCurrentTokens]);

  const contextValue: AuthContextValue = {
    usuario,
    token,
    loading,
    isRefreshing,
    login,
    register,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

// Hook para obtener token
export const useToken = (): string | null => {
  const { token } = useAuth();
  return token;
};

// Hook para forzar refresh
export const useForceRefresh = () => {
  const { refreshToken } = useAuth();
  
  return {
    forceRefresh: async () => {
      try {
        return await refreshToken();
      } catch (error) {
        console.error('Error forzando refresh:', error);
        return false;
      }
    }
  };
};