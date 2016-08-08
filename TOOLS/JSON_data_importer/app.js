var logger = require('morgan');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

if (!fs.existsSync("./config.js")) {
  console.log("Config file doesn't exist");
  module.exports = [];
  return;
}

var config = require('./config.js');

var importers_path = './importer';
var data_path = './JSON_TO_IMPORT';
var models_path = './model';

importers = {};
models = {};
dataToImport = {};

// Autoload importers, models and dataToImport
fs.readdirSync(models_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    console.log('loading model: ' + file);
    models[file.split('.')[0]] = require(models_path + '/' + file);
  }
});
fs.readdirSync(importers_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    console.log('loading importer: ' + file);
    importers[file.split('.')[0]] = require(importers_path + '/' + file);
  }
});
fs.readdirSync(data_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    console.log('loading dataToImport: ' + file);
    dataToImport[file.split('.')[0]] = JSON.parse(fs.readFileSync(data_path + '/' + file));
  }
});

// connect to database
mongoose.connect(config.db.url);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error!');
  throw err;
});
console.log('Connected to DB');

//Run importers
console.log('Runing importers');
importers.quotes(dataToImport.quote, function () {
  console.log('Quotes done');
  importers.samples(dataToImport.free, function () {
    console.log('Samples done');
    console.log('All done');
    process.exit();
  });
});
