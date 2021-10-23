const mongoose = require('mongoose');
const {styleSchema} = require('./Style');

const partySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['bank', 'wallet', 'broker'],
        required: true
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
    style: {
        type: styleSchema,
        default: () => ({})
    }
}, {timestamps: true});

const Party = mongoose.model('Party', partySchema);

module.exports = {
    Party
}