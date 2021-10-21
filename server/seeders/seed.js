require('dotenv').config();
const db = require('../config/connection');
const Logger = require('../utils/logger');

const seedUsers = require('./seedUsers');
const seedCoins = require('./seedCoins');
const seedExchanges = require('./seedExchanges');

db.once('open', async () => {

  if(process.env.MONGODB_URI){
    Logger.info(`Seeding to mongo atlas fonxyOps STANCE instance`);
  } else {
    Logger.info('Seeding to backup mongo at local host')
  }

  // await seedUsers();
  // Logger.info(`Seeded Users`);

  // await seedCoins();
  // Logger.info('Seeded Coins');

  await seedExchanges();
  Logger.info('Seeded Exchanges')

  
  Logger.info('Concluded seeding');
  process.exit(0);
});
