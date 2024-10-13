const jwt = require("jsonwebtoken");
const { Navigator } = require("node-navigator");
const moment = require("moment");
const baseModel = require("./model");
const tokenModel = baseModel.models("Token");
const helper = require("../action/helper");
const configJSAuth = require("../../config/javascript/auth");
const configJSONApp = require("../../config/json/app.json");

exports.action = {
    login: async (id, token, expiresIn) => {
        try {
            let userIp = (await helper.client.getClientIP()).ip;
            let expiredDate = moment().add(expiresIn, "seconds").format();
            const tokenResponse = await tokenModel.store({
                tkn_type: configJSONApp.token.login.tkn_type,
                tkn_description: configJSONApp.token.login.tkn_description,
                tkn_value: token,
                tkn_client_agent: new Navigator().userAgent,
                tkn_client_ip: userIp,
                tkn_us_id: id,
                tkn_expired_on: expiredDate,
                tkn_active: true,
                tkn_created_by: id,
                tkn_created_on: moment().format(),
            });
            return helper.response.createSuccessResponse("Successfully to create token login!", tokenResponse);
        } catch (error) {
            return helper.response.createFailedResponse(error.message);
        }
    },
    createToken: (data, secret, config, res) => {
        try {
            const token = jwt.sign(data, secret, config);
            return helper.response.createSuccessResponse("Successfully create token", token);
        } catch (error) {
            return res.status(500).send(helper.response.createFailedResponse(error.message));
        }
    },
    verifyToken: (token, secret, res) => {
        try {
            const response = jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(401).send(helper.response.createFailedResponse("Unauthorized!"));
                }
                decoded.status = "success";
                return decoded;
            });
            return helper.response.createSuccessResponse("Successfully Verify Token", response);
        } catch (error) {
            return res.status(500).send(helper.response.createFailedResponse(error.message));
        }
    },
    verifyTokenChangePassword: async (req, res) => {
        try {
            const { token } = req.body;
            let response = this.action.verifyToken(token, configJSAuth.changePassword, res);
            let { tkn_active } = await tokenModel.findOne({ where: { tkn_value: token } });
            if (!tkn_active) {
                response.status = "failed";
                return res.status(400).send(
                    helper.response.createFailedResponse("Failed to Verify Token Change Password", response)
                );
            }
            return res.status(200).send(
                helper.response.createSuccessResponse("Successfully Verify Token Change Password", response)
            );
        } catch (error) {
            res.status(500).send(helper.response.createFailedResponse(error.message));
        }
    },
};
