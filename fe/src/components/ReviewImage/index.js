var TempModel = require('./Model.ejs');
var request = require('../../helper/request');

function ReviewImage(data, name, index) {
    if (!(this instanceof ReviewImage)) {
        return new ReviewImage(data);
    }
    if (!data) {
        this.$data = []
    } else if (typeof data === 'string') {
        this.$data = [data];
    } else if (typeof data === 'object') {
        this.$data = data;
    }
    this.$modal = $(TempModel());
    this.$name = name;
    this.$close = this.$modal.find('.icon-attach-close');
    this.$imgBody = this.$modal.find('.image_list');
    this.$clickArrow = this.$modal.find('.icon-attach-arrow');
    this.$page = this.$modal.find('.page');
    this.topWindow = $.isTopWindow ? window : parent;
    this.$topDocument = $(this.topWindow.document);
    this.$container = this.$topDocument.find('.model-wrap');
    var that = this;
    this.$index = index || 0;
    this.$total = this.$data.length;
    this.$close.click(function (e) {
        that.hide();
    });
    this.renderIMage();
    this.$clickArrow.click(function (e) {
        var type = $(this).data('type');
        if (type === 'left') {
            that.$index--;
            if (that.$index < 0) {
                that.$index = 0;
                return false;
            }
        } else {
            that.$index++;
            if (that.$index > that.$total - 1) {
                that.$index = that.$total - 1;
                return false;
            }
        }
        that.renderIMage();
    });
}

ReviewImage.prototype.renderPage = function () {
    var page = this.$index + 1;
    this.$page.text(page + '/' + this.$total)
};
ReviewImage.prototype.renderIMage = function (data, name) {
    var list = data && Array.isArray(data) ? data : this.$data;
    name = name || this.$name;
    this.$imgBody.html('');
    var item = list[this.$index];
    if (!item) {
        return;
    }
    if (typeof item === 'object') {
        item = item[name]
    }
    var dom = $('<img style="width: 100%;height: 100%;">');
    // LEE: 判断图片是从手机微信上传的还是在PC端上传的，微信图片域名和PC图片域名不同
    // 微信图片域名：https://weixin.azhu.co+返回的图片路径
    // PC图片域名：https://gc.azhu.co/customer+返回的图片路径
    var PCUploadReg = /^\/upload\//;
    var WXUploadReg = /^\/uploadWechat\/wechat\//;
    if (WXUploadReg.test(item)) {
        dom.attr('src', window.WXPIC_PATH + item);
    } else if (PCUploadReg.test(item)) {
        dom.attr('src', window.API_PATH + '/customer' + item);
    }
    dom.appendTo(this.$imgBody);
    this.renderPage();
};
ReviewImage.prototype.show = function () {
    this.display(true);
};

ReviewImage.prototype.hide = function () {
    this.display(false);
};

ReviewImage.prototype.display = function (show) {
    if (show) {
        this.$modal.appendTo(this.$container);
        this.$modal.addClass('show');
    } else {
        this.$modal.remove();
    }
};
ReviewImage.prototype.getAttaches = function (data, name) {
    var that = this;
    request.post('/customer/attach/findAttachs', {body: data}).then(function (res) {
        if (res.code === 1) {
            that.$data = res.data ? res.data : [];
            that.$total = that.$data.length;
            that.$name = name;
            that.renderIMage(that.$data);
            if (that.$total > 0) {
                that.show();
            } else {
                return alert('没有数据');
            }
        }
    })
};
module.exports = ReviewImage;