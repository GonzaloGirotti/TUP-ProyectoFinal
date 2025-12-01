// Lee las variables de entorno directamente, lo que es más seguro.
// Asegurarnos de que dotenv cargue el .env de la raíz
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Verificación de seguridad
if (!process.env.DB_USER) {
  // eslint-disable-next-line no-console
  console.error(
    'ERROR: [config.js] Variables de entorno no cargadas. Asegúrate de que ../.env existe.'
  );
  process.exit(1);
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};