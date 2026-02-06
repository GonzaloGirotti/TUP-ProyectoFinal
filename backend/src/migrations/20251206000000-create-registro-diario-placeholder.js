"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Registro_Diario", {
      id_registro_diario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
        id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "Usuarios",
            key: "id_usuario",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
        }
  });


},

    async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Registro_Diario");
    },
};