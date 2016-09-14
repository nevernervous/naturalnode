var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CustomerAddressSchema = new Schema({
  shopifyId: {type: Number, required: false},
  first_name: {type: String, required: false},
  last_name: {type: String, required: false},
  company: {type: String, required: false},
  address1: {type: String, required: false},
  address2: {type: String, required: false},
  city: {type: String, required: false},
  province: {type: String, required: false},
  country: {type: String, required: false},
  zip: {type: String, required: false},
  phone: {type: String, required: false},
  name: {type: String, required: false},
  province_code: {type: String, required: false},
  country_code: {type: String, required: false},
  country_name: {type: String, required: false},
  "default": {type: Boolean, required: false},
  added: {type: Date, default: Date.now, required: true}
});

var CustomerSchema = new Schema({
  shopifyId: {type: Number, required: false},
  email: {type: String, required: false},
  accepts_marketing: {type: Boolean, required: false},
  created_at: {type: Date, required: false},
  updated_at: {type: Date, required: false},
  first_name: {type: String, required: false},
  last_name: {type: String, required: false},
  orders_count: {type: Number, required: false},
  state: {type: String, required: false},
  total_spent: {type: String, required: false},
  last_order_id: {type: Number, required: false},
  note: {type: String, required: false},
  verified_email: {type: Boolean, required: false},
  multipass_identifier: {type: String, required: false},
  tax_exempt: {type: Boolean, required: false},
  tags: {type: String, required: false},
  last_order_name: {type: String, required: false},
  default_address: {type: CustomerAddressSchema, required: false},
  addresses: [CustomerAddressSchema],
  comments: {type: String, required: false},
  contactToClientDate: {type: String, default: null, required: false},
  clientRepliedDate: {type: String, default: null, required: false},
  comments2: {type: String, required: false},
  contactToClientDate2: {type: String, default: null, required: false},
  clientRepliedDate2: {type: String, default: null, required: false},
  comments3: {type: String, required: false},
  contactToClientDate3: {type: String, default: null, required: false},
  clientRepliedDate3: {type: String, default: null, required: false},
  call1st: {type: Boolean, default: false, required: false},
  call2nd: {type: Boolean, default: false, required: false},
  call3rd: {type: Boolean, default: false, required: false},
  added: {type: Date, default: Date.now, required: true}
});

CustomerSchema.statics.insertSingle = function (req, res, next, data, addresses, callback) {
  var addressesArray = [];
  for (var i in addresses) {
    addressesArray.push({
      shopifyId: addresses[i].shopifyId,
      first_name: addresses[i].first_name,
      last_name: addresses[i].last_name,
      company: addresses[i].company,
      address1: addresses[i].address1,
      address2: addresses[i].address2,
      city: addresses[i].city,
      province: addresses[i].province,
      country: addresses[i].country,
      zip: addresses[i].zip,
      phone: addresses[i].phone,
      name: addresses[i].name,
      province_code: addresses[i].province_code,
      country_code: addresses[i].country_code,
      country_name: addresses[i].country_name,
      "default": addresses[i].default
    });
  }
  Customer.create({
    shopifyId: data.shopifyId,
    email: data.email,
    accepts_marketing: data.created_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
    first_name: data.first_name,
    last_name: data.last_name,
    orders_count: data.orders_count,
    state: data.state,
    total_spent: data.total_spent,
    last_order_id: data.last_order_id,
    note: data.note,
    verified_email: data.verified_email,
    multipass_identifier: data.multipass_identifier,
    tax_exempt: data.tax_exempt,
    tags: data.tags,
    last_order_name: data.last_order_name,
    default_address: data.default_address,
    comments: data.comments,
    contactToClientDate: data.contactToClientDate,
    clientRepliedDate: data.clientRepliedDate,
    comments2: data.comments,
    contactToClientDate2: data.contactToClientDate,
    clientRepliedDate2: data.clientRepliedDate,
    comments3: data.comments,
    contactToClientDate3: data.contactToClientDate,
    clientRepliedDate3: data.clientRepliedDate,
    call1st: data.call1st,
    call2nd: data.call2nd,
    call3rd: data.call3rd,
    addresses: addressesArray
  }, function (err, customer) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, customer);
  });
};

CustomerSchema.statics.getFullSearchLimitedPopulated = function (req, res, next, limit, page, search, callback) {
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
  Customer.find(find).sort([['added', 'descending']]).populate('customer').limit(limit).skip(limit * (page - 1)).exec(function (err, customers) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, customers);
  });
};

CustomerSchema.statics.countFullSearch = function (req, res, next, search, callback) {
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
  Customer.count(find, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};


CustomerSchema.statics.getAll = function (req, res, next, callback) {
  Customer.find().sort([['added', 'descending']]).exec(function (err, customers) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, customers);
  });
};

CustomerSchema.statics.getLimited = function (req, res, next, limit, page, callback) {
  Customer.find().sort([['added', 'descending']]).limit(limit).skip(limit * (page - 1)).exec(function (err, customers) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, customers);
  });
};

CustomerSchema.statics.countAll = function (req, res, next, callback) {
  Customer.count({}, function (err, count) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, count);
  });
};

CustomerSchema.statics.getById = function (req, res, next, id, callback) {
  Customer.findOne({'_id': id}).exec(function (err, customer) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, customer);
  });
};

CustomerSchema.statics.updateById = function (req, res, next, customerId, customerSet, callback) {
  Customer.findOneAndUpdate({_id: customerId}, customerSet, function (err, customer) {
    if (err) {
      return next(err);
    }
    callback(req, res, next, customer);
  });
};

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;