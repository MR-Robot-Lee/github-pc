var request = require('../../helper/request');

/**
 * 获取材料历史信息
 * @param data
 * @returns {Request}
 */
exports.getMaterialHistoryList = function (data) {
    data = data || {};
    data.mtrlId = $('#materialHistoryId').data('hid');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/material/prchHistory', { qs: data })
};
/**
 * 添加材料历史采购
 * @param data
 * @returns {Request}
 */
exports.postMaterialHistory = function (data) {
    return request.post('/customer/material/history', { body: data });
};
/**
 * 删除材料的采购历史
 * @param id
 */
exports.delMaterialHistory = function (id) {
    return request.del('/customer/material/history/' + id);
};
/**
 * 更新材料历史采购
 * @returns {Request}
 */
exports.putMaterialHistory = function () {
    return request.put('/customer/material/history/' + data.id, { body: data });
};

/**
 * 分包历史 列表
 * @param data
 * @returns {Request}
 */
exports.getSubpackageList = function (data) {
    data = data || {};
    data.subletId = $('#subpackageHistoryId').data('hid');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/sublet/history', { qs: data })
};

/**
 * 分包历史 修改
 * @param data
 * @returns {Request}
 */
exports.putSubpackageList = function (data) {
    return request.get('/customer/sublet/history' + data.id, { body: data })
};


/**
 * 分包历史 添加
 * @param data
 * @returns {Request}
 */
exports.postSubpackageList = function (data) {
    return request.get('/customer/sublet/history', { body: data })
};


/**
 * 分包历史 删除
 * @param id
 * @returns {Request}
 */
exports.delSubpackageList = function (id) {
    return request.del('/customer/sublet/history' + id)
};
/**
 * 删除措施
 * @param id
 * @returns {Request}
 */
exports.delStepList = function (id) {
    return request.get('/customer/measure/history' + id);
};
/**
 * 获取措施 列表
 * @param data
 * @returns {Request}
 */
exports.getStepList = function (data) {
    data = data || {};
    data.measureId = $('#stepHistoryId').data('hid');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/measure/history', { qs: data });
};
/**
 * 添加措施
 * @param data
 * @returns {Request}
 */
exports.postStepList = function (data) {
    return request.get('/customer/measure/history', { body: data });
};
/**
 * 修改措施
 * @param data
 * @returns {Request}
 */
exports.putStepList = function (data) {
    return request.get('/customer/measure/history' + data.id, { body: data });
};

/**
 * 获取人力 列表
 * @param data
 * @returns {Request}
 */
exports.getLaborList = function (data) {
    data = data || {};
    data.laborId = $('#laborHistoryId').data('hid');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/labor/history', { qs: data })
};
/**
 * 修改人力
 * @param data
 * @returns {Request}
 */
exports.putLaborList = function (data) {
    data = data || {};
    return request.get('/customer/labor/history' + data.id, { body: data })
};

/**
 * 添加人力
 * @param data
 * @returns {Request}
 */
exports.postLaborList = function (data) {
    data = data || {};
    return request.get('/customer/labor/history', { body: data })
};

/**
 * 获取工人考勤 列表
 * @param data
 * @returns {Request}
 */
exports.getHrList = function (data) {
    data = data || {};
    data.workerNo = $('#hrHistoryId').data('workerno');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 100;
    return request.get('/customer/attend/getWorkAttend', { qs: data })
};

/**
 * 删除人力
 * @param id
 * @returns {Request}
 */
exports.delLaborList = function (id) {
    return request.get('/customer/labor/history' + id)
};

exports.getStepPriceMoney = function (data) {
    data = data || {};
    data.measureId = $('#stepHistoryId').data('hid');
    return request.get('/customer/measure/avgPriceMoney', { qs: data });
};

exports.getLaborPriceMoney = function (data) {
    data = data || {};
    data.laborId = $('#laborHistoryId').data('hid');
    return request.get('/customer/labor/avgPriceMoney', { qs: data });
};

exports.getMaterialPriceMoney = function (data) {
    data = data || {};
    data.mtrlId = $('#materialHistoryId').data('hid');
    return request.get('/customer/material/avgPriceMoney', { qs: data });
};

exports.getSubpackagePriceMoney = function (data) {
    data = data || {};
    data.subletId = $('#subpackageHistoryId').data('hid');
    return request.get('/customer/sublet/avgPriceMoney', { qs: data });
};

exports.getHrPriceMoney = function (data) {
    data = data || {};
    data.workerNo = $('#hrHistoryId').data('workerno');
    return request.get('/customer/attend/getWorkerInfo', { qs: data });
};

/**
 * 获取供应商历史
 * @param data
 * @returns {Request}
 */
exports.getSupplierList = function (data) {
    data = data || {};
    data.type = data.type || 1;
    data.entpId = $('#supplierHistoryId').data('hid');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/enterpise/history', { qs: data });
};

exports.getSupplierObjList = function () {
    var entpId = $('#supplierHistoryId').data('hid');
    return request.get('/customer/enterpise/history/' + entpId, { qs: { entpId: entpId } });
};
/**
 * 添加材料
 * @param data
 * @returns {Request}
 */
exports.postMaterialBase = function (data) {
    data = data || {};
    return request.post('/customer/material/base', { body: data });
};

/**
 * 获取措施价格波动
 * @param data
 * @returns {Request}
 */
exports.getMeasureCheckPrice = function (data) {
    data = data || {};
    return request.get('/customer/measure/history', { qs: data });
};

/**
 * 获取人工价格波动
 * @param data
 * @returns {Request}
 */
exports.getLaborCheckPrice = function (data) {
    data = data || {};
    return request.get('/customer/labor/history', { qs: data });
};

/**
 * 获取分包价格波动
 * @param data
 * @returns {Request}
 */
exports.getSubletCheckPrice = function (data) {
    data = data || {};
    return request.get('/customer/sublet/history', { qs: data });
};

/**
 * 获取材料价格波动
 * @param data
 * @returns {Request}
 */
exports.getMaterialCheckPrice = function (data) {
    data = data || {};
    return request.get('/customer/material/prchHistory', { qs: data });
};
/*
* 新建班组
* */
exports.postAddEntpTeam = function (data) {
    data = data || {};
    return request.post('/customer/attend/addEntpTeam', { body: data });
};
/*
* 新建工人
* */
exports.postAddWorker = function (data) {
    data = data || {};
    return request.post('/customer/attend/addWorker', { body: data });
};
/*
* 删除一条工人信息
* */
exports.delAddWorker = function (data) {
    data = data || {};
    return request.del('/customer/attend/delWorkById', { qs: data });
};
/*
* 查询所有班组
* */
exports.getAllEntpTeams = function (data) {
    data = data || {};
    return request.get('/customer/attend/getAllEntpTeams', { body: data });
};
/*
* 查询某一类型下的所有供应商
* */
exports.getEntpByTypeId = function (data) {
    data = data || {};
    return request.get('/customer/attend/getEntpByTypeId', { body: data });
};
/*
* 查询供应商类型
* */
exports.getEntpTypes = function (data) {
    data = data || {};
    return request.get('/customer/attend/getEntpTypes', { body: data });
};
/*
* 查询省市区列表
* */
exports.getRegion = function () {
    return request.get('/customer/attend/getRegion');
};
/*
* 条件查询某一班组下的工人
* */
exports.getWorksByCondition = function (data) {
    data = data || {};
    return request.get('/customer/attend/getWorksByCondition', { qs: data });
};
/*
* 查询出勤人员总数
* */
exports.postStaticsCounts = function (data) {
    data = data || {};
    return request.post('/customer/attend/staticsCounts', { body: data });
};
/*
* 修改班组名称
* */
exports.putUpdEntpTeamName = function (data) {
    data = data || {};
    return request.put('/customer/attend/updEntpTeamName', { body: data });
};
/*
* 修改工人信息
* */
exports.putUpdWorkerInfo = function (data) {
    data = data || {};
    return request.put('/customer/attend/updWorkerInfo', { body: data });
};
/*
* 修改工人考勤状态
* */
exports.postUpdWorkerStatus = function (data) {
    data = data || {};
    return request.post('/customer/attend/updWorkerStatus', { body: data });
};

/*
* 全局搜索企业库中的每个库
* */
exports.getSearchAllLibraryInfo = function (data) {
    data = data || {};
    return request.get('/customer/enterpise/getEntpInfoByConditions', {qs: data})
}