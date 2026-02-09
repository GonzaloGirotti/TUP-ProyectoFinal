import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Por favor ingresa un email válido');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validar email antes de enviar
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
        //TODO rememberMe // Si el contexto lo soporta
      });
      navigate('/hoy');
    } catch (err: unknown) {
      console.error('Error en login:', err);
      
      let mensaje = 'Email o contraseña incorrectos';
      
      // Manejo de errores más específico
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Error del servidor
          switch (err.response.status) {
            case 401:
              mensaje = 'Credenciales incorrectas';
              break;
            case 404:
              mensaje = 'Usuario no encontrado';
              break;
            case 422:
              mensaje = 'Datos de entrada inválidos';
              break;
            case 500:
              mensaje = 'Error interno del servidor';
              break;
            default:
              mensaje = err.response?.data?.message || mensaje;
          }
        } else if (err.request) {
          // Error de red (sin respuesta)
          mensaje = 'Error de conexión. Verifica tu red.';
        } else {
          // Error al configurar la solicitud
          mensaje = 'Error al configurar la solicitud';
        }
      } else if (err instanceof Error) {
        // Error nativo de JavaScript
        mensaje = err.message;
      }
      
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-500 rounded-md px-3 py-2 text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-200 mb-1">Email</label>
            <input
              type="email"
              className={`w-full rounded-md bg-slate-900 border px-3 py-2 text-slate-100 focus:outline-none focus:ring ${
                emailError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-600 focus:ring-emerald-500'
              }`}
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="ejemplo@correo.com"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-400">{emailError}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-slate-200">Contraseña</label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-emerald-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center px-2 text-slate-400 hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {/* Íconos SVG aquí... */}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-300">
              Recordar sesión
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !!emailError}
            className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-300 text-center">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}