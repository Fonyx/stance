const mongoose = require('mongoose');
const {styleSchema} = require('./Style');
const {goalSchema} = require('./Goal');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['money', 'crypto', 'stock'],
        default: 'currency'
    },
    balance: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: false,
        min: 0,
        max: 1
    },
    compounds: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: 'monthly'
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party'
    },
    assetCode: {
        type: String,
        required: false,
    },
    // the price per unit of the asset in the currency it references
    unitPrice: {
        type: Number,
        required: false,
        default: 0
    },
    // the market valuation of the asset using the unit price and balance
    valuation: {
        type: Number,
        required: false,
        default: 0
    },
    changeP: {
        type: Number,
        required: false,
        default: 0
    },
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },
    exchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exchange'
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
accountSchema.index({user: 1, type: 1, name: 1}, {unique: true});


// update the instance when the instance is found using findOne
accountSchema.pre('findOne', async function (next) {
    // populate currency, exchange and tag objects
    this.populate('exchange');
    this.populate('currency');
    this.populate('tags');
    this.populate('user');
    this.populate('party');

    next();
});

// populate the result with currency, exchange and tags before find
accountSchema.pre('find', async function (next) {
    this.populate('exchange');
    this.populate('currency');
    this.populate('tags');
    this.populate('party');
    this.populate('user');

    next()
})

const Account = mongoose.model('Account', accountSchema);


module.exports = {
    Account,
    accountSchema
}