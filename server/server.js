const app = require('./app');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const Logger = require('./utils/logger');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// configure apollo server to use authMiddleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
// serve the app through the apollo server
server.applyMiddleware({ app });


db.once('open', () => {
  if(process.env.MONGODB_URI){
    Logger.info(`Connected to mongo atlas fonxyOps STANCE instance`);
  } else {
    Logger.info('Connected to backup mongo at local host')
  }
  app.listen(app.PORT, () => {
    Logger.info(`GraphQL api endpoint at http://localhost:${app.PORT}${server.graphqlPath}`);
  });
});
