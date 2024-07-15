const baseModel = require("./model");
const models = baseModel.models("Configuration");

let additionalMethods = {};

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
