var Model = require('../../components/Model');
var approvalProcess = require('./approvalProcess.ejs');
var request = require('../../helper/request');
var common = require('../../pages/Common');

function approvalModal (title, callback) {
  this.$modal = Model(title, approvalProcess());
  this.$modal.$body.find('.confirm').click(function (e) {
    common.stopPropagation(e);
    if (callback) {
      callback();
    }
  });
}

approvalModal.prototype.show = function () {
  this.$modal.show();
};

approvalModal.prototype.showClose = function () {
  this.$modal.showClose();
};

approvalModal.prototype.hide = function () {
  this.$modal.hide();
};

approvalModal.prototype.getApprovalModal = function (type) {
  var that = this;
  request.get('/customer/approve/innerTmpl/' + type).then(function (res) {
    if (res.code === 1) {
      var list = res.data ? res.data : [];
      that.renderApprovalModal(list);
      that.show();
      that.showClose()
    } else if (res.code === 7) {
      return alert('没有内置审批模版请创建')
    }
  })
};
approvalModal.prototype.getSelectData = function () {
  var data = this.$modal.$body.find('.contract-item.active').data('item');
  return !data ? {} : data.temp || data
};
approvalModal.prototype.renderApprovalModal = function (list) {
  list = list || [];
  var parents = this.$modal.$body.find('#parents').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = '';
    var name = '';
    if (item.nodes || item.temp) {
      dom = $('<div class="contract-item">\
        <span class="contract-type"></span>\
      <span class="contract-status">' + item.temp.tmplName + '</span>\
      </div>');
      name = item.temp.tmplName;
    } else {
      dom = $('<div class="contract-item">\
        <span class="contract-type"></span>\
      <span class="contract-status">' + item.tmplName + '</span>\
      </div>');
      name = item.tmplName;
    }
    dom.data('item', item);
    var num = ['#e39c22', '#67d751', '#1cc796', '#03a9f4', '#03a9f4'];
    dom.find('.contract-type').css('background', num[i % 5]);
    if (num === 'FFF') {
      dom.find('.contract-type').css('color', '#333');
    }
    if (name) {
      name = name.substr(0, 2);
      dom.find('.contract-type').text(name);
    }
    dom.appendTo(parents);
  }
  initApprovalModalEvent(parents, this);
};

function initApprovalModalEvent (parents, own) {
  parents.find('.contract-item').click(function (e) {
    common.stopPropagation(e);
    if ($(this).hasClass('active')) {
      return
    }
    var item = $(this).data('item');
    parents.find('.contract-item').removeClass('active');
    $(this).addClass('active');
    var nodes = item.nodes || [];
    var apprUser = [];
    if (nodes || item.temp) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        apprUser.push(node.apprUserName || node.apprProjPosName);
      }
      apprUser = apprUser.join('->');
      own.$modal.$body.find('#process').text(apprUser);
      own.$modal.$body.find('.approval-desc >span').text(item.temp.remark);
    } else {
      own.$modal.$body.find('#process').text(item.copyProjPosNames);
      own.$modal.$body.find('.approval-desc >span').text(item.remark);
    }
  });
  parents.find('.contract-item:first').click();
}

module.exports = approvalModal;

