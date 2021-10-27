const { Transaction, Account } = require('../models');
const Logger = require('../utils/logger');

/**
 * Creates a transaction from referenced fields, not referenced ObjectId's - wrapper for rich create. 
 * @param {data} data {accountNames}
 */
async function createFromText(data){

    var toAccount = await Account.findOne({
        name: data.toAccountName,
        type: data.type,
        user: data.user
    });
    var fromAccount = await Account.findOne({
        name: data.fromAccountName,
        type: data.type,
        user: data.user
    });

    let payload = {
        toAccount,
        fromAccount,
        date: data.date,
        description: data.description,
        amount: data.amount,
        factor: data.factor,
        frequency: data.frequency
    }

    let transaction = await transactionSvc.createFromRich({...payload});

    return transaction

}


/**
 * Create or find a transaction for a given name and user, operates a findOneAndUpdate
 * @param {str} name string
 * @param {models.Transaction} transaction instance
 * @returns models.Transaction instance
 */
 async function createFromRich(data){

    let foundTransaction;

    foundTransaction = await Transaction.findOne({
        //  find this
        ...data
    });

    if(foundTransaction){
        Logger.info(`Found transaction ${foundTransaction.name}`)
    } else {
        foundTransaction = await Transaction.create({
            ...data
        })
        Logger.info(`Created transaction ${foundTransaction.description}`)
    }

    return foundTransaction;

};

/**
 * Function that purges all transactions
 */
async function clear(){
    await Transaction.deleteMany({});
}

/**
 * Clears all transactions associated with an account
 * @param {models.User} user instance
 */
async function clearUserTransactions(user){

    Logger.info('Purging transactions for test user');

    let userAccounts = await Account.find({
        user
    });

    // purge Transactions for test user accounts
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
}

const transactionSvc = {
    createFromRich,
    clear,
    clearUserTransactions,
    createFromText
}

module.exports = transactionSvc