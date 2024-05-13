"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.User.hasMany(models.UserPokemon, {
                foreignKey: "up_us_id",
                as: "userPokemons",
            });
        }
    }
    User.init(
        {
            us_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            us_username: DataTypes.STRING,
            us_password: DataTypes.STRING,
            us_email: DataTypes.STRING,
            us_register: DataTypes.BOOLEAN,
            us_active: DataTypes.BOOLEAN,
            us_created_by: DataTypes.INTEGER,
            us_updated_by: DataTypes.INTEGER,
            us_created_on: DataTypes.DATE,
            us_updated_on: DataTypes.DATE,
        },
        {
            sequelize,
            timestamps: false,
            tableName: "users",
            modelName: "User",
        },
    );
    return User;
};
