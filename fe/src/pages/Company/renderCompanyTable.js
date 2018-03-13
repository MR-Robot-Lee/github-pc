var initEvent = require('./initEvent');
exports.renderCompanyTableList = function (list) {
  list = list || [];
  var parents = $('#companyList').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    if (!item) {
      continue;
    }
    var dom = $('<tr>\
      <td style="padding-left: 40px">' + item.companyNo + '</td>\
      <td>' + item.etpName + '</td>\
      <td><a class="span-color-blue come" href="javascript:void(0)">进入</a></td>\
      </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
  }
  initEvent.initCompanyTableEvent(parents);
};


exports.renderPersonDom = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : {};
  $('[name=userName]').val(user.userName);
  $('[name=sex]').val(user.sex);
  $('[name=mobile]').val(user.mobile);
};

exports.renderUserInfo = function (obj) {
  $('img').attr('src', window.API_PATH + '/customer' + obj.attachUrl);
  $('img').data('src', obj.attachUrl);

};

exports.renderCompanyListTab = function (list) {
  list = list || [];
  list.unshift({ companyNo: 0, etpName: '我的阿筑' });
  var parents = $('#companyHeaderList').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var type = 'companyChange';
    if (i === 0) {
      type = 'myAZHU';
    }
    var dom = $('<div class="company-item ' + type + '" data-id="' + item.companyNo + '">\
                    <span class="icon-circle"></span>' + item.etpName + '\
                   </div>');
    dom.data('item', item);
    dom.appendTo(parents);
  }
  initEvent.initCompanyTabEvent(parents);
};