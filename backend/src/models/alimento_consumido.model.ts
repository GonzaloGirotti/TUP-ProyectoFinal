import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
// import Comidas_Alimentos from "./comida_alimento.model"; //Importacion del modelo Comida_Alimento para la relación

// Interface para los atributos de Alimento
export interface AlimentoConsumidoAttributes {
  id_alimento_consumido: number;
  nombre: string;
  gramos: number;
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type AlimentoConsumidoCreationAttributes = Optional<
  AlimentoConsumidoAttributes,
  "id_alimento_consumido"
>;

// Definición del modelo
class AlimentoConsumido
  extends Model<
    AlimentoConsumidoAttributes,
    AlimentoConsumidoCreationAttributes
  >
  implements AlimentoConsumidoAttributes
{
  public id_alimento_consumido!: number;
  public nombre!: string;
  public gramos!: number;
  public calorias!: number;
  public proteinas!: number;
  public grasas!: number;
  public carbohidratos!: number;
}

// Inicialización del Modelo
AlimentoConsumido.init(
  {
    id_alimento_consumido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_alimento_consumido",
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gramos: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    calorias: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    proteinas: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    grasas: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    carbohidratos: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Alimento_Consumido", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);

export default AlimentoConsumido;
