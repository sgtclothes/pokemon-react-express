const db = require('../../database/models');

exports.models = (key) => {
	let model = db[key];
	return {
		findAll: async (query) => {
			try {
				let result = await model.findAll(query);
				return result;
			} catch (error) {
				console.log(error.message);
			}
		},
		findByPk: async (id) => {
			try {
				let result = await model.findByPk(id);
				return result;
			} catch (error) {
				console.log(error.message);
			}
		},
		findOne: async (query) => {
			try {
				let result = await model.findOne(query);
				return result;
			} catch (error) {
				console.log(error.message);
			}
		},
		findOrCreate: async (data) => {
			try {
				let result = await model.findOrCreate(data);
				return result;
			} catch (error) {
				console.log(error.message);
			}
		},
		findAndCountAll: async (data) => {
			try {
				let result = await model.findAndCountAll(data);
				return result;
			} catch (error) {
				console.log(error.message);
			}
		},
		store: async (data) => {
			try {
				let result = await model.create(data);
				return result;
			} catch (error) {
				console.log(error.message);
			}
		},
		update: async (data, options) => {
			try {
				let result = await model.update(data, options);
				return result;
			} catch (error) {
				console.log(error.message);
			}
		}
	};
};
