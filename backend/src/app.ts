import express, { Request, Response } from "express";
import cors from "cors";
// Importamos TODAS las rutas
import authRoutes from "./routes/auth.routes";
import pesoRoutes from "./routes/peso.routes";
import alimentoRoutes from "./routes/alimento.routes";
import comidaRoutes from "./routes/comida.routes";
import comidaAlimentoRoutes from "./routes/comida_alimento.routes";
// Importamos los modelos para que se registren en Sequelize
import "./models/usuario.model";
import "./models/peso.model";
import "./models/alimento.model";
import "./models/comida.model";
import "./models/comida_alimento.model";
// Creamos la app de Express
const app = express();

// Middlewares
app.use(cors()); // Habilita CORS
app.use(express.json()); // Permite a Express entender JSON

// RUTAS
// Ruta de prueba
app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Backend de Nutrición funcionando!");
});

// Registra las rutas de autenticación
app.use("/api/v1/auth", authRoutes);

// Registra las rutas de pesos
app.use("/api/v1/pesos", pesoRoutes);

// Registra las rutas de alimentos
app.use("/api/v1/alimentos", alimentoRoutes);

// Registra las rutas de comidas_alimentos
app.use("/api/v1/comidas_alimentos", comidaAlimentoRoutes);

// Registra las rutas de comidas
app.use("/api/v1/comidas", comidaRoutes);

// Exportamos la 'app' para que index.ts y nuestros tests puedan importarla.
export default app;
