const { User, Currency } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const Logger = require('../utils/logger');
const { signToken } = require('../utils/auth');

/**
 * Sign up a new user, relate currencyCode to currency object before create
 * @param {args} resolver args that contain username, email, password, currencyCode
 * @returns 
 */
async function signUpFromFE(username, email, password, currencyCode){

    let currency = await Currency.findOne({
        code: currencyCode
    })

    const user = await User.create({ username, email, password, currency });
    const token = signToken(user);
    return { token, user };

}

/**
 * Sign up a new user from a seed, relate currencyCode to currency object before create, in case seeds need to be different structure
 * @param {args} resolver args that contain username, email, password, currencyCode
 * @returns 
 */
 async function signUpFromSeed(username, email, password, currencyCode){

    let currency = await Currency.findOne({
        code: currencyCode
    })

    const user = await User.create({ username, email, password, currency });
    const token = signToken(user);
    return { token, user };

}

/**
 * Sign in using email and password
 * @param {args} resolver args containing email and password fields
 */
async function signInFromFE(email, password){

    const user = await User.findOne({ email });
        
    if(!user){
        throw new AuthenticationError('This action requires authentication, please log in')
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
    }

    const token = signToken(user);

    Logger.info(`User ${user.username} successfully logged in`)

    return { token, user };
}


const userSvc = {
    signUpFromFE,
    signUpFromSeed,
    signInFromFE
}

module.exports = userSvc