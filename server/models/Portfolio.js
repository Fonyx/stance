const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
}, {timestamps: true});

const Portfolio = mongoose.model('Portfolio', portfolioSchema)


module.exports = {
    Portfolio,
    portfolioSchema
}