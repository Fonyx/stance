const mongoose = require('mongoose');
const {assetSchema} = require('./Asset');
const {styleSchema, goalSchema, tagSchema} = require('./Meta');
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio'
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank'
    },
    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true
    },
    style: {
        type: styleSchema,
        default: () => ({})
    },
    goal: {
        type: goalSchema,
        default: () => ({})
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
}, {timestamps: true});

// a combined index for unique accounts for user by name
accountSchema.index({userId: 1, name: 1}, {unique: true})

const Account = mongoose.model('Account', accountSchema);


module.exports = {
    Account,
    accountSchema
}