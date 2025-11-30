import { sequelize } from "../config/db";
import { beforeAll, beforeEach, afterAll } from "vitest";

// 1. Antes de que empiecen TODOS los tests, conectamos a la BD
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    // Sincronizamos el modelo con la BD (crea tablas si no existen)
    // logging: false para que no ensucie la consola con SQL
    await sequelize.sync({ logging: false });
  } catch (error) {
    console.error("Error conectando a la BD de pruebas:", error);
  }
});

// 2. Antes de CADA test individual (it), limpiamos los datos
beforeEach(async () => {
  // 'force: true' borra los datos y recrea las tablas.
  // Esto asegura que el usuario que creaste en el Test A no exista en el Test B.
  await sequelize.sync({ force: true, logging: false });
});

// 3. Al terminar TODOS los tests, cerramos la conexión
afterAll(async () => {
  await sequelize.close();
});
