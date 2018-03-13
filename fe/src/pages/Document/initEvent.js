var common = require('../Common');
var Modal = require('../../components/Model');
var fileCabinetModal = require('./modal/fileCabinetModal.ejs');
var initDocumentFunc = require('./initDocumentFunc');
var newFileModal = require('./modal/newFileModal.ejs');
var removeFileModal = require('./modal/removeFileModal.ejs');
var checkAttributeModal = require('./modal/checkAttributeModal.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var renderDocumentTable = require('./renderDocumentTable');
var documentApi = require('./documentApi');
var ReviewImage = require('../../components/ReviewImage');
var downloadBrowerModal = require('./modal/downloadBrowerModal.ejs');

exports.addFileCabinetModal = function () {
    var addFile = $('#addFile');
    if (addFile.length > 0 && !addFile.data('flag')) {
        addFile.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('新建文件柜', fileCabinetModal());
            modal.show();
            modal.showClose();
            initFileCabinetModalEvent(modal);
            initFileCabinetAddAndUpdate(modal);
        });
    }
};

function initFileCabinetModalEvent(modal) {
    var allEmployee = modal.$body.find('#allEmployee');
    var selectEmployee = modal.$body.find('#selectEmployee');
    var fileCabinetType = modal.$body.find('.fileCabinetType');
    if (!fileCabinetType.data('flag')) {
        fileCabinetType.data('flag', true);
        fileCabinetType.change(function (e) {
            common.stopPropagation(e);
            var value = $(this).val();
            var single = true;
            var user = localStorage.getItem('user');
            user = user ? JSON.parse(user).employee : {};
            var list = [{userName: user.userName, userNo: user.userNo}];
            if (value && value == 2) {
                allEmployee.hide();
                selectEmployee.hide();
            } else {
                allEmployee.show();
                selectEmployee.show();
                list = modal.$body.find('.confirm').data('list');
                single = false;
            }
            renderDocumentTable.initAddFileCabinet(modal, list, single);
        });
        allEmployee.click(function (e) {
            common.stopPropagation(e);
            initDocumentFunc.initGetAllUser(modal);
        });
        selectEmployee.click(function (e) {
            common.stopPropagation(e);
            var data = initEmployeeData(modal);
            initDocumentFunc.initGetUserTree(modal, data);
        })
    }
}

function initEmployeeData(modal) {
    var data = [];
    var trs = modal.$body.find('tbody tr');
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        data.push(tr.data('item'));
    }
    return data;
}

/**
 * 修改或者添加文件柜
 */
function initFileCabinetAddAndUpdate(modal, item) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var fileCabinetType = modal.$body.find('.fileCabinetType').val();
        var fileName = modal.$body.find('.fileName').val();
        var filePotences = [];
        var trs = modal.$body.find('tbody tr');
        var error = false;
        var errMsg = '';
        for (var i = 0, length = trs.length; i < length; i++) {
            var tr = $(trs[i]);
            var $item = tr.data('item');
            var level = tr.data('level');
            if (!level) {
                error = true;
                errMsg = '请给员工赋予文件柜权限';
                break;
            }
            filePotences.push({userNo: $item.userNo, level: level || 1});
        }
        if (!fileName) {
            return alert('请输入文件名称');
        }
        if (!fileCabinetType || fileCabinetType === 'a') {
            return alert('请选择文件柜类型')
        }
        if (error) {
            return alert(errMsg);
        }
        initDocumentFunc.initAddFileCabinetSubmit({
            cbntName: fileName,
            typeNo: fileCabinetType,
            parentId: 0,
            filePotences: filePotences
        }, item, modal);
    })
}

exports.initTableCheckBoxEvent = function (parents) {
    parents.find('input[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var checked = $(this).prop('checked');
        if (value === '1') {
            $(this).parents('tr').find('input[type=checkbox]').prop('checked', checked);
            if (checked) {
                $(this).parents('tr').data('level', 1);
            } else {
                $(this).parents('tr').data('level', '');
            }
        } else if (value === '2') {
            $(this).parents('tr').find('input[type=checkbox]').prop('checked', false);
            $(this).prop('checked', checked);
            if (!checked) {
                $(this).parents('tr').data('level', '');
            } else {
                $(this).parents('tr').data('level', 2);
            }
        } else if (value === '3') {
            $(this).parents('tr').find('input[type=checkbox]').prop('checked', false);
            $(this).prop('checked', checked);
            if (checked) {
                $(this).parents('tr').data('level', 3);
            } else {
                $(this).parents('tr').data('level', '');
            }
        }
    })
};
exports.initFileCabinetDetailEvent = function () {
    var newFile = $('#newFile');
    if (!newFile.data('flag')) {
        newFile.data('flag', true);
        newFile.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('新建文件夹', newFileModal());
            modal.show();
            modal.showClose();
            initFileModalEvent(modal);
        });
        $('#del').click(function (e) {
            common.stopPropagation(e);
            var delModal = Modal('提示', deleteModal());
            delModal.show();
            delModal.showClose();
            delModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var list = [];
                var trs = $('#administrationManagerTable').find('tr');
                for (var i = 0, length = trs.length; i < length; i++) {
                    var tr = $(trs[i]);
                    var item = tr.data('item');
                    if (tr.find('input[type=checkbox]').prop('checked')) {
                        list.push(item.id);
                    }
                }
                if (list.length === 0) {
                    return alert('请选择要删除的文件及文件夹');
                }
                var tableType = '3'
                initDocumentFunc.initFileCabinetDel(delModal, {ids: list}, tableType);
            });
        });
        $('#move').click(function (e) {
            common.stopPropagation(e);
            var trs = $('#administrationManagerTable').find('[type=checkbox]:checked');
            if (trs.length === 0) {
                return alert('请选择移动的文件或者文件夹');
            }
            var moveModal = Modal('移动到', removeFileModal());
            moveModal.show();
            moveModal.showClose();
            initMoveModalEventData(moveModal);
            initMoveFileModalEvent(moveModal, trs);
        });
        $('#upload').change(function (e) {
            common.stopPropagation(e);
            var that = this;
            var pid = $('.document-menus').data('id');
            /*权限判断*/
            documentApi.checkPermission(pid).then(function(res){
                if (res.code === 1) {
                    /*上传文件大小限制*/
                    var files = that.files;
                    var size = that.files[0].size / 1024 / 1024;
                    if (size > 50) {
                        return alert('上传文件大小不能超过50MB!');
                    }
                    /*判断是否重复上传*/
                    var flag = false;
                    $('#administrationManagerTable tr').each(function(index,ele){
                        var tdFileName = $(ele).find('td').eq(1).find('.tdFileName').html();
                        if(files[0].name == tdFileName){
                            flag = true;
                            return false;
                        }
                    })
                    if(flag){
                        return alert('该文件已上传');
                    }
                    initDocumentFunc.initUploadFile(files[0], pid);
                }
            });
        });
        $('#callback').click(function (e) {
            common.stopPropagation(e);
            var type = $('.document-menus').data('type');
            var pid = $('.document-menus').data('id');
            var typeNo = $('.document-menus').data('type-no');
            var parentName = $('#parentName').text();
            parentName = parentName.split('>')
            var name = parentName[parentName.length - 1];
            documentApi.getCallBackList().then(function (res) {
                if (res.code === 2) {
                    return alert(res.desc);
                } else if (res.code === 17) {
                    var url = '';
                    if (type === 'document-admin-company' || type === 'admin-company') {
                        url = '/document'
                    } else if (type === 'admin-me' || type === 'document-admin-me') {
                        url = '/document/me'
                    } else if (type === 'admin-manager' || type === 'document-admin-manager') {
                        url = '/document/manager';
                    }
                    window.location.href = url;
                } else {
                    var navName = '';
                    if (parentName.length > 1) {
                        parentName.pop();
                        navName = parentName.join('>')
                    } else {
                        navName = parentName[0];
                    }
                    if (type === 'admin-company') {
                        type = 'document-admin-company';
                    } else if (type === 'admin-me') {
                        type = 'document-admin-me';
                    } else if (type === 'admin-manager' || type === 'document-admin-manager') {
                        type = 'document-admin-manager'
                    }
                    window.location.href = '/document/callback?id=' + pid + '&name=' + name + '&type=' + type + '&typeNo=' + typeNo + '&navName=' + navName;
                }
            })
        })
    }
};

/**
 * 添加文件夹
 * @param modal
 */
function initFileModalEvent(modal) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var value = modal.$body.find('input').val();
        // var parentId = $('[type=checkbox]:checked').parents('tr').data('item');
        var parentId = '';
        // parentId = parentId ? parentId.id : '';
        if (!value) {
            return alert('请输入文件夹名称');
        }
        initDocumentFunc.initFileModal(modal, value, parentId);
    });
}

/**
 * 移动文件绘制数据
 * @param modal
 */
function initMoveModalEventData(modal) {
    var type = $('.document-menus').data('type');
    var typeNo = '';
    if (type === 'admin-company' || type === 'document-admin-company') {
        typeNo = 1;
    } else if (type === 'admin-me' || type === 'document-admin-me') {
        typeNo = 2;
    }
    initDocumentFunc.initFetFileTree({typeNo: typeNo}, modal, null, 0);
}

/**
 * 提交数据
 */
function initMoveFileModalEvent(modal, trs) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var targetId = modal.$body.find('li.active').data('pid');
        var fileMove = [];
        for (var i = 0, length = trs.length; i < length; i++) {
            var item = $(trs[i]).parents('tr').data('item');
            fileMove.push(item.id);
        }
        if (!targetId) {
            return alert('请选择要移动到的文件夹');
        }
        initDocumentFunc.initPutMoveFile({targetId: targetId, ids: fileMove}, modal);
    });
}

/**
 * 初始化查看属性
 * @param parents
 */
exports.initCompanyFileCabinetTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var modal = Modal('查看属性', checkAttributeModal());
        modal.show();
        modal.showClose();
        initDocumentFunc.initFileCabinetAttribute(modal, item.id);
    })
};
exports.initTableTrClickEvent = function (parents, type) {
    parents.find('tr').click(function (e) {
        common.stopPropagation(e);
        var $type = $(this).data('type');
        if ($type === 'document') {
            return;
        }
        var item = $(this).data('item');
        documentApi.getFileCabinet({parentId: item.id, typeNo: item.typeNo}).then(function (res) { // todo
            if (res.code === 2) {
                return alert(res.desc);
            } else {
                if (type === 'document-admin-company') {
                    type = 'admin-company';
                } else if (type === 'document-admin-me') {
                    type = 'admin-me';
                } else if (type === 'document-admin-manager') {
                    type = 'admin-manager';
                }
                var navName = $('.employee-name').text();
                window.location.href = '/document/admin?id=' + item.id + '&name=' + item.cbntName + '&type=' + type + '&navName=' + navName + '&typeNo=' + item.typeNo;
            }
        });
    });
    parents.find('[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (parents.find('[type=checkbox]:checked').length > 0) {
            $('thead [type=checkbox]').prop('checked', true)
        } else {
            $('thead [type=checkbox]').prop('checked', false);
        }
    });
    $('thead [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if ($(this).prop('checked')) {
            parents.find('[type=checkbox]').prop('checked', true);
        } else {
            parents.find('[type=checkbox]').prop('checked', false);
        }
    });
}
/**
 * 初始化 tr⌚事件
 * @param parents
 * @param type
 */
exports.initCompanyFileCabinetTableTREvent = function (parents, type) {
    parents.find('tr').click(function (e) {
        common.stopPropagation(e);
        var $type = $(this).data('type');
        var typeNo = $(this).data('item').typeNo
        if ($type === 'document') {
            return;
        }
        var item = $(this).data('item');
        if (type === 'document-admin-company') {
            type = 'admin-company';
        } else if (type === 'document-admin-me') {
            type = 'admin-me';
        } else if (type === 'document-admin-manager') {
            type = 'admin-manager';
        }
        var navName = $('.employee-name').text();
        window.location.href = '/document/admin?id=' + item.id + '&name=' + item.cbntName + '&type=' + type + '&navName=' + navName + '&typeNo=' + typeNo;
    });
    parents.find('[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (parents.find('[type=checkbox]:checked').length > 0) {
            $('thead [type=checkbox]').prop('checked', true)
        } else {
            $('thead [type=checkbox]').prop('checked', false);
        }
    });
    $('thead [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if ($(this).prop('checked')) {
            parents.find('[type=checkbox]').prop('checked', true);
        } else {
            parents.find('[type=checkbox]').prop('checked', false);
        }
    });
};
exports.initCompanyFileCabinetTableAEvent = function (parents) {
    parents.find('a[data-type=download]').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var downloadModal = Modal('下载记录', downloadBrowerModal());
        downloadModal.showClose();
        downloadModal.show();
        initDownloadEventData(downloadModal, item);
    })
    parents.find('a[data-type=review]').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        if (item.fileType == 'pdf' || item.fileType == 'PDF') {//pdf展示
            window.open(window.API_PATH + '/customer' + item.fileUrl);
        } else {//图片展示
            var urlList = [];
            /*获取当前目录下所有图片*/
            var n = 0;
            $("#administrationManagerTable tr").each(function (index, ele) {
                var _item = $(ele).data('item');
                if (_item.fileType == 'png' || _item.fileType == 'jpeg' || _item.fileType == 'jpg') {
                    $(ele).data('rank', ++n);
                    urlList.push(_item.fileUrl);
                }
            })

            /*展示图片*/
            var imgNum = $(this).parents('tr').data('rank');
            var review = new ReviewImage(urlList, '', imgNum - 1);
            review.show();

        }
    })
};

function initDownloadEventData(modal, item) {
    var parents = modal.$body.find('tbody').html('');
    initDocumentFunc.initGetDownload({fileId: item.id}, parents);
}

/**
 * 初始化文件柜table 事件
 * @param parents
 */
exports.initMyFileCabinetEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var type = $(this).data('type');
        if (type === 'update') {
            var modal = Modal('修改文件柜', fileCabinetModal());
            modal.show();
            modal.showClose();
            initFileCabinetModalEvent(modal);
            modal.$body.find('.fileCabinetType').val(2);
            modal.$body.find('.fileCabinetType').change();
            modal.$body.find('.fileCabinetType').attr('disabled', true);
            modal.$body.find('.fileName').val(item.cbntName);
            initFileCabinetAddAndUpdate(modal, item);
        } else {
            var del = Modal('提示', deleteModal());
            del.show();
            del.showClose();
            var tableType = 1;
            initFileCabinetDeleteModalEvent(del, item, tableType);
        }
    })
};
/**
 * 初始化文件柜管理
 * @param parents
 */
exports.initFileCabinetManagerEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var type = $(this).data('type');
        if (type === 'update') {
            var updateModal = Modal('修改文件柜', fileCabinetModal());
            updateModal.show();
            updateModal.showClose();
            initFileCabinetModalEvent(updateModal);
            initFileCabinetUpdateModalData(updateModal, item);
            initFileCabinetAddAndUpdate(updateModal, item);
        } else if (type === 'delete') {
            var del = Modal('提示', deleteModal());
            del.show();
            del.showClose();
            var tableType = 2;
            initFileCabinetDeleteModalEvent(del, item, tableType);
        } else {
            var modal = Modal('查看属性', checkAttributeModal());
            modal.show();
            modal.showClose();
            initDocumentFunc.initFileCabinetAttribute(modal, item.id);
        }
    })
};

function initFileCabinetDeleteModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    var tableType = arguments[2];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        initDocumentFunc.initFileCabinetDel(modal, {ids: [item.id]}, tableType);
    });
}

function initFileCabinetUpdateModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.fileCabinetType').val(item.typeNo);
    modal.$body.find('.fileCabinetType').attr('disabled', true);
    modal.$body.find('.fileCabinetType').change();
    modal.$body.find('.fileName').val(item.cbntName);
    if (item.typeNo == 1) {
        initDocumentFunc.initGetFileCabintPermission({cbntId: item.id}, modal);
    }
}

exports.renderMoveFileTableEvent = function (parents) {
    parents.find('.icon-document-arrow').off('click').on('click', function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('open') || $(this).hasClass('disabled')) {
            return false;
        }
        var $parents = $(this).parent().parent('li');
        var type = $parents.data('type');
        var ulParents = $(this).parents('ul');
        ulParents.find('[data-type=' + type + ']').find('>>.icon-document-arrow').removeClass('open');
        ulParents.find('[data-type=' + type + ']').find('>ul').remove();
        $(this).addClass('open');
        var pid = $parents.data('pid');
        initDocumentFunc.initFetFileTree(parents.data('data'), null, $parents, pid, $('<ul style="margin-left: 10px"></ul>'));
    });
    parents.find('li').off('click').on('click', function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).find('a').css('color', '#333');
        } else {
            $(this).parents('ul').find('li').removeClass('active');
            $(this).parents('ul').find('li').find('a').css('color', '#333');
            $(this).addClass('active');
            $(this).find('>a').css('color', '#2db54a');
        }
    });
};