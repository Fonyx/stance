const { Account, Tag } = require('../models');
const {accountSvc} = require('../services');
const accountSeeds = require('./seeds/accountSeeds.json');
const Logger = require('../utils/logger');

async function seedAccounts(){

    var accounts = [];

    Logger.info('Purging test user accounts');

    // purge accounts
    await Account.deleteMany();

    // purge all tags for user
    await Tag.deleteMany();

    for (let accountTextObj of accountSeeds){
        let account = await accountSvc.createFromSeed(accountTextObj);
        accounts.push(account);
    }

    Logger.info(`Seeded ${accounts.length} Accounts`);
}

module.exports = seedAccounts;
