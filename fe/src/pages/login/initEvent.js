var common = require('../Common');
var Model = require('../../components/Model');
var ServiceAgreementModal = require('../System/modal/ServiceAgreementModal.ejs');
var initLoginFunc = require('./initLoginFunc');
//记住密码
if (window.localStorage) {
  if (localStorage.getItem('remenberKey') == 'true') {//判断之前是否选择记住密码
    $('#rememberKey').prop('checked', localStorage.getItem('remenberKey'));
  }
}
var checked = $('#rememberKey').prop('checked');//获取锁定密码的情况
if (checked) {
  if (window.localStorage) {
    if (localStorage.getItem('remenberKey') == 'true') {
      $('[name=mobile]').val(localStorage.getItem('mobile'));
      $('[name=pwd]').val(localStorage.getItem('pwd'));
    }
  }
}
$('#rememberKey').change(function () {//复选框状态切换
  checked = $('#rememberKey').prop('checked');
  if (window.localStorage) {
    localStorage.setItem('remenberKey', checked);
  }
})

$('body').on('keydown', function (e) {//回车登录功能
  if (e.keyCode == 13) {
    $("#login").trigger('click');
  }
});

localStorage.setItem('work-remind', 1);

exports.initLoginEvent = function () {
  var login = $('#login');
  if (login.length > 0 && !login.data('flag')) {
    login.data('flag', true);
    login.click(function (e) {
      common.stopPropagation(e);
      var mobile = $('[name=mobile]').val();
      var pwd = $('[name=pwd]').val();
      if (!mobile) {
        return alert('请输入正确的号码');
      }
      if (!pwd) {
        return alert('请输入密码');
      }
      if (checked) {//记住密码
        if (window.localStorage) {
          localStorage.setItem('mobile', mobile);
          localStorage.setItem('pwd', escape(pwd));
        }
      }
      initLoginFunc.postLoginFunc({ mobile: mobile, pwd: pwd });
    });
    // var mobile = localStorage.getItem('mobile');
    // var pwd = localStorage.getItem('pwd');
    // var user = localStorage.getItem('user');
    // if (mobile && pwd && user) {//自动登录
    //   initLoginFunc.postLoginFunc({ mobile: mobile, pwd: pwd });
    // }
  }
};

$('#checkServiceAgreement').click(function (e) {
  common.stopPropagation(e);
  var ServiceAgreement = Model(null, ServiceAgreementModal());
  ServiceAgreement.$header.hide();
  ServiceAgreement.show();
  ServiceAgreement.showClose();
})


exports.initRegisterEvent = function () {
  var register = $('#register');
  if (register.length > 0 && !register.data('flag')) {
    register.data('flag', true);
    register.click(function (e) {
      common.stopPropagation(e);
      var companyName = $('[name=companyName]').val();
      var entpType = $('[name=entpType]').val();
      var province = $('[name=province] option:selected').text();
      var city = $('[name=city] option:selected').text();
      var provinceId = $('[name=province]').val();
      var cityId = $('[name=city]').val();
      var mobile = $('[name=mobile]').val();
      var authImageCode = $('[name=authImageCode]').val();
      var authCode = $('[name=authCode]').val();
      var userName = $('[name=userName]').val();
      var pwd = $('[name=pwd]').val();
      var sex = $('[name=sex]:checked').val();
      var resetPwd = $('[name=resetPwd]').val();
      if (!companyName) {
        return alert('请输入公司名称');
      }
      if (!entpType || entpType === 'a') {
        return alert('请输入企业性质');
      }
      if (!province || province === '请选择') {
        return alert('请输入企业所在省');
      }
      if (!city || city === '请选择') {
        return alert('请输入企业所在市')
      }
      if (!mobile) {
        return alert('请输入电话号码')
      }
      if (!authImageCode) {
        return alert('请输入图片验证码');
      }
      if (!authCode) {
        return alert('请输入验证码');
      }
      if (!userName) {
        return alert('请输入用户姓名')
      }
      if (!sex) {
        return alert('请输入用户性别');
      }
      if (!pwd) {
        return alert('请输入密码');
      }
      if (!resetPwd) {
        return alert('请再次输入密码');
      }
      if (pwd !== resetPwd) {
        return alert('两次密码输入不一致');
      }
      if (!$('#agree').prop('checked')) {
        return alert('请查看并同意注册协议');
      }
      initLoginFunc.postCompany({
        companyName: companyName,
        entpType: entpType,
        province: province,
        city: city,
        sex: sex,
        cityId: cityId,
        provinceId: provinceId,
        authImageCode: authImageCode,
        mobile: mobile,
        authCode: authCode,
        userName: userName,
        pwd: pwd
      });
    });
    $('img').click(function (e) {
      common.stopPropagation(e);
      $(this).attr('src', window.API_PATH + '/customer/index/getKaptchaImage');
    });
    $('img').click();
    var authFlag = true;//计时器节流阀
    $('#authCode').click(function (e) {
      common.stopPropagation(e);
      var mobile = $('[name=mobile]').val();
      if (!mobile) {
        return alert('请输入正确的电话号码');
      }
      initLoginFunc.postCodeFunc({ mobile: mobile, type: 1 });
      if (authFlag) {//验证码倒计时
        authFlag = false;
        var sec = 60;
        var timer = setInterval(function () {
          sec--;
          $('#authCode').text('还剩 ' + sec + ' 秒');
          if (sec == 0) {
            clearInterval(timer);
            $('#authCode').text('获取短信验证码');
            authFlag = true;
          }
        }, 1000)
      }
    })
  }
};

exports.initFindPwd = function () {
  var getCode = $('#getCode');
  window.findPwd = true;
  if (getCode.length > 0 && !getCode.data('flag')) {
    getCode.data('flag', true);

    /*找回密码 获取验证码*/
    getCode.click(function (e) {
      common.stopPropagation(e);
      var mobile = $('#mobile').val();
      if (!mobile) {
        return alert('请输入电话号码');
      };
      if(window.findPwd){
          initLoginFunc.postResetPwdCode({ mobile: mobile, type: 3 });
      } else {
          console.log('发送过于频繁');
      };
    });


    $('#step').click(function (e) {
      common.stopPropagation(e);
      var mobile = $('#mobile').val();
      var code = $('#code').val();
      if (!mobile) {
        return alert('请输入电话号码');
      }
      if (!code) {
        return alert('请输入验证码');
      }
      initLoginFunc.postAuthCodeFunc({ authCode: code, mobile: mobile, smsType: 3 });
    });
  }
};

exports.initReset = function () {
  var loginBtn = $('.login-btn.margin-top');
  if (loginBtn.length > 0 && !loginBtn.data('flag')) {
    loginBtn.data('flag', true);
    loginBtn.click(function (e) {
      common.stopPropagation(e);
      var mobile = $('.mobile').val();
      var authCode = $('.authCode').val();
      var resetPw = $('.reset-pw').val();
      var conPw = $('.confirm-pw').val();
      if (!resetPw) {
        return alert('请输入重置密码');
      }
      if(resetPw.length <6 || resetPw.length > 14){
          return alert('密码设置应在6~14个字符之间');
      }
      if(resetPw !== conPw){
        return alert('两次输入密码不一样');
      }
      initLoginFunc.postResetPwdFunc({ mobile: mobile, pwd: conPw, authCode: authCode });
    });
  }
};



