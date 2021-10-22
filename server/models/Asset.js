const mongoose = require('mongoose');
const getCoinValues = require('../api/getCryptoValue');


const assetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['currency', 'coin', 'stock'],
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
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
        // https://stackoverflow.com/questions/7955040/mongodb-mongoose-unique-if-not-null
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
        required: true
    },
    changeP: {
        type: Number,
        required: false
    },
    market: {
        type: String,
        required: false,
    },
}, {timestamps: true});

// a combined index for unique type codes
assetSchema.index({type: 1, code: 1}, {unique: true});

assetSchema.methods.updateUsdValue = function() {
    // if the asset isn't initialized with a USD value it must be an asset, it would have this if it was a currency
    if(this.type === 'coin'){
        // lookup the usdValue of the coin
        if (this.code) {
          let coinDetails = await getCoinValues([this.code]);
          // TODO: this should be smarter, using market open is a bit meh
          this.usdValue = coinDetails.open !== 'NA'? parseFloat(coinDetails.open): parseFloat(coinDetails.previousClose);
          this.changeP = coinDetails.change_p !== 'NA'? parseFloat(coinDetails.change_p): null;
        } else {
            throw new Error(`Can"t collect crypto value since instance has no code: ${this}`)
        }
    }
}
// update the value of the incoming data for seed save
assetSchema.pre('save', async function (next) {
    this.updateUsdValue();
    next();
});

// update the instance when the instance is found using findOne
assetSchema.post('findOne', async function (next) {
    this.updateUsdValue();
    next();
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = {
    Asset,
    assetSchema
}
