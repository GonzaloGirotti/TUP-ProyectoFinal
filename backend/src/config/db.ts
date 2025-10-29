// config/db.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    dialect: process.env.DB_DIALECT as any || "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    logging: console.log,
  }
);

export default sequelize;