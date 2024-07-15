"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Configuration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Configuration.init(
    {
      config_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      config_name: DataTypes.STRING,
      config_type: DataTypes.STRING,
      config_data: DataTypes.JSON,
      config_active: DataTypes.BOOLEAN,
      config_created_by: DataTypes.INTEGER,
      config_updated_by: DataTypes.INTEGER,
      config_created_on: DataTypes.DATE,
      config_updated_on: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      tableName: "configurations",
      modelName: "Configuration",
    }
  );
  return Configuration;
};
