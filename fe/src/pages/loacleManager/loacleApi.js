var request = require('../../helper/request');

/**
 * 获取项目列表
 * @returns {Request}
 */
exports.getProjectList = function (data) {
  data = data || {};
  data.projState = data.projState || 0;
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || $('.Page__size .item.active').text();
  return request.get('/customer/scene/projList', { qs: data });
};
/**
 * 关注的项目
 * @param id
 * @returns {Request}
 */
exports.getAttentionProject = function (id) {
  return request.get('/customer/scene/focus/' + id);
};
/**
 * 取消关注的项目
 * @param id
 */
exports.delAttentionProject = function (id) {
  return request.del('/customer/scene/focus/' + id);
};

exports.getSceneList = function (data) {
  data = data || {};
  data.timeType = data.timeType || 0;
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || $('.Page__size .item.active').text() || 10;
    return request.get('/customer/scene/list', { qs: data });
};
/**
 * 撤销某一现场
 * @param id
 */
exports.delSceneCancel = function (id) {
  return request.del('/customer/scene/cancle/' + id);
};
