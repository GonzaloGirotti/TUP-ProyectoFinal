import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import Usuario from "./usuario.model";

// Interface para los atributos de Objetivos
export interface Objetivo_Peso_Attributes {
  id_objetivo_peso: number;
  id_usuario: number;
  fecha?: Date;
  peso_kg: number;
  fecha_creacion?: Date;
  updatedAt?: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type ObjetivoPesoCreationAttributes = Optional<
  Objetivo_Peso_Attributes,
  "id_objetivo_peso"
>;

// Definición del modelo
class Objetivo_Peso
  extends Model<Objetivo_Peso_Attributes, ObjetivoPesoCreationAttributes>
  implements Objetivo_Peso_Attributes
{
  public id_objetivo_peso!: number;
  public id_usuario!: number;
  public fecha!: Date;
  public peso_kg!: number;
  public fecha_creacion?: Date;
  public updatedAt?: Date;
}

// Inicialización del Modelo
Objetivo_Peso.init(
  {
    id_objetivo_peso: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_objetivo_peso",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "fecha",
    },
    peso_kg: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "peso_kg",
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
    tableName: "objetivo_peso", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de la Relación

// Un 'Objetivo_Peso' pertenece a un 'Usuario'.
Objetivo_Peso.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un 'Usuario' tiene muchos 'Objetivo_Peso'.
Usuario.hasMany(Objetivo_Peso, {
  foreignKey: "id_usuario",
  as: "objetivos_peso",
});

export default Objetivo_Peso;
