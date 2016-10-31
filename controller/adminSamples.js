var passport = require('passport');
var config = require('../config.js');
var pdf = require('html-pdf');
var ejs = require('ejs');
var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);

var adminController = {};

adminController.samplesList = function (req, res, next) {
  var page = 1;
  if (req.query.page && Number.isInteger(parseInt(req.query.page)) && req.query.page > 0) {
    page = parseInt(req.query.page);
  }
  if (req.query.search) {
    models.sample.getFullSearchLimitedPopulated(req, res, next, config.tables.limit, page, req.query.search, function (req, res, next, samples) {
      for (var i in samples) {
        if (samples[i].customer) {
          samples[i].name = (samples[i].customer.company ? samples[i].customer.company + ' ' : '') + samples[i].customer.first_name + ' ' + samples[i].customer.last_name;
          samples[i].email = samples[i].customer.email;
          samples[i].street = samples[i].customer.default_address.address1 + ' ' + samples[i].customer.default_address.address2;
          samples[i].code = samples[i].customer.default_address.zip;
          samples[i].town = samples[i].customer.default_address.city;
          samples[i].number = samples[i].customer.default_address.phone;
          samples[i].email2 = samples[i].customer.email;
        }
      }
      models.sample.countFullSearch(req, res, next, req.query.search, function (req, res, next, count) {
        var params = basicTemplateParams(req);
        params.samples = samples;
        params.search = req.query.search;
        params.pages = Math.ceil(count / config.tables.limit);
        params.currentPage = page;
        res.render('admin-samples', params);
      });
    });
  } else {
    models.sample.getLimitedPopulated(req, res, next, config.tables.limit, page, function (req, res, next, samples) {
      for (var i in samples) {
        if (samples[i].customer) {
          samples[i].name = (samples[i].customer.company ? samples[i].customer.company + ' ' : '') + samples[i].customer.first_name + ' ' + samples[i].customer.last_name;
          samples[i].number = samples[i].customer.default_address.phone;
          samples[i].email = samples[i].customer.email;
          samples[i].code = samples[i].customer.default_address.zip;
          samples[i].street = samples[i].customer.default_address.address1 + ' ' + samples[i].customer.default_address.address2;
          samples[i].town = samples[i].customer.default_address.city;
          samples[i].email2 = samples[i].customer.email;
        }
      }
      models.sample.countAll(req, res, next, function (req, res, next, count) {
        var params = basicTemplateParams(req);
        params.samples = samples;
        params.search = '';
        params.pages = Math.ceil(count / config.tables.limit);
        params.currentPage = page;
        res.render('admin-samples', params);
      });
    });
  }
};

adminController.sampleMarkAsSent = function (req, res, next) {
  models.sample.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, sample) {
    if (!sample) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    var sampleSet = {
      sent: true
    };
    models.sample.updateById(req, res, next, sample._id, sampleSet, function (req, res, next, sample) {
      req.flash('success', 'Sample marked as sent');
      return res.redirect(req.header('Referer'));
    });
  });
};

adminController.sampleShippingLabelPdf = function (req, res, next) {
  var filename = "./pdf-templates/shipping-label.ejs";
  var options = {
    height: '125mm',
    width: '188mm',
    border: '0.2cm',
    timeout: 10000
  };
  models.sample.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, sample) {
    if (!sample) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    if (sample.customer) {
      sample.name = (sample.customer.company ? sample.customer.company + ' ' : '') + sample.customer.first_name + ' ' + sample.customer.last_name;
      sample.email = sample.customer.email;
      sample.street = sample.customer.default_address.address1 + ' ' + sample.customer.default_address.address2;
      sample.code = sample.customer.default_address.zip;
      sample.town = sample.customer.default_address.city;
      sample.number = sample.customer.default_address.phone;
    }
    var data = [];
    data.sample = sample;
    data.company = [];
    data.company.adress = config.pdf.companyAdress || [];
    ejs.renderFile(filename, data, {escape: false}, function (err, html) {
      if (err) {
        return next(err);
      }
      pdf.create(html, options).toStream(function (err, stream) {
        if (err) {
          return next(err);
        }
        stream.pipe(res);
      });
    });
  });
};

adminController.viewSample = function (req, res, next) {
  models.sample.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, sample) {
    if (!sample) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    if (sample.customer) {
      sample.name = (sample.customer.company ? sample.customer.company + ' ' : '') + sample.customer.first_name + ' ' + sample.customer.last_name;
      sample.email = sample.customer.email;
      sample.street = sample.customer.default_address.address1 + ' ' + sample.customer.default_address.address2;
      sample.code = sample.customer.default_address.zip;
      sample.town = sample.customer.default_address.city;
      sample.number = sample.customer.default_address.phone;
    }
    var params = basicTemplateParams(req);
    params.sample = sample;
    res.render('admin-sample-view', params);
  });
};

adminController.edit = function (req, res, next) {
  models.sample.getByIdPopulated(req, res, next, req.params.id, function (req, res, next, sample) {
    if (!sample) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    if (sample.customer) {
      sample.name = (sample.customer.company ? sample.customer.company + ' ' : '') + sample.customer.first_name + ' ' + sample.customer.last_name;
      sample.email = sample.customer.email;
      sample.street = sample.customer.default_address.address1 + ' ' + sample.customer.default_address.address2;
      sample.code = sample.customer.default_address.zip;
      sample.town = sample.customer.default_address.city;
      sample.number = sample.customer.default_address.phone;
    }
    if (req.method.toString().toLowerCase().valueOf() == "post") {
      if (!sample.customer) {
        sample.name = req.body.name;
        sample.number = req.body.number;
        sample.email = req.body.email;
        sample.code = req.body.code;
        sample.street = req.body.street;
        sample.town = req.body.town;
      }
      sample.tiling = req.body.tiling;
      sample.size_1 = req.body.size_1;
      sample.size_2 = req.body.size_2;
      sample.size_3 = req.body.size_3;
      sample.id_product = req.body.id_product;
      sample.title_product = req.body.title_product;
      sample.subscribe = req.body.subscribe;
      sample.notes = req.body.notes;
      sample.save(function () {
        req.flash('success', 'Saved');
        var params = basicTemplateParams(req);
        params.sample = sample;
        res.render('admin-sample-edit', params);
      });
    } else {
      var params = basicTemplateParams(req);
      params.sample = sample;
      res.render('admin-sample-edit', params);
    }
  });
};

module.exports = adminController;