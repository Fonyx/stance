const {User} = require('./User');
const {Transaction} = require('./Transaction');
const {Account} = require('./Account');
const {Asset} = require('./Asset');
const {Currency} = require('./Currency');
const {Bank} = require('./Bank');
const {Portfolio} = require('./StockPortfolio');
const {Exchange} = require('./Exchange');
const {Wallet} = require('./Wallet');
const {Style, Goal, Tag} = require('./Meta');

const models = {
    Account,
    Asset,
    Bank,
    Currency,
    Exchange,
    Goal,
    Portfolio,
    User,
    Style,
    Transaction,
    Tag,
    Wallet,
}

module.exports = models