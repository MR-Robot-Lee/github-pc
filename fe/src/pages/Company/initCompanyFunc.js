var companyApi = require('./companyApi');
var renderCompanyTable = require('./renderCompanyTable');

exports.getCompanyListFunc = function () {
  companyApi.getCompanyList().then(function (res) {
    var list = res.data ? res.data : [];
    renderCompanyTable.renderCompanyTableList(list);
  })
};

exports.addCompanyFunc = function (data, modal) {
  var that = this;
  companyApi.addCompany(data).then(function (res) {
    if (res.code === 1) {
      that.getCompanyListFunc();
      modal.hide();
    }
  })
};

exports.renderPersonDomFunc = function () {
  renderCompanyTable.renderPersonDom();
};

exports.initChangeCompany = function (item) {
  companyApi.getCompanyFindById(item.companyNo).then(function (res) {
    if (res.code === 1) {
      var $data = res.data || {};
      localStorage.setItem("user", JSON.stringify($data));
      window.location.href = '/index'
    }
  })
};

exports.postCodeFunc = function (data) {
  companyApi.postCode(data).then(function (res) {
    if (res.code === 1) {
      var count = 60;
      window.time = setInterval(function () {
        count--;
        $('#getCode').text('还剩' + count + '秒');
        if (count === 1) {
          $('#getCode').text('获取短信验证码');
          clearInterval(window.time);
        }
      }, 1000);
    }
  });
};

exports.modifyMobileFunc = function (data, modal) {
  companyApi.modifyMobile(data).then(function (res) {
    if (res.code === 1) {
      $('[name=userName]').val(data.userName);
      $('[name=sex]').val(data.sex);
      $('[name=mobile]').val(data.mobile);
      modal.hide();
    }
  })
};

exports.modifyPwdFunc = function (data, modal) {
  companyApi.modifyPwd(data).then(function (res) {
    if (res.code === 1) {
      alert('密码修改成功！');
      modal.hide();
      // localStorage.clear();
      window.localStorage.removeItem('user');
      window.location.href = '/login';
    }
  })
};

exports.modifyUserInfoFunc = function (data, own) {
    companyApi.modifyUserInfo(data).then(function (res) {
    if (res.code === 1) {
      $('[name=userName]').val(data.userName);
      $('[name=sex]').val(data.sex);
      if(data.mobile){
          $('[name=mobile]').val(data.mobile);
      }
      own.prev('.confirm').hide();
      own.prev('.confirm').prev('.cancel').hide();
      own.parent('div').prev('.int-default').attr('disabled', true);
      own.parent('div').prev('.int-default').css('border', 'none');
    }
  })
};


exports.uploadImage = function (file) {
  var that = this;
  var req = companyApi.upload(file, function () {
  });
  req.then(function (res) {
    var obj = res.data ? res.data : {};
    renderCompanyTable.renderUserInfo(obj);
    if (res.code === 1) {
      var userName = $('[name=userName]').val();
      var sex = $('[name=sex]').val();
      // var headImageUrl = $('.user-img').attr('src');
      that.modifyUserInfoFunc({ userName: userName, sex: sex, headImageUrl: obj.attachUrl }, $(this));
    }
  });
};


exports.initGetCompanyList = function () {
  companyApi.getCompanyList().then(function (res) {
    var list = res.data ? res.data : [];
    renderCompanyTable.renderCompanyListTab(list)
  })
};

exports.getUserInfoFunc = function () {
  companyApi.getUserInfo().then(function (res) {
    var user = res.data || {};
    $('[name=userName]').val(user.userName);
    $('[name=sex]').val(user.sex);
    $('[name=mobile]').val(user.mobile);
    if (user.headImageUrl) {
      $('.user-img').attr('src', window.API_PATH + '/customer/' + user.headImageUrl);
      $('.user-img').data('src', user.headImageUrl)
    }
  })
};
