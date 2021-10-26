const { Tag } = require('../models');
const Logger = require('../utils/logger');
const {generateRandomIntFromRange} = require('../utils/numerics');

const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo','blue','light-blue','cyan','teal','green','light-green','lime','yellow','amber','orange','deep-orange','brown','grey'];

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * helper to generate a random color for the tag style
 */
function getRandomCssColor() {
    let randomIndex = generateRandomIntFromRange(0, colors.length-1);
    return colors[randomIndex];
};

// helper to generate random shade for the tag style
function getRandomCssShade(){
    let randomIndex = generateRandomIntFromRange(0, shades.length-1);
    return shades[randomIndex];
}

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