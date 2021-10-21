// utils for getting current currency values relative to the USD
var axios = require("axios").default;
const Logger = require('../utils/logger');

async function getCurrencyData(RapidApiKey) {

    var options = {
    method: 'GET',
    url: 'https://exchangerate-api.p.rapidapi.com/rapid/latest/USD',
    headers: {
        'x-rapidapi-host': 'exchangerate-api.p.rapidapi.com',
        'x-rapidapi-key': RapidApiKey
    }
    };

    axios.request(options).then(function (response) {
        return response.data
    }).catch(function (error) {
        Logger.error(error);
    });
}

module.exports = getCurrencyData;

