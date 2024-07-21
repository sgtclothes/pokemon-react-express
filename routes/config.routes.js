const { getConfiguration, setConfiguration } = require("../controllers").action.configuration;

module.exports = function (app) {
    app.post("/api/config", getConfiguration);
    app.post("/api/updateConfig", setConfiguration);
};
