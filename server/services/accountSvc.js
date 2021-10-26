const { Account, User, Party, Currency, Exchange } = require('../models');
const tagSvc = require('./tagSvc');
const getAssetValue = require('../api/getAssetValue');
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
        }
        // type: stock
        case "stock": {
            if(!data.assetCode){
                Logger.error('stock has no asset code')
                valid = false
                break
            }
            break
        }
    }
    return valid
}

/**
 * Function that receives an account and verifies if it has been populated
 * @param {obj} models.Account 
 * @returns {boolean} 
 */
function isAccountPopulated(account){
    isPopulated = true;
    // if account has the field, and it doesn't have a subdocument field it only has the object reference
    if(account.user && !account.user.username){
        isPopulated = false;
    }
    if(account.party && !account.party.name){
        isPopulated = false;
    }
    if(account.currency && !account.currency.code){
        isPopulated = false;
    }
    if(account.exchange && !account.exchange.name){
        isPopulated = false;
    }

    return isPopulated
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
            account.changeP = data.change_p !== 'NA' ? data.change_p : null;

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
 * update the account valuation using the unitPrice and the balance of the account
 */
async function exportValuation(account, code=null){
    let resultValue = 0.00;

    // if we are exporting to a different currency but not changing the stored currency
    if(code){
        // check the account is populated with currency field
        if(!isAccountPopulated(account)){
            throw new Error("Cannot export the valuation for a non native currency as account passed was not populated with it's own currency object for the conversion")
        }

        // get target currency object from requested code
        let targetCurrency = await Currency.findOne({
            code: code
        });
        // if none, exit
        if(!targetCurrency){
            throw new Error(`No currency found for code: ${code}`);
        } 

        resultValue = account.currency.usdValue * account.balance/targetCurrency.usdValue;
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
 * Creates an account from rich data passed in which has objectId's as strings
 * @param {obj} data json with ObjectId's
 * @return {obj} Account
 */
async function createFromRich(data){
let account = await Account.create({...data});
Logger.info(`Created account: ${account.name} in service layer`);
return account;
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
    isAccountPopulated,
    isValidSeed,
    exportValuation,
    findById,
    createFromSeed,
    createFromRich,
    clear
}

module.exports = accountSvc