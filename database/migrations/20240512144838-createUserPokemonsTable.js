"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("users_pokemons", {
            up_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            up_us_id: {
                type: Sequelize.INTEGER,
            },
            up_pk_api_id: {
                type: Sequelize.INTEGER,
            },
            up_pk_name: {
                type: Sequelize.STRING,
            },
            up_pk_nickname: {
                type: Sequelize.STRING,
            },
            up_active: {
                type: Sequelize.BOOLEAN,
            },
            up_created_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            up_updated_by: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            up_created_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            up_updated_on: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable("users_pokemons");
    },
};
