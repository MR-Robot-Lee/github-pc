var request = require('../../helper/request');


/**
 * 获取主页信息接口
 * @param data
 * @param callback
 */
exports.getProjectMain = function getProjectMain (data, callback) {
  data = data || {};
  data.projId = $("#projectSchedule").data('id');
  data.pageNo = data.pageNo || 1;
  data.pageSize = data.pageSize || 10000;
  data.noticeType = data.noticeType || 1;
  request.get('/customer/project/notice', { qs: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 创建主页信息内容
 * @param data
 * @param callback
 */
exports.postProjectMain = function postProjectMain (data, callback) {
  request.post('/customer/project/notice', {
    body: {
      noticeContent: data.noticeContent,
      noticeTitle: data.noticeTitle,
      noticeType: data.noticeType,
      attaches: data.attaches,
      projId: $("#projectSchedule").data('id')
    }
  }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 通过id更新主页信息
 * @param data
 * @param callback
 */
exports.putProjectMain = function putProjectMain (data, callback) {
  request.post('/customer/project/notice/' + data.id, {
    body: {
      noticeContent: data.content,
      noticeTitle: data.title,
      noticeType: data.type,
      projId: $("#projectSchedule").data('id')
    }
  }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 通过id删除主页内容
 * @param id
 * @param callback
 */
exports.delProjectMain = function delProjectMain (id, callback) {
    request.del('/customer/project/notice/' + id).then(function (res) {
        if (callback) {
            callback(res)
        }
    })
};
/**
 * 通过id修改主页内容
 * @param id
 * @param callback
 */
exports.putProjectMain = function putProjectMain (id, data) {
    return request.put('/customer/project/notice/' + id, {body:data});
};
/**
 * 获取日志工程
 * @param data
 * @param callback
 */
exports.getBlog = function getBlog (data, callback) {
  data = data || {};
  data.projId = $("#projectSchedule").data('id');
  data.remarkDate = data.remarkDate || moment().format('YYYYMMDD');
  request.get('/customer/project/blog', { qs: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 通过时间区间获取所有日志
 * @param start
 * @param end
 * @param callback
 */
exports.getBlogInterval = function getBlogInterval (start, end, callback) {
  var data = {};
  data.projId = $("#projectSchedule").data('id');
  data.startDate = moment(start).format("YYYYMMDD");
  data.endDate = moment(end).format('YYYYMMDD');
  request.get('/customer/project/blogTime', { qs: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 创建日志工程
 * @param data
 * @param callback
 */
exports.postBlog = function postBlog (data, callback) {
  data = data || {};
  data.projId = $("#projectSchedule").data('id');
  data.remarkDate = data.remarkDate.split('-').join('');
  request.post('/customer/project/blog', { body: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 更新日志工程
 * @param data
 * @param callback
 */
exports.putBlog = function putBlog (data, callback) {
  data = data || {};
  data.projId = $("#projectSchedule").data('id');
  request.put('/customer/project/blog/' + data.id, { body: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 通过id删除工程日志
 * @param id
 * @param callback
 */
exports.delBlog = function delBlog (id, callback) {
  request.put('/customer/project/blog/' + id, { qs: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 获取系统设置
 * @param data
 */
exports.getSystemSetting = function (data) {
  data = data || {};
  data.projId = $("#projectSchedule").data('id');
  return request.get('/customer/project/setting', { qs: data });
};
/**
 * 创建系统设置
 * @param data
 * @param callback
 */
exports.postSystemSetting = function postSystemSetting (data, callback) {
  data.projId = $("#projectSchedule").data('id');
  request.post('/customer/project/setting', { body: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 添加分部
 */
exports.postSubProject = function postSubProject (data, callback) {
  data.projId = $("#projectSchedule").data('id');
  request.post('/customer/subProj/name', { body: data }).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 通过id删除分部
 * @param id
 * @param callback
 */
exports.delSubProject = function delSubProject (id, callback) {
  var projId = $("#projectSchedule").data('id');
  request.del('/customer/subProj/base/' + projId + '/' + id).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 获取所有分部数据
 * @param callback
 */
exports.getSubProject = function getSubProject (callback) {
  var projId = $("#projectSchedule").data('id');
  request.get('/customer/subProj/base/' + projId).then(function (res) {
    if (callback) {
      callback(res);
    }
  })
};
/**
 * 获取系统信息
 * @returns {Request}
 */
exports.getSystemLogInfo = function () {
  var projId = $("#projectSchedule").data('id');
  var data = {};
  return request.get('/customer/project/sysLog/' + projId,{body:data});
};

exports.getBlogAuth = function () {
  var projId = $("#projectSchedule").data('id');
  return request.get('/customer/project/blog/auth/' + projId);
}



