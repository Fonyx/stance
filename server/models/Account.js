const mongoose = require('mongoose');
const {styleSchema} = require('./Style');
const {goalSchema} = require('./Goal');
const getAssetValue = require('../api/getAssetValue');

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
    },
    compounds: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: ['monthly']
    },
    stockPortfolioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stockPortfolio'
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    bankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank'
    },
    assetCode: {
        type: String,
        unique: true,
        // // https://stackoverflow.com/questions/7955040/mongodb-mongoose-unique-if-not-null
        sparse: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    changeP: {
        type: Number,
        required: false
    },
    currencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },
    exchangeId: {
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
accountSchema.index({userId: 1, type: 1, name: 1}, {unique: true})

// update the value of usdValue and changeP in the incoming data for seed save
accountSchema.pre('save', async function (next) {
    // https://stackoverflow.com/questions/30987054/populate-in-post-hook-middlewhere-for-find-in-mongoose
    // populate currency, exchange and tag objects
    this.populate('exchange');
    this.populate('currency');
    this.populate('tags');

    if(this.type === 'crypto' || this.type === 'stock'){
        Logger.info('Updating asset value in pre save Hook');
        // lookup the usdValue of the coin
        if (this.code) {
          let coinDetails = await getAssetValue(this.code, this.exchange.code);
          this.unitPrice = coinDetails.open !== 'NA'? parseFloat(coinDetails.open): parseFloat(coinDetails.previousClose);
          this.changeP = coinDetails.change_p !== 'NA'? parseFloat(coinDetails.change_p): null;
        } else {
            throw new Error(`Can't collect crypto value since ${this.name} has no code`)
        }
    } else if (this.type === 'stock'){
        Logger.info('Updating stock value in pre save Hook')
        this.usdValue = 1
    }
    next();
});

// update the instance when the instance is found using findOne
accountSchema.pre('findOne', async function (next) {
    // populate currency, exchange and tag objects
    this.populate('exchange');
    this.populate('currency');
    this.populate('tags');

    if(this.type === 'crypto' || this.type === 'stock'){
        Logger.info('Updating coin value in post findOne Hook');
        // lookup the usdValue of the coin
        if (this.code) {
            let coinDetails = await getAssetValue(this.code, this.exchange.code);
            // TODO: this should be smarter, using market open is a bit meh
            this.usdValue = coinDetails.open !== 'NA'? parseFloat(coinDetails.open): parseFloat(coinDetails.previousClose);
            this.changeP = coinDetails.change_p !== 'NA'? parseFloat(coinDetails.change_p): null;
        } else {
            throw new Error(`Can"t collect crypto value since instance has no code: ${this}`)
        }
    } else if (this.type === 'stock'){
        Logger.info('Updating stock value in post findOne Hook')
        this.usdValue = 1
    }
    next();
});

const Account = mongoose.model('Account', accountSchema);


module.exports = {
    Account,
    accountSchema
}