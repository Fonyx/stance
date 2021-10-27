const { Account, User, Party, Currency, Exchange, Tag, Transaction } = require('../models');
const transactionSeeds = require('./seeds/transactionSeeds.json');
const transactionSvc = require('../services/transactionSvc');
const Logger = require('../utils/logger');

async function seedTransactions(){

    var transactions = [];

    // get test username fonyx
    let user = await User.findOne({
        username: 'fonyx'
    });

    try {
        
        await transactionSvc.clearUserTransactions(user);

        for (const transaction of transactionSeeds){

            let date = new Date();

            transactions.push(
                await transactionSvc.createFromText({
                    ...transaction,
                    date,
                    user
                })
            );
            
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    Logger.info(`Seeded ${transactions.length} Transactions for user: ${user.username}`);
}

module.exports = seedTransactions;
