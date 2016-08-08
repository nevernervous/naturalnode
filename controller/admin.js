var passport = require('passport');
var config = require('../config.js');
var pdf = require('html-pdf');
var ejs = require('ejs');
var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);

var adminController = {};

adminController.index = function (req, res, next) {
  res.render('admin-index', basicTemplateParams(req));
};

adminController.login = function (req, res, next) {
  res.render('admin-login-page', basicTemplateParams(req));
};

adminController.authenticate = function (req, res, next) {
  return (passport.authenticate('login', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true,
    title: 'Signing in'
  }))(req, res, next);
};

module.exports = adminController;