var TempMain = require('./UploadImage.ejs');
var TempDisplay = require('./DisplayImage.ejs');
var request = require('../../helper/request');

function UploadImage(appendTo) {
    if (!(this instanceof UploadImage)) {
        return new UploadImage(appendTo);
    }
    var that = this;
    this.$upload = $(TempMain());
    this.$uploadBox = this.$upload.find('.UploadImage__add');
    this.$upload.find('.icon-add').click(function () {
        if (that.uploading) {
            return;
        }
        $(this).siblings('input').click();
    });
    this.$file = this.$upload.find('input');
    this.$uploadBox.find('.btn-add').hide();
    this.uploading = false;
    this.$file.change(function () {
        var file = this.files[0];
        var attachName = file.name.split('.');//获取附件名
        var attachType = (attachName[attachName.length - 1]);//获取后缀名
        var size = file.size / 1024 / 1024;
        if (attachType === 'png' || attachType === 'jpg' || attachType === 'jpeg' ||
            attachType === 'PNG' || attachType === 'JPG' || attachType === 'JPEG') {
            if (size >= 10) {
                return alert('上传文件大小不超过10M');
            } else {
                that.upload(file);
            }
        } else {
            return alert('只能上传图片！');
        }
    });
    this.$process = this.$upload.find('.proc');
    this.$uploadBox.find('.btn-add').click(function () {
            that.appendImage(
                that.$uploadBox.data('src'),
                that.$uploadBox.find('textarea').val(),
                that.$uploadBox.data('data')
            );
            that.reset();
        }
    );
    this.$appendTo = $(appendTo);
    this.$upload.appendTo(this.$appendTo);
}

UploadImage.prototype.upload = function (file) {
    var that = this;
    this.uploading = true;
    this.$upload.find('.icon-add').removeClass('finished');
    this.$uploadBox.find('.btn-add').hide();
    var req = request.upload(file, function (pro) {
        that.$process.width(pro * 100 + '%');
    });
    this.$uploadBox.find('.icon-add img').remove();
    req.then(function (res) {
        that.uploaded(null, res);
    });
    req['catch'](function (e) {
        that.uploaded(true);
    });
};

UploadImage.prototype.uploaded = function (err, res) {
    this.$process.width(0);
    this.$file.val('');
    if (!err) {
        var src = res.data.attachUrl;
        $('<img src="' + window.API_PATH + '/customer' + src + '">').appendTo(this.$uploadBox.find('.icon-add'));
        this.$uploadBox.data('src', src);
    }
    this.$uploadBox.find('.btn-add').show();
    this.uploading = false;
    this.$uploadBox.find('.icon-add').addClass('finished');
    this.$uploadBox.data('data', res.data);
};

UploadImage.prototype.reset = function () {
    this.$uploadBox.find('.btn-add').hide();
    this.uploading = false;
    this.$uploadBox.find('.icon-add').removeClass('finished');
    this.$uploadBox.find('img').remove();
    this.$uploadBox.find('textarea').val('');
    this.$uploadBox.data('data', null);
    this.$uploadBox.data('src', null);
};

/*
* 数据回填时可调用该方法
* @param url
* @param remark （允许为空）
* @param data 图片的完整数据
* */
UploadImage.prototype.appendImage = function (url, remark, data) {
    var img = $(TempDisplay({
        src: window.API_PATH + '/customer' + url,
        text: remark,
    }));
    img.find('.close').click(function () {
        $(this).parents('.UploadImage__image').remove();
    });
    data['remark'] = remark;
    data['attachUrl'] = url;
    img.data('data', data);
    this.$uploadBox.before(img);
};

UploadImage.prototype.getImages = function () {
    var data = [];
    this.$upload.find('.UploadImage__image').each(function () {
        data.push($(this).data('data'));
    });
    return data;
};

module.exports = UploadImage;
