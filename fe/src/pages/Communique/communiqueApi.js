var request = require('../../helper/request');

/**
 * 获取栏目列表
 * @returns {Request}
 */
exports.getCommuniqueType = function () {
  return request.get('/customer/announce/getType');
};
/**
 * 创建栏目
 * @param data
 * @returns {Request}
 */
exports.postCommuniqueType = function (data) {
  return request.post('/customer/announce/addType', { body: data });
};
/**
 * 通过id更新栏目
 * @param data
 * @returns {Request}
 */
exports.putCommuniqueType = function (data) {
  return request.put('/customer/announce/modifyType?id=' + data.id, { body: data });
};
/**
 * 通过id删除栏目
 * @param id
 */
exports.delCommuniqueType = function (id) {
  return request.del('/customer/announce/delType?id=' + id);
};
/**
 * 添加公告
 * @param data
 * @returns {Request}
 */
exports.postCommunique = function (data) {
  return request.post('/customer/announce/addAnnounce', { body: data });
};
/**
 * 通过id删除公告
 * @param id
 */
exports.delCommunique = function (id) {
  return request.del('/customer/announce/delAnnounce?id=' + id);
};
/**
 * 查询公告
 * @param data
 * @returns {Request}
 */
exports.getCommunique = function (data) {
  data = data || {};
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer//announce/getAnnounce', { qs: data });
};
/**
 * 通过id查询具体公告
 * @param id
 * @returns {Request}
 */
exports.getCommuniqueById = function (id) {
  return request.get('/customer/announce/getAnnDetail', { qs: { id: id } });
};
/**
 * 修改公告信息
 * @param data
 * @returns {Request}
 */
exports.putCommunique = function (data) {
  return request.put('/customer/announce/updAnnounce?id='+data.id, { body: data });
};
/**
 * 添加浏览记录
 * @param data
 * @returns {Request}
 */
exports.postBrowRecord = function (data) {
  return request.post('/customer/announce/addBrowRec', { body: data });
};
/**
 * 查询浏览记录
 * @param data
 * @returns {Request}
 */
exports.getBrowRecord = function (data) {
  return request.get('/customer/announce/getBrowRec', { qs: data });
};
/**
 * 查询未浏览记录
 * @param data
 * @returns {Request}
 */
exports.getUnBrowRecord = function (data) {
  data = data || {};
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/announce/getUnBrowRec', { qs: data });
};
/**
 * 添加评论
 * @param data
 * @returns {Request}
 */
exports.postComment = function (data) {
  return request.post('/customer/comment/addComment', { body: data });
};
/**
 * 获取评论
 * @param data
 * @returns {Request}
 */
exports.getComment = function (data) {
  data = data || {};
  data.moduleId = '7';
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.post('/customer/comment/findComments', { body: data });
};

