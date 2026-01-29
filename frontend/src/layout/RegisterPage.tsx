import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Importamos también 'login' del contexto para el auto-ingreso
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  // 1. Desestructuramos también 'login'
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // Convertimos la fecha a ISO con hora 00:00
      const fechaIso = new Date(`${fechaNacimiento}T00:00:00.000Z`).toISOString();

      // PASO 1: Crear el usuario en PostgreSQL
      await register({
        nombre_usuario: nombreUsuario,
        email: normalizedEmail,
        password,
        fecha_nacimiento: fechaIso,
      });

      // PASO 2 (NUEVO): Auto-Login para obtener el Token 🔑
      // Usamos la misma contraseña que el usuario acaba de escribir
      await login({
        email: normalizedEmail,
        password: password
      });

      // PASO 3: Ahora sí, con token en mano, vamos al panel
      navigate('/hoy');

    } catch (err: any) {
      console.error(err);
      // Mejoramos el mensaje de error por si viene del backend
      const mensajeBackend = err.response?.data?.message || err.response?.data?.error;
      setError(mensajeBackend || 'Error al registrarse. Intenta con otro email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Crear cuenta
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-500 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 pr-20 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 my-1 px-3 text-sm text-slate-300 hover:text-white rounded-md hover:bg-slate-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">Confirmar contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 pr-20 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 my-1 px-3 text-sm text-slate-300 hover:text-white rounded-md hover:bg-slate-700"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 mt-2 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creando cuenta e ingresando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300 text-center">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}