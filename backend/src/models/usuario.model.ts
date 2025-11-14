import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import bcrypt from "bcryptjs";

// Interface para los atributos del Usuario
export interface UsuarioAttributes {
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  password: string;
  fecha_nacimiento?: Date;
  genero?: string;
  fecha_creacion: Date;
  updatedAt: Date;
}

// Definición del Modelo
class Usuario
  extends Model<
    UsuarioAttributes,
    Optional<UsuarioAttributes, "id_usuario" | "fecha_creacion" | "updatedAt">
  >
  implements UsuarioAttributes {
  public id_usuario!: number;
  public nombre_usuario!: string;
  public email!: string;
  public password!: string;
  public fecha_nacimiento?: Date;
  public genero?: string;

  // Timestamps
  public readonly fecha_creacion!: Date;
  public readonly updatedAt!: Date;

  // Métodos de Instancia
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

// Inicialización del Modelo
Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_usuario", // Mapeo a la columna de la BD
    },
    nombre_usuario: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "nombre_usuario",
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "password",
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      field: "fecha_nacimiento",
    },
    genero: {
      type: DataTypes.TEXT,
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
    tableName: "Usuarios", // El nombre de la tabla en la BD
    timestamps: true, // Habilitar timestamps
    createdAt: "fecha_creacion", // Mapear createdAt a 'fecha_creacion'
    updatedAt: "updatedAt", // Mapear updatedAt a 'updatedAt'
    hooks: {
      // Hook de "antes de crear" para hashear la contraseña
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      // Hook de "antes de actualizar" (si se actualiza la contraseña)
      beforeUpdate: async (usuario) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  },
);

export default Usuario;
