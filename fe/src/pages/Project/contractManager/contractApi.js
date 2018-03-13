var request = require('../../../helper/request');
/**
 * 核算资源获取
 * @param data
 */
exports.getResourceContract = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || 10;
    data.pageNo = data.pageNo || 1;
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/contract/bud', {qs: data});
};
/**
 * 添加合同
 * @param data
 */
exports.postResourceContract = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/contract/contract', {body: data});
};
/**
 * 修改合同
 * @param data
 */
exports.putResourceContract = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.put('/customer/contract/contract/' + data.id, {body: data});
};
/**
 * 根据status 执行相应的操作 3开启 7 中止 8 删除
 * @param data
 * @constructor
 */
exports.FindStatusResourceContract = function (data) {
    data = data || {};
    data.status = data.status || 8;
    return request.del('/customer/contract/contract?id=' + data.id + '&status=' + data.status);
};
/**
 * 通过id删除合同子目
 * @param data
 */
exports.delContractSubItem = function (data) {
    data = data || {};
    data.cntrId = $('#contractDetail').data('id');
    return request.del('/customer/contract/cntrSubitem?id=' + data.id + '&cntrId=' + data.cntrId);
};
/**
 * 获取合同的子目
 * @param data
 * @returns {Request}
 */
exports.getContractSubItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.cntrId = data.cntrId || $('#contractDetail').data('id');
    return request.get('/customer/contract/cntrSubitem?projId=' + data.projId + '&cntrId=' + data.cntrId);
};
/**
 * 添加合同子目
 * @param data
 * @returns {Request}
 */
exports.postContractSubItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.cntrId = $('#contractDetail').data('id');
    data.subProjId = $('#contractFormulation').data('item').subProjId;
    return request.post('/customer/contract/cntrSubitem', {body: data});
};
/**
 * 修改合同子目
 * @param data
 */
exports.putContractSubItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.cntrId = $('#contractDetail').data('id');
    data.subProjId = $('#contractFormulation').data('item').subProjId;
    return request.put('/customer/contract/cntrSubitem/' + data.id, {body: data});
}
/**
 * 查询某个合同的内容
 * @param data
 */
exports.getContractDetailContent = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.cntrId = $('#contractDetail').data('id');
    return request.get('/customer/contract/cntrBase', {qs: data});
};
/**
 * 合同汇总
 */
exports.getSumContract = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.subProjId = data.subProjId || 0;
    return request.get('/customer/contract/contract', {qs: data});
};

/**
 * 获取分部列表
 * @returns {Request}
 */
exports.getSubProjectList = function () {
    var projId = $('#projectSchedule').data('id');
    return request.get('/customer/subProj/base/' + projId);
};
/**
 * 获取供应商类型
 * @returns {Request}
 */
exports.getSupplierTypeList = function () {
    return request.get('/customer/enterpise/type');
};
/**
 * 获取供应商列表
 */
exports.getSupplierList = function (data) {
    return request.get('/customer/enterpise/baseByType', {qs: data});
};
/**
 * 添加合同详情
 * @param data
 * @returns {Request}
 */
exports.postContractDetailContent = function (data) {
    return request.post('/customer/contract/contract/other', {body: data});
};

/**
 * 提交审批
 * @param data
 * @returns {Request}
 */
exports.postApprovalSubmit = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/contract/approve?projId=' + data.projId + '&cntrId=' + data.cntrId + '&tmplId=' + data.tmplId);
};
/**
 * 获取合同的材料
 * @param id
 * @returns {Request}
 */
exports.getContractMaterialList = function () {
    var id = $('#contractDetail').data('id');
    return request.get('/customer/contract/cntrMtrl', {qs: {cntrId: id}});
};
/**
 * 添加合同的材料
 * @param data
 * @returns {Request}
 */
exports.postContractMaterial = function (data) {
    data = data || {};
    data.cntrId = $('#contractDetail').data('id');
    return request.post('/customer/contract/cntrMtrl', {body: data});
};

exports.getContractSubItemDetail = function (data) {
    data = data || {};
    data.cntrId = $('#contractDetail').data('id');
    return request.get('/customer/contract/cntrSubitem/detail', {qs: data});
};
/**
 * 删除合同子目中的材料
 * @param data
 * @returns {*}
 */
exports.delContractSubItemDetail = function (data) {
    data = data || {};
    data.cntrId = $('#contractDetail').data('id');
    return request.del('/customer/contract/cntrSubitem/detail', {body: data});
}
/**
 * 通过id删除合同中的材料
 * @param data
 */
exports.delContractCntrMtrl = function (data) {
    return request.del('/customer/contract/cntrMtrl?id=' + data.id + '&cntrId=' + data.cntrId);
};

/**
 * 获取材料类型
 * @returns {Request}
 */
exports.getMaterialTree = function () {
    return request.get('/customer/material/categoryTree');
};
/**
 * 获取人工、措施、分包的用量
 * @param data
 * @returns {Request}
 */
exports.getUsedList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/contract/usedList', {qs: data});
};
/**
 * 获取合同里面的子目信息
 * @param data
 */
exports.getContractSubItemDetailList = function (data) {
    return request.get('/customer/contract/cntrSubitemDetail', {qs: data});
};



