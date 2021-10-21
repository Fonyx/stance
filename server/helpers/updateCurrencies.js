const {Asset} = require('../models');
const Logger = require('../utils/logger');
const getCurrencyData = require('../api/getCurrencies');
const currencyNames = require('../api/currencyCountry');
const currencyUnicode = require('../api/currencyUnicode');


function getSymbolUnicode(code){
    for(let country of currencyUnicode){
        if(country.Code === code){
            return country.Character;
        }
    }
    // if there is no matching symbol return null
    return null
}

async function updateCurrencies(RapidApiKey){

    let currencyData = await getCurrencyData(RapidApiKey);

    // if data package has been passed in, create/update all currencies
    if(currencyData){
        for(let [code, usdBuys] of Object.entries(currencyData.rates)){
            var name = currencyNames[code];
            if(!name){
                console.log(`Bang-no name for code: ${code}`);
                name = code;
            }
            var symbol = getSymbolUnicode(code);
            var searchQuery = {
                code: code
            }

            let perUsd = 1/usdBuys;
            var updateObj = {
                usdValue: perUsd,
                name: name,
                code: code,
                type: "currency",
                symbol: symbol,

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
        Logger.info('Updated currencies');

    } else {
        Logger.warn('Failed to update currency objects as no data was received');
    }
}

module.exports = updateCurrencies