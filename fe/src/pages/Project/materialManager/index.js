var initMaterialManager = require('./initMaterialManager');
var initEvent = require('./initEvent');
var onScrollDom = require('../../Common/onScrollDom');
var Page = require('../../../components/Page');
var projectInitEvent = require('../initEvent');

exports.initMaterialPlanFunc = function () {
  // projectInitEvent.initPrincipalAndLogo();//左上角logo
  initMaterialManager.initMaterialPlan();
  initEvent.initMaterialPlanEvent();
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};

exports.initMaterialMyTAskFunc = function () {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    var page = new Page("#page", {
      pageSize: [10, 20, 30], // 设置每页显示条数按钮
      size: 10, // 默认每页显示多少条
    });
  initMaterialManager.initMaterialMyTask(null, page);
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};

exports.initMaterialPlanAmountFunc = function () {
    var page = new Page("#page", {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10, // 默认每页显示多少条
  });
  initMaterialManager.initMaterialPlanAmountSelect(function () {
    initEvent.initPlanAmountEvent(page);
  },true);
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};
/*exports.initManagerAllFunc = function () {
  initMaterialManager.initMaterialManagerFunc();
};*/
exports.initMaterialPurchaseSumFunc = function () {
    var page = new Page("#page", {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10, // 默认每页显示多少条
  });
  initMaterialManager.initMaterialPlanAmountSelect(function () {
    initEvent.initPurchaseSumEvent(page);
  }, true);
    initMaterialManager.initMaterialCategory();
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};

exports.initMaterialPlanSummaryFunc = function () {
    var page = new Page("#page", {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10, // 默认每页显示多少条
  });
  initMaterialManager.initMaterialPlanAmountSelect(function () {
    initEvent.initPlanSummaryEvent(page);
  },true);
  onScrollDom.initDomScrollEvent(null, $('.project-list-wrap'), $('#materialPlan'))
};

exports.renderCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projectMaterial = user.permission['projMaterial:add'];
  if (projectMaterial) {
    $('#newPurchasePlan').show();
    $('#newBiddingPlan').show();
  } else {
    $('#newBiddingPlan').hide();
    $('#newPurchasePlan').hide();
  }
}
