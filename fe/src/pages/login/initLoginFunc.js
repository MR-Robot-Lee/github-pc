var loginApi = require('./loginApi');
var province = require('../Common/province');
exports.postLoginFunc = function (data) {
  loginApi.postLogin(data).then(function (res) {
    var $data = res.data || {};
    localStorage.setItem("user", JSON.stringify($data));
    if (res.code === 1) {
      window.location.href = '/index'
    } else if (res.code === 14) {
      window.location.href = '/company/list'
    }
  });
};

exports.postCompany = function (data) {
  loginApi.postCompany(data).then(function (res) {
    if (res.code === 1) {
      window.location.href = '/login/register/success?companyNo=' + res.data;
    }
  });
};

exports.postCodeFunc = function (data) {
  loginApi.postCode(data).then(function (res) {
    if (res.code !== 1) {
      $('img').click();
    }
  })
};

exports.initRegisterSuccess = function () {
  var count = 5;
  var time = setInterval(function () {
    count--;
    $('#time').text(count + 's');
    if (count < 2) {
      clearInterval(time);
      window.location.href = '/login';
    }
  }, 1000);
};

exports.getCompanyListFunc = function () {
  loginApi.getCompanyList().then(function (res) {
  })
};

exports.postResetPwdCode = function (data) {
  loginApi.postCode(data).then(function (res) {
      if (res.code === 1) {
          window.findPwd = false;
          var count = 60;
          $('#getCode').text('剩余' + 60 + '秒');
          window.time = setInterval(function () {
              count--;
              $('#getCode').text('剩余' + count + '秒');
              if (count === 1) {
                  $('#getCode').text('获取短信验证码');
                  window.findPwd = true;
                  clearInterval(window.time);
              }
          }, 1000);
      }
  })
};

exports.postAuthCodeFunc = function (data) {
    loginApi.postAuthCode(data).then(function (res) {
    if (res.code === 1) {
      window.location.href = '/login/reset?mobile=' + data.mobile + '&authCode=' + data.authCode;
    }
  })
};
exports.postResetPwdFunc = function (data) {
  loginApi.postResetPwd(data).then(function (res) {
    if (res.code === 1) {
        alert('重置密码成功');
      window.location.href = '/login';
    }
  })
};


exports.getRegisterAddress = function () {
  province.renderSelectDom($('[name=province]'), $('[name=city]'));
};