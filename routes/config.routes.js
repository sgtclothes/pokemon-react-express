const configuration = require("../controllers").action.configuration;

module.exports = function (app) {
    app.post("/api/config", configuration.getConfiguration);
    app.post("/api/updateConfig", configuration.setConfiguration);
};
