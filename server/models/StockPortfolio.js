const mongoose = require('mongoose');
const {goalSchema} = require('Meta');

const stockPortfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    goal: goalSchema,
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
}, {timestamps: true});



const StockPortfolio = mongoose.model('StockPortfolio', stockPortfolioSchema);


module.exports = {
    StockPortfolio,
    stockPortfolioSchema
}