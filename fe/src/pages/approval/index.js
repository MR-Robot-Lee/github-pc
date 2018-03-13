var initEvent = require('./initEvent');
var approvalManagerFunc = require('./approvalManagerFunc');
var Page = require('../../components/Page');

module.exports = {
  ready: function (type) {
    approvalManagerFunc.getRemindCountFunc();
    if (type === 'approval-apply') {
      var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      });
      initEvent.initMyApplyEvent(page);
      approvalManagerFunc.getMyApplyListFunc(null, page);
      approvalManagerFunc.getProcessTypeListSearchFunc($('#tmplType'));
      approvalManagerFunc.getProjectListFunc();
    } else if (type === 'approval-type') {
      initEvent.initProcessTypeEvent();
      approvalManagerFunc.getProcessTypeListFunc();
    } else if (type === 'approval-setting-add') {
      initEvent.initApprovalProcessSettingAddEvent();
      approvalManagerFunc.getProcessTypeListSelectFunc(function () {
        approvalManagerFunc.getTempFindByIdFunc();
      });
    } else if (type === 'approval-setting') {
      approvalManagerFunc.getTempListFunc();
      initEvent.initApprovalProcessSettingEvent();
      approvalManagerFunc.getProcessTypeListSearchFunc(null, { type: 0 });
    } else if (type === 'approval-add') {
      initEvent.initNewApplyEvent();
      approvalManagerFunc.getProcessTypeListSearchFunc($('#processType'), { type: 1 });
    } else if (type === 'approval-me') {
      approvalManagerFunc.getProcessTypeListSearchFunc($('#tmplType'));
      var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      });
      approvalManagerFunc.getProjectListFunc();
      initEvent.initMyApprovalEvent(page);
      approvalManagerFunc.getMyApprovalFunc(null, page);
    } else if (type === 'approval-copy') {
      approvalManagerFunc.getProcessTypeListSearchFunc($('#tmplType'));
      approvalManagerFunc.getProjectListFunc();
      var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      });
      approvalManagerFunc.getApprovalCopyFunc(null, page);
      initEvent.initApprovalCopyMe(page);
    } else if (type === 'approval-manager') {
      var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      });
      approvalManagerFunc.getAllUserListFunc();
      approvalManagerFunc.getProcessTypeListSearchFunc($('#processType'));
      approvalManagerFunc.getProjectListFunc();
      approvalManagerFunc.getCheckAllApprovalListFunc(null, page);
      initEvent.initApprovalManagerEvent(page);
    } else if (type === 'approval-manager-detail') {
      approvalManagerFunc.getApprovalManagerDetail();
      initEvent.initApprovalManagerDetail()
    }
  }
};