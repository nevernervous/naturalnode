var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SampleSchema = new Schema({
  name: {type: String, required: false},
  number: {type: String, required: false},
  email: {type: String, required: false},
  code: {type: String, required: false},
  street: {type: String, required: false},
  town: {type: String, required: false},
  tiling: {type: String, required: false},
  size_1: {type: String, required: false},
  size_2: {type: String, required: false},
  size_3: {type: String, required: false},
  id_product: {type: String, required: false},
  title_product: {type: String, required: false},
  gclid: {type: String, required: false},
  subscribe: {type: String, required: false},
  added: {type: Date, default: Date.now, required: true},
  notes: {type: String, required: false},
  requestCreated: {type: String, required: false},
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false, default: null},
  sentViaEmail: {type: Boolean, default: false, required: false},
  sent: {type: Boolean, default: false, required: false}
});

SampleSchema.statics.insertSingle = function (req, res, next, data, callback) {
  Sample.create({
    name: data.name,
    number: data.number,
    email: data.email,
    code: data.code,
    street: data.street,
    town: data.town,
    tiling: data.tiling,
    size_1: data.size_1,
    size_2: data.size_2,
    size_3: data.size_3,
    id_product: data.id_product,
    title_product: data.title_product,
    gclid: data.gclid,
    subscribe: data.subscribe,
    notes: data.notes,
    requestCreated: data.requestCreated,
    customer: data.customer
  }, function (err, sample) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, sample);
  });
};

SampleSchema.statics.getAllPopulated = function (req, res, next, callback) {
  Sample.find().sort([['added', 'descending']]).populate('customer').exec(function (err, samples) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, samples);
  });
};

SampleSchema.statics.getAllFromDate = function (req, res, next, date, callback) {
  Sample.find({"added": {"$gte": date}}).sort([['added', 'descending']]).exec(function (err, samples) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, samples);
  });
};

SampleSchema.statics.getAllNotSentViaEmailPopulated = function (req, res, next, callback) {
  Sample.find({"sentViaEmail": {"$ne": true}}).populate('customer').exec(function (err, samples) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, samples);
  });
};

SampleSchema.methods.markAsSentViaEmail = function (req, res, next, callback) {
  this.sentViaEmail = true;
  this.save(function (err) {
    if (err) {
      return next(err);
    } else {
      if (callback) {
        callback(req, res, next);
      }
    }
  });
};

SampleSchema.statics.getById = function (req, res, next, id, callback) {
  Sample.findOne({'_id': id}).exec(function (err, sample) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, sample);
  });
};

SampleSchema.statics.getByIdPopulated = function (req, res, next, id, callback) {
  Sample.findOne({'_id': id}).populate("customer").exec(function (err, sample) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, sample);
  });
};

SampleSchema.statics.getLimitedPopulated = function (req, res, next, limit, page, callback) {
  Sample.find().sort([['added', 'descending']]).populate("customer").limit(limit).skip(limit * (page - 1)).exec(function (err, samples) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, samples);
  });
};

SampleSchema.statics.updateById = function (req, res, next, sampleId, sampleSet, callback) {
  Sample.findOneAndUpdate({_id: sampleId}, sampleSet, function (err, sample) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, sample);
  });
};

SampleSchema.statics.countAll = function (req, res, next, callback) {
  Sample.count({}, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};

SampleSchema.statics.countFullSearch = function (req, res, next, search, callback) {
  var regex = new RegExp(search, "i");
  var find = {$or: [
      {name: regex},
      {number: regex},
      {email: regex},
      {code: regex},
      {street: regex},
      {town: regex},
      {tiling: regex},
      {size_1: regex},
      {size_2: regex},
      {size_3: regex},
      {id_product: regex},
      {title_product: regex},
      {gclid: regex},
      {subscribe: regex},
      {notes: regex}
    ]};
  Sample.count(find, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};

SampleSchema.statics.getFullSearchLimitedPopulated = function (req, res, next, limit, page, search, callback) {
  var regex = new RegExp(search, "i");
  var find = {$or: [
      {name: regex},
      {number: regex},
      {email: regex},
      {code: regex},
      {street: regex},
      {town: regex},
      {tiling: regex},
      {size_1: regex},
      {size_2: regex},
      {size_3: regex},
      {id_product: regex},
      {title_product: regex},
      {gclid: regex},
      {subscribe: regex},
      {notes: regex}
    ]};
  Sample.find(find).sort([['added', 'descending']]).populate('customer').limit(limit).skip(limit * (page - 1)).exec(function (err, samples) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, samples);
  });
};

//
// retrieve all samples for this customer email
// 
SampleSchema.statics.getByCustomerEmail = function ( email, callback) {
  Sample.find( {'email': email }).exec(function (err, sample) {
    if (err) {
      return callback( err );
    }
    return callback( null, sample );
  });
};

SampleSchema.statics.getMonthlyCount = function (req, res, next, year, callback) {
  var find = {
    added: {
      $gte: new Date("1 1," + year),
      $lt: new Date("1 1," + (year + 1))
    }};
  Sample.find(find, {added: 1, _id: 0} ,function (err, samples) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, samples);
  });

};

var Sample = mongoose.model('Sample', SampleSchema);

module.exports = Sample;