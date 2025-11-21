import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
// import Comidas_Alimentos from "./comida_alimento.model"; //Importacion del modelo Comida_Alimento para la relación

// Interface para los atributos de Alimento
export interface AlimentoAttributes {
  id_alimento: number;
  nombre: string;
  carbohidratos: number;
  proteinas: number;
  grasas: number;
  calorias: number;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type AlimentoCreationAttributes = Optional<AlimentoAttributes, "id_alimento">;

// Definición del modelo
class Alimento
  extends Model<AlimentoAttributes, AlimentoCreationAttributes>
  implements AlimentoAttributes
{
  public id_alimento!: number;
  public nombre!: string;
  public carbohidratos!: number;
  public proteinas!: number;
  public grasas!: number;
  public calorias!: number;
}

// Inicialización del Modelo
Alimento.init(
  {
    id_alimento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_alimento",
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    carbohidratos: {
      type: DataTypes.REAL, // Tipo 'real' para números con decimales
      allowNull: false,
      field: "carbohidratos",
    },
    proteinas: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "proteinas",
    },
    grasas: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "grasas",
    },
    calorias: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "calorias",
    },
  },
  {
    sequelize,
    tableName: "Alimentos", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);

// Definición de la Relación

// Un 'Alimento' pertenece a una 'Comida_Alimento'.
// Alimento.belongsTo(Comida_Alimento, {
//   foreignKey: "id_alimento",
//   as: "alimento",
// });

// Una 'Comida_Alimento' tiene muchos 'Alimentos'
// Comida_Alimento.hasMany(Alimento, {
//   foreignKey: "id_alimento",
//   as: "alimento",
// });

export default Alimento;
