const baseModel = require("./model");
const models = baseModel.models("Configuration");
const configuration = require("../base").configuration;

exports.getConfiguration = async (req, res) => {
    const { type } = req.body;
    const response = await configuration.methods().findOne({
        where: {
            config_type: type,
        },
    });
    if (!response) {
        return res.status(404).send({
            status: "failed",
            message: "Configuration not found",
        });
    }
    return res.status(200).send({
        status: "success",
        message: "Get Configuration Successfully",
        data: configuration,
    });
};
exports.setConfiguration = async (req, res) => {
    const { config_data, config_type } = req.body;
    const response = await configuration.methods().update(
        {
            config_data: config_data,
        },
        {
            where: { config_type: config_type },
        }
    );
    if (!response) {
        return res.status(404).send({
            status: "failed",
            message: "Failed to update configuration",
        });
    }
    res.send({
        status: "success",
        message: "Configuration Update Successfully",
    });
};
exports.methods = () => {
    let methods = {};
    for (let i in models) {
        methods[i] = models[i];
    }
    return methods;
};
