import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import AlimentoConsumido from "./alimento_consumido.model"; // Importacion del modelo alimento consumido para la relación
import Comidas from "./comida.model";

// Interface para los atributos de Comida_Alimento
export interface ComidaAlimentoAttributes {
  id_comida_alimento: number;
  id_comida: number; // Clave foránea
  id_alimento_consumido: number; // Clave foránea
  cantidad_gramos: number;
  carbohidratos_total: number;
  grasas_total: number;
  proteinas_total: number;
  calorias_total: number;
  fecha_creacion: Date;
  updatedAt: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type ComidaAlimentoCreationAttributes = Optional<
  ComidaAlimentoAttributes,
  "id_comida_alimento" | "fecha_creacion" | "updatedAt"
>;

// Definición del Modelo
class ComidaAlimento
  extends Model<ComidaAlimentoAttributes, ComidaAlimentoCreationAttributes>
  implements ComidaAlimentoAttributes {
  public id_comida_alimento!: number;
  public id_comida!: number;
  public id_alimento_consumido!: number;
  public cantidad_gramos!: number;
  public carbohidratos_total!: number;
  public grasas_total!: number;
  public proteinas_total!: number;
  public calorias_total!: number;

  // Timestamps
  public readonly fecha_creacion!: Date;
  public readonly updatedAt!: Date;
}

// Inicialización del Modelo
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
        model: "Comidas", // Referencia al modelo Comida
        key: "id_comida", // La columna en la tabla Comidas
      },
    },
    id_alimento_consumido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "id_alimento_consumido",
      references: {
        model: AlimentoConsumido, // Referencia al modelo Alimento Consumido
        key: "id_alimento_consumido", // La columna en la tabla Alimento_Consumido
      },
    },
    cantidad_gramos: {
      type: DataTypes.REAL, // Tipo 'real' para números con decimales
      allowNull: true,
      field: "cantidad_gramos",
    },
    carbohidratos_total: {
      type: DataTypes.REAL,
      allowNull: true,
      field: "carbohidratos_total",
    },
    grasas_total: {
      type: DataTypes.REAL,
      allowNull: true,
      field: "grasas_total",
    },
    proteinas_total: {
      type: DataTypes.REAL,
      allowNull: true,
      field: "proteinas_total",
    },
    calorias_total: {
      type: DataTypes.REAL,
      allowNull: true,
      field: "calorias_total",
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
    tableName: "Comidas_Alimentos", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de las relaciones

ComidaAlimento.belongsTo(AlimentoConsumido, {
  foreignKey: "id_alimento_consumido",
  as: "alimento",
});

ComidaAlimento.belongsTo(Comidas, {
  foreignKey: "id_comida",
  as: "comida",
});


export default ComidaAlimento;
