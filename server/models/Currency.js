const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    usdValue:{
        type: Number,
        required: true
    },
    symbol:{
        type: String,
        required: false
    },
    unicode_decimal:{
        type: String,
        required: true
    },
    unicode_hex:{
        type: String,
        required: true
    }
}, {timestamps: true});


const Currency = mongoose.model('Currency', currencySchema);

module.exports = {
    Currency
}