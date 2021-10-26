const mongoose = require('mongoose');

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

const textColors = [
    'black',
    'white'
]

const modifiers = [
    'lighten-5', 
    'lighten-4', 
    'lighten-3', 
    'lighten-2', 
    'lighten-1',
    '',
    'darken-1',
    'darken-2',
    'darken-3',
    'darken-4',
    'accent-1',
    'accent-2',
    'accent-3',
    'accent-4',
]

// https://materializecss.com/waves.html

const waves = [
    'waves-light',
    'waves-red',
    'waves-yellow',
    'waves-orange',
    'waves-purple',
    'waves-green',
    'waves-teal',
]

const ExpenseIcons = [
    'call_received',
    'call_made'
]
  
const FrequencyIcons = [
    'cached',
    'repeat',
    'exposure_plus_1',
    'repeat_one'
]

const FractionIcons = [
    'call_split'
]

const styleSchema = new mongoose.Schema({
    color: {
        type: String,
        enum: colors,
        default: 'red'
    },
    modifier:{
        type: String,
        enum: modifiers,
        default: ''
    },
    textColor:{
        type: String,
        enum: textColors,
        default: 'black'
    },
    icon:{
        type: String,
        required: false
    },
    wave:{
        type: String,
        enum: waves,
        default: "waves-teal"
    }
});

// randomize the color generation of the tags
styleSchema.pre('save', async () => {
    let randomColorIndex = generateRandomIntFromRange(0, colors.length-1);
    let randomModifierIndex = generateRandomIntFromRange(0, modifiers.length-1);
    let materializeText = 'black'
    
    let randomColor = colors[randomColorIndex];
    let randomModifier = modifiers[randomModifierIndex];
    
    this.materialize_color = randomColor;
    this.materialize_modifier = randomModifier;
    
    // if the modifier is darken, set the text to white, otherwise leave it black for lighten and accent
    if(randomModifier[0] === 'd'){
        materializeText = 'white';
    }
    this.materialize_text_color = materializeText;
});

const Style = mongoose.model('Style', styleSchema);

module.exports = {
    Style,
    styleSchema
}