const authJWT = require("../middleware/application/authJWT");
const user = require("../controllers/base/user");

module.exports = function (app) {
    app.get("/api/users", [authJWT.verifyAppToken], user.action.getAll);
};
