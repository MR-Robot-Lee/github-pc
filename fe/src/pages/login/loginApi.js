var request = require('../../helper/request');

/**
 * 登录
 * @param data
 */
exports.postLogin = function (data) {
  return request.post('/customer/index/login', { body: data });
};
/**
 * 验证验证码
 * @param data
 * @returns {Request}
 */
exports.postAuthCode = function (data) {
  return request.post('/customer/index/checkAuthCode', { body: data });
};
/**
 * 退出账户
 * @param id
 * @returns {Request}
 */
exports.getLogout = function (id) {
  return request.get('/customer/index/logout/' + id);
};
/**
 * 修改密码
 * @param data
 * @returns {Request}
 */
exports.postUpdatePwd = function (data) {
  return request.post('/customer/index/modify/pwd', { body: data });
};
/**
 * 企业注册
 * @param data
 * @returns {Request}
 */
exports.postCompany = function (data) {
  return request.post('/customer/index/regist/company', { body: data });
};
/**
 * 个人注册
 * @param data
 * @returns {Request}
 */
exports.postPerson = function (data) {
  return request.post('/customer/index/regist/person', { body: data });
};
/**
 * 重置密码
 * @param data
 * @returns {Request}
 */
exports.postResetPwd = function (data) {
  return request.post('/customer/index/reset/pwd', { body: data });
};
/**
 * 发送短信验证码
 * @param data
 * @returns {Request}
 */
exports.postCode = function (data) {
  return request.post('/customer/index/sendcode', { body: data });
};