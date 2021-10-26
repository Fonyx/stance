const { AuthenticationError } = require('apollo-server-express');
const { User, Account, Currency } = require('../models');
const { tagSvc, accountSvc} = require('../services')
const { signToken } = require('../utils/auth');
const Logger = require('../utils/logger');

const rootResolver = {
    Query:{
        user: async (_, { username }) => {
            return await User.findOne({ username }).populate('thoughts');
        },
        users: async () => {
            return await User.find({});
        },
        accounts: async () => {
            return await Account.find({});
        },
        userAcc: async (_, __, {user}) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }
            let accounts = await Account.find({
                user: user
            });
            return accounts;
        },
        currencies: async () => {
            return await Currency.find({});
        }
    },
    Mutation:{
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
        
            if(!user){
                throw new AuthenticationError('This action requires authentication, please log in')
            }
        
            const correctPw = await user.isCorrectPassword(password);
        
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
        
            const token = signToken(user);
        
            return { token, user };
        },
        updateTags: async (_, {name}, {user}) => {
            if(!user){
                throw new AuthenticationError('This action requires authentication, please log in')
            }
            Logger.info(name);
            let tag = await tagSvc.createFromSeed(name, user);
            return tag;
        }
    },
}

module.exports = rootResolver;