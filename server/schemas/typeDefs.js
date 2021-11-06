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
    assetName: String
    unitPrice: Float
    valuation: Float
    changeP: Float
    currency: Currency!
    exchange: Exchange!
    style: Style!
    goal: Goal
    tags: [Tag]
  }

  type AccountPayload {
    account: Account
    credits: [Transaction]!
    debits: [Transaction]!
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

  input accountInputFE {
    name: String!
    type: String!
    openingBalance: Float!
    interestRate: Float
    compounds: String
    party: String
    assetCode: String
    currency: String
    exchangeCode: String
    goalDate: String
    goalAmount: Float
    tags: String
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

  type Crypto {
    Code: String
    Name: String
    Country: String
    Exchange: String
    Currency: String
    Type: String
    Isin: String
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
    _id: ID!
    amount: Float
    date: String
    priority: Int
  }

  type Party {
    _id: ID!
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
    endRecurrence: String
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    currency: Currency!
  }

  type Primitives {
    currencies: [Currency]!
    exchanges: [Exchange]!
    parties: [Party]!
    cryptos: [Crypto]!
  }

  type StockCheck {
    exists: Boolean
    name: String
    unitPrice: Float
  }
  
  type Query {
    allAccounts: [Account]!
    allCurrencies: [Currency]!
    allExchanges: [Exchange]!
    allParties: [Party]!
    allTransactions: [Transaction]!
    user(username: String!): User
    users: [User]
    userAccounts: [Account]!
    userAccountAndTransactions(accountId: String!): AccountPayload
    getAllPrimitives: Primitives!
    checkStockCode(assetCode: String!, exchangeCode: String!): StockCheck
    getCryptos: [Crypto]!
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!, currencyCode: String!): Auth
    signIn(email: String!, password: String!): Auth
    updateTags(names: [String]!): [Tag]!
    createAccount(input: accountInput!): Account!
    createAccountFE(input: accountInputFE!): Account!
    createTransaction(input: transactionInput!): Transaction!
  }
`;

module.exports = typeDefs;
