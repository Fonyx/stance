const { AuthenticationError } = require('apollo-server-express');
const { User, Account, Currency, Transaction, Party, Exchange } = require('../models');
const { tagSvc, accountSvc, transactionSvc} = require('../services')
const { signToken } = require('../utils/auth');
const Logger = require('../utils/logger');

const rootResolver = {
    Query:{
        allAccounts: async () => {
            return await Account.find({});
        },
        allCurrencies: async () => {
            return await Currency.find({});
        },
        allExchanges: async () => {
            return await Exchange.find({});
        },
        allParties: async () => {
            return await Party.find({});
        },
        allTransactions: async () => {
            return await Transaction.find({});
        },
        user: async (_, { username }) => {
            return await User.findOne({ username }).populate('thoughts');
        },
        users: async () => {
            return await User.find({});
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
        userAccountTransactions: async (_, { user, accountId }) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }
            let accountTransactions = await transactionSvc.findByAccountId(accountId);
            return accountTransactions;
        }
    },
    Mutation:{
        signUp: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        signIn: async (_, { email, password }) => {
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
            let account = await accountSvc.createFromRich({...input});
            if(account){
                let populatedAccount = await accountSvc.populateEntireAccount(account);
                return populatedAccount;
            } else {
                Logger.error('Did you forget to put in the Object Ids for the user, exchange, currency and party')
            }
        },
        createTransaction: async (_, {input}, {user}) => {
            if(!user){
                throw new AuthenticationError('This action requires authentication, please log in')
            }
            let transaction = await transactionSvc.createFromReferences({...input});
            // let transactions = await transactionSvc.findSeries();
            let populatedTransaction = await transactionSvc.populateAll(transaction);
            return populatedTransaction;
        }
    },
}

module.exports = rootResolver;