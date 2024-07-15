const base = require("../base");

exports.getConfiguration = async (req, res) => {
  let { type } = req.body;
  let configuration = await base.configuration.methods().findOne({
    where: {
      config_type: type,
    },
  });
  res.send({
    status: "success",
    message: "Get Configuration Successfully",
    data: configuration,
  });
};

exports.setConfiguration = async (req, res) => {
  let { config_data, config_type } = req.body;
  await base.configuration.methods().update(
    {
      config_data: config_data,
    },
    {
      where: { config_type: config_type },
    }
  );
  res.send({
    status: "success",
    message: "Configuration Update Successfully",
  });
};
