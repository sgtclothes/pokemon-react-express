const models = {
    userPokemon: require("./model").models("UserPokemon"),
    configuration: require("./model").models("Configuration"),
};
const datetime = require("moment")().format();
const helper = require("../action/helper");
const log = require("./log");

exports.helper = {
    generateResponseCatchAndRelease: (key, result, configuration) => {
        let response, status = "success";
        let successResponse = helper.response.createSuccessResponse();
        let failedResponse = helper.response.createFailedResponse();
        if (!result.check) {
            status = "failed";
        }
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
        response = successResponse;
        if (!result.check) {
            response = failedResponse;
        }
        response.number = result.number;
        response.message =
            "Pokemon " +
            action[key][status] +
            "! You get " +
            result.number +
            ". You" +
            (result.check ? " " : " don't ") +
            "get " +
            helper.string.camelCaseToSentence(configuration.config_data[key].target) +
            "!";
        response.statusAction = action[key][status];
        return response;
    },
};
exports.action = {
    getAllMyPokemon: async (req, res) => {
        try {
            let { us_id } = req.body;
            const validator = helper.validator.validateRequiredFields(req.body, ["us_id"]);
            if (!validator.valid) {
                return res
                    .status(500)
                    .json(
                        helper.response.createFailedResponse("You need to send following data", validator.missingFields)
                    );
            }
            let data = await models.userPokemon.findAll({
                where: { up_us_id: us_id, up_active: true },
                attributes: ["up_id", "up_pk_api_id", "up_pk_nickname"],
            });
            if (!data) {
                return res.status(500).send(helper.response.createFailedResponse("User not found"));
            }
            return res.status(200).send(helper.response.createSuccessResponse("Successfully get all pokemons", data));
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    storePokemon: async (req, res) => {
        try {
            const key = "catchPokemon";
            const { up_pk_api_id, up_pk_name, up_pk_nickname, number } = req.body;
            const validator = helper.validator.validateRequiredFields(req.body, [
                "up_pk_nickname",
                "up_pk_name",
                "up_pk_api_id",
                "number",
            ]);
            if (!validator.valid) {
                return res
                    .status(500)
                    .json(
                        helper.response.createFailedResponse("You need to send following data", validator.missingFields)
                    );
            }
            let data = await models.userPokemon.store({
                up_us_id: loginInfo.us_id,
                up_pk_api_id: up_pk_api_id,
                up_pk_name: up_pk_name,
                up_pk_nickname: up_pk_nickname,
                up_fibonacci: 0,
                up_active: true,
                up_created_by: loginInfo.us_id,
                up_created_on: datetime,
            });
            await log.action.catchPokemon(
                loginInfo.us_id,
                "CAUGHT",
                data.up_id,
                up_pk_name,
                up_pk_nickname,
                key,
                number
            );
            return res.status(200).send(helper.response.createSuccessResponse("Pokemon stored successfully", data));
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    catchPokemon: async (req, res) => {
        try {
            const key = "catchPokemon";
            const { up_pk_name, up_pk_nickname, number } = req.body;
            const logicConfiguration = await models.configuration.findOne({ where: { config_type: "logic" } });
            let result = helper.number[logicConfiguration.config_data[key].target].execute("random");
            const response = this.helper.generateResponseCatchAndRelease(key, result, logicConfiguration);
            if (response.status === "failed") {
                await log.action.catchPokemon(
                    loginInfo.us_id,
                    "FLEE",
                    data.up_id,
                    up_pk_name,
                    up_pk_nickname,
                    key,
                    number
                );
            }
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    releasePokemon: async (req, res) => {
        try {
            const { up_id } = req.body;
            const key = "releasePokemon";
            const validator = helper.validator.validateRequiredFields(req.body, ["up_id"]);
            if (!validator.valid) {
                return res
                    .status(500)
                    .json(
                        helper.response.createFailedResponse("You need to send following data", validator.missingFields)
                    );
            }
            const logicConfiguration = await models.configuration.findOne({ where: { config_type: "logic" } });
            let result = helper.number[logicConfiguration.config_data[key].target].execute("random");
            let response = this.helper.generateResponseCatchAndRelease(key, result, logicConfiguration);
            if (response.status === "success") {
                response.data = await models.userPokemon.update({ up_active: false }, { where: { up_id: up_id } });
            }
            // await log.action.releasePokemon(
            //     loginInfo.us_id,
            //     response.statusAction,
            //     data.up_id,
            //     up_pk_name,
            //     up_pk_nickname,
            //     key,
            //     number
            // );
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
    renamePokemon: async (req, res) => {
        try {
            const { up_pk_nickname, up_id } = req.body;
            const key = "renamePokemon";
            const validator = helper.validator.validateRequiredFields(req.body, ["up_pk_nickname", "up_id"]);
            if (!validator.valid) {
                return res
                    .status(500)
                    .json(
                        helper.response.createFailedResponse("You need to send following data", validator.missingFields)
                    );
            }
            let response;
            const logicConfiguration = await models.configuration.findOne({ where: { config_type: "logic" } });
            let pokemonTarget = await models.userPokemon.findOne({
                where: { up_id: up_id, up_active: true },
                attributes: ["up_id", "up_pk_nickname"],
            });
            if (!pokemonTarget) {
                return res
                    .status(500)
                    .json(helper.response.createFailedResponse("Cannot rename Pokemon, Pokemon is not active!"));
            }
            let previousNumber = helper.string.checkNumberAfterDashAtEnd(pokemonTarget.up_pk_nickname);
            let result = helper.number[logicConfiguration.config_data[key].target].execute("row", previousNumber);
            let nickName = helper.string.updateNumberInNameAtEnd(up_pk_nickname, result);
            response = helper.response.createSuccessResponse("Pokemon renamed successfully to " + nickName);
            response.data = await models.userPokemon.update(
                { up_pk_nickname: nickName },
                { where: { up_id: up_id, up_active: true } }
            );
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
};
