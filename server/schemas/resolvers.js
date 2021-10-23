const { AuthenticationError } = require('apollo-server-express');
const { User, Account } = require('../models');
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
            let valueInEur = await accounts[0].getValueInCurrency('EUR');
            Logger.warn(`Euro value of account: ${accounts[0].name} is: ${valueInEur}`)
            return accounts;
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
        
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
        
            const correctPw = await user.isCorrectPassword(password);
        
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
        
            const token = signToken(user);
        
            return { token, user };
            },
    },
}

module.exports = rootResolver;