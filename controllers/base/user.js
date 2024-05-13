const baseModel = require("./model");
const baseToken = require("./token");
const models = baseModel.models("User");
const config = require("../../config/auth.config");

const action = require("../action/action");

let additionalMethods = {
    loginInfo: (req, res) => {
        // let token = req.cookies["x-access-token"];
        let {token} = req.body;
        let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
        // action.logJSON.processJSON("login", loginInfo);
        res.status(200).send(loginInfo);
    },
};

exports.methods = () => {
    let methods = {};
    for (let i in models) {
        methods[i] = models[i];
    }
    for (let i in additionalMethods) {
        methods[i] = additionalMethods[i];
    }
    return methods;
};
