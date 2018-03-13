var request = require('../../helper/request');
var common = require('../../pages/Common');

exports.renderSelectDom = function (pid, cid, callback) {
  var parents = $(pid).html('');
  request.get('/customer/index/region').then(function (res) {
    var list = res.data ? res.data : [];
    if (res.code === 1) {
      $('<option value="a">请选择</option>').appendTo(parents);
      for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.name);
        dom.val(item.id);
        dom.data('child', item.child);
        dom.appendTo(parents);
      }
      if (callback) {
        callback();
      }
    }
  });
  parents.change(function (e) {
    common.stopPropagation(e);
    var childId = $(cid).html('');
    $('<option value="a">请选择</option>').appendTo(childId);
    var child = $(this).find('option:selected').data('child') || [];
    for (var i = 0, length = child.length; i < length; i++) {
      var item = child[i];
      var dom = $('<option></option>');
      dom.text(item.name);
      dom.val(item.id);
      dom.appendTo(childId);
    }
  })
};