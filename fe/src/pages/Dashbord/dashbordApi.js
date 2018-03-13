var request = require('../../helper/request');

/**
 * 添加日历提醒
 * @param data
 * @returns {Request}
 */
exports.postCalendarRemind = function (data) {
  return request.post('/customer/main/calendar', { body: data });
};
/**
 * 删除日历提醒
 * @param id
 */
exports.delCalendarRemind = function (id) {
  return request.del('/customer/main/calendar/' + id);
};
/**
 * 通过id 更新日历提醒
 * @param data
 * @returns {Request}
 */
exports.putCalendarRemind = function (data) {
  return request.put('/customer/main/calendar/' + data.id, { body: data });
};
/**
 * 通过月份获取当前月的提醒
 * @param month
 * @returns {Request}
 */
exports.getCalendarCurrentMonthRemind = function (month) {
  return request.get('/customer/main/calendar/' + month);
};
/**
 * 获取财务列表
 * @param data
 * @returns {Request}
 */
exports.getNewFinance = function (data) {
  data = data || {};
  data.status = data.status || 0;
  data.projId = data.projId || 0;
  data.pageSize = data.pageSize || $('.Page__size .item.active').text();
  data.pageNo = data.pageNo || $('.Page__pages .items.pgs .item.active').text();
  return request.get('/customer/main/finance', { qs: data });
};
/**
 * 获取最近公告,知识
 * @returns {Request}
 */
exports.getNoticeKnowledge = function () {
  return request.get('/customer/main/noticeKnowledge');
};
/**
 * 获取企业宣传图片
 * @returns {Request}
 */
exports.getPicture = function () {
  return request.get('/customer/main/picture');
};
/**
 *工作提醒
 * @returns {Request}
 */
exports.getJobRemind = function () {
  return request.get('/customer/main/reminder');
};
/**
 *工作提醒数量
 * @returns {Request}
 */
exports.getJobRemindNum = function () {
    return request.get('/customer/main/reminder/count');
};
/**
 * 获取操作日志列表
 * @returns {Request}
 */
exports.getSystemHandlerLog = function (data) {
  data = data || {};
  data.pageSize = data.pageSize || $('.Page__size .item.active').text();
  data.pageNo = data.pageNo || $('.Page__pages .items.pgs .item.active').text();
  return request.get('/customer/main/sysLog', { qs: data });
};

/**
 * 获取用户信息
 * @returns {Request}
 */
exports.getDetailUserList = function () {
  return request.post('/customer/user/getDetailTree');
};
/**
 * 获取组织结构
 * @returns {Request}
 */
exports.getProjectOrganizationList = function () {
  return request.get('/customer/organize/allList');
};
/**
 * 获取组织接口的人员
 * @param data
 * @returns {Request}
 */
exports.getOrganizationEmployeeList = function (data) {
  return request.get('/customer/organize/oldOrganize', { qs: data });
};
/**
 * 获取项目简称
 * @returns {Request}
 */
exports.getProjectNickName = function () {
  return request.get('/customer/project/base');
};
/**
 * 获取职务信息
 * @returns {Request}
 */
exports.getPostEmployeeList = function () {
    return request.get('/customer/system/getPostEmpl');
};

exports.getPostEmployeeFindById = function (id) {
    return request.get('/customer/system/post/' + id);
};