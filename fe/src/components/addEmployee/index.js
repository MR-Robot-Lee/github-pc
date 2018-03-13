var TempAddEmployee = require('./seleEmployee.ejs');
var Model = require('../Model');
var Common = require('../../pages/Common');
var request = require('../../helper/request');
function AddEmployee (title, callback, type) {
  this.$model = Model(title, TempAddEmployee());
  this.$parentDom = this.$model.$body.find(".level1");
  this.$data = [];
  this.$result = this.$model.$body.find(".result");
  var that = this;
  this.$type = type || 'more';
  this.$model.$body.find(".select-cancel").click(function (e) {
    Common.stopPropagation(e);
    that.$model.hide();
  });
  this.$model.$body.find(".select-confirm").click(function (e) {
    Common.stopPropagation(e);
    if (that.$data.length === 0) {
      return alert("选择要添加的员工");
    }
    if (callback) {
      callback(that.$data)
    }
  });
}
AddEmployee.prototype.reset = function () {
  this.$result.html('');
  this.$parentDom.html('');
};
AddEmployee.prototype.show = function () {
  this.$model.show();
};
AddEmployee.prototype.hide = function () {
  this.$model.hide();
};
AddEmployee.prototype.render = function (data, $items) {
  var first = !$items;
  var that = this;
  data = data || [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var $item = $('<li>\
                     <a>\
                      <span style="position: relative;top:1px;" class="open"></span>\
                      <span class="select"></span>\
                      <strong></strong>\
                     </a>\
                   </li>');
    $item.data("data", item);
    var id = item.deptId || item.userNo;
    $item.find(".select").addClass("id-" + id);
    $item.find("strong").text(item.deptName || item.userName);
    $item.find(".open").click(function (e) {
      Common.stopPropagation(e);
      that.open(this);
    });
    if (item.users && item.users.length > 0) {
      var $cItems = $('<ul class="sub"></ul>');
      this.render(item.users, $cItems);
      $cItems.appendTo($item);
      $cItems.find(".select").click(function (e) {
        Common.stopPropagation(e);
        that.updateSelect(this)
      });
    }
    if (first && this.$type !== 'single') {
      $item.find(">a .select").click(function (e) {
        Common.stopPropagation(e);
        that.updateAllSelect(this);
      });
    }
    if (item.userName) {
      $item.find(".open").removeClass("open").addClass("end");
    }
    if (first) {
      $item.appendTo(this.$parentDom);
    } else {
      $item.appendTo($items);
    }
  }
};
AddEmployee.prototype.update = function (data) {
  this.render(data);
};

AddEmployee.prototype.updateSelect = function (dom) {
  var $dom = $(dom).parent().parent();
  var data = $dom.data("data");
  if ($dom.find(">a span").hasClass("end")) {
    $dom.find(">a .select").toggleClass("radioed");
  }
  if (this.$type === 'single') {
    var ul = $(dom).parents('ul');
    ul.find('.select').removeClass('radioed');
    $dom.find(">a .select").toggleClass("radioed");
  }
  if ($dom.find(">a span").hasClass("radioed")) {
    if (this.$type === 'single') {
      this.$data = [];
    }
    this.$data.push(data);
  } else {
    this.$data = this.$data.filter(function (item) {
      return item.userNo !== data.userNo;
    });
  }
  this.radioParent($dom);
  this.renderResult(this.$data);
};
AddEmployee.prototype.updateAllSelect = function (own) {
  var data = $(own).parents('li').data('data');
  var users = data.users || [];
  var list = this.$data;
  if (users.length === 0) {
    return;
  }
  if (users && users.length > 0) {
    for (var i = 0, length = users.length; i < length; i++) {
      var user = users[i];
      for (var j = 0; j < list.length; j++) {
        if (user.userNo === list[j].userNo) {
          list.splice(j, 1);
        }
      }
    }
  }
  if ($(own).hasClass('radioed')) {
    $(own).parents('li').find('.select').removeClass('radioed');
  } else {
    $(own).parents('li').find('.select').addClass('radioed');
    this.$data = this.$data.concat(users);
  }
  this.renderResult(this.$data);
};
AddEmployee.prototype.radioParent = function (dom) {
  var $dom = dom.parent("ul").parent("li").find(">a .select");
  if (dom.parent("ul").find(".radioed").length > 0) {
    $dom.addClass("radioed");
  } else {
    $dom.removeClass("radioed");
  }
};
AddEmployee.prototype.open = function (dom) {
  var $dom = $(dom).parent().parent();
  var data = $dom.data("data");
  if (!data.users) {
    return false;
  }
  $dom.find(".sub").toggle();
  $dom.find(">a .open").toggleClass("active");
};
AddEmployee.prototype.renderResult = function (data) {
  var that = this;
  that.$result.html("");
  data = data || that.$data;
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var $dom = $('<li>\
                    <a>\
                     <span class="result-active"></span>\
                     <strong></strong>\
                     <i></i>\
                   </a>\
                  </li>');
    $dom.find("strong").text(item.userName);
    $dom.find("i").data("id", item.userNo);
    $dom.find("i").click(function (e) {
      Common.stopPropagation(e);
      var id = $(this).data("id");
      that.$data = that.$data.filter(function (item) {
        return item.userNo !== id;
      });
      that.$parentDom.find(".id-" + id).removeClass("radioed");
      $(this).parents('li').remove();
      that.radioParent(that.$parentDom.find(".id-" + id))
    });
    $dom.appendTo(this.$result);
  }
};

AddEmployee.prototype.renderSelectData = function (data) {
  data = data || [];
  for (var i = 0, length = data.length; i < length; i++) {
    var item = data[i];
    var li = this.$model.$body.find('.sub .id-' + item.userNo).parents('.level1 li');
    li.find('.open').addClass('active');
    li.find('.sub').show();
    this.updateSelect(this.$model.$body.find('.sub .id-' + item.userNo));
  }
};
AddEmployee.prototype.getUserTreeList = function (callback) {
  var that = this;
  request.post('/customer/user/getTree').then(function (res) {
    that.update(res.data); // 更新分级数据
    if (callback) {
      callback();
    }
  });
};

AddEmployee.prototype.getUserTreeDetailList = function (callback) {
  var that = this;
  request.post('/customer/user/getDetailTree').then(function (res) {
    that.update(res.data); // 更新分级数据
    if (callback) {
      callback();
    }
  })
};

AddEmployee.prototype.getOrganizePosition = function (callback, projId) {
  var that = this;
  projId = projId || $('#projectSchedule').data('id');
  request.get('/customer/organize/oldOrganize', { qs: { projId: projId } }).then(function (res) {
    that.update(res.data); // 更新分级数据
    if (callback) {
      callback();
    }
  });
};

module.exports = AddEmployee;