const mongoose = require('mongoose');


const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userGenerated: {
        type: Boolean,
        required: true,
        default: true
    },
    description: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false,
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