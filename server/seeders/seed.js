const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
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
var prodURI = process.env.MONGODB_URI;
var testURI = process.env.MONGODB_TEST_URI;

if(!RapidApiKey){
  throw new Error('Failed to collect environment variable for rapid api key to update currencies')
}

async function seedProduction(){
  Logger.info('Seeding production database');
  connectTo(prodURI);
  await updateCurrencies(RapidApiKey);
  await seedUsers();
  await seedExchanges();    
  await seedParties();
  await seedAccounts();
  await seedTransactions();
}

async function seedTest(){
  Logger.info('Seeding test database');
  connectTo(testURI);
  await updateCurrencies(RapidApiKey);
  await seedUsers();
  await seedExchanges();
  await seedParties();
}

async function seed(){
  await seedProduction();
  mongoose.disconnect().then(async () => {
    await seedTest();
    process.exit(1);
  });
}

seed();
  