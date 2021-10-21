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
        default: "AUD",
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
        required: false,
        default: "AUD-USD",
        unique: true
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
    // lookup the usdValue of the asset
    if (this.code) {
      this.usdValue = 500;
    } else {
        this.usdValue = 250;
    }
  
    next();
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = {
    Asset,
    assetSchema
}
