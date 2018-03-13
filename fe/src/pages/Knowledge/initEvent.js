var Modal = require('../../components/Model');
var deleteModal = require('./modal/deleteModal.ejs');
var addType = require('./modal/addType.ejs');
var checkBrower = require('./modal/checkBrowerModal.ejs');
var reviewKnowledge = require('./modal/reviewKnowledgeModal.ejs');
var UploadAttach = require('../../components/UploadAttach');
var common = require('../Common');
var knowledgeApi = require('./knowledgeApi');
var initKnowledgeFunc = require('./initKnowledgeFunc');
var renderKnowledgeTable = require('./renderKnowledgeTable');

exports.initKnowledgeTypeEvent = function () {
    var knowledgeType = $('#knowledgeType');
    if (!knowledgeType.data('flag')) {
        knowledgeType.data('flag', true);
        knowledgeType.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('添加类型', addType());
            modal.showClose();
            modal.show();
            initTypeModalEvent(modal);
        });
    }
};
exports.initTableTypeEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'update') {
            var modal = Modal('修改类型', addType());
            modal.showClose();
            modal.show();
            initModalDomData(modal, item);
            initTypeModalEvent(modal, item);
        } else {
            var delModal = Modal('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initTypeDelModalEvent(delModal, item);
        }
    })
};

function initTypeDelModalEvent(modal, item) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        knowledgeApi.delKnowledgeType(item.id).then(function (res) {
            if (res.code === 1) {
                modal.hide();
                initKnowledgeFunc.initKnowledgeType()
            }
        })
    })
}

function initModalDomData(modal, item) {
    modal.$body.find('.typeName').val(item.typeName);
    modal.$body.find('.typeDesc').val(item.describe);
}

function initTypeModalEvent(modal, item) {
    modal.$body.find('.type-save').click(function (e) {
        common.stopPropagation(e);
        var typeName = modal.$body.find('.typeName').val();
        var typeDesc = modal.$body.find('.typeDesc').val();
        if (!typeName) {
            return alert('请输入栏目名称');
        }
        if (!typeDesc) {
            return alert('请输入描述');
        }
        if (item) {
            knowledgeApi.putKnowledgeType({id: item.id, describe: typeDesc, typeName: typeName}).then(function (res) {
                if (res.code === 1) {
                    modal.hide();
                    initKnowledgeFunc.initKnowledgeType()
                }
            })
        } else {
            knowledgeApi.postKnowledgeType({describe: typeDesc, typeName: typeName}).then(function (res) {
                if (res.code === 1) {
                    modal.hide();
                    initKnowledgeFunc.initKnowledgeType()
                }
            })
        }
    })
}

exports.addKnowledge = function addKnowledge(attach) {
    $('.promulgate').click(function (e) {
        common.stopPropagation(e);
        var data = attach.getAttaches();
        var title = $('[name=title]').val();
        var typeId = $('#knowledgeType').val();
        var summary = $('[name=summary]').val();
        var source = $('[name=source]').val();
        var author = $('[name=author]').val();
        var linkAddress = $('[name=linkAddress]').val();
        var content = $('[name=content]').val();
        var id = $('#addKnowledge').data('id');
        if (!title) {
            return alert('请输入标题');
        }
        if (!typeId || typeId === 'a') {
            return alert('请选择类型');
        }
        if (!summary) {
            return alert('请填写寄语/摘要');
        }
        if (!content) {
            return alert('请输入知识正文');
        }
        if (id) {
            knowledgeApi.putKnowledge({
                id: id,
                author: author,
                content: content,
                linkAddress: linkAddress,
                source: source,
                summary: summary,
                title: title,
                typeId: typeId,
                attaches: data,
                attachCount: data.length || 0
            }).then(function (res) {
                if (res.code === 1) {
                    window.location.href = '/knowledge';
                }
            })
        } else {
            knowledgeApi.postKnowledge({
                author: author,
                content: content,
                linkAddress: linkAddress,
                source: source,
                summary: summary,
                title: title,
                typeId: typeId,
                attaches: data,
                attachCount: data.length || 0
            }).then(function (res) {
                if (res.code === 1) {
                    window.location.href = '/knowledge';
                }
            });
        }
    });
    $('.review').click(function (e) {
        common.stopPropagation(e);
        var modal = Modal('知识预览', reviewKnowledge());
        modal.show();
        modal.showClose();
        modal.$body.find('.modal-knowledge-title').text($('[name=title]').val());
        modal.$body.find('[name=typeId]').text($('#knowledgeType option:selected').text());
        modal.$body.find('[name=sourceModal]').text($('[name=source]').val());
        modal.$body.find('[name=authorModal]').text($('[name=author]').val());
        modal.$body.find('[name=linkAddressModal]').text($('[name=linkAddress]').val());
        modal.$body.find('[name=time]').text(moment().format('YYYY/MM/DD HH:mm:ss'));
        modal.$body.find('[name=summaryModal]').text($('[name=summary]').val());
        modal.$body.find('.knowledge-modal-content').text($('[name=content]').val());
        var $attach = attach.getAttaches() || [];
        var previewAttach = modal.$body.find(".contract-attach-list").html("");
        for (var j = 0; j < $attach.length; j++) {
            var dom = renderKnowledgeTable.renderAttachDom($attach[j]);
            dom.appendTo(previewAttach);
        }
        previewAttach.find('.knowledgeDelete').click(function (e) {
            common.stopPropagation(e);
            $(this).parents('.attach-item').remove();
            var type = $(this).data('type');
            attach.delAttaches(type);
        });
        var user = localStorage.getItem('user');
        user = user ? JSON.parse(user).employee : {};
        modal.$body.find('[name=userName]').text(user.userName);
        modal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            modal.hide();
            $('.promulgate').click();
        })
    })
};

exports.initAllKnowledgeTableDetail = function initAllKnowledgeTableDetail(parents) {
    parents.find('.knowledge-item').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        parents.find('.knowledge-item').removeClass('active');
        $(this).addClass('active');
        knowledgeApi.postBorwserRecord({pId: item.id}).then(function (res) {
            if (res.code === 1) {
                renderKnowledgeTable.initDetailKnowledge(item);
                $('.knowledge-detail').addClass('active');
                var autoWidth = $(window).width() - 1000;
                autoWidth = autoWidth < 500 ? 500 : autoWidth;
                $('#allKnowledgeList').css('width', autoWidth);
                $('#page').css('width', autoWidth);
            }
        });
    });
};

exports.initAllKnowledgeClick = function () {
    var callbackKnowledge = $('#callbackKnowledge');
    if (callbackKnowledge.length > 0 && !callbackKnowledge.data('flag')) {
        callbackKnowledge.data('flag', true);
        $('#delKnowledge').click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('提示', deleteModal());
            modal.show();
            modal.showClose();
            modal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var item = $('.knowledge-item.active').data('item');
                knowledgeApi.delKnowledge(item.id).then(function (res) {
                    if (res.code === 1) {
                        modal.hide();
                        $('.knowledge-detail').removeClass('active');
                        initKnowledgeFunc.initAllKnowledgeFunc();
                    }
                })
            });
        });
        callbackKnowledge.click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
            $('.knowledge-item').removeClass('active');
            $('#allKnowledgeList').css('width', 'auto');
            $('#page').css('width', 'auto');
        });
        $('.knowledge-detail .icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
            $('.knowledge-item').removeClass('active');
            $('#allKnowledgeList').css('width', 'auto');
            $('#page').css('width', 'auto');
        });
        $('#checkBrower').click(function (e) {
            common.stopPropagation(e);
            var item = $('.knowledge-item.active').data('item');
            initCheckBrowerEvent(item);
        });
        $('#editKnowledge').click(function (e) {
            common.stopPropagation(e);
            var item = $('.knowledge-item.active').data('item');
            window.location.href = '/knowledge/add?id=' + item.id;
        })
    }
};

function initCheckBrowerEvent(item) {
    var modal = Modal('查看浏览记录', checkBrower());
    modal.show();
    modal.showClose();
    knowledgeApi.getBrowerRecordList({knowsId: item.id}).then(function (res) {
        if (res.code === 1) {
            initCheckBrower(modal, res.data);
        }
    })
}

function initCheckBrower(modal, list) {
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<tr class="small active">\
                   <td style="padding-left: 50px;width: 150px;">' + item.deptName + '</td>\
                   <td style="width: 250px;padding-left: 30px">' + item.userName + '</td>\
                   <td>' + moment(item.browseTime).format('YYYY/MM/DD') + '</td>\
                  </tr>');
        dom.appendTo(parents);
    }
}


exports.initTypeIdFindByKnowledge = function (parents) {
    parents.find('>li').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).data('item');
        if (type === 'jump') {
            window.location.href = '/knowledge/all?id=' + item.id;
        } else {
            parents.find('li').removeClass('active');
            $(this).addClass('active');
            $('.employee-name').text(item.typeName);
            initKnowledgeFunc.initAllKnowledgeFunc({typeId: item.id});
        }
    })
};

exports.initKnowledgeEvent = function (item) {
    var checkBrower = $('#checkBrower');
    if (checkBrower.length > 0 && !checkBrower.data('flag')) {
        checkBrower.data('flag', true);
        checkBrower.click(function (e) {
            common.stopPropagation(e);
            initCheckBrowerEvent(item)
        });
    }
};


