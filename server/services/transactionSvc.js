const { Transaction, Account, Currency } = require('../models');
const Logger = require('../utils/logger');


/**
 * Schedule function that calls the apply method for each of todays transactions
 */
async function applyToday(){
    
    var now = new Date();

    // tomorrow is today +1 day
    var midnightTomorrow = new Date(
        now.getFullYear(), 
        now.getMonth(), 
        now.getDate() + 1
    );

    Logger.warn(`midnightTomorrow is: ${
        midnightTomorrow.toLocaleString("en-GB", {timeZone: "Australia/Sydney"})
    }`)

    // find all transactions that happen before tomorrow at 1am and have yet to be applied, i.e yesterdays are already applied so they are ignored
    let todaysTransactions = await Transaction.find({
        date: {
            $lt: midnightTomorrow
        },
        applied: false
    }, function (err, docs) {
        Logger.info(`Found transactions for today: ${docs}`);
    });

    for(let i =0; i < todaysTransactions.length; i++){
        let transaction = todaysTransactions[i];
        await transactionSvc.applyToAccounts(transaction);
    };

    Logger.info('Applied transactions')
}


/**
 * Apply transaction to it's accounts, then mark as applied
 * @param {models.Transaction} transaction model
 * @returns true or throw
 */
 async function applyToAccounts(transaction){
    // check fraction only appears where it makes sense
    if(transaction.fraction){
        throw new Error(`Transaction has a fraction but is listed as a toAccount transaction which makes no sense man`)
    }
    if(!transaction.toAccount && !transaction){
        throw new Error('Transaction hasn\'t got either a to or from account');
    }
    //toAccount only - these can't have fractions
    if(transaction.toAccount && !transaction.fromAccount){
        let toAccount = await Account.findOne(transaction.toAccount);
        let newBalance = toAccount.balance + transaction.amount;
        Logger.info(`Updating account '${toAccount.name}' balance: ${toAccount.balance} to ${newBalance}`);
        toAccount.balance = newBalance;
        await toAccount.save();
    }
    // fromAccount only - can have a fraction instead of an amount
    else if(!transaction.toAccount && transaction.fromAccount){
        let fromAccount = await Account.findOne(transaction.fromAccount);
        let transactionValue = getTransactionFractionValue(transaction, fromAccount);
        let newBalance = fromAccount.balance - transactionValue;
        Logger.info(`Updating account ${fromAccount.name} balance: ${fromAccount.balance} to ${newBalance}`);
        fromAccount.balance = newBalance;
        await fromAccount.save();
    }
    // both accounts - round trip this can have a fraction instead of an amount
    else if(transaction.toAccount && transaction.fromAccount){

        let fromAccount = await Account.findOne(transaction.fromAccount);
        let toAccount = await Account.findOne(transaction.toAccount);

        let transactionValue = getTransactionFractionValue(transaction, fromAccount);
        
        // update account balances with transaction value
        Logger.info(`Updating account ${fromAccount.name} balance: ${fromAccount.balance} to ${fromAccount.balance - transactionValue}`);
        Logger.info(`Updating account ${toAccount.name} balance: ${toAccount.balance} to ${toAccount.balance + transactionValue}`);
        fromAccount.balance = fromAccount.balance - transactionValue;
        toAccount.balance = toAccount.balance + transactionValue;
        await fromAccount.save();
        await toAccount.save();
    }
    transaction.applied = true;
    await transaction.save();
    Logger.info(`Applied transaction`)

}

/**
 * Creates a transaction from referenced fields, not referenced ObjectId's - wrapper for rich create. 
 * @param {data} data {accountNames}
 */
async function createFromText(data){

    var toAccount = await Account.findOne({
        name: data.toAccountName,
        user: data.user
    });
    var fromAccount = await Account.findOne({
        name: data.fromAccountName,
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

    let transaction = await createFromRichCheckedApply({...payload});

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
 async function createFromRichCheckedApply(data){

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

    // check if transaction was created today, if so, call the apply method to update it's accounts
    if(foundTransaction.isToday()){
        await applyToAccounts(foundTransaction);
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
 * Calls the unApplyToAccounts method before destroying transaction
 * @param {models.Transaction} obj 
 */
async function deleteWithUnApply(transaction){
    await unApplyToAccounts(transaction);
    await Transaction.deleteOne(transaction);
    Logger.warn(`Deleted transaction: ${transaction.description}`)
}

/**
 * Function that unapplies a transaction to it's accounts, preserving the state of the account balance
 * @param {models.Transaction} transaction model
 * @returns true or throw
 */
 async function unApplyToAccounts(transaction){
     
    // check fraction only appears where it makes sense
    if(transaction.fraction){
        throw new Error(`Transaction has a fraction but is listed as a toAccount transaction which makes no sense man`)
    }
    if(!transaction.toAccount && !transaction){
        throw new Error('Transaction hasn\'t got either a to or from account');
    }
    //toAccount only - these can't have fractions
    if(transaction.toAccount && !transaction.fromAccount){
        let toAccount = await Account.findOne({"_id": transaction.toAccount});
        let newBalance = toAccount.balance - transaction.amount;
        Logger.info(`Updating account '${toAccount.name}' balance: ${toAccount.balance} to ${newBalance}`);
        toAccount.balance = newBalance;
        await toAccount.save();
    }
    // fromAccount only - can have a fraction instead of an amount
    else if(!transaction.toAccount && transaction.fromAccount){
        let fromAccount = await Account.findOne({"_id": transaction.fromAccount});
        let transactionValue = getTransactionFractionValue(transaction, transaction.fromAccount);
        let newBalance = fromAccount.balance + transactionValue;
        Logger.info(`Updating account ${fromAccount.name} balance: ${fromAccount.balance} to ${newBalance}`);
        fromAccount.balance = newBalance;
        await fromAccount.save();
    }
    // both accounts - round trip this can have a fraction instead of an amount
    else if(transaction.toAccount && transaction.fromAccount){
        let fromAccount = await Account.findOne({"_id": transaction.fromAccount});
        let toAccount = await Account.findOne({"_id": transaction.toAccount});

        let transactionValue = getTransactionFractionValue(transaction, transaction.fromAccount);
        
        // update account balances with transaction value
        Logger.info(`Updating account ${fromAccount.name} balance: ${fromAccount.balance} to ${fromAccount.balance + transactionValue}`);
        Logger.info(`Updating account ${toAccount.name} balance: ${toAccount.balance} to ${toAccount.balance - transactionValue}`);
        fromAccount.balance = fromAccount.balance + transactionValue;
        toAccount.balance = toAccount.balance - transactionValue;
        await fromAccount.save();
        await toAccount.save();
    }
    transaction.applied = true;
    await transaction.save();
    Logger.info(`UnApplied transaction`)
    
    }

/**
 * Determine the transaction value depending on an amount, or a factor of the fromAccount, note must have both accounts
 * @param {*} transaction 
 * @param {*} account 
 */
function getTransactionFractionValue(transaction, fromAccount){
    // case for factor transaction
    if(transaction.factor){
        return transaction.factor * fromAccount.balance
    } else {
        return transaction.amount
    }

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
    applyToAccounts,
    applyToday,
    unApplyToAccounts,
    createFromRichCheckedApply,
    clear,
    createFromText,
    deleteWithUnApply,
    populateAll
}

module.exports = transactionSvc