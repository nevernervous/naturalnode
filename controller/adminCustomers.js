var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);
var config = require('../config');
var objectModifier = require('./helper/objectModifier');

var adminController = {};

adminController.index = function (req, res, next) {
  var page = 1;
  if (req.query.page && Number.isInteger(parseInt(req.query.page)) && req.query.page > 0) {
    page = parseInt(req.query.page);
  }
      if (req.query.search) {
        models.customer.getFullSearchLimitedPopulated(req, res, next, config.tables.limit, page, req.query.search, function (req, res, next, customers) {
          for (var i in customers) {
            if (customers[i].customers ) {
              customers[i].name = (customers[i].customer.company ? customers[i].customer.company + ' ' : '') + customers[i].customer.first_name + ' ' + customers[i].customer.last_name;
              customers[i].number = customers[i].customer.default_address.phone;
              customers[i].email = customers[i].customer.email;
              customers[i].code = customers[i].customer.default_address.zip;
              customers[i].street = customers[i].customer.default_address.address1 + ' ' + customers[i].customer.default_address.address2;
              customers[i].town = customers[i].customer.default_address.city;
            }
          }
          models.customer.countFullSearch(req, res, next, req.query.search, function (req, res, next, count) {
            var params = basicTemplateParams(req);
            params.customers = customers;
            params.search = req.query.search;
            params.pages = Math.ceil(count / config.tables.limit);
            params.currentPage = page;
            res.render('admin-customers', params);
          });
        });
  } else {
      models.customer.getLimited(req, res, next, config.tables.limit, page, function (req, res, next, customers) {
          models.customer.countAll(req, res, next, function (req, res, next, count) {
              var params = basicTemplateParams(req);
              params.customers = customers;
              params.search = '';
              params.pages = Math.ceil(count / config.tables.limit);
              params.currentPage = page;
              res.render('admin-customers', params);
          });
      });
  }
};

adminController.addFromQuote = function (req, res, next) {
  models.quote.getById(req, res, next, req.params.id, function (req, res, next, quote) {
    if (!quote.customer) {
      adminController.createNewFromSampleOrQuote(req, res, next, quote);
    } else {
        req.flash('warning', 'Customer already exists');
        return res.redirect(req.header('Referer'));
    }
  });
};

adminController.addFromSample = function (req, res, next) {
  models.sample.getById(req, res, next, req.params.id, function (req, res, next, sample) {
    if (!sample.customer) {
      adminController.createNewFromSampleOrQuote(req, res, next, sample);
    } else {
        req.flash('warning', 'Customer already exists');
        return res.redirect(req.header('Referer'));
    }
  });
};

adminController.createNewFromSampleOrQuote = function (req, res, next, sampleOrQuote) {
  if (!sampleOrQuote) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
  }
  var data = {
    first_name: sampleOrQuote.name.split(" ")[0],
    last_name: sampleOrQuote.name.split(" ")[1],
    email: sampleOrQuote.email,
    default_address: {
      phone: sampleOrQuote.number,
      zip: sampleOrQuote.code,
      address1: sampleOrQuote.street,
      address2: '',
      city: sampleOrQuote.town
    }
  };
  models.customer.insertSingle(req, res, next, data, [], function (req, res, next, customer) {
    sampleOrQuote.customer = customer;
    sampleOrQuote.save(function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Customer created');
      return res.redirect(req.header('Referer'));
    });
  });
};

adminController.edit = function (req, res, next) {
  models.customer.getById(req, res, next, req.params.id, function (req, res, next, customer) {
    if (!customer) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    if (req.method.toString().toLowerCase().valueOf() == "post") {
      var dataSet = customer;
      if (req.body.call1) {
        dataSet['call1st'] = req.body['call1st'] ? true : false;
      }
      if (req.body.call2) {
        dataSet['call2nd'] = req.body['call2nd'] ? true : false;
      }
      if (req.body.call3) {
        dataSet['call3rd'] = req.body['call3rd'] ? true : false;
      }
      if (req.body.comments) {
        dataSet.comments = req.body.comments;
      }
      if (req.body.contactToClientDate) {
        dataSet.contactToClientDate = req.body.contactToClientDate;
      }
      if (req.body.clientRepliedDate) {
        dataSet.clientRepliedDate = req.body.clientRepliedDate;
      }
      if (req.body.comments2) {
        dataSet.comments2 = req.body.comments2;
      }
      if (req.body.contactToClientDate2) {
        dataSet.contactToClientDate2 = req.body.contactToClientDate2;
      }
      if (req.body.clientRepliedDate2) {
        dataSet.clientRepliedDate2 = req.body.clientRepliedDate2;
      }
      if (req.body.comments3) {
        dataSet.comments3 = req.body.comments3;
      }
      if (req.body.contactToClientDate3) {
        dataSet.contactToClientDate3 = req.body.contactToClientDate3;
      }
      if (req.body.clientRepliedDate3) {
        dataSet.clientRepliedDate3 = req.body.clientRepliedDate3;
      }
      if (req.body.email) {
        dataSet.email = req.body.email;
      }
      if (req.body.first_name) {
        dataSet.first_name = req.body.first_name;
      }
      if (req.body.last_name) {
        dataSet.last_name = req.body.last_name;
      }
      if (req.body.address1) {
        dataSet.default_address.address1 = req.body.address1;
      }
      if (req.body.city) {
        dataSet.default_address.city = req.body.city;
      }
      if (req.body.phone) {
        dataSet.default_address.phone = req.body.phone;
      }
      if (req.body.zip) {
        dataSet.default_address.zip = req.body.zip;
      }
      models.customer.updateById(req, res, next, customer._id, dataSet, function () {
        req.flash('success', 'Saved');
        return res.redirect(req.header('Referer'));
      });
    } else {
      var params = basicTemplateParams(req);

      //
      // mongoose object is read only object. convert it and add new properties 
      //
      var customerQuoteSamples = customer.toObject();

      //
      // add new properties to customer object
      //
      var propertiesQuotesSample = [ "quotes", "samples" ];
      var customerObjectModifier = new objectModifier();
      customerObjectModifier.addArrayPropertiesToObject( customerQuoteSamples,
                                                         propertiesQuotesSample );


      //
      // retrieve quotes and samples data based on the customer email
      // 
      models.sample.getByCustomerEmail( customerQuoteSamples.email, function( err, samples ){

        if ( err ) {
          return next( err );
        }

        customerQuoteSamples.samples = samples;

        models.quote.getByCustomerEmail( customerQuoteSamples.email, function( err, quotes ){

            if ( err ) {
              return next( err );
            }

            customerQuoteSamples.quotes = quotes;
            params.customer = customerQuoteSamples;

            //
            // render a modified customer object
            //
            res.render( 'admin-customer-edit', params );
        });
      });
    }
  });
};

adminController.archive = function (req, res, next) {
  models.customer.getById(req, res, next, req.params.id, function (req, res, next, customer) {
    if (!customer) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
      if (req.method.toString().toLowerCase().valueOf() == "post") {
        var dataSet = customer;
          dataSet.state = true;
        models.customer.updateById(req, res, next, customer._id, dataSet, function () {
          console.log(dataSet);
          req.flash('success', 'Saved');
          return res.redirect(req.header('Referer'));
        });
      }
  });
};

module.exports = adminController;