const fs = require("fs");
const moment = require("moment");
const { prefix, paths } = require("../../config/app.json");
const { createFolderIfNotExists } = require("./helper");
const datetime = moment().format();
const dateFileName = moment().format("DD-MM-YYYY");

exports.processJSON = (type, data) => {
    try {
        createFolderIfNotExists(paths.log);
        if (!fs.existsSync(paths.log + "/" + dateFileName + ".json")) {
            this.generateJSON(data);
        } else {
            if (type === "login") this.updateJSONWhenLogin(data);
            else if (type === "search") this.updateJSONWhenSearch(data);
        }
    } catch (error) {
        console.log({ message: error.message });
    }
};
exports.generateJSON = (data) => {
    try {
        let dataJSON = {
            groupName: "phincon",
            "createdOn/firstLogin": datetime,
            "createdBy/firstLogin": data.us_username,
            description: "user log activity for phincon",
            logs: {},
        };
        let key = prefix + "_" + data.us_id + "_" + data.us_username;
        dataJSON.logs[key] = [{ type: "login", action: "login app", time: datetime }];
        let json = JSON.stringify(dataJSON);
        let response = {
            status: "success",
            message: "Successfully created json log",
        };
        fs.writeFile(paths.log + "/" + dateFileName + ".json", json, "utf8", (err) => {
            if (err) console.log(err);
            else {
                console.log(response);
                console.log("The written has the following contents:");
                console.log(fs.readFileSync(paths.log + "/" + dateFileName + ".json", "utf8"));
            }
        });
        return response;
    } catch (error) {
        console.log({ message: error.message });
    }
};
exports.getJSON = () => {
    try {
        let json = JSON.parse(fs.readFileSync(paths.log + "/" + dateFileName + ".json", "utf8"));
        return json;
    } catch (error) {
        console.log({ message: error.message });
    }
};
exports.updateJSONWhenLogin = (data) => {
    try {
        let key = prefix + "_" + data.us_id + "_" + data.us_username;
        let dataJSON = this.getJSON();
        let log = {
            type: "login",
            action: "login app",
            time: datetime,
        };
        if (!dataJSON.logs.hasOwnProperty(key)) {
            dataJSON.logs[key] = [log];
        }
        let json = JSON.stringify(dataJSON);
        let response = {
            status: "success",
            message: "Successfully updated json log",
        };
        fs.writeFile(paths.log + "/" + dateFileName + ".json", json, "utf8", () => {
            if (err) console.log(err);
            else {
                console.log(response);
                console.log("The written has the following contents:");
                console.log(fs.readFileSync(paths.log + "/" + dateFileName + ".json", "utf8"));
            }
        });
        return json;
    } catch (error) {
        console.log({ message: error.message });
    }
};
exports.updateJSONWhenSearch = (data) => {
    try {
        let key = prefix + "_" + data.loginInfo.us_id + "_" + data.loginInfo.us_username;
        let dataJSON = this.getJSON();
        let log = {
            type: "search",
            action: "search '" + data.searchTerm + "'",
            time: datetime,
        };
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
