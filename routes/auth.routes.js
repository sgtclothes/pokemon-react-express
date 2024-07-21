const { verifySignUp } = require("../middleware");
const { register, login, logout, changePassword } = require("../controllers").action.auth;
const { verifyTokenChangePassword } = require("../controllers").base.token;

module.exports = function (app) {
    app.post("/api/auth/register", [verifySignUp.checkDuplicateEmail, verifySignUp.checkPassword], register);
    app.post("/api/auth/login", login);
    app.get("/api/auth/logout", logout);
    app.post("/api/auth/changePassword", changePassword);
    app.post("/api/auth/verifyToken", verifyTokenChangePassword);
};
