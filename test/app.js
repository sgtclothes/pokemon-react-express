const express = require("express");
const { getConfiguration } = require("../controllers").action.configuration;

const app = express();
app.use(express.json());

app.post("/configuration", getConfiguration);

module.exports = app;
