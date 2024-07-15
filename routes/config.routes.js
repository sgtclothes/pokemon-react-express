const configuration = require('../controllers').configuration;

module.exports = function (app) {
	app.post('/api/config', configuration.getConfiguration);
	app.post('/api/updateConfig', configuration.setConfiguration);
};
