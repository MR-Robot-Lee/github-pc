var initEvent = require('./initEvent');
var organizationManagerFunc = require('./organizationManangerFunc');


exports.initOrganizationStructureManager = function () {
  initEvent.initOrganizationStructureEvent();
  initEvent.initOrgHideModal();
  organizationManagerFunc.getOrganizeFloatingPopulationFunc();
  organizationManagerFunc.getPostEmployeeFunc();
  organizationManagerFunc.getOrganizeStrucListFunc();
};

exports.initTaskDistributionManager = function () {
  organizationManagerFunc.getTaskFirstTable();
  organizationManagerFunc.getTaskSecondTable();
  initEvent.initOrgHideModal();
};

exports.renderCompetenceMainSetting = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projectGet = user.permission['projOrganize:*'];
  if (projectGet) {
    $('#changeUpdate').show();
    $('#newOrganization').show();
    $('.Competence').show();
  } else {
    $('#changeUpdate').hide();
    $('#newOrganization').hide();
    $('.Competence').hide();
  }
}