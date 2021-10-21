const getCoins = require('../api/getCoins');
const {Asset} = require('../models');
const wait = require('../utils/wait');
const Logger = require('../utils/logger');

async function seedCoins(){
    let coinData = await getCoins();
    if(!coinData){
        Logger.warn('No coins returned from EOD finance despite apiToken being found');
        throw new Error('No coins returned, exit seed before altering database')
    }

    // purge previous coins before loading in new coins
    Logger.warn('Resetting coins for seed');
    try {
        await Asset.deleteMany({
            type: "coin"
        });
    } catch (err) {
        console.error(err);
    }
    // load in new coins by code, name and type: coin, then allow model method to query specific coin details
    // if performance or api economy becomes a problem, stack up tickers per request, this would also make it much faster so probably worth doing.
    // https://eodhistoricaldata.com/financial-apis/live-realtime-stocks-api/#Multiple_Tickers_with_One_Request
    for(const coin of coinData){
        // create with no USD value and let presave hook run individual query for coin valuation
        var assetData = {
            usdValue: 0,
            name: coin.Name,
            code: coin.Code,
            type: "coin",
            market: coin.Exchange
        }
        Logger.info(`Creating Coin for: ${coin.Name}`);
        try{
            await Asset.create(assetData);
            // delay the saves 0.05 seconds as the api has a 2000 request per minute limit 0.03 seconds per request hard speed limit
            await wait(50);
        }
        catch(err) {
            Logger.warn(`Failed to create coin for: ${coin.Name}`);
            Logger.warn(err)
        };
        
    }

}


module.exports = seedCoins