const { ApolloServer } = require('apollo-server-express');
const Logger = require('./utils/logger');
const app = require('./app');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

// configure apollo server to use authMiddleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
// serve the app through the apollo server
server.applyMiddleware({ app });

app.listen(app.PORT, () => {
  Logger.info(`front endpoint at http://localhost:${app.PORT}`);
  Logger.info(`GraphQL api endpoint at http://localhost:${app.PORT}${server.graphqlPath}`);
});

