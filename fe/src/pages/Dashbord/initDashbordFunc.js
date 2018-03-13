var dashbordApi = require('./dashbordApi');
var renderDashbordTable = require('./renderDashbordTable');
var Page = require('../../components/Page');

exports.getNoticeKnowledgeFunc = function () {
  dashbordApi.getNoticeKnowledge().then(function (res) {
    var obj = res.data ? res.data : {};
    renderDashbordTable.renderMainNotice(obj);
  })
};

exports.getJobRemindFunc = function () {
  dashbordApi.getJobRemind().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderDashbordTable.renderJobRemindTable(list);
  })
};

exports.getJobRemindNumFunc = function () {
  dashbordApi.getJobRemindNum().then(function (res) {
    var list = res.data;
    renderDashbordTable.renderJobRemindNum(list);
  })
};

exports.getDetailUserListFunc = function () {
  dashbordApi.getDetailUserList().then(function (res) {
    var list = res.data ? res.data : [];
    renderDashbordTable.renderOrganizationTable(list);
  })
};
//todo
exports.postCalendarRemindFunc = function (data, modal, parents) {
  var that = this;
  dashbordApi.postCalendarRemind(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getCalendarCurrentMonthRemindFunc(moment(data.remindTime).get('M') + 1, parents);
    }
  });
};

exports.putCalendarRemindFunc = function (data, modal, parents) {
  var that = this;
  dashbordApi.putCalendarRemind(data).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      that.getCalendarCurrentMonthRemindFunc(moment(data.remindTime).get('M') + 1, parents);
    }
  })
};
/**
 * 删除日历提醒
 * @param data
 * @param modal
 */
exports.delCalendarRemindFunc = function (data, modal, addContent) {
  var that = this;
  dashbordApi.delCalendarRemind(data.id).then(function (res) {
    if (res.code === 1) {
      modal.hide();
      addContent.html('');
      that.getCalendarCurrentMonthRemindFunc(moment(data.remindTime).get('M') + 1, 't');
    }
  })
};
exports.renderOrganizationUserTable = function (list) {
  renderDashbordTable.renderOrganizationUserTableDom(list);
};

exports.getProjectOrganizationList = function () {
  dashbordApi.getProjectOrganizationList().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderDashbordTable.renderOrganizationTable(list);
  })
};

exports.getOrganizationEmployeeListFunc = function (data) {
  dashbordApi.getOrganizationEmployeeList(data).then(function (res) {
    var list = res.data ? res.data : [];
    renderDashbordTable.renderOrganizationUserTableDom(list);
  })
};

exports.getNewFinanceFunc = function (data, page) {
  var that = this;
  dashbordApi.getNewFinance(data).then(function (res) {
    var list = res.data ? res.data.data : [];
    var $data = res.data ? res.data : ""
    var pageSize = $data ? $data.pageSize : 10;
    var pageNo = $data ? $data.pageNo : 1;
    var total = $data ? $data.total : 0;
    page.update({ pageNo: pageNo, pageSize: pageSize, total: total });
    //绑定分页修改事件
    page.change(function (_data) {
      _data.projId = $('#projId').val();
      _data.status = $('#status').val();
      that.getNewFinanceFunc(_data, page);
    });
    renderDashbordTable.renderProjectFinancialTable(list);
  });
};

exports.getProjectNickName = function () {
  dashbordApi.getProjectNickName().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderDashbordTable.renderProjectNickNameSelect(list);
  })
};


exports.getPictureFunc = function () {//
  dashbordApi.getPicture().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderDashbordTable.renderIndexPicture(list);
  });
};

exports.getSystemHandlerLogFunc = function (data, page) {
  var that = this;
  dashbordApi.getSystemHandlerLog(data).then(function (res) {
    var list = res.data ? res.data.data : [];
    var $data = res.data ? res.data : ""
    var pageSize = $data ? $data.pageSize : 10;
    var pageNo = $data ? $data.pageNo : 1;
    var total = $data ? $data.total : 0;
    page.update({ pageNo: pageNo, pageSize: pageSize, total: total });
    //绑定分页修改事件
    page.change(function (_data) {
      that.getSystemHandlerLogFunc(_data, page);
    });
    renderDashbordTable.renderIndexRemindTable(list);
  })
};

exports.getCalendarCurrentMonthRemindFunc = function (month, parents) {
  dashbordApi.getCalendarCurrentMonthRemind(month).then(function (res) {
    var list = res.data ? res.data.data : [];
    renderDashbordTable.renderCalendarDom(list, parents);
  })
};


exports.initUserInfo = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { employee: {} };
  $('.user-name').text(user.employee.userName);
  $('.deptName').text(user.employee.deptName || '未知');
  $('.deptName').attr('title', user.employee.deptName || '未知');
  $('.postName').text(user.employee.postName || '未知');
  if (user.employee.headImageUrl) {
    $('.user-header img').attr('src', window.API_PATH + '/customer/' + user.employee.headImageUrl);
  }
    dashbordApi.getPostEmployeeList().then(function(res){
        var list = res.data ? res.data : [];
        for(var i = 0; i < list.length; i++){
          if(list[i].postName == user.employee.postName){
              $('.postName').data('postId',list[i].postId);
              break;
          }
        }
        renderDashbordTable.renderJobDescDom();
    });
};

exports.getJobDescFunc = function(postId){
  dashbordApi.getPostEmployeeFindById(postId).then(function(res){
    var data = res.data ? res.data : {};
    var posRemark = data.posRemark || '无';
      $('.job-description').html(posRemark);
  });
}