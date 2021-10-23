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

const Style = mongoose.model('Style', styleSchema);

module.exports = {
    Style,
    styleSchema
}