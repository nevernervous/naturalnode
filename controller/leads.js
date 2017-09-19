var leadsController = {};


leadsController.add = function (req, res, next) {
  console.log(req.body);
  models.lead.insertSingle(req, res, next, req.body, function (res, res, next, lead) {
    res.setHeader('Access-Control-Allow-Origin', 'https://land.naturalstone.co.uk');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    var output = {
      "status": true,
      "data": {
        "name": lead.name,
        "email": lead.email,
        "phone": lead.phone,
      }
    };
    res.send(JSON.stringify(output));
  });
};

module.exports = leadsController;
