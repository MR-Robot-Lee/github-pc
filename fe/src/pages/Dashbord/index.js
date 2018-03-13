var initDashbordFunc = require('./initDashbordFunc');
var initEvent = require('./initEvent');
var addCalendarContent = require('./models/addSmallCalendarContent.ejs');
var Model = require('../../components/Model');
var bidCalendar = require('./bigCalendar');
var Page = require('../../components/Page');
var calendar = require('../Project/calendar');
var common = require('../Common');

function initDayModalEvent () {
  var modal = arguments[0];
  var time = arguments[1];
  var item = arguments[2];
  var addContent = arguments[3];
  modal.$body.find('.delete').click(function (e) {
    common.stopPropagation(e);
    if (item) {
      initDashbordFunc.delCalendarRemindFunc(item, modal, addContent);
    }
  });
  modal.$body.find('.save').click(function (e) {
    common.stopPropagation(e);
    var id = $(this).data('id');
    var remindContent = modal.$body.find('textarea').val();
    if (!remindContent) {
      return alert('请输入内容');
    }
      if (remindContent.length >200) {
          return alert('请输入200以内的内容');
      }
    if (id) {
      initDashbordFunc.putCalendarRemindFunc({
        id: id,
        remindContent: remindContent,
        remindTime: moment(time).toDate().getTime()
      }, modal, 't')
    } else {
      initDashbordFunc.postCalendarRemindFunc({
        remindContent: remindContent,
        remindTime: moment(time).toDate().getTime()
      }, modal, 't');
    }
  })
}

function initDayModalData () {
  var modal = arguments[0];
  var item = arguments[2];
  if (item) {
    modal.$body.find('textarea').val(item.remindContent);
    modal.$body.find('.save').data('id', item.id);
  }
}

module.exports = {
  ready: function (type) {
    calendar.initCalendar(function () {
      $('#weeks').find('.day').click(function (e) {
        common.stopPropagation(e);
        var date = $(this).data('time');
        var item = $(this).data('item');
        var addCalendar = Model('台历', addCalendarContent());
        var addContent = $(this).find('.addContent');
        addCalendar.showClose();
        addCalendar.show();
        initDayModalEvent(addCalendar, date, item, addContent);
        initDayModalData(addCalendar, date, item);
      });
    }, function (date) {
      initDashbordFunc.getCalendarCurrentMonthRemindFunc(moment(date).get('M') + 1, 't');
    });
    initDashbordFunc.getCalendarCurrentMonthRemindFunc(moment().get('M') + 1, 't');
    initDashbordFunc.getJobRemindNumFunc();
    if (type === 'dashbord-index') {
      var page = new Page($('#page'), {
            pageSize: [10, 20, 30], // 设置每页显示条数按钮
            size: 10, // 默认每页显示多少条
        })
      initDashbordFunc.getNoticeKnowledgeFunc();
      initDashbordFunc.getSystemHandlerLogFunc(null, page);
      initDashbordFunc.getPictureFunc();
      initDashbordFunc.initUserInfo();
    } else if (type === 'dashbord-remind') {
      initDashbordFunc.getJobRemindFunc();
      initDashbordFunc.initUserInfo();
    } else if (type === 'dashbord-organization') {
      initEvent.initOrganizationStructureEvent();
      initDashbordFunc.getDetailUserListFunc();
      initDashbordFunc.initUserInfo();
    } else if (type === 'dashbord-financial') {
      var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      });
      initEvent.initProjectFinancial(page);
      initDashbordFunc.getProjectNickName();
      initDashbordFunc.initUserInfo();
      $('#searchModal').click();
    } else if (type === 'dashbord-calendar') {
      bidCalendar.initCalendar();
      initDashbordFunc.initUserInfo();
    }
  }
};



