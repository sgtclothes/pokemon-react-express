const fs = require("fs");
const moment = require("moment");
const baseModel = require("./model");
const configJSAuth = require("../../config/javascript/auth");
const configJSONApp = require("../../config/json/app.json");
const helper = require("../action/helper");
const dateFileName = moment().format("DD-MM-YYYY");
const logModel = baseModel.models("Log");
const tokenModel = baseModel.models("Token");
const baseToken = require("./token");

exports.action = {
    register: async (id) => {
        try {
            let request = configJSONApp.log.registerNewUser;
            request.log_name = request.log_name + " (USER ID : " + id + ")";
            request.log_active = 1;
            request.log_created_on = moment().format();
            helper.folder.createIfNotExists(configJSONApp.paths.log);
            helper.json.create(configJSONApp.paths.log, dateFileName, { register: [] });
            helper.json.update(configJSONApp.paths.log, "register", dateFileName, request, "push");
            const logResponse = await logModel.store(request)
            return helper.response.createSuccessResponse("Successfully to create register log!", logResponse);
        } catch (error) {
            return helper.response.createFailedResponse("Failed to create register log", error.message);
        }
    },
    login: async (id) => {
        try {
            let request = configJSONApp.log.login;
            request.log_name = request.log_name + " (USER ID : " + id + ")";
            request.log_active = 1;
            request.log_created_on = moment().format();
            helper.folder.createIfNotExists(configJSONApp.paths.log);
            helper.json.create(configJSONApp.paths.log, dateFileName, { login: [] });
            helper.json.update(configJSONApp.paths.log, "login", dateFileName, request, "push");
            const logResponse = await logModel.store(request)
            return helper.response.createSuccessResponse("Successfully to create login log!", logResponse);
        } catch (error) {
            return helper.response.createFailedResponse("Failed to create login log", error.message);
        }
    },
    search: async (id, keyword) => {
        try {
            let request = configJSONApp.log.search;
            request.log_name = request.log_name + " (USER ID : " + id + ")";
            request.log_description = request.log_description + " (KEYWORD : " + keyword + ")";
            request.log_active = 1;
            request.log_created_on = moment().format();
            helper.folder.createIfNotExists(configJSONApp.paths.log);
            helper.json.create(configJSONApp.paths.log, dateFileName, { search: [] });
            helper.json.update(configJSONApp.paths.log, "search", dateFileName, request, "push");
            const logResponse = await logModel.store(request)
            return helper.response.createSuccessResponse("Successfully to create search log!", logResponse);
        } catch (error) {
            return helper.response.createFailedResponse("Failed to create search log", error.message);
        }
    },
    catchPokemon: async (id, status, pokemonId, pokemonName, pokemonNickname, logic, number) => {
        try {
            let request = configJSONApp.log.catchPokemon;
            request.log_name = request.log_name + " (USER ID : " + id + ") ";
            request.log_description = request.log_description + " (STATUS : " + status + ") ";
            request.log_description = request.log_description + " (POKEMON ID : " + pokemonId + ") ";
            request.log_description = request.log_description + " (POKEMON NAME : " + pokemonName + ") ";
            request.log_description = request.log_description + " (POKEMON NICKNAME : " + pokemonNickname + ") ";
            request.log_description = request.log_description + " (USED LOGIC : " + logic + ") ";
            request.log_description = request.log_description + " (GET NUMBER : " + number + ")";
            request.log_active = 1;
            request.log_created_on = moment().format();
            helper.folder.createIfNotExists(configJSONApp.paths.log);
            helper.json.create(configJSONApp.paths.log, dateFileName, { catchPokemon: [] });
            helper.json.update(configJSONApp.paths.log,"catchPokemon", dateFileName, request, "push");
            const logResponse = await logModel.store(request)
            return helper.response.createSuccessResponse("Successfully to create catch log!", logResponse);
        } catch (error) {
            return helper.response.createFailedResponse("Failed to create catch log", error.message);
        }
    },
    releasePokemon: async (id, status, pokemonId, pokemonName, pokemonNickname, logic, number) => {
        try {
            let request = configJSONApp.log.releasePokemon;
            request.log_name = request.log_name + " (USER ID : " + id + ")";
            request.log_description = request.log_description + " (STATUS : " + status + ") ";
            request.log_description = request.log_description + " (POKEMON ID : " + pokemonId + ") ";
            request.log_description = request.log_description + " (POKEMON NAME : " + pokemonName + ") ";
            request.log_description = request.log_description + " (POKEMON NICKNAME : " + pokemonNickname + ") ";
            request.log_description = request.log_description + " (USED LOGIC : " + logic + ") ";
            request.log_description = request.log_description + " (GET NUMBER : " + number + ")";
            request.log_active = 1;
            request.log_created_on = moment().format();
            helper.folder.createIfNotExists(configJSONApp.paths.log);
            helper.json.create(configJSONApp.paths.log, dateFileName, { releasePokemon: [] });
            helper.json.update(configJSONApp.paths.log, "releasePokemon", dateFileName, request, "push");
            const logResponse = await logModel.store(request)
            return helper.response.createSuccessResponse("Successfully to create release log!", logResponse);
        } catch (error) {
            return helper.response.createFailedResponse("Failed to create release log", error.message);
        }
    },
    renamePokemon: async (
        id,
        status,
        pokemonId,
        pokemonName,
        pokemonNickNames,
        logic,
        number
    ) => {
        try {
            let request = configJSONApp.log.renamePokemon;
            request.log_name = request.log_name + " (USER ID : " + id + ")";
            request.log_description = request.log_description + " (STATUS : " + status + ") ";
            request.log_description = request.log_description + " (POKEMON ID : " + pokemonId + ") ";
            request.log_description = request.log_description + " (POKEMON NAME : " + pokemonName + ") ";
            request.log_description =
                request.log_description + " (POKEMON PREVIOUS NICKNAME : " + pokemonNickNames?.previous + ") ";
            request.log_description = request.log_description + " (POKEMON NEW NICKNAME : " + pokemonNickNames?.new + ") ";
            request.log_description = request.log_description + " (USED LOGIC : " + logic + ") ";
            request.log_description = request.log_description + " (GET NUMBER : " + number + ") ";
            request.log_active = 1;
            request.log_created_on = moment().format();
            helper.folder.createIfNotExists(configJSONApp.paths.log);
            helper.json.create(configJSONApp.paths.log, dateFileName, { renamePokemon: [] });
            helper.json.update(configJSONApp.paths.log, "renamePokemon", dateFileName, request, "push");
            const logResponse = await logModel.store(request)
            return helper.response.createSuccessResponse("Successfully to create rename log!", logResponse);
        } catch (error) {
            return helper.response.createFailedResponse("Failed to create rename log", error.message);
        }
    },
};
