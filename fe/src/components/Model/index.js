var TempModel = require('./Model.ejs');
var common = require('../../pages/Common');


function Model(title, body) {
    if (!(this instanceof Model)) {
        return new Model(title, body);
    }
    var that = this;
    this.$model = $(TempModel({title: title || '', body: body || ''}));
    this.$modelInner = this.$model.find('.Model');
    this.$body = this.$model.find('.Model__body');
    this.$header = this.$model.find('.Model__header');
    this.topWindow = $.isTopWindow ? window : parent;
    this.$topDocument = $(this.topWindow.document);
    this.$close = this.$model.find("i");
    this.$container = this.$topDocument.find('.model-wrap');
    this.$close.click(function (e) {
        common.stopPropagation(e);
        that.hide();
    });
    this.$model.find('[data-model-close]').click(function (e) {
        common.stopPropagation(e);
        that.hide();
    });
}

Model.prototype.showClose = function () {
    this.$close.show();
};
Model.prototype.hideClose = function () {
    this.$close.hide();
};
Model.prototype.title = function (title) {
    this.$model.find('.Model__header .title').text(title);
};

Model.prototype.onClose = function (cb) {
    this.onCloseFn = cb;
};

Model.prototype.display = function (show) {
    if (show) {
        this.$model.appendTo(this.$container);
        this.$model.addClass('show');
        this.$container.on('click', function (e) {
            common.stopPropagation(e);
            $(this).find('.model-add-supplier').remove();
            $(this).find('.modal-add-type').remove();
        })
    } else {
        if (this.onCloseFn) {
            this.onCloseFn(this);
        }
        this.$model.remove();
        this.$model.removeClass('show');
        this.$container.off('click', function (e) {
            common.stopPropagation(e);
        })
        // if (this.$container.find('.Model.show').length < 1) {
        //   this.$container.removeClass('show');
        // }
    }
};

Model.prototype.show = function () {
    this.display(true);
};

Model.prototype.hide = function () {
    this.display(false);
};

Model.prototype.destroy = function () {
    this.display(false);
    this.$model.remove();
    if (this.topWindow.ModelStack.indexOf(this) >= 0) {
        this.topWindow.ModelStack.splice(this.topWindow.ModelStack.indexOf(this), 1);
    }
};

module.exports = Model;
