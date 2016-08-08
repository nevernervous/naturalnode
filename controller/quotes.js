var quotesController = {};
quotesController.add = function (req, res, next) {
  models.quote.insertSingle(req, res, next, req.body, function (res, res, next, quote) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.naturalstone.co.uk');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    var output = {
      "status": true,
      "data": {
        "id_quote": quote._id,
        "date": quote.added,
        "name": quote.name,
        "number": quote.number,
        "email": quote.email,
        "code": quote.code,
        "adress": "",
        "tiling": quote.tiling,
        "size_1": quote.size_1,
        "size_2": quote.size_2,
        "size_3": quote.size_3,
        "id_product": quote.id_product,
        "quote_f": "NO",
        "quote_r": "NO",
        "subscribe": quote.subscribe,
        "street": quote.street,
        "town": quote.town,
        "title_product": null
      },
      "email_ansver": true
    };
    res.send(JSON.stringify(output));
  });
};

module.exports = quotesController;