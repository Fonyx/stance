const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['currency', 'coin', 'stock'],
        default: 'currency'
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    userGenerated:{
        type: Boolean,
        required: true,
    },
    symbol: {
        type: String,
        required: false,
        default: "$"
    },
    code: {
        type: String,
        unique: true,
        // https://stackoverflow.com/questions/7955040/mongodb-mongoose-unique-if-not-null
        sparse: true
    },
    usdValue: {
        type: Number,
        required: true,
        default: 0.72
    },
    marketName: {
        type: String,
        required: false,
        default: "CC"
    },
}, {timestamps: true});

assetSchema.pre('save', async function (next) {
    // if the asset isn't initialized with a USD value it must be an asset, it would have this if it was a currency
    if(!this.usdValue){
        // lookup the usdValue of the asset
        if (this.code) {
          this.usdValue = 500;
        } else {
            this.usdValue = 250;
        }
    }
  
    next();
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = {
    Asset,
    assetSchema
}
