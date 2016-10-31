var passport = require('passport');
var config = require('../config.js');
var pdf = require('html-pdf');
var ejs = require('ejs');
var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);

var adminController = {};

adminController.quotesList = function (req, res, next) {
  var page = 1;
  if (req.query.page && Number.isInteger(parseInt(req.query.page)) && req.query.page > 0) {
    page = parseInt(req.query.page);
  }
  if (req.query.search) {
    models.quote.getFullSearchLimitedPopulated(req, res, next, config.tables.limit, page, req.query.search, function (req, res, next, quotes) {
      for (var i in quotes) {
        if (quotes[i].customer) {
          quotes[i].name = (quotes[i].customer.company ? quotes[i].customer.company + ' ' : '') + quotes[i].customer.first_name + ' ' + quotes[i].customer.last_name;
          quotes[i].number = quotes[i].customer.default_address.phone;
          quotes[i].email = quotes[i].customer.email;
          quotes[i].code = quotes[i].customer.default_address.zip;
          quotes[i].street = quotes[i].customer.default_address.address1 + ' ' + quotes[i].customer.default_address.address2;
          quotes[i].town = quotes[i].customer.default_address.city;
          quotes[i].email2 = quotes[i].customer.email;
        }
      }
      models.quote.countFullSearch(req, res, next, req.query.search, function (req, res, next, count) {
        var params = basicTemplateParams(req);
        params.quotes = quotes;
        params.search = req.query.search;
        params.pages = Math.ceil(count / config.tables.limit);
        params.currentPage = page;
        res.render('admin-quotes', params);
      });
    });
  } else {
    models.quote.getLimitedPopulated(req, res, next, config.tables.limit, page, function (req, res, next, quotes) {
      for (var i in quotes) {
        console.log(quotes[i]);
        if (quotes[i].customer) {
          quotes[i].name = (quotes[i].customer.company ? quotes[i].customer.company + ' ' : '') + quotes[i].customer.first_name + ' ' + quotes[i].customer.last_name;
          quotes[i].number = quotes[i].customer.default_address.phone;
          quotes[i].email = quotes[i].customer.email;
          quotes[i].code = quotes[i].customer.default_address.zip;
          quotes[i].street = quotes[i].customer.default_address.address1 + ' ' + quotes[i].customer.default_address.address2;
          quotes[i].town = quotes[i].customer.default_address.city;
          quotes[i].email2 = quotes[i].customer.email;
        }
      }
      models.quote.countAll(req, res, next, function (req, res, next, count) {
        var params = basicTemplateParams(req);
        params.quotes = quotes;
        params.search = '';
        params.pages = Math.ceil(count / config.tables.limit);
        params.currentPage = page;
        res.render('admin-quotes', params);
      });
    });
  }
};

adminController.viewQuote = function (req, res, next) {
  models.quote.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, quote) {
    if (!quote) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    console.log(quote);
    if (quote.customer) {
      quote.name = (quote.customer.company ? quote.customer.company + ' ' : '') + quote.customer.first_name + ' ' + quote.customer.last_name;
      quote.number = quote.customer.default_address.phone;
      quote.email = quote.customer.email;
      quote.code = quote.customer.default_address.zip;
      quote.street = quote.customer.default_address.address1 + ' ' + quote.customer.default_address.address2;
      quote.town = quote.customer.default_address.city;
    }
    var params = basicTemplateParams(req);
    params.quote = quote;
    res.render('admin-quote-view', params);
  });
};

adminController.edit = function (req, res, next) {
  models.quote.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, quote) {
    if (!quote) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    if (quote.customer) {
      quote.name = (quote.customer.company ? quote.customer.company + ' ' : '') + quote.customer.first_name + ' ' + quote.customer.last_name;
      quote.number = quote.customer.default_address.phone;
      quote.email = quote.customer.email;
      quote.code = quote.customer.default_address.zip;
      quote.street = quote.customer.default_address.address1 + ' ' + quote.customer.default_address.address2;
      quote.town = quote.customer.default_address.city;
    }
    if (req.method.toString().toLowerCase().valueOf() == "post") {
      if (!quote.customer) {
        quote.name = req.body.name;
        quote.number = req.body.number;
        quote.email = req.body.email;
        quote.code = req.body.code;
        quote.street = req.body.street;
      }
      quote.town = req.body.town;
      quote.tiling = req.body.tiling;
      quote.size_1 = req.body.size_1;
      quote.size_2 = req.body.size_2;
      quote.size_3 = req.body.size_3;
      quote.id_product = req.body.id_product;
      quote.title_product = req.body.title_product;
      quote.subscribe = req.body.subscribe;
      quote.status = req.body.status;
      quote.notes = req.body.notes;
      quote.save(function () {
        req.flash('success', 'Saved');
        var params = basicTemplateParams(req);
        params.quote = quote;
        res.render('admin-quote-edit', params);
      });
    } else {
      var params = basicTemplateParams(req);
      params.quote = quote;
      res.render('admin-quote-edit', params);
    }
  });
};

module.exports = adminController;