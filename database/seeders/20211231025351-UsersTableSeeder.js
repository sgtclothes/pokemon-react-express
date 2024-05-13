"use strict";

const crypto = require("crypto"),
    dotenv = require("dotenv").config(),
    secret = process.env.PASSWORD_SECRET;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "users",
            [
                {
                    us_username: "sigit",
                    us_password: crypto.createHmac("sha256", secret).update("password").digest("hex"),
                    us_email: "siko.spade31@gmail.com",
                    us_register: true,
                    us_active: 1,
                    us_created_on: new Date().toISOString(),
                },
                {
                  us_username: "phincon",
                  us_password: crypto.createHmac("sha256", secret).update("password").digest("hex"),
                  us_email: "phincon@gmail.com",
                  us_register: true,
                  us_active: 1,
                  us_created_on: new Date().toISOString(),
              },
            ],
            {},
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("users", null, {});
    },
};
