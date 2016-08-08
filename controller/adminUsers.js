var passport = require('passport');
var config = require('../config.js');
var pdf = require('html-pdf');
var ejs = require('ejs');
var flashMessages = require('./helper/admin-flashMessages');
var basicTemplateParams = require('./helper/admin-basicTemplateParams')(flashMessages);

var adminController = {};

adminController.usersList = function (req, res, next) {
  models.user.getAll(req, res, next, function (req, res, next, users) {
    var params = basicTemplateParams(req);
    params.users = users;
    res.render('admin-users', params);
  });
};

adminController.usersEdit = function (req, res, next) {
  models.user.getById(req, res, next, req.params.id, function (req, res, next, user) {
    if (!user) {
      var error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    if (req.body.password && req.body.password2) {
      if (req.body.password.length >= 10) {
        if (req.body.password.toString().valueOf() === req.body.password2.toString().valueOf()) {
          var data = {password: req.body.password};
          models.user.updateById(req, res, next, req.params.id, data, function () {
            req.flash('success', 'User saved');
            return res.redirect('/admin/users');
          });
        } else {
          req.flash('error', 'Passwords doesn\'t match');
          var params = basicTemplateParams(req);
          params.user = user;
          return res.render('admin-users-edit', params);
        }
      } else {
        req.flash('error', 'Password too short (min. 10 characters)');
        var params = basicTemplateParams(req);
        params.user = user;
        return res.render('admin-users-edit', params);
      }
    } else {
      var params = basicTemplateParams(req);
      params.user = user;
      return res.render('admin-users-edit', params);
    }
  });
};

adminController.usersAdd = function (req, res, next) {
  var params = basicTemplateParams(req);
  if (req.body.username && req.body.password && req.body.password2) {
    models.user.getByUsername(req, res, next, req.body.username, function (req, res, next, user) {
      if (user) {
        req.flash('error', 'User with specified username already exists');
        var params = basicTemplateParams(req);
        res.render('admin-users-add', params);
      } else {
        if (req.body.password.length >= 10) {
          if (req.body.password.toString().valueOf() === req.body.password2.toString().valueOf()) {
            var data = {
              username: req.body.username.toString().toLowerCase(),
              password: req.body.password
            };
            models.user.insertSingle(req, res, next, data, function () {
              req.flash('success', 'User added');
              return res.redirect('/admin/users');
            });
          } else {
            req.flash('error', 'Passwords doesn\'t match');
            var params = basicTemplateParams(req);
            res.render('admin-users-add', params);
          }
        } else {
          req.flash('error', 'Password too short (min. 10 characters)');
          var params = basicTemplateParams(req);
          res.render('admin-users-add', params);
        }
      }
    });
  } else {
    var params = basicTemplateParams(req);
    res.render('admin-users-add', params);
  }
};

module.exports = adminController;