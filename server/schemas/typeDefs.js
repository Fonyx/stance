const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Auth {
    token: ID!
    user: User
  }

  type Account {
    _id: ID!
    user: User!
    name: String!
    type: String!
    balance: Float!
    openingBalance: Float!
    interestRate: Float
    compounds: String
    party: Party
    assetCode: String
    unitPrice: Float
    changeP: Float
    currency: Currency!
    exchange: Exchange!
    style: Style!
    goal: Goal
    tags: [Tag]
  }

  input accountInput {
    user: String!
    name: String!
    type: String!
    openingBalance: Float!
    interestRate: Float
    compounds: String
    party: String!
    assetCode: String
    currency: String!
    exchange: String!
  }
  

  type Currency {
    _id: ID!
    name: String!
    code: String!
    usdValue: Float!
    symbol: String
    unicode_decimal: String
    unicode_hex: String
  }

  type Exchange {
    _id: ID!
    name: String!
    code: String!
    mic: String
    country: String!
    currency: String
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

  type Style {
    color: String
    shade: Int
  }
  
  type Tag{
    _id: ID
    name: String
    style: Style
  }

  type Transaction{
    _id: ID!
    fromAccount: Account
    toAccount: Account
    description: String!
    date: String!
    amount: Float
    factor: Float
    frequency: String!
  }

  input transactionInput{
    fromAccount: String
    toAccount: String
    description: String!
    date: String!
    amount: Float
    factor: Float
    frequency: String!
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
  }
  
  type Query {
    allAccounts: [Account]!
    allCurrencies: [Currency]!
    allExchanges: [Exchange]!
    allParties: [Party]!
    allTransactions: [Transaction]!
    user(username: String!): User
    users: [User]
    userAcc: [Account]!
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateTags(names: [String]!): [Tag]!
    createAccount(input: accountInput!): Account!
    createTransaction(input: transactionInput!): Transaction!
  }
`;

module.exports = typeDefs;
