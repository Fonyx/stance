const { User } = require('../models');
const transactionSeeds = require('./seeds/transactionSeeds.json');
const transactionSvc = require('../services/transactionSvc');
const Logger = require('../utils/logger');

const moment = require('moment-timezone');

async function seedTransactions(){

    // get test username fonyx
    let user = await User.findOne({
        username: 'fonyx'
    });

    try {
        
        await transactionSvc.clear();

        for (const transaction of transactionSeeds){

            // create seed date sometime in the next 2 days day
            days = Math.random()*2;

            // set all transactions to be in two days
            let date = moment.tz(Date.now() + days*24*60*60*1000, "Australia/Sydney");
            // make sure to set to sydney timezone or testing gets really weird
            let endRecurrence;

            if(transaction.frequency !== 'once'){
                endRecurrence = moment.tz(Date.now() + 365*24*60*60*1000, "Australia/Sydney");
            }

            
            let transactions = await transactionSvc.createFromText({
                ...transaction,
                date,
                endRecurrence,
                user
            })

            if(transaction.frequency === "once"){
                Logger.info(`Seeded ${transactions.length} Transaction for seed: ${transaction.description} occurring once`)

            }else {
                Logger.info(`Seeded ${transactions.length} Transactions for seed: ${transaction.description} \n every: ${transaction.frequency} \n\t from: ${new Date(date)} \n\t until: ${new Date(endRecurrence)}`)

            }

            
            
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = seedTransactions;
