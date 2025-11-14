import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db'; // Importación de nuestra conexión
import Usuario from './usuario.model'; // Importacion del modelo Usuario para la relación

// Interface para los atributos de Peso
export interface PesoAttributes {
    id_peso: number;
    id_usuario: number; // Clave foránea
    fecha: Date;
    peso_kg: number;
    comentario: string | null; // El comentario puede ser nulo
    fecha_creacion: Date;
    updatedAt: Date;
}

// Interface para la creación (hace opcionales los campos auto-generados)
type PesoCreationAttributes = Optional<PesoAttributes, 'id_peso' | 'fecha_creacion' | 'updatedAt' | 'comentario' | 'fecha'>;


// Definición del Modelo
class Peso extends Model<PesoAttributes, PesoCreationAttributes> implements PesoAttributes {
    public id_peso!: number;
    public id_usuario!: number;
    public fecha!: Date;
    public peso_kg!: number;
    public comentario!: string | null;

    // Timestamps
    public readonly fecha_creacion!: Date;
    public readonly updatedAt!: Date;
}

// Inicialización del Modelo
Peso.init(
    {
        id_peso: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id_peso',
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_usuario',
            references: {
                model: Usuario, // Referencia al modelo Usuario
                key: 'id_usuario', // La columna en la tabla Usuarios
            },
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Por defecto, la fecha actual
        },
        peso_kg: {
            type: DataTypes.REAL, // Tipo 'real' para números con decimales
            allowNull: false,
            field: 'peso_kg',
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true, // El comentario es opcional
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'fecha_creacion',
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updatedAt',
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        tableName: 'Pesos', // Nombre de la tabla en la BD
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'updatedAt',
    }
);
// Definición de la Relación

// Un 'Peso' pertenece a un 'Usuario'.
Peso.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

// Un 'Usuario' tiene muchos 'Pesos'.
Usuario.hasMany(Peso, {
    foreignKey: 'id_usuario',
    as: 'pesos' // Un alias para cuando consultemos el usuario
});

export default Peso;