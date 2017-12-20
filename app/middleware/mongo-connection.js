const mongoose = require('mongoose');
const {DB} = require('../config/config');

mongoose.Promise = global.Promise;

let isConnected = false;

const mongoConnection = (req, res, next) => {
  if (false === isConnected) {
    mongoose.connect(DB, {
      useMongoClient: true
    })
      .then(() => {
        console.log(`Connected to ${DB}`);
        isConnected = true;
        next();
      })
      .catch(error => next(error));
  } else {
    next();
  }
};

module.exports = mongoConnection;
