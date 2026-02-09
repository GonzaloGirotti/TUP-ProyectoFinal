import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db";
import Usuario from "./usuario.model";
import Alimento from "./alimento.model";

export interface ComidaAttributes {
  id_comida: number;
  id_usuario: number;
  fecha: Date;
  nombre_comida: string;
  fecha_creacion: Date;
  updatedAt: Date;
}

type ComidaCreationAttributes = Optional<ComidaAttributes, "id_comida" | "fecha_creacion" | "updatedAt">;

class Comida extends Model<ComidaAttributes, ComidaCreationAttributes> implements ComidaAttributes {
  public id_comida!: number;
  public id_usuario!: number;
  public fecha!: Date;
  public nombre_comida!: string;
  public readonly fecha_creacion!: Date;
  public readonly updatedAt!: Date;
}

Comida.init(
  {
    id_comida: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_comida",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: {
        model: Usuario,
        key: "id_usuario",
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    nombre_comida: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha_creacion",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updatedAt",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "comidas",
    modelName: "Comida", // Nombre explícito para el registro de Sequelize
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  }
);

// Relaciones directas (sin ciclos)
Comida.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// Relación con círculo (usamos setTimeout y evitamos el import arriba)
setTimeout(() => {
  const models = sequelize.models;
  if (models.ComidaAlimento) {
    Comida.hasMany(models.ComidaAlimento, {
      foreignKey: "id_comida",
      as: "detalles",
    });
  }
}, 0);

export default Comida;