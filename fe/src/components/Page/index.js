var Temp = require('./Page.ejs');

function Page (container, options) {
  this.$container = $(container);
  this.$page = $(Temp());//分页器
  this.$page.appendTo(this.$container);
  this.$pageSize = this.$page.find('.Page__size');//一次展示页数
  this.$pagePages = this.$page.find('.Page__pages');//当前页数
  this.$pageInput = this.$page.find('.Page__input');//跳转页数
  this.$btnFirst = this.$pagePages.find('.first');//首页
  this.$btnPre = this.$pagePages.find('.pre');//上一页
  this.$btnNext = this.$pagePages.find('.next');//下一页
  this.$btnEnd = this.$pagePages.find('.end');//尾页
  this.$btnSubmit = this.$pageInput.find('.btn-submit');//确定
  options = options || {};
  this.pageSize = options.pageSize || [10, 30, 50];
  this.pageData = {
    pageSize: options.size || this.pageSize[0],
    pageNo: 1,
    pageTotal: 0,
    total: 0
  };
  var that = this;
  for (var i = 0; i < this.pageSize.length; i += 1) {
    var dom = $('<a class="item" data-v="' + this.pageSize[i] + '"></a>');
    dom.data('size', this.pageSize[i]);
    dom.text(this.pageSize[i]);
    dom.click(function () {
      that.onSizeChange($(this).data('size'));
    });
    dom.bind('selectstart', function () {
      return false;
    });
    if (this.pageData.pageSize === this.pageSize[i]) {
      dom.addClass('active');
    }
    dom.appendTo(this.$pageSize.find('.items'));
  }
  this.renderPages();
  this.$pagePages.find('.c').click(function () {
    if ($(this).hasClass('disable')) {
      return;
    }
    var page;
    if ($(this).hasClass('first')) {
      page = 1;
    }
    if ($(this).hasClass('pre')) {
      page = that.pageData.pageNo - 1;
    }
    if ($(this).hasClass('next')) {
      page = that.pageData.pageNo + 1;
    }
    if ($(this).hasClass('end')) {
      page = that.pageData.pageTotal;
    }
    that.onPageChange(page);
  });
  this.$pagePages.find('.c').bind('selectstart', function () {
    return false;
  });
  this.$btnSubmit.click(function () {
    var page = parseInt(that.$pageInput.find('input').val(), 10);
    if (page > 0 && page <= that.pageData.total) {
      that.onPageChange(page);
    }
  });
  this.$btnSubmit.bind('selectstart', function () {
    return false;
  });
}

Page.prototype.renderPages = function () {
  var page = this.pageData.pageNo;
  var total = this.pageData.pageTotal;
  total = total < 1 ? 1 : total;
  page = total < 1 ? 1 : page;
  var pages = [];
  this.$btnFirst.removeClass('disable');
  this.$btnPre.removeClass('disable');
  this.$btnEnd.removeClass('disable');
  this.$btnNext.removeClass('disable');
  if (page === 1) {
    this.$btnFirst.addClass('disable');
    this.$btnPre.addClass('disable');
  }
  if (page === total) {
    this.$btnNext.addClass('disable');
    this.$btnEnd.addClass('disable');
  }
  var $pages = this.$pagePages.find('.pgs');
  $pages.find('.item').remove();
  if (page - 1 >= 1) {
    pages.push(this.makePageDom(page - 1));
  }
  pages.push(this.makePageDom(page, true));
  if (page + 1 <= total) {
    pages.push(this.makePageDom(page + 1));
  }
  for (var i = 0; i < pages.length; i++) {
    $pages.append(pages[i]);
  }
};

Page.prototype.makePageDom = function (page, active) {
  var dom = $('<a class="item"></a>');
  dom.text(page);
  dom.data('v', page);
  if (active) {
    dom.addClass('active');
  }
  var that = this;
  dom.click(function () {
    that.onPageChange($(this).data('v'));
  });
  dom.bind('selectstart', function () {
    return false;
  });
  return dom;
};

Page.prototype.change = function (cb) {
  if (typeof cb === 'function') {
    this.onChange = cb;
  }
};

Page.prototype.emitChange = function (data) {
  this.upData(data);
  if (this.onChange) {
    this.onChange(this.pageData);
  }
};

Page.prototype.upData = function (data) {
  if (data.pageSize) {
    this.pageData.pageSize = data.pageSize;
    this.pageData.pageNo = 1;
  }
  if (data.pageNo >= 0) {
    this.pageData.pageNo = data.pageNo;
  }
  if (data.total >= 0) {
    this.pageData.total = data.total;
  }
  this.pageData.pageTotal = Math.ceil(this.pageData.total / this.pageData.pageSize);
};

Page.prototype.onSizeChange = function (size) {
  if (size !== this.pageData.pageSize) {
    this.emitChange({ pageSize: size });
  }
};

Page.prototype.onPageChange = function (page) {
  this.emitChange({ pageNo: page });
};

Page.prototype.update = function (data) {
  this.upData(data);
  this.renderPages();
  this.$pageSize.find('.item').removeClass('active');
  this.$pageSize.find('[data-v=' + this.pageData.pageSize + ']').addClass('active');
  this.$pagePages.find('.count').text(this.pageData.total);
};

module.exports = Page;
