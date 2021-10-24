const { Account, User, Party, Currency, Exchange, Tag } = require('../models');
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
        }
        // type: stock
        case "stock": {
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

    // get party obj
    let party = await Party.findOne({
        name: data.party
    });
    
    // get currency obj
    let currency = await Currency.findOne({
        code: data.currency
    });
    
    // get exchange obj
    let exchange = await Exchange.findOne({
        code: data.exchange
    });

    // if there are tags
    let tags = [];
    if(data.tags){
        // create tag objects and store as list of objects
        let tagObjs = await Promise.all(
            data.tags.map((name) => {
                return Tag.findOneAndUpdate(
                    {
                        //  find this
                        name,
                        user: user.id
                    }, {
                        // update it with the same values
                        name,
                        user: user.id
                    },{
                        // allow upsert, new, and runvalidators so it is a proper create
                        upsert: true, 
                        new: true, 
                        runValidators: true
                    }, (err, doc) => {
                        if(err){
                            Logger.error(err)
                        } else {
                            Logger.info(`created tag ${doc.name}`)
                        }
                    }
                )
            })
        );
        // filter to the id's for the tag list
        tags = tagObjs.map((tag)=>{
            return tag.id
        })
    }

    createFromRich({
        ...data,
        // override the data fields with their relationship ObjectId values
        user,
        party,
        currency,
        exchange,
        tags
    })
}

/**
 * Function creates an account from rich referenced data, no model references looked up
 * @param {obj} data json with reference Id's
 * @return {obj} Account
 */
async function createFromRich(data){
    let account = await Account.create(data);
    return account;
}

const accountSvc = {
    createFromSeed,
    createFromRich
}

module.exports = accountSvc