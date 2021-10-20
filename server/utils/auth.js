const jwt = require('jsonwebtoken');
const Logger = require('./logger');

const secret = process.env.JWT_SECRET;
const expiration = '3h';

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.headers.authorization;

    if (token) {
      token = token.split(' ').pop().trim();
    }
    
    if (!token) {
        Logger.error('Token was not found in request header - authorize, auth failed');
        return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};