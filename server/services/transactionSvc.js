const { Transaction, Account, Currency } = require('../models');
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
 * validates transaction details
 * @param {obj} data 
 */
async function validateRichTransaction(data){

    if(data.toAccount){
        var toAccount = await Account.findOne({
            toAccount: data.toAccount
        });
        await Account.populate(toAccount, {path:"currency"});
    }

    if(data.fromAccount){
        var fromAccount = await Account.findOne({
            fromAccount: data.fromAccount
        });
        await Account.populate(fromAccount, {path:"currency"});
    }

    // case for round trip transaction
    if(toAccount && fromAccount){
        // check that the types match so coins, money and stock are separate
        if(toAccount.type !== fromAccount.type){
            Logger.error(`${toAccount.type} != ${fromAccount.type}`);
            throw new Error(`Transaction cannot be sent to an account of a different type`);
    
        // check the asset codes are the same so coins and stock are the same
        } else if(toAccount.assetCode !== fromAccount.assetCode){
            Logger.error(`${toAccount.assetCode} != ${fromAccount.assetCode}`);
            throw new Error(`Transaction is of different asset code`);
    
        // check the currency is the same for money transactions
        } else if(toAccount.currency.code !== fromAccount.currency.code){
            Logger.error(`${toAccount.currency.code} != ${fromAccount.currency.code}`);
            throw new Error(`Money transaction is of different currency`);
        }
    } else if(!fromAccount){
        // case for outbound

    } else if(!toAccount){
        // case for inbound
    } else {
        // case for neither account supplied
        Logger.error(`Transaction does not have a source or destination account`);
        throw new Error(`Transaction has no accounts`);
    }

    return true
}

/**
 * Create or find a transaction for a given name and user, operates a findOneAndUpdate
 * @param {str} name string
 * @param {models.Transaction} transaction instance
 * @returns models.Transaction instance
 */
 async function createFromRich(data){

    await validateRichTransaction(data);

    let foundTransaction;

    foundTransaction = await Transaction.findOne({
        //  find this
        ...data
    });

    if(foundTransaction){
        Logger.info(`Found transaction ${foundTransaction.name}`)
    } else {
        foundTransaction = await Transaction.create(data)
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

/**
 * populates all account fields for the transaction
 * @param {models.Transaction} transaction 
 */
async function populateAll(transaction){
    await Transaction.populate(transaction, {path: 'toAccount'});
    await Transaction.populate(transaction, {path: 'fromAccount'});
    return transaction
}

const transactionSvc = {
    createFromRich,
    clear,
    clearUserTransactions,
    createFromText,
    populateAll
}

module.exports = transactionSvc