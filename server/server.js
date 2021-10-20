const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const Logger = require('./utils/logger');
const { typeDefs, resolvers } = require('./schemas');
const configuredMorgan = require('./utils/morgan.js');
const { authMiddleware } = require('./utils/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

// use custom colour server logging as middleware
app.use(configuredMorgan);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve client/build as static assets for production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// serve the index.html file from the client build for any end point url
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  Logger.info(`Connected to mongo`);
  app.listen(PORT, () => {
    Logger.info(`GraphQL api endpoint at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
