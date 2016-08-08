var striptags = require('striptags');

module.exports = function (dataList) {
  var msg = '<html><body>';
  for (var i in dataList) {
    var data = dataList[i];
    msg += '<div style="margin-bottom:40px;">'
      + '<b></b>' + striptags(data.name) + '<br>'
      + '<b></b>' + striptags(data.street) + '<br>'
      + '<b></b>' + striptags(data.town) + '<br>'
      + '<b></b>' + striptags(data.code) + '<br>'
      + '<b></b>' + striptags(data.number) + '<br>'
      + '<b></b>' + striptags(data.email) + '<br>'
      + '<b></b>' + striptags(data.tiling) + '<br>'
      + '<b>' + striptags(data.size_1) + ': </b>' + striptags(data.size_2) + '<br>'
      + '<b></b>' + striptags(data.title_product) + '<br>'
      + '<b></b>' + striptags(data.quote_f) + '<br>'
      + '<b></b>' + striptags(data.quote_r) + '<br>'
      + '<a href="https://naturalstone.myshopify.com/admin/products/' + striptags(data.id_product) + '/variants/' + striptags(data.size_3) + '"><b>' + striptags(data.size_3) + '</b></a><br>'
      + '<a href="https://naturalstone.myshopify.com/admin/products/' + striptags(data.id_product) + '"><b>' + striptags(data.id_product) + '</b></a><br>'
      + '<b></b>' + striptags((new Date()).toDateString().valueOf()) + '<br>' +
      +(data.subscribe ? 'User subscribed to newsletter <br>' : '')
      + '</div>';
  }
  msg += '</body></html>';
  return msg;
};