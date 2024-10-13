const authJWT = require("../middleware/application/authJWT");
const userPokemon = require("../controllers/base/userPokemon");

module.exports = function (app) {
    app.post("/api/myPokemon", [authJWT.verifyAppToken], userPokemon.action.getAllMyPokemon);
    app.post("/api/catchPokemon", [authJWT.verifyAppToken], userPokemon.action.catchPokemon);
    app.post("/api/storePokemon", [authJWT.verifyAppToken], userPokemon.action.storePokemon);
    app.post("/api/releasePokemon", [authJWT.verifyAppToken], userPokemon.action.releasePokemon);
    app.post("/api/renamePokemon", [authJWT.verifyAppToken], userPokemon.action.renamePokemon);
};
