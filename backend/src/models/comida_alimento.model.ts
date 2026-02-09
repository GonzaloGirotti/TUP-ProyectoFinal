import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface ComidaAlimentoAttributes {
  id_comida_alimento: number;
  id_comida: number;
  id_alimento_consumido: number;
  cantidad_gramos: number;
  carbohidratos_total: number;
  grasas_total: number;
  proteinas_total: number;
  calorias_total: number;
  fecha_creacion: Date;
  updatedAt: Date;
}

type ComidaAlimentoCreationAttributes = Optional<ComidaAlimentoAttributes, "id_comida_alimento" | "fecha_creacion" | "updatedAt">;

class ComidaAlimento extends Model<ComidaAlimentoAttributes, ComidaAlimentoCreationAttributes> implements ComidaAlimentoAttributes {
  public id_comida_alimento!: number;
  public id_comida!: number;
  public id_alimento_consumido!: number;
  public cantidad_gramos!: number;
  public carbohidratos_total!: number;
  public grasas_total!: number;
  public proteinas_total!: number;
  public calorias_total!: number;
  public readonly fecha_creacion!: Date;
  public readonly updatedAt!: Date;
}

ComidaAlimento.init(
  {
    id_comida_alimento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_comida_alimento",
    },
    id_comida: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_comida",
      references: {
        model: "comidas", // USAMOS STRING PARA EVITAR IMPORT CIRCULAR
        key: "id_comida",
      },
    },
    id_alimento_consumido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "id_alimento_consumido",
      references: {
        model: "alimento_consumido", // USAMOS STRING PARA EVITAR IMPORT CIRCULAR
        key: "id_alimento_consumido",
      },
    },
    cantidad_gramos: { type: DataTypes.REAL, allowNull: true },
    carbohidratos_total: { type: DataTypes.REAL, allowNull: true },
    grasas_total: { type: DataTypes.REAL, allowNull: true },
    proteinas_total: { type: DataTypes.REAL, allowNull: true },
    calorias_total: { type: DataTypes.REAL, allowNull: true },
    fecha_creacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "comidas_alimentos",
    modelName: "ComidaAlimento",
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  }
);

setTimeout(() => {
  const models = sequelize.models;

  if (models.Comida) {
    ComidaAlimento.belongsTo(models.Comida, {
      foreignKey: "id_comida",
      as: "comida",
    });
  }

  if (models.AlimentoConsumido) {
    ComidaAlimento.belongsTo(models.AlimentoConsumido, {
      foreignKey: "id_alimento_consumido",
      as: "alimento",
    });
  }
}, 0);

export default ComidaAlimento;