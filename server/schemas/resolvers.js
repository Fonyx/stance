const { AuthenticationError } = require('apollo-server-express');
const { User, Account, Currency, Transaction, Party, Exchange } = require('../models');
const { tagSvc, accountSvc, transactionSvc} = require('../services');
const getCryptoCoins = require('../api/getCryptos');
const getAssetValue = require('../api/getAssetValue');
const accumulateTransactions = require('../helpers/accumulator');
const Logger = require('../utils/logger');
const {signUpFromFE, signInFromFE} = require('../services/userSvc');

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
        userAccountAndTransactions: async (_, {accountId}, { user }) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }
            // check user has permission for this account
            let account = await Account.findOne({
                "_id": accountId
            });
            if(!account){
                throw new Error('No Account found for that id');
            }
            await Account.populate(account, {path: "user"});
            if(!account.user.id === user.id){
                throw new AuthenticationError('You do not have permission to view this account');
            }
            await accountSvc.updateUnitPriceAndValuation(account);
            let debits = await transactionSvc.findFromAccountByAccountId(accountId);
            let credits = await transactionSvc.findToAccountByAccountId(accountId);

            // populate the users currency object
            await User.populate(user, {path: "currency"});

            // get the valuation of the account in the users preferred currency
            let userCurrValuation = await accountSvc.exportValuation(account, user.currency.code)

            let payload = {
                userCurrValuation,
                account,
                credits,
                debits
            }

            // let plotData = accumulateTransactions(account, credits, debits);

            return payload;
        },
        /**
         * Major grouping of user data, [{accountName: { accountObj, creditTrans, debitTrans, valuation }},...]
         * @returns list of complex objects
         */
        allUserAccountsAndTransactions: async (_, __ , { user }) => {
            if(!user){
                Logger.warn('No User object found from middleware');
                throw new AuthenticationError('Not logged in, please login');
            }
            // check user has permission for this account
            let userAccounts = await Account.find({
                "user": user
            });
            // if user has no accounts, return null
            if(!userAccounts){
                return null
            }

            let accountPayloadList = []; 

            for(let account of userAccounts){

                await Account.populate(account, {path: "user"});
                if(!account.user.id === user.id){
                    throw new AuthenticationError('You do not have permission to view this account');
                }
                await accountSvc.updateUnitPriceAndValuation(account);
                let debits = await transactionSvc.findFromAccountByAccountId(account.id);
                let credits = await transactionSvc.findToAccountByAccountId(account.id);

                // populate the users currency object
                await User.populate(user, {path: "currency"});

                // get the valuation of the account in the users preferred currency
                let userCurrValuation = await accountSvc.exportValuation(account, user.currency.code)

                let payload = {
                    userCurrValuation,
                    account,
                    credits,
                    debits
                }

                accountPayloadList.push(payload);
            }

            return accountPayloadList;
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
                parties,
                cryptos
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
        signUp: async (_, {username, email, password, currencyCode}) => {
            const { token, user } = await signUpFromFE(username, email, password, currencyCode);
            return { token, user };
        },
        signIn: async (_, { email, password }) => {
            const { token, user } = await signInFromFE(email, password)
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
        createAccountFE: async (_, {input}, {user}) => {
            if(!user){
                throw new AuthenticationError('This action requires authentication, please log in')
            }
            let account = await accountSvc.createFromFE({...input, user});
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