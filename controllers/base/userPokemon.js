const baseModel = require("./model");
const baseToken = require("./token");
const models = baseModel.models("UserPokemon");
const config = require("../../config/auth.config");
const pokemonConfig = baseModel.models("Configuration");
const number = require("./number");
const moment = require("moment");

let additionalMethods = {
    testLogic: async (req, res) => {
        function checkNumberAfterDash(str) {
            const match = str.match(/-(\d+)$/);
            return match ? parseInt(match[1]) : null;
        }
        function updateNumberInName(name, newNumber) {
            const match = name.match(/-(\d+)$/);
            if (match) {
                return name.replace(/-(\d+)$/, `-${newNumber}`);
            } else {
                return `${name}-${newNumber}`;
            }
        }
        res.send({ data: updateNumberInName("test-2-3-4", 20) });
    },
    camelCaseToSentence: (camelCaseStr) => {
        let words = camelCaseStr.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
        words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        return words.join(" ");
    },
    generateResponse: (key, result, configuration, type) => {
        let status = "success";
        let action = {
            catchPokemon: {
                success: "Caught",
                failed: "Flee",
            },
            releasePokemon: {
                success: "Released",
                failed: "Stayed",
            },
        };
        !result.check ? (status = "failed") : (status = "success");
        let response = {
            status: status,
            number: result.number,
            message:
                "Pokemon " +
                action[key][status] +
                "! You get " +
                result.number +
                ". You" +
                (result.check ? " " : " don't ") +
                "get " +
                additionalMethods.camelCaseToSentence(configuration.config_data[key].target) +
                "!",
        };
        return response;
    },
    getConfigurationByType: async (type) => {
        let configuration = await pokemonConfig.findOne({
            where: {
                config_type: type,
            },
        });
        return configuration;
    },
    getAllMyPokemon: async (req, res) => {
        try {
            let { token } = req.body;
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            let myPokemons = await models.findAll({
                where: { up_us_id: loginInfo.us_id, up_active: true },
                attributes: ["up_id", "up_pk_api_id", "up_pk_nickname"],
            });
            res.status(200).send(myPokemons);
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
            res.status(200).send({
                status: "success",
                data: data,
                message: "Pokemon stored successfully",
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    catchingPokemon: async (req, res) => {
        try {
            const key = "catchPokemon";
            const { token } = req.body;
            const configuration = await additionalMethods.getConfigurationByType("logic");
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            if (!loginInfo.us_id) {
                res.status(500).send({ message: "You Need to Login First" });
            }
            let result = number.methods[configuration.config_data[key].target].execute("random");
            res.status(200).send(additionalMethods.generateResponse(key, result, configuration));
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    releasePokemon: async (req, res) => {
        try {
            const key = "releasePokemon";
            const { token, up_id } = req.body;
            const configuration = await additionalMethods.getConfigurationByType("logic");
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            if (!loginInfo.us_id) {
                res.status(500).send({ message: "You Need to Login First" });
            }
            let result = number.methods[configuration.config_data[key].target].execute("random");
            let response = additionalMethods.generateResponse(key, result, configuration);
            if (response.status === "success") {
                await models.update(
                    {
                        up_active: false,
                    },
                    {
                        where: { up_id: up_id },
                    }
                );
            }
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    renamePokemon: async (req, res) => {
        try {
            const key = "renamePokemon";
            function checkNumberAfterDash(str) {
                const match = str.match(/-(\d+)$/);
                return match ? parseInt(match[1]) : null;
            }
            function updateNumberInName(name, newNumber) {
                const match = name.match(/-(\d+)$/);
                if (match) {
                    return name.replace(/-(\d+)$/, `-${newNumber}`);
                } else {
                    return `${name}-${newNumber}`;
                }
            }
            function removeNumberFromEnd(name) {
                return name.replace(/-\d+$/, "");
            }
            const configuration = await additionalMethods.getConfigurationByType("logic");
            const { token, up_pk_nickname, up_id } = req.body;
            let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
            if (!loginInfo.us_id) {
                res.status(500).send({ message: "You Need to Login First" });
            }
            let pokemonTarget = await models.findOne({
                where: { up_id: up_id, up_active: true },
                attributes: ["up_id", "up_pk_nickname"],
            });
            let previousNumber = checkNumberAfterDash(pokemonTarget.up_pk_nickname);
            let result = number.methods[configuration.config_data[key].target].execute("row", previousNumber);
            let nickName = updateNumberInName(up_pk_nickname, result);
            let response = {
                status: "success",
                message: "Pokemon renamed successfully to " + nickName,
            };
            await models.update(
                {
                    up_pk_nickname: nickName,
                },
                {
                    where: { up_id: up_id, up_active: true },
                }
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
