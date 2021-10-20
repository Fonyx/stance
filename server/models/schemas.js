const mongoose = require('mongoose');

// https://thinkster.io/tutorials/node-json-api/creating-the-user-model

// https://vegibit.com/mongoose-relationships-tutorial/
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


const currencySchema = new mongoose.Schema({
    code:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    usdValue: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true});


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
    name: {
        type: String,
        required: true,
        default: 'tag'
    },
    style: {
        type: styleSchema,
        default: () => ({})
    }
}, {timestamps: true});


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
    },
    style: {
        type: styleSchema,
        default: () => ({})
    }
}, {timestamps: true});


const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userGenerated: {
        type: Boolean,
        required: true,
        default: true
    },
    description: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false,
    }
}, {timestamps: true});


const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    userGenerated: {
        type: Boolean,
        required: true,
        default: true
    },
    website: {
        type: String,
        required: false,
    }
}, {timestamps: true});


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


const tickerSchema = new mongoose.Schema({
    code: {
        type: String,
        max: 4,
        default: 'AUD'
    },
    market: {
        type: String,
        required: false,
    },
    marketOpen: {
        type: String,
        required: false
    },
    marketClose: {
        type: String,
        required: false
    },
    itemValue: {
        type: Number,
        required: true,
    },
    currency: currencySchema
}, {timestamps: true});


const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true,
        lowercase: true, 
        required: [true, "can't be blank"], 
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
        index: true,
    },
    email: {
        type: String, 
        unique: true,
        lowercase: true, 
        required: [true, "can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true
    },
    password: {
        type: String,
        required: true
    },

}, {timestamps: true});


const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    style: styleSchema,
    tags: [tagSchema]
}, {timestamps: true});


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    style: styleSchema,
    goals: [goalSchema],
    tags: [tagSchema]
}, {timestamps: true});


const collectionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['bank', 'wallet', 'portfolio'],
        default: 'bank'
    },
    goals: [goalSchema],
    tags: [tagSchema],
    style: styleSchema
}, {timestamps: true});


const assetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['currency', 'coin', 'stock'],
        default: 'currency'
    },
    characterSymbol: {
        type: String,
        required: false
    },
    goals: [goalSchema],
    tags: [tagSchema]
}, {timestamps: true});


const schemas = {
    currencySchema,
    userSchema,
    transactionSchema,
    accountSchema,
    collectionSchema,
    assetSchema,
    styleSchema,
    goalSchema,
    tagSchema,
    bankSchema,
    walletSchema,
    portfolioSchema,
    tickerSchema
}

module.exports = schemas;