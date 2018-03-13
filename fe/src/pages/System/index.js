var initEvent = require('./initEvent');
var initSystemFunc = require('./systemFunc');
var province = require('../Common/province');

module.exports = {
  ready: function (type) {
    if (type === 'system-index') {
      initEvent.initEnterpriseSettingEvent();
      province.renderSelectDom($('[name=etpProvince]'), $('[name=etpCity]'), function () {
        initSystemFunc.getCompanyInfoFunc();
      });
    } else if (type === 'organization-index') {
      initEvent.initOrganizationStructureEvent();
      initSystemFunc.getDepartmentListFunc();
    } else if (type === 'contact') {
      initEvent.initCompanyContractInfo();
      initSystemFunc.getCompanyContractInfo();
    } else if (type === 'billboard') {
      initEvent.initCompanyBillboardUpdateEvent();
      initSystemFunc.getPropagationFunc();
    } else if (type === 'role-department') {
      initEvent.initProjectJobListEvent();
      initSystemFunc.getProjectJobList();
    } else if (type === 'role-add') {
      initSystemFunc.getResourceRoleFunc(function () {
        var id = $("#posId").data('id');
        if (id) {
          initSystemFunc.getPostEmployeeFindByIdFunc(id);
        }
      });
      initEvent.initAddRoleEvent();
    } else if (type === 'role-index') {
      initSystemFunc.getPostEmployeeListFunc();
    } else if (type === 'account-info') {
      initSystemFunc.getPurchasePlanFunc();
      initSystemFunc.getCompanyInfoFunc('account');
      initEvent.initAccountInfoEvent();
    } else if (type === 'account-manager') {
      initSystemFunc.getOrderListFunc();
    }
  }
};
