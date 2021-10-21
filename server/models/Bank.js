const mongoose = require('mongoose');


const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false,
        unique: true
    },
    logo: {
        type: String,
        required: false
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
}, {timestamps: true});

const Bank = mongoose.model('Bank', bankSchema);


module.exports = {
    Bank,
    bankSchema
}