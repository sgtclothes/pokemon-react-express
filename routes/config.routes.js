const configuration = require("../controllers/base/configuration");

module.exports = function (app) {
    app.post("/api/config", configuration.action.getByType);
    app.post("/api/config/update", configuration.action.updateByType);
};
