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

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
          <Route index element={<HoyPanel />} />
          <Route path="diario" element={<DiarioPanel />} />
          <Route path="progreso" element={<ProgresoPanel />} />
          <Route path="objetivos" element={<ObjetivosPanel />} />
          <Route path="settings" element={<SettingsPanel />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
