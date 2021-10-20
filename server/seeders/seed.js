require('dotenv').config();
const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
const Logger = require('../utils/logger');

db.once('open', async () => {

  if(process.env.MONGODB_URI){
    Logger.info(`Seeding to mongo atlas fonxyOps STANCE instance`);
  } else {
    Logger.info('Seeding to backup mongo at local host')
  }

  try {
    await User.deleteMany({});

    await User.create(userSeeds);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('all done!');
  process.exit(0);
});
