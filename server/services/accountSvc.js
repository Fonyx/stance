const { Account, User, Party, Currency, Exchange, Goal } = require('../models');
const tagSvc = require('./tagSvc');
const getAssetValue = require('../api/getAssetValue');
const Logger = require('../utils/logger');

async function getAudCurrencyAsDefault(){
    console.log('DANGEROUS THING HAPPENED, DEFAULTED TO AUD CURRENCY')
    let aud = await Currency.findOne({
        code: "AUD"
    });
    return aud;
}


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
                valid = false
                break
            }
            if(data.exchange !== "CC"){
                Logger.error('crypto exchange is not CC')
                valid = false
                break
            }
            if(!data.assetCode){
                Logger.error('crypto has no asset code')
                valid = false
                break
            }
            if(!data.assetName){
                Logger.error('crypto has no asset name')
                valid = false
                break
            }
        }
        // type: stock
        case "stock": {
            if(!data.assetCode){
                Logger.error('stock has no asset code')
                valid = false
                break
            }
            if(!data.assetName){
                Logger.error('stock has no asset name')
                valid = false
                break
            }
            break
        }
    }
    return valid
}

/**
 * updates an account object unitPrice, relies on hooks: pre [find, findOne] to populate account references that are used. Specifically the exchange object
 * @param {*} account 
 */
async function updateUnitPriceAndValuation(account){

    if (account.type === 'money') {
        account.unitPrice = 1;
    } else {
        // lookup the usdValue of the coin
        if (account.assetCode) {
            let data = await getAssetValue(account.assetCode, account.exchange.code);

            if (!data) {
                throw new Error(`Failed to get data for assetCode: ${account.assetCode} exchangeCode: ${account.exchange.code} for some reason`);
            }
            
            // if these is no market open price, use previous close
            account.unitPrice = data.open !== 'NA' ? data.open : data.previousClose;
            account.changeP = data.change_p !== 'NA' ? data.change_p : 0;

        } else {
            throw new Error(`Can't collect crypto value since ${account.name} has no code`);
        }
    }

    // now that the account has an accurate unitPrice, update it's valuation
    account.valuation = account.balance * account.unitPrice;
    
    await account.save();
    Logger.info(`Updated account unitPrice in service layer ${account.name}: to ${account.unitPrice}`);

    return account;
}

/**
 * export the account valuation using the unitPrice and the balance of the account
 */
async function exportValuation(account, code=null){
    let resultValue = 0.00;

    // if we are exporting to a different currency but not changing the stored currency
    if(code){

        // get target currency object from requested code
        let targetCurrency = await Currency.findOne({
            code: code
        });
        // if none, exit
        if(!targetCurrency){
            throw new Error(`No currency found for code: ${code}`);
        } 

        resultValue = account.currency.usdValue * account.valuation/targetCurrency.usdValue;
    // case for using accounts own currency - primary case
    } else {
        resultValue = account.valuation;
    }

    return resultValue;
}


async function clear(){
    await Account.deleteMany({});
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
        throw new Error(`No user found for ${data.user}`)
    }
    
    // get party obj
    let party = await Party.findOne({
        name: data.party
    });
    if(!party){
        throw new Error(`No party found for ${data.party}`)
    }
    
    // get currency obj
    let currency = await Currency.findOne({
        code: data.currency
    });
    if(!currency){
        throw new Error(`No currency found for ${data.currency}`)
    }
    
    // get exchange obj
    let exchange = await Exchange.findOne({
        code: data.exchange
    });
    if(!exchange){
        throw new Error(`No exchange found for ${data.exchange}`)
    }

    // if there are tags
    let tags = [];
    if(data.tags){
        for(let i = 0; i<data.tags.length; i++){
            let name = data.tags[i];
            let tag = await tagSvc.upsertFromSeed(name, user);
            tags.push(tag.id);
        }
    }

    let account = createFromRich({
        ...data,
        // override the data fields with their relationship ObjectId values
        user: user.id,
        party: party.id,
        currency: currency.id,
        exchange: exchange.id,
        tags
    });

    return account
}

/**
 * Creates an account from text data passed in, by looking up referenced models
 * @param {obj} data json with text
 * @return {obj} Account
 */
async function createFromFE(data){
    
    // get exchange obj
    let exchange = await Exchange.findOne({
        code: data.exchangeCode
    });

    await Exchange.populate(exchange, {path: "currency"});

    // if no currency passed in,  get currency from exchange
    if(!data?.currency){
        let exchangeCurrency = exchange.currency;
        let currency = await Currency.findOne({
            exchangeCurrency
        });
        if(!currency){
            console.log(`No currency for objectId: ${exchange.currency.id}`);
            currency = await getAudCurrencyAsDefault();
            // throw new Error(`There is no currency for: ${exchange.currency}`);
        }
        // set the currency relation
        data.currency = currency;
    } else {
        let currencyId = data.currency
        data.currency = await Currency.findOne({
            '_id': currencyId
        });
        // throw new Error(`There is no currency attached to this request: ${data}`);
    }

    // if there are tags
    let tags = [];
    if(data.tags){
        let tagNames = data.tags.split(',');
        for(let i = 0; i<tagNames.length; i++){
            let name = tagNames[i];
            let tag = await tagSvc.upsertFromSeed(name, data.user);
            tags.push(tag.id);
        }
    }

    var goal = {};
    // if there is a goal
    if(data.goalAmount && data.goalDate){
        goal = {
            amount: data.goalAmount,
            date: data.goalDate,
            priority: 5
        }
    }

    let account = await createFromRich({
        ...data,
        // override the data fields with their relationship ObjectId values
        user: data.user.id,
        exchange: exchange.id,
        goal,
        tags
    });

    return account
}

/**
 * Creates an account from rich data passed in which has objectId's as strings
 * @param {obj} data json with ObjectId's
 * @return {obj} Account
 */
async function createFromRich(data){
    let account = await Account.create({...data});

    await Account.populate(account, {path: 'exchange'});

    Logger.info(`Created account: ${account.name} in service layer`);
    let updatedAccount = await updateUnitPriceAndValuation(account);
    return updatedAccount;
}

/**
 * Populate an account with all relations
 * @param {models.Account} instance
 * @returns {models.Account} instance
 */
async function populateEntireAccount(account){
    // populate the returned account
    await Account.populate(account, { path: 'exchange' });
    await Account.populate(account, { path: 'currency' });
    await Account.populate(account, { path: 'tags' });
    await Account.populate(account, { path: 'party' });
    await Account.populate(account, { path: 'user' });

    Logger.info(`Populated account: ${account.name} in service layer`);

    return account
}

/**
 * Service layer findOne by object id, takes advantage of hooks that populate instance
 * @param {Str} id 
 * @return {models.Account} Obj
 */
async function findById(id){
    let populatedAccount = await Account.findOne({
        "_id": id
    });
    if(!populatedAccount){
        throw new Error(`No account for id: ${id}`);
    }
    let updatedPopulatedAccount = await updateUnitPriceAndValuation(populatedAccount);
    return updatedPopulatedAccount;
}

const accountSvc = {
    isValidSeed,
    exportValuation,
    populateEntireAccount,
    updateUnitPriceAndValuation,
    findById,
    createFromSeed,
    createFromRich,
    createFromFE,
    clear
}

module.exports = accountSvc