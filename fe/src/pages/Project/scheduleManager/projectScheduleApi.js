var request = require('../../../helper/request');
/**
 * 获取进度计划列表
 * @param data
 * @param callback
 */
exports.getScheduleList = function getScheduleList (data, callback) {
  data = data || {};
  data.planType = $("#projectSchedule").data('type');
  data.projId = $("#projectSchedule").data("id");
  request.get('/customer/schedule/plan', { qs: data }).then(function (res) {
    if (callback) {
      callback(res)
    }
  })
};
/**
 * 创建进度计划
 * @param data
 * @param callback
 */
exports.postScheduleObj = function postScheduleObj (data, callback) {
  data.status = 1;
  data.planType = $("#projectSchedule").data('type');
  data.projId = $("#projectSchedule").data("id");
  /*data.planBeginTime = new Date(data.planBeginTime).getTime();
   data.planEndTime = new Date(data.planEndTime).getTime();*/
  request.post('/customer/schedule/plan/' + data.planType, { body: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 更新进度计划
 * @param data
 * @param callback
 */
exports.putScheduleObj = function putScheduleObj (data, callback) {
  data.projId = $("#projectSchedule").data("id");
  data.planType = $("#projectSchedule").data('type');
  data.status = 1;
  //data.planBeginTime = new Date(data.planBeginTime).getTime();
  //data.planEndTime = new Date(data.planEndTime).getTime();
  request.put('/customer/schedule/plan/' + data.id, { body: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 获取进度步聚
 * @param data
 * @param callback
 */
exports.getScheduleStepList = function getScheduleStepList (data) {
  data = data || {};
  data.projId = $("#projectSchedule").data("id");
  return request.get('/customer/schedule/step', { qs: data });
};
/**
 * 常见进度步聚
 * @param data
 * @param callback
 */
exports.postScheduleStepObj = function postScheduleStepObj (data, callback) {
  data.projId = $("#projectSchedule").data("id");
  data.planBeginTime = new Date(data.planBeginTime).getTime();
  data.planEndTime = new Date(data.planEndTime).getTime();
  request.post('/customer/schedule/step', { body: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 通过id更新进度步聚
 * @param data
 * @param callback
 */
exports.putScheduleStepObj = function putScheduleStepObj (data, callback) {
  data = data || {};
  data.projId = $("#projectSchedule").data("id");
  data.planBeginTime = new Date(data.planBeginTime).getTime();
  data.planEndTime = new Date(data.planEndTime).getTime();
  request.put('/customer/schedule/step/' + data.id, { body: [] }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 通过id删除计划步聚
 * @param data
 * @param callback
 */
exports.delScheduleStepObj = function delScheduleStepObj (data) {
  data = data || {};
  data.projId = $("#projectSchedule").data("id");
  return request.del('/customer/schedule/step/' + data.id + '?planId=' + data.planId + '&projId=' + data.projId);
};
/**
 * 添加进度计划历史
 * @param data
 */
exports.addScheduleHistory = function addScheduleHistory (data) {
  return request.post('/customer/schedule/history', { body: data });
};
/**
 * 获取历史列表
 * @param data
 * @returns {Request}
 */
exports.getScheduleHistory = function (data) {
  data = data || {};
  data.pageSize = data.pageSize || 10;
  data.pageNo = data.pageNo || 1;
  return request.get('/customer/schedule/history', { qs: data });
};
/**
 * 审批进度
 * @param data
 * @returns {Request}
 */
exports.postApprovalSchedule = function (data) {
  var projId = $("#projectSchedule").data("id");
  return request.post('/customer/schedule/approve?projId=' + projId + '&planId=' + data.planId, { body: data });
};
/**
 * 中止计划
 * @param data
 * @returns {Request}
 */
exports.postStopSchedule = function (data) {
  data = data || {};
  data.projId = $("#projectSchedule").data("id");
  return request.post('/customer/schedule/change', { body: data });
};
/**
 * 通过id删除计划
 * @param planId
 */
exports.delSchedule = function (planId) {
  var projId = $("#projectSchedule").data("id");
  return request.del('/customer/schedule/plan?projId=' + projId + '&planId=' + planId);
};