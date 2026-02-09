import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db"; // Importación de nuestra conexión
import bcrypt from "bcryptjs";

// Interface para los atributos del Usuario
export interface UsuarioAttributes {
  id_usuario: number;
  nombre_usuario: string;
  nombre?: string;
  apellido?: string;
  email: string;
  urlAvatar?: string;
  password: string;
  fecha_nacimiento?: string;
  genero?: string;
  altura?: number;
  peso?: number;
  nivel_actividad?: string;
  tipo_objetivo?: string;
  fecha_creacion: Date;
  updatedAt: Date;
}

// Definición del Modelo
class Usuario
  extends Model<
    UsuarioAttributes,
    Optional<UsuarioAttributes, "id_usuario" | "fecha_creacion" | "updatedAt">
  >
  implements UsuarioAttributes
{
  public id_usuario!: number;
  public nombre_usuario!: string;
  public nombre?: string;
  public apellido?: string;
  public email!: string;
  public urlAvatar?: string;
  public password!: string;
  public fecha_nacimiento?: string;
  public genero?: string;
  public altura?: number;
  public peso?: number;
  public nivel_actividad?: string;
  public tipo_objetivo?: string;

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
      unique: {
        name: "nombre_usuario_unico",
        msg: "El nombre de usuario ya está en uso. Por favor elige otro.",
      },
      field: "nombre_usuario",
    },
    nombre: {
      type: DataTypes.TEXT,
      field: "nombre",
    },
    apellido: {
      type: DataTypes.TEXT,
      field: "apellido",
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: {
        name: "email_unico",
        msg: "Este correo electrónico ya está registrado.",
      },
      validate: {
        isEmail: {
          msg: "Debes ingresar un formato de email válido",
        },
      },
      field: "email",
    },
    urlAvatar: {
      type: DataTypes.TEXT,
      field: "urlAvatar",
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "password",
    },
    fecha_nacimiento: {
      type: DataTypes.STRING,
      field: "fecha_nacimiento",
    },
    genero: {
      type: DataTypes.TEXT,
      field: "genero",
    },
    altura: {
      type: DataTypes.FLOAT,
      field: "altura",
    },
    peso: {
      type: DataTypes.FLOAT,
      field: "peso",
    },
    nivel_actividad: {
      type: DataTypes.TEXT,
      field: "nivel_actividad",
    },
    tipo_objetivo: {
      type: DataTypes.TEXT,
      field: "tipo_objetivo",
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
    tableName: "usuarios", // El nombre de la tabla en la BD
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
