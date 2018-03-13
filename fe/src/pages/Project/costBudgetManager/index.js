var initCostBudgetList = require('./initCostBudgetList');
var initEvent = require('./initEvent');
var onScrollDom = require('../../Common/onScrollDom');
var Page = require('../../../components/Page');
exports.initCostBudget = function initCostBudget () {
  initCostBudgetList.getDivisionProjectFunc(function () {
    initCostBudgetList.getCostEvaluateFunc();
  });
  initEvent.initMainViewClick();
};

exports.initCostSubProject = function () {
  var page = $('#page').html('');
  var $page = new Page(page, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initCostBudgetList.getDivisionProjectListFunc();
  initCostBudgetList.getCostSubProjectFunc();
  initCostBudgetList.getCostBudgetListFunc($page);
  initEvent.costBudgetClick($page);
  onScrollDom.initDomScrollEvent(null, $('#subId'), $('#costBudget'))
};
/**
 * 人工
 */
exports.initCostWorkerCount = function initCostWorkerCount () {
  var page = $('#page').html('');
  var $page = new Page(page, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initCostBudgetList.getDivisionProjectListFunc();
  initCostBudgetList.getCostSubProjectFunc();
  initCostBudgetList.getCostWorkerCountFunc($page);
  initCostBudgetList.getCostWorkerCountType();
  initEvent.costBudgetSubProjectClick();
  initEvent.initBudgetLaborEvent($page);
  onScrollDom.initDomScrollEvent(null, $('#subId'), $('#costLabor'));
};
/**
 * 措施
 */
exports.initCostStep = function initCostStep () {
  var pageDom = $("#page").html('');
  var $page = new Page(pageDom, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initCostBudgetList.getDivisionProjectListFunc();
  initCostBudgetList.getCostSubProjectFunc();
  initCostBudgetList.getCostStepFunc($page);
  initCostBudgetList.getCostStepType();
  initEvent.costBudgetSubProjectClick();
  initEvent.costBudgetStepEvent($page);
  onScrollDom.initDomScrollEvent(null, $('#subId'), $('#costStep'));
};
/**
 * 分包
 */
exports.initCostSubpackage = function initCostSubpackage () {
  var pageDom = $("#page").html('');
  var $page = new Page(pageDom, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initCostBudgetList.getDivisionProjectListFunc();
  initCostBudgetList.getCostSubProjectFunc();
  initCostBudgetList.getCostSubpageageFunc($page);
  initCostBudgetList.getCostSubpackageType();
  initEvent.costBudgetSubpackageEvent($page);
  initEvent.costBudgetSubProjectClick();
  onScrollDom.initDomScrollEvent(null, $('#subId'), $('#costSubpackage'));
};
/**
 * 材料
 */
exports.initCostMaterial = function initCostMaterial () {
  var pageDom = $("#page").html('');
  var $page = new Page(pageDom, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initCostBudgetList.getDivisionProjectListFunc();
  initCostBudgetList.getCostSubProjectFunc();
  initCostBudgetList.getCostMaterialFunc($page);
  initCostBudgetList.getCostMaterialType();
  initEvent.costBudgetSubProjectClick();
  initEvent.initBudgetMaterialEvent($page);
  onScrollDom.initDomScrollEvent(null, $('#subId'), $('#costMaterial'));
};

/**
 * 工程量核算
 */
exports.initCostQuantity = function initCostQuantity () {
  var pageDom = $("#page").html('');
  var $page = new Page(pageDom, {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10 // 默认每页显示多少条
  });
  initCostBudgetList.getDivisionProjectListFunc();
  initCostBudgetList.getCostSubProjectFunc();
  initCostBudgetList.getCostQuantityFunc($page);
  initEvent.costBudgetSubProjectClick();
  onScrollDom.initDomScrollEvent(null, $('#subId'), $('#costQuantity'));
  initEvent.initCommonEvent($page);
};

exports.renderCostBudgetCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projectGet = user.permission['projBudget:get']; // 查看
  var projectData = user.permission['projBudget:*'];
  if (projectGet && !projectData) {
    $('#economyTarget').show();
    $('#editPrice').hide();
    $('#costNav').show();
    $('.cost-budget-page').hide();
  } else if (!projectGet && projectData) {
    $('#editPrice').show();
    $('#editPrice').show();
    $('#economyTarget').show();
    $('#costNav').show();
    $('.cost-budget-page').show();
  } else if (!projectGet && !projectData) {
    $('#costNav').hide()
  }
};
exports.renderCostBudgetNavCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projectGet = user.permission['projBudget:get'];
  var projectData = user.permission['projBudget:*'];
  if (!projectGet && !projectData) {
    $('#costNav').hide()
  } else {
    $('#costNav').show()
  }
};