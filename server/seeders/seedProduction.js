const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const mongoose = require('mongoose');
const Logger = require('../utils/logger');
const updateCurrencies = require('../helpers/updateCurrencies');
const seedUsers = require('./seedUsers');
const seedExchanges = require('./seedExchanges');
const seedParties = require('./seedParties');
const seedAccounts = require('./seedAccounts');
const seedTransactions = require('./seedTransactions');
const connectTo = require('../config/connectTo');

// get api key for currency updates from env file
var RapidApiKey = process.env.RAPID_API_KEY;
var prodURI = process.env.MONGODB_URI

if(!RapidApiKey){
  throw new Error('Failed to collect environment variable for rapid api key to update currencies')
}

async function seedProduction(){
  Logger.info('Seeding production database');

  let prodDb = connectTo(prodURI);
  
  prodDb.once('open', async () => {
    
    await updateCurrencies(RapidApiKey);
    
    await seedUsers();
    
    await seedExchanges();
    
    await seedParties();
    
    await seedAccounts();
    
    await seedTransactions();

    mongoose.disconnect();
    
  });
  
}

async function seed(){
  await seedProduction();
}

seed();
  