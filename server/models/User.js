const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {goalSchema} = require('./Goal');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true,
        lowercase: true, 
        required: [true, "can't be blank"], 
        match: [/^[a-zA-Z0-9 -.]+$/, 'is invalid'], 
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
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
        required: true
    },
    goal: {
        type: goalSchema,
        default: () => ({})
    },
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  
    next();
});

userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    userSchema
}