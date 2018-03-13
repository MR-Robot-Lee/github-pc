var documentApi = require('./documentApi');
var renderDocumentManagerTable = require('./renderDocumentManagerTable');
var initEvent = require('./initEvent');

exports.getCategoryTypeFunc = function () {
    documentApi.getCategoryType().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentManagerTable.renderMoveSelectDom(list);
    })
};
exports.getCategoryTreeFunc = function () {
    documentApi.getTypeTree().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentManagerTable.renderSelectDom(list);
    })
};
exports.getCategoryTreeTableFunc = function () {
    documentApi.getTypeTree().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentManagerTable.renderSelectTableDom(list);
    })
};
exports.postCategoryTypeFunc = function (data, modal) {
    var that = this;
    documentApi.postCategoryType(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getTypeTreeFunc(null, null, 'ppt');
        }
    })
};
exports.putCategoryTypeFunc = function (data, modal) {
    documentApi.putCategoryType(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#pid-' + data.id).find('.content').text(data.fileCategoryName);
            $('#pid-' + data.id).data('item', {id: data.id, name: data.fileCategoryName});
        }
    })
};
exports.delCategoryTypeFunc = function (id, modal) {
    var that = this;
    documentApi.delCategoryType(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getTypeTreeFunc(id, null, 'pdl');
        }
    })
};

exports.postFileTypeFunc = function (data, modal) {
    var that = this;
    documentApi.postFileType(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getTypeTreeFunc(data.fileCategory, null, 'cpt');
        }
    })
};
exports.putFileTypeFunc = function (data, modal) {
    documentApi.putFileType(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#cid-' + data.id).find('.content').text(data.fileTypeName);
            $('#cid-' + data.id).data('item', {name: data.fileTypeName, id: data.id, pid: data.fileCategory});
        }
    })
};
exports.delFileTypeFunc = function (data, modal) {
    var that = this;
    documentApi.delFileType(data.id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getTypeTreeFunc(data.fileCategory, data.id, 'cdl');
        }
    })
};
/**
 * 获取table数据
 * @param data
 */
exports.getBaseListFunc = function (data) {
    documentApi.getBaseList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentManagerTable.renderDocumentManagerTable(list);
    });
};

exports.getTypeTreeFunc = function (pid, cid, type) {
    documentApi.getTypeTree().then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = $('#childNav').html('');
        renderDocumentManagerTable.renderDocumentManagerNav(list, parents);
        initEvent.initDocumentManagerNavEvent(parents, pid, cid, type);
    });
};

exports.putMoveFileFunc = function (data, modal) {
    var that = this;
    documentApi.putMoveFile(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getTypeTree();
        }
    })
};

exports.putMoveFileTableFunc = function (data, modal) {
    var that = this;
    documentApi.putMoveFileTable(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getTypeTree();
        }
    });
};

exports.delBaseFunc = function (id, modal) {
    documentApi.delBase(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#childNav >li.active>ul>li.active').click();
        }
    })
};

exports.getHistoryDownloadListFunc = function (data) {
    documentApi.getHistoryDownloadList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentManagerTable.renderDownloadTable(list);
    })
};

/**
 * 上传文件
 * @param file
 * @param pid
 * @param cid
 */
exports.initUploadFile = function (file, pid, cid) {
    var that = this;
    var inner = $('.progress-inner');
    var upload = documentApi.uploadFile(file, function (data) {
        var pro = parseInt(data * 100) + '%';
        inner.css('width', pro);
    }, pid, cid);
    upload.then(function (res) {
        if (res.code === 1) {
            that.getBaseListFunc({fileType: cid, fileCategory: pid})
        }
    })
};

exports.downloadFunc = function (data) {
    documentApi.download(data).then(function (res) {

    })
};

/**
 * 动态下载
 * @returns {boolean}
 */
window.initProjectDownload = function initDownload() {
    var trs = $('#documentManagerTable').find('tr');
    var inputs = trs.find('[type=checkbox]:checked');
    if (inputs.length === 0) {
        alert('请选择要下载的文件');
        return false;
    }
    if (inputs.length > 1) {
        alert('下载每次只能选择一个');
        return false;
    }
    var item = inputs.parents('tr').data('item');
    documentApi.postDownload({fileId: item.id}).then(function (res) {
        if (res.code === 1) {
            window.location.href = window.API_PATH + '/customer/attach/download?filePath=' + item.fileUrl + '&fileName=' + item.fileName;
        }
    });
};