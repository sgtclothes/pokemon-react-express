const axios = require('axios');

exports.getClientIP = async () => {
    try {
        let response = await axios("https://api.ipify.org?format=json");
        let json = await response.data;
        return json;
    } catch (error) {
        console.log(error);
    }
};

exports.addSeconds = (numOfSeconds, date = new Date()) => {
    date.setSeconds(date.getSeconds() + numOfSeconds);
    return date;
};
