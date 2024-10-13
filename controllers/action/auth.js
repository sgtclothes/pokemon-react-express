const jwt = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
require("dotenv").config();
const baseModel = require("../base/model");
const baseLog = require("../base/log");
const baseToken = require("../base/token");
const helper = require("./helper");
const configJSONApp = require("../../config/json/app.json");
const configJSAuth = require("../../config/javascript/auth");
let datetime = moment().format();
const userModel = baseModel.models("User");
const tokenModel = baseModel.models("Token");

exports.action = {
    register: async (req, res) => {
        try {
            const { us_username, us_email, us_password, us_created_by } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json({ errors: errors.array() });
            }
            let user = await userModel.store({
                us_username: us_username,
                us_email: us_email,
                us_password: bcrypt.hashSync(us_password, 8),
                us_register: false,
                us_active: true,
                us_created_by: us_created_by,
                us_created_on: datetime,
            });
            if (!user) {
                return res.status(404).send(helper.response.createFailedResponse("Failed to create user"));
            }
            await baseLog.action.register(user.us_id);
            return res
                .status(200)
                .send(helper.response.createSuccessResponse("User was registered successfully!", user));
        } catch (error) {
            return res.status(500).send(helper.response.createFailedResponse(error.message));
        }
    },
    login: async (req, res) => {
        try {
            const { us_email, us_password, remember_me } = req.body;
            const errors = validationResult(req);
            let expiresIn = 86400; /** expire in 24 hours */
            if (!errors.isEmpty()) {
                return res.status(500).json({ errors: errors.array() });
            }
            let user = await userModel.findOne({
                where: {
                    us_email: us_email,
                },
            });
            if (remember_me) {
                expiresIn = expiresIn * 30; /** expire in 1 month */
            } 
            if (!user) {
                return res.status(404).send(helper.response.createFailedResponse("User not found"));
            }
            let passwordIsValid = bcrypt.compareSync(us_password, user.us_password);
            if (!passwordIsValid) {
                return res
                    .status(401)
                    .send(helper.response.createFailedResponse("Invalid Password!", { accessToken: null }));
            }
            let loginInfo = {
                us_id: user.us_id,
                us_username: user.us_username,
                us_email: user.us_email,
                status: "success",
                message: "user logged in",
                path: "/",
            };
            let { data: token } = baseToken.action.createToken(
                loginInfo,
                configJSAuth.secret,
                { expiresIn: expiresIn },
                res
            );
            let options = {
                path: "/",
                sameSite: true,
                maxAge: 1000 * expiresIn /** would expire after 24 hours */,
                httpOnly: false /** The cookie only accessible by the web server */,
                secure: false,
            };
            loginInfo.token = token;
            await baseToken.action.login(user.us_id, token, expiresIn);
            await baseLog.action.login(user.us_id);
            res.cookie("user-info", JSON.stringify(loginInfo), options);
            return res.cookie("x-access-token", token, options).status(200).send(loginInfo);
        } catch (error) {
            res.status(500).send(helper.response.createFailedResponse(error.message));
        }
    },
    logout: async (req, res) => {
        try {
            let token = req.cookies["x-access-token"];
            let { tkn_active } = await tokenModel.findOne({ where: { tkn_value: token } });
            if (!tkn_active) {
                return res.send(helper.response.createFailedResponse("Failed to logout"));
            }
            await tokenModel.update({ tkn_active: false }, { where: { tkn_value: token } });
            res.clearCookie("x-access-token");
            res.clearCookie("user-info");
            return res.status(200).send(helper.response.createSuccessResponse("Logout successfully"));
        } catch (error) {
            res.status(500).send(helper.response.createFailedResponse(error.message));
        }
    },
    changePassword: async (req, res) => {
        try {
            let { us_id, us_password, token } = req.body;
            let { tkn_active } = await tokenModel.findOne({ where: { tkn_value: token } });
            if (!tkn_active) {
                return res.send(helper.response.createFailedResponse("Failed to update user password"));
            }
            await userModel.update(
                {
                    us_password: bcrypt.hashSync(us_password, 8),
                    us_register: true,
                    us_updated_on: moment().format(),
                },
                { where: { us_id: us_id } }
            );
            await tokenModel.update({ tkn_active: false }, { where: { tkn_value: token } });
            res.status(200).send(helper.response.createSuccessResponse("User Password updated successfully!"));
        } catch (error) {
            res.status(500).send(helper.response.createFailedResponse(error.message));
        }
    },
};
