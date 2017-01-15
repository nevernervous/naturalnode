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
  var data = {};
  data.quotes = new Array(12);
  data.samples = new Array(12);

  models.quote.getByYear(year).exec().then(function(quotes) {
    for(var i in quotes) {
      var date = new Date(quotes[i].added);
      if(data.quotes[date.getMonth()] == undefined) {
        data.quotes[date.getMonth()] = 1;
      } else {
        data.quotes[date.getMonth()]++;
      }
    }

    models.sample.getByYear(year).exec().then( function (samples) {
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
      res.json(data);
    });

  });
};

adminController.weeklyData = function (req, res, next) {
  var data = {};
  data.quotes = [];
  data.samples = [];
  data.categories = [];
  var today = new Date();

  var dateArray = [];
  for (var i = 6; i >= 0; i--) {
    dateArray.push(new Date(today.getTime() - i * 24 * 60 * 60 * 1000));
    data.categories.push(dateArray[dateArray.length - 1].getDate() + 'th');
  }

  Promise.all(dateArray.map(date => {
    return models.quote.getCountByDate(date).exec().then(count => {
      data.quotes.push(count);
    })
  })).then(() => {
    Promise.all(dateArray.map(date => {
      return models.sample.getCountByDate(date).exec().then(count => {
        data.samples.push(count);
      })
    })).then(() => {
        res.json(data);
    });
  });

};

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