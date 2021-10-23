const coinData = require('../api/coinData');
const {Asset, Exchange, Currency} = require('../models');
const Logger = require('../utils/logger');

async function seedCoins(){
    if(!coinData){
        Logger.warn('No coins returned from local file');
        throw new Error('No coins returned, exit seed before altering database')
    }

    // purge previous coins before loading in new coins
    Logger.warn('Resetting coins for seed');
    try {
        await Asset.deleteMany({
            type: "crypto"
        });
    } catch (err) {
        console.error(err);
    }
    // load in new coins by code, name and type: coin, then allow model method to query specific coin details

    // since all coins come from the CC exchange, we need the exchange object for CC
    let ccExchange = await Exchange.findOne({
        code: "CC"
    });

    let usdCurrency = await Currency.findOne({
        code:"USD"
    })
    let assetIds = [];

    for(const coin of coinData){
        // create with no USD value and let presave hook run individual query for coin valuation
        Logger.info(`Creating crypto coin: ${coin.Name}`);

        var assetData = {
            unitPrice: 0,
            name: coin.Name,
            code: coin.Code,
            type: "crypto",
            currencyId: usdCurrency.id,
            exchangeId: ccExchange.id
        }
        try{
            let coinObj = await Asset.create(assetData);
            assetIds.push(coinObj.id);
        }
        catch(err) {
            Logger.warn(`Failed to create coin for: ${coin.Name}`);
            Logger.warn(err)
        };
    }

    // save the crypto assets to the exchange
    await Exchange.findByIdAndUpdate({_id: ccExchange.id},{
        $push : {
            assetIds: assetIds
        }
    });
}


module.exports = seedCoins