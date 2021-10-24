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
    await this.updateUnitValue();
    
    next();
});

// update the instance when the instance is found using findOne
accountSchema.pre('findOne', async function (next) {
    // populate currency, exchange and tag objects
    this.populate('exchange');
    this.populate('currency');
    this.populate('tags');
    await this.updateUnitValue();
    next();
});

// populate the result with currency, exchange and tags before find
accountSchema.pre('find', async function (next) {
    this.populate('exchange');
    this.populate('currency');
    this.populate('tags');
    next()
})

// instance method for updating asset value using api query
accountSchema.methods.updateUnitValue = async function(){
    if(this.type === 'crypto' || this.type === 'stock'){
        // lookup the usdValue of the coin
        if (this.assetCode) {
            let data = await getAssetValue(this.assetCode, this.exchange.code);
            if(!data){
                throw new Error(`Failed to get data for assetCode: ${this.assetCode} exchangeCode: ${this.exchange.code} for some reason`);
            }
            // if these is no market open price, use previous close
            this.unitPrice = data.open !=='NA'? data.open: data.previousClose;
            this.changeP = data.change_p !== 'NA'? data.change_p: null;
        } else {
            throw new Error(`Can't collect crypto value since ${this.name} has no code`)
        }
    } else if (this.type === 'money'){
        this.unitPrice = 1
    }
    Logger.info(`Updated account unitPrice in pre save Hook for ${this.name}: to ${this.unitPrice}`);
}

/**
 * export account balance in requested currency
 * @param {str} code Currency Code - defaults to AUD
 * @return {Float} accountValue in requested currency
 *  */ 
accountSchema.methods.getValueInCurrency = async function(code="AUD"){
    let resultValue = 0.00;
    // get target currency object from requested code
    let targetCurrency = await Currency.findOne({
        code: code
    });
    // if none, exit
    if(!targetCurrency){
        throw new Error(`No currency found for code: ${code}`);
    // otherwise populate with currency table
    } else {
        this.populate('Currency');
    }
    // case for asset calculation
    if(this.type !== "money"){
        resultValue = this.currency.usdValue * this.balance / targetCurrency.usdValue;
        // case for direct conversion of currency
    } else {
        resultValue = 1
    }
    return resultValue
}

const Account = mongoose.model('Account', accountSchema);


module.exports = {
    Account,
    accountSchema
}