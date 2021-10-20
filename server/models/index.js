const schemas = require('./schemas');
const mongoose = require('mongoose');

const User = mongoose.model('User', schemas.userSchema);
const Transaction = mongoose.model('Transaction', schemas.transactionSchema);
const Account = mongoose.model('Account', schemas.accountSchema);
const Collection = mongoose.model('Collection', schemas.collectionSchema);
const Asset = mongoose.model('Asset', schemas.assetSchema);

const Style = mongoose.model('Style', schemas.styleSchema);
const Goal = mongoose.model('Goal', schemas.goalSchema);
const Tag = mongoose.model('Tag', schemas.tagSchema);
const Bank = mongoose.model('Bank', schemas.bankSchema);
const Wallet = mongoose.model('Wallet', schemas.walletSchema);
const Portfolio = mongoose.model('Portfolio', schemas.portfolioSchema);
const Ticker = mongoose.model('Ticker', schemas.tickerSchema);

const models = {
    User,
    Transaction,
    Account,
    Collection,
    Asset,
    Style,
    Goal,
    Tag,
    Bank,
    Wallet,
    Portfolio,
    Ticker
}

module.exports = models