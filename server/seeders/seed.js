const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const db = require('../config/connection');
const Logger = require('../utils/logger');

const seedUsers = require('./seedUsers');
const seedExchanges = require('./seedExchanges');
const seedParties = require('./seedParties');
const seedTags = require('./seedTags');
const seedAccounts = require('./seedAccounts');
const seedTransactions = require('./seedTransactions');


db.once('open', async () => {

  if(process.env.MONGODB_URI){
    Logger.info(`Seeding to mongo atlas fonxyOps STANCE instance`);
  } else {
    Logger.info('Seeding to backup mongo at local host')
  }

  // await seedUsers();
  
  // await seedExchanges();

  // seeding user details

  // await seedParties();
  
  await seedTags();

  // await seedAccounts();

  // await seedTransactions();

  
  Logger.info('Concluded seeding');
  process.exit(0);
});
