const axios = require("axios");
const fs = require("fs");

exports.getClientIP = async () => {
    try {
        let response = await axios("https://api.ipify.org?format=json");
        let json = await response.data;
        return json;
    } catch (error) {
        console.log(error.message);
        return {
            message: "Failed to get Client IP",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.addSeconds = (numOfSeconds, date = new Date()) => {
    try {
        date.setSeconds(date.getSeconds() + numOfSeconds);
        return date;
    } catch (error) {
        console.log(error.message);
        return {
            message: "Failed to add Seconds",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.writeFile = (fileName, data, code = "utf8") => {
    try {
        fs.writeFileSync(fileName, data);
    } catch (error) {
        console.log(error.message);
        return {
            message: "Failed to write file",
            status: "failed",
            detail: error.message,
        };
    }
    return {
        message: "Write file Successfully",
        status: "success",
        data: fs.readFileSync(fileName, code),
    };
};
exports.createFolderIfNotExists = (path) => {
    try {
        let checkIfExists = fs.existsSync(path);
        if (!checkIfExists) {
            fs.mkdirSync(path);
        }
        return checkIfExists;
    } catch (error) {
        console.log(error.message);
        return {
            message: "Failed to create folder if not exists",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.generateRandomArbitraryNumber = (min, max) => {
    try {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (error) {
        console.log(error.message);
        return {
            message: "Failed to generate random arbitrary number",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.pseudoNumber = {
    check: (number) => {
        return number === 1;
    },
    generate: () => {
        return this.generateRandomArbitraryNumber(0, 1);
    },
    execute: (type, previousData, option = 1) => {
        let pseudoNumber = this.pseudoNumber;
        if (type === "random") {
            let number = pseudoNumber.generate();
            return {
                number: number,
                check: pseudoNumber.check(number),
            };
        } else if (type === "row") {
            if (option === 1) {
                if (previousData === 0) return 1;
                else if (previousData === 1) return 0;
                else return 0;
            }
        }
    },
};
exports.primeNumber = {
    check: (number) => {
        if (number <= 1) {
            return false;
        }
        for (let i = 2; i <= Math.sqrt(number); i++) {
            if (number % i === 0) {
                return false;
            }
        }
        return true;
    },
    generate: () => {
        return this.generateRandomArbitraryNumber(0, 100);
    },
    execute: (type, previousData) => {
        let primeNumber = this.primeNumber;
        if (type === "random") {
            let number = primeNumber.generate();
            return {
                number: number,
                check: primeNumber.check(number),
            };
        } else if (type === "row") {
            let nextNumber = previousData + 1;
            while (!primeNumber.check(nextNumber)) {
                nextNumber++;
            }
            return nextNumber;
        }
    },
};
exports.fibonacciNumber = {
    check: (number, a = 0, b = 1) => {
        if (number === 0 || number === 1) {
            return true;
        }
        let nextNumber = a + b;
        if (nextNumber === number) {
            return true;
        } else if (nextNumber > number) {
            return false;
        }
        return this.fibonacciNumber.check(number, b, nextNumber);
    },
    generate: () => {
        return this.generateRandomArbitraryNumber(0, 100);
    },
    execute: (type, previousData) => {
        let fibonacciNumber = this.fibonacciNumber;
        if (type === "random") {
            let number = fibonacciNumber.generate();
            return {
                number: number,
                check: fibonacciNumber.check(number),
            };
        } else if (type === "row") {
            let n = previousData;
            if (n < 0 || n === null) return 0;
            let a = 0;
            let b = 1;
            while (b <= n) {
                const temp = b;
                b = a + b;
                a = temp;
            }
            return b;
        }
    },
};
exports.readJSONFile = (path, name) => {
    try {
        let json;
        if (!fs.existsSync(path + "/" + name + ".json")) {
            return {
                message: "Failed to read JSON file",
                status: "failed",
            };
        }
        json = JSON.parse(fs.readFileSync(path + "/" + name + ".json", "utf8"));
        return json;
    } catch (error) {
        console.log({ message: error.message });
        return {
            message: "Failed to read JSON file",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.createJSONFile = (path, name, object) => {
    try {
        let json = JSON.stringify(object);
        if (fs.existsSync(path + "/" + name + ".json")) {
            return {
                message: "Failed to create JSON file",
                status: "failed",
                detail: "JSON file already exists",
            };
        }
        fs.writeFile(path + "/" + name + ".json", json, "utf8", (err) => {
            if (err) console.log(err);
            else {
                console.log("The written has the following contents:");
                console.log(fs.readFileSync(path + "/" + name + ".json", "utf8"));
            }
        });
        return fs.readFileSync(path + "/" + name + ".json", "utf8");
    } catch (error) {
        console.log(error.message);
        return {
            message: "Failed to create JSON file",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.updateJSONFile = (path, name, key, value) => {
    try {
        let json = this.readJSONFile(path, name);
        if (!json.hasOwnProperty(key)) {
            return {
                message: "Failed to update JSON file",
                status: "failed",
                detail: "key not found",
            };
        }
        json[key] = value;
        json = JSON.stringify(json);
        fs.writeFile(path + "/" + name + ".json", json, "utf8", () => {
            if (err) console.log(err);
            else {
                console.log("The written has the following contents:");
                console.log(fs.readFileSync(path + "/" + name + ".json", "utf8"));
            }
        });
        return json;
    } catch (error) {
        console.log(error.message);
        return {
            message: "Failed to update JSON file",
            status: "failed",
            detail: error.message,
        };
    }
};
exports.processJSON = (paths, type, data) => {
    try {
        this.createFolderIfNotExists(paths.log);
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
