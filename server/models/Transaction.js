const mongoose = require('mongoose');
const Logger = require('../utils/logger');

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


// create a unique index to avoid duplicates
transactionSchema.index({fromAccount: 1, toAccount: 1, description: 1, amount: 1}, {unique: true})


const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = {
    Transaction,
    transactionSchema
}