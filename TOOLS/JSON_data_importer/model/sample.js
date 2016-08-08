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
  sent: {type: Boolean, default: false, required: false},
  old_id: {type: String, required: false}
});

SampleSchema.statics.insertSingle = function (data, callback) {
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
    old_id: data.old_id
  }, function (err, sample) {
    if (err) {
      console.log('Error: ' + err.toString());
      return;
    }
    callback(sample);
  });
};

var Sample = mongoose.model('Sample', SampleSchema);

module.exports = Sample;