var initEvent = require('./initEvent');
exports.renderScheduleTable = function renderScheduleTable (parents, list) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var count = i + 1;
    var dom = $('<tr>\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.stepName + '</td>\
                  <td class="border">' + item.chargeUserName + '</td>\
                  <td class="border">' + item.planDays + '</td>\
                  <td class="border">' + item.workerCount + '</td>\
                  <td class="border">' + moment(item.planBeginTime).format("YYYY-MM-DD") + '</td>\
                  <td class="border">' + moment(item.planEndTime).format("YYYY-MM-DD") + '</td>\
                  <td style="padding-right: 10px" class="border">\
                      <div class="Progress-Bar-fixed">\
                        <div class="bar-item" >\
                        <div class="span-default progress-bc-5cc796" style="width: ' + item.completePer + '%"></div>\
                        <div class="progress-desc" style="left: ' + item.completePer + '%">' + item.completePer + '%</div>\
                        </div>\
                      </div>\
                  </td>\
                  <td class="border">' + parseJudgeType(item.judgeType) + '</td>\
                  <td class="border" class="scheduleManagerTd" style="position: relative"><a class="scheduleManager edit-a">进度管理</a>\
                  <div class="icon-line" style="margin: 0 10px;"></div><a data-type="check" class="edit-a">查看</a>\
                  </td>\
                </tr>');
    dom.data("item", item);
    dom.appendTo(parents)
  }
  initEvent.initClickScheduleManager(parents);
};
/**
 *
 */
exports.renderModalTable = function renderModalTable (parents, list, modal) {
    list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var count = i + 1;
    var dom = $('<tr class="active">\
                 <td class="border"><input type="checkbox" /></td>\
                 <td class="border">' + count + '</td>\
                 <td class="border">\
                  <input type="text" class="input" placeholder="请填写" name="stepName" data-warn="项目名称" />\
                 </td>\
                 <td class="border">\
                  <div  name="chargeUserName" style="font-size: 12px;color:#009411;cursor: pointer">单击选择</div>\
                 </td>\
                 <td class="border">\
                  <input type="text" class="input" placeholder="系统计算" name="planDays" data-warn="计划工期" disabled/></td>\
                 <td class="border">\
                  <input type="text" class="input" placeholder="请填写" name="workerCount" data-warn="每天人数" /></td>\
                 <td class="border">\
                  <input type="date" class="input" placeholder="请填写" name="planBeginTime" data-warn="开始时间" /></td>\
                 <td class="border">\
                  <input type="date" class="input" placeholder="请填写" name="planEndTime" data-warn="结束时间" /></td>\
                </tr>');
    var inputs = dom.find(".input");
    for (var j = 0, $length = inputs.length; j < $length; j++) {
      var name = $(inputs[j]).attr('name');
      if (name === 'planBeginTime') {
        if (item[name]) {
          $(inputs[j]).val(moment(item[name]).format("YYYY-MM-DD"));
        }
      } else if (name === 'planEndTime') {
        if (item[name]) {
          $(inputs[j]).val(moment(item[name]).format("YYYY-MM-DD"));
        }
      } else {
        if (item[name] || item[name] === 0) {
          $(inputs[j]).val(item[name]);
        }
      }
    }
    dom.find('[name=chargeUserName]').text(item.chargeUserName);
    dom.find('[name=chargeUserName]').data('user', { userNo: item.chargeUserNo, userName: item.chargeUserName });
    dom.attr('id', item.id);
    dom.data("item", item);
    dom.appendTo(parents);
  }
  initEvent.initAddUserChargeName(parents, modal);
};

function parseSchedStatus (state) {
  state = parseInt(state);
  switch (state) {
    case 1:
      return '执行中';
    case 2:
      return '未执行';
    case 3:
      return '被中止'
  }
}

/**
 * 进度评估
 * @param state
 */
function parseJudgeType (state) {
  state = parseInt(state);
  switch (state) {
    case 1:
      return '正常';
    case 2:
      return '滞后';
    case 3:
      return '严重滞后';
    case 4:
      return '提前';
  }
}

/**
 * 绘制计划内容
 */
exports.renderScheduleSpan = function renderScheduleSpan (parents, obj) {
  var spans = parents.find(".span");
  if (spans.length === 0) {
    spans = parents.find('input');
    parents.find('#chargeUserName').data('user', { userNo: obj.chargeUserNo, userName: obj.chargeUserName });
    parents.find('#chargeUserName').text(obj.chargeUserName)
  }
  for (var i = 0, length = spans.length; i < length; i++) {
    var span = $(spans[i]);
    var name = span.attr('name');
    if (span.is('span') || span.is('div')) {
      if (name === 'planEndTime') {
        span.text(moment(obj.planEndTime).format("YYYY年MM月DD日"));
      } else if (name === 'planBeginTime') {
        span.text(moment(obj.planBeginTime).format("YYYY年MM月DD日"));
      } else if (name === 'judgeType') {
        span.text(parseJudgeType(obj.judgeType))
      } else if (name === 'schedStatus') {
        span.text(parseSchedStatus(obj.schedStatus))
      } else if (name === 'planDays') {
        span.text(obj.planDays + '天')
      } else if (name === 'planWorkDays') {
        span.text(obj.planWorkDays + '工日')
      } else if (name === 'cntrDays') {
        span.text(obj.cntrDays + '天');
      } else {
        span.text(obj[name]);
      }
    } else {
      if (name === 'planEndTime') {
        span.val(moment(obj.planEndTime).format("YYYY-MM-DD"));
      } else if (name === 'planBeginTime') {
        span.val(moment(obj.planBeginTime).format("YYYY-MM-DD"));
      } else {
        span.val(obj[name]);
      }
    }
  }
  var barItem = $("#barItem").html('');
  if (barItem) {
    var dom = $('<div class="Progress-Bar-fixed">\
                 <div class="bar-item" >\
                 <div class="span-default progress-bc-5cc796" style="width: ' + obj.completePer + '%"></div>\
                 <div class="progress-desc" style="left: ' + obj.completePer + '%">' + obj.completePer + '%</div>\
                 </div>\
                </div>');
    dom.appendTo(barItem);
  }
  // var user = localStorage.getItem('user');
  // user = user ? JSON.parse(user).employee : {};
  // var _name = user.userName || '';
  // $('.userName').text(_name);
  $('.userName').text(obj.addUserName);
  $('.scheduleApproval').text(parseApprovalStatus(obj.status));
  $('#stopSchedule').text(parseStatus(obj.schedStatus));
  $('#stopSchedule').data('type', obj.schedStatus);
};

function parseStatus (type) {
  type = parseInt(type);
  switch (type) {
    case 1:
      return '中止计划';
    case 3:
      return '执行计划';
  }
}

function parseApprovalStatus (type) {
  type = parseInt(type);
  switch (type) {
    case 1:
      return '保存';
    case 2:
      return '审批中';
    case 3:
      return '已审批';
    case 4:
      return '已驳回';
  }
}

exports.renderScheduleHistoryTable = function (list, modal) {
  list = list || [];
  var parents = modal.$body.find('tbody').html('');
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var dom = $('<tr>\n' +
      '                    <td class="border">' + item.addDate + '</td>\n' +
      '                    <td class="border">' + item.addUserName + '</td>\n' +
      '                    <td class="border">' + item.completePer + '%</td>\n' +
      '                    <td class="border">' + item.workerCount + '</td>\n' +
      '                    <td class="border">' + item.remark + '</td>\n' +
      '                </tr>');
    dom.appendTo(parents);
  }
}