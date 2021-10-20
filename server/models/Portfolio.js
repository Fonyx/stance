const mongoose = require('mongoose');
const {goalSchema} = require('Meta');

const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    goal: goalSchema,
}, {timestamps: true});


const Portfolio = mongoose.model('Portfolio', portfolioSchema)


module.exports = {
    Portfolio,
    portfolioSchema
}