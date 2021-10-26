const mongoose = require('mongoose');
const {generateRandomIntFromRange} = require('../helpers/numerics');

const colors = [
    'red', 
    'pink', 
    'purple', 
    'deep-purple', 
    'indigo',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown',
    'grey',
]

const modifiers = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900
]

const styleSchema = new mongoose.Schema({
    color: {
        type: String,
        enum: colors,
        default: 'red'
    },
    modifier:{
        type: Number,
        enum: modifiers,
        default: 400
    }
});

// randomize the color generation of the tags
styleSchema.pre('save', async () => {
    let randomColorIndex = generateRandomIntFromRange(0, colors.length-1);
    let randomModifierIndex = generateRandomIntFromRange(0, modifiers.length-1);
    
    this.color = colors[randomColorIndex];
    this.modifier = modifiers[randomModifierIndex];
    
});

const Style = mongoose.model('Style', styleSchema);

module.exports = {
    Style,
    styleSchema
}