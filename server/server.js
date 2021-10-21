require('dotenv').config();
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const Logger = require('./utils/logger');
const { typeDefs, resolvers } = require('./schemas');
const configuredMorgan = require('./utils/morgan.js');
const { authMiddleware } = require('./utils/auth');
const updateCurrencies = require('./api/updateCurrencies');

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

// setup timeout to update currencies every hour
setTimeout(async () => {
  Logger.info(`Updating currencies`)
  // let currencyData = await updateCurrencies();
  Logger.info(currencyData.slice[0, 10]);
}, 1000*60*60)

db.once('open', () => {
  if(process.env.MONGODB_URI){
    Logger.info(`Connected to mongo atlas fonxyOps STANCE instance`);
  } else {
    Logger.info('Connected to backup mongo at local host')
  }
  app.listen(PORT, () => {
    Logger.info(`GraphQL api endpoint at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
