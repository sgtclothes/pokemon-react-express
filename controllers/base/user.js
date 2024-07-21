const baseModel = require("./model");
const { verifyToken } = require("./token");
const { updateJSONWhenLogin } = require("./log");
const models = baseModel.models("User");
const config = require("../../config/auth.config");

exports.loginInfo = (req, res) => {
    let { token } = req.body;
    let data = verifyToken(token, config.secret, res);
    console.log(data);
    updateJSONWhenLogin(data)
    // action.logJSON.processJSON("login", loginInfo);
    res.status(200).send(data);
};

exports.methods = () => {
    let methods = {};
    for (let i in models) {
        methods[i] = models[i];
    }
    return methods;
};
