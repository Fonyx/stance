const mongoose = require('mongoose');

const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo','blue','light-blue','cyan','teal','green','light-green','lime','yellow','amber','orange','deep-orange','brown','grey'];

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

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