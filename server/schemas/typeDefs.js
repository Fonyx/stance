const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
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

  type Style {
    color: String
    modifier: String
    textColor: String
    icon: String
    wave: String
  }

  type Goal{
    _id: ID
    amount: Float
    date: String
    priority: Int
  }

  type Tag{
    _id: ID
    name: String
    style: Style
  }

  type Wallet {
    _id: ID!
    name: String!
    userId: String!
    description: String
    online: Boolean
    website: String
    icon: String
    goal: Goal
    tags: [Tag!]
  }

  type Portfolio {
    _id: ID!
    name: String!
    userId: String!
    description: String
    goal: Goal
    tags: [Tag!]
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    assets: [Asset]!
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
