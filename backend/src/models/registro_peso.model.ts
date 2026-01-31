import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import Usuario from "./usuario.model";

// Interface para los atributos de Objetivos
export interface Registro_Peso_Attributes {
  id_registro_peso: number;
  id_usuario: number;
  fecha: Date;
  peso_kg: number;
  fecha_creacion?: Date;
  updatedAt?: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type RegistroPesoCreationAttributes = Optional<
  Registro_Peso_Attributes,
  "id_registro_peso"
>;

// Definición del modelo
class Registro_Peso
  extends Model<Registro_Peso_Attributes, RegistroPesoCreationAttributes>
  implements Registro_Peso_Attributes
{
  public id_registro_peso!: number;
  public id_usuario!: number;
  public fecha!: Date;
  public peso_kg!: number;
  public fecha_creacion?: Date;
  public updatedAt?: Date;
}

// Inicialización del Modelo
Registro_Peso.init(
  {
    id_registro_peso: {
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
    tableName: "Objetivo_Peso", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de la Relación

// Un 'Registro_Peso' pertenece a un 'Usuario'.
Registro_Peso.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un 'Usuario' tiene muchos 'Registro_Peso'.
Usuario.hasMany(Registro_Peso, {
  foreignKey: "id_usuario",
  as: "registros_peso",
});

export default Registro_Peso;
