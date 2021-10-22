const {Asset, Exchange} = require('../models');
const wait = require('../utils/wait');
const Logger = require('../utils/logger');
const {exchangeService} = require('../services');
const getStocksForExchangeCode = require('../api/getStocks');


async function seedStock(){
    let auExchange = await Exchange.findOne({
        code: "AU"
    });

    if(!auExchange){
        throw new Error(`No au exchange found in database, aborting seeding for stocks`)
    }

    // get all stock tickers for an exchange
    let stocks = await getStocksForExchangeCode(auExchange.code)
    
    if(!stocks){
        throw new Error(`No stocks returned for code: ${auExchange.code}, skipping seed for this exchange`)
    }

    // purge previous stocks in this exchange before loading in new stocks
    Logger.warn(`Resetting AU Stocks for seeding`);
    try {
        await Asset.deleteMany({
            type: "stock",
            exchangeId: auExchange._id
        });
    } catch (err) {
        console.error(err);
    }

    Logger.info(`Found ${stocks.length} stocks for au exchange`);

    let assetIds = [];

    // create new stock assets for exchange, adding in exchangeId
    for(let i = 0; i < stocks.length; i++){
        let stock = stocks[i]
        // Logger.info(`Creating stock for ${stock.Name}`);
        let createObj = {
            type: "stock",
            usdValue: 0,
            name: stock.Name,
            code: stock.Code,
            exchangeId: auExchange._id
        }
        try{
            let newStock = await Asset.create(createObj);
            assetIds.push(newStock._id);
            // add new stockId to list of assets on current exchange
        }catch(err){
            Logger.info(`Failed to create stock for stock ${i} -> ${stock.Name}`)
            Logger.info(err);
        };
    }

    // update the Au exchange with a list of asset id's

    auExchange.assetIds = assetIds;
    auExchange.save();

}


module.exports = seedStock