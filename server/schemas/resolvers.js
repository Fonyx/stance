const { AuthenticationError } = require('apollo-server-express');
const { User, Account, Currency, Transaction, Party, Exchange } = require('../models');
const { tagSvc, accountSvc, transactionSvc} = require('../services');
const {getCryptoCoins} = require('../api/getCryptos');
const { signToken } = require('../utils/auth');
const getAssetValue = require('../api/getAssetValue');
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
        userAccounts: async (_, __, {user}) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }
            let accounts = await Account.find({
                user: user
            });
            return accounts;
        },
        userAccountTransactions: async (_, {accountId}, { user }) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }
            // check user has permission for this account
            let account = await Account.findOne({
                "_id": accountId
            });
            await Account.populate(account, {path: "user"});
            if(!account.user.id === user.id){
                throw new AuthenticationError('You do not have permission to view this account');
            }
            let accountTransactions = await transactionSvc.findByAccountId(accountId);
            return accountTransactions;
        },
        getAllPrimitives: async (_, __, {user}) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }
            // get currencies
            let currencies = await Currency.find({});
            // get exchanges
            let exchanges = await Exchange.find({});
            // get parties
            let parties = await Party.find({});
            // get all cryptos from EOD finance
            let cryptos = await getCryptoCoins();

            let primitives = {
                currencies,
                exchanges,
                parties
            }
            return primitives;
        },
        checkStockCode: async (_, {assetCode, exchangeCode}, {user}) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }

            let result;

            // query EOD financial for assetCode and unitPrice
            let assetCheck = await getAssetValue(assetCode, exchangeCode);
            if(assetCheck){
                result = {
                    exists: true,
                    unitPrice: assetCheck.previousClose,
                    name: assetCheck.code
                }
            } else {
                result = {
                    exists: false,
                    unitPrice: null,
                    name: null
                }
            }

            return result
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
            // let populatedTransaction = await transactionSvc.populateAll(transaction);
            return transaction;
        }
    },
}

module.exports = rootResolver;