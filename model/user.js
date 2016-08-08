var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var bCrypt = require('bcrypt-node');

var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var UserSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  deleted: {type: Boolean, required: true, default: false},
  registered: {type: Date, default: Date.now, required: true}
});

UserSchema.methods.isValidPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

UserSchema.statics.getAll = function (req, res, next, callback) {
  User.find({deleted: false}).exec(function (err, users) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, users);
  });
};

UserSchema.statics.getById = function (req, res, next, id, callback) {
  User.findOne({'_id': id}).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, user);
  });
};

UserSchema.statics.insertSingle = function (req, res, next, data, callback) {
  User.create({
    username: data.username,
    password: createHash(data.password)
  }, function (err, user) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, user);
  });
};

UserSchema.statics.updateById = function (req, res, next, userId, userSet, callback) {
  if (userSet.password) {
    userSet.password = createHash(userSet.password);
  }
  User.findOneAndUpdate({_id: userId, deleted: false}, userSet, function (err, user) {
    if (err) {
      castErrorHandler(req, res, next, err);
      return next(err);
    }
    callback(req, res, next, user);
  });
};

UserSchema.statics.getByUsername = function (req, res, next, username, callback) {
  User.findOne({'username': username}).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, user);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;