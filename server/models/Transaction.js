const mongoose = require('mongoose');
const Logger = require('../utils/logger');
const {areDatesSame} = require('../utils/date');

// https://stackoverflow.com/questions/35672248/how-to-change-date-timezone-in-mongoose
const moment = require('moment-timezone');
const dateAustralia = moment.tz(Date.now(), "Australia/Sydney");

const transactionSchema = new mongoose.Schema({
    // accounts can't both be null
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        // if this.toAccount is null, then this field is required
        required: function() { return this.toAccount === null; },
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        // if this.fromAccount is null, then this field is required
        required: function() { return this.fromAccount === null; },
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true,
        default: dateAustralia
    },
    // this is the amount that was deducted from a source account as a balance, not as a valuation
    amount: {
        type: Number,
        // if this.factor is null, then this field is required
        required: true,
        min: 0
    },
    frequency: {
        type: String,
        enum: ["once", "daily", "weekly", "fortnightly", "monthly", "quarterly", "yearly"],
        default: "once"
    },
    // defaults to 1 year from now for recurring transactions, returns date if once only
    endRecurrence: {
        type: Date,
        default: function (){
            if(this.frequency === 'once'){
                return this.date
            } else {
                return this.date + 365*24*60*60
            }
        },
        // this is required if the frequency isn't 'once'
        required: function() { return this.frequency !== 'once'; }
    },
    applied: {
        type: Boolean,
        default: false
    },
    // this is the amount that was applied to any destination accounts as a balance, not as a valuation
    appliedBalance: {
        type: Number,
        required: false,
    },
    seriesId: {
        type: String,
        required: true
    }
}, {timestamps: true});

// check if transaction is happening anytime between today 00:00 and 23:59
transactionSchema.methods.isToday = function(){
    let today = new Date();
    return areDatesSame(this.date, today)? true: false;
}


// create a unique index to avoid duplicates
transactionSchema.index({fromAccount: 1, toAccount: 1, description: 1, date: 1, amount: 1, seriesId: 1}, {unique: true});


const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = {
    Transaction,
    transactionSchema
}