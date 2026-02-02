import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db";
import Usuario from "./usuario.model";

// Atributos de la tabla
interface AguaAttributes {
  id_agua: number;
  id_usuario: number;
  cantidad_ml: number;
  fecha: Date;
}

// Atributos opcionales al crear (el ID es automático, fecha es opcional)
type AguaCreationAttributes = Optional<AguaAttributes, "id_agua" | "fecha">;

class Agua
  extends Model<AguaAttributes, AguaCreationAttributes>
  implements AguaAttributes
{
  public id_agua!: number;
  public id_usuario!: number;
  public cantidad_ml!: number;
  public fecha!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Agua.init(
  {
    id_agua: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id_usuario",
      },
    },
    cantidad_ml: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Agua",
    timestamps: true,
  },
);

// Definir relación (Un usuario tiene muchos registros de agua)
Usuario.hasMany(Agua, { foreignKey: "id_usuario" });
Agua.belongsTo(Usuario, { foreignKey: "id_usuario" });

export default Agua;
