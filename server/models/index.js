const {User} = require('./User');
const {Transaction} = require('./Transaction');
const {Account} = require('./Account');
const {Currency} = require('./Currency');
const {Exchange} = require('./Exchange');
const {Style} = require('./Style');
const {Goal} = require('./Goal');
const {Tag} = require('./Tag');
const {Party} = require('./Party');

const models = {
    Account,
    Party,
    Currency,
    Exchange,
    Goal,
    User,
    Style,
    Transaction,
    Tag,
}

module.exports = models