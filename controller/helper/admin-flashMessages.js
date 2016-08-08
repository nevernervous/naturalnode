module.exports = function (req) {
  var message = {
    notice: req.flash('notice').toString(),
    success: req.flash('success').toString(),
    warning: req.flash('warning').toString(),
    error: req.flash('error').toString()
  };
  return message;
};