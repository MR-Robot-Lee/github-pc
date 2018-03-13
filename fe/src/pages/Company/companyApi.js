var request = require('../../helper/request');
/**
 * 获取公司列表
 * @returns {Request}
 */
exports.getCompanyList = function () {
  return request.get('/customer/index/company');
};
/**
 * 添加企业
 * @param data
 * @returns {Request}
 */
exports.addCompany = function (data) {
  return request.post('/customer/index/add/company', { body: data });
};


/**
 * 获取公司详情
 * @param id
 * @returns {Request}
 */
exports.getCompanyFindById = function (id) {
  return request.get('/customer/index/change/' + id);
};

/**
 * 发送短信验证码
 * @param data
 * @returns {Request}
 */
exports.postCode = function (data) {
  return request.post('/customer/index/sendcode', { body: data });
};
/**
 * 更换手机号
 * @param data
 * @returns {Request}
 */
exports.modifyMobile = function (data) {
  return request.post('/customer/index/modify/mobile', { body: data });
};

exports.modifyPwd = function (data) {
  return request.post('/customer/index/modify/pwd', { body: data });
};
/**
 * 更新用户信息
 * @param data
 * @returns {Request}
 */
exports.modifyUserInfo = function (data) {
  return request.post('/customer/index/modify/info', { body: data });
};


/**
 * 上传文件
 * @param file
 * @param callback
 */
exports.upload = function (file, callback) {
  return request.upload(file, callback);
};
/**
 * 获取用户信息
 * @returns {Request}
 */
exports.getUserInfo = function () {
  return request.get('/customer/index/userInfo');
};