var request = require('../../../helper/request');
/**
 * 获取结算单列表
 * @param data
 * @returns {Request}
 */
exports.getBalanceList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.myType = data.myType || 0;
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/settle/list', {qs: data});
};
/**
 * 通过id获取对应的结算
 * @param data
 * @returns {Request}
 */
exports.getBalanceFindById = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/settle/settle', {qs: data});
};
/**
 * 创建有合同的结算
 * @param data
 * @returns {Request}
 */
exports.postHaveContractBalance = function (data) {
    return request.post('/customer/settle/haveCntr', {body: data});
};
/**
 * 修改有合同的结算
 * @param data
 * @returns {Request}
 */
exports.putHaveContractBalance = function (data) {
    return request.put('/customer/settle/haveCntr/' + data.id, {body: data});
};
/**
 * 通过id删除结算单
 * @param id
 */
exports.delContractBalance = function (id) {
    return request.del('/customer/settle/settle?cntrId=' + id)
};
/**
 * 添加无合同的结算
 * @param data
 * @returns {Request}
 */
exports.postNoContractBalance = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/settle/noCntr', {body: data});
};
/**
 * 修改无合同的结算
 * @param data
 * @returns {Request}
 */
exports.putNoContractBalance = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.put('/customer/settle/noCntr/' + data.id, {body: data});
};
/**
 * 通过id删除子目
 * @param data
 */
exports.delContractSubItemFindById = function (data) {
    return request.del('/customer/settle/cntrSubitem?id=' + data.id + '&cntrId=' + data.cntrId);
};
/**
 * 通过id 跟cntrId 获取 合同的子目
 * @param data
 * @returns {Request}
 */
exports.getContractSubItemFindByCntrId = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/settle/cntrSubitem', {qs: data});
};
/**
 * 保存结算
 * @param data
 * @returns {Request}
 */
exports.postBalanceObj = function (data) {
    return request.post('/customer/settle/save', {body: data});
};
/**
 * 添加合同内外的子目结算
 * @param data
 * @returns {Request}
 */
exports.postContractSubItemBalance = function (data) {
    return request.post('/customer/settle/settleSubitem/haveCntr', {body: data});
};
/**
 * 添加合同外子目的计算信息
 * @param data
 * @returns {Request}
 */
exports.postContractOutSubItemBalance = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/settle/settleSubitem/noCntr', {body: data});
};
/**
 * 通过id 删除某一合同的多个费用
 * @param data
 */
exports.delContractSubItemCostFindById = function (data) {
    return request.del('/customer/settle/cntrSubitem/detail', {body: data});
};
/**
 * 结算时增加子目信息
 * @param data
 * @returns {Request}
 */
exports.postBalanceAddSubItem = function (data) {
    return request.post('/customer/settle/settleSubitem', {body: data});
};
/**
 * 通过id 更新子目信息
 * @param data
 * @returns {Request}
 */
exports.putBalanceAddSubItem = function (data) {
    return request.put('/customer/settle/settleSubitem/' + data.id, {body: data});
};
/**
 * 查看费用单
 * @param data
 * @returns {Request}
 */
exports.getBalanceCostOrder = function (data) {
    return request.post('/customer/settle/cost/' + data.cntrId);
};
/**
 * 更新结算费用单
 * @param data
 * @returns {Request}
 */
exports.putBalanceCostOrder = function (data) {
    return request.put('/customer/settle/cost/' + data.id, {body: data});
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
 * 获取所有未结算的合同
 * @returns {Request}
 */
exports.getContractNoBalanceList = function () {
    var projId = $('#projectSchedule').data('id');
    return request.get('/customer/settle/unSettleCntr', {qs: {projId: projId}});
};
/**
 * 获取资源列表
 * @param data
 * @returns {Request}
 */
exports.putResourceContract = function (data) {
    data = data || {};
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    data.projId = $('#projectSchedule').data('id');
    var url = '/customer/settle/cntr?projId=' + data.projId + '&settleStatus=' + data.settleStatus + '&pageNo=' + data.pageNo + '&pageSize=' + data.pageSize;
    if (data.keywords) {
        url = url + '&keywords=' + data.keywords;
    }
    return request.put(url);
};
/**
 * 通过id获取子目对应的数据
 * @param data
 * @returns {Request}
 */
exports.getCntrSubItemDetailFindById = function (data) {
    return request.get('/customer/settle/cntrSubitem/detail', {qs: data});
};

exports.uploadImg = function (file, progress) {
    return request.upload(file, progress);
};
/**
 * 添加子目附件信息
 * @param data
 * @returns {Request}
 */
exports.addSubItemAttach = function (data) {
    return request.post('/customer/settle/cntrSubitem/attach', {body: data});
};


/**
 * 核算资源获取
 * @param data
 */
exports.getResourceContract = function (data) {
    data = data || {};
    // data.pageSize = data.pageSize || 10;
    data.pageSize = 10000;
    data.pageNo = data.pageNo || 1;
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/contract/bud', {qs: data});
};

