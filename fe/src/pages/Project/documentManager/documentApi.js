var request = require('../../../helper/request');

/**
 * 获取文档类别
 * @returns {Request}
 */
exports.getCategoryType = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/projFile/category/' + projId);
};
/**
 * 创建文档类型
 * @returns {Request}
 */
exports.postCategoryType = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/projFile/category', { body: data });
};
/**
 * 通过id删除类型
 * @param id
 */
exports.delCategoryType = function (id) {
  var projId = $('#projectSchedule').data('id');
  return request.del('/customer/projFile/category/' + id + '/' + projId);
};
/**
 * 通过id修改类型
 * @param data
 * @returns {Request}
 */
exports.putCategoryType = function (data) {
    var projId = $('#projectSchedule').data('id');
    data.projId = projId;
    return request.put('/customer/projFile/category/' + data.id, { body: data });
};
/**
 * 通过文档类型获取二级数据
 * @param data
 * @returns {Request}
 */
exports.getFileType = function (data) {
  return request.get('/customer/projFile/type', { qs: data });
};
/**
 * 通过文档类型添加二级数据
 * @param data
 * @returns {Request}
 */
exports.postFileType = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/projFile/type', { body: data });
};
/**
 * 通过id跟文档类型
 * @param data
 * @returns {Request}
 */
exports.putFileType = function (data) {
    data.projId = $('#projectSchedule').data('id');
    return request.put('/customer/projFile/type/' + data.id, { body: data });
};
/**
 * 通过id删除文档类型
 * @param id
 * @returns {Request}
 */
exports.delFileType = function (id) {
  return request.del('/customer/projFile/type/' + id);
};
/**
 * 查找项目文档
 * @param data
 * @returns {Request}
 */
exports.getBaseList = function (data) {
  data = data || {};
  data.pageSize = data.pageSize || 10000;
  data.pageNo = data.pageNo || 1;
  return request.get('/customer/projFile/base', { qs: data });
};
/**
 * 添加文档
 * @param data
 * @returns {Request}
 */
exports.postBase = function (data) {
  return request.post('/customer/projFile/base', { body: data });
};
/**
 * 通过id删除
 * @param id
 */
exports.delBase = function (id) {
  return request.del('/customer/projFile/base/' + id);
};
/**
 * 通过id修改文档
 * @param data
 * @returns {Request}
 */
exports.putBase = function (data) {
  return request.put('/customer/projFile/base/' + data.id, { body: data });
};
/**
 * 获取类型树形结构
 * @returns {Request}
 */
exports.getTypeTree = function () {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/projFile/categoryTree/' + projId);
};

/**
 * 移动文档类型
 * @param data
 * @returns {Request}
 */
exports.putMoveFile = function (data) {
  var projId = $('#projectSchedule').data('id');
  return request.put('/customer/projFile/typeTrans?oldCategoryId=' + data.oldCategoryId + '&typeId' + data.typeId + '&newCategoryId=' + data.newCategoryId + '&projId=' + projId);
};
/**
 * 移动文档table数据
 * @param data
 * @returns {Request}
 */
exports.putMoveFileTable = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.put('/customer/projFile/baseTrans', { body: data });
};
/**
 * 获取下载历史
 * @param data
 * @returns {Request}
 */
exports.getHistoryDownloadList = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  data.pageSize = data.pageSize || 10;
  data.pageNo = data.pageNo || 1;
  return request.get('/customer/projFile/downHistory', { qs: data });
};

/**
 * 上传文件
 * @param file
 * @param progress
 * @param Category
 * @param type
 * @returns {*}
 */
exports.uploadFile = function (file, progress, Category, type) {
  var projId = $('#projectSchedule').data('id');
  return request.upload(file, progress, '/customer/projFile/upload/' + projId + '/' + Category + '/' + type)
};


/**
 * 下载
 * @param data
 * @returns {Request}
 */
exports.download = function (data) {
  return request.get('/customer/attach/download', { qs: data });
};
/**
 * 添加下载记录
 * @param data
 * @returns {Request}
 */
exports.postDownload = function (data) {
  data = data || {};
  data.projId = $('#projectSchedule').data('id');
  return request.post('/customer/projFile/downHistory', { body: data })
};

