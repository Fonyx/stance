const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const mongoose = require('mongoose');
const Logger = require('../utils/logger');
const updateCurrencies = require('../helpers/updateCurrencies');
const seedUsers = require('./seedUsers');
const seedExchanges = require('./seedExchanges');
const seedParties = require('./seedParties');
const connectTo = require('../config/connectTo');

// get api key for currency updates from env file
var RapidApiKey = process.env.RAPID_API_KEY;
var testURI = process.env.MONGODB_TEST_URI

if(!RapidApiKey){
  throw new Error('Failed to collect environment variable for rapid api key to update currencies')
}

async function seedTest(){
  Logger.info('Seeding test database');
  
  let testDb = connectTo(testURI);

  testDb.once('open', async () => {
    
      await updateCurrencies(RapidApiKey);
    
      await seedUsers();
    
      await seedExchanges();
    
      await seedParties();
    
      mongoose.disconnect();
    });

  }

async function seed(){
  await seedTest();
}

seed();
  