import dotenv from "dotenv";
import path from "path";

// Configura dotenv para que lea el .env de la CARPETA RAÍZ
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express, { Request, Response } from "express";
import cors from "cors";
import { sequelize } from "./config/db";
import authRoutes from "./routes/auth.routes";

// Importa el modelo para que se registre en Sequelize.
import "./models/usuario.model";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Backend de Nutrición funcionando!");
});

// Registra las rutas de autenticación con su prefijo
app.use("/api/v1/auth", authRoutes);

// Lógica de arranque con intentos

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 segundos

// Función simple para 'dormir'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async (retries = MAX_RETRIES) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate(); // Intenta conectar
      // eslint-disable-next-line no-console
      console.info(
        "[db]: Conexión a la base de datos establecida exitosamente.",
      );
      return;
    } catch (error: unknown) {
      console.warn(
        `[db]: No se pudo conectar. Reintentando en ${RETRY_DELAY / 1000}s... (Intentos restantes: ${retries - 1})`,
      );
      if (error instanceof Error) {
        console.error(`[db]: Error: ${error.name}`);
      }

      retries--;
      if (retries === 0) {
        console.error(
          "[db]: No se pudo conectar a la base de datos después de varios intentos.",
        );
        throw error;
      }
      await sleep(RETRY_DELAY);
    }
  }
};

const startServer = async () => {
  try {
    // 1. Conectar a la base de datos (con reintentos)
    await connectWithRetry();

    // 2. Iniciar el servidor de Express (SOLO SI LA BD CONECTÓ)
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error: unknown) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Arrancar el servidor
startServer();
