import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DiarioPanel } from "./layout/DiarioPanel.tsx";
import { HoyPanel } from "./layout/HoyPanel.tsx";
import { ObjetivosPanel } from "./layout/ObjetivosPanel.tsx";
import { ProgresoPanel } from "./layout/ProgresoPanel.tsx";
import { SettingsPanel } from "./layout/SettingsPanel.tsx";
import { LoginPage } from "./layout/LoginPage.tsx";
import { RegisterPage } from "./layout/RegisterPage.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/" element={<App />}>
          <Route index element={<HoyPanel />} />
           <Route path="hoy" element={<HoyPanel />} />
          <Route path="diario" element={<DiarioPanel />} />
          <Route path="progreso" element={<ProgresoPanel />} />
          <Route path="objetivos" element={<ObjetivosPanel />} />
          <Route path="settings" element={<SettingsPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
