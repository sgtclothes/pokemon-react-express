'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Token extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {}
	}
	Token.init(
		{
			tkn_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			tkn_type: DataTypes.STRING,
			tkn_value: DataTypes.TEXT,
			tkn_description: DataTypes.STRING,
			tkn_client_ip: DataTypes.STRING,
			tkn_client_agent: DataTypes.STRING,
            tkn_us_id: DataTypes.INTEGER,
            tkn_expired_on: DataTypes.DATE,
			tkn_active: DataTypes.BOOLEAN,
			tkn_created_by: DataTypes.INTEGER,
			tkn_updated_by: DataTypes.INTEGER,
			tkn_created_on: DataTypes.DATE,
			tkn_updated_on: DataTypes.DATE
		},
		{
			sequelize,
			timestamps: false,
			tableName: 'tokens',
			modelName: 'Token'
		}
	);
	return Token;
};
