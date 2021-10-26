// const { Party } = require('../models');
const { partySvc } = require('../services');
const partySeeds = require('./seeds/partySeeds.json');
const Logger = require('../utils/logger');

async function seedParties(){
    try {
        // purge all auto generated parties, leave user generated parties
        await partySvc.clear();

        let seededParties = [];
        Logger.info(`Number of parties in seeds file: ${partySeeds.length}`)

        for(let i =0; i < partySeeds.length; i++){
            let party = await partySvc.createFromSeed(partySeeds[i]);
            seededParties.push(party);
        }
        Logger.info(`Created ${seededParties.length} parties`)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = seedParties;
