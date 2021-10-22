const {Currency} = require('../models');
const Logger = require('../utils/logger');
const getCurrencyData = require('../api/getCurrencies');
const currencyNames = require('../api/currencyNames');
const currencyUnicode = require('../api/currencyUnicode');

async function updateCurrencies(RapidApiKey){

    // reformatCode();
    // return
    let currencyData = await getCurrencyData(RapidApiKey);

    // if data package has been passed in, create/update all currencies
    if(currencyData){
        for(let [code, usdBuys] of Object.entries(currencyData.rates)){
            var name = currencyNames[code];
            var symbol = '';
            var unicode_decimal = '';
            var unicode_hex = '';

            if(currencyUnicode[code]){
                symbol = currencyUnicode[code]?.symbol;
                unicode_decimal = currencyUnicode[code]?.unicode_decimal;
                unicode_hex = currencyUnicode[code]?.unicode_Hex;
            }

            if(!name){
                console.log(`Bang-no name for code: ${code}`);
                name = code;
            }

            var searchQuery = {
                code: code
            }

            let perUsd = 1/usdBuys;
            var updateObj = {
                usdValue: perUsd,
                name: name,
                code: code,
                symbol: symbol,
                unicode_decimal: unicode_decimal,
                unicode_hex: unicode_hex
            }
            // https://stackoverflow.com/questions/13337685/mongoose-js-how-to-implement-create-or-update
            var options = {
                upsert: true, 
                setDefaultsOnInsert: true, 
                new: true
            }
            await Currency.findOneAndUpdate(
                searchQuery, 
                updateObj, 
                options
            );
        }
        Logger.info(`Updated ${Object.entries(currencyData.rates).length} currencies`);

    } else {
        Logger.warn('Failed to update currency objects as no data was received');
    }
}

module.exports = updateCurrencies