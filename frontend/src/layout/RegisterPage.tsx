import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export function RegisterPage() {
  const { register } = useAuth(); // ✅ Solo necesitamos register
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Validar formato de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("Por favor ingresa un email válido");
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

    // Validaciones
    if (!validateEmail(email)) {
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);

    try {
      // ✅ CORRECCIÓN: Solo una llamada - register ya hace login automático
      await register({
        nombre_usuario: nombreUsuario,
        email: normalizedEmail,
        password,
        fecha_nacimiento: fechaNacimiento
          ? `${fechaNacimiento}T00:00:00.000Z`
          : undefined,
      });

      navigate("/hoy");
    } catch (err: unknown) {
      console.error("Error en registro:", err);

      // Manejo de errores con type narrowing
      let mensajeError = "Error al registrarse. Intenta con otro email.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Error del servidor
          const data = err.response.data;

          // Manejar errores específicos del backend
          if (err.response.status === 400) {
            if (data.message?.includes("email")) {
              mensajeError = "Este email ya está registrado";
            } else if (data.message?.includes("usuario")) {
              mensajeError = "Este nombre de usuario ya está en uso";
            } else {
              mensajeError = data.message || "Datos inválidos";
            }
          } else if (err.response.status === 422) {
            mensajeError = "Datos de entrada inválidos";
          } else if (err.response.status === 409) {
            mensajeError = "El usuario ya existe";
          } else if (err.response.status === 500) {
            mensajeError = "Error interno del servidor";
          } else {
            mensajeError =
              data?.message || data?.error || `Error ${err.response.status}`;
          }
        } else if (err.request) {
          // Error de red
          mensajeError = "Error de conexión. Verifica tu red.";
        } else {
          // Error al configurar la solicitud
          mensajeError = err.message;
        }
      } else if (err instanceof Error) {
        // Error estándar
        mensajeError = err.message;
      }

      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // Calcular fecha máxima (18 años atrás) y mínima (100 años atrás)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];
  const minDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  // Componente EyeIcon (mejorado con aria-label)
  const EyeIcon = ({ visible, label }: { visible: boolean; label: string }) => (
    <>
      {visible ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          aria-label={label}
        >
          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          aria-label={label}
        >
          <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
        </svg>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Crear cuenta
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-500 rounded-md px-3 py-2 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Nombre de usuario *
            </label>
            <input
              type="text"
              className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              placeholder="Ej: maria_gomez"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">Email *</label>
            <input
              type="email"
              className={`w-full rounded-md bg-slate-900 border px-3 py-2 text-slate-100 focus:outline-none focus:ring ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-600 focus:ring-emerald-500"
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
            <label className="block text-sm text-slate-200 mb-1">
              Fecha de nacimiento *
            </label>
            <input
              type="date"
              className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
              max={maxDate}
              min={minDate}
            />
            <p className="mt-1 text-xs text-slate-400">
              Debes ser mayor de 18 años
            </p>
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-md bg-slate-900 border border-slate-600 px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center px-2 text-slate-400 hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <EyeIcon
                  visible={showPassword}
                  label={showPassword ? "Ocultar" : "Mostrar"}
                />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Confirmar contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full rounded-md bg-slate-900 border px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring ${
                  password && confirmPassword && password !== confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-emerald-500"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center px-2 text-slate-400 hover:text-white"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                <EyeIcon
                  visible={showConfirmPassword}
                  label={showConfirmPassword ? "Ocultar" : "Mostrar"}
                />
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                Las contraseñas no coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !!emailError ||
              (password && confirmPassword && password !== confirmPassword)
                ? true 
                : false
            }
            className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-300 text-center">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
          <p className="mt-2 text-xs text-slate-400 text-center">
            * Campos obligatorios
          </p>
        </div>
      </div>
    </div>
  );
}
