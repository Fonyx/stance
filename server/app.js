const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require('express');
const configuredMorgan = require('./utils/morgan.js');
const updateCurrencies = require('./helpers/updateCurrencies');
const connectTo = require('../server/config/connectTo');
const {isOneAm} = require('./utils/timers');
const {transactionSvc} = require('./services');
const Logger = require('./utils/logger');


const app = express();
app.PORT = process.env.PORT;
// app.prodURI = process.env.MONGODB_URI;
app.prodURI = 'mongodb://localhost/stance'
// connect to production database
connectTo(app.prodURI);

// use custom colour server logging as middleware
app.use(configuredMorgan);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get api key for currency updates from env file
var RapidApiKey = process.env.RAPID_API_KEY;

if(!RapidApiKey){
  throw new Error('Failed to collect environment variable for rapid api key to update currencies')
}

// initial update of currencies
updateCurrencies(RapidApiKey);

// setup interval to operate every minute
setInterval(async () => {
  // update currencies every hour
  Logger.info(`Executing scheduled currency update`);
  updateCurrencies(RapidApiKey);

}, 1000*60*60);

transactionSvc.applyToday();

// transaction apply schedule, checks every minute if it is 01:00
var updated = false;
setInterval(async () => {
  // check if it is midnight and the run flag indicates the update hasn't been done, then apply todays transactions to their accounts
  // Logger.info('Checking if it is 1AM');

  if(isOneAm()){
    if(!updated) {
      Logger.info(`It's 1am, applying transactions`)
      transactionSvc.applyToday();
      // set the updated flag to true once updates are done - guards against running again due to timer slip
      updated = true;
    }
  // this guards against a second call on the same day since we are timing a 1 minute check and it may take less than a minute to execute
  } else {
    updated = false;
  }
}, 1000*30)


// serve client/build as static assets for production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// serve the index.html file from the client build for any end point url
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app