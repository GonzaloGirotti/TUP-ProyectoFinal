import dotenv from "dotenv";
import path from "path";
// Configura dotenv para que lea el .env de la CARPETA RAÍZ
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// Importamos la app
import app from "./app";
// Importamos la conexión
import { sequelize } from "./config/db";

const PORT = process.env.PORT || 4000;
// Lógica de arranque
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

    // 1.5. Sincronizar modelos con la Base de Datos (Crear tablas faltantes)
    // alter: true - Modifica las tablas existentes para coincidir con los modelos sin borrar datos.
    // force: false - Asegura que NO borre las tablas existentes.
    await sequelize.sync({ alter: true, force: false });
    // eslint-disable-next-line no-console
    console.info(
      "[db]: Tablas sincronizadas correctamente (Agua, Ejercicios, etc).",
    );

    // 2. Iniciar el servidor de Express (SOLO SI LA BD CONECTÓ Y SINCRONIZÓ)
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.info(`Servidor corriendo en http://localhost:${PORT}/api/v1`);
    });
  } catch (error: unknown) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Arrancar el servidor
startServer();
