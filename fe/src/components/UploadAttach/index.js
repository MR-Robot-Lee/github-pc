var Temp = require('./Upload.ejs');
var TempAttach = require('./Attach.ejs');
var TempProgress = require('./progress.ejs')
var request = require('../../helper/request');
var ReviewImage = require('../ReviewImage');


function UploadAttach(appendTo, rest) {
    if (!(this instanceof UploadAttach)) {
        return new UploadAttach(appendTo);
    }
    var that = this;
    this.$main = $(Temp({name: '阿萨德法师打发', type: 'xls'}));
    this.$addBtn = this.$main.find('.btn-add');
    this.$process = this.$addBtn.find('.proc');
    this.$item = this.$main.find('.Upload-item');
    this.uploading = false;
    this.$addBtn.click(function () {
        if (that.uploading) {
            return;
        }
        if (rest) {
            var data = that.getAttaches();
            if (data.length === 3) {
                return alert("如果在次添加超出上传限制");
            }
        }
        $(this).siblings('input').click();
    });

    this.$main.find('input').change(function () {
        var file = this.files[0];
        var attachName = file.name.split('.');//获取附件名
        var attachType = (attachName[attachName.length - 1]);//获取后缀名
        var operType = 'upload';//操作类型 上传
        that.TempAttach(file, operType, attachName, attachType);
    });
    this.$main.appendTo($(appendTo));
}

/**
 * @param file 附件数据
 * @param operType 操作类型
 * @param attachName 附件名
 * @param type 附件后缀
 * 重新上传 传4个参数，数据回填 传2个参数
 */
UploadAttach.prototype.TempAttach = function (file, operType, _attachName, _attachType) {
    var that = this;
    var attachName = _attachName || file.attachName;
    var attachType = _attachType || file.attachType;
    var size = file.size / 1024 / 1024;
    if (size >= 10) {
        return alert('上传文件大小不超过10M');
    }
    var type = attachType === "pdf" || attachType === "PDF"
    || attachType === 'xls' || attachType === 'XLS'
    || attachType === 'ppt' || attachType === 'PPT'
    || attachType === 'pptx' || attachType === 'PPTX'
    || attachType === 'gbq' || attachType === 'GBQ'
    || attachType === 'gbq5' || attachType === 'GBQ5'
    || attachType === 'gtb4' || attachType === 'GTB4'
    || attachType === 'txt' || attachType === 'TXT'
    || attachType === 'xlsx' || attachType === 'XLSX'
    || attachType === 'zip' || attachType === 'ZIP'
    || attachType === 'rar' || attachType === 'RAR'
    || attachType === 'jpeg' || attachType === 'JPEG'
    || attachType === 'png' || attachType === 'PNG'
    || attachType === 'jpg' || attachType === 'JPG'
    || attachType === 'cad' || attachType === 'CAD'
    || attachType === 'dwg' || attachType === 'DWG'
    || attachType === 'video' || attachType === 'VIDEO'
    || attachType === 'docx' || attachType === 'DOCX'
    || attachType === 'DOC' || attachType === 'doc' ? attachType : 'none';
    if (type == 'none') {
        return alert('不支持上传该类型附件');
    }
    var attach = $(TempAttach({name: attachName, type: type}));
    attach.find('.remove').click(function () {
        $(this).parents('.UploadAttach__item').remove();
    });
    that.$item.append(attach);//发送请求前先渲染图标和附件名

    /*操作类型 upload 上传 appendAttach 数据回填*/
    if (operType === 'upload') {
        that.upload(file, attach)//开始
    } else if (operType === 'appendAttach') {
        that.appendAttach(file, attach);
    }
}

UploadAttach.prototype.upload = function (file, attach) {
    var that = this;
    this.uploading = true;
    var req = request.upload(file, function (pro) {
        pro = parseInt(pro * 100) + '%';
        that.progress(pro);
        that.$process.width(pro * 100 + '%');
    });
    req.then(function (res) {
        that.uploaded(null, res.data, attach);
    });
    req['catch'](function (e) {
        that.uploaded(true);
    });
};

UploadAttach.prototype.progress = function (pro) {
    var bar = $(TempProgress({pro: pro}));
    this.$item.find('.attachProgress').remove();
    this.$item.append(bar);
}

UploadAttach.prototype.uploaded = function (err, data, attach) {
    this.uploading = false;
    this.$process.width(0);
    this.$main.find('input').val('');
    if (data) {
        this.appendAttach(data, attach);
    }
};
// LEE: 供应商库图片预览
UploadAttach.prototype.appendAttach = function (data, attach) {
    var _this = this;
    var urlList = [];
    attach.data('data', data);
    this.$item.find('.attachProgress').remove();//移除进度条
    this.$item.find('.remove').show();//显示删除按钮
    if (data.attachType === 'jpeg' || data.attachType === 'JPEG'
        || data.attachType === 'png' || data.attachType === 'PNG'
        || data.attachType === 'jpg' || data.attachType === 'JPG') {
        attach.addClass('isPic');
        attach.find('.review').show();//显示预览按钮
        attach.find('.review').click(function (e) {
            urlList.length = 0;
            var allPics = _this.$item.find('.isPic');
            var rank = $(this).parents('.isPic').prevAll('.isPic').length;
            allPics.each(function (index, ele) {
                urlList.push($(ele).data('data').attachUrl);
            })
            var review = new ReviewImage(urlList, '', rank);
            review.show();
        })
    } else if (data.attachType === 'txt' || data.attachType === 'TXT'
        || data.attachType === 'pdf' || data.attachType === 'PDF') {
        attach.find('.review').show();//显示预览按钮
        attach.find('.review').find('a').attr('href', window.API_PATH + '/customer' + data.attachUrl);
    }
};

UploadAttach.prototype.getAttaches = function () {
    var data = [];
    this.$main.find('.UploadAttach__item').each(function () {
        data.push($(this).data('data'));
    });
    if (this.uploading) {
        alert('附件添加中请稍后再试');
        return false;
    }
    return data;
};
UploadAttach.prototype.reset = function () {
    this.uploading = false;
    this.$main.find(".Upload-item").html("");
};

UploadAttach.prototype.delAttaches = function (attachUrl) {
    this.$main.find('.UploadAttach__item').each(function () {
        if (attachUrl === $(this).data('data').attachUrl) {
            $(this).remove();
        }
    });
};
/*
* 关于将获取到的上传附件信息展示到某个容器的方法:
* ============================================
* @param {JQ}  box  展示附件信息的容器
* @param {Array}  attaches  附件信息数组
* @param {String}  appendAttach  TempAttach方法的调用方式,固定字符串"appendAttach"
*
* var attach = new UploadAttach( box );
* for (var i = 0, length = attaches.length; i < length; i++) {
*     attach.TempAttach(attaches[i],'appendAttach');
* }
* ============================================
*
* 例:
* $('#employeeFile')为容器
* obj.attaches为获取到的数组数据
* ============================================
* var attach = new UploadAttach($('#employeeFile'));
* for (var i = 0, length = obj.attaches.length; i < length; i++) {
*     attach.TempAttach(obj.attaches[i],'appendAttach');
* }
* ============================================
* */


module.exports = UploadAttach;
