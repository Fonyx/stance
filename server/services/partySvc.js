const { Party } = require('../models');
const Logger = require('../utils/logger');

/**
 * Returns an accepted style color and shader depending on seed type
 * @param {str} type [bank, broker, wallet]
 */
function getStyleForType(type){
    let result = {
        color: '',
        shade: 0
    }

    switch (type){
        case 'bank':{
            result.color = 'blue';
            result.shade = 600;
            break
        }
        case 'broker':{
            result.color = 'green';
            result.shade = 500;
            break
        }
        case 'wallet':{
            result.color = 'deep-orange';
            result.shade = 300;
            break
        }
        default:{
            throw new Error(`Received party seed of non standard type: ${type}`)
        }
    }

    return result;
}

/**
 * Create or find a tag for a given name and user, operates a findOneAndUpdate
 * @param {str} name string
 * @param {models.User} user instance
 * @returns models.Tag instance
 */
async function createFromSeed(args){
    let style = getStyleForType(args.type)
    let party = await Party.create({...args, style});
    return party
}

/**
 * Function for clearing all automatically generated party seeds from database, where userId is null
 */
async function clear(){
    Logger.info('Purging automatically seeded parties that don\'t have a userId (manually created)')
    await Party.deleteMany({
        user: null
    })
}

const partySVC = {
    createFromSeed,
    clear
}

module.exports = partySVC