const jwt = require("jsonwebtoken");
const config = require("../../config/javascript/auth.js");
const db = require("../../database/models");
const User = db.User;

exports.verifyAppToken = (req, res, next) => {
    let token = req.cookies["x-access-token"];
    console.log(token);
    if (!token) {
        return res.status(403).send({
            status: "failed",
            message: "No token provided!",
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                status: "failed",
                message: "Unauthorized!",
            });
        }
        req.us_id = decoded.id;
        next();
    });
};
