const { Navigator } = require("node-navigator");
const jwt = require("jsonwebtoken");
const navigator = new Navigator();
const moment = require("moment");
var bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
require("dotenv").config();

const db = require("../../database/models");
const base = require("../base");
const helper = require("./helper");

const logConfig = require("../../config/app.json").log;
const tokenConfig = require("../../config/app.json").token;
const config = require("../../config/auth.config");

const Op = db.Sequelize.Op;

exports.register = async (req, res) => {
    try {
        let { us_username, us_email, us_password, us_created_by } = req.body;
        let logData = logConfig.registerNewUser;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(500).json({
                errors,
            });
        }
        let datetime = moment().format();
        let user = await base.user.methods().store({
            us_username: us_username,
            us_email: us_email,
            us_password: bcrypt.hashSync(us_password, 8),
            us_register: false,
            us_active: true,
            us_created_by: us_created_by,
            us_created_on: datetime,
        });
        logData.log_created_by = us_created_by;
        logData.log_created_on = datetime;
        await base.log.methods().store(logData);
        res.send({ message: "User was registered successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        let { us_email, us_password, remember_me } = req.body;
        let user = await base.user.methods().findOne({
            where: {
                us_email: us_email,
            },
        });
        let expiresIn = 86400; /** expire in 24 hours */
        if (remember_me) expiresIn = expiresIn * 30;
        if (!user) {
            return res.status(404).send({ status: "failed", message: "User Not found." });
        }
        let passwordIsValid = bcrypt.compareSync(us_password, user.us_password);
        console.log(passwordIsValid);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
                status: "failed",
            });
        }
        let loginInfo = {
            us_id: user.us_id,
            us_username: user.us_username,
            us_email: user.us_email,
            status: "success",
            message: "user logged in",
            path: "/",
        };
        let tokenUser = base.token.createToken(loginInfo, config.secret, { expiresIn: expiresIn }, res);
        let tokenData = tokenConfig.login;
        let userIp = (await helper.getClientIP()).ip;
        let datetime = moment().format();
        let expiredDate = moment().add(expiresIn, "seconds").format();
        await base.token.methods().store({
            tkn_type: tokenData.tkn_type,
            tkn_description: tokenData.tkn_description,
            tkn_value: tokenUser,
            tkn_client_agent: navigator.userAgent,
            tkn_client_ip: userIp,
            tkn_us_id: user.us_id,
            tkn_expired_on: expiredDate,
            tkn_active: true,
            tkn_created_by: user.us_id,
            tkn_created_on: datetime,
        });
        let options = {
            path: "/",
            sameSite: true,
            maxAge: 1000 * expiresIn /** would expire after 24 hours */,
            httpOnly: true /** The cookie only accessible by the web server */,
        };
        loginInfo.token = tokenUser;
        res.cookie("x-access-token", tokenUser, options).status(200).send(loginInfo);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
exports.logout = async (req, res) => {
    // let token = req.cookies["x-access-token"];
    let token = req.query.token;
    let { tkn_active } = await base.token.methods().findOne({ where: { tkn_value: token } });
    if (!tkn_active) {
        res.send({ status: "failed", message: "Failed to logout" });
    }
    await base.token.methods().update(
        {
            tkn_active: false,
        },
        {
            where: { tkn_value: token },
        }
    );
    res.clearCookie("x-access-token");
    res.send({ status: "success", message: "Logout successfully" });
};
exports.changePassword = async (req, res) => {
    try {
        let datetime = moment().format();
        let { us_id, us_password, token } = req.body;
        let { tkn_active } = await base.token.methods().findOne({ where: { tkn_value: token } });
        if (!tkn_active) {
            res.send({ status: "failed", message: "Failed to update user password" });
        }
        await base.user.methods().update(
            {
                us_password: bcrypt.hashSync(us_password, 8),
                us_register: true,
                us_updated_on: datetime,
            },
            { where: { us_id: us_id } }
        );
        await base.token.methods().update(
            {
                tkn_active: false,
            },
            {
                where: { tkn_value: token },
            }
        );
        res.send({ status: "success", message: "User Password updated successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
