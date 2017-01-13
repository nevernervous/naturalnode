var passport = require('passport');
var config = require('../config.js');
var pdf = require('html-pdf');
var ejs = require('ejs');
var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);

var adminController = {};

adminController.index = function (req, res, next) {
  var params = basicTemplateParams(req);
  res.render('admin-index', params);
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

adminController.monthlyData = function (req, res, next) {
  var year = new Date().getFullYear();
  var data={};
  data.quotes = new Array(12);
  data.samples = new Array(12);

  models.quote.getMonthlyCount(req, res, next, year, function (req, res, next ,quotes) {
    for(var i in quotes) {
      var date = new Date(quotes[i].added);
      if(data.quotes[date.getMonth()] == undefined) {
        data.quotes[date.getMonth()] = 1;
      } else {
        data.quotes[date.getMonth()]++;
      }
    }

    models.sample.getMonthlyCount(req, res, next, year, function (req, res, next ,samples) {
      for(var i in samples) {
        var date = new Date(samples[i].added);
        if(data.samples[date.getMonth()] == undefined) {
          data.samples[date.getMonth()] = 1;
        } else {
          data.samples[date.getMonth()]++;
        }
      }
      initUndefinedData(data.quotes);
      initUndefinedData(data.samples);
      console.log(data.quotes);
      res.json(data);
    });

  });
}

var initUndefinedData = function (data) {
  var i;
  for(i = data.length - 1; i >= 0; i--) {
    if (data[i] == undefined) {
      continue;
    } else {
      for(var j = 0; j < i; j++) {
        if(data[j] == undefined) {
          data[j] = 0;
        }
      }
      return;
    }
  }
};

module.exports = adminController;