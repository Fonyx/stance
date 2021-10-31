const jwt = require('jsonwebtoken');
const Logger = require('./logger');
const {User} = require('../models/User');

const secret = process.env.JWT_SECRET;
const expiration = '3h';

module.exports = {
  authMiddleware: async function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }
    
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log(`Date decrypted from token: ${data}`)
      let user = await User.findOne({
        "_id": data._id
      });
      Logger.info(`User: ${user.username} sent authorized request`);
      req.user = user;
    } catch (err) {
      Logger.error(err);
    }

    return req;
  },
  signToken: function ({ _id }) {
    const payload = { _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};