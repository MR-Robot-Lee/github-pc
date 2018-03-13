var request = require('../../../helper/request');

/**
 * 查询公司的项目部职务列表
 * @returns {Request}
 */
exports.getCompanyProjectJobList = function () {
  return request.get('/customer/organize/position');
};
/**
 * 查询组织结构
 * @param data
 * @returns {Request}
 */
exports.getOrganizeStrucList = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.get('/customer/organize/organize', { qs: data });
};
/**
 * 添加组织结构名称
 * @param data
 * @returns {Request}
 */
exports.postOrganizeStruc = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/organize/organize', { body: data });
};
/**
 * 更新组织结构名称
 * @param data
 * @returns {Request}
 */
exports.putOrganizeStruc = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.put('/customer/organize/organize/' + data.id + '?projDeptName=' + data.projDeptName);
};
/**
 * 查询组织中外来人员
 * @returns {Request}
 */
exports.getOrganizeFloatingPopulation = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.get('/customer/organize/newOrganize', { qs: data });
};
/**
 * 添加外来人员
 * @param data
 * @returns {Request}
 */
exports.postOrganizeFloatingPopulation = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/organize/newOrganize', { body: data });
};

exports.putOrganizeFloatingPopulation = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.put('/customer/organize/newOrganize/' + data.id, { body: data });
};
/**
 * 通过id删除组织中的外来人员
 * @param id
 */
exports.delOrganizeFloatingPopulation = function (id) {
  return request.del('/customer/organize/newOrganize/' + id);
};
/**
 * 添加外来人员职务备忘
 * @param data
 * @returns {Request}
 */
exports.postFloatingPopulationRemark = function (data) {
  return request.post('/customer/organize/newPosRemark/' + data.id + '?posRemark=' + data.posRemark);
};
/**
 * 查询组织中的公司人员
 * @returns {Request}
 */
exports.getOrganizeStrucEmployee = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/organize/oldOrganize', { qs: { projId: projId } });
};
/**
 * 添加组织中的人员并设置项目中的职务
 * @param data
 * @returns {Request}
 */
exports.postOrganizeStrucEmployee = function (data) {
  return request.post('/customer/organize/oldOrganize', { body: data });
};
/**
 * 通过id删除组织中的员工
 * @param id
 */
exports.delOrganizeStrucEmployee = function (id) {
  return request.del('/customer/organize/oldOrganize/' + id);
};

exports.postOrganizeStrucEmployeeRemark = function (data) {
  return request.post('/customer/organize/oldPosRemark/' + data.id + '?posRemark=' + data.posRemark);
};
/**
 * 获取所有职务
 * @returns {Request}
 */
exports.getSystemJobAllList = function () {
  return request.get('/customer/system/getProjPost');
};
/**
 * 创建审批或者保存数据
 * @param data
 * @returns {Request}
 */
exports.addOrganizeAndApproval = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/organize/organizeAll', { body: data });
};
/**
 * 公司项目职务列表
 * @returns {Request}
 */
exports.getOrganizePosition = function () {
  return request.get('/customer/organize/position');
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
/**
 *替换某一项目部人员
 * @returns {Request}
 */
exports.getTransOrganize  = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/organize/transOrganize', { qs: data });
};
/**
 *查看某一项目部人员负责的材料单、合同编号、财务单编号
 * @returns {Request}
 */
exports.getChargeDesc  = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/organize/getChargeDesc', { qs: data });
};