var common = require('../../Common');
var newInstrumentModal = require('./modal/newInstrumentModal.ejs');
var addEmployeeModal = require('./modal/addEmployeeModal.ejs');
var addEmployee = require('../../../components/addEmployee');
var organizationManagerFunc = require('./organizationManangerFunc');
var deleteModal = require('./modal/deleteModal.ejs');
var taskDistributionModal = require('./modal/taskDistributionModal.ejs');
var selectJobModal = require('./modal/selectJobModal.ejs');
var organizaCheckModal = require('./modal/organizaCheckModal.ejs');
var projectInitEvent = require('../initEvent');
var organizationApi = require('./organizationApi');

var checkTaskModal = require('./modal/checkTaskModel.ejs');

var Model = require('../../../components/Model');

exports.initOrganizationStructureEvent = function () {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo
    var newOrganization = $('#newOrganization');
    if (newOrganization.length > 0 && !newOrganization.data('flag')) {
        newOrganization.data('flag', true);
        newOrganization.click(function (e) {
            common.stopPropagation(e);
            var newInstrument = Model('新建机构', newInstrumentModal());
            newInstrument.showClose();
            newInstrument.show();
            initNewInstrumentModalEvent(newInstrument);
        });
        $('#changeUpdate').click(function (e) {
            common.stopPropagation(e);
            var item = $(this).data('item');
            var newInstrument = Model('更新机构', newInstrumentModal());
            newInstrument.showClose();
            newInstrument.show();
            initNewInstrumentModalData(newInstrument, item);
            initNewInstrumentModalEvent(newInstrument);
        });
    }
};

function initNewInstrumentModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('[name=projDeptName]').val(item.projDeptName);
    $('#chargeName').text(item.chargeName);
    $('#chargeName').data('user', {userName: item.chargeName, userNo: item.chargeNo});
    var trs = $('#employeeTable').find('tr');
    var list = [];
    for (var i = 0, length = trs.length; i < length; i++) {
        list.push($(trs[i]).data('item'));
    }
    var parents = modal.$body.find('#insetEmployee').html('');
    organizationManagerFunc.renderNewInstrumentModal(list, modal, parents, 'old');
    organizationManagerFunc.getOrganizeFloatingPopulationModalFunc(modal);
}

function initNewInstrumentModalEvent() {
    var modal = arguments[0];
    modal.$body.find('.model-project-common').click(function (e) {
        common.stopPropagation(e);
        modal.$body.find('.select-job-modal').remove();
    });
    modal.$body.find('#addEmployee').click(function (e) {
        common.stopPropagation(e);
        var $addEmployee = Model('添加人员', addEmployeeModal());
        $addEmployee.showClose();
        $addEmployee.show();
        initAddEmployeeModalEvent($addEmployee, modal);
    });
    modal.$body.find('#selectEmployee').click(function (e) {
        common.stopPropagation(e);
        var employee = new addEmployee('添加项目人员', function (data) {
            var parents = modal.$body.find('#insetEmployee');
            var newsDom = parents.find('tr.new');
            var newsList = [];
            for (var i = 0; i < newsDom.length; i++) {
                var tr = $(newsDom[i]);
                var item = tr.data('item');
                item.projPosName = tr.find('.select').text();
                item.projPosId = tr.find('.select').data('id');
                newsList.push(item);
            }
            newsDom.remove();
            var oldsDom = parents.find('tr.old');
            var oldsList = [];
            for (var j = 0; j < oldsDom.length; j++) {
                var _tr = $(oldsDom[j]);
                var _item = _tr.data('item');
                _item.projPosName = _tr.find('.select').text();
                _item.projPosId = _tr.find('.select').data('id');
                oldsList.push(_item);
            }
            data = ArrayDeduplication(oldsList, data);
            data = ArrayDeduplication(newsList, data);
            organizationManagerFunc.renderNewInstrumentModal(data, modal, parents, 'new');
            employee.hide();
        });
        employee.getUserTreeDetailList(function () {
            var list = [];
            var trs = modal.$body.find('#insetEmployee tr.new');
            for (var i = 0, length = trs.length; i < length; i++) {
                list.push($(trs[i]).data('item'));
            }
            employee.renderSelectData(list);
        });
        employee.show();
    });
    modal.$body.find('.save').click(function (e) {
        common.stopPropagation(e);
        initSubmitData(modal, 1);
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        initSubmitData(modal, 2);
    })
}

function ArrayDeduplication(oldList, newList) {
    oldList = oldList || [];
    newList = newList || [];
    for (var i = 0; i < oldList.length; i++) {
        var item = oldList[i];
        for (var j = 0; j < newList.length; j++) {
            var child = newList[j];
            if (item.userNo === child.userNo) {
                newList.splice(j, 1);
            }
        }
    }
    return newList
}

/**
 * 初始化提交的数据
 * @param modal
 * @param status 1 保存 2 审批
 */
function initSubmitData(modal, status) {
    var projDeptName = modal.$body.find('[name=projDeptName]').val();
    var trs = modal.$body.find('#insetEmployee tr');
    var list = [];
    var error = false;
    var errMsg = '';
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        var userNo = tr.data('item').userNo;
        var projPosId = tr.find('.select').data('id');
        if (!projPosId || projPosId === 'a') {
            error = true;
            errMsg = '请添加项目职务';
            break;
        }
        list.push({userNo: userNo, projPosId: projPosId});
    }
    if (error) {
        return alert(errMsg);
    }
    if (!projDeptName) {
        return alert('请输入组织机构名称');
    }
    if (!trs || trs.length === 0) {
        return alert('请选择添加组织机构的人员');
    }
    organizationManagerFunc.addOrganizeAndApprovalFunc({
        list: list,
        projDeptName: projDeptName,
        status: status
    }, modal);
}

/*项目成员及职务*/
exports.initOrganizeStrumentModalEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'delete') {
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDeleteModalEvent(delModal, item, $(this).parents('tr'));
        }
    });
    parents.find('.select').click(function (e) {
        common.stopPropagation(e);
        var pageY = e.pageY;
        parents.find('.role').html('');
        var nextDom = $(this).next('.role');
        var selectModal = $(selectJobModal());
        selectModal.css({left: 200, top: pageY - 200});
        selectModal.appendTo(nextDom);
        initSelectJobModalData(selectModal);
    })
};

function initAddEmployeeModalEvent() {
    organizationManagerFunc.getSystemJobAllListFunc();
    var modal = arguments[0];
    var parentModal = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var userName = modal.$body.find('[name=userName]').val();
        var sex = modal.$body.find('[name=sex]:checked').val();
        var age = modal.$body.find('[name=age]').val();
        var projPosId = modal.$body.find('#projPosId').val();
        var projPosName = modal.$body.find('#projPosId option:selected').text();
        var phone = modal.$body.find('[name=phone]').val();
        var resource = modal.$body.find('[name=resource]').val();
        var address = ' ';
        if (modal.$body.find('[name=address]').val()) {
            address = modal.$body.find('[name=address]').val();
        }
        var idCard = modal.$body.find('[name=idCard]').val();
        var titleNo = modal.$body.find('[name=titleNo]').val();
        var titleName = modal.$body.find('[name=titleName]').val();
        if (!userName) {
            return alert('请输入用户名称');
        }
        if (!sex) {
            return alert('请选择性别');
        }
        if (!age) {
            return alert('请输入年龄');
        }
        if (isNaN(age * 1)) {
            return alert('年龄格式不符');
        }
        if (!projPosId || projPosId === 'a') {
            return alert('请选择项目职务');
        }

        if (!phone) {
            return alert('请输入联系方式');
        }
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            if (!( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(phone))) {
                return alert('请输入正确的联系方式');//固话验证
            }
        }

        if (!resource) {
            return alert('请输入来源');
        }
        if (!idCard) {
            return alert('请输入身份证号');
        }
        if (!(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(idCard))) {
            return alert('请输入正确的身份证号！');
        }
        organizationManagerFunc.postOrganizeFloatingPopulationFunc({
            userName: userName,
            sex: sex,
            projPosName: projPosName,
            age: age,
            projPosId: projPosId,
            phone: phone,
            resource: resource,
            address: address,
            idCard: idCard,
            titleNo: titleNo,
            titleName: titleName
        }, modal, parentModal);
    });
}

exports.initTaskTableEvent = function (parents, type) {
    parents.find('.' + type + ' a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var tbody = $(this).parents('tbody');
        var item = $(this).parents('tr').data('item');
        var td = $(this).parents('td');
        if (type === 'edit') {
            tbody.find('.modal-arrow-left').remove();
            var task = $(taskDistributionModal());
            task.appendTo(td);
            initTaskEditModalEvent(task, item, tbody);
        } else {
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDelModalEvent(delModal, item);
        }
    });

};

function initDelModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        organizationManagerFunc.delTaskTable(item, modal);
    });
}

function initTaskEditModalEvent(parents, item) {
    parents.click(function (e) {
        common.stopPropagation(e);
    });
    parents.find('.cancel').click(function (e) {
        common.stopPropagation(e);
        parents.remove();
    });
    parents.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var posRemark = parents.find('textarea').val();
        if (!posRemark) {
            return alert('请输入内容');
        }
        organizationManagerFunc.postOrganizeStrucEmployeeRemarkFunc({
            id: item.id,
            type: item.type,
            posRemark: posRemark
        }, parents);
    });
}

function initSelectJobModalData() {
    var parents = arguments[0];
    parents = parents.find('.job-list').html('');
    organizationManagerFunc.getOrganizePositionFunc(parents);
}


exports.initOrganizePositionSelectEvent = function (parents) {
    parents.find('.job-item').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        $(this).parents('td').find('.select').text(item.posName);
        $(this).parents('td').find('.select').data('id', item.id);
        $(this).parents('.select-job-modal').remove();
    });
};


exports.initOrganizeFloatingPopulationTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var td = $(this).parents('td');
        var item = $(this).parents('tr').data('item');
        if (type === 'check-detail') {
            parents.find('.modal-arrow-left').remove();
            var checkModal = $(organizaCheckModal());
            checkModal.appendTo(td);
            initCheckModalEvent(checkModal, item);
        } else {
            parents.find('.modal-arrow-left').remove();
            var checkTask = $(checkTaskModal());
            checkTask.appendTo(td);
            checkTask.find('textarea').val(item.positonRemark);
        }
    });
};

function initCheckModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.find('[name=resource]').text(item.resource);
    modal.find('[name=address]').text(item.address);
    modal.find('[name=idCard]').text(item.idCard);
    modal.find('[name=titleName]').text(item.titleName);
    modal.find('[name=titleNo]').text(item.titleNo);
}


function initDeleteModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    var parents = arguments[2];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        if (item.id) {
            organizationManagerFunc.delUpdateOrganiza(item, modal, parents);
        } else {
            parents.remove();
            modal.hide();
        }
    });
}


exports.initOrganizationOutEvent = function (parents, modal) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'delete') {
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDeleteOutModalEvent(delModal, item, modal);
        } else {
            var $addEmployee = Model('修改人员', addEmployeeModal());
            $addEmployee.showClose();
            $addEmployee.show();
            organizationManagerFunc.getSystemJobAllListFunc(item.projPosId);
            initUpdateEmployeeModalEvent($addEmployee, item, modal);
        }
    })
};

function initDeleteOutModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    var parentModal = arguments[2];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        organizationManagerFunc.delOrganizeStrucEmployeeFunc(item.id, modal, parentModal);
    })
}

function initUpdateEmployeeModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    var parentModal = arguments[2];
    modal.$body.find('[name=userName]').val(item.userName);
    modal.$body.find('[name=sex][value=' + item.sex + ']').prop('checked', true);
    modal.$body.find('[name=age]').val(item.sex);
    modal.$body.find('#projPosId').val(item.projPosId);
    modal.$body.find('[name=phone]').val(item.phone);
    modal.$body.find('[name=resource]').val(item.resource);
    modal.$body.find('[name=address]').val(item.address);
    modal.$body.find('[name=idCard]').val(item.idCard);
    modal.$body.find('[name=titleNo]').val(item.titleNo);
    modal.$body.find('[name=titleName]').val(item.titleName);
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var userName = modal.$body.find('[name=userName]').val();
        var sex = modal.$body.find('[name=sex]:checked').val();
        var age = modal.$body.find('[name=age]').val();
        var projPosId = modal.$body.find('#projPosId').val();
        var projPosName = modal.$body.find('#projPosId option:selected').text();
        var phone = modal.$body.find('[name=phone]').val();
        var resource = modal.$body.find('[name=resource]').val();
        var address = modal.$body.find('[name=address]').val();
        var idCard = modal.$body.find('[name=idCard]').val();
        var titleNo = modal.$body.find('[name=titleNo]').val();
        var titleName = modal.$body.find('[name=titleName]').val();
        if (!userName) {
            return alert('请输入用户名称');
        }
        if (!sex) {
            return alert('请选择性别');
        }
        if (!projPosId) {
            return alert('请选择项目职务');
        }
        if (!age) {
            return alert('请输入年龄');
        }
        if (!phone) {
            return alert('请输入联系方式');
        }
        if (!resource) {
            return alert('请输入来源');
        }
        if (!idCard) {
            return alert('请输入身份证号');
        }
        organizationManagerFunc.putOrganizeFloatingPopulationFunc({
            userName: userName,
            sex: sex,
            id: item.id,
            projPosName: projPosName,
            age: age,
            projPosId: projPosId,
            phone: phone,
            resource: resource,
            address: address,
            idCard: idCard,
            titleNo: titleNo,
            titleName: titleName
        }, modal, parentModal);
    });
}

exports.initOrgHideModal = function () {
    var project = $('.project-list-wrap');
    if (project.length > 0 && !project.data('flag')) {
        project.data('flag', true);
        project.click(function (e) {
            common.stopPropagation(e);
            $('.modal-arrow-left').remove();
        });
    }
};

exports.initOrganizationInEvent = function (parents) {
    // 系统职务描述
    // var desc;
    // parents.find('.job-desc').on('mouseenter', function (e) {
    //     var postId = $(this).parents('tr').data('postId');
    //     var pageX = e.pageX;
    //     var pageY = e.pageY;
    //     desc = $('<div class="job-description"></div>');
    //     desc.css({'top': pageY + 18, 'left': pageX});
    //     desc.appendTo($(this));
    //     organizationManagerFunc.getJobDescFunc(postId);
    // });
    // parents.find('.job-desc').on('mousemove', function (e) {
    //     var pageX = e.pageX;
    //     var pageY = e.pageY;
    //     desc.css({'top': pageY + 18, 'left': pageX});
    // });
    // parents.find('.job-desc').on('mouseleave', function () {
    //     $('.job-description').remove();
    // });

    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        if($(this).data('type') === 'check'){
            var item = $(this).parents('tr').data('item');
            var td = $(this).parent('td');
            parents.find('.modal-arrow-left').remove();
            var checkTask = $(checkTaskModal());
            checkTask.appendTo(td);
            checkTask.find('textarea').val(item.positonRemark);
            var data = {};
            data.userNo = $(that).parents('tr').data('item').userNo;
            organizationApi.getChargeDesc(data).then(function(res){
                var data = res.data || '';
                checkTask.find('.system-task-cntr').html(data.cntr);
                checkTask.find('.system-task-noCntr').html(data.noCntr);
                checkTask.find('.system-task-prch').html(data.prch);
                checkTask.find('.system-task-check').html(data.check);
                checkTask.find('.system-task-payable').html(data.payable);
                checkTask.find('.system-task-cntrSave').html(data.cntrSave);
                checkTask.find('.system-task-mtrlPlanSave').html(data.mtrlPlanSave);
                checkTask.find('.system-task-settleSave').html(data.settleSave);
            });
            checkTask.click(function (e) {
                common.stopPropagation(e);
            });
        } else if($(this).data('type') === 'replace'){
            var employee = new addEmployee('添加项目人员', function () {});
            employee.getUserTreeDetailList(function () {
                $('.employee-select-section .level1>li>a>.select').hide();
                $('.employee-select-section .select').click(function(){
                    $('.employee-select-section .select').removeClass('radioed');
                    $(this).addClass('radioed');
                    var subs = $('.employee-select-section .result>li');
                    var sub = subs.eq(subs.length-1);
                    $('.employee-select-section .result').html('');
                    sub.appendTo($('.employee-select-section .result'));
                });
                $('.modal-employee-select').find('.select-confirm').click(function(){
                    var data = {};
                    data.oldUserNo = $(that).parents('tr').data('item').userNo;
                    data.newUserNo = $('.employee-select-section .radioed').parent().parent().data('data').userNo;
                    organizationApi.getTransOrganize(data).then(function(){
                        $('.modal-employee-select').find('.span-btn-bc').click();
                        organizationManagerFunc.getPostEmployeeFunc();
                    });
                });
            });
            employee.show();
        }
    })
}