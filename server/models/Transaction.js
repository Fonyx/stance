const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    style: styleSchema,
    tags: [tagSchema]
}, {timestamps: true});


const Transaction = mongoose.model('Transaction', schemas.transactionSchema);


module.exports = {
    Transaction,
    transactionSchema
}