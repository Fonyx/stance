const { Party } = require('../models');
const partySeeds = require('./seeds/partySeeds.json');
const Logger = require('../utils/logger');

async function seedParties(){
    try {
        // purge all auto generated parties, leave user generated parties
        Logger.info('Purging automatically seeded parties')
        await Party.deleteMany({
            user: null
        });
        let parties = await Party.create(partySeeds);
        Logger.info(`Created ${parties.length} parties`)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = seedParties;
