import { Dictionary } from "./dictionary";

// helpers that convert a list of transactions to a single account balance stream

// accepts account balance, and list of transaction objects

// note that if multiple accounts are calculated, any transactions that move from one to the other will be cancelled out in the accumulator as the toAccount value and the fromAccount value sum to zero

/**
 * accepts a starting integer, and returns a dateStream balance list
 * @param {modles.Account} account 
 * @param {[models.Transaction]} transactions 
 * @returns {[Obj]} date, balance, [transaction descriptions for that day]
 */
export default function accumulateTransactions(account, transactions){

    console.log('Client side accumulator not implemented, see server side accumulator')

}