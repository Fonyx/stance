const { User } = require('../models');
const userSeeds = require('./seeds/userSeeds.json');
const Logger = require('../utils/logger');

async function seedUsers(){
    try {
        await User.deleteMany({});
        let users = await User.create(userSeeds);
        Logger.info(`Created ${users.length} users`)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = seedUsers;
