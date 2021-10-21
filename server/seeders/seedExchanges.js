
// utils for getting current currency values relative to the USD
var axios = require("axios").default;
const Logger = require('../utils/logger');
const {Exchange} = require('../models/Exchange');

/**
 * Function returns all exchanges from api
 * @returns 
 */
async function getExchanges() {

    var apiToken = process.env.EOD_TOKEN;
    if(!apiToken){
        throw new Error('Failed to collect apiToken for EOD finance')
    }

    var options = {
        method: 'GET',
        url: `https://eodhistoricaldata.com/api/exchanges-list/?api_token=${apiToken}&fmt=json`
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
 * A function that restructures the exchange data list to a single object with nested field for lookup performance.
 */
async function seedExchanges(){

    const exchanges = await getExchanges();

    if(!exchanges){
        throw new Error('Failed to get exchanges from EOD despite correct api key')
    }

    // purge previous records
    Logger.warn('Deleting all exchanges to add new records collected')
    await Exchange.deleteMany({});

    var restructuredExchanges = {};

    for(const exchange of exchanges){
        await Exchange.create({
            name:exchange.Name,
            code:exchange.Code,
            mic:exchange.OperatingMIC,
            country:exchange.Country,
            currency:exchange.Currency,
        })
    }

    return restructuredExchanges;
}

module.exports = seedExchanges;