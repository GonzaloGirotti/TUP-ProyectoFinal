"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Registro_Diario", [
      {
        id_usuario: 2,
        fecha_creacion: new Date('2025-12-06T08:00:00Z'), // Fecha de creación del registro diario
        updatedAt: new Date('2025-12-06T08:00:00Z'), // Fecha de actualización del registro diario
      },
      {
        id_usuario: 2,
        fecha_creacion: new Date('2026-01-06T08:00:00Z'), // Fecha de creación del registro diario
        updatedAt: new Date('2026-01-06T08:00:00Z'), // Fecha de actualización del registro diario
      },
    ], {});
      },
  

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Registro_Diario", null, {});
    

  },
};
