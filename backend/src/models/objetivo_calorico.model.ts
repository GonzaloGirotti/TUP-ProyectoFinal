import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import Usuario from "./usuario.model";

// Interface para los atributos de Objetivos
export interface Objetivo_Calorico_Attributes {
  id_objetivo_calorico: number;
  id_usuario: number;
  calorias_diarias: number;
  proteinas_diarias: number;
  grasas_diarias: number;
  carbohidratos_diarios: number;
  fecha_creacion?: Date;
  updatedAt?: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type ObjetivoCaloricoCreationAttributes = Optional<
  Objetivo_Calorico_Attributes,
  "id_objetivo_calorico"
>;

// Definición del modelo
class Objetivo_Calorico
  extends Model<
    Objetivo_Calorico_Attributes,
    ObjetivoCaloricoCreationAttributes
  >
  implements Objetivo_Calorico_Attributes
{
  public id_objetivo_calorico!: number;
  public id_usuario!: number;
  public calorias_diarias!: number;
  public proteinas_diarias!: number;
  public carbohidratos_diarios!: number;
  public grasas_diarias!: number;
  public fecha_creacion?: Date;
  public updatedAt?: Date;
}

// Inicialización del Modelo
Objetivo_Calorico.init(
  {
    id_objetivo_calorico: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_objetivo_calorico",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
    },
    calorias_diarias: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "calorias_diarias",
    },
    proteinas_diarias: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "proteinas_diarias",
    },
    grasas_diarias: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "grasas_diarias",
    },
    carbohidratos_diarios: {
      type: DataTypes.REAL, // Tipo 'real' para números con decimales
      allowNull: false,
      field: "carbohidratos_diarios",
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
    },
  },
  {
    sequelize,
    tableName: "objetivo_calorico", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de la Relación

// Una 'Comida' pertenece a un 'Usuario'.
Objetivo_Calorico.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un 'Usuario' tiene muchos 'Objetivo_Calorico'.
Usuario.hasMany(Objetivo_Calorico, {
  foreignKey: "id_usuario",
  as: "objetivos_caloricos",
});

export default Objetivo_Calorico;
