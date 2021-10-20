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
        required: true,
        default: "wave-teal"
    }
}, {timestamps: true});


const tagSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.Schema.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
        default: 'auto tag'
    },
    style: {
        type: styleSchema,
        default: () => ({})
    }
}, {timestamps: true});

// a combined index for unique accounts for user by name
tagSchema.index({userId: 1, name: 1}, {unique: true})


const goalSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
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


const Style = mongoose.model('Style', styleSchema);
const Tag = mongoose.model('Tag', tagSchema);
const Goal = mongoose.model('Goal', goalSchema);

module.exports = {
    Style,
    styleSchema,
    Tag,
    tagSchema,
    Goal,
    goalSchema,
}