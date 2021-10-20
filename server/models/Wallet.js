const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    userGenerated: {
        type: Boolean,
        required: true,
        default: true
    },
    website: {
        type: String,
        required: false,
    }
}, {timestamps: true});

const Wallet = mongoose.model('Wallet', walletSchema);


module.exports = {
    Wallet,
    walletSchema
}