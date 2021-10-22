// utils for getting current crypto value relative to the USD
var axios = require("axios").default;
const Logger = require('../utils/logger');

/**
 * Funciton that gets up to 20 coin detail values at once from api
 * @param {list} codes 
 * @returns {obj} data
 */
async function getCoinValues(codes) {

    var apiToken = process.env.EOD_TOKEN;

    if(!apiToken){
        throw new Error('Failed to collect apiToken for EOD finance coin query')
    }
    // note the trailing &s= breaker which is the start of multiple code ticker list
    let loadedUrl = `https://eodhistoricaldata.com/api/real-time/${codes[0]}.CC?api_token=${apiToken}&fmt=json&s=`

    // add any extra codes to the url, start at index 1 to skip the first code and <= so we stop at first index if only one value provided
    for(let i = 1; i <= codes.length; i++){
        loadedUrl += codes[i];
    }

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

module.exports = getCoinValues;
