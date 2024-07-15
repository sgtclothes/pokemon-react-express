"use strict";
const fs = require("fs");
const path = require("path");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "pokemon_logic_value.json");
    const pokemonLogicValue = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return queryInterface.bulkInsert(
      "configurations",
      [
        {
          config_id: 1,
          config_name: "Pokemon Logic",
          config_type: "logic",
          config_data: JSON.stringify(pokemonLogicValue),
          config_active: 1,
          config_created_on: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("configurations", null, {});
  },
};
