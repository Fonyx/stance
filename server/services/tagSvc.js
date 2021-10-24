const { Tag } = require('../models');
const Logger = require('../utils/logger');


/**
 * Create or find a tag for a given name and user, operates a findOneAndUpdate
 * @param {str} name string
 * @param {models.User} user instance
 * @returns models.Tag instance
 */
async function createFromSeed(name, user){
    return await Tag.findOneAndUpdate(
        {
            //  find this
            name,
            user: user.id
        }, {
            // update it with the same values
            name,
            user: user.id
        },{
            // allow upsert, new, and runvalidators so it is a proper create
            upsert: true, 
            new: true, 
            runValidators: true
        }, (err, doc) => {
            if(err){
                Logger.error(err)
            } else {
                Logger.info(`created tag ${doc.name}`)
            }
        }
    )
};

const tagSvc = {
    createFromSeed
}

module.exports = tagSvc