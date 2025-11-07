import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import sequelize from './config/db';

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Base de datos conectada correctamente');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  } catch (error) {
    console.error('Error al conectar con la BD:', error);
  }
})();
