var request = require('../../helper/request');
/**
 * 获取所有快报
 * @returns {Request}
 */
exports.getReportTypeList = function () {
  return request.post('/customer/buildNews/findBuildNewsTypeList');
};