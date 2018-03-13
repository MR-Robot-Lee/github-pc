var request = require('../../../helper/request');
/**
 * 获取财务动态
 * @param data
 * @returns {Request}
 */
exports.getCostStatusList = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.get('/customer/finance/base/' + data.projId);
};
/**
 * 获取过程结算
 * @returns {Request}
 */
exports.getProcessList = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/finance/process/' + projId)
};
/**
 * 获取最终财务数据
 */
exports.getSettleList = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/finance/settle/' + projId);
}
/**
 * 编辑评估
 * @param data
 * @returns {Request}
 */
exports.postEditAssess = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/finance/judge', { body: data });
};
/**
 * 获取编辑信息
 * @returns {Request}
 */
exports.getEditAssess = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/finance/judge/' + projId);
}
/**
 * 获取费用汇总列表
 * @param data
 * @returns {Request}
 */
exports.getCostSumList = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/finance/cost', { qs: data });
};
/**
 * 应付款项
 * @param data
 * @returns {Request}
 */
exports.getFinancialPayList = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/finance/payable', { qs: data });
};
/**
 * 应付款申请
 * @param data
 * @returns {Request}
 */
exports.postFinancialPay = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/finance/payable', { body: data });
};
exports.putFinancialPay = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.put('/customer/finance/payable/' + data.id, { body: data });
}
/**
 * 我的账单
 * @param data
 * @returns {Request}
 */
exports.getFinancialMyBill = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/finance/myBill', { qs: data });
};
/**
 * 查询产值列表
 * @returns {Request}
 */
exports.getOutPutList = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/finance/output/' + projId);
};
/**
 * 添加产值
 * @param data
 * @returns {Request}
 */
exports.postOutPutObj = function (data) {
  data = data || {};
  if (typeof data.addTime === 'string') {
    data.addTime = new Date(data.addTime).getTime();
  }
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/finance/output/' + data.projId, { body: data });
};
/**
 * 通过id删除对应的产值
 * @param id
 */
exports.delOutPutObj = function (id) {
  return request.del('/customer/finance/output/' + id);
};
/**
 * 获取决算分部数据
 * @returns {Request}
 */
exports.getUpdateAccounts = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/finance/subProj/' + projId);
};
/**
 * 更新决算数据
 * @param data
 * @returns {Request}
 */
exports.putUpdateAccounts = function (data) {
  var projId = $('#projectSchedule').data('id');
  return request.put('/customer/finance/settle/' + projId, { body: data });
};
/**
 * 提交报销申请
 * @param data
 * @returns {Request}
 */
exports.postMyBillAccount = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/finance/myBill/account', { body: data });
};
/**
 * 提交报销审批
 * @param data
 * @returns {Request}
 */
exports.putMyBillAccount = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.put('/customer/finance/myBill/account/' + data.id, { body: data });
};
/**
 * 预付款申请
 * @param data
 * @returns {Request}
 */
exports.postMyBillPrepareMoney = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/finance/myBill/prepare', { body: data });
};
exports.putMyBillPrepareMoney = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.put('/customer/finance/myBill/prepare/' + data.id, { body: data });
}
/**
 * 通过id获取账单详情
 * @param id
 * @returns {Request}
 */
exports.getMyBillDetailFindById = function (id) {
  return request.get('/customer/finance/myBill/' + id);
};
/**
 * 获取付款关联的合同列表
 * @param data
 * @returns {Request}
 */
exports.getFinanceContractPrepay = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.get('/customer/finance/cntr/prepay', { qs: data });
};
/**
 * 结算单信息
 * @param payableId
 */
exports.getFinancePayabled = function (payableId) {
  return request.get('/customer/finance/payable/settle/' + payableId);
};
/**
 * 材料单费用结算查看
 * @param payableId
 * @returns {Request}
 */
exports.getFinanceMaterial = function (payableId) {
  return request.get('/customer/finance/payable/mtrlPlan/' + payableId);
};
/**
 * 查看付款记录
 * @param payableId
 * @returns {Request}
 */
exports.getPayabledListHistory = function (payableId) {
  return request.get('/customer/finance/payable/payList/' + payableId);
};
/**
 * 通过合同id获取付款记录
 * @param cntrId
 * @returns {Request}
 */
exports.getPayabledRecordList = function (cntrId) {
  return request.get('/customer/finance/payable/payList/cntr/' + cntrId);
};
/**
 * 应付账款结算
 * @param cntrId
 * @returns {Request}
 */
exports.getSettleCostList = function (cntrId) {
  return request.get('/customer/settle/cost/' + cntrId);
};
/**
 * 费用详情单
 * @param id
 * @returns {Request}
 */
exports.getFinanceCost = function (id) {
  return request.get('/customer/finance/cost/' + id);
}