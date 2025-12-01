# 🍏 NutriApp — Seguimiento nutricional diario  
Aplicación Frontend desarrollada en **React + TypeScript**, diseñada para realizar seguimiento nutricional diario, registrar comidas, configurar objetivos y visualizar el progreso a través de gráficos dinámicos.

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Vite-5-purple?logo=vite" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-teal?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Chart.js-4-orange?logo=chart.js" />
</div>


## 📌 Descripción
**NutriApp** es una aplicación enfocada en la nutrición diaria, permitiendo al usuario:

- Registrar comidas (desayuno, almuerzo, cena y snacks).  
- Visualizar calorías consumidas vs. objetivo diario.  
- Ajustar objetivos nutricionales: calorías, macros y peso.  
- Consultar un diario completo con totales del día.  
- Analizar el **progreso histórico** mediante gráficos (línea y donut).  
- Configurar perfil de usuario (peso, altura, imagen de avatar, etc.).  

La app incluye un sistema de **autenticación simulada**, rutas protegidas y un layout completo con **Header + Sidebar + Main**.


⚙️ Tecnologías utilizadas
-----------------------
- React 19 + TypeScript (SPA)
- Vite 7 (build/dev server)
- React Router DOM 7 (ruteo)
- Tailwind CSS 4 (estilos utilitarios)
- Axios (HTTP)
- Chart.js + react-chartjs-2 (gráficos)
- Vitest + ESLint (tests/lint)

## 📂 Estructura general del proyecto
- main.tsx: punto de entrada, monta la app.
- App.tsx: define rutas principales.
- layout/: pantallas (LoginPage, RegisterPage, HoyPanel, DiarioPanel, ObjetivosPanel, ProgresoPanel, SettingsPanel, BaseLayout).
- components/: componentes compartidos (ej. MacrosChart, menu/).
- context/: contexto de autenticación (`AuthContext.tsx`).
- services/: servicios y mocks (`authService.ts`, `mockUser.ts`).
- routes/: protecciones de ruta (`ProtectedRoute.tsx`).
- models/ y types/: contratos de datos (`registro.model.ts`, `types/registro.ts`).
- test/: pruebas de modelos (`registoModel.test.ts`).

## 🚀 Cómo levantar la aplicación

1) Instalar dependencias: `npm install`
2) Desarrollo: `npm run dev` (abre Vite en http://localhost:5173)
3) Build producción: `npm run build`
4) Previsualizar build: `npm run preview`
5) Tests: `npm test`

Config necesaria (opcional)
---------------------------
- `VITE_API_BASE_URL`="http://localhost:4000"
- `VITE_API_URL`="/api/v1"
- `VITE_USE_MOCK_AUTH=true`: fuerza autenticación mock sin backend.

## 🔒 Autenticación

La app incluye un sistema de login/register simulado con servicios mock:

- AuthContext gestiona login, logout y persistencia.

- Rutas protegidas mediante ProtectedRoute.

- El usuario es redirigido a /hoy tras iniciar sesión.

Flujo de acceso
---------------
- Entrada: página de login en `/login`.
- Credenciales mock (con `VITE_USE_MOCK_AUTH=true`):
  - Email: `mock@nutriapp.com`
  - Contraseña: cualquier valor (se acepta sin validar en modo mock).

**Nota** Al levantar la app el usario entra autenticado. Cerrar sesion para ver los paneles de Login y Registro 
