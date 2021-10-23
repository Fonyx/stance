const { Party } = require('../models');
const partySeeds = require('./seeds/partySeeds.json');
const Logger = require('../utils/logger');

async function seedParties(){
    try {
        // purge all auto generated parties, leave user generated parties
        Logger.info('Purging automatically seeded parties')
        await Party.deleteMany({
            userId: null
        });
        let partyObj = await Party.create(partySeeds);
        Logger.info(`Created party: ${partyObj.name}`)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    Logger.info(`Seeded Parties`);
}

module.exports = seedParties;
