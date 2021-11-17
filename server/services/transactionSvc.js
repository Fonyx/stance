const { Transaction, Account, Currency } = require('../models');
const accountSvc = require('./accountSvc');
const Logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const {
    getDailyEnum,
    getWeeklyEnum,
    getFortnightlyEnum,
    getMonthlyEnum,
    getQuarterlyEnum,
    getYearlyEnum
} = require('../utils/date');

/**
 * Based on a date
 * https://stackoverflow.com/questions/50720112/every-3-and-6-months-recurrence-on-later-js-stating-from-a-particular-date
 * @param {models.Transaction} transaction 
 * @param {int} dayCount 
 */
function getEnumeratedRangeForTransaction(transaction){

    // let date1 = new Date(transaction.date);
    // let date2 = new Date(transaction.endRecurrence);

    // console.log(date1.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
    // console.log(date2.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

    // transaction.frequencies appearing here ["daily", "weekly", "fortnightly", "monthly", "quarterly", "yearly"]
    let dates = [];
    // default to 1 year
    let recurrence = new Date() + 365*24*60*60*1000;

    if(transaction.endRecurrence){
        recurrence = new Date(transaction.endRecurrence);
    }

    switch (transaction.frequency) {
        case 'daily':{
            // Logger.info('getting daily dates');
            dates = getDailyEnum(transaction.date, transaction.endRecurrence)
            break
        }
        case 'weekly':{
            // Logger.info('getting weekly dates');
            dates = getWeeklyEnum(transaction.date, transaction.endRecurrence)
            break
        }
        case 'monthly':{
            // Logger.info('getting monthly dates');
            dates = getMonthlyEnum(transaction.date, transaction.endRecurrence)
            break
        }
        case 'quarterly':{
            // Logger.info('getting quarterly dates');
            dates = getQuarterlyEnum(transaction.date, transaction.endRecurrence)
            break
        }
        case 'yearly':{
            // Logger.info('getting yearly dates');
            dates = getYearlyEnum(transaction.date, transaction.endRecurrence)
            break
        }
        // default is fortnightly
        default: {
            // Logger.info('getting fortnightly dates');
            dates = getFortnightlyEnum(transaction.date, transaction.endRecurrence)
            break
        }
    }
    return dates;

}

/**
 * get all the dates for this transaction series based on recurrence setting and end recurrence, if transaction happens once, returns date for simple list operation downstream
 * @param {*} transaction 
 */
function getTransactionRecurrenceDates(transaction){
    // transaction.endRecurrence -> defaults to date + 1 year
    let transactionDates = [];

    // case for occurring once
    if(transaction.frequency === 'once'){
        // add transaction date to list
        transactionDates.push(new Date(transaction.date));
    // case for recurrence
    } else {
        // replace list with populated date list
        transactionDates = getEnumeratedRangeForTransaction(transaction);
    }

    // this is always a list structure
    return transactionDates
}

/**
 * Schedule function that calls the apply method for each of todays transactions
 */
async function applyToday(){
    
    var now = new Date();

    // tomorrow is today +1 day
    var midnightTomorrow = new Date(
        now.getFullYear(), 
        now.getMonth(), 
        now.getDate() + 2
    );

    Logger.warn(`midnightTomorrow is: ${
        midnightTomorrow.toLocaleString("en-GB", {timeZone: "Australia/Sydney"})
    }`)
    Logger.warn(`midnightTomorrow is: ${
        midnightTomorrow})
    }`)

    // find all transactions that happen before tomorrow at 1am and have yet to be applied, i.e yesterdays are already applied so they are ignored
    let todaysTransactions = await Transaction.find({
        date: {
            $lt: midnightTomorrow
        },
        applied: false
    }, function (err, docs) {
        if(err){
            Logger.error(err);
        } else{
            Logger.info(`Found transactions for today: ${docs}`);
        }
    });

    for(let i =0; i < todaysTransactions.length; i++){
        let transaction = todaysTransactions[i];
        await transactionSvc.applyToAccounts(transaction);
    };

    Logger.info('Applied transactions')
}

/**
 * Accepts a populated transaction object, calculates the new balance in the destination account for a transfer transaction
 * @param {models.Transaction} transaction populated accounts
 * @returns float
 */
async function getTransactionValueTransfer(transaction, fromAccount, toAccount){
    let result = 0;
    let usdTransactionValue = 0;

    //  determine USD vaLue of transaction
    usdTransactionValue = fromAccount.unitPrice*transaction.amount

    // get toAccount balance in usd and determine usd/unit ratio
    let toAccountUsdValue = await accountSvc.exportValuation(toAccount, 'USD');
    let toAccountUsdRatio = toAccountUsdValue/toAccount.balance

    if(toAccountUsdValue !== 0){
        result = usdTransactionValue/toAccountUsdRatio
    } else {
        // unit price is listed in the currency linked to the account, not necessarily to usd
        result = usdTransactionValue/toAccount.unitPrice
    }

    Logger.info(`Transferring usd Value: ${usdTransactionValue} To account with usd Value: ${toAccountUsdValue}`);

    Logger.info(`Resulting balance change at destination account is: ${result}`)

    return result;
}

/**
 * get the balance a transaction updates the destination account with - hence the lack of calculations on the from account as that is covered implicitly by the transaction.amount field
 * @param {*} transaction 
 */
async function getTransactionBalanceImpact(transaction){

    let balanceImpact = 0;

    //toAccount only
    if(transaction.toAccount && !transaction.fromAccount){
        balanceImpact = parseFloat((transaction.amount).toFixed(6));
    }

    // case where valuation needs to be exchanged because transaction is between accounts
    if(transaction.fromAccount && transaction.toAccount){
        let fromAccount = await Account.findOne(transaction.fromAccount); 
        let toAccount = await Account.findOne(transaction.toAccount); 
        balanceImpact = await getTransactionValueTransfer(transaction, fromAccount, toAccount);
    }

    return balanceImpact
}

/**
 * Apply transaction to it's accounts, then mark as applied
 * @param {models.Transaction} transaction model
 * @returns true or throw
 */
 async function applyToAccounts(transaction){

    var appliedBalance = 0;

    if(!transaction.toAccount && !transaction.fromAccount){
        throw new Error('Transaction hasn\'t got either a to or from account');
    }
    //toAccount only
    if(transaction.toAccount && !transaction.fromAccount){
        let toAccount = await Account.findOne(transaction.toAccount);
        toAccount.balance += transaction.amount;
        await toAccount.save();
        // record the balanceImpact as the applied Balance
        appliedBalance = transaction.amount;
    }
    // fromAccount only
    if(transaction.fromAccount && !transaction.toAccount){
        let fromAccount = await Account.findOne(transaction.fromAccount);
        fromAccount.balance -= transaction.amount;
        await fromAccount.save();
    }

    // case where valuation needs to be exchanged because transaction is between accounts
    if(transaction.fromAccount && transaction.toAccount){
        let fromAccount = await Account.findOne(transaction.fromAccount); 
        let toAccount = await Account.findOne(transaction.toAccount); 

        let balanceImpact = await getTransactionBalanceImpact(transaction);

        // add the valuation as balance to the destination accounts balance - i.e 0.2BTC + 2Btc
        toAccount.balance += balanceImpact;

        // subtract the transaction amount from the source account as their balances are implicitly linked
        fromAccount.balance -= transaction.amount;
        
        // record the amount added to the destination accounts balance so it can be subtracted later irrespective of future valuation
        await toAccount.save();
        await fromAccount.save();
        appliedBalance = balanceImpact;
    }

    transaction.applied = true;
    transaction.appliedBalance = appliedBalance;
    await transaction.save();

    return transaction;

}

/**
 * Creates a transaction from referenced fields, not referenced ObjectId's - wrapper for rich create. 
 * @param {transactionData} transactionData {accountNames}
 */
async function createFromReferences(transactionData){

    var transactions = [];

    var toAccount = await Account.findOne({
        _id: transactionData.toAccount,
    });
    var fromAccount = await Account.findOne({
        _id: transactionData.fromAccount,
    });

    // create series Id
    let seriesId = uuidv4();

    let date = new Date(transactionData.date);
    let endRecurrence = new Date(transactionData.endRecurrence);

    // number of transactions based on recurrence - loop through dates returned to create transactions
    let transactionDates = getTransactionRecurrenceDates({
        ...transactionData,
        date,
        endRecurrence
    });

    for(let date of transactionDates){
        let payload = {
            toAccount,
            fromAccount,
            date,
            description: transactionData.description,
            amount: transactionData.amount,
            frequency: transactionData.frequency,
            seriesId: seriesId
        }

        let transaction = await createFromRichCheckedApply({...payload});

        transactions.push(transaction);
    };
    
    return transactions[0]

}

/**
 * Creates a transaction from referenced fields, not referenced ObjectId's - wrapper for rich create. 
 * @param {transactionData} transactionData {accountNames}
 */
async function createFromText(transactionData){

    var transactions = [];

    var toAccount = await Account.findOne({
        name: transactionData.toAccountName,
        user: transactionData.user
    });
    var fromAccount = await Account.findOne({
        name: transactionData.fromAccountName,
        user: transactionData.user
    });

    // create series Id
    let seriesId = uuidv4();

    // number of transactions based on recurrence - loop through dates returned to create transactions
    let transactionDates = getTransactionRecurrenceDates(transactionData);

    for(let date of transactionDates){
        let payload = {
            toAccount,
            fromAccount,
            date,
            description: transactionData.description,
            amount: transactionData.amount,
            frequency: transactionData.frequency,
            seriesId: seriesId
        }

        let transaction = await createFromRichCheckedApply({...payload});

        transactions.push(transaction);
    };
    
    return transactions

}

/**
 * Finds all the transactions going into an account sort by date ascending (getting later) excluding those that have already been applied as they are represented in the account balance
 */
async function findCreditsByAccountId(accountId){
    let transactions = await Transaction.find({
        toAccount: accountId,
        applied: false
    }).sort({date: 1}).populate('toAccount').populate('fromAccount');

    return transactions;
}

/**
 * Finds all the transactions coming out of an account sort by date ascending (getting later), excluding those that have already been applied as they are represented in the account balance
 */
async function findDebitsByAccountId(accountId){
    let transactions = await Transaction.find({
        fromAccount: accountId,
        applied: false
    }).sort({date: 1}).populate('toAccount').populate('fromAccount');

    return transactions;
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
        // Logger.info(`Created transaction ${foundTransaction.description}`)
    }

    // check if transaction is due today, if so, call the apply method to update it's accounts
    if(foundTransaction.isToday()){
        let applied = await applyToAccounts(foundTransaction);
        console.log(`Transaction application: ${applied}`);
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
     
    if(!transaction.toAccount && !transaction){
        throw new Error('Transaction hasn\'t got either a to or from account');
    }
    //toAccount
    if(transaction.toAccount){
        let toAccount = await Account.findOne(transaction.toAccount);
        let newBalance = toAccount.balance - transaction.amount;
        Logger.info(`Updating account '${toAccount.name}' balance: ${toAccount.balance} to ${newBalance}`);
        toAccount.balance = newBalance;
        await toAccount.save();
    }
    // fromAccount 
    if(transaction.fromAccount){
        let fromAccount = await Account.findOne(transaction.fromAccount);

        let newBalance = fromAccount.balance + transaction.amount;
        Logger.info(`Updating account ${fromAccount.name} balance: ${fromAccount.balance} to ${newBalance}`);
        fromAccount.balance = newBalance;
        await fromAccount.save();
    }

    transaction.applied = false;
    await transaction.save();
    Logger.info(`Applied transaction`)
    
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
    createFromReferences,
    createFromRichCheckedApply,
    createFromText,
    clear,
    deleteWithUnApply,
    findCreditsByAccountId,
    findDebitsByAccountId,
    populateAll
}

module.exports = transactionSvc