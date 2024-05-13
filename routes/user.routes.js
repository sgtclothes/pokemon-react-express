const { authJwt } = require("../middleware");
const user = require("../controllers").user;
const userPokemon = require("../controllers").userPokemon;
const log = require("../controllers").log;

module.exports = function (app) {
    app.post("/api/login/info",[authJwt.verifyAppToken], user.methods().loginInfo); 
    app.post("/api/myPokemon",[authJwt.verifyAppToken], userPokemon.methods().getAllMyPokemon); 
    app.post("/api/catchPokemon",[authJwt.verifyAppToken], userPokemon.methods().catchingPokemon); 
    app.post("/api/storePokemon",[authJwt.verifyAppToken], userPokemon.methods().storePokemon); 
    app.post("/api/releasePokemon",[authJwt.verifyAppToken], userPokemon.methods().releasePokemon); 
    app.post("/api/renamePokemon",[authJwt.verifyAppToken], userPokemon.methods().renamePokemon); 
    app.post("/api/log", [authJwt.verifyAppToken], log.methods().updateLog); 
};
