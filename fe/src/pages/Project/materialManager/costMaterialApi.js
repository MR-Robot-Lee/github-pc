var request = require('../../../helper/request');

/**
 * 添加材料计划名称
 * @param data
 * @returns {Request}
 */
exports.postMaterialPlanName = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/plan/name', {body: data});
};
/**
 * 通过id修改材料计划单名称
 * @param data
 * @returns {Request}
 */
exports.putMaterialPlanName = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.put('/customer/material/plan/name', {body: data});
};
/**
 * 通过id 删除材料计划
 * @param id
 */
exports.delMaterialPlan = function (id) {
    return request.del('/customer/material/plan/' + id);
};
/**
 * 获取材料计划单列表
 * @param data
 * @returns {Request}
 */
exports.getMaterialPlan = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    data.planStatus = data.planStatus || 0;
    data.type = data.type || 1;
    return request.get('/customer/material/plan', {qs: data});
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
 * 获取材料类型
 * @returns {Request}
 */
exports.getMaterialTree = function () {
    return request.get('/customer/material/categoryTree');
};
/**
 * 查找材料类型
 * @returns {Request}
 */
exports.getMaterialType = function (categoryId) {
    var data = data || {};
    data.categoryId = categoryId || 0;
    return request.get('/customer/material/type', {qs: data});
};
/**
 * 查找材料类别
 * @returns {Request}
 */
exports.getMaterialCategory = function () {
    return request.get('/customer/material/category');
};
/**
 * 查找某个分部预算的材料
 * @param data
 * @returns {Request}
 */
exports.getSubProjectMaterial = function (data) {
    data = data || {};
    // data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageSize = 10000;
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/budget/subProj/mtrlPlan', {qs: data});
};

exports.getEnterpriseMaterial = function (data) {
    data = data || {};
    // data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageSize = 10000;
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    return request.get('/customer/material/base', {qs: data});
};
/**
 * 获取我的任务
 * @param data
 * @returns {Request}
 */
exports.getMyTaskList = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/plan/myTask/' + data.projId);
};
/**
 * 获取库存量
 * @param data
 * @returns {Request}
 */
exports.getStockPlan = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data('id');
    data.type = data.type || 2;
    return request.get('/customer/material/plan/stock', {qs: data});
};
/**
 * 获取预算里的材料
 * @param data
 * @returns {Request}
 */
exports.getBudgetMaterialSubProj = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/budget/subProj', {qs: data});
};
/**
 * 采购汇总
 * @param data
 * @returns {Request}
 */
exports.getPurchaseSumList = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.mtrlSource = data.mtrlSource || 0;
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/planDetail/prch', {qs: data});
};
/**
 * 添加要买的材料
 * @param data
 * @returns {Request}
 */
/*exports.postPlanDetailList = function (data) {
 data = data || {};
 data.projId = $('#projectSchedule').data('id');
 return request.post('/customer/material/planDetail/base?projId=' + data.projId + '&subProjId=' + data.subProjId + '&mtrlPlanId=' + data.mtrlPlanId, { body: data });
 };*/
/**
 * 添加补单材料
 * @param data
 * @returns {Request}
 */
exports.postPlanSupplement = function (data) {
    data = data || {};
    data.projId = $('').data('id');
    return request.post('/customer/material/planDetail/addBase', {body: data})
};
/**
 * 通过id获取材料单
 * @param id
 * @returns {Request}
 */
exports.getPlanDetailFindByMtrilPlanId = function (id) {
    return request.get('/customer/material/plan/' + id);
};
/**
 * 获取材料的详情列表
 * @param data
 * @returns {Request}
 */
exports.getPlanDetail = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/planDetail', {qs: data});
};

/**
 * 更新要买材料预计价格及数量备忘
 * @param data
 * @returns {Request}
 */
exports.putPlanDetailCount = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.put('/customer/material/planDetail/count?projId=' +
        data.projId + '&mtrlPlanId=' + data.mtrlPlanId, {body: data});
};
/**
 * 删除计划要买的材料
 * @param id
 */
exports.delPlanDetail = function (id) {
    return request.del('/customer/material/planDetail/' + id);
};

/**
 * 获取所有用户信息
 * @returns {Request}
 */
/**
 * 获取用户树形列表
 * @returns {Request}
 */
exports.getUserTreeList = function () {
    return request.post('/customer/user/getTree');
};
/**
 * 添加采购信息跟计划时间
 * @param data
 * @returns {Request}
 */
exports.postPurshaseUser = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    var planAppearTime = new Date(data.planAppearTime).getTime();
    return request.post('/customer/material/plan/prchUserNo?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId + '&prchUserNo=' + data.prchUserNo + '&planAppearTime=' + planAppearTime);
};
/**
 * 添加采购信息
 * @param data
 * @returns {Request}
 */
exports.postPurchaseInfo = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/planDetail/prch?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId, {body: data});
};
/**
 * 获取采购
 * @param data
 * @returns {Request}
 */
exports.getPurchaseInfo = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/planDetail/prchHistory', {qs: data});
};
/**
 * 获取计划
 * @param data
 * @returns {Request}
 */
exports.getPalnInfo = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/planDetail/planHistory', {qs: data});
};
/**
 * 直传采购人
 * @param data
 * @returns {Request}
 */
exports.postPurch = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/plan/toPrch?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId);
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
 * 添加点收人和实际到场时间
 * @param data
 * @returns {Request}
 */
exports.postCheckAndUser = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    var time = new Date(data.realAppearTime).getTime();
    return request.post('/customer/material/plan/checkUserNo' +
        '?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId + '&checkUserNo=' + data.checkUserNo + '&realAppearTime=' + time);
};
/**
 * 提交点收
 * @param data
 * @returns {Request}
 */
exports.postCheckOverAndAccept = function (data) {
    var projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/plan/status?projId=' + projId + '&status=' + data.status + '&mtrlPlanId=' + data.mtrlPlanId);
};
/**
 * 添加点收个数信息
 * @param data
 * @returns {Request}
 */
exports.postCheckInfo = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/planDetail/check?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId, {body: data});
};
/**
 * 获取费用单列表
 * @param data
 * @returns {Request}
 */
exports.getCostMaterialList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    return request.get('/customer/material/plan/cost', {qs: data});
};
/**
 *  生成费用单
 * @param data
 * @returns {Request}
 */
exports.postCostMaterialOrder = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/planDetail/cost?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId);
};
/**
 * 为费用单添加名称及备忘
 * @param data
 * @returns {Request}
 */
exports.postCostMaterialOrderName = function (data) {
    return request.post('/customer/material/planDetail/costName/' + data.costId, {body: data});
};
/**
 * 通过id 查询材料费用单
 * @param data
 * @returns {Request}
 */
exports.getCheckMaterialCostOrder = function (data) {
    return request.get('/customer/material/planDetail/cost', {qs: data});
};

/**
 * 查找材料在子目下的应用
 * @param data
 * @returns {Request}
 */
exports.getCheckMaterialFindSubProj = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer//material/budget/subitemQpy', {qs: data});
};
/**
 * 添加出库记录
 * @param data
 * @returns {Request}
 */
exports.postOutBandHistory = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/planDetail/outBandHistory', {body: data});
};
/**
 * 查看某种材料的出库记录
 * @param data
 * @returns {Request}
 */
exports.getOutBandHistory = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/planDetail/outBandHistory', {qs: data});
};
/**
 * 添加招标计划要买的材料
 * @param data
 * @returns {Request}
 */
exports.postBidDetail = function (data) {
    return request.post('/customer/material/planBidDetail/base', {body: data});
};
/**
 * 中标信息添加
 * @param data
 * @returns {Request}
 */
exports.postBidSuccessDetail = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    data.mtrlPlanId = $('#materialPlanDetail').data('item').id;
    return request.post('/customer/material/planDetail/bid', {body: data});
};
exports.getBidDetailList = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/material/planBidDetail', {qs: data});
};
exports.delBidDetail = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.del('/customer/material/planBidDetail?projId=' + data.projId + '&mtrlId=' + data.mtrlId + '&id=' + id);
};
/**
 * 添加要买的材料
 * @param data
 * @returns {Request}
 */
exports.postPlanDetail = function (data) {
    return request.post('/customer/material/planDetail/base', {body: data});
};
/**
 * 提交审批
 * @param data
 * @returns {Request}
 */
exports.postPlanApprovae = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/material/plan/approve?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId + '&tmplId=' + data.tmplId);
};

/**
 * 删除提计划modal的数据
 * @param data
 */
exports.delMaterialPlanModal = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.del('/customer/material/planDetail?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId + '&id=' + data.id);
};

exports.delMaterialPurchModal = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.del('/customer/material/planBidDetail?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId + '&id=' + data.id)
};
/**
 * 通过材料单id获取总费用
 */
exports.getMaterialPlanCostFindByPlanId = function (mtrlId) {
    return request.get('/customer/material/plan/cost/' + mtrlId)
};
/**
 * 获取合同
 * @param data
 * @returns {Request}
 */
exports.getMaterialContractList = function (data) {
    return request.get('/customer/contract/contract/mtrl/unRelative', {qs: data});
}
/**
 * 删除采购编辑中材料
 * @param data
 */
exports.delMaterialPlan2 = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.del('/customer/material/planDetail/prch?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId + '&id=' + data.id);
};
/**
 * 删除中标编辑中材料
 * @param data
 */
exports.delBidSuccessPlan = function (data) {
    data.projId = $('#projectSchedule').data('id');
    return request.del('/customer/material/planDetail/bid?projId=' + data.projId + '&mtrlPlanId=' + data.mtrlPlanId + '&id=' + data.id);
};

exports.getWorkers = function (data) {
    data = data || {};
    return request.get('/customer/attend/getWorkers', {qs: data});
}

exports.postAddOrder = function(data){
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/mtrlOrder/addOrder', {body: data});

}