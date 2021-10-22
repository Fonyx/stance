const mongoose = require('mongoose');


const exchangeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    mic:{
        type: String,
        required: false
    },
    country:{
        type: String,
        required: true
    },
    currency:{
        type: String,
        required: true
    },
    assetIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
    }],
}, {timestamps: true});

const Exchange = mongoose.model('Exchange', exchangeSchema);


module.exports = {
    Exchange,
    exchangeSchema
}