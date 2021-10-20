const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    style: styleSchema,
    goals: [goalSchema],
    tags: [tagSchema]
}, {timestamps: true});

const Account = mongoose.model('Account', accountSchema);


module.exports = {
    Account,
    accountSchema
}