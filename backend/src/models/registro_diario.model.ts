import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import Usuario from "./usuario.model";

// Interface para los atributos de Objetivos
export interface Registro_Diario_Attributes {
  id_registro_diario: number;
  id_usuario: number;
  fecha: Date;
  agua_total_litros: number;
  fecha_creacion?: Date;
  updatedAt?: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type RegistroDiarioCreationAttributes = Optional<
  Registro_Diario_Attributes,
  "id_registro_diario"
>;

// Definición del modelo
class Registro_Diario
  extends Model<Registro_Diario_Attributes, RegistroDiarioCreationAttributes>
  implements Registro_Diario_Attributes
{
  public id_registro_diario!: number;
  public id_usuario!: number;
  public fecha!: Date;
  public agua_total_litros!: number;
  public fecha_creacion?: Date;
  public updatedAt?: Date;
}

// Inicialización del Modelo
Registro_Diario.init(
  {
    id_registro_diario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_registro_diario",
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
    agua_total_litros: {
      type: DataTypes.REAL,
      allowNull: false,
      field: "agua_total_litros",
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
    tableName: "Registro_Diario", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de la Relación

// Un 'Registro_Diario' pertenece a un 'Usuario'.
Registro_Diario.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un 'Usuario' tiene muchos 'Registro_Diario'.
Usuario.hasMany(Registro_Diario, {
  foreignKey: "id_usuario",
  as: "registros_diarios",
});

export default Registro_Diario;
