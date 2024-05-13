'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Log extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {}
	}
	Log.init(
		{
			log_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			log_type: DataTypes.STRING,
			log_name: DataTypes.STRING,
			log_description: DataTypes.STRING,
			log_active: DataTypes.BOOLEAN,
			log_created_by: DataTypes.INTEGER,
			log_updated_by: DataTypes.INTEGER,
			log_created_on: DataTypes.DATE,
			log_updated_on: DataTypes.DATE
		},
		{
			sequelize,
			timestamps: false,
			tableName: 'logs',
			modelName: 'Log'
		}
	);
	return Log;
};
