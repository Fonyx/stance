const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const db = require('../config/connection');
const runSeed = require('./seed');


async function seed(){
    await runSeed(db);
}

seed();