const { User } = require('../models');
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
        
        await transactionSvc.clear();

        for (const transaction of transactionSeeds){

            // create seed date sometime in the day
            days = Math.random()*2;

            // set all transactions to be in two days
            let date = Date.now() + days*24*60*60*1000;
            // make sure to set to sydney timezone or testing gets really weird
            let endRecurrence;

            if(transaction.frequency !== 'once'){
                endRecurrence = Date.now() + 365*24*60*60*1000
            }

            transactions.push(
                await transactionSvc.createFromText({
                    ...transaction,
                    date,
                    endRecurrence,
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
