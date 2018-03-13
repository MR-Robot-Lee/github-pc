var request = require('../../helper/request');
var TempModal = require('./Select.ejs');
var common = require('../../pages/Common');

function Select (container, list, defaultValue, id, name, callback, selectEvent, defaultSelect) {
  if (!(this instanceof Select)) {
    return new Select(container);
  }
  this.$select = $(TempModal());
  this.$result = this.$select.find('.Select-active');
  this.renderParents = this.$select.find('.Select-render');
  this.$callback = callback;
  this.$defalut = defaultValue;
  this.$selectEvent = selectEvent;
  this.$defaultSelect = defaultSelect;
  if (container.find('.Select').length > 0) {
    container.find('.Select').remove();
  }
  if (typeof container === 'object') {
    this.$select.appendTo(container);
  } else if (typeof container === 'string') {
    if (container === 'undefined' || container.trim() === '') {
      throw new Error('没有绑定的dom')
    }
  }
  this.$id = id || 'id';
  this.$name = name || 'name';
  var that = this;
  if (defaultValue) {
    var data = {};
    data[this.$id] = 'a';
    data[this.$name] = '请选择';
    this.$result.data('item', data);
    this.$result.text('请选择')
  }
  this.$result.click(function (e) {
    common.stopPropagation(e);
    if (that.renderParents.find('li').length <= 0) {
      return false;
    }
    if (that.renderParents.hasClass('active')) {
      that.renderParents.removeClass('active');
    } else {
      that.renderParents.addClass('active');
    }
  });
  this.renderList(list);
  if (!list) {
    this.getData();
  }
}
Select.prototype.renderList = function (list) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<li class="Select-item"><a></a><i>删除</i></li>');
    dom.find('a').text(item[this.$name]);
    dom.data('item', item);
    if (item[this.$id] === this.$defaultSelect) {
      this.$result.text(item[this.$name]);
      this.$result.data('item', item);
    } else if (!this.$defalut && i === 0) {
      this.$result.text(item[this.$name]);
      this.$result.data('item', item);
    }
    dom.appendTo(this.renderParents);
  }
  if (!this.$defalut && list.length === 0) {
    this.$result.text('请选择');
  }
  var that = this;
  this.renderParents.find('li').click(function (e) {
    common.stopPropagation(e);
    var item = $(this).data('item');
    that.$result.data('item', item);
    that.$result.text(item[that.$name]);
    $(this).parents('ul').removeClass('active');
    if (that.$selectEvent) {
      that.$selectEvent(item);
    }
  });
  this.renderParents.find('i').click(function (e) {
    common.stopPropagation(e);
    var item = $(this).parents('li').data('item');
    if (that.$callback && typeof that.$callback === 'function') {
      that.$callback(item);
    }
  })
};

Select.prototype.getValue = function () {
  return this.$result.data('item') ? this.$result.data('item')[this.$id] : ''
};

Select.prototype.getText = function () {
  return this.$result.data('item') ? this.$result.data('item')[this.$name] : '';
};

Select.prototype.setValue = function (id) {
  this.$result.data('item');
};

Select.prototype.getData = function () {
  var data = {};
  data.projId = $('#projectSchedule').data('id');
  data.planType = 2;
  request.get('/customer/schedule/plan', { qs: data }).then(function (res) {
  })
};
module.exports = Select;