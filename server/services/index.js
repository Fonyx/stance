const accountSvc = require('./accountSvc');
const transactionSvc = require('./transactionSvc');
const partySvc = require('./partySvc');
const tagSvc = require('./tagSvc');

const services = {
    accountSvc,
    tagSvc,
    transactionSvc,
    partySvc
}

module.exports = services