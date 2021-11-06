import Dictionary from './dictionary';
import parseDMY from '../helpers/formatter';

// helpers that convert a list of transactions to a single account balance stream

// accepts account balance, and list of transaction objects

// note that if multiple accounts are calculated, any transactions that move from one to the other will be cancelled out in the accumulator as the toAccount value and the fromAccount value sum to zero

/**
 * Converts a unix timestamp to an en-GB date string 
 * @param {models.Transaction} transactionObj 
 * @returns {str} en-GB formatted date string
 */
function timestampToDateString(transactionObj){
    let date = new Date(transactionObj.date*1);
    let dateString = date.toLocaleDateString('en-GB');
    return dateString
}

/**
 * Sorts a list of dateStrings in ascending order
 * @param {*} dateStringSet 
 */
function sortDateList(dateStringList){

    // sort the list
    dateStringList = dateStringList.sort((a, b)=>{
        let dateA = parseDMY(a);
        let dateB = parseDMY(b);
        return (dateA - dateB)
    });

    return dateStringList

}

/**
 * Takes tow transactions lists and returns a SET of their dates as 'dd/mm/yyyy' values in ascending order - earlier to later
 * @param {*} credits 
 * @param {*} debits 
 */
function makeDateStringList(credits, debits){
    let dateList = [];

    for(let item of credits){
        dateList.push(timestampToDateString(item))
    }

    for(let item of debits){
        dateList.push(timestampToDateString(item))
    }

    return dateList;
}

/**
 * Get the transactions that happen on a specific dateString
 * @param {[models.Transaction]} transactions 
 * @param {str} dateString (en-GB) formatted string (dd/mm/yyyy)
 * @returns 
 */
function filterTransactionsForDate(transactions, dateString){
    let filteredTransactions = transactions.filter((transaction) => {
        return timestampToDateString(transaction) === dateString;
    })
    return filteredTransactions
}

/**
 * Function to extract transaction amounts and descriptions for plot package
 * @param {boolean} credit/debit defaults to credit true
 */
function getPacket(transactions, credit=true){
    let packet = [];
    for(let transaction of transactions){
        let amount = credit?transaction.amount : -transaction.amount
        packet.push({
            description: transaction.description,
            amount: amount
        })
    }
    return packet
}


/**
 * accepts a starting integer, and returns a dateStream balance list
 * @param {Float} startingBalance 
 * @param {[models.Transaction]} transactions 
 * @returns {[Obj]} date, balance, [transaction descriptions for that day]
 */
export default function accumulateTransactions(startingBalance, credits, debits){

    // using data package dictionary in debug mode
    let dataPackage = new Dictionary(null, null, false);

    let today = new Date();
    let todayString = today.toLocaleDateString('en-GB');

    let dateStringList = makeDateStringList(credits, debits);

    // add todays date to the list before sorting
    dateStringList.push(todayString);

    dateStringList = sortDateList(dateStringList);

    // strip duplicates
    dateStringList = [...new Set(dateStringList)];

    // loop through each date
    for(let i = 0; i < dateStringList.length; i++){

        let balance = 0;
        let dateString = dateStringList[i];

        // get all the credits for that date
        let dailyCredits = filterTransactionsForDate(credits, dateString)
        
        // get all the debits for that date
        let dailyDebits = filterTransactionsForDate(debits, dateString)

        // calculate sum of credits, initial value of 0
        let creditTotal = dailyCredits.reduce((prev, curr)=>{
            return prev + curr.amount
        }, 0);
        // calculate sum of debits, initial value of 0
        let debitTotal = dailyDebits.reduce((prev, curr)=>{
            return prev - curr.amount
        }, 0);

        // calculate new total, if first day, offset by account balance, otherwise offset by previous date balance
        if(i === 0){
            balance = startingBalance + creditTotal - debitTotal
        } else {
            let previousPacket = dataPackage.getByIndex(i-1);
            balance = previousPacket.balance + creditTotal - debitTotal
        }

        // get daily credit packet for package
        let dailyCreditPackets = getPacket(dailyCredits, true);
        // get daily debit packet for package
        let dailyDebitPackets = getPacket(dailyDebits, false);

        let dailyPackets = dailyCreditPackets.concat(dailyDebitPackets)

        let packet = {
            balance: balance,
            details: dailyPackets
        }

        // add item to dictionary with list of transaction names
        dataPackage.set(dateString, packet);

    }

    dataPackage.print();

    return dataPackage.export();
}