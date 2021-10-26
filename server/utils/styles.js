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


module.exports = {
    colors,
    getRandomCssColor,
    shades,
    getRandomCssShade
}