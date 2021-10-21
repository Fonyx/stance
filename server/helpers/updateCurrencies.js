const {Asset} = require('../models');
const Logger = require('../utils/logger');
const getCurrencyData = require('../api/getCurrencies');
const currencyNames = require('../api/currencyCountry');
const currencyUnicode = require('../api/currencyUnicode');

const fs = require('fs');

function reformatCode(){
    var newUnicode = {};

    for(let country of currencyUnicode){
        let result = {
            currency: country.Currency,
            symbol: country.Character,
            unicode_decimal: country['Unicode decimal'],
            unicode_Hex: country['Unicode Hex']
        }
        newUnicode[country.Code] = result;
    }
    // if there is no matching symbol return null
    fs.writeFileSync('newUnicode.txt', JSON.stringify(newUnicode, null, 2), 'UTF-8');
}

async function updateCurrencies(RapidApiKey){

    // reformatCode();
    // return
    let currencyData = await getCurrencyData(RapidApiKey);

    // if data package has been passed in, create/update all currencies
    if(currencyData){
        for(let [code, usdBuys] of Object.entries(currencyData.rates)){
            var name = currencyNames[code];
            var symbol;
            var unicode_decimal;
            var unicode_hex;

            if(currencyUnicode[code]){
                symbol = currencyUnicode[code]?.symbol;
                unicode_decimal = currencyUnicode[code]?.unicode_decimal;
                unicode_hex = currencyUnicode[code]?.unicode_Hex;
            } else {
                Logger.info(`No symbol, or unicode for code: ${code}`);
                symbol = ''
                unicode_decimal = '';
                unicode_hex = '';
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
                type: "currency",
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