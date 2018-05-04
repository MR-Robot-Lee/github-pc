var request = require('../../helper/request');

/**
 * 我的申请
 * @param data
 * @returns {Request}
 */
exports.getMyApplyList = function (data) {
  data = data || {};
  data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
  data.pageSize = data.pageSize || $('.Page__size .item.active').text();
  return request.get('/customer/approve/myApply', { qs: data });
};
/**
 * 查看审批流程跟内容
 * @param data
 * @returns {Request}
 */
exports.getApplyContentAndProcess = function (data) {
  return request.get('/customer/approve/approve/' + data.id);
};
/**
 * 我的审批
 * @param data
 * @returns {Request}
 */
exports.getMyApproval = function (data) {
  data = data || {};
  data.tmplType = data.tmplType || 0;
  data.projId = data.projId || 0;
  data.apprStatus = data.apprStatus || 0;
  data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
  data.pageSize = data.pageSize || $('.Page__size .item.active').text();
  return request.get('/customer/approve/myApprove', { qs: data });
};
/**
 * 创建审批
 * @param data
 * @returns {Request}
 */
exports.postApproval = function (data) {
  return request.post('/customer/approve/approve', { body: data });
};
/**
 * 抄送给我
 * @param data
 * @returns {Request}
 */
exports.getApprovalCopy = function (data) {
  data = data || {};
  data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
  data.pageSize = data.pageSize || $('.Page__size .item.active').text();
  return request.get('/customer/approve/myCopy', { qs: data });
};
/**
 * 查看所有审批
 * @param data
 * @returns {Request}
 */
exports.getCheckAllApprovalList = function (data) {
  data = data || {};
  data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
  data.pageSize = data.pageSize || $('.Page__size .item.active').text();
  return request.get('/customer/approve/approve', { qs: data });
};
/**
 * 删除流程类型
 * @param id
 */
exports.delApprovalTempType = function (id) {
  return request.del('/customer/approve/temp/type/' + id);
};
/**
 * 添加流程类型
 * @param data
 * @returns {Request}
 */
exports.postApprovalTempType = function (data) {
  return request.post('/customer/approve/temp/type', { body: data });
};

exports.putApprovalTempType = function (data) {
  return request.put('/customer/approve/temp/type/' + data.id, { body: data });
};
/**
 * 获取流程类型
 * @returns {Request}
 */
exports.getApprovalTempType = function (data) {
  data = data || {};
  data.type = !data.type || data.type === 0 ? 0 : data.type;
  return request.get('/customer/approve/temp/type', { qs: data });
};
/**
 * 删除流程模版
 * @param id
 */
exports.delApprovalTemp = function (id) {
  return request.del('/customer/approve/temp/' + id);
};
/**
 * 添加 流程设置及节点、抄送设置
 * @param data
 * @returns {Request}
 */
exports.postTemp = function (data) {
  return request.post('/customer/approve/temp', { body: data });
};
/**
 * 更新流程
 * @param data
 * @returns {Request}
 */
exports.putTemp = function (data) {
  return request.put('/customer/approve/temp/' + data.id, { body: data });
};
/**
 * 通过id查找流程
 * @param id
 * @returns {Request}
 */
exports.getTempFindById = function (id) {
  return request.get('/customer/approve/temp/' + id);
};
/**
 * 通过id删除流程模版
 * @param id
 */
exports.delTemp = function (id) {
  return request.del('/customer/approve/temp/' + id);
};
/**
 * 获取流程设置
 * @param data
 * @returns {Request}
 */
exports.getTemp = function (data) {
  data = data || {};
  data.typeId = data.typeId || 0;
  return request.get('/customer/approve/temp', { qs: data });
};
/**
 * 新建立申请
 * @param data
 * @returns {Request}
 */
exports.postNewApply = function (data) {
  return request.post('/customer/approve/apply', { body: data });
};

exports.getProjectJobList = function () {
  return request.get('/customer/system/getProjPost');
};
/**
 * 查询某人所在的项目部列表
 * @returns {Request}
 */
exports.getProjectDepartment = function () {
  return request.get('/customer/approve/projDept');
};
/**
 * 获取工程
 * @returns {Request}
 */
exports.getProjectList = function () {
  return request.get('/customer/project/base');
};
/**
 * 获取所有用户
 * @returns {Request}
 */
exports.getAllUserList = function () {
  return request.get('/customer/user/all');
};
/**
 * 获取提醒数据
 * @returns {Request}
 */
exports.getRemindCount = function () {
  return request.get('/customer/approve/remind');
};
/**
 * 关闭/开启审批模板
 * @returns {Request}
 */
exports.putApprTemp = function (data) {
    data = data || {};
    return request.put('/customer/approve/switchApprTemp/', { body: data });
};