const { AuthenticationError } = require('apollo-server-express');
const { User, Asset } = require('../models');
const { signToken } = require('../utils/auth');

const rootResolver = {
    Query:{
        user: async (_, { username }) => {
            return await User.findOne({ username }).populate('thoughts');
        },
        users: async () => {
            return await User.find({});
        },
        assets: async () => {
            return await Asset.find({});
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
        createWallet: async (_, args) => {
            console.log(args);
        },
        createPortfolio: async (_, args) => {
            console.log(args)
        }
}

module.exports = rootResolver;