let jwt = require("jsonwebtoken");
const baseModel = require("./model");
const models = baseModel.models("Token");
const config = require("../../config/auth.config");

let additionalMethods = {
    createToken: (data, secret, config, res) => {
        try {
            let token = jwt.sign(data, secret, config);
            return token;
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    verifyToken: (token, secret, res) => {
        try {
            let response = jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        status: "failed",
                        message: "Unauthorized!"
                    });
                }
                decoded.status = "success";
                return decoded;
            });
            return response;
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    verifyTokenChangePassword: async (req, res) => {
        try {
            const { token } = req.body;
            let response = additionalMethods.verifyToken(token, config.changePassword, res);
            let { tkn_active } = await models.findOne({ where: { tkn_value: token } });
            if (tkn_active === false) response.status = "failed";
            res.send(response);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
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
