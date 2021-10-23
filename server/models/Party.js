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
        sparse: true,
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

partySchema.index({name: 1, type: 1}, {unique: true});

const Party = mongoose.model('Party', partySchema);

module.exports = {
    Party
}