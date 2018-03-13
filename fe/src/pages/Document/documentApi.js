var request = require('../../helper/request');
/**
 * 获取所有用户信息
 * @returns {Request}
 */
exports.getAllUserList = function () {
  return request.get('/customer/user/all');
};
/**
 * 获取用户树形列表
 * @returns {Request}
 */
exports.getUserTreeList = function () {
  return request.post('/customer/user/getTree');
};
/**
 * 新建文件柜
 * @param data
 * @returns {Request}
 */
exports.postFileCabinet = function (data) {
  return request.post('/customer/document/addFileCabinet', { body: data });
};
/**
 * 修改文件柜
 * @param data
 * @returns {Request}
 */
exports.putFileCabinet = function (data) {
  return request.put('/customer/document/updFileCabinet/' + data.id, { body: data });
};

exports.getFileCabinet = function (data) {
  data = data || {};
  data.typeNo = data.typeNo || 1;
  data.parentId = data.parentId || 0;
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/document/getFileCabinet', { qs: data });
};
/**
 * 通过id删除文件柜
 * @param data {ids:[]}
 */
exports.delFileCabinet = function (data) {
  return request.del('/customer/document/delFileCabinet', { body: data });
};
/**
 * 添加文件
 * @param data
 * @returns {Request}
 */
exports.postFile = function (data) {
  data = data || {};
  data.parentId = data.parentId || $('.document-menus').data('id');
  return request.post('/customer/document/addFile', { body: data });
};
/**
 * 通过id修改文件
 * @param data
 * @returns {Request}
 */
exports.putFile = function (data) {
  return request.put('/customer/document/updFile/' + data.id, { body: data });
};
/**
 * 添加下载记录
 * @param data
 * @returns {Request}
 */
exports.postDownload = function (data) {
  return request.post('/customer/document/addDownload?fileId=' + data.fileId, { body: data });
};
/**
 * 通过id获取下载列表
 * @param data
 * @returns {Request}
 */
exports.getDownload = function (data) {
  return request.get('/customer/document/getDownload', { qs: data });
};
/**
 * 通过id获取文件详情
 * @param data
 * @returns {Request}
 */
exports.getFileCabinetAttr = function (data) {
  return request.get('/customer/document/getFileCabintAttr', { qs: { cbntId: data.id } });
};
/**
 * 获取文件柜管理
 * @param data
 * @returns {Request}
 */
exports.getFileCabinetManager = function (data) {
  data = data || {};
  data.parentId = data.parentId || 0;
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/document/getMangerFileList', { qs: data });
};
/**
 * 上传文件
 * @param file
 * @param progress
 * @param pId
 * @returns {*}
 */
exports.uploadFile = function (file, progress, pId) {
  return request.upload(file, progress, '/customer/document/upload/' + pId)
};
/**
 * 上传权限查询
 * @param file
 * @param progress
 * @param pId
 * @returns {*}
 */
exports.checkPermission = function (pId) {
    return request.get('/customer/document/checkPermission/' + pId)
};

/**
 * 返回上一级
 * @param data
 * @returns {Request}
 */
exports.getCallBackList = function (data) {
  data = data || {};
  data.pId = $('.document-menus').data('id');
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/document/getParentFileList', { qs: data });
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
 * 移动文件
 * @param data
 * @returns {Request}
 */
exports.putMoveFile = function (data) {
  return request.put('/customer/document/moveFile?targetId=' + data.targetId, { body: data });
};
/**
 * 获取文件树形结构
 * @param data
 * @returns {Request}
 */
exports.getFileTree = function (data) {
  return request.get('/customer/document/getFolderTree', { qs: data });
};
/**
 * 获取文件柜权限
 * @returns {Request}
 */
exports.getFileCabintPermission = function (data) {
  return request.get('/customer/document/getFileCabintPermission', { qs: data });
};



