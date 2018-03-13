var common = require('../Common');
var Modal = require('../../components/Model');
var addType = require('./modal/addType.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var initCommuniqueFunc = require('./initCommuniqueFunc');
var reviewKnowledgeModal = require('./modal/reviewKnowledgeModal.ejs');
var deleModal = require('./modal/deleteModal.ejs');
var checkBrowerModal = require('./modal/checkBrowerModal.ejs');
var communiqueApi = require('./communiqueApi');
var renderCommuniqueTable = require('./renderCommuniqueTable');
var communiqueUpdate = require('./modal/CommuniqueUpdate.ejs');
var initEvent = require('./initEvent');
var UploadAttach = require('../../components/UploadAttach');


exports.initCommuniqueTypeEvent = function () {
    var knowledgeType = $('#knowledgeType');
    if (knowledgeType.length > 0 && !knowledgeType.data('flag')) {
        knowledgeType.data('flag', true);
        knowledgeType.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('添加栏目目录', addType());
            modal.show();
            modal.showClose();
            initCommuniqueTypeModalEvent(modal);
        });
        $('#refreshData').click(function (e) {
            common.stopPropagation(e);
            initCommuniqueFunc.communiqueType();
        })
    }
};

/**
 * 修改公告类型
 * @param modal
 * @param item
 */
function initCommuniqueTypeModalEvent(modal, item) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var title = modal.$body.find('.typeName').val();
        var discussion = modal.$body.find('.typeDesc').val();
        if (!title || title.trim() === '') {
            return alert('请输入标题');
        }
        if (!discussion || discussion.trim() === '') {
            return alert('请输入描述');
        }
        if (item) {
            communiqueApi.putCommuniqueType({id: item.id, title: title, discussion: discussion}).then(function (res) {
                if (res.code === 1) {
                    modal.hide();
                    initCommuniqueFunc.communiqueType();
                }
            })
        } else {
            communiqueApi.postCommuniqueType({title: title, discussion: discussion}).then(function (res) {
                if (res.code === 1) {
                    modal.hide();
                    initCommuniqueFunc.communiqueType();
                }
            });
        }
    })
}

exports.initCommuniqueTypeTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'update') {
            initCommuniqueUpdateModal(item);
        } else {
            initCommuniqueDeleteModal(item);
        }
    })
};

function initCommuniqueDeleteModal(item) {
    var modal = Modal('提示', deleteModal());
    modal.showClose();
    modal.show();
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        communiqueApi.delCommuniqueType(item.id).then(function (res) {
            if (res.code === 1) {
                modal.hide();
                initCommuniqueFunc.communiqueType();
            }
        })
    })
}

function initCommuniqueUpdateModal(item) {
    var modal = Modal('修改栏目目录', addType());
    modal.showClose();
    modal.show();
    modal.$body.find('.typeName').val(item.title);
    modal.$body.find('.typeDesc').val(item.discussion);
    initCommuniqueTypeModalEvent(modal, item);
}

exports.addCommuniqueEvent = function (attach) {
    var fbCommunique = $('#fbCommunique');
    if (!fbCommunique.data('flag')) {
        fbCommunique.data('flag', true);
        fbCommunique.click(function (e) {
            common.stopPropagation(e);
            var communiqueType = $('#communiqueType').val();
            var title = $('[name=title]').val();
            var content = $('[name=content]').val();
            var attachs = attach.getAttaches();
            var id = $('#addCommunique').data('id');
            if (!communiqueType || communiqueType === 'a') {
                return alert('请选择栏目')
            }
            if (!title) {
                return alert('请输入标题')
            }
            if (!content) {
                return alert('请输入公告内容');
            }
            if (id) {
                communiqueApi.putCommunique({
                    id: id,
                    annTypeId: communiqueType,
                    title: title,
                    content: content,
                    attachCount: attachs.length || 0,
                    attaches: attachs
                }).then(function (res) {
                    if (res.code === 1) {
                        window.location.href = '/communique';
                    }
                })
            } else {
                communiqueApi.postCommunique({
                    annTypeId: communiqueType,
                    title: title,
                    content: content,
                    attachCount: attachs.length || 0,
                    attaches: attachs
                }).then(function (res) {
                    if (res.code === 1) {
                        window.location.href = '/communique';
                    }
                })
            }
        });
        $('#reviewCommunique').click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('公告预览', reviewKnowledgeModal());
            modal.show();
            modal.showClose();
            modal.$body.find('.modal-knowledge-title').text($('[name=title]').val());
            modal.$body.find('.communique').text($('#communiqueType option:selected').text());
            modal.$body.find('.time').text(moment().format('YYYY-MM-DD'));
            var user = localStorage.getItem('user');
            if (!user) {
                window.location.href = '/login';
            }
            var userName = JSON.parse(user).employee.userName;
            modal.$body.find('.fbPeople').text(userName);
            modal.$body.find('.knowledge-modal-content').text($('[name=content]').val());
            var attachs = attach.getAttaches();
            initAttaches(modal, attachs);
            modal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                fbCommunique.click();
                modal.hide();
            })
        })
    }

    function initAttaches(modal, list) {
        list = list || [];
        var parents = modal.$body.find('.attach-list').html('');
        for (var i = 0, length = list.length; i < length; i++) {
            var item = list[i];
            var type = item.attachType === "pdf" || item.attachType === "PDF"
            || item.attachType === 'xls' || item.attachType === 'XLS'
            || item.attachType === 'gbq' || item.attachType === 'GBQ'
            || item.attachType === 'gbq5' || item.attachType === 'GBQ5'
            || item.attachType === 'gtb4' || item.attachType === 'GTB4'
            || item.attachType === 'ppt' || item.attachType === 'PPT'
            || item.attachType === 'pptx' || item.attachType === 'PPTX'
            || item.attachType === 'xlsx' || item.attachType === 'XLS'
            || item.attachType === 'png' || item.attachType === 'PNG'
            || item.attachType === 'zip' || item.attachType === 'ZIP'
            || item.attachType === 'rar' || item.attachType === 'RAR'
            || item.attachType === 'cad' || item.attachType === 'CAD'
            || item.attachType === 'dwg' || item.attachType === 'DWG'
            || item.attachType === 'txt' || item.attachType === 'TXT'
            || item.attachType === 'video' || item.attachType === 'VIDEO'
            || item.attachType === 'jpeg' || item.attachType === 'JPEG'
            || item.attachType === 'jpg' || item.attachType === 'JPG'
            || item.attachType === 'docx' || item.attachType === 'DOCX'
            || item.attachType === 'doc' || item.attachType === 'DOC'
                ? item.attachType : 'none';
            var dom = $("<div class='attach-item'>\
                    <div class='icon-file " + type + "'></div>\
                    <div class='detail'>\
                     <div class='filename'>" + item.attachName + "</div>\
                     <div class='remove'>\
                       <a class='knowledgeDelete' data-type=" + item.attachUrl + ">删除</a>\
                     </div>\
                    </div>\
                   </div>");
            dom.appendTo(parents);
        }
        parents.find('.knowledgeDelete').click(function (e) {
            common.stopPropagation(e);
            $(this).parents('.attach-item').remove();
            var type = $(this).data('type');
            attach.delAttaches(type);
        })
    }
};

exports.initAllCommuniqueTableEvent = function (parents) {
    parents.find('.knowledge-item').click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data('id');
        parents.find('.knowledge-item').removeClass('active');
        $(this).addClass('active');
        var knowLedgeList = $('.container-list-warp').width();
        $('.knowledge-detail').addClass('active');
        $('.knowledge-detail').css('width', Math.ceil(knowLedgeList / 2));
        $('#page').css('width', Math.ceil(knowLedgeList / 2));
        parents.css('width', Math.ceil(knowLedgeList / 2));
        communiqueApi.getCommuniqueById(id).then(function (res) {
            renderCommuniqueTable.renderCommuniqueDetail(res.data);
        });
        initCommuniqueFunc.initCommentList(id);
    });
    var callbackKnowledge = $('#callbackKnowledge');
    if (!callbackKnowledge.data('flag')) {
        callbackKnowledge.data('flag', true);
        callbackKnowledge.click(function (e) {
            common.stopPropagation(e);
            parents.find('.knowledge-item').removeClass('active');
            $('.knowledge-detail').removeClass('active');
            $('#allKnowledgeList').css('width', '100%');
            $('#page').css('width', '100%');
        });

        /*修改公告*/
        $('#updateKnowledge').click(function (e) {
            common.stopPropagation(e);
            /*当前公告数据与附件*/
            var item = parents.find('.knowledge-item.active').data('item');
            var attaches = $('.attach-list').data('attaches');
            /*清空展示内容  修改标题*/
            $('.container-list-warp').hide();
            $('.container-list-update').html(communiqueUpdate);
            $('.employee-name').html('修改公告');
            /*请求全部目类型*/
            communiqueApi.getCommuniqueType().then(function (res) {
                var list = res.data ? res.data.data : [];
                /*填入栏目选项*/
                var parents = $('#communiqueType').html('');
                $('<option value="a">请选择</option>').appendTo(parents);
                for (var i = 0, length = list.length; i < length; i++) {
                    var dom = $('<option></option>');
                    dom.text(list[i].title);
                    dom.val(list[i].id);
                    dom.appendTo(parents);
                    if (item.annTypeName == list[i].title) {
                        $('#communiqueType').val(list[i].id);
                    }
                }
                $('[name=title]').val(item.title);//标题
                $('[name=content]').html(item.content);//公告内容

                /*回填附件信息*/
                var attach = new UploadAttach($('#communiqueFile'));
                for (var i = 0, length = attaches.length; i < length; i++) {
                    attach.TempAttach(attaches[i], 'appendAttach');
                }

                /*初始化发布按钮*/
                $('#updateCommunique').click(function () {

                    var communiqueType = $('#communiqueType').val();
                    var title = $('[name=title]').val();
                    var content = $('[name=content]').val();
                    var attachs = attach.getAttaches();
                    var id = item.id;
                    if (!communiqueType || communiqueType === 'a') {
                        return alert('请选择栏目')
                    }
                    if (!title) {
                        return alert('请输入标题')
                    }
                    if (!content) {
                        return alert('请输入公告内容');
                    }

                    communiqueApi.putCommunique({
                        id: id,
                        annTypeId: communiqueType / 1,
                        title: title,
                        content: content,
                        attachCount: attachs.length || 0,
                        attaches: attachs
                    }).then(function (res) {
                        if (res.code === 1) {
                            window.location.href = '/communique';
                        }
                    })

                })
                /*初始化取消按钮*/
                $('#backCommunique').click(function () {
                    $('.container-list-warp').show();
                    $('.container-list-update').html('');
                })
                /*初始化预览按钮*/
                $('#reviewCommuniqueUpdate').click(function (e) {
                    common.stopPropagation(e);
                    var modal = Modal('公告预览', reviewKnowledgeModal());
                    modal.show();
                    modal.showClose();
                    modal.$body.find('.modal-knowledge-title').text($('[name=title]').val());
                    modal.$body.find('.communique').text($('#communiqueType option:selected').text());
                    modal.$body.find('.time').text(moment().format('YYYY-MM-DD'));
                    var user = localStorage.getItem('user');
                    if (!user) {
                        window.location.href = '/login';
                    }
                    var userName = JSON.parse(user).employee.userName;
                    modal.$body.find('.fbPeople').text(userName);
                    modal.$body.find('.knowledge-modal-content').text($('[name=content]').val());
                    var attachs = attach.getAttaches();
                    initAttaches(modal, attachs);
                    modal.$body.find('.confirm').click(function (e) {
                        common.stopPropagation(e);
                        fbCommunique.click();
                        modal.hide();
                    })
                })
                /*初始化删除按钮*/
                $('.UploadAttach__item').find('.remove').click(function () {
                    $(this).parents('.UploadAttach__item').remove();
                });
            });
        });


        $('#delKnowledge').click(function (e) {
            common.stopPropagation(e);
            var id = parents.find('.knowledge-item.active').data('id');
            var modal = Modal('提示', deleModal());
            modal.show();
            modal.showClose();
            modal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                communiqueApi.delCommunique(id).then(function (res) {
                    if (res.code === 1) {
                        $('.knowledge-detail').removeClass('active');
                        modal.hide();
                        initCommuniqueFunc.initAllCommunique();
                    }
                })
            })
        });
        $('#modalComment').click(function (e) {
            common.stopPropagation(e);
            var id = parents.find('.knowledge-item.active').data('id');
            var content = $('.modalCommentModal').val();
            if (!content) {
                return alert('请输入评价内容');
            }
            communiqueApi.postComment({commentContent: content, moduleId: '7', pId: id}).then(function (res) {
                if (res.code === 1) {
                    $('.modalCommentModal').val("");
                    initCommuniqueFunc.initCommentList(id);
                }
            })
        });
        $('#checkBrower').click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('查看浏览记录', checkBrowerModal());
            modal.show();
            modal.showClose();
            initBrowerModalEvent(modal, parents);
        });
        $('.icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
            $('.knowledge-item').removeClass('active');
            $('#allKnowledgeList').css('width', '100%');
            $('#page').css('width', '100%');
        })
    }
};

function initBrowerModalEvent(modal, parents) {
    modal.$body.find('.budget-menus a').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('active')) {
            return;
        }
        modal.$body.find('.budget-menus a').removeClass('active');
        $(this).addClass('active');
        var id = parents.find('.knowledge-item.active').data('id');
        if(!id){
            id = $('#communiqueDetail').data('id');
        }
        var type = $(this).data('type');
        var $parents = modal.$body.find('tbody').html('');
        if (type === 'brower') {
            communiqueApi.getBrowRecord({moduleId: '7', pId: id}).then(function (res) {
                var list = res.data ? res.data.data : [];
                renderCommuniqueTable.renderBrowerModal(list, $parents);
            })
        } else {
            communiqueApi.getUnBrowRecord({moduleId: '7', pId: id}).then(function (res) {
                var list = res.data ? res.data.data : [];
                renderCommuniqueTable.renderUnbrowerModal(list, $parents);
            })
        }
    });
    modal.$body.find('.budget-menus a:first-child').click();
}


exports.initTypeIdFindByCommunique = function (parents) {
    parents.find('>li').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        var type = $(this).data('type');
        if (type === 'jump') {
            window.location.href = '/communique?id=' + item.id;
        } else {
            $('.container-list-warp').show();
            $('.container-list-update').html('');
            parents.find('li').removeClass('active');
            $(this).addClass('active');
            $('.employee-name').text(item.title);
            initCommuniqueFunc.initAllCommunique({typeId: item.id});
        }
    })
};
/**
 * 浏览详情
 * @param id
 */
exports.initCommuniqueDetail = function (id) {
    var checkBrower = $('#checkBrower');
    if (checkBrower.length > 0 && !checkBrower.data('flag')) {
        checkBrower.data('flag', true);
        checkBrower.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('查看浏览记录', checkBrowerModal());
            modal.show();
            modal.showClose();
            initBrowerModalEvent(modal, $('.comments-list'));
        });
        $('#modalComment').click(function (e) {
            common.stopPropagation(e);
            var content = $('.modalCommentModal').val();
            if (!content) {
                return alert('请输入评价内容');
            }
            communiqueApi.postComment({commentContent: content, moduleId: '7', pId: id}).then(function (res) {
                if (res.code === 1) {
                    $('.modalCommentModal').val("");
                    initCommuniqueFunc.initCommentList(id);
                }
            })
        });
    }
};