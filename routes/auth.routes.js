const { verifySignUp } = require("../middleware");
const auth = require("../controllers/action/auth");
const token = require("../controllers/base/token");

module.exports = function (app) {
    app.post(
        "/api/auth/register",
        [verifySignUp.checkDuplicateEmail, verifySignUp.checkPassword],
        auth.action.register
    );
    app.post("/api/auth/login", auth.action.login);
    app.get("/api/auth/logout", auth.action.logout);
    app.post("/api/auth/changePassword", auth.action.changePassword);
    app.post("/api/auth/verifyTokenChangePassword", token.action.verifyTokenChangePassword);
};
