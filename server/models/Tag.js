const mongoose = require('mongoose');
const {styleSchema} = require('./Style');
const {goalSchema} = require('./Goal');

const tagSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
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
    },
    goal:{
        type: goalSchema,
        default: () => ({})
    }
});

// a combined index for unique accounts for user by name
tagSchema.index({userId: 1, name: 1}, {unique: true})

const Tag = mongoose.model('Tag', tagSchema);

module.exports = {
    Tag
}