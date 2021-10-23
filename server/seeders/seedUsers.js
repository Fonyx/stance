const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
const Logger = require('../utils/logger');

async function seedUsers(){
    try {
        await User.deleteMany({});
        await User.create(userSeeds);
        Logger.info(`Created user: ${User.username}`)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    Logger.info(`Seeded Users`);
}

module.exports = seedUsers;
