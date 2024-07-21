const { verifyAppToken } = require("../middleware").authJwt;
const { loginInfo } = require("../controllers").base.user;
const { getAllMyPokemon, catchingPokemon, storePokemon, releasePokemon, renamePokemon } =
    require("../controllers").base.userPokemon;
const { updateLog } = require("../controllers").base.log;

module.exports = function (app) {
    app.post("/api/login/info", [verifyAppToken], loginInfo);
    app.post("/api/myPokemon", [verifyAppToken], getAllMyPokemon);
    app.post("/api/catchPokemon", [verifyAppToken], catchingPokemon);
    app.post("/api/storePokemon", [verifyAppToken], storePokemon);
    app.post("/api/releasePokemon", [verifyAppToken], releasePokemon);
    app.post("/api/renamePokemon", [verifyAppToken], renamePokemon);
    app.post("/api/log", [verifyAppToken], updateLog);
};
