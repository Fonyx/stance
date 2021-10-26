// a function that returns a random int inclusively between min and max
function generateRandomIntFromRange(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
    generateRandomIntFromRange
}