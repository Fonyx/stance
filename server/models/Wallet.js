const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    website: {
        type: String,
        required: false,
    },
    icon: {
        type: String,
        required: false,
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

const Wallet = mongoose.model('Wallet', walletSchema);


module.exports = {
    Wallet,
    walletSchema
}