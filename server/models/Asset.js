const mongoose = require('mongoose');
const getCoinValues = require('../api/getCryptoValue');
const Logger = require('../utils/logger');

const assetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['currency', 'coin', 'stock'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    symbol: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        unique: true,
        // // https://stackoverflow.com/questions/7955040/mongodb-mongoose-unique-if-not-null
        sparse: true
    },
    unicode_decimal:{
        type: String,
        required: false
    },
    unicode_hex:{
        type: String,
        required: false
    },
    usdValue: {
        type: Number,
        required: false
    },
    changeP: {
        type: Number,
        required: false
    },
    exchangeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exchange'
    },
}, {timestamps: true});

// index asset table to make it faster
assetSchema.index({market: -1, code: -1})

// update the value of usdValue and changeP in the incoming data for seed save
assetSchema.pre('save', async function (next) {
    // if the asset isn't initialized with a USD value it must be an asset, it would have this if it was a currency
    if(this.type === 'coin'){
        Logger.info('Updating coin value in pre save Hook');
        // lookup the usdValue of the coin
        if (this.code) {
          let coinDetails = await getCoinValues([this.code]);
          // TODO: this should be smarter, using market open is a bit meh
          this.usdValue = coinDetails.open !== 'NA'? parseFloat(coinDetails.open): parseFloat(coinDetails.previousClose);
          this.changeP = coinDetails.change_p !== 'NA'? parseFloat(coinDetails.change_p): null;
        } else {
            throw new Error(`Can't collect crypto value since instance has no code: ${this}`)
        }
    } else if (this.type === 'stock'){
        // Logger.info('Updating stock value in pre save Hook')
        this.usdValue = 1
    }
    next();
});

// update the instance when the instance is found using findOne
assetSchema.post('findOne', async function (next) {
    // if the asset isn't initialized with a USD value it must be an asset, it would have this if it was a currency
    if(this.type === 'coin'){
        Logger.info('Updating coin value in post findOne Hook');
        // lookup the usdValue of the coin
        if (this.code) {
          let coinDetails = await getCoinValues([this.code]);
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

const Asset = mongoose.model('Asset', assetSchema);

module.exports = {
    Asset,
    assetSchema
}
