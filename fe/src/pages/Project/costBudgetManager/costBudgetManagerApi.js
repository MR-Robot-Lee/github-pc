var request = require('../../../helper/request');
/**
 * 获取工程下面分部的列表
 * @returns {Request}
 */
exports.getDivisionProjectList = function getDivisionProjectList() {
    var projId = $('#projectSchedule').data("id");
    return request.get('/customer/subProj/base/' + projId)
};
/**
 * 更新各分部下面的金钱
 * @param data
 * @returns {Request}
 */
exports.putDivisionProjectPrice = function putDivisionProjectPrice(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    return request.put('/customer/subProj/money/' + data.projId, {body: data.lists});
};
/**
 * 添加分部工程名字
 * @param data
 * @returns {Request}
 */
exports.postDivisionProjectName = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    return request.post('/customer/subProj/name', {body: data});
};
/**
 * 通过id 更新分部的名称
 * @param data
 * @returns {Request}
 */
exports.putDivisionProjectName = function putDivisionProjectName(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    return request.post('/customer/subProj/name/' + data.id, {body: data});
};
/**
 * 添加及修改成本预算评估
 * @returns {Request}
 */
exports.postCostEvaluate = function postCostEvaluate(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    return request.post('/customer/budget/project/judge', {body: data});
};
/**
 * 获取各项成本预算
 * @returns {Request}
 */
exports.getCostEvaluate = function getCostEvaluate() {
    var projId = $('#projectSchedule').data("id");
    return request.get('/customer/budget/project/' + projId)
};
/**
 * 通过id获取单个项目
 * @returns {Request}
 */
exports.getProjectIdFindSubProject = function getProjectIdFindSubProject() {
    var projId = $('#projectSchedule').data("id");
    var subId = $('#subId').data('id');
    return request.get('/customer/subProj/base/' + projId + '/' + subId);
};
/**
 * 获取子目的成本预算
 * @param data
 * @returns {Request}
 */
exports.getSubItemList = function getSubItemList(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    data.showType = data.showType || 0;
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    return request.get('/customer/subitem/base', {qs: data})
};
/**
 * 创建子目的基础数据
 * @param data
 * @returns {Request}
 */
exports.postSubItemList = function postSubItemList(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.post('/customer/subitem/base', {body: data});
};

/**
 * 通过id修改子目基础数据
 * @param data
 * @returns {Request}
 */
exports.putSubItemList = function putSubItemList(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.put('/customer/subitem/base/' + data.id, {body: data});
};
/**
 * 通过id删除子目基础数据
 * @param id
 */
exports.delSubItem = function delSubItem(id) {
    var projId = $('#projectSchedule').data("id");
    var subProjId = $('#subId').data('id');
    return request.del('/customer/subitem/base/' + projId + '/' + subProjId + '?subitemIds=' + id);
};

/**
 * 添加修改工程量
 * @param data
 */
exports.postQpy = function postQpy(data) {
    data = data || {};
    return request.put('/customer/subitem/qpy/' + data.id, {body: data});
};
/**
 * 获取成本预算里的材料分析
 * @param data
 * @returns {Request}
 */
exports.getMaterialSubItemList = function getMaterialSubItemList(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/material/budget/subitem', {qs: data});
};
/**
 * 通过subitemId添加子目预算里的材料
 * @param subitemId
 * @param list
 * @returns {Request}
 */
exports.postMaterialSubItemList = function postMaterialSubItemList(subitemId, list) {
    var projId = $('#projectSchedule').data("id");
    var subProjId = $('#subId').data('id');
    return request.post('/customer/material/budget/subitem', {
        body: {
            list: list,
            subitemId: subitemId,
            projId: projId,
            subProjId: subProjId
        }
    });
};
/**
 * 通过id修改子目预算里的材料
 * @param data
 * @returns {Request}
 */
exports.putMaterialSubItemList = function putMaterialSubItemList(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.post('/customer/material/budget/subitem', {body: data});
};
/**
 * 通过 subitemid 删除 对应的材料
 * @param data
 */
exports.delMaterialSubItemList = function delMaterialSubItemList(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.del('/customer/material/budget/subitem?projId=' + data.projId + '&subProjId=' + data.subProjId + '&subitemId=' + data.subitemId + '&ids=' + data.ids);
};

/**
 * 获取人工接口
 * @param data
 * @returns {Request}
 */
exports.getBudgetLaborSubProj = function getBudgetLaborSubProj(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    return request.get('/customer/labor/budget/subProj', {qs: data});
};
/**
 * 获取人工类型
 * @returns {Request}
 */
exports.getBudgetLaborSubType = function getBudgetLaborSubType() {
    return request.get('/customer/labor/type');
};
/**
 * 获取措施 接口
 * @returns {Request}
 */
exports.getBudgetStepSubproj = function getBudgetStepSubproj(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/measure/budget/subProj', {qs: data});
};
/**
 * 获取措施类型
 * @returns {Request}
 */
exports.getBudgetStepSubType = function getBudgetStepSubType() {
    return request.get('/customer/measure/type');
};

/**
 * 获取措施 接口
 * @returns {Request}
 */
exports.getBudgetSubpackageSubproj = function getBudgetSubpackageSubproj(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/sublet/budget/subProj', {qs: data});
};
/**
 * 获取分包类型
 * @returns {Request}
 */
exports.getBudgetSubpackageSubType = function getBudgetSubpackageSubType() {
    return request.get('/customer/sublet/type');
};

/**
 * 获取某个分部下面的材料
 * @param data
 * @returns {Request}
 */
exports.getBudgetMaterialList = function getBudgetMaterialList(data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/material/budget/subProj', {qs: data});
};
/**
 * 获取材料类型
 * @returns {Request}
 */
exports.getBudgetMaterialType = function getBudgetMaterialType() {
    return request.get('/customer/material/categoryTree');
};
/**
 * 查找某个子目预算里的人工
 * @returns {Request}
 */
exports.getBudgetLaborSubItem = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.get('/customer/labor/budget/subitem', {qs: data});
};
/**
 * 通过id删除预算里面的人工
 * @param data
 */
exports.delBudgetLaborSubItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.del('/customer/labor/budget/subitem?projId=' + data.projId + '&subProjId=' + data.subProjId + '&subitemId=' + data.subitemId + '&ids=' + data.ids);
};
/**
 * 通过id 保存预算里面的人工
 * @param data
 * @returns {Request}
 */
exports.postBudgetLaborSubItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.post('/customer/labor/budget/subitem', {body: data});
};
/**
 * 通过id修改预算里面的人工
 * @param data
 * @returns {Request}
 */
exports.putBudgetLaborSubItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.put('/customer/labor/budget/subitem?projId=' + data.projId + '&subProjId=' + data.subProjId + '&subitemId=' + data.subitemId, {body: data});
};

/**
 * 获取预算里面的分包
 * @param data
 * @returns {Request}
 */
exports.getBudgetSubletItem = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.get('/customer/sublet/budget/subitem', {qs: data});
};
/**
 * 通过id删除子目里面的预算
 * @param data
 */
exports.delBudgetSubletItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.del('/customer/sublet/budget/subitem?projId=' + data.projId + '&subProjId=' + data.subProjId + '&subitemId=' + data.subitemId + '&ids=' + data.ids);
};
/**
 * 创建预算里面的分包
 * @param data
 * @returns {Request}
 */
exports.postBudgetSubletItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.post('/customer/sublet/budget/subitem', {body: data});
};
/**
 * 通过id更新预算里面的分包
 * @param data
 * @returns {Request}
 */
exports.putBudgetSubletItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.post('/customer/sublet/budget/subitem?projId=' + data.projId + '&subProjId=' + data.subProjId + '&subitemId=' + data.subitemId, {body: data});
};
/**
 * 获取预算里的措施
 * @param data
 * @returns {Request}
 */
exports.getBudgetMeasureItem = function (data) {
    data = data || {};
    data.pageSize = data.pageSize || $('.Page__size .item.active').text();
    data.pageNo = data.pageNo || $('.Page__pages .item.active').text();
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.get('/customer/measure/budget/subitem', {qs: data});
};
/**
 * 通过id删除预算里的措施
 * @param data
 */
exports.delBudgetMeasureItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.del('/customer/measure/budget/subitem?projId=' + data.projId + '&subProjId=' + data.subProjId + '&subitemId=' + data.subitemId + '&ids=' + data.ids);
};

exports.postBudgetMeasureItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.post('/customer/measure/budget/subitem', {body: data});
};
/**
 * 更新预算里的措施
 * @param data
 * @returns {Request}
 */
exports.putBudgetMeasureItem = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.post('/customer/measure/budget/subitem?projId=' + data.projId + '&subProjId=' + data.subProjId + '&subitemId=' + data.subitemId, {body: data});
};

/**
 * 获取材料在子目中的用量
 * @param data
 * @returns {Request}
 */
exports.getMaterialFindSubItemList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.get('/customer/material/budget/subitemQpy', {qs: data});
};

/**
 * 获取人工在子目中的用量
 * @param data
 * @returns {Request}
 */
exports.getLaborFindSubItemList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id') || data.subProjId;
    return request.get('/customer/labor/budget/subitemQpy', {qs: data});
};
/**
 * 获取措施在子目中的用量
 * @param data
 * @returns {Request}
 */
exports.getStepFindSubItemList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id') || data.subProjId;
    return request.get('/customer/measure/budget/subitemQpy', {qs: data});
};

exports.getSubpackageSubItemList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id') || data.subProjId;
    return request.get('/customer/sublet/budget/subitemQpy', {qs: data});
};
exports.getCostBudgetExceptionList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data("id");
    return request.get('/customer/unusual/list', {qs: data});
};

/**
 * 上传excel并解析
 * @returns {Request}
 */
exports.uploadExcel = function (file, progress) {
    var projId = $('#projectSchedule').data("id");
    var subProjId = $('#subId').data('id');
    return request.upload(file, progress, '/customer/budget/subitem/parse/' + projId + '/' + subProjId);
};
/**
 * 获取异常
 * @param data
 * @returns {Request}
 */
exports.getExceptionIdList = function (data) {
    data = data || {};
    data.projId = data.projId || $('#projectSchedule').data("id");
    return request.get('/customer/unusual/list', {qs: data});
};
/**
 * 添加异常信息
 * @param data
 * @returns {Request}
 */
exports.postExceptionObj = function (data) {
    return request.put('/customer/unusual/base/' + data.id, {body: data});
};

exports.putBudgetPrice = function (data) {
    data = data || {};
    data.projId = data.projId || $('#projectSchedule').data("id");
    data.subProjId = $('#subId').data('id');
    return request.put('/customer/budget/subProj/price', {body: data});
};

/**
 * 复制某一字目的成本预算
 * @param data
 * @returns {Request}
 */
exports.postCopyChild = function (data) {
    data = data || {};
    return request.post('/customer/budget/subitem/copy', {body: data});
};

/**
 * 
 * @param data 
 */
exports.getEntpInfoByConditions = function (data) {
    data = data || {};
    return request.get('/customer/enterpise/getEntpInfoByConditions', {qs: data});
}