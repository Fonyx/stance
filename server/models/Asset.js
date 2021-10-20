const mongoose = require('mongoose');
const {styleSchema} = require('Meta');

const assetSchema = new mongoose.Schema({

    style: styleSchema
}, {timestamps: true});

userSchema.pre('save', async function (next) {
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
