import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import Usuario from "./usuario.model";

// Interface para los atributos de Ejercicio
export interface Ejercicio_Attributes {
  id_ejercicio: number;
  id_registro_diario: number;
  tipo: string;
  duracion_minutos: number;
  calorias_quemadas: number;
  fecha_creacion?: Date;
  updatedAt?: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type EjercicioCreationAttributes = Optional<
  Ejercicio_Attributes,
  "id_ejercicio"
>;

// Definición del modelo
class Ejercicio
  extends Model<Ejercicio_Attributes, EjercicioCreationAttributes>
  implements Ejercicio_Attributes
{
  public id_ejercicio!: number;
  public id_registro_diario!: number;
  public tipo!: string;
  public duracion_minutos!: number;
  public calorias_quemadas!: number;
  public fecha_creacion?: Date;
  public updatedAt?: Date;
}

// Inicialización del Modelo
Ejercicio.init(
  {
    id_ejercicio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_ejercicio",
    },
    id_registro_diario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_registro_diario",
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "tipo",
    },
    duracion_minutos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "duracion_minutos",
    },
    calorias_quemadas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "calorias_quemadas",
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
    tableName: "Ejercicio", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de la Relación

// Un 'Ejercicio' pertenece a un 'Usuario'.
Ejercicio.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un 'Usuario' tiene muchos 'Ejercicio'.
Usuario.hasMany(Ejercicio, {
  foreignKey: "id_usuario",
  as: "ejercicios",
});

export default Ejercicio;
