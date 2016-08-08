var User = require('../model/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use('login', new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
    User.findOne({'username': username.toString().toLowerCase()},
      function (err, user) {
        if (err)
          return done(err);
        if (!user) {
          return done(null, false, req.flash('error', 'User does not exist'));
        }
        if (user.isValidPassword(password)) {
          if (user.deleted) {
            return done(null, false,
              req.flash('error', 'User deleted'));
          } else {
            return done(null, user);
          }
        } else {
          return done(null, false,
            req.flash('error', 'Invalid Password'));
        }
      }
    );
  }));
};