var Controller = {};

var notImplemented = function (req, res, next) {
  res.send(405, 'Method Not Allowed');
  next();
};

Controller.elementGet = function (req, res, next) {
  notImplemented(req, res, next);
};

Controller.elementPut = function (req, res, next) {
  notImplemented(req, res, next);
};

Controller.elementPost = function (req, res, next) {
  notImplemented(req, res, next);
};

Controller.elementDelete = function (req, res, next) {
  notImplemented(req, res, next);
};

Controller.collectionGet = function (req, res, next) {
  notImplemented(req, res, next);
};

Controller.collectionPut = function (req, res, next) {
  notImplemented(req, res, next);
};

Controller.collectionPost = function (req, res, next) {
  notImplemented(req, res, next);
};

Controller.collectionDelete = function (req, res, next) {
  notImplemented(req, res, next);
};

module.exports = Controller;