const mongoose = require('mongoose');
const {goalSchema} = require('./Meta');

const stockPortfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: false
    },
    goal: {
        type: goalSchema,
        default: () => ({})
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
}, {timestamps: true});

// a combined index for unique accounts for user by name
stockPortfolioSchema.index({userId: 1, name: 1}, {unique: true})

const StockPortfolio = mongoose.model('StockPortfolio', stockPortfolioSchema);


module.exports = {
    StockPortfolio,
    stockPortfolioSchema
}