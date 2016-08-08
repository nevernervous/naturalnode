module.exports = function (flashMessages) {
  return function (req, extra) {
    var obj = {};
    if (extra) {
      obj = extra;
    }
    obj.flashMsg = flashMessages(req);
    obj.route = req.route.path;
    obj.user = req.user;
    return obj;
  };
}

