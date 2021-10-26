const mongoose = require('mongoose');
const {colors, shades} = require('../utils/styles');

const styleSchema = new mongoose.Schema({
    color: {
        type: String,
        enum: colors,
        default: 'red'
    },
    shade:{
        type: Number,
        enum: shades,
        default: 400
    }
});



const Style = mongoose.model('Style', styleSchema);

module.exports = {
    Style,
    styleSchema
}