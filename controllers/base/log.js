const baseModel = require("./model");
const baseToken = require("./token");
const moment = require("moment");
const models = baseModel.models("Log");
const config = require("../../config/auth.config");
const { prefix, paths } = require("../../config/app.json");
const { readJSONFile, updateJSONFile, createJSONFile, createFolderIfNotExists } = require("../action/helper");
const dateFileName = moment().format("DD-MM-YYYY");
const fs = require("fs");

const log = require("../action").log;

exports.updateLog = (req, res) => {
    let token = req.cookies["x-access-token"];
    let data = req.body;
    let loginInfo = baseToken.methods().verifyToken(token, config.secret, res);
    data["loginInfo"] = loginInfo;
    log.logJSON.processJSON("search", data, res);
    res.status(200).send(data);
};
exports.updateJSONWhenLogin = (data) => {
    try {
        const key = prefix + "_" + data.us_id + "_" + data.us_username;
        createFolderIfNotExists(paths.log);
        createJSONFile(paths.log, dateFileName, { data: { log: [] } });
        console.log(key);
        const json = updateJSONFile(
            paths.log,
            dateFileName,
            {
                type: "login",
                user: key,
                action: "login app",
                time: dateFileName,
            },
            { path: ["data", "log"], action: "append" }
        );
        // return {
        //     message: "Successfully update JSON when login",
        //     status: "success",
        //     data: json,
        // };
    } catch (error) {
        console.log(error);
        return {
            message: "Failed to update JSON file when login",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.updateJSONWhenSearch = (data) => {
    try {
        let key = prefix + "_" + data.us_id + "_" + data.us_username;
        let log = {
            type: "search",
            action: "search '" + data.searchTerm + "'",
            time: dateFileName,
        };
        let dataJSON = this.getJSON();
        if (!dataJSON.logs.hasOwnProperty(key)) {
            dataJSON.logs[key] = [log];
        } else {
            dataJSON.logs[key].unshift(log);
        }
        let json = JSON.stringify(dataJSON);
        if (data.searchTerm !== "" && data.searchTerm !== null && data.searchTerm !== undefined) {
            let response = {
                status: "success",
                message: "Successfully updated json log",
            };
            fs.writeFile(paths.log + "/" + dateFileName + ".json", json, "utf8", (err) => {
                if (err) console.log(err);
                else {
                    console.log(response);
                    console.log("The written has the following contents:");
                    console.log(fs.readFileSync(paths.log + "/" + dateFileName + ".json", "utf8"));
                }
            });
        }
        return json;
    } catch (error) {
        console.log({ message: error.message });
    }
};
exports.methods = () => {
    let methods = {};
    for (let i in models) {
        methods[i] = models[i];
    }
    return methods;
};
