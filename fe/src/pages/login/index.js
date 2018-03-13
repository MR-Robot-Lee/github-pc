var initEvent = require('./initEvent');
var initLoginFunc = require('./initLoginFunc');
module.exports = {
  ready: function (type) {
    if (type === 'login') {
      initEvent.initLoginEvent();
    } else if (type === 'register') {
      initEvent.initRegisterEvent();
      initLoginFunc.getRegisterAddress();
    } else if (type === 'register-success') {
      initLoginFunc.initRegisterSuccess();
    } else if (type === 'password') {
      initEvent.initFindPwd();
    } else if (type === 'reset') {
      initEvent.initReset();
    }
  }
};