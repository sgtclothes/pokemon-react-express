"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserPokemon extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.UserPokemon.belongsTo(models.User, {
                foreignKey: "up_us_id",
                as: "users",
            });
        }
    }
    UserPokemon.init(
        {
            up_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            up_us_id: DataTypes.INTEGER,
            up_pk_api_id: DataTypes.INTEGER,
            up_pk_name: DataTypes.STRING,
            up_pk_nickname: DataTypes.STRING,
            up_active: DataTypes.BOOLEAN,
            up_created_by: DataTypes.INTEGER,
            up_updated_by: DataTypes.INTEGER,
            up_created_on: DataTypes.DATE,
            up_updated_on: DataTypes.DATE,
        },
        {
            sequelize,
            timestamps: false,
            tableName: "users_pokemons",
            modelName: "UserPokemon",
        },
    );
    return UserPokemon;
};
