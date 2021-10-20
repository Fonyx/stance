const mongoose = require('mongoose');

module.exports = assetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['currency', 'coin', 'stock'],
        default: 'currency'
    },
    characterSymbol: {
        type: String,
        required: false
    },
}, {timestamps: true});


export default Asset = mongoose.model('Asset', assetSchema);
