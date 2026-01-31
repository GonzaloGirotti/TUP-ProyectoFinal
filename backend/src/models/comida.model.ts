import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import Usuario from "./usuario.model"; // Importacion del modelo Usuario para la relación
import Alimento from "./alimento_consumido.model"; // Importacion del modelo Alimento para la relación

// Interface para los atributos de Comida
export interface ComidaAttributes {
  id_comida: number;
  id_usuario: number; // Clave foránea
  fecha: Date;
  nombre_comida: string;
  fecha_creacion: Date;
  updatedAt: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type ComidaCreationAttributes = Optional<
  ComidaAttributes,
  "id_comida" | "fecha_creacion" | "updatedAt"
>;

// Definición del Modelo
class Comida
  extends Model<ComidaAttributes, ComidaCreationAttributes>
  implements ComidaAttributes
{
  public id_comida!: number;
  public id_usuario!: number;
  public fecha!: Date;
  public nombre_comida!: string;

  // Timestamps
  public readonly fecha_creacion!: Date;
  public readonly updatedAt!: Date;
}

// Inicialización del Modelo
Comida.init(
  {
    id_comida: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_comida",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: {
        model: Usuario, // Referencia al modelo Usuario
        key: "id_usuario", // La columna en la tabla Usuarios
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Por defecto, la fecha actual
    },
    nombre_comida: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "Comidas", // Nombre de la tabla en la BD
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "updatedAt",
  },
);
// Definición de la Relación

// Una 'Comida' pertenece a un 'Usuario'.
Comida.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un 'Usuario' tiene muchas 'Comidas'.
Usuario.hasMany(Comida, {
  foreignKey: "id_usuario",
  as: "comidas", // Un alias para cuando consultemos el usuario
});

Alimento.belongsToMany(Comida, {
  through: "Comidas_Alimentos",
  foreignKey: "id_alimento",
  otherKey: "id_comida",
  as: "comidas",
});

export default Comida;
