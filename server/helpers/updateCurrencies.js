const {Asset} = require('../models');
const Logger = require('../utils/logger')

async function updateCurrencies(currencyData){
    // if data package has been passed in, create/update all currencies
    if(currencyData){
        for(let [name, usdBuysCount] of Object.entries(currencyData.rates)){
            
            var searchQuery = {
                name: name
            }
            let perUsd = 1/usdBuysCount;
            var updateObj = {
                usdValue: perUsd,
                code: name
            }
            // https://stackoverflow.com/questions/13337685/mongoose-js-how-to-implement-create-or-update
            var options = {
                upsert: true, 
                setDefaultsOnInsert: true, 
                new: true
            }
            await Asset.findOneAndUpdate(
                searchQuery, 
                updateObj, 
                options
            );
        }

    } else {
        Logger.warn('Failed to update currency objects as no data was received')
    }
}

module.exports = updateCurrencies