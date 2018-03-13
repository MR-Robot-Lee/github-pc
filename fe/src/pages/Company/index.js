var initCompanyFunc = require('./initCompanyFunc');
var initEvent = require('./initEvent');
module.exports = {
  ready: function (type) {
    if (type === 'company') {
      initCompanyFunc.getCompanyListFunc();
      initEvent.initCompanyEvent();
      initCompanyFunc.renderPersonDomFunc();
      initCompanyFunc.initGetCompanyList();
      initCompanyFunc.getUserInfoFunc();
    }
  }
};