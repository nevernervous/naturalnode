var passport = require('passport');
var config = require('../config.js');
var pdf = require('html-pdf');
var ejs = require('ejs');
var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);

var adminController = {};

adminController.leadsList = function (req, res, next) {
	var params = basicTemplateParams(req);
  res.render('admin-leads', params);
};


module.exports = adminController;