"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comidas_Alimentos", {
      id_comida_alimento: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_comida: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Comidas", // Debe coincidir con el tableName del modelo Comida
          key: "id_comida",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_alimento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Alimentos", // Debe coincidir con el tableName del modelo Alimento
          key: "id_alimento",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      cantidad_gramos: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      // Campos calculados
      carbohidratos_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      proteinas_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      grasas_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      calorias_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      // Timestamps
      fecha_creacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comidas_Alimentos");
  },
};
