const mongoose = require('mongoose');
const {styleSchema} = require('Meta');

const transactionSchema = new mongoose.Schema({
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    date:{
        type: Date,
        required: true,
        default: new Date()
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    factor: {
        type: Number,
        required: false,
    },
    frequency: {
        type: String,
        enum: ["once", "daily", "weekly", "fortnightly", "monthly", "quarterly", "yearly"],
        default: "once"
    },
    style: styleSchema
}, {timestamps: true});


const Transaction = mongoose.model('Transaction', schemas.transactionSchema);


module.exports = {
    Transaction,
    transactionSchema
}