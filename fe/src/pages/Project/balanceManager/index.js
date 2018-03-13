var initEvent = require('./initEvent');
var initBalanceManager = require('./initBalanceManager');
var UploadAttach = require('../../../components/UploadAttach');
var Page = require('../../../components/Page');
var projectInitEvent = require('../initEvent');

/**
 * 获取结算
 */
exports.initBalanceFunc = function () {
  var page = new Page("#page", {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10, // 默认每页显示多少条
  });
  initEvent.initBalanceEvent(page);
  $('#searchModal').click();
};
/**
 * 添加无合同结算单
 */
exports.initBalanceDetailFunc = function () {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    var attach = new UploadAttach($("#reportModal"));
  initBalanceManager.getSupProjList(null, function () {
    var id = $('#newNoContract').data('id');
    var level = $('#newNoContract').data('level');
    if (id) {
      initBalanceManager.getNoContractBalanceObj({ cntrId: id }, attach, level);
    }
  });
  initEvent.initBalanceDetailEvent(attach);
};
/**
 * 资源
 */
exports.initBalanceResourceFunc = function () {
  var page = new Page($('#page'), {
    pageSize: [10, 20, 30], // 设置每页显示条数按钮
    size: 10, // 默认每页显示多少条
  });
  initEvent.initResourceContractEvent(page);
  $('.searchModal').click();
};

exports.renderCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projectGet = user.permission['settle:add'];
  if (projectGet) {
    $('a.span-btn').show();
    $('#newContract').show();
  } else {
    $('a.span-btn').hide();
    $('#newContract').hide();
  }
};