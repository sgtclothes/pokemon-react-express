const fs = require("fs");
const moment = require("moment");

const config = require("../../config/app.json");

let path = config.paths.log;

exports.logJSON = {
  processJSON: (type, data) => {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      let dateFileName = moment().format("DD-MM-YYYY");
      if (!fs.existsSync(path + "/" + dateFileName + ".json")) {
        this.logJSON.generateJSON(data);
      } else {
        this.logJSON.updates[type](data);
      }
    } catch (error) {
      console.log({ message: error.message });
    }
  },
  generateJSON: (data) => {
    try {
      let datetime = moment().format();
      let dateFileName = moment().format("DD-MM-YYYY");
      let dataJSON = {
        groupName: "phincon",
        "createdOn/firstLogin": datetime,
        "createdBy/firstLogin": data.us_username,
        description: "user log activity for phincon",
        logs: {},
      };
      let key = config.prefix + "_" + data.us_id + "_" + data.us_username;
      dataJSON.logs[key] = [
        { type: "login", action: "login app", time: datetime },
      ];
      let json = JSON.stringify(dataJSON);
      let response = {
        status: "success",
        message: "Successfully created json log",
      };
      fs.writeFile(path + "/" + dateFileName + ".json", json, "utf8", () => {
        console.log(response);
      });
      return response;
    } catch (error) {
      console.log({ message: error.message });
    }
  },
  getJSON: () => {
    try {
      let dateFileName = moment().format("DD-MM-YYYY");
      let json = JSON.parse(
        fs.readFileSync(path + "/" + dateFileName + ".json", "utf8")
      );
      return json;
    } catch (error) {
      console.log({ message: error.message });
    }
  },
  updates: {
    login: (data) => {
      try {
        let key = config.prefix + "_" + data.us_id + "_" + data.us_username;
        let dataJSON = this.logJSON.getJSON();
        let datetime = moment().format();
        let dateFileName = moment().format("DD-MM-YYYY");
        let log = { type: "login", action: "login app", time: datetime };
        if (!dataJSON.logs.hasOwnProperty(key)) {
          dataJSON.logs[key] = [log];
        }
        let json = JSON.stringify(dataJSON);
        let response = {
          status: "success",
          message: "Successfully updated json log",
        };
        fs.writeFile(path + "/" + dateFileName + ".json", json, "utf8", () => {
          console.log(response);
        });
        return json;
      } catch (error) {
        console.log({ message: error.message });
      }
    },
    search: (data) => {
      try {
        let key =
          config.prefix +
          "_" +
          data.loginInfo.us_id +
          "_" +
          data.loginInfo.us_username;
        let dataJSON = this.logJSON.getJSON();
        let datetime = moment().format();
        let dateFileName = moment().format("DD-MM-YYYY");
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
        if (
          data.searchTerm !== "" &&
          data.searchTerm !== null &&
          data.searchTerm !== undefined
        ) {
          let response = {
            status: "success",
            message: "Successfully updated json log",
          };
          fs.writeFile(
            path + "/" + dateFileName + ".json",
            json,
            "utf8",
            () => {
              console.log(response);
            }
          );
        }
        return json;
      } catch (error) {
        console.log({ message: error.message });
      }
    },
  },
};
