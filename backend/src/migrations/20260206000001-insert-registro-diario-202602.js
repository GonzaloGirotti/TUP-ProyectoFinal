"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert a Registro_Diario row for id_usuario = 1 on 2026-02-06
    await queryInterface.bulkInsert('Registro_Diario', [{
      id_usuario: 1,
    
      fecha_creacion: new Date('2026-02-06T00:00:00Z'),
      updatedAt: new Date('2026-02-06T00:00:00Z')
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Registro_Diario', {
      id_usuario: 1,
            fecha_creacion: new Date('2026-02-06T00:00:00Z'),
    }, {});
  },
};
