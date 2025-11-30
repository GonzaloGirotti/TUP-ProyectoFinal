Nutri-App (frontend)
====================

Aplicación React + TypeScript para seguimiento nutricional, construida con Vite y Tailwind CSS.

Tecnologías principales
-----------------------
- React 19 + TypeScript (SPA)
- Vite 7 (build/dev server)
- React Router DOM 7 (ruteo)
- Tailwind CSS 4 (estilos utilitarios)
- Axios (HTTP)
- Chart.js + react-chartjs-2 (gráficos)
- Vitest + ESLint (tests/lint)

Estructura de carpetas (src/)
-----------------------------
- main.tsx: punto de entrada, monta la app.
- App.tsx: define rutas principales.
- layout/: pantallas (LoginPage, RegisterPage, HoyPanel, DiarioPanel, ObjetivosPanel, ProgresoPanel, SettingsPanel, BaseLayout).
- components/: componentes compartidos (ej. MacrosChart, menu/).
- context/: contexto de autenticación (`AuthContext.tsx`).
- services/: servicios y mocks (`authService.ts`, `mockUser.ts`).
- routes/: protecciones de ruta (`ProtectedRoute.tsx`).
- models/ y types/: contratos de datos (`registro.model.ts`, `types/registro.ts`).
- test/: pruebas de modelos (`registoModel.test.ts`).

Cómo levantar la aplicación
---------------------------
1) Instalar dependencias: `npm install`
2) Desarrollo: `npm run dev` (abre Vite en http://localhost:5173)
3) Build producción: `npm run build`
4) Previsualizar build: `npm run preview`
5) Tests: `npm test`

Config necesaria (opcional)
---------------------------
- `VITE_API_BASE_URL`: URL del backend (por defecto `/api/v1`).
- `VITE_USE_MOCK_AUTH=true`: fuerza autenticación mock sin backend.

Flujo de acceso
---------------
- Entrada: página de login en `/login`.
- Credenciales mock (con `VITE_USE_MOCK_AUTH=true`):
  - Email: `mock@nutriapp.com`
  - Contraseña: cualquier valor (se acepta sin validar en modo mock).
