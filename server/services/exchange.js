const {Exchange} = require('../models/Exchange');


async function getAll() {
    return await Exchange.find({});
}

const exchangeService = {
    getAll,
}

module.exports = exchangeService;