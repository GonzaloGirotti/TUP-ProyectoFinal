import express, { Request, Response } from "express";
import cors from "cors";
// Importamos TODAS las rutas
import authRoutes from "./routes/auth.routes";
import pesoRoutes from "./routes/peso.routes";
import alimentoRoutes from "./routes/alimento_consumido.routes";
import comidaRoutes from "./routes/comida.routes";
import comidaAlimentoRoutes from "./routes/comida_alimento.routes";
import objetivoCaloricoRoutes from "./routes/objetivo_calorico.routes";
import objetivoPesoRoutes from "./routes/objetivo_peso.routes";
import objetivoRoutes from "./routes/objetivos.routes";
import registroDiarioRoutes from "./routes/registro_diario.routes";
import registroPesoRoutes from "./routes/registro_peso.routes";
import aguaRoutes from "./routes/agua.routes";
import ejercicioRoutes from "./routes/ejercicio.routes";
import settingsRoutes from "./routes/settings.routes";

// Importamos los modelos para que se registren en Sequelize
import "./models/usuario.model";
import "./models/peso.model";
import "./models/alimento_consumido.model";
import "./models/comida.model";
import "./models/comida_alimento.model";
import "./models/objetivo_calorico.model";
import "./models/objetivo_peso.model";
import "./models/registro_diario.model";
import "./models/registro_peso.model";
import "./models/ejercicio.model";
import "./models/agua.model";

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

// Registra las rutas de objetivos
app.use("/api/v1/objetivos", objetivoRoutes);

// Registra las rutas de pesos
app.use("/api/v1/pesos", pesoRoutes);

// Registra las rutas de alimentos
app.use("/api/v1/alimentos", alimentoRoutes);

// Registra las rutas de comidas_alimentos
app.use("/api/v1/comidas_alimentos", comidaAlimentoRoutes);

// Registra las rutas de comidas
app.use("/api/v1/comidas", comidaRoutes);

// Registra las rutas de objetivos caloricos
app.use("/api/v1/objetivoCalorico", objetivoCaloricoRoutes);

// Registra las rutas de objetivos peso
app.use("/api/v1/objetivoPeso", objetivoPesoRoutes);

// Registra las rutas de registros diarios
app.use("/api/v1/registroDiario", registroDiarioRoutes);

// Registra las rutas de registros de peso
app.use("/api/v1/registroPeso", registroPesoRoutes);

// Registra las rutas de ejercicios
app.use("/api/v1/ejercicios", ejercicioRoutes);

// Registra las rutas de agua
app.use("/api/v1/agua", aguaRoutes);

// Registra las rutas de settings
app.use("/api/v1/settings", settingsRoutes);

// Exportamos la 'app' para que index.ts y nuestros tests puedan importarla.
export default app;
