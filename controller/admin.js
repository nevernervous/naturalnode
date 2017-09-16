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
  var data = {
    quotes: [],
    samples: [],
    categories: []
  };
  var d = new Date();
  var today = new Date((d.getMonth() + 1) + ' ' + d.getDate() + ' ' + d.getFullYear());
  var dateArray = [];
  for (var i = 6; i >= 0; i--) {
    dateArray.push(new Date(today.getTime() - i * 24 * 60 * 60 * 1000));
    data.categories.push(dateArray[dateArray.length - 1].getDate() + 'th');
  }
  Promise.all(dateArray.map(date => {
    return models.quote.getCountByDate(date).exec().then(count => {
      var info = {};
      info.count = count;
      info.date = date;
      data.quotes.push(info);
    })
  })).then(() => {
    Promise.all(dateArray.map(date => {
      return models.sample.getCountByDate(date).exec().then(count => {
        var info = {};
        info.count = count;
        info.date = date;
        data.samples.push(info);
      })
    })).then(() => {
        res.json(data);
        console.log(data);
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

adminController.itemNames = function (req, res, next) {
  models.quote.getProductNames().exec().then(quotes => {
    quotes.splice(0, 1);
    res.json(quotes);
  });
}

adminController.itemMonthData = function (req, res, next) {
  var id_product = req.param('id');
  console.log(id_product);
  var year = new Date().getFullYear();
  var data = {};
  data.quotes = new Array(12);
  data.samples = new Array(12);

  models.quote.getByYearAndIdProduct(year, id_product).exec().then(function(quotes) {
    console.log(quotes);
    for(var i in quotes) {
      var date = new Date(quotes[i].added);
      if(data.quotes[date.getMonth()] == undefined) {
        data.quotes[date.getMonth()] = 1;
      } else {
        data.quotes[date.getMonth()]++;
      }
    }

    models.sample.getByYearAndIdProduct(year, id_product).exec().then( function (samples) {
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

adminController.itemWeekData = function (req, res, next) {
  var id_product = req.param('id');
  var data = {
    quotes: [],
    samples: [],
    categories: []
  };
  var d = new Date();
  var today = new Date((d.getMonth() + 1) + ' ' + d.getDate() + ' ' + d.getFullYear());
  var dateArray = [];
  for (var i = 6; i >= 0; i--) {
    dateArray.push(new Date(today.getTime() - i * 24 * 60 * 60 * 1000));
    data.categories.push(dateArray[dateArray.length - 1].getDate() + 'th');
  }
  Promise.all(dateArray.map(date => {
    return models.quote.getCountByDateAndIdProduct(date, id_product).exec().then(count => {
      var info = {};
      info.count = count;
      info.date = date;
      data.quotes.push(info);
    })
  })).then(() => {
    Promise.all(dateArray.map(date => {
      return models.sample.getCountByDateAndIdProduct(date, id_product).exec().then(count => {
        var info = {};
        info.count = count;
        info.date = date;
        data.samples.push(info);
      })
    })).then(() => {
      res.json(data);
      console.log(data);
    });
  });

};

module.exports = adminController;
