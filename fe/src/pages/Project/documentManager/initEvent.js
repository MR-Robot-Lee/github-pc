var common = require('../../Common');
var addType = require('./modal/addType.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var moveMaterialModal = require('./modal/moveMaterialModal.ejs');
var moveTableModal = require('./modal/moveTableModal.ejs');
var dowoloadModal = require('./modal/downloadModal.ejs');
var projectInitEvent = require('../initEvent');


var Model = require('../../../components/Model');
var ReviewImage = require('../../../components/ReviewImage');
var documentManagerFunc = require('./documentManagerFunc');
exports.documentManagerEvent = function () {
    var enterpriseCategory = $('#enterpriseCategory');
    if (enterpriseCategory.length > 0 && !enterpriseCategory.data('flag')) {
        enterpriseCategory.click(function (e) {
            common.stopPropagation(e);
            var addModal = Model('添加文档类型', addType());
            addModal.showClose();
            addModal.show();
            initAddModalEvent(addModal);
        });
        $('#upload').change(function (e) {
            common.stopPropagation(e);
            var files = this.files;
            if($('#childNav >li.active >ul >li.active').length !== 1){
                return alert('请创建文档二级分类');
            }
            var pid = $('#childNav >li.active').data('item').id;
            var cid = $('#childNav >li.active >ul >li.active').data('item').id;
            if (!pid) {
                return alert('请创建文档类型');
            }
            var size = files[0].size / 1024 / 1024;
            if (size > 50) {
                return alert('上传文件不能大于50MB');
            }
            var table = $('#documentManagerTable');
            var trs = table.find('tr');
            for (var i = 0; i < trs.length; i++) {
                if (files[0].name == $(trs[i]).find('td').eq(1).text()) {
                    return alert('该文件已上传');
                }
            }
            var typeArr = files[0].name.split('.');
            var type = typeArr[typeArr.length - 1];
            var fileLoading = $('<tr class="file-loading">' +
                '<td></td>' +
                '<td>' +
                '<span class="icon-file ' + type + '"></span>' + files[0].name +
                '<span style="display: inline-block;margin-top: 2px;margin-left: 10px;" class="progress-outer">' +
                '<span style="display: inline-block;" class="progress-inner"></span>' +
                '</span>' +
                '<span style="">正在上传</span>' +
                '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '</tr>');
            table.append(fileLoading);
            $("#noInfoDocumentManagerTable_main").show();
            $("#noInfoDocumentManagerTable").hide();
            documentManagerFunc.initUploadFile(files[0], pid, cid);
            this.value = '';
        });
        $('#enterpriseMaterial').click(function (e) {
            common.stopPropagation(e);
            var moveModal = Model('移动类型', moveMaterialModal());
            moveModal.showClose();
            moveModal.show();
            initMoveModalEvent(moveModal);
            initMoveModalData()
        });
        $('#moveFile').click(function (e) {
            common.stopPropagation(e);
            var moveData = $('#documentManagerTable').find('[type=checkbox]:checked');
            if (moveData.length === 0) {
                return alert('请选择要移动的文档');
            }
            var moveTable = Model('移动列表', moveTableModal());
            moveTable.showClose();
            moveTable.show();
            documentManagerFunc.getCategoryTreeTableFunc();
            initMoveTableModalEvent(moveTable);
        });
        $('#delete').click(function (e) {
            common.stopPropagation(e);
            var moveData = $('#documentManagerTable').find('[type=checkbox]:checked');
            if (moveData.length === 0) {
                return alert('请选择要删除的文档');
            }
            if (moveData.length > 1) {
                return alert('删除只能一条一条删除')
            }
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDelTableModalEvent(delModal, moveData);
        });
        $('body').click(function (e) {
            common.stopPropagation(e);
            $('#documentManagerTable').find('.modal-arrow-left').remove();
        });
        $('#download').click(function (e) {
            common.stopPropagation(e);
            var moveData = $('#documentManagerTable').find('[type=checkbox]:checked');
            if (moveData.length === 0) {
                return alert('请选择要下载的文档');
            }
            if (moveData.length > 1) {
                return alert('下载只能一条一条删除')
            }
            var item = $(moveData).parents('tr').data('item');
            documentManagerFunc.downloadFunc({filePath: item.fileUrl})
        })
    }
};

function initMoveModalData() {
    documentManagerFunc.getCategoryTypeFunc();
    documentManagerFunc.getCategoryTreeFunc();
}

/**
 * 删除table 数据
 */
function initDelTableModalEvent() {
    var modal = arguments[0];
    var inputs = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        for (var i = 0, length = inputs.length; i < length; i++) {
            var item = $(inputs[i]).parents('tr').data('item');
            documentManagerFunc.delBaseFunc(item.id, modal);
        }
    })
}

function initAddModalEvent() {
    var modal = arguments[0];
    modal.$body.find('#confirm').click(function (e) {
        common.stopPropagation(e);
        var type = modal.$body.find('#type').val();
        if (!type) {
            return alert('请输入内容');
        }
        documentManagerFunc.postCategoryTypeFunc({fileCategoryName: type}, modal);
    });
}

function initMoveModalEvent() {
    var modal = arguments[0];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var oldCategoryId = $('#materialParent').val();
        var typeId = $('#materialChild').val();
        var newCategoryId = $('#newMaterial').val();
        if (oldCategoryId === 'a' || !oldCategoryId) {
            return alert('请选择移出一级数据');
        }
        if (typeId === 'a' || !typeId) {
            return alert('请选择移出二级数据');
        }
        if (newCategoryId === 'a' || !newCategoryId) {
            return alert('请选择移入数据');
        }
        documentManagerFunc.putMoveFileFunc({
            oldCategoryId: oldCategoryId,
            typeId: typeId,
            newCategoryId: newCategoryId
        }, modal);
    })
}


exports.initDocumentManagerNavEvent = function (parents, pid, cid, $type) {
    parents.find('li').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).data('item');
        $('.documentTitle').text(item.name);
        if (type === 'parent') {
            parentEvent(parents, this, $type);
        } else {
            childEvent(this, item);
        }
    });
    if ($type === 'pdl') {
        parents.find('>li:first').click();
        parents.find('>li:first>ul>li:first').click();
    } else if ($type === 'ppt') {
        parents.find('>li:last').click();
    } else if ($type === 'cdl') {
        parents.find('#pid-' + pid).click();
        parents.find('#pid-' + pid).find('>ul>li:first').click();
    } else if ($type === 'cpt') {
        parents.find('#pid-' + pid).click();
        parents.find('#pid-' + pid).find('>ul>li:last').click();
    } else {
        parents.find('>li:first').click();
    }
    parents.find('.event').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('.item').data('item');
        var parentType = $(this).parents('.item').data('type');
        if (parentType === 'child') {
            if (type === 'delete') {
                var delChildModal = Model('提示', deleteModal());
                delChildModal.showClose();
                delChildModal.show();
                initDelChildModalEvent(delChildModal, item);
            } else {
                var editChildModal = Model('编辑类型', addType());
                editChildModal.showClose();
                editChildModal.show();
                initEditChildModalEvent(editChildModal, item);
            }
        } else {
            if (type === 'delete') {
                var delModal = Model('提示', deleteModal());
                delModal.showClose();
                delModal.show();
                initDelModalEvent(delModal, item);
            } else if (type === 'edit') {
                var editModal = Model('编辑类型', addType());
                editModal.showClose();
                editModal.show();
                initEditModalEvent(editModal, item);
            } else {
                var addModal = Model('添加类型', addType());
                addModal.showClose();
                addModal.show();
                initaddChildModalEvent(addModal, item);
            }
        }
    })
};

function parentEvent(parents, owndom, type) {
    if ($(owndom).hasClass('active')) {
        parents.find('>li').removeClass('active');
        parents.find('>li>ul').slideUp(300);
        parents.find('>li .arrow').removeClass('active');
    } else {
        parents.find('>li').removeClass('active');
        parents.find('>li>ul').slideUp(300);
        parents.find('>li .arrow').removeClass('active');
        $(owndom).addClass('active');
        $(owndom).find('.arrow').addClass('active');
        $(owndom).find('>ul').slideDown(300);
        $(owndom).find('>ul>li:first').click();
    }

    // if (!type) {
    //   $(owndom).find('>ul>li:first').click();
    // }
    $("#noInfoDocumentManagerTable_main").hide();
    $("#noInfoDocumentManagerTable").show();
    $("#noInfoDocumentManagerTable_desc").html('请在该分类下创建二级分类!');
}

function childEvent(owndom, item) {
    $(owndom).parent('ul').find('>li').removeClass('active');
    $(owndom).addClass('active');
    documentManagerFunc.getBaseListFunc({fileType: item.id, fileCategory: item.pid});
    $("#noInfoDocumentManagerTable_desc").html('点击上方的"上传"按钮上传文件吧!');
}

/**
 * 通过id删除子类型
 */
function initDelChildModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        documentManagerFunc.delFileTypeFunc({id: item.id, fileCategory: item.pid}, modal);
    });
}

function initaddChildModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('#confirm').click(function (e) {
        common.stopPropagation(e);
        var type = modal.$body.find('#type').val();
        if (!type) {
            return alert('请输入类型');
        }
        documentManagerFunc.postFileTypeFunc({fileCategory: item.id, fileTypeName: type}, modal);
    })
}

/**
 * 修改一级类型
 */
function initEditModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('#type').val(item.name);
    modal.$body.find('#confirm').click(function (e) {
        common.stopPropagation(e);
        var type = modal.$body.find('#type').val();
        if (!type) {
            return alert('请输入类型');
        }
        documentManagerFunc.putCategoryTypeFunc({id: item.id, fileCategoryName: type}, modal);
    });
}

/**
 * 通过id删除一级类型
 */
function initDelModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        documentManagerFunc.delCategoryTypeFunc(item.id, modal);
    })
}

/**
 * 修改二级类型
 */
function initEditChildModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('#type').val(item.name);
    modal.$body.find('#confirm').click(function (e) {
        common.stopPropagation(e);
        var type = modal.$body.find('#type').val();
        if (!type) {
            return alert('请输入类型');
        }
        documentManagerFunc.putFileTypeFunc({id: item.id, fileTypeName: type, fileCategory: item.pid}, modal);
    });
}

exports.initMoveSelectEvent = function (parents, childParent) {
    var $parents = childParent || $('#materialChild');
    $('<option value="a">请选择</option>').appendTo($parents);
    parents.change(function (e) {
        common.stopPropagation(e);
        $parents.html('');
        $('<option value="a">请选择</option>').appendTo($parents);
        var item = $(this).find('option:selected').data('item');
        item = item || [];
        for (var i = 0, length = item.length; i < length; i++) {
            var $item = item[i];
            var dom = $('<option></option>');
            dom.text($item.fileTypeName);
            dom.val($item.id);
            dom.appendTo($parents);
        }
    });
};


function initMoveTableModalEvent() {
    var modal = arguments[0];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var oldCategoryId = $('#materialParent').val();
        var oldTypeId = $('#materialChild').val();
        var newCategoryId = $('#newParent').val();
        var newTypeId = $('#newChild').val();
        if (oldCategoryId === 'a' || !oldCategoryId) {
            return alert('请选择移出数据一级');
        }
        if (oldTypeId === 'a' || !oldTypeId) {
            return alert('请选择移出数据二级');
        }
        if (newCategoryId === 'a' || !newCategoryId) {
            return alert('请选择移入数据一级');
        }
        if (newTypeId === 'a' || !newTypeId) {
            return alert('请选择移入数据二级');
        }
        var inputs = $('#documentManagerTable').find('[type=checkbox]:checked');
        var list = [];
        for (var i = 0, length = inputs.length; i < length; i++) {
            var item = $(inputs[i]).parents('tr').data('item');
            list.push(item.id);
        }
        documentManagerFunc.putMoveFileTableFunc({
            oldCategoryId: oldCategoryId,
            oldTypeId: oldTypeId,
            newCategoryId: newCategoryId,
            newTypeId: newTypeId,
            projFileIds: list.join(',')
        }, modal);
    });
}

exports.initDocumentManagerTableEvent = function (parents) {
    parents.find('[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (parents.find('input:checked').length === 0) {
            $('.table-content').find('thead [type=checkbox]').prop('checked', false);
        } else {
            $('.table-content').find('thead [type=checkbox]').prop('checked', true);
        }
    });
    $('.table-content').find('thead [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if ($(this).prop('checked')) {
            parents.find('input[type=checkbox]').prop('checked', true);
        } else {
            parents.find('input[type=checkbox]').prop('checked', false);
        }
    });
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var td = $(this).parent('td');
        var item = $(this).parents('tr').data('item');
        if (type === 'download') {
            parents.find('.modal-arrow-left').remove();
            var dom = $(dowoloadModal());
            dom.appendTo(td);
            initDownloadModalEvent(dom, parents);
            documentManagerFunc.getHistoryDownloadListFunc({fileId: item.id});
        } else {
            if (item.fileSuffix == 'pdf' || item.fileSuffix == 'PDF') {//pdf展示
                window.open(window.API_PATH + '/customer' + item.fileUrl);
            } else {
                var urlList = [];
                /*获取当前目录下所有图片*/
                var n = 0;
                $("#documentManagerTable tr").each(function (index, ele) {
                    var _item = $(ele).data('item');
                    if (_item.fileSuffix == 'png' || _item.fileSuffix == 'jpeg' || _item.fileSuffix == 'jpg') {
                        $(ele).data('rank', ++n);
                        urlList.push(_item.fileUrl);
                    }
                });
                /*展示图片*/
                var imgNum = $(this).parents('tr').data('rank');
                var review = new ReviewImage(urlList, '', imgNum - 1);
                review.show();
            }
        }
    })
};

function initDownloadModalEvent(dom, parents) {
    dom.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        parents.find('.modal-arrow-left').remove();
    })
}