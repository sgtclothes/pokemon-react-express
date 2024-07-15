"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("configurations", {
      config_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      config_name: {
        type: Sequelize.STRING,
      },
      config_type: {
        type: Sequelize.STRING,
      },
      config_data: {
        type: Sequelize.JSON,
      },
      config_active: {
        type: Sequelize.BOOLEAN,
      },
      config_created_by: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      config_updated_by: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      config_created_on: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      config_updated_on: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("configurations");
  },
};
