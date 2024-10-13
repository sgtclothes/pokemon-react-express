let config = require('../../database/config/config.json');
require('dotenv').config();

let NODE_ENV = process.env.NODE_ENV;
let mode = config[NODE_ENV];

module.exports = {
	HOST: mode.host,
	USER: mode.username,
	PASSWORD: mode.password,
	DB: mode.database,
	dialect: mode.dialect,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
};
