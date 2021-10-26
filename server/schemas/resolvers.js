const { AuthenticationError } = require('apollo-server-express');
const { User, Account, Currency, Transaction } = require('../models');
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
        },
        allTransactions: async () => {
            return await Transaction.find({});
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
        updateTags: async (_, {names}, {user}) => {
            if(!user){
                throw new AuthenticationError('This action requires authentication, please log in')
            }
            Logger.info(names);

            let tags = [];

            for(let i=0; i < names.length; i++){
                let tag = await tagSvc.upsertFromSeed(names[i], user);
                tags.push(tag);
            }

            return tags;
        },
        createAccount: async (_, {input}, {user}) => {
            if(!user){
                throw new AuthenticationError('This action requires authentication, please log in')
            }
            console.log(input);
            let newAccount = await accountSvc.createFromRich({...input});
            return newAccount;
        }
    },
}

module.exports = rootResolver;