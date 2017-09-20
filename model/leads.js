var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LeadSchema = new Schema({

  name: {type: String, required: false},
  email: {type: String, required: false},
  phone: {type: String, required: false},
  added: {type: Date, default: Date.now, required: true}

});

LeadSchema.statics.insertSingle = function (req, res, next, data, callback) {
  Lead.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    added: data.added
  }, function (err, lead) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, lead);
  });
};

LeadSchema.statics.getAllPopulated = function (req, res, next, callback) {
  Lead.find().sort([['added', 'descending']]).populate('lead').exec(function (err, Leads) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, Leads);
  });
};

LeadSchema.statics.getAllFromDate = function (req, res, next, date, callback) {
  Lead.find({"added": {"$gte": date}}).sort([['added', 'descending']]).exec(function (err, Leads) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, Leads);
  });
};

LeadSchema.statics.getById = function (req, res, next, id, callback) {
  Lead.findOne({'_id': id}).exec(function (err, Lead) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, Lead);
  });
};

LeadSchema.statics.getByIdPopulated = function (req, res, next, id, callback) {
  Lead.findOne({'_id': id}).populate("lead").exec(function (err, Lead) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, Lead);
  });
};

LeadSchema.statics.getLimitedPopulated = function (req, res, next, limit, page, callback) {
  Lead.find().sort([['added', 'descending']]).populate("lead").limit(limit).skip(limit * (page - 1)).exec(function (err, Leads) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, Leads);
  });
};

LeadSchema.statics.updateById = function (req, res, next, LeadId, LeadSet, callback) {
  Lead.findOneAndUpdate({_id: LeadId}, LeadSet, function (err, Lead) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, Lead);
  });
};

LeadSchema.statics.countAll = function (req, res, next, callback) {
  Lead.count({}, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};

LeadSchema.statics.countFullSearch = function (req, res, next, search, callback) {
  var regex = new RegExp(search, "i");
  var find = {$or: [
      {name: regex},
      {email: regex},
      {phone: regex}
    ]};
  Lead.count(find, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};

LeadSchema.statics.getFullSearchLimitedPopulated = function (req, res, next, limit, page, search, callback) {
  var regex = new RegExp(search, "i");
  var find = {$or: [
      {name: regex},
      {email: regex},
      {phone: regex}
    ]};
  Lead.find(find).sort([['added', 'descending']]).populate('lead').limit(limit).skip(limit * (page - 1)).exec(function (err, Leads) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, leads);
  });
};

var Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;