const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        // default date is one year from today
        default: () => Date.now() + 365*24*60*60*1000
    },
    priority: {
        type: Number,
        required: false,
        default: 5
    }
}, {timestamps: true});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = {
    Goal,
    goalSchema,
}