import { Sequelize } from "sequelize";

// Lee las variables que index.ts ya cargó
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbDialect = (process.env.DB_DIALECT || "postgres") as "postgres";

// Validar que las variables de entorno existan
if (!dbName || !dbUser || !dbHost || !dbPassword) {
  console.error(
    "[db]: Faltan variables de entorno para la conexión a la base de datos.",
  );

  console.error(
    "[db]: Asegúrate de que index.ts esté cargando .env correctamente.",
  );
}

// Inicializar Sequelize
export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  logging: false, // Desactivar logs de SQL en la consola
  port: parseInt(process.env.DB_PORT || "5432"),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
