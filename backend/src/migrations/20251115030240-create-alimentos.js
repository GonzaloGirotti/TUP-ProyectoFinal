"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Corresponde a alimento.model.ts
    await queryInterface.createTable("Alimentos", {
      id_alimento: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      carbohidratos: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      proteinas: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      grasas: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      calorias: {
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
    await queryInterface.dropTable("Alimentos");
  },
};
