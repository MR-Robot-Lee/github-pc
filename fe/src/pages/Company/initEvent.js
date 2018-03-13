var common = require('../Common');
var Model = require('../../components/Model');
var addCompanyModal = require('./modal/addCompany.ejs');
var province = require('../Common/province');
var initCompanyFunc = require('./initCompanyFunc');
var updateMobile = require('./modal/updateMobile.ejs');
var resetPassword = require('./modal/resetPassword.ejs');
var request = require('../../helper/request');


exports.initCompanyEvent = function () {
  var addCompany = $('.add-company');
  if (addCompany.length > 0 && !addCompany.data('flag')) {
    addCompany.data('flag', true);
    addCompany.click(function (e) {
      common.stopPropagation(e);
      var add = Model('创建企业', addCompanyModal());
      add.showClose();
      add.show();
      initAddModal(add);
      initAddModalEvent(add);
    });
    $('.update').click(function (e) {
      common.stopPropagation(e);
      var type = $(this).data('type');
      if (type === 'pwd') {
        var resetPasswordModel = Model('修改密码', resetPassword());
        resetPasswordModel.showClose();
        resetPasswordModel.show();
        initResetPasswordModalEvent(resetPasswordModel);
        return;
      }
      if (type === 'mobile') {
        var updateModel = Model('修改绑定的手机号', updateMobile());
        updateModel.show();
        initUpdateModelEvent(updateModel);
        return;
      }
      $(this).hide();
      $(this).next('.confirm').show();
      $(this).next('.confirm').next('.cancel').show();
      $(this).parent('div').prev('.int-default').attr('disabled', false);
      $(this).parent('div').prev('.int-default').css('border', '1px solid #ececec');
    });
    $('.cancel').click(function (e) {
      common.stopPropagation(e);
      $(this).prev('.confirm').prev('.update').show();
      $(this).prev('.confirm').hide();
      $(this).hide();
      $(this).parent('div').prev('.int-default').attr('disabled', true);
      $(this).parent('div').prev('.int-default').css('border', 'none');
      initCompanyFunc.getUserInfoFunc()
      // initCompanyFunc.renderPersonDomFunc();
    });
    $('.confirm').click(function (e) {
      common.stopPropagation(e);
      $(this).next('.cancel').hide();
      $(this).hide();
      $('.update').show();
      $(this).parent('div').prev('.int-default').attr('disabled', true);
      $(this).parent('div').prev('.int-default').css('border', 'none');
      var userName = $('[name=userName]').val();
      var sex = $('[name=sex]').val();
      var headImageUrl = $('.user-img').data('src');
      initCompanyFunc.modifyUserInfoFunc({ userName: userName, sex: sex, headImageUrl: headImageUrl }, $(this));
    });
    $('#updateFile').change(function (e) {
      common.stopPropagation(e);
      var files = this.files;
      initCompanyFunc.uploadImage(files[0]);
      this.value = '';
    });
    $('.user-img').click(function () {
      $('#updateFile').trigger("change");
    })
    $('.small-logo').click(function (e) {
      common.stopPropagation(e);
      if ($('.company-list-handler').hasClass('company-hide')) {
        $('.company-list-handler').removeClass('company-hide');
      } else {
        $('.company-list-handler').addClass('company-hide');
      }
    })
    loginOut();
  }
};

function loginOut () {
  var user = localStorage.getItem('user');
  user = !user ? {} : JSON.parse(user).employee;

  $('.project-nickname').text(user.companyName);
  $('.login-out').click(function (e) {
    common.stopPropagation(e);
    $('.company-list-handler').addClass('company-hide');
    if ($(this).hasClass('login-out-hide')) {
      $(this).removeClass('login-out-hide');
    } else {
      $(this).addClass('login-out-hide');
    }
  });
  $('.login-handler').click(function (e) {
    common.stopPropagation(e);
    var user = '';
    try {
      user = localStorage.getItem('user');
      user = user ? JSON.parse(user).employee.userNo : '';
    } catch (e) {
    }
    if (!user) {
      return alert('系统出错')
    }
    request.get('/customer/index/logout/' + user).then(function (res) {
      if (res.code === 1) {
        // window.localStorage.clear();
        window.localStorage.removeItem('user');
        window.location.href = '/login';
      }
    })
  })
}

function initUpdateModelEvent () {
  var modal = arguments[0];

    /*获取验证码*/
    modal.$body.find('#getCode').click(function (e) {
    common.stopPropagation(e);
    if (!mobile) {
      return alert('请输入电话号码');
    }

    initCompanyFunc.postCodeFunc({ mobile: mobile, type: 4 });
  });
  modal.$body.find('.cancel').click(function (e) {
    common.stopPropagation(e);
    if (window.time) {
      clearInterval(window.time);
    }
    $('#getCode').text('获取短信验证码');
    modal.hide();
  });
  modal.$body.find('.confirm').click(function (e) {
    common.stopPropagation(e);
    var mobile = modal.$body.find('#mobile').val();
    var code = modal.$body.find('#code').val();
    if (!mobile) {
      return alert('请输入电话号码');
    }
    if (!code) {
      return alert('请输入短信验证码');
    }
    initCompanyFunc.modifyMobileFunc({ newMobile: mobile, authCode: code }, modal);
  })
}

function initResetPasswordModalEvent () {
  var modal = arguments[0];
  modal.$body.find('.confirm').click(function (e) {
    common.stopPropagation(e);
    var oldPwd = $('[name=oldPwd]').val();
    var newPwd = $('[name=newPwd]').val();
    var reset = $('[name=reset]').val();
    if (!oldPwd) {
      return alert('请输入当前密码');
    }
    if (!newPwd) {
      return alert('请输入新密码');
    }
    if(newPwd.length <6 || newPwd.length > 14){
      return alert('密码设置应在6~14个字符之间');
    }
    if (!reset) {
      return alert('请输入确认密码');
    }
    if (newPwd !== reset) {
      return alert('两次密码输入不一致');
    }
    initCompanyFunc.modifyPwdFunc({ oldPwd: oldPwd, newPwd: newPwd }, modal);//zzq
  });
}

function initAddModal () {
  var modal = arguments[0];
  var $province = modal.$body.find('#province');
  var area = modal.$body.find('#city');
  province.renderSelectDom($province, area);
}

function initAddModalEvent () {
  var modal = arguments[0];
  modal.$body.find('.confirm').click(function (e) {
    common.stopPropagation(e);
    var companyName = modal.$body.find('[name=companyName]').val();
    var entpType = modal.$body.find('[name=entpType]').val();
    var provinceId = modal.$body.find('#province').val();
    var province = modal.$body.find('#province option:selected').text();
    var cityId = modal.$body.find('#city').val();
    var city = modal.$body.find('#city option:selected').text();
    if (!companyName) {
      return alert('请输入公司名称');
    }
    if (!entpType || entpType === 'a') {
      return alert('请输入企业性质');
    }
    if (!provinceId || provinceId === 'a') {
      return alert('请选择所在区域');
    }
    if (!cityId || cityId === 'a') {
      return alert('请选择所在区域');
    }
    initCompanyFunc.addCompanyFunc({
      companyName: companyName,
      entpType: entpType,
      province: province,
      cityId: cityId,
      provinceId: provinceId,
      city: city
    }, modal);
  });
}

exports.initCompanyTableEvent = function (parents) {
  parents.find('.come').click(function (e) {
    common.stopPropagation(e);
    var companyNo = $(this).parents('tr').data('item');
    initCompanyFunc.initChangeCompany(companyNo);
  });
};

exports.initCompanyTabEvent = function (parents) {
  parents.find('.myAZHU').click(function (e) {
    common.stopPropagation(e);
    window.location.href = '/company/list';
  });
  parents.find('.companyChange').click(function (e) {
    common.stopPropagation(e);
    var item = $(this).data('item');
    initCompanyFunc.initChangeCompany(item);
  });
};