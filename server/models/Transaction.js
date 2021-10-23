const mongoose = require('mongoose');
const Logger = require('../utils/logger');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true,
        default: new Date()
    },
    amount: {
        type: Number,
        // if this.factor is null, then this field is required
        required: function() { return this.factor === null; },
        min: 0
    },
    factor: {
        type: Number,
        required: false,
        min: 0,
        max: 1
    },
    frequency: {
        type: String,
        enum: ["once", "daily", "weekly", "fortnightly", "monthly", "quarterly", "yearly"],
        default: "once"
    }
}, {timestamps: true});


// validate the transaction is of correct types and codes if applicable
transactionSchema.pre('validate', async function(next) {
    this.populate('Account');
    
    // checks for if the transaction is a round trip transaction
    if(this.toAccount && this.fromAccount){
        this.toAccount.populate('Currency');
        this.fromAccount.populate('Currency');
        // check that the types match so coins, money and stock are separate
        if(this.toAccount.type !== this.fromAccount.type){
            Logger.error(`${this.toAccount.type} != ${this.fromAccount.type}`);
            throw new Error(`Transaction cannot be sent to an account of a different type`);
    
        // check the asset codes are the same so coins and stock are the same
        } else if(this.toAccount.assetCode !== this.fromAccount.assetCode){
            Logger.error(`${this.toAccount.assetCode} != ${this.fromAccount.assetCode}`);
            throw new Error(`Transaction is of different asset code`);
    
        // check the currency is the same for money transactions
        } else if(this.toAccount.currency.code !== this.fromAccount.currency.code){
            Logger.error(`${this.toAccount.currency.code} != ${this.fromAccount.currency.code}`);
            throw new Error(`Money transaction is of different currency`)
        } else {
            next();
        }
    // otherwise don't bother
    }else{
        next()
    }

})

// create a unique index to avoid duplicates
transactionSchema.index({fromAccount: 1, toAccount: 1, description: 1, date: 1, amount: 1}, {unique: true})


const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = {
    Transaction,
    transactionSchema
}