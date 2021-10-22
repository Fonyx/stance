require('dotenv').config();
const db = require('../config/connection');
const Logger = require('../utils/logger');

const seedUsers = require('./seedUsers');
const seedCoins = require('./seedCoins');
const seedExchanges = require('./seedExchanges');
const seedStock = require('./seedStock');

db.once('open', async () => {

  if(process.env.MONGODB_URI){
    Logger.info(`Seeding to mongo atlas fonxyOps STANCE instance`);
  } else {
    Logger.info('Seeding to backup mongo at local host')
  }

  // await seedUsers();
  // Logger.info(`Seeded Users`);

  // await seedExchanges();
  // Logger.info('Seeded Exchanges');

  await seedStock();
  Logger.info('Seeded Stocks');

  // await seedCoins();
  // Logger.info('Seeded Coins');


  
  Logger.info('Concluded seeding');
  process.exit(0);
});
