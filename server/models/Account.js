const mongoose = require('mongoose');
const {assetSchema} = require('Asset');
const {styleSchema, goalSchema, tagSchema} = require('Meta');
const { walletSchema } = require('./Wallet');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['currency', 'coin', 'stock'],
        default: 'currency'
    },
    balance: {
        type: Number,
        required: true
    },
    discrete: {
        type: Boolean,
        required: true,
        default: false
    },
    interestRate: {
        type: Number,
        required: false,
    },
    compounds: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: ['monthly']
    },
    portfolio: {
        type: mongoose.Types.Schema.ObjectId,
        ref: 'Portfolio'
    },
    wallet: {
        type: mongoose.Types.Schema.ObjectId,
        ref: 'Wallet'
    },
    bank: {
        type: mongoose.Types.Schema.ObjectId,
        ref: 'Bank'
    },
    symbolCharacter: {
        type: String,
        required: false,
        default: "$"
    },
    code: {
        type: String,
        required: false,
        default: "AUD"
    },
    usdValue: {
        type: Number,
        required: true
    },
    marketName: {
        type: String,
        required: false
    },
    style: styleSchema,
    goal: goalSchema,
    tags: [tagSchema]
}, {timestamps: true});

// a combined index for unique accounts for user by name
accountSchema.index({userId: 1, name: 1}, {unique: true})

const Account = mongoose.model('Account', accountSchema);


module.exports = {
    Account,
    accountSchema
}