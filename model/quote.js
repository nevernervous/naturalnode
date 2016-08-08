var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var QuoteSchema = new Schema({
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
  quote_f: {type: String, required: false},
  quote_r: {type: String, required: false},
  title_product: {type: String, required: false},
  gclid: {type: String, required: false},
  subscribe: {type: String, required: false},
  notes: {type: String, required: false},
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false, default: null},
  requestCreated: {type: String, required: false},
  sentViaEmail: {type: Boolean, default: false, required: false},
  added: {type: Date, default: Date.now, required: true}
});

QuoteSchema.statics.insertSingle = function (req, res, next, data, callback) {
  Quote.create({
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
    quote_f: data.quote_f,
    quote_r: data.quote_r,
    title_product: data.title_product,
    gclid: data.gclid,
    subscribe: data.subscribe,
    notes: data.notes,
    requestCreated: data.requestCreated,
    customer: data.customer
  }, function (err, quote) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quote);
  });
};

QuoteSchema.statics.getAllPopulated = function (req, res, next, callback) {
  Quote.find().sort([['added', 'descending']]).populate('customer').exec(function (err, quotes) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quotes);
  });
};

QuoteSchema.statics.getAllFromDate = function (req, res, next, date, callback) {
  Quote.find({"added": {"$gte": date}}).sort([['added', 'descending']]).exec(function (err, quotes) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quotes);
  });
};

QuoteSchema.statics.getAllNotSentViaEmailPopulated = function (req, res, next, callback) {
  Quote.find({"sentViaEmail": {"$ne": true}}).populate('customer').exec(function (err, quotes) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quotes);
  });
};

QuoteSchema.methods.markAsSentViaEmail = function (req, res, next, callback) {
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

QuoteSchema.statics.getById = function (req, res, next, id, callback) {
  Quote.findOne({'_id': id}).exec(function (err, quote) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quote);
  });
};

QuoteSchema.statics.getByIdPopulated = function (req, res, next, id, callback) {
  Quote.findOne({'_id': id}).populate('customer').exec(function (err, quote) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quote);
  });
};

QuoteSchema.statics.updateById = function (req, res, next, quoteId, quoteSet, callback) {
  Quote.findOneAndUpdate({_id: quoteId}, quoteSet, function (err, quote) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quote);
  });
};

QuoteSchema.statics.getLimitedPopulated = function (req, res, next, limit, page, callback) {
  Quote.find().sort([['added', 'descending']]).populate('customer').limit(limit).skip(limit * (page - 1)).exec(function (err, quotes) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quotes);
  });
};

QuoteSchema.statics.getFullSearchLimitedPopulated = function (req, res, next, limit, page, search, callback) {
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
      {quote_f: regex},
      {quote_r: regex},
      {title_product: regex},
      {gclid: regex},
      {subscribe: regex},
      {notes: regex}
    ]};
  Quote.find(find).sort([['added', 'descending']]).populate('customer').limit(limit).skip(limit * (page - 1)).exec(function (err, quotes) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, quotes);
  });
};

QuoteSchema.statics.countFullSearch = function (req, res, next, search, callback) {
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
      {quote_f: regex},
      {quote_r: regex},
      {title_product: regex},
      {gclid: regex},
      {subscribe: regex},
      {notes: regex}
    ]};
  Quote.count(find, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};

QuoteSchema.statics.countAll = function (req, res, next, callback) {
  Quote.count({}, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};

var Quote = mongoose.model('Quote', QuoteSchema);

module.exports = Quote;