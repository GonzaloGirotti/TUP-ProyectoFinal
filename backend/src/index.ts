import app from "./app";
import { sequelize } from "./config/db";

const PORT = process.env.PORT || 4000;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async (retries = MAX_RETRIES) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      // eslint-disable-next-line no-console
      console.info("[db]: Conexión exitosa a la base de datos.");
      return;
    } catch (error: unknown) {
      console.warn(
        `[db]: Falló la conexión. Reintentando en ${RETRY_DELAY / 1000}s... (Quedan ${retries - 1} intentos)`
      );
      retries--;
      if (retries === 0) {
        console.error("[db]: No se pudo conectar tras varios intentos.");
        throw error;
      }
      await sleep(RETRY_DELAY);
    }
  }
};

const startServer = async () => {
  try {
    await connectWithRetry();

    // Comento el sync temporalmente para evitar que se borren datos.
    
    // await sequelize.sync({ alter: false, force: false });

    // eslint-disable-next-line no-console
    console.info("[db]: Sync desactivado por seguridad (Tablas ya existen).");

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.info(`Servidor corriendo en http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("Error fatal iniciando servidor:", error);
    process.exit(1);
  }
};

startServer();