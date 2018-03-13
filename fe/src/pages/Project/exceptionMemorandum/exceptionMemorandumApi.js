var request = require('../../../helper/request');


/**
 * 获取异常备忘
 * @param data
 * @returns {Request}
 */
exports.getExceptionList = function getExceptionList (data) {
  data = data || {};
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  data.projId = $("#projectSchedule").data("id");
  data.basicType = data.basicType || 0;
  return request.get('/customer/unusual/base', { qs: data });
};
/**
 * 创建异常备忘
 * @param data
 * @returns {Request}
 */
exports.postException = function postException (data) {
  data = data || {};
  data.projId = $("#projectSchedule").data("id");
  return request.post('/customer/unusual/base', {
    body: {
      basicType: data.basicType,
      remark: data.remark
    }
  });
};
/**
 * 更新异常备忘
 * @param data
 * @returns {Request}
 */
exports.putException = function putException (data) {
  data = data || {};
  return request.put('/customer/unusual/base/' + data.id, {
    body: {
      id: data.id,
      remark: data.remark
    }
  });
};
/**
 * 获取过程备忘
 * @param data
 * @returns {Request}
 */
exports.getProcessList = function getProcessList (data) {
  data = data || {};
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10;
  data.projId = $("#projectSchedule").data("id");
  return request.get('/customer/unusual/process', { qs: data })
};
/**
 * 创建过程备忘
 * @param data
 * @returns {Request}
 */
exports.postProcess = function postProcess (data) {
  data = data || {};
  data.projId = $("#projectSchedule").data("id");
  return request.post('/customer/unusual/process', {
    body: {
      projId: data.projId,
      remarkContent: data.remarkContent,
      remarkTitle: data.remarkTitle
    }
  })
};
/**
 * 更新过程备忘
 * @param data
 * @returns {Request}
 */
exports.putProcess = function putProcess (data) {
  data = data || {};
  data.projId = $("#projectSchedule").data("id");
  return request.put('/customer/unusual/process/' + data.id + "?projId=" + data.projId, {
    body: {
      remarkContent: data.remarkContent,
      remarkTitle: data.remarkTitle
    }
  })
};
/**
 * 通过id删除过程备忘
 * @param id
 */
exports.delProcess = function delProcess (id) {
  return request.del('/customer/unusual/process/' + id)
};
/**
 * 获取分部列表
 * @param id
 */
exports.getSubProjectList = function () {
    var projId = $('#projectSchedule').data('id');
    return request.get('/customer/subProj/base/' + projId);
};
