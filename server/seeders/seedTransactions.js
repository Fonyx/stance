const { Account, User, Party, Currency, Exchange, Tag, Transaction } = require('../models');
const transactionSeeds = require('./seeds/transactionSeeds.json');
const userSeeds = require('./seeds/userSeeds.json');
const Logger = require('../utils/logger');

async function seedTransactions(){

    var transactions = [];

    // get first username from user seeds and add the tags to it (fonyx)
    let user = await User.findOne({
        username: userSeeds[0].username
    });

    try {
        Logger.info('Purging transactions for test user');

        let userAccounts = await Account.find({
            user
        })

        let moneyAccounts = await Account.find({
            user: user,
            type: "money"
        });
        let cryptoAccounts = await Account.find({
            user: user,
            type: "crypto"
        });
        let stockAccounts = await Account.find({
            user: user,
            type: "stock"
        });

        var toAccount;
        var fromAccount;

        // purge accounts for test user accounts
        // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
        // https://www.codegrepper.com/code-examples/whatever/mongoose+find+id+in+array+of+ids
        await Transaction.deleteMany({
            $or: [
                {
                    toAccount: {
                        $in: userAccounts
                    }
                },
                {
                    fromAccount: {
                        $in: userAccounts
                    }
                }
            ]
        });

        for (const transaction of transactionSeeds){

            if(transaction.type === "money"){
                toAccount = moneyAccounts[0];
                fromAccount = moneyAccounts[1];
            }else if(transaction.type === "crypto"){
                toAccount = cryptoAccounts[0];
                fromAccount = null;
            } else if(transaction.type === "stock"){
                toAccount = stockAccounts[0];
                fromAccount = null;
            }
            // some random number of days from now inside the year
            let date = new Date()
    
            transactions.push(await Transaction.create({
                toAccount,
                fromAccount,
                date,
                description: transaction.description,
                amount: transaction.amount,
                factor: transaction.factor,
                frequency: transaction.frequency
            }));
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    Logger.info(`Seeded ${transactions.length} Transactions for user: ${user.username}`);
}

module.exports = seedTransactions;
