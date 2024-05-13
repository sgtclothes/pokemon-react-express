"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("users", {
            us_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            us_username: {
                type: Sequelize.STRING,
                unique: true,
            },
            us_password: {
                type: Sequelize.STRING,
            },
            us_email: {
                type: Sequelize.STRING,
                unique: true,
            },
            us_register: {
                type: Sequelize.BOOLEAN,
            },
            us_active: {
                type: Sequelize.BOOLEAN,
            },
            us_created_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            us_updated_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            us_created_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            us_updated_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable("users");
    },
};
