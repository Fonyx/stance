const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './.env')});
const express = require('express');
const configuredMorgan = require('./utils/morgan.js');
const updateCurrencies = require('./helpers/updateCurrencies');

const app = express();
app.PORT = process.env.PORT || 3001;

// use custom colour server logging as middleware
app.use(configuredMorgan);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get api key for currency updates from env file
var RapidApiKey = process.env.RAPID_API_KEY;

if(!RapidApiKey){
  throw new Error('Failed to collect environment variable for rapid api key to update currencies')
}
// setup timeout to update currencies every hour
setInterval(async () => {
  updateCurrencies(RapidApiKey);
}, 1000*60*60)


// serve client/build as static assets for production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// serve the index.html file from the client build for any end point url
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app