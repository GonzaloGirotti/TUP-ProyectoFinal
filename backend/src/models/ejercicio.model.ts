import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db";
import Usuario from "./usuario.model";

interface EjercicioAttributes {
  id_ejercicio: number;
  id_usuario: number;
  tipo: string;
  calorias_quemadas: number;
  duracion_minutos?: number;
  fecha: Date;
}

type EjercicioCreationAttributes = Optional<EjercicioAttributes, "id_ejercicio" | "fecha">;

class Ejercicio extends Model<EjercicioAttributes, EjercicioCreationAttributes> implements EjercicioAttributes {
  public id_ejercicio!: number;
  public id_usuario!: number;
  public tipo!: string;
  public calorias_quemadas!: number;
  public duracion_minutos?: number;
  public fecha!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ejercicio.init(
  {
    id_ejercicio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id_usuario",
      },
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calorias_quemadas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    duracion_minutos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "ejercicios",
    timestamps: true,
  }
);

Usuario.hasMany(Ejercicio, { foreignKey: "id_usuario" });
Ejercicio.belongsTo(Usuario, { foreignKey: "id_usuario" });

export default Ejercicio;