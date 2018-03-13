var initEvent = require('./initEvent');
var documentApi = require('./documentApi');
var renderDocumentTable = require('./renderDocumentTable');
var addEmployee = require('../../components/addEmployee');
var request = require('../../helper/request');


exports.initAddFileCabinet = function () {
    initEvent.addFileCabinetModal();
};
exports.initChildFile = function () {
    initEvent.initFileCabinetDetailEvent();
};
exports.initGetAllUser = function (modal) {
    documentApi.getAllUserList().then(function (res) {
        var list = res.data ? res.data : [];
        renderDocumentTable.initAddFileCabinet(modal, list);
    })
};

exports.initGetUserTree = function (modal, $list) {
    documentApi.getUserTreeList().then(function (res) {
        var list = res.data ? res.data : [];
        var $addEmployee = new addEmployee('选择人员', function (data) {
            renderDocumentTable.initAddFileCabinet(modal, data);
            modal.$body.find('.confirm').data('list', data);
            $addEmployee.hide();
        });
        $addEmployee.show();
        $addEmployee.update(list);
        if ($list && $list.length > 0) {
            $addEmployee.renderSelectData($list);
        }
    })
};

exports.initFileCabinet = function () {
    documentApi.getFileCabinet().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentTable.renderCompanyFileCabinet(list)
    })
};

exports.initFileCabinetDetail = function (typeNo, pid, tableType) {
    pid = pid || $('.document-menus').data('id');
    documentApi.getFileCabinet({parentId: pid, typeNo: typeNo}).then(function (res) {
        var list = res.data ? res.data.data : [];
        if (tableType == 1) {
            renderDocumentTable.renderMyFileCabinetTable(list);
        } else if (tableType == 2) {
            renderDocumentTable.renderFileCabinetManager(list);
        } else {
            renderDocumentTable.renderCompanyFileCabinetDetail(list);
        }
        // initFileCabinetManager
    });
};

exports.initFileModal = function (modal, value, parentId) {
    var that = this;
    var typeNo = '';
    var type = $('.document-menus').data('type');
    if (type === 'admin-me' || type === 'document-admin-me') {
        typeNo = 2;
    } else if (type === 'admin-company' || type === 'document-admin-company') {
        typeNo = 1;
    } else if (type === 'admin-manager') {
        typeNo = $('.document-menus').data('type-no');
    }
    documentApi.postFile({cbntName: value, typeNo: typeNo, parentId: parentId}).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.initFileCabinetDetail(typeNo, parentId);
        }
    })
};
/**
 * 初始化文件柜属性
 * @param modal
 * @param id
 */
exports.initFileCabinetAttribute = function (modal, id) {
    documentApi.getFileCabinetAttr({id: id}).then(function (res) {
        if (res.code === 1) {
            renderDocumentTable.initAttributeDom(modal, res.data || {});
        }
    })
};

exports.initMYFileCabinetUpdate = function (modal, id) {
    documentApi.getFileCabinetAttr({id: id}).then(function (res) {

    });
};
/**
 * 通过id删除文件柜
 * @param modal
 * @param data
 */
exports.initFileCabinetDel = function (modal, data, tableType) {
    var that = this;
    var typeNo = '';
    var type = $('.document-menus').data('type');
    if (type === 'admin-me' || type === 'document-admin-me') {
        typeNo = 2;
    } else if (type === 'admin-company' || type === 'document-admin-company') {
        typeNo = 1;
    } else if (type === 'admin-manager') {
        typeNo = $('.document-menus').data('type-no');
    }
    documentApi.delFileCabinet(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            if (tableType == 1) {
                typeNo = 2;
                that.initFileCabinetDetail(typeNo, '', tableType);
            } else if (tableType == 2) {
                typeNo = '';
                that.initFileCabinetManager();
            } else if (tableType == 3) {
                that.initFileCabinetDetail(typeNo, '', tableType);
            }
        }
    })
};

/**
 * 初始化我的文件柜
 */
exports.initMyFileCabinet = function () {
    documentApi.getFileCabinet({typeNo: 2}).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentTable.renderMyFileCabinetTable(list);
    })
};
/**
 * 初始化文件柜添加
 * @param newItem
 * @param oldItem
 * @param modal
 */
exports.initAddFileCabinetSubmit = function (newItem, oldItem, modal) {
    if (oldItem) {
        newItem.id = oldItem.id;
        documentApi.putFileCabinet(newItem).then(function (res) {
            if (res.code === 1) {
                modal.hide();
                if (newItem.typeNo === '1') {
                    window.location.href = '/document'
                } else if (newItem.typeNo === '2') {
                    window.location.href = '/document/me'
                }
            }
        })
    } else {
        documentApi.postFileCabinet(newItem).then(function (res) {
            if (res.code === 1) {
                modal.hide();
                if (newItem.typeNo === '2') {
                    window.location.href = '/document/me'
                } else if (newItem.typeNo === '1') {
                    window.location.href = '/document'
                }
            }
        })
    }
};

/**
 *  初始化文件管理
 */
exports.initFileCabinetManager = function () {
    documentApi.getFileCabinetManager().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderDocumentTable.renderFileCabinetManager(list);
    })
};

exports.initUploadFile = function (file, pId) {
    var that = this;
    $("#noInfoAdministrationManagerTable").hide();
    $("#noInfoAdministrationManagerTable_main").show();
    var typeNo = '';
    var type = $('.document-menus').data('type');

    if (type === 'admin-me' || type === 'document-admin-me') {
        typeNo = 2;
    } else if (type === 'admin-company' || type === 'document-admin-company') {
        typeNo = 1;
    } else if (type === 'admin-manager') {
        typeNo = $('.document-menus').data('type-no');
    }
    $("#administrationManagerTable").append('<tr>' +
        '<td></td>' +
        '<td class="fileLoading">正在上传 <span>.</span></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '</tr>');
    var n = -1;
    var timer = setInterval(function () {
        if (n === 3) {
            n = -1;
        }
        n++;
        var point = n == 0 ? '. .' : n == 1 ? '. . .' : n == 2 ? '. . . .' : '.';
        $('.fileLoading span').text(point);
    }, 400);


    var upload = documentApi.uploadFile(file, function (data) {
    }, pId);
    upload.then(function (res) {
        if (res.code === 1) {
            that.initFileCabinetDetail(typeNo, pId);
        }
    })

};

exports.initGetCallBackList = function (data) {
    documentApi.getCallBackList(data).then(function (res) {
        var list = res.data ? res.data.child : [];
        var obj = res.data ? res.data.parent : {};
        $('.document-menus').data('id', obj.id);
        $('#childName').text('>' + obj.cbntName);
        renderDocumentTable.renderCompanyFileCabinetDetail(list);
    })
};

/**
 * 动态下载
 * @returns {boolean}
 */
window.initDownload = function initDownload() {
    var trs = $('#administrationManagerTable').find('tr');
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
    if (item.fileStatus === 1) {
        alert('请选择要下载的文件');
        return false;
    }
    documentApi.postDownload({fileId: item.id}).then(function (res) {
        if (res.code === 1) {
            window.location.href = window.API_PATH + '/customer/attach/download?filePath=' + item.fileUrl + '&fileName=' + item.cbntName;
        }
    });
};

exports.initGetDownload = function (data, parents) {
    documentApi.getDownload(data).then(function (res) {
        var list = res.data ? res.data : [];
        renderDocumentTable.renderFileDownloadRecode(list, parents);
    })
};

/**
 * 移动文件
 * @param data
 * @param modal
 */
exports.initPutMoveFile = function (data, modal) {
    var that = this;
    var typeNo = '';
    var type = $('.document-menus').data('type');
    if (type === 'admin-me' || type === 'document-admin-me') {
        typeNo = 2;
    } else if (type === 'admin-company' || type === 'document-admin-company') {
        typeNo = 1;
    } else if (type === 'admin-manager') {
        typeNo = $('.document-menus').data('type-no');
    }
    documentApi.putMoveFile(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.initFileCabinetDetail(typeNo);
        }
    })
};
/**
 * 获取文件树
 * @param data
 * @param modal
 * @param parents
 * @param pid
 * @param child
 */
exports.initFetFileTree = function (data, modal, parents, pid, child) {
    var move = $('#move');
    if (!move.data('data')) {
        move.data('data', data);
    }
    documentApi.getFileTree(move.data('data')).then(function (res) {
        var list = res.data ? res.data : [];
        parents = parents || modal.$body.find('#fileTrees').html('');
        renderDocumentTable.renderMoveFileTable(list, parents, pid, child);
    })
};

/**
 *
 * 获取文件柜
 * @param data
 * @param modal
 */
exports.initGetFileCabintPermission = function (data, modal) {
    documentApi.getFileCabintPermission(data).then(function (res) {
        var list = res.data ? res.data : [];
        renderDocumentTable.initAddFileCabinet(modal, list);
    })
};

exports.renderCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var dcoManager = user.permission['docManage:*'];
    if (dcoManager) {
        $('#documentManager').show();
    } else {
        $('#documentManager').hide();
    }
};

