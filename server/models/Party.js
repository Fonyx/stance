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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
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

partySchema.index({name: 1, type: 1}, {unique: true});

const Party = mongoose.model('Party', partySchema);

module.exports = {
    Party
}