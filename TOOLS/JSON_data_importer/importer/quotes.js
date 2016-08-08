module.exports = function (data, doneCallback) {
  var added = 0;
  for (var i in data) {
    var dataRow = data[i];
    var row = {
      name: dataRow.name,
      number: dataRow.number,
      email: dataRow.email,
      code: dataRow.code,
      street: dataRow.street,
      town: dataRow.town,
      tiling: dataRow.tiling,
      size_1: dataRow.size_1,
      size_2: dataRow.size_2,
      size_3: dataRow.size_3,
      id_product: dataRow.id_product,
      title_product: dataRow.title_product,
      gclid: '',
      subscribe: dataRow.subscribe,
      old_id: dataRow.id_quote
    };
    models.quote.insertSingle(row, function (quote) {
      console.log('Added quote - old id: ' + row.old_id + ' - new id: ' + quote._id);
      added++;
      if (added == data.length) {
        doneCallback();
      }
    });
  }
}