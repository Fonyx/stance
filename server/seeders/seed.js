const Logger = require('../utils/logger');
const updateCurrencies = require('../helpers/updateCurrencies');
const seedUsers = require('./seedUsers');
const seedExchanges = require('./seedExchanges');
const seedParties = require('./seedParties');
const seedAccounts = require('./seedAccounts');
const seedTransactions = require('./seedTransactions');


async function runSeed(db){
  db.once('open', async () => {
  
    // get api key for currency updates from env file
    var RapidApiKey = process.env.RAPID_API_KEY;
  
    if(!RapidApiKey){
      throw new Error('Failed to collect environment variable for rapid api key to update currencies')
    }
  
    if(process.env.MONGODB_URI){
      Logger.info(`Seeding to mongo atlas fonxyOps STANCE instance`);
    } else {
      Logger.info('Seeding to backup mongo at local host')
    }
  
    await updateCurrencies(RapidApiKey);
  
    await seedUsers();
    
    await seedExchanges();
  
    await seedParties();
  
    await seedAccounts();
  
    await seedTransactions();
  
    
    Logger.info('Concluded seeding');
    process.exit(0);
  });
}


module.exports = runSeed;

