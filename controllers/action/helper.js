const axios = require("axios");
const fs = require("fs");

exports.response = {
    createSuccessResponse: (message, data) => {
        let response = {
            message: message || "",
            status: "success",
        };
        if (data) response.data = data;
        return response;
    },
        createFailedResponse: (message, detail) => {
        let response = {
            message: message || "",
            status: "failed",
        };
        if (detail) response.detail = detail;
        return response;
    },
};
exports.client = {
    getClientIP: async () => {
        try {
            let response = await axios("https://api.ipify.org?format=json");
            let json = await response.data;
            return json;
        } catch (error) {
            console.log(error);
            return {
                message: "Failed to get Client IP",
                status: "failed",
                detail: error.message,
            };
        }
    },
};
exports.datetime = {
    addSeconds: (numOfSeconds, date = new Date()) => {
        try {
            date.setSeconds(date.getSeconds() + numOfSeconds);
            return date;
        } catch (error) {
            console.log(error);
            return {
                message: "Failed to add Seconds",
                status: "failed",
                detail: error.message,
            };
        }
    },
};
exports.file = {
    write: (fileName, data, code = "utf8") => {
        try {
            fs.writeFileSync(fileName, data);
        } catch (error) {
            console.log(error);
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
    },
};
exports.string = {
    camelCaseToSentence: (camelCaseStr) => {
        let words = camelCaseStr.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
        words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        return words.join(" ");
    },
    checkNumberAfterDashAtEnd: (str) => {
        const match = str.match(/-(\d+)$/);
        return match ? parseInt(match[1]) : null;
    },
    updateNumberInNameAtEnd: (name, newNumber) => {
        const match = name.match(/-(\d+)$/);
        if (match) {
            return name.replace(/-(\d+)$/, `-${newNumber}`);
        } else {
            return `${name}-${newNumber}`;
        }
    },
    removeNumberAtEnd: (name) => {
        return name.replace(/-\d+$/, "");
    },
};
exports.folder = {
    createIfNotExists: (path) => {
        try {
            let checkIfExists = fs.existsSync(path);
            if (!checkIfExists) {
                fs.mkdirSync(path);
            }
            return checkIfExists;
        } catch (error) {
            console.log(error);
            return {
                message: "Failed to create folder if not exists",
                status: "failed",
                detail: error.message,
            };
        }
    },
};
exports.number = {
    generateRandomArbitraryNumber: (min, max) => {
        try {
            isNaN(min) ? (min = 0) : min;
            isNaN(max) ? (max = 0) : max;
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } catch (error) {
            console.log(error);
            return {
                message: "Failed to generate random arbitrary number",
                status: "failed",
                detail: error.message,
            };
        }
    },
    pseudoNumber: {
        check: (value) => {
            return value === 1;
        },
        generate: () => {
            return this.number.generateRandomArbitraryNumber(0, 1);
        },
        execute: (type, previousData, option = 1) => {
            let pseudoNumber = this.number.pseudoNumber;
            if (type === "random") {
                let value = pseudoNumber.generate();
                return {
                    number: value,
                    check: pseudoNumber.check(value),
                };
            } else if (type === "row") {
                if (option === 1) {
                    if (previousData === 0) return 1;
                    else if (previousData === 1) return 0;
                    else return 0;
                }
            }
        },
    },
    primeNumber: {
        check: (value) => {
            if (value <= 1) {
                return false;
            }
            for (let i = 2; i <= Math.sqrt(value); i++) {
                if (value % i === 0) {
                    return false;
                }
            }
            return true;
        },
        generate: () => {
            return this.number.generateRandomArbitraryNumber(0, 100);
        },
        execute: (type, previousData = 0) => {
            let primeNumber = this.number.primeNumber;
            if (type === "random") {
                let value = primeNumber.generate();
                return {
                    number: value,
                    check: primeNumber.check(value),
                };
            } else if (type === "row") {
                let nextNumber = previousData + 1;
                while (!primeNumber.check(nextNumber)) {
                    nextNumber++;
                }
                return nextNumber;
            }
        },
    },
    fibonacciNumber: {
        check: (value, a = 0, b = 1) => {
            if (value === 0 || value === 1) {
                return true;
            }
            let nextNumber = a + b;
            if (nextNumber === value) {
                return true;
            } else if (nextNumber > value) {
                return false;
            }
            return this.number.fibonacciNumber.check(value, b, nextNumber);
        },
        generate: () => {
            return this.number.generateRandomArbitraryNumber(0, 100);
        },
        execute: (type, previousData) => {
            let fibonacciNumber = this.number.fibonacciNumber;
            if (type === "random") {
                let value = fibonacciNumber.generate();
                return {
                    number: value,
                    check: fibonacciNumber.check(value),
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
    },
};
exports.collection = {
    updateValueAtPath: (obj, path, value, action = "replace") => {
        if (!path) {
            return {
                message: "Failed to update JSON file",
                status: "failed",
                detail: "path not found",
            };
        }
        const keys = path.split(".");
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        const finalKey = keys[keys.length - 1];
        if (action === "replace") {
            current[finalKey] = value;
        } else if (action === "push" && Array.isArray(current[finalKey])) {
            current[finalKey].push(value);
        } else if (action === "push") {
            current[finalKey] ? (current[finalKey] = [current[finalKey], value]) : (current[finalKey] = [value]);
        }
    },
    getValueAtPath: (obj, path) => {
        const keys = path.split(".");
        return keys.reduce((acc, key) => {
            if (acc && acc.hasOwnProperty(key)) {
                return acc[key];
            }
            return undefined;
        }, obj);
    },
};
exports.json = {
    read: (path, name, options) => {
        try {
            let json;
            if (!fs.existsSync(path + "/" + name + ".json")) {
                return {
                    message: "Failed to read JSON file",
                    status: "failed",
                };
            }
            json = JSON.parse(fs.readFileSync(path + "/" + name + ".json", "utf8"));
            if (options) {
                /**
                 * options = {
                 *  "path": "data.login"
                 * }
                 */
                json = this.collection.getValueAtPath(json, options.path);
            }
            return {
                message: "Successfully read JSON file",
                status: "success",
                data: json,
            };
        } catch (error) {
            console.log(error);
            return {
                message: "Failed to read JSON file",
                status: "failed",
                detail: error.message,
            };
        }
    },
    create: (path, name, object = {}) => {
        try {
            let json = JSON.stringify(object);
            if (fs.existsSync(path + "/" + name + ".json")) {
                return {
                    message: "Failed to create JSON file",
                    status: "failed",
                    detail: "JSON file already exists",
                };
            }
            fs.writeFile(path + "/" + name + ".json", json, "utf8");
            const response = fs.readFileSync(path + "/" + name + ".json", "utf8");
            return response
                ? response
                : {
                      message: "Failed to create JSON file",
                      status: "failed",
                      detail: "path not found",
                  };
        } catch (error) {
            console.log(error);
            return {
                message: "Failed to create JSON file",
                status: "failed",
                detail: error.message,
            };
        }
    },
    update: (path, pathKey, name, newValue, action) => {
        try {
            let readJSON = this.json.read(path, name);
            if (readJSON.hasOwnProperty("status") && readJSON.status === "failed") {
                return readJSON;
            }
            let json = readJSON.data;
            this.collection.updateValueAtPath(json, pathKey, newValue, action);
            json = JSON.stringify(json);
            fs.writeFile(path + "/" + name + ".json", json, "utf8");
            return json;
        } catch (error) {
            console.log(error);
            return {
                message: "Failed to update JSON file",
                status: "failed",
                detail: error.message,
            };
        }
    },
};
exports.validator = {
    validateRequiredFields: (reqBody, requiredFields) => {
        const missingFields = [];
        requiredFields.forEach((field) => {
            if (
                !reqBody.hasOwnProperty(field) ||
                reqBody[field] === undefined ||
                reqBody[field] === null ||
                reqBody[field] === ""
            ) {
                missingFields.push(field);
            }
        });
        if (missingFields.length > 0) {
            return {
                valid: false,
                missingFields: missingFields,
            };
        }
        return { valid: true };
    },
};
