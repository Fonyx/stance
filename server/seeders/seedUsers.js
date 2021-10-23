const { User } = require('../models');
const userSeeds = require('./seeds/userSeeds.json');
const Logger = require('../utils/logger');

async function seedUsers(){
    try {
        await User.deleteMany({});
        let user = await User.create(userSeeds);
        Logger.info(`Created user: ${user.username}`)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    Logger.info(`Seeded Users`);
}

module.exports = seedUsers;
