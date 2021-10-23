const mongoose = require('mongoose');
const {styleSchema} = require('./Style');
const {goalSchema} = require('./Goal');
const {Currency} = require('./Currency');
const getAssetValue = require('../api/getAssetValue');
const Logger = require('../utils/logger');

const accountSchema = new mongoose.Schema({
    user: {
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
    unitPrice: {
        type: Number,
        required: false
    },
    changeP: {
        type: Number,
        required: false
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
accountSchema.index({user: 1, type: 1, name: 1, assetCode: 1}, {unique: true})

// update the value of usdValue and changeP in the incoming data for seed save
accountSchema.pre('save', async function (next) {
    // https://stackoverflow.com/questions/30987054/populate-in-post-hook-middlewhere-for-find-in-mongoose
    // populate currency, exchange and tag objects
    this.populate('exchange');
    this.populate('currency');
    this.populate('tags');

    if(this.type === 'crypto' || this.type === 'stock'){
        Logger.info('Updating account unitValue in pre save Hook');
        // lookup the usdValue of the coin
        if (this.assetCode) {
          let coinDetails = await getAssetValue(this.assetCode, this.exchange.code);
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
        if (this.assetCode) {
            let coinDetails = await getAssetValue(this.assetCode, this.exchange.code);
            // TODO: this should be smarter, using market open is a bit meh
            this.unitPrice = coinDetails.open !== 'NA'? parseFloat(coinDetails.open): parseFloat(coinDetails.previousClose);
            this.changeP = coinDetails.change_p !== 'NA'? parseFloat(coinDetails.change_p): null;
        } else {
            throw new Error(`Can't collect crypto value since ${this.name} has no code`)
        }
    } else if (this.type === 'stock'){
        Logger.info('Updating stock value in post findOne Hook')
        this.usdValue = 1
    }
    next();
});

/**
 * export account balance in requested currency
 * @param {str} code Currency Code - defaults to AUD
 * @return {Float} accountValue in requested currency
 *  */ 
accountSchema.methods.getValueInCurrency = async function(code="AUD"){
    let targetCurrency = await Currency.findOne({
        code: code
    });
    if(!targetCurrency){
        throw new Error(`No currency found for code: ${code}`);
    } else {
        this.populate('Currency');
        let value = this.currency.usdValue * this.balance / targetCurrency.usdValue;
        return value
    }
}

const Account = mongoose.model('Account', accountSchema);


module.exports = {
    Account,
    accountSchema
}