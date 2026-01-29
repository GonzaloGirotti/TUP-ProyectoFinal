import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { nutritionService } from "../services/nutritionService";

type ActivityLevel = "sedentario" | "ligero" | "moderado" | "intenso";
type GoalType = "mantener" | "perder" | "ganar";

export interface UserProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // solo para cambio
  avatarUrl?: string;
  birthDate?: string; // formato "YYYY-MM-DD"
  age?: number;       // opcional si querés calcularlo
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  activityLevel: ActivityLevel;
  mainGoal: GoalType;
}

interface SettingsPanelProps {
  initialData?: Partial<UserProfileSettings>;
  onSave?: (data: UserProfileSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  initialData,
  onSave,
}) => {
  const [form, setForm] = useState<UserProfileSettings>({
    firstName: initialData?.firstName ?? "",
    lastName: initialData?.lastName ?? "",
    email: initialData?.email ?? "",
    password: "",
    avatarUrl: initialData?.avatarUrl ?? "",
    birthDate: initialData?.birthDate ?? "",
    age: initialData?.age,
    gender: initialData?.gender ?? "",
    heightCm: initialData?.heightCm,
    weightKg: initialData?.weightKg,
    activityLevel: initialData?.activityLevel ?? "sedentario",
    mainGoal: initialData?.mainGoal ?? "mantener",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "heightCm" || name === "weightKg" || name === "age"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Solo para preview local; luego podés reemplazar por upload real
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        if (form.weightKg && authCtx.token) {
          await  nutritionService.peso.registrarPeso({ peso_kg: form.weightKg, fecha: new Date() }, authCtx.token);
        }
        if (onSave) {
          onSave(form);
        }
      } catch (err) {
        // Puedes reemplazar por un toast o manejo de error más sofisticado
        // eslint-disable-next-line no-console
        console.error("Error al guardar peso:", err);
      }
    })();
    // Podés agregar un toast o feedback visual acá
  };

  const authCtx = useAuth();

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="panel-item bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-50">
              Configuración de Perfil
            </h2>
            <p className="text-sm text-slate-400">
              Actualiza tus datos personales y objetivo principal.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Avatar + Nombre */}
          <section className="grid gap-6 md:grid-cols-[auto,1fr] items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Avatar del usuario"
                    className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                  />
                ) : (
                  <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-3xl">
                    🧍‍♂️
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-semibold px-2 py-1 cursor-pointer shadow-md">
                  Cambiar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-400 text-center max-w-40">
                Sube una imagen cuadrada para mejor resultado.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-slate-200"
                >
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Ej: Dario"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-slate-200"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Ej: Coletto"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-200"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="tuemail@ejemplo.com"
                />
              </div>
            </div>
          </section>

          {/* Seguridad básica */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-200"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password ?? ""}
                onChange={handleChange}
                className="input-base"
                placeholder="••••••••"
              />
              <span className="text-xs text-slate-400">
                Déjalo vacío si no quieres cambiarla.
              </span>
            </div>
          </section>

          {/* Datos físicos */}
          <section className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="birthDate"
                className="text-sm font-medium text-slate-200"
              >
                Fecha de nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={form.birthDate ?? ""}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="age"
                className="text-sm font-medium text-slate-200"
              >
                Edad
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={0}
                value={form.age ?? ""}
                onChange={handleChange}
                className="input-base"
                placeholder="Ej: 35"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="heightCm"
                className="text-sm font-medium text-slate-200"
              >
                Altura (cm)
              </label>
              <input
                id="heightCm"
                name="heightCm"
                type="number"
                min={0}
                value={form.heightCm ?? ""}
                onChange={handleChange}
                className="input-base"
                placeholder="Ej: 175"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="weightKg"
                className="text-sm font-medium text-slate-200"
              >
                Peso actual (kg)
              </label>
              <input
                id="weightKg"
                name="weightKg"
                type="number"
                min={0}
                value={form.weightKg ?? ""}
                onChange={handleChange}
                className="input-base"
                placeholder="Ej: 78"
              />
            </div>
          </section>

          {/* Género, actividad, objetivo */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-slate-200"
              >
                Sexo / Género
              </label>
              <input
                id="gender"
                name="gender"
                type="text"
                value={form.gender ?? ""}
                onChange={handleChange}
                className="input-base"
                placeholder="Ej: Masculino, Femenino, Otro"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="activityLevel"
                className="text-sm font-medium text-slate-200"
              >
                Nivel de actividad física
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={form.activityLevel}
                onChange={handleChange}
                className="input-base"
              >
                <option value="sedentario">Sedentario</option>
                <option value="ligero">Ligero</option>
                <option value="moderado">Moderado</option>
                <option value="intenso">Intenso</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="mainGoal"
                className="text-sm font-medium text-slate-200"
              >
                Objetivo principal
              </label>
              <select
                id="mainGoal"
                name="mainGoal"
                value={form.mainGoal}
                onChange={handleChange}
                className="input-base"
              >
                <option value="mantener">Mantener peso</option>
                <option value="perder">Perder grasa</option>
                <option value="ganar">Ganar masa</option>
              </select>
            </div>
          </section>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border border-slate-600 text-slate-200 text-sm hover:bg-slate-800 transition"
              onClick={() => {
                // Volver a la pantalla anterior
                window.history.back();
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition shadow-md"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
