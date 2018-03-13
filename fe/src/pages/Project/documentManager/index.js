var initEvent = require('./initEvent');
var documentManagerFunc = require('./documentManagerFunc');


exports.initDocumentManager = function () {
  initEvent.documentManagerEvent();
  documentManagerFunc.getTypeTreeFunc();
};

exports.renderDocmentCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projFileGet = user.permission['projFile:get'];
  if (projFileGet) {
    $('.downloadCom').show();
    $('.documentDownload').show();
  } else {
    $('.downloadCom').hide();
    $('.documentDownload').hide();
  }
  var projFileAdd = user.permission['projFile:*'];
  if (projFileAdd) {
    $('#enterpriseCategory').show();
    $('#moveFile').show();
    $('#delete').show();
    $('#enterpriseMaterial').show();
    $('.downloadCom').show();
    $('.documentDownload').show();
  } else {
    $('#enterpriseCategory').hide();
    $('#moveFile').hide();
    $('#delete').hide();
    $('#enterpriseMaterial').hide();
  }
};