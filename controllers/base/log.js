const baseModel = require("./model");
const baseToken = require("./token");
const models = baseModel.models("Log");
const config = require("../../config/auth.config");

const action = require("../action/action");

let additionalMethods = {
    updateLog: (req, res) => {
        let token = req.cookies["x-access-token"];
        let data = req.body;
        let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
        data['loginInfo'] = loginInfo;
        action.logJSON.processJSON("search", data, res);
        res.status(200).send(data);
    }
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
