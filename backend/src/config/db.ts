import { Sequelize, Options } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Cargamos variables de entorno (para local)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Detectamos si estamos en producción (Render pone NODE_ENV=production automáticamente)
const isProduction = process.env.NODE_ENV === 'production';

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbDialect = "postgres";
const dbPort = parseInt(process.env.DB_PORT || "5432");

// Validar variables
if (!dbName || !dbUser || !dbHost || !dbPassword) {
  console.error("[db]: Faltan variables de entorno.");
}

// Configuración dinámica
const dbConfig: Options = {
  host: dbHost,
  dialect: dbDialect,
  port: dbPort,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Configuración SSL para Render
  dialectOptions: isProduction
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necesario para certificados de Render
      },
    }
    : {}, // En local (Docker) dejamos el objeto vacío
};

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, dbConfig);