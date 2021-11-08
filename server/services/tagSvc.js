const { Tag } = require('../models');
const Logger = require('../utils/logger');

const {getRandomCssColor, getRandomCssShade} = require('../utils/styles');


/**
 * Create or find a tag for a given name and user, operates a findOneAndUpdate
 * @param {str} name string
 * @param {models.User} user instance
 * @returns models.Tag instance
 */
async function upsertFromSeed(name, user){
    let color = getRandomCssColor();
    let shade = getRandomCssShade();

    let foundTag;

    foundTag = await Tag.findOne({
        //  find this
        name,
        user: user.id
    });

    if(foundTag){
        Logger.info(`Found tag ${foundTag.name} with color: ${foundTag.style.color}`)
    } else {
        foundTag = await Tag.create({
            // update it with these values
            name,
            user: user.id,
            style: {
                color: color,
                shade: shade
            }
        })
        Logger.info(`Created tag ${foundTag.name} with color: ${foundTag.style.color}`)
    }

    return foundTag;
};

const tagSvc = {
    upsertFromSeed
}

module.exports = tagSvc