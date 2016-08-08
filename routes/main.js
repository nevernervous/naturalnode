var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('');
});

router.post('/add_quote', function (req, res, next) {
  controllers.quotes.add(req, res, next);
});

router.post('/add_free', function (req, res, next) {
  controllers.samples.add(req, res, next);
});

module.exports = router;
