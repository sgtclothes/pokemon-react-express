"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("logs", {
            log_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            log_type: {
                type: Sequelize.STRING,
            },
            log_name: {
                type: Sequelize.STRING,
            },
            log_description: {
                type: Sequelize.STRING,
            },
            log_active: {
                type: Sequelize.BOOLEAN,
            },
            log_created_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            log_updated_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            log_created_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            log_updated_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable("logs");
    },
};
