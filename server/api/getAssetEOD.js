// utils for getting current crypto value relative to the USD
var axios = require("axios").default;
const Logger = require('../utils/logger');

/**
 * Function that gets the history market details for an asset
 * @param {str} code "BTC-USA"/"AFI"
 * @param {str} exchangeCode "CC"/"AU"
 * @returns {obj} data
 */
async function getAssetEodHistory(code, exchangeCode) {

    var apiToken = process.env.EOD_TOKEN;

    if(!apiToken){
        throw new Error('Failed to collect apiToken for EOD finance coin query')
    }

    var options = {
        method: 'GET',
        url: `https://eodhistoricaldata.com/api/eod/${code}.${exchangeCode}?api_token=${apiToken}&fmt=json`
    };

    const data = await axios.request(options).then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        Logger.error(error);
    });

    return data
}

/**
 * Function that gets the current market details for an asset
 * @param {str} code "BTC-USA"/"AFI"
 * @param {str} exchangeCode "CC"/"AU"
 * @returns {obj} data
 */
async function getAssetCurrentMarket(code, exchangeCode) {

    var apiToken = process.env.EOD_TOKEN;

    if(!apiToken){
        throw new Error('Failed to collect apiToken for EOD finance coin query')
    }

    var options = {
        method: 'GET',
        url: `https://eodhistoricaldata.com/api/real-time/${code}.${exchangeCode}?api_token=${apiToken}&fmt=json`
    };

    const data = await axios.request(options).then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        Logger.error(error);
    });

    return data
}

module.exports = {
    getAssetEodHistory,
    getAssetCurrentMarket
};
