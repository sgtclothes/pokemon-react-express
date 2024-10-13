const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "public")));

// db.sequelize.sync();

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/config.routes")(app);
require("./routes/userPokemon.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
