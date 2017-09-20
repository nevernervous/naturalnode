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
    models.lead.getFullSearchLimitedPopulated(req, res, next, config.tables.limit, page, req.query.search, function (req, res, next, leads) {
      for (var i in leads) {
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
    models.lead.getLimitedPopulated(req, res, next, config.tables.limit, page, function (req, res, next, leads) {
      for (var i in leads) {
      }
      models.lead.countAll(req, res, next, function (req, res, next, count) {
        var params = basicTemplateParams(req);
        params.leads = leads;
        params.search = '';
        params.pages = Math.ceil(count / config.tables.limit);
        params.currentPage = page;
        res.render('admin-leads', params);
      });
    });
  }
};

adminController.viewLead = function (req, res, next) {
  models.lead.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, lead) {
    if (!lead) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    var params = basicTemplateParams(req);
    params.lead = lead;
    res.render('admin-lead-view', params);
  });
};

adminController.edit = function (req, res, next) {
  models.lead.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, lead) {
    if (!lead) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    if (req.method.toString().toLowerCase().valueOf() == "post") {
      if (!lead.customer) {
        lead.name = req.body.name;
        lead.email = req.body.email;
        lead.phone = req.body.phone;
      }
      lead.save(function () {
        req.flash('success', 'Saved');
        var params = basicTemplateParams(req);
        params.lead = lead;
        res.render('admin-lead-edit', params);
      });
    } else {
      var params = basicTemplateParams(req);
      params.lead = lead;
      res.render('admin-lead-edit', params);
    }
  });
};

module.exports = adminController;