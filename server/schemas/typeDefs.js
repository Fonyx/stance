const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Account {
    _id: ID!
    user: String
    name: String!
    type: String!
    balance: Float!
    interestRate: Float
    compounds: String
    party: Party
    assetCode: String
    unitPrice: Float
    changeP: Float
    currency: Currency
    exchange: String
    style: Style
    goal: Goal
    tags: [Tag]
  }

  type Asset {
    _id: ID!
    type: String
    name: String
    userId: String
    symbol: String
    code: String
    usdValue: Float
    marketName: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Currency {
    name: String!
    code: String!
    usdValue: Float!
    symbol: String
    unicode_decimal: String
    unicode_hex: String
  }
  
  type Goal{
    _id: ID
    amount: Float
    date: String
    priority: Int
  }

  type Party {
    name: String!
    type: String!
    user: User
    description: String!
    website: String
    logo: String
    style: Style
  }

  type Portfolio {
    _id: ID!
    name: String!
    userId: String!
    description: String
    goal: Goal
    tags: [Tag!]
  }

  type Style {
    color: String
    modifier: String
    textColor: String
    icon: String
    wave: String
  }
  
  type Tag{
    _id: ID
    name: String
    style: Style
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
  }
  
  type Query {
    accounts: [Asset]!
    me: User
    user(username: String!): User
    users: [User]
    userAcc: [Account]!
    currencies: [Currency]!
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateTags(name: String!): Tag!
  }
`;

module.exports = typeDefs;
