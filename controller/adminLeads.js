var passport = require('passport');
var config = require('../config.js');
var pdf = require('html-pdf');
var ejs = require('ejs');
var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);

var adminController = {};

adminController.leadsList = function (req, res, next) {
  var page = 1;
  if (req.query.page && Number.isInteger(parseInt(req.query.page)) && req.query.page > 0) {
    page = parseInt(req.query.page);
  }
  if (req.query.search) {
    models.lead.getFullSearchLimitedPopulated(req, res, next, config.tables.limit, page, req.query.search, function (req, res, next, leades) {
      for (var i in leads) {
        if (leads[i].customer) {
          leads[i].name = leads[i].name;
          leads[i].email = leads[i].customer.email;
          leads[i].phone = leads[i].customer.phone;
        }
      }
      models.lead.countFullSearch(req, res, next, req.query.search, function (req, res, next, count) {
        var params = basicTemplateParams(req);
        params.leads = leads;
        params.search = req.query.search;
        params.pages = Math.ceil(count / config.tables.limit);
        params.currentPage = page;
        res.render('admin-leads', params);
      });
    });
  } else {
 /*   models.lead.getLimitedPopulated(req, res, next, config.tables.limit, page, function (req, res, next, leads) {
      for (var i in leads) {
        if (leads[i].customer) {
          leads[i].name = leads[i].name;
          leads[i].email = leads[i].email;
          leads[i].phone = leads[i].phone;
        }
      }
      models.lead.countAll(req, res, next, function (req, res, next, count) {
        var params = basicTemplateParams(req);
        params.leads = leades;
        params.search = '';
        params.pages = Math.ceil(count / config.tables.limit);
        params.currentPage = page;
        res.render('admin-leads', params);
      });
    });
  }*/
};


module.exports = adminController;