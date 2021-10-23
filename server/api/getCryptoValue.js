// utils for getting current crypto value relative to the USD
var axios = require("axios").default;
const Logger = require('../utils/logger');

/**
 * Funciton that gets up to 20 coin detail values at once from api
 * @param {list} codes 
 * @returns {obj} data
 */
async function getCryptoValue(code) {

    var apiToken = process.env.EOD_TOKEN;

    if(!apiToken){
        throw new Error('Failed to collect apiToken for EOD finance coin query')
    }
    // note the trailing &s= breaker which is the start of multiple code ticker list
    let loadedUrl = `https://eodhistoricaldata.com/api/real-time/${code}.CC?api_token=${apiToken}&fmt=json`

    var options = {
        method: 'GET',
        url: loadedUrl
    };

    const data = await axios.request(options).then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        Logger.error(error);
    });

    return data
}

module.exports = getCryptoValue;
