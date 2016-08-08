var samplesController = {};

samplesController.add = function (req, res, next) {
  models.sample.insertSingle(req, res, next, req.body, function (res, res, next, sample) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.naturalstone.co.uk');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    var output = {
      "status": true,
      "data": {
        "id_sample": sample._id,
        "date": sample.added,
        "name": sample.name,
        "number": sample.number,
        "email": sample.email,
        "code": sample.code,
        "adress": "",
        "tiling": sample.tiling,
        "size_1": sample.size_1,
        "size_2": sample.size_2,
        "size_3": sample.size_3,
        "id_product": sample.id_product,
        "sample_f": "NO",
        "sample_r": "NO",
        "subscribe": sample.subscribe,
        "street": sample.street,
        "town": sample.town,
        "title_product": null
      },
      "email_ansver": true
    };
    res.send(JSON.stringify(output));
  });
};

module.exports = samplesController;