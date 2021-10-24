const { Account, User, Party, Currency, Exchange } = require('../models');
const tagSvc = require('./tagSvc');
const Logger = require('../utils/logger');


function isValidSeed(data){
    var valid = true;

    switch (data.type){
        // type: money
        case "money": {
            break
        }
        // type: crypto
        case "crypto": {
            if(!data.assetCode.endsWith("-USD")){
                Logger.error('crypto code does not end with USD')
                valid = False
                break
            }
            if(data.exchange !== "CC"){
                Logger.error('crypto exchange is not CC')
                valid = False
                break
            }
            if(!data.assetCode){
                Logger.error('crypto has no asset code')
                valid = False
                break
            }
        }
        // type: stock
        case "stock": {
            if(!data.assetCode){
                Logger.error('stock has no asset code')
                valid = False
                break
            }
            break
        }
    }
    return valid
}


/**
 * Creates an account from text data passed in, by looking up referenced models
 * @param {obj} data json with text
 * @return {obj} Account
 */
async function createFromSeed(data){
    if(!isValidSeed(data)){
        throw new Error('Received invalid text data');
    }
    // data is valid

    // get first username from user seeds and add the tags to it (fonyx)
    let user = await User.findOne({
        username: data.user
    });

    if(!user){
        Logger.warn(`No user found for ${data.user}`)
    }
    
    // get party obj
    let party = await Party.findOne({
        name: data.party
    });
    if(!party){
        Logger.warn(`No party found for ${data.party}`)
    }
    
    // get currency obj
    let currency = await Currency.findOne({
        code: data.currency
    });
    if(!currency){
        Logger.warn(`No currency found for ${data.currency}`)
    }
    
    // get exchange obj
    let exchange = await Exchange.findOne({
        code: data.exchange
    });
    if(!exchange){
        Logger.warn(`No exchange found for ${data.exchange}`)
    }

    // if there are tags
    let tags = [];
    if(data.tags){
        // create tag objects and store as list of objects
        let tagObjs = await Promise.all(
            data.tags.map((name) => {
                return tagSvc.createFromSeed(name, user)
            })
        );
        // filter to the id's for the tag list
        tags = tagObjs.map((tag)=>{
            return tag.id
        })
    }

    await createFromRich({
        ...data,
        // override the data fields with their relationship ObjectId values
        user: user.id,
        party: party.id,
        currency: currency.id,
        exchange: exchange.id,
        tags
    })
}

/**
 * Function creates an account from rich referenced data, no model references looked up
 * @param {obj} data json with reference Id's
 * @return {obj} Account
 */
async function createFromRich(data){
    let account = await Account.create({...data});
    return account;
}

const accountSvc = {
    createFromSeed,
    createFromRich
}

module.exports = accountSvc