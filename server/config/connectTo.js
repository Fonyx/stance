const mongoose = require('mongoose');
const Logger = require('../utils/logger');


function connectTo(URI){
    Logger.info(`Connected to ${URI} database`);
    
    mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    return mongoose.connection
}


module.exports = connectTo;
