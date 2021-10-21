// utils for getting current crypto value relative to the USD
var axios = require("axios").default;
const Logger = require('../utils/logger');


async function getCoinValue(code) {

    var apiToken = process.env.EOD_TOKEN;

    if(!apiToken){
        throw new Error('Failed to collect apiToken for EOD finance coin query')
    }

    var options = {
        method: 'GET',
        url: `https://eodhistoricaldata.com/api/real-time/${code}.CC?api_token=${apiToken}&fmt=json`
    };

    const data = await axios.request(options).then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        Logger.error(error);
    });

    return data
}

module.exports = getCoinValue;
