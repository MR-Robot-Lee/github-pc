var initEvent = require('./initEvent');
var initCostManagerFunc = require('./initCostManagerFunc');
var Page = require('../../../components/Page');
var onScrollDom = require('../../Common/onScrollDom');
exports.initFinancialStatus = function () {
  initCostManagerFunc.initFinancialStatusFunc();
  initCostManagerFunc.getProcessListFunc();// 分部数据;
  initEvent.initFinancialStatusEvent();
};
exports.renderFinancialCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projFinance = user.permission['projFinance:*'];
  var projFinanceGet = user.permission['projFinance:get:1'];
  if (projFinanceGet || projFinance) {
    $('#financialCost').show();
    $('#financialStatus').show();
  } else {
    $('#financialCost').hide();
    $('#financialStatus').hide();
  }
  if (projFinance) {
    $('#totalReceivableUpdate').show();
    $('#updateAccounts').show();
    $('.complactData').show();
    $('#editComments').show();
  } else if (projFinanceGet) {
    $('#totalReceivableUpdate').hide();
    $('#updateAccounts').hide();
    $('.complactData').show();
    $('#editComments').show();
  } else {
    $('#totalReceivableUpdate').hide();
    $('.complactData').hide();
  }
  var projFinance2 = user.permission['projFinance:get:2'];
  if (projFinance2 || projFinanceGet || projFinance) {
    $('#financialMenuPay').show();
  } else {
    $('#financialMenuPay').hide();
  }
};
exports.renderFinancialCompetenceUrl = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projFinanceGet = user.permission['projFinance:get:1'];
  var projId = $('#projectSchedule').data('id');
  var projectTitle = $('.project-menu-title span').text();
  var projFinance2 = user.permission['projFinance:get:2'];
  var projFinance = user.permission['projFinance:*'];
  if (projFinance) {
    var _url = '/project/financial/status/' + projId + '?name=' + projectTitle;
    $('#financialNav').attr('href', _url);
  } else if (projFinanceGet) {
    var url = '/project/financial/status/' + projId + '?name=' + projectTitle;
    $('#financialNav').attr('href', url);
  } else if (projFinance2) {
    var url1 = '/project/financial/pay/' + projId + '?name=' + projectTitle;
    $('#financialNav').attr('href', url1);
  } else if (!projFinance2 && !projFinanceGet && !projFinance) {
    var $url = '/project/financial/me/' + projId + '?name=' + projectTitle;
    $('#financialNav').attr('href', $url);
  }
};
exports.initFinancialReport = function () {
  initEvent.initFinancialReportEvent();
  initCostManagerFunc.getSettleListFunc();
  initCostManagerFunc.initFinancialStatusFunc();
  // initCostManagerFunc.getEditAssessFunc();
};
/**
 * 费用汇总
 */
exports.initFinancialCost = function () {
  var pageDom = $("#page").html('');
  var page = new Page(pageDom, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initEvent.initFinancialCostEvent(page);
  initCostManagerFunc.getSubProjListFunc(function () {
    $('#modalSearch').click();
  }, $('#subProject'));
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};
/**
 * 应付账款
 */
exports.initFinancialPay = function () {
  var pageDom = $("#page").html('');
  var page = new Page(pageDom, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initEvent.initFinancialPayEvent(page);
  initCostManagerFunc.getSubProjListFunc(function () {
    $('#modalSearch').click();
  }, $('#subProject'));
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};
/**
 * 我的财务
 */
exports.initFinancialMe = function () {
  var pageDom = $("#page").html('');
  var page = new Page(pageDom, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initEvent.initFinancialMeEvent(page);
  $('#modalSearch').click();
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};