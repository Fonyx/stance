const { User } = require('../models');
const userSeeds = require('./userSeeds.json');

async function seedUsers(){
    try {
        await User.deleteMany({});
        await User.create(userSeeds);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = seedUsers;
