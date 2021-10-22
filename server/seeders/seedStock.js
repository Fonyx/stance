const {Asset, Exchange} = require('../models');
const wait = require('../utils/wait');
const Logger = require('../utils/logger');
const {exchangeService} = require('../services');
const getStocksForExchangeCode = require('../api/getStocks');


async function seedStock(){
    let exchanges = await exchangeService.getAll();

    if(!exchanges){
        throw new Error(`No exchanges found in database, aborting seeding for stocks`)
    }

    // looping through all exchanges
    for(let i = 0; i < exchanges.length; i++){
        let exchange = exchanges[i];
        // get all stock tickers for an exchange
        let stocks = await getStocksForExchangeCode(exchange.code)
        
        if(!stocks){
            throw new Error(`No stocks returned for code: ${exchange.code}, skipping seed for this exchange`)
        }
    
        // purge previous stocks in this exchange before loading in new stocks
        Logger.warn(`Resetting Stocks for ${exchange.code} seeding`);
        try {
            await Asset.deleteMany({
                type: "stock",
                exchangeId: exchange._id
            });
        } catch (err) {
            console.error(err);
        }

        // create new stock assets for exchange, adding in exchangeId
        for(let i = 0; i < stocks.length; i++){
            let stock = stocks[i]
            Logger.info(`Creating stock for ${stock.Name}`);
            let createObj = {
                type: "stock",
                usdValue: 0,
                name: stock.Name,
                code: stock.Code,
                exchangeId: exchange._id
            }
            try{
                let newStock = await Asset.create(createObj);
                // add new stockId to list of assets on current exchange
                await Exchange.findByIdAndUpdate({_id: exchange.id}, {
                    $push: {
                        assetIds: newStock.id
                    }
                });
            }catch(err){
                Logger.info(err)
            };
        }
    }
}


module.exports = seedStock