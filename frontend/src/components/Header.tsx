// src/components/layout/Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const fechaHoy = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-900">
          N
        </div>
        <span className="font-semibold text-lg text-white">NutriApp</span>
      </div>

      {/* Fecha */}
      <div className="text-sm text-slate-300 capitalize">{fechaHoy}</div>

      {/* Usuario + Logout */}
      <div className="flex items-center gap-3">
        {usuario && (
          <span className="text-sm text-slate-200">
            {usuario.nombre_usuario ?? usuario.email}
          </span>
        )}

        <button onClick={handleLogout} className="w-10">
          <span className="h-2/3 w-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="auto"
              viewBox="0 -960 960 960"
              width="100%"
              fill="white"
            >
              <path d="M480-480q-17 0-28.5-11.5T440-520v-320q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v320q0 17-11.5 28.5T480-480Zm0 360q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-61 20-118.5T198-704q11-14 28-13.5t30 13.5q11 11 10 27t-11 30q-27 36-41 79t-14 88q0 117 81.5 198.5T480-200q117 0 198.5-81.5T760-480q0-46-13.5-89.5T704-649q-10-13-11-28.5t10-26.5q12-12 29-12.5t28 12.5q39 48 59.5 105T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Z" />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
};
