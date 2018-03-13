var Tpl = require('./Tree.ejs');

function Tree (container, options) {
  options = options || {};
  this.$tree = $("<div class='Tree'></div>");
  this.$container = $(container);
  this.$tree.appendTo(this.$container);
  this.radioed = null;
}

Tree.prototype.update = function (data) {
  this.render(data);
};

Tree.prototype.updateRadio = function (data) {
  for (var i = 0; i < data.length; i++) {
    this.$tree.find('.id-' + data[i]).find('.radio').click();
  }
};

Tree.prototype.onRadioed = function (fn) {
  this.radioed = fn;
};

Tree.prototype.render = function (data, $items) {
  var first = !$items;
  var that = this;
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var $item = $("<div class='item'><div class='content'><div class='spread'></div><div class='radio'></div><div class='name'></div></div></div>");
    $item.find('.name').text(item.deptName || item.userName);
    $item.data('data', item);
    $item.find('.spread').click(function () {
      that.spread(this);
    });
    $item.find('.radio').click(function () {
      that.radio(this);
    });
    if (item.userName) {
      $item.addClass('end');
      $item.addClass('id-' + item.userNo);
    }
    $item.appendTo($items);
    if (item.users && item.users.length > 0) {
      var $cItems = $("<div class='items'></div>");
      this.render(item.users, $cItems);
      $cItems.appendTo($item);
    }
    if (!$items) {
      $items = $("<div class='items'></div>");
      $items.show();
    }
    if (first) {
      $item.appendTo($items);
    }
  }
  if (first) {
    $items.appendTo(this.$tree);
    $items.bind('selectstart', function () {
      return false;
    });
  }
};

Tree.prototype.spread = function (dom) {
  var $dom = $(dom).parent().parent();
  $dom.find('>.items').toggle();
  $dom.find('>.content').toggleClass('spreading');
};

Tree.prototype.radio = function (dom) {
  var $dom = $(dom).parent().parent();
  var data = $dom.data('data');
  if ($dom.hasClass('end')) {
    $dom.find('>.content').toggleClass('radioed');
  } else {
    // $dom.find('.end .radio').click();
  }
  this.radioParent($dom);
};

Tree.prototype.radioParent = function ($dom) {
  var that = this;
  this.$tree.find('.radioed').each(function () {
    if ($(this).parents('.end').length < 1) {
      $(this).parents('.item').find('>.content').removeClass('radioed');
    }
  });
  var data = [];
  this.$tree.find('.end .radioed').each(function () {
    $(this).parents('.item').find('>.content').addClass('radioed');
    data.push($(this).parent().data('data'));
  });
  if (this.radioed) {
    this.radioed(data);
  }
};

module.exports = Tree;
