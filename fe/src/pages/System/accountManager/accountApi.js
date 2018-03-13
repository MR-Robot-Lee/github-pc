var request = require('../../../helper/request');

exports.getEnterMessage = function () {
  return request.get('/customer/system/getEnterMessage');
};
