var common = require('../Common');
var Model = require('../../components/Model');

var addProcessTypeModal = require('./modal/addProcessType.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var addEmployee = require('../../components/addEmployee');
var addJobModal = require('./modal/addJobModal.ejs');
var UploadAttach = require('../../components/UploadAttach');
var approalHandler = require('./modal/approalHandler.ejs');
var approvalApi = require('./approvalApi');

var approvalManagerFunc = require('./approvalManagerFunc');

var settingProcessModal = require('./modal/settingProcessModal.ejs');
/**
 * 流程类型事件
 */
exports.initProcessTypeEvent = function () {
    var addType = $('#addType');
    if (addType.length > 0 && !addType.data('flag')) {
        addType.data('flag', true);
        addType.click(function (e) {
            common.stopPropagation(e);
            var addProcessModal = Model('添加类型', addProcessTypeModal());
            addProcessModal.showClose();
            addProcessModal.show();
            initProcessTypeModalEvent(addProcessModal);
        })
    }
};

function initProcessTypeModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var typeName = modal.$body.find('[name=typeName]').val();
        if (!typeName) {
            return alert('请输入内容');
        }
        if (item) {
            approvalManagerFunc.putProcessTypeFunc({typeName: typeName, id: item.id}, modal);
        } else {
            approvalManagerFunc.postProcessTypeFunc({typeName: typeName}, modal);
        }
    });
}

/**
 * 流程类型table 事件
 * @param parents
 */
exports.initProcessTypeTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'edit') {
            var editProcessModal = Model('修改类型', addProcessTypeModal());
            editProcessModal.showClose();
            editProcessModal.show();
            initProcessTypeDelModalData(editProcessModal, item);
            initProcessTypeModalEvent(editProcessModal, item);
        } else {
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initProcessTypeDelModalEvent(delModal, item);
        }
    })
};

function initProcessTypeDelModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        approvalManagerFunc.delProcessTypeFunc(item.id, modal);
    });
}

function initProcessTypeDelModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('[name=typeName]').val(item.name);
}

/**
 * 流程设置事件
 */
exports.initApprovalProcessSettingEvent = function () {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var typeId = $('#typeId').val();
            typeId = typeId === 'a' ? '' : typeId;
            approvalManagerFunc.getTempListFunc({typeId: typeId});
        });
    }
};


exports.initApprovalProcessSettingAddEvent = function () {
    var addLevel = $('#addLevel');
    if (addLevel.length > 0 && !addLevel.data('flag')) {
        addLevel.data('flag', true);
        var levelContent = $('#levelContent').html('');
        var that = this;
        addLevel.click(function (e) {
            common.stopPropagation(e);
            var length = levelContent.find('.item-level').length + 1;
            var dom = $('<div style="margin-left: 115px;margin-top: 10px;" class="item-level">\
                     <div class="approval-input">\
                      <span class="approval-input-title">第' + length + '级审批</span>\
                      <input class="approval-input-content" type="text" disabled>\
                     </div>\
                     <div class="approval-menu">\
                      <span style="border-right:none;border-bottom-right-radius:0px;border-top-right-radius:0px;padding: 0 20px;" class="select" data-type="employee">选择人员</span><span style="border-bottom-left-radius:0px;border-top-left-radius:0px;padding: 0 20px;" class="select" data-type="job">选择职务</span>\
                     </div>\
                     <span class="delete-hover" data-type="delete" style="cursor:pointer;margin-left: 20px;color: #5b5b5b">删除</span>\
                    </div>');
            dom.appendTo(levelContent);
            that.initAddLevelEvent(dom, levelContent);
        });
        $("#selectData").find('span').click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            var input = $('#carbonCopyJob');
            var parents = $(this).parents('.item-level');
            approval(type, input, null, parents);
        });
        $('.deleteJob').click(function (e) {
            common.stopPropagation(e);
            $('#carbonCopyJob').val('');
            $('#carbonCopyJob').data('user', '');
        });
        console.log('----------~~~~~~~~~');
        console.log($('.confirm'));
        $('.confirm').click(function (e) {
            common.stopPropagation(e);
            var id = $('#processSettingAdd').data('id');
            var tmplType = $('#processType').val();
            var tmplName = $('[name=tmplName]').val();
            var remark = $('[name=remark]').val();
            var levelContent = $('#levelContent').find('input');
            var error = false;
            var errMsg = '';
            var nodes = [];
            if (!tmplType || tmplType === 'a') {
                return alert('请选择流程类型');
            }
            if (!tmplName) {
                return alert('请输入流程名称');
            }
            if (remark.length === 0) {
                return alert('请输入流程说明');
            }
            if (levelContent.length === 0) {
                return alert('请创建审批流程');
            }

            for (var i = 0, length = levelContent.length; i < length; i++) {
                var input = $(levelContent[i]);
                if (!input.val()) {
                    error = true;
                    errMsg = i;
                    break;
                }
                var user = input.data('user');
                var data = {};
                if (user.id) {
                    data.apprProjPosId = user.id;
                    data.nodeType = 2;
                } else {
                    data.apprUserNo = user.userNo;
                    data.nodeType = 1;
                }
                data.nodeLevel = i + 1;
                nodes.push(data);
            }
            if (error) {
                return alert('请输入第' + (i + 1) + '审批人');
            }
            var copyProjPosIds = [];
            var copyUserNos = [];
            var jobs = $('#carbonCopyJob').data('user') || [];
            for (var j = 0, $length = jobs.length; j < $length; j++) {
                if (jobs[j].id) {
                    copyProjPosIds.push(jobs[j].id);
                }
                if (jobs[j].userNo) {
                    copyUserNos.push(jobs[j].userNo)
                }
            }
            /*var persons = $('#carbonCopyPerson').data('user') || [];
            for (var k = 0, _length = persons.length; k < _length; k++) {
              copyUserNos.push(persons[k].userNo);
            }*/
            if (id) {
                approvalManagerFunc.putTempFunc({
                    id: id,
                    tmplType: tmplType,
                    tmplName: tmplName,
                    remark: remark,
                    nodes: nodes,
                    copyProjPosIds: copyProjPosIds,
                    copyUserNos: copyUserNos
                })
            } else {
                approvalManagerFunc.postTempFunc({
                    tmplType: tmplType,
                    tmplName: tmplName,
                    remark: remark,
                    nodes: nodes,
                    copyProjPosIds: copyProjPosIds,
                    copyUserNos: copyUserNos
                });
            }
        });
    }
};

exports.initAddLevelEvent = function (parents, parentsId) {
    parents.find('.select').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var input = $(this).parent().parent().find('input');
        var parents = $(this).parents('.item-level');
        approval(type, input, 'single', parents);
    });
    parents.find('.delete-hover').click(function (e) {
        common.stopPropagation(e);
        $(this).parents('.item-level').remove();
        var parentDom = parentsId.find('.item-level');
        for (var i = 0, length = parentDom.length; i < length; i++) {
            var count = '第' + (i + 1) + '级审批';
            $(parentDom[i]).find('.approval-input-title').text(count)
        }
    })
};

function approval(type, input, level, parents) {
    if (type === 'employee') {
        var $user = $(input).data('user');
        var employee = new addEmployee('添加选择人员', function (data) {
            var user = '';
            if (level === 'single') {
                user = data && data[0];
                $(input).data('user', user);
                $(input).val(user.userName);
            } else {
                user = data || [];
                $(input).data('user', user);
                var listName = [];
                for (var i = 0, length = user.length; i < length; i++) {
                    listName.push(user[i].userName);
                }
                $(input).val(listName.join(','));
            }
            employee.hide();
        }, level);
        employee.getUserTreeList(function () {
            var list = [];
            if ($user) {
                list.push($user);
            }
            employee.renderSelectData(list);
        });
        employee.show();
    } else if (type === 'delete') {
        parents.remove();
    } else if (type === 'job') {
        var addJob = Model('添加职务', addJobModal());
        addJob.showClose();
        addJob.show();
        initAddJobModalData(addJob, level);
        initAddJobModalEvent(addJob, input, level);
    }
}

function initAddJobModalData() {
    var modal = arguments[0];
    var level = arguments[1];
    approvalManagerFunc.getProjectJobListFunc(modal, level);
}

function initAddJobModalEvent() {
    var modal = arguments[0];
    var input = arguments[1];
    var level = arguments[2];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var radioed = modal.$body.find('.radioed');
        if (radioed.length === 0) {
            return alert('请选择抄送职务');
        }
        var list = [];
        var listName = [];
        for (var i = 0, length = radioed.length; i < length; i++) {
            var item = $(radioed[i]).parents('.job-item').data('item');
            list.push(item);
            listName.push(item.posName);
        }
        input.val(listName.join(','));
        if (level === 'single') {
            $(input).data('user', list[0]);
        } else {
            $(input).data('user', list);
        }
        modal.hide();
    });
}


exports.initProjectJobListDomEvent = function (parents, level) {
    parents.find('.select').click(function (e) {
        common.stopPropagation(e);
        if (level === 'single') {
            parents.find('.select').removeClass('radioed');
            $(this).addClass('radioed');
        } else {
            if ($(this).hasClass('radioed')) {
                $(this).removeClass('radioed');
            } else {
                $(this).addClass('radioed');
            }
        }
    })
};

exports.initApprovalProcessSettingTableEvent = function (parents) {
    parents.find('tr').click(function () {
        window.location.href = '/approval/setting/add?id=' + $(this).data('item').id;
    })
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'edit') {

        } else if (type === 'delete') {
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDeleteProcessSettingModal(delModal, item);
        } else if (type === 'check') {

        } else if (type === 'open') {
            approvalApi.putApprTemp({switchType: 1, tempId: item.id}).then(function (res) {
                if (res.code === 1) {
                    $(that).hide();
                    $(that).parents('tr').find('.close-temp').show();
                }
            })
        } else if (type === 'close') {
            approvalApi.putApprTemp({switchType: 2, tempId: item.id}).then(function (res) {
                if (res.code === 1) {
                    $(that).hide();
                    $(that).parents('tr').find('.open-temp').show();
                }
            })
        }
    })
};

function initDeleteProcessSettingModal() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        approvalManagerFunc.delApprovalTempFunc(item.id, modal);
    })
}


exports.initNewApplyDomEvent = function (parents) {
    parents.change(function (e) {
        common.stopPropagation(e);
        var id = $(this).val();
        approvalManagerFunc.getNewApplyProcessSettingFunc({typeId: id});
    });
    parents.change();
};

exports.initNewApplyProcessSettingEvent = function (parents) {
    parents.change(function (e) {
        common.stopPropagation(e);
        var item = $(this).find('option:selected').data('item');
        if (item) {
            approvalManagerFunc.getProcessSetting(item.id);
        } else {
            $('[name=copyProjPosNames]').text('暂无');
            $('[name=remark]').text('暂无');
            $('[name=copyUserNames]').text('暂无');
            $('#projectName').hide();
        }
    });
};


exports.initNewApplyEvent = function () {
    var confirm = $('.confirm');
    if (confirm.length > 0 && !confirm.data('flag')) {
        confirm.data('flag', true);
        var upload = UploadAttach($('#report'), true);
        confirm.click(function (e) {
            common.stopPropagation(e);
            var tmplId = $('#processName').val();
            var tmplName = $('#processName option:selected').text();
            var projectName = $('#projectName').data('item');
            if (!tmplId || tmplId === 'a') {
                return alert('请选择流程名称');
            }
            var projDeptId = $('#projectName').find('select').val();
            if (projectName.tmplUsed === 2 && (!projDeptId || projDeptId === 'a')) {
                return alert('请选择部门');
            }
            var applyContent = $('[name=applyContent]').val();
            if (!applyContent) {
                return alert('请输入申请内容');
            }
            var attaches = upload.getAttaches();
            var data = {
                tmplId: tmplId,
                attaches: attaches,
                applyContent: applyContent,
                tmplName: tmplName
            };
            if (projectName.tmplUsed === 2) {
                data.projDeptId = projDeptId;
            }
            approvalManagerFunc.postNewApplyFunc(data);
        })
        /**
         * 当前申请人
         */
        var user = localStorage.getItem('user');
        user = user ? JSON.parse(user).employee : "";
        if (user) {
            $('.currentUser').text(user.userName);
        }
    }
};

exports.initMyApplyEvent = function (page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            var data = {};
            if (tmplType !== 'a') {
                data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                data.projId = projId;
            }
            if (apprStatus !== 0) {
                data.apprStatus = apprStatus;
            }
            data.pageNo = 1;
            approvalManagerFunc.getMyApplyListFunc(data, page);
        });
        $('.allReportBtn .item').click(function (e) {
            common.stopPropagation(e);
            $('.allReportBtn .item').removeClass('active');
            $(this).addClass('active');
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            var data = {};
            if (tmplType !== 'a') {
                data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                data.projId = projId;
            }
            if (apprStatus !== 0) {
                data.apprStatus = apprStatus;
            }
            approvalManagerFunc.getMyApplyListFunc(data, page);
        });
        $('.icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
            $('.my-apply-list .apply-item').removeClass('active');
        });
    }
};

function initApprovalHandlerModalEvent() {
    var modal = arguments[0];
    var apprStatus = arguments[1];
    modal.$body.find('[type=radio][value=' + apprStatus + ']').prop('checked', true);
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var item = $('.apply-item.active').data('item');
        var apprRemark = modal.$body.find('[name=apprRemark]').val();
        if (!apprRemark) {
            return alert('请输入审批意见');
        }
        approvalManagerFunc.postApprovalFunc({
            apprRemark: apprRemark,
            apprStatus: apprStatus,
            applyId: item.id,
            tmplId: item.tmplId,
            nodeLevel: item.level
        }, modal);
    });
}

exports.initMyApplyTableEvent = function (parents, page) {
    $('.knowledge-detail').removeClass('active');
    $('.my-apply-list .apply-item').removeClass('active');
    /*申请栏与申请内容宽度恢复*/
    $('#myApply').css('width', 'auto');
    $('#page').css('width', 'auto');
    $('.apply-content').css('width', 1000);
    parents.find('.apply-item').click(function (e) {
        common.stopPropagation(e);
        /*申请栏的宽度自适应*/
        var autoWidth = $(window).width() - 1010;
        autoWidth = autoWidth < 500 ? 500 : autoWidth;
        $('#myApply').css('width', autoWidth);
        $('#page').css('width', autoWidth);
        /*申请内容的宽度 和 标题的宽度 自适应*/
        var _autoWidth = $('.apply-item').width() - 260;
        _autoWidth = _autoWidth < 200 ? 200 : _autoWidth;
        $('.apply-content').css('width', _autoWidth);
        $('.apply-name').css('width', _autoWidth);
        parents.find('.apply-item').removeClass('active');
        $(this).addClass('active');
        var item = $(this).data('item');
        $('.knowledge-detail').addClass('active');
        $('.icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
            $('.my-apply-list .apply-item').removeClass('active');
            /*申请栏与申请内容宽度恢复*/
            $('#myApply').css('width', 'auto');
            $('#page').css('width', 'auto');
            $('.apply-content').css('width', 1000);
        });
        approvalManagerFunc.getApplyContentAndProcessFunc({id: item.id, tmplId: item.tmplId}, page);
    })
};


exports.initMyApprovalEvent = function (page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            var data = {};
            if (tmplType !== 'a') {
                data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                data.projId = projId;
            }
            if (apprStatus !== 0) {
                data.apprStatus = apprStatus;
            }
            data.pageNo = 1;
            approvalManagerFunc.getMyApprovalFunc(data, page);
        });
        $('.allReportBtn .item').click(function (e) {
            common.stopPropagation(e);
            $('.allReportBtn .item').removeClass('active');
            $(this).addClass('active');
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            var data = {};
            if (tmplType !== 'a') {
                data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                data.projId = projId;
            }
            if (apprStatus !== 0) {
                data.apprStatus = apprStatus;
            }
            approvalManagerFunc.getMyApprovalFunc(data, page);
        });

        $('.confirmAgree').click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            var approvalHandlerModal = Model('审批处理', approalHandler());
            approvalHandlerModal.showClose();
            approvalHandlerModal.show();
            initApprovalHandlerModalEvent(approvalHandlerModal, type);
        });

        $('#approveDetailClose').click(function () {
            $(this).parent().parent().removeClass('active');
            $('#myApply').find('.apply-item .active').removeClass('active');
        });
    }
};

exports.initApprovalCopyMe = function (page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            var data = {};
            if (tmplType !== 'a') {
                data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                data.projId = projId;
            }
            if (apprStatus !== 0) {
                data.apprStatus = apprStatus;
            }
            data.pageNo = 1;
            approvalManagerFunc.getApprovalCopyFunc(data, page);
        });
        $('.allReportBtn .item').click(function (e) {
            common.stopPropagation(e);
            $('.allReportBtn .item').removeClass('active');
            $(this).addClass('active');
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            var data = {};
            if (tmplType !== 'a') {
                data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                data.projId = projId;
            }
            if (apprStatus !== 0) {
                data.apprStatus = apprStatus;
            }
            approvalManagerFunc.getApprovalCopyFunc(data, page);
        });
    }
};


exports.initApprovalManagerEvent = function (page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var processType = $('#processType').val();
            var projId = $('#projId').val();
            var processStatus = $('#processStatus').val();
            var startTime = $('[name=startTime]').val();
            var endTime = $('[name=endTime]').val();
            var applyUserNo = $('#applyUserNo').val();
            var data = {};
            if (processType && processType !== 'a') {
                data.tmplType = processType
            }
            if (projId && projId !== 'a') {
                data.projId = projId
            }
            if (startTime) {
                data.startTime = startTime;
            }
            if (endTime) {
                data.endTime = endTime;
            }
            if (applyUserNo && applyUserNo !== 'a') {
                data.applyUserNo = applyUserNo;
            }
            if (processStatus && processStatus !== '0') {
                data.apprStatus = processStatus;
            }
            data.pageNo = 1;
            approvalManagerFunc.getCheckAllApprovalListFunc(data, page);
        });
    }
};

exports.initApprovalManagerTableEvent = function (parents, page) {
    $('.knowledge-detail').removeClass('active');
    $('.my-apply-list .apply-item').removeClass('active');
    /*申请栏与申请内容宽度恢复*/
    $('#myApply').css('width', 'auto');
    $('#page').css('width', 'auto');
    $('.apply-content').css('width', 1000);
    parents.find('.apply-item').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        // window.location.href = '/approval/manager/detail?id=' + item.id + "&tmplId=" + item.tmplId;
        /*申请栏的宽度自适应*/
        var autoWidth = $(window).width() - 1010;
        autoWidth = autoWidth < 500 ? 500 : autoWidth;
        $('#myApply').css('width', autoWidth);
        $('#page').css('width', autoWidth);
        /*申请内容的宽度自适应*/
        var _autoWidth = $('.apply-item').width() - 260;
        _autoWidth = _autoWidth < 200 ? 200 : _autoWidth;
        $('.apply-content').css('width', _autoWidth);

        parents.find('.apply-item').removeClass('active');
        $(this).addClass('active');
        $('.knowledge-detail').addClass('active');
        $('.icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
            $('.my-apply-list .apply-item').removeClass('active');
            /*申请栏与申请内容宽度恢复*/
            $('#myApply').css('width', 'auto');
            $('#page').css('width', 'auto');
            $('.apply-content').css('width', 1200);
        });
        approvalManagerFunc.getApplyContentAndProcessFunc({id: item.id, tmplId: item.tmplId}, page);
    });
    parents.find('.delete-manager').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('.apply-item').data('item');
        var delModal = Model('提示', deleteModal());
        delModal.showClose();
        delModal.show();
        initDelModalEvent(delModal, item, page);
    });
};

function initDelModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    var page = arguments[2];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        approvalManagerFunc.delTempFunc(item.tmplId, modal, page);
    });
}


exports.initApprovalManagerDetail = function () {
    var delManager = $('#delManager');
    if (delManager.length > 0 && !delManager.data('flag')) {
        delManager.data('flag', true);
        delManager.click(function (e) {
            common.stopPropagation(e);
            var mid = $('#managerDetail').data('mid');
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDelModalEvent(delModal, {tmplId: mid});
        })
    }
};