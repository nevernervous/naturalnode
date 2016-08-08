var nodemailer = require('nodemailer');
var config = require('./config.js');

module.exports = nodemailer.createTransport(config.mailer.url);