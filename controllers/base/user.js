const models = {
    user: require("./model").models("User"),
};
const helper = require("../action/helper");

exports.action = {
    getAll: async (req, res) => {
        try {
            const users = await models.user.findAll();
            if (!users) {
                return res.status(500).send(helper.response.createFailedResponse("Failed to get all users"));
            }
            return res.status(200).send(helper.response.createSuccessResponse("Successfully get all users", users));
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
};
