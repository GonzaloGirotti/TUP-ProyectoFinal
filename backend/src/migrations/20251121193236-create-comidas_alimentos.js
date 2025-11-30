"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comidas_Alimentos", {
      id_comida_alimento: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_comida: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Comidas",
          key: "id_comida",
        },
      },
      id_alimento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Alimentos",
          key: "id_alimento",
        },
      },
      cantidad_gramos: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      carbohidratos_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      grasas_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      proteinas_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      calorias_total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comidas_Alimentos");
  },
};
