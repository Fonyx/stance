const { Account, User, Party, Currency, Exchange, Tag } = require('../models');
const accountSeeds = require('./seeds/accountSeeds.json');
const userSeeds = require('./seeds/userSeeds.json');
const Logger = require('../utils/logger');

async function seedParties(){

    var accounts = [];

    // get first username from user seeds and add the tags to it (fonyx)
    let userObj = await User.findOne({
        username: userSeeds[0].username
    });

    try {
        // purge all auto generated parties, leave user generated parties
        Logger.info('Purging automatically seeded parties');

        // purge accounts
        await Account.deleteMany({
            user: userObj.id
        });

        // purge all tags for user
        await Tag.deleteMany({
            user: userObj.id
        });

        for (const account of accountSeeds){

            // get party obj
            let party = await Party.findOne({
                name: account.partyName
            });
            
            // get currency obj
            let currency = await Currency.findOne({
                code:account.currencyCode
            });
            
            // get exchange obj
            let exchange = await Exchange.findOne({
                code: account.exchangeCode
            });
            
            // create tag objects and store as list of objects
            let tagObjs = await Promise.all(
                account.tags.map((name) => {
                    return Tag.create({
                        name,
                        user: userObj.id
                    })
                })
            );
            // filter to the id's for the tag list
            let tags = tagObjs.map((tag)=>{
                return tag.id
            })
    
            accounts.push(await Account.create({
                ...account,
                user: userObj.id,
                currency,
                party,
                exchange,
                tags
            }));
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    Logger.info(`Seeded ${accounts.length} Accounts for user: ${userObj.username}`);
}

module.exports = seedParties;
