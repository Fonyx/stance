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
    online: {
        type: Boolean,
        default: true,
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
    },
    icon: {
        type: String,
        required: false,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
}, {timestamps: true});

const Wallet = mongoose.model('Wallet', walletSchema);


module.exports = {
    Wallet,
    walletSchema
}