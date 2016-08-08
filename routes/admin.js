var express = require('express');
var router = express.Router();

router.prefix = '/admin';

router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.admin.index(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/quotes', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminQuotes.quotesList(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/quotes/:id', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminQuotes.viewQuote(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/quotes/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminQuotes.edit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.post('/quotes/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminQuotes.edit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/samples', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminSamples.samplesList(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/samples/:id/shipping-label.pdf', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminSamples.sampleShippingLabelPdf(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/samples/:id/mark-as-sent', function (req, res, next) {
  res.redirect('/admin/samples');
});

router.post('/samples/:id/mark-as-sent', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminSamples.sampleMarkAsSent(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/samples/:id', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminSamples.viewSample(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/samples/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminSamples.edit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.post('/samples/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminSamples.edit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/users', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminUsers.usersList(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/users/add', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminUsers.usersAdd(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.post('/users/add', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminUsers.usersAdd(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/users/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminUsers.usersEdit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.post('/users/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminUsers.usersEdit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/customers', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminCustomers.index(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.post('/customers/from-quote/:id', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminCustomers.addFromQuote(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.post('/customers/from-sample/:id', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminCustomers.addFromSample(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/customers/from-quote/:id', function (req, res, next) {
  return res.redirect('/admin/quotes');
});

router.get('/customers/from-sample/:id', function (req, res, next) {
  return res.redirect('/admin/samples');
});

router.get('/customers/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminCustomers.edit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.post('/customers/:id/edit', function (req, res, next) {
  if (req.isAuthenticated()) {
    controllers.adminCustomers.edit(req, res, next);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/login', function (req, res, next) {
  return controllers.admin.login(req, res, next);
});


router.post('/login', function (req, res, next) {
  return controllers.admin.authenticate(req, res, next);
});

module.exports = router;
