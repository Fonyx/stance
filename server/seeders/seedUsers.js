const { User } = require('../models');
const userSeeds = require('./seeds/userSeeds.json');
const Logger = require('../utils/logger');
const userSvc = require('../services/userSvc');

async function seedUsers(){
    try {
        await User.deleteMany({});
        for(let {username, email, password, currencyCode} of userSeeds){
            userSvc.signUpFromSeed(username, email, password, currencyCode);
        }
        Logger.info(`Created ${userSeeds.length} users`)
    } catch (err) {
        console.error(err);
    }
}

module.exports = seedUsers;
