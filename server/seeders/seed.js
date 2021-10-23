const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const db = require('../config/connection');
const Logger = require('../utils/logger');

const seedUsers = require('./seedUsers');
const seedExchanges = require('./seedExchanges');

db.once('open', async () => {

  if(process.env.MONGODB_URI){
    Logger.info(`Seeding to mongo atlas fonxyOps STANCE instance`);
  } else {
    Logger.info('Seeding to backup mongo at local host')
  }

  await seedUsers();
  
  await seedExchanges();

  await seedTestAccounts();

  
  Logger.info('Concluded seeding');
  process.exit(0);
});
