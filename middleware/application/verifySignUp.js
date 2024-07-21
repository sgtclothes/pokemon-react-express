const db = require("../../database/models");
const { check } = require("express-validator");
const User = db.User;

let checkIfExist = async (obj, value, name, alias) => {
    if (value) {
        let params = {};
        let where = {};
        where[name] = value;
        params = { where: where };
        let results = await obj.findOne(params);
        if (results) {
            throw new Error(alias + " already in use");
        }
    }
};

exports.checkDuplicateUsername = check("us_username")
    .not()
    .isEmpty()
    .withMessage("Name must have a value")
    .custom(async (us_username) => {
        await checkIfExist(User, us_username, "us_username", "Username");
    });

exports.checkDuplicateEmail = check("us_email")
    .not()
    .isEmpty()
    .withMessage("Email must have a value")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (us_email) => {
        await checkIfExist(User, us_email, "us_email", "Email");
    });

exports.checkPassword = check("us_password")
    .not()
    .isEmpty()
    .withMessage("Password must have a value")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .withMessage("Password must have at least 8 character, lowercase, uppercase, and number");
