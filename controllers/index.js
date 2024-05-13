const action = require('./action');
const base = require('./base');

const auth = action.auth;

const user = base.user;
const log = base.log;
const token = base.token;
const userPokemon = base.userPokemon;

module.exports = {
	auth,
	user,
	log,
	token,
	userPokemon,
};
