var request = require('../../helper/request');


exports.getInnerType = function (innerObjId, innerType, parents) {
  var projId = $('#projectSchedule').data('id');
  return request.get('/customer/approve/approve/inner/' + innerObjId + '/' + innerType + '/' + projId).then(function (res) {
    var obj = res.data ? res.data : {};
    renderApprovalDom(obj, parents);
  });
};

function renderApprovalDom (obj, _parents) {
  _parents.find('[name=apprStatus]').text(approvalType(obj.apprStatus));
  _parents.find('[name=applyUserName]').text(obj.applyUserName);
  _parents.find('[name=applyTime]').text(moment(obj.applyTime).format('YYYY/MM/DD'));
  _parents.find('[name=applyContent]').text(obj.applyContent);
  _parents.find('[name=projectName]').text(obj.projectName);
  var attaches = obj.attaches || [];
  for (var i = 0, length = attaches.length; i < length; i++) {
    var attach = attaches[i];
    var parents = _parents.find('.attach-list').html('');
    var dom = $("<div class='attach-item'>\
    <div class='icon icon-none'></div>\
      <div class='detail'>\
      <div class='filename'>" + attach.attachName + "</div>\
      <div class='remove'>\
      <a href=" + window.API_PATH + '/customer/attach/download?filePath=' + item.attachUrl + ">下载</a>\
      </div>\
      </div>\
      </div>");
    dom.appendTo(parents);
  }
  var histories = obj.histories || [];
  var projectShow = _parents.find('#projectShow');
  if (histories.length > 0) {
    if (projectShow.is(':hidden')) {
      projectShow.show();
    }
  } else {
    if (!projectShow.is(':hidden')) {
      projectShow.hide();
    }
  }
  var $parents = _parents.find('.approval-process').html('');
  var list = [];
  for (var j = 0, $length = histories.length; j < $length; j++) {
    var history = histories[j];
    list.push(history.apprUserName);
    var statysClass = '';
    if (history.apprStatus === 1) {
      statysClass = 'agree';
    } else if (history.apprStatus === 2) {
      statysClass = 'un-agree';
    } else {
      statysClass = 'over';
    }
    var img = history.headImageUrl ? '<img src=' + window.API_PATH + '/customer' + history.headImageUrl + '>' : '<span class="images"></span>'
    var apprTime = history.apprTime ? moment(history.apprTime).format('YYYY/MM/DD HH:mm:ss') : '';
    var apprRemark = history.apprRemark ? history.apprRemark : '';
    var postName = history.postName || '无';
    var $dom = $('<div class="approval-process-content">\
      <i class="icon-approval-status ' + statysClass + '">\
      <i class="line"></i>\
      </i>\
      <div class="content-image">\
      ' + img + '\
      </div>\
      <div class="content-item">\
        <div class="user-name">' + history.apprUserName + '</div>\
        <div class="user-job">' + postName + '</div>\
      </div>\
      <span style="color: #b5b5b5;margin-left: 40px;display: inline-block;vertical-align: middle;">' + parseApprovalType(history.apprStatus) + '</span>\
      <span class="desc">' + apprRemark + '</span>\
      <span class="time">' + apprTime + '</span>\
  </div>');
    $dom.appendTo($parents);
  }
  _parents.find('[name=apprUserName]').text(list.join(' -> '));
  _parents.find('[name=remark]').text(obj.remark);
}

function approvalType (type) {
  type = parseInt(type);
  switch (type) {
    case 1:
      return '审批中';
    case 2:
      return '已完成';
    case 3:
      return '已驳回';
  }
}

function parseApprovalType (type) {
  type = parseInt(type);
  switch (type) {
    case 0:
      return '未审批';
    case 1:
      return '同意';
    case 2:
      return '不同意';
  }
}
