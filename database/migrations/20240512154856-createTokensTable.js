"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("tokens", {
            tkn_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            tkn_type: {
                type: Sequelize.STRING,
            },
            tkn_value: {
                type: Sequelize.TEXT,
            },
            tkn_description: {
                type: Sequelize.STRING,
            },
            tkn_client_ip: {
                type: Sequelize.STRING,
            },
            tkn_client_agent: {
                type: Sequelize.STRING,
            },
            tkn_us_id: {
                type: Sequelize.INTEGER,
            },
            tkn_expired_on: {
                type: Sequelize.DATE,
            },
            tkn_active: {
                type: Sequelize.BOOLEAN,
            },
            tkn_created_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            tkn_updated_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            tkn_created_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            tkn_updated_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable("tokens");
    },
};
