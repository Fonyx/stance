const {User} = require('./User');
const {Transaction} = require('./Transaction');
const {Account} = require('./Account');
const {Asset} = require('./Asset');
const {Bank} = require('./Bank');
const {Portfolio} = require('./StockPortfolio');
const {Exchange} = require('./Exchange');
const {Wallet} = require('./Wallet');
const {Style, Goal, Tag} = require('./Meta');

const models = {
    User,
    Transaction,
    Account,
    Asset,
    Exchange,
    Style,
    Goal,
    Tag,
    Bank,
    Wallet,
    Portfolio,
}

module.exports = models