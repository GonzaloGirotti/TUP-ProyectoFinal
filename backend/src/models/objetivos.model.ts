import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import Usuario from "./usuario.model";

// Interface para los atributos de Objetivos
export interface ObjetivosAttributes {
  id_objetivos: number;
  id_usuario: number;
  calorias: number;
  proteinas_proporcion: number;
  carbohidratos_proporcion: number;
  grasas_proporcion: number;
  peso_deseado: number;
  fecha_creacion?: Date;
  updatedAt?: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type ObjetivoCreationAttributes = Optional<ObjetivosAttributes, "id_objetivos">;

// Definición del modelo
class Objetivos
  extends Model<ObjetivosAttributes, ObjetivoCreationAttributes>
  implements ObjetivosAttributes
{
  public id_objetivos!: number;
  public id_usuario!: number;
  public calorias!: number;
  public proteinas_proporcion!: number;
  public carbohidratos_proporcion!: number;
  public grasas_proporcion!: number;
  public peso_deseado!: number;
  public fecha_creacion?: Date;
  public updatedAt?: Date;
}

// Inicialización del Modelo
Objetivos.init(
  {
    id_objetivos: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_objetivos",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
    },
    calorias: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "calorias",
    },
    carbohidratos_proporcion: {
      type: DataTypes.REAL, // Tipo 'real' para números con decimales
      allowNull: false,
      field: "carbohidratos_proporcion",
    },
    proteinas_proporcion: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "proteinas_proporcion",
    },
    grasas_proporcion: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "grasas_proporcion",
    },
    peso_deseado: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "peso_deseado",
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
    tableName: "Objetivos", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de la Relación

// Una 'Objetivos' pertenece a un 'Usuario'.
Objetivos.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un 'Usuario' tiene un 'Objetivos'.
Usuario.belongsTo(Objetivos, {
  foreignKey: "id_usuario",
  as: "objetivos", // Un alias para cuando consultemos el usuario
});

export default Objetivos;
