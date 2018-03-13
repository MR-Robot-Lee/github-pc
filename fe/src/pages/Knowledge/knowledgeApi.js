var request = require('../../helper/request');
/**
 * 获取所有知识类型记录
 * @returns {Request}
 */
exports.getKnowledgeList = function getKnowledgeList () {
  return request.get('/customer/knowledge/allKnowsType');
};
/**
 * 保存类型
 * @param data
 * @returns {Request}
 */
exports.postKnowledgeType = function postKnowledgeType (data) {
  return request.post('/customer/knowledge/knowsType', { body: data });
};
/**
 * 通过id更新知识类型
 * @param data
 * @returns {Request}
 */
exports.putKnowledgeType = function putKnowledgeType (data) {
  return request.put('/customer/knowledge/knowsType/' + data.id, { body: data });
};
/**
 * 通过id删除知识类型
 * @param id
 */
exports.delKnowledgeType = function delKnowledgeType (id) {
  return request.del('/customer/knowledge/knowsType/' + id);
};
/**
 * 获取所有知识
 * @param data
 * @returns {Request}
 */
exports.getKnowledgeAllList = function getKnowledgeAllList (data) {
  data = data || {};
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/knowledge/findAll', { qs: data });
};
/**
 * 添加知识
 * @param data
 * @returns {Request}
 */
exports.postKnowledge = function postKnowledge (data) {
  return request.post('/customer/knowledge/base', { body: data });
};
/**
 * 修改知识
 * @param data
 * @returns {Request}
 */
exports.putKnowledge = function (data) {
  return request.put('/customer/knowledge/base/' + data.id, { body: data });
};
/**
 * 通过id删除知识
 * @param id
 */
exports.delKnowledge = function delKnowledge (id) {
  return request.del('/customer/knowledge/base/' + id);
};
/**
 * 添加浏览记录
 * @param data
 * @returns {Request}
 */
exports.postBorwserRecord = function postBorwserRecord (data) {
  return request.post('/customer/knowledge/borwseRecord', { body: data });
};
/**
 * 通过公司编号跟id 查找知识
 * @returns {Request}
 */
exports.getFindCompanyNoAndIdByKnowledge = function getFindCompanyNoAndIdByKnowledge (data) {
  return request.get('/customer/knowledge/findOne', { qs: data });
};
/**
 * 通过公司编号 跟id 查找知识类型
 * @param data
 * @returns {Request}
 */
exports.getFindCompanyNoAndIdByKnowledgeType = function getFindCompanyNoAndIdByKnowledgeType (data) {
  return request.get('/customer/knowledge/oneKnowType', { qs: data });
};
/**
 * 查询所有浏览记录
 * @param data
 * @returns {Request}
 */
exports.getBrowerRecordList = function getBrowerRecordList (data) {
  return request.get('/customer/knowledge/allBorwseRecord', { qs: data });
};
/**
 * 通过类型获取
 * @param data
 * @returns {Request}
 */
exports.getAllKnowledgeFindBy = function getAllKnowledgeFindBy (data) {
  data = data || {};
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  return request.get('/customer/knowledge/allKnowsByType', { qs: data });
};