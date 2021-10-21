// utils for getting current currency values relative to the USD
var axios = require("axios").default;
const Logger = require('../utils/logger');

async function updateCurrencies() {
    var api_key = process.env.RAPID_API_KEY

    if(!api_key){
        throw new Error('Failed to collect environment variable for rapid api key to update currencies')
    }

    var options = {
    method: 'GET',
    url: 'https://exchangerate-api.p.rapidapi.com/rapid/latest/USD',
    headers: {
        'x-rapidapi-host': 'exchangerate-api.p.rapidapi.com',
        'x-rapidapi-key': api_key
    }
    };

    axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        Logger.error(error);
    });
}

module.exports = updateCurrencies;

