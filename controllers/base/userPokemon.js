const baseModel = require("./model");
const baseToken = require("./token");
const models = baseModel.models("UserPokemon");
const config = require("../../config/auth.config");
const moment = require("moment");

let additionalMethods = {
    getAllMyPokemon: async (req, res) => {
        try {
            // let token = req.cookies["x-access-token"];
            let { token } = req.body;
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            let myPokemons = await models.findAll({ where: { up_us_id: loginInfo.us_id, up_active: true }, attributes: ["up_id", "up_pk_api_id", "up_pk_nickname"] });
            // action.logJSON.processJSON("login", loginInfo);
            res.status(200).send(myPokemons);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    catchingPokemon: async (req, res) => {
        try {
            const { token } = req.body;
            let response = {
                status: "failed",
                message: "pokemon flee",
            };
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            if (!loginInfo.us_id) {
                res.status(500).send({ message: "You Need to Login First" });
            }
            let isCaught = Math.round(Math.random());
            isCaught === 0
                ? (response = {
                      status: "failed",
                      message: "pokemon flee",
                  })
                : (response = {
                      status: "success",
                      message: "pokemon caught",
                  });
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    storePokemon: async (req, res) => {
        try {
            const { token, up_pk_api_id, up_pk_name, up_pk_nickname } = req.body;
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            if (!loginInfo.us_id) {
                res.status(500).send({ message: "You Need to Login First" });
            }
            let datetime = moment().format();
            let data = await models.store({
                up_us_id: loginInfo.us_id,
                up_pk_api_id: up_pk_api_id,
                up_pk_name: up_pk_name,
                up_pk_nickname: up_pk_nickname,
                up_fibonacci: 0,
                up_active: true,
                up_created_by: loginInfo.us_id,
                up_created_on: datetime,
            });
            res.status(200).send({ status: "success", data: data, message: "Pokemon stored successfully" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    releasePokemon: async (req, res) => {
        try {
            const { token, up_id } = req.body;
            let isPrime = true;
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            if (!loginInfo.us_id) {
                res.status(500).send({ message: "You Need to Login First" });
            }
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            if (randomNumber <= 1) isPrime = false;
            for (let i = 2; i <= Math.sqrt(randomNumber); i++) {
                if (randomNumber % i === 0) {
                    isPrime = false;
                }
            }
            let response = { status: "success", message: "Pokemon released successfully" };
			console.log(randomNumber);
            if (!isPrime) {
                response = {
                    status: "failed",
                    message: "Pokemon failed to released",
                };
            } else {
                await models.update(
                    {
                        up_active: false,
                    },
                    {
                        where: { up_id: up_id },
                    },
                );
            }
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    renamePokemon: async (req, res) => {
        try {
            const { token, up_pk_nickname, up_id } = req.body;
            let nickName = "";
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            if (!loginInfo.us_id) {
                res.status(500).send({ message: "You Need to Login First" });
            }
            let pokemonTarget = await models.findOne({ where: { up_id: up_id, up_active: true }, attributes: ["up_id", "up_pk_nickname"] });
            let arrNickName = pokemonTarget.up_pk_nickname.split("-");
            let cursor = arrNickName[arrNickName.length - 1];
            if (typeof cursor != "string") isNumeric = false;
            isNumeric = !isNaN(cursor) && !isNaN(parseFloat(cursor));
            let nextCursor = 0;
            let nextFibonacci = (prevFibonacci) => {
                let prev = 0;
                let current = 1;
                if (prevFibonacci === 0) {
                    return 1;
                } else if (prevFibonacci === 1) {
                    return 1;
                }
                let next;
                while (true) {
                    next = prev + current;
                    if (next > prevFibonacci) {
                        return next;
                    }
                    prev = current;
                    current = next;
                }
            };
            if (isNumeric) {
                nextCursor = nextFibonacci(cursor);
                nickName = up_pk_nickname + "-" + nextCursor;
            } else {
                nickName = up_pk_nickname + "-" + 0;
            }
            let response = { status: "success", message: "Pokemon renamed successfully" };
            await models.update(
                {
                    up_pk_nickname: nickName,
                },
                {
                    where: { up_id: up_id, up_active: true },
                },
            );
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
};

exports.methods = () => {
    let methods = {};
    for (let i in models) {
        methods[i] = models[i];
    }
    for (let i in additionalMethods) {
        methods[i] = additionalMethods[i];
    }
    return methods;
};
