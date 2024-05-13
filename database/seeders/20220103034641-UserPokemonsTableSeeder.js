"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users_pokemons",
      [
        {
          up_us_id: 1,
          up_pk_api_id: 1,
          up_pk_name: "bulbasaur",
          up_pk_nickname: "mighty bulbasaur",
          up_active: 1,
          up_created_on: new Date().toISOString(),
        },
        {
          up_us_id: 1,
          up_pk_api_id: 2,
          up_pk_name: "ivysaur",
          up_pk_nickname: "mighty ivysaur",
          up_active: 1,
          up_created_on: new Date().toISOString(),
        },
        {
          up_us_id: 2,
          up_pk_api_id: 1,
          up_pk_name: "bulbasaur",
          up_pk_nickname: "mighty bulbasaur",
          up_active: 1,
          up_created_on: new Date().toISOString(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users_pokemons", null, {});
  },
};
