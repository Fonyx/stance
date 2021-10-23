const { Tag, User } = require('../models');
const tagSeeds = require('./seeds/tagSeeds.json');
const userSeeds = require('./seeds/userSeeds.json');
const Logger = require('../utils/logger');

async function seedParties(){

    var tags = [];

    try {
        // purge all auto generated parties, leave user generated parties
        Logger.info('Purging automatically seeded parties');

        // get first username from user seeds and add the tags to it (fonyx)
        let fonyxObj = await User.findOne({
            username: userSeeds[0].username
        });

        await Tag.deleteMany({
            userId: fonyxObj.id
        });

        for (const tag of tagSeeds){
            tags.push(await Tag.create({
                ...tag,
                userId: fonyxObj.id
            }));
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    Logger.info(`Seeded ${tags.length} Tags`);
}

module.exports = seedParties;
