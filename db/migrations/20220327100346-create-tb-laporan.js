"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tb_laporans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_arep: {
        type: Sequelize.STRING,
      },
      judul: {
        type: Sequelize.STRING,
      },
      file: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      koreksi: {
        type: Sequelize.STRING,
      },
      pengoreksi: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tb_laporans");
  },
};
