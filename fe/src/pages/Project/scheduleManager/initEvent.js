var common = require('../../Common');
var Modal = require('../../../components/Model');
var projectScheduleRenderTable = require('./projectScheduleRenderTable');
var projectScheduleManagerFunc = require('./projectScheduleManagerFunc');
var scheduleEditModal = require('./modal/scheduleEditModal.ejs');
var projectScheduleApi = require('./projectScheduleApi');
var organizationApi = require('../organizationManager/organizationApi');
var addOrgEmployeeModal = require('./modal/addOrgEmployeeModal.ejs');
var addEmployee = require('../../../components/addEmployee');
var approvalProcess = require('../../../components/approvalProcess');
var remindModal = require('../../../components/remindModal/remindModal.ejs');
var checkScheduleModal = require('./modal/checkScheduleModal.ejs');
var Page = require('../../../components/Page');

exports.initClickScheduleManager = function initClickScheduleManager(parents) {

    parents.find('a').click(function (e) {
        var that = $(this);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data("item");
        if (type === 'check') {
            var checkSchedule = Modal('查看', checkScheduleModal());
            checkSchedule.showClose();
            checkSchedule.show();
            var _page = checkSchedule.$body.find('#page');
            var page = new Page(_page, {
                pageSize: [10, 20, 30], // 设置每页显示条数按钮
                size: 10, // 默认每页显示多少条
            });
            projectScheduleManagerFunc.getScheduleHistoryFunc({
                planId: item.planId,
                stepId: item.id,
            }, checkSchedule, page);
        } else {
            parents.find('.schedule-manager-modal').remove();
            var td = $(this).parents('td');
            var dom = $('<div class="schedule-manager-modal">\
         <div class="schedule-title">进度管理</div>\
         <div class="schedule-section">\
           <div class="modal-form">\
             <div class="item">\
             <label class="bold-title label-block" style="width: 90px;"><i class="icon-fill-in">*</i>完成情况:</label>\
             <input class="int int-default int-small14" name="completePer">%\
             </div>\
             <div class="item">\
              <label class="bold-title label-block" style="width: 90px;"><i class="icon-fill-in">*</i>缺少劳动力:</label>\
              <input class="int int-default int-small14" name="workerCount">人\
             </div>\
             <div class="item">\
              <label class="bold-title label-block" style="float: left;margin-right: 3px;width: 90px;">\
              <i class="icon-fill-in">*</i>进度说明:</label>\
              <textarea class="int int-default int-small14" placeholder="填写" name="remark" style="height: 80px;padding: 3px;"></textarea>\
            </div>\
            <div style="text-align: right;margin-top: 10px">\
             <span class="span-btn confirm">确认</span>\
             <span class="span-btn span-btn-bc confirm-active cancel" >取消</span>\
            </div>\
           </div>\
           </div>\
            <div class="triangle-left bebebe"></div>\
            <div class="triangle-left ffffff"></div>\
        </div>');
            dom.appendTo(td);
            var completePer = dom.find("[name=completePer]");
            var workerCount = dom.find("[name=workerCount]");
            var remark = dom.find("[name=remark]");
            completePer.val(item.completePer);
            if(item.completePer == '100'){
                workerCount.val(0).prop('disabled',true);
            }
            // workerCount.val(item.workerCount)
            remark.val(item.remark);
            initClick(dom, completePer, workerCount, remark, item, that);
        }
    })
};

/**
 * 初始化点击事件
 */
function initClick(dom, completePer, workerCount, remark, item, that) {
    var confirm = dom.find(".confirm");
    var cancel = dom.find(".cancel");
    confirm.click(function (e) {
        common.stopPropagation(e);
        var $completePer = completePer.val();
        var $workerCount = workerCount.val();
        var $remark = remark.val();
        if (!$completePer) {
            return alert('请输入完成情况');
        }
        if (!$workerCount) {
            return alert('请输入当前缺少劳动力');
        }
        if (!$remark) {
            return alert('请输入进度说明');
        }
        projectScheduleApi.addScheduleHistory({
            planId: item.planId,
            projId: item.projId,
            stepId: item.id,
            completePer: $completePer,
            workerCount: $workerCount,
            remark: $remark
        }).then(function (res) {
            if (res.code === 1) {
                projectScheduleManagerFunc.initScheduleList();
            }
        })
        $(this).parents('.schedule-manager-modal').remove();
    });
    cancel.click(function (e) {
        common.stopPropagation(e);
        $(this).parents('.schedule-manager-modal').remove();
    })
}

exports.initEditSchedule = function initEditSchedule() {
    var initEditSchedule = $('#editSchedule');
    if (initEditSchedule.length > 0 && !initEditSchedule.data('flag')) {
        initEditSchedule.data('flag', true);
        var that = this;
        initEditSchedule.click(function (e) {
            common.stopPropagation(e);
            var pid = $(this).data('pid');
            var modal = Modal(null, scheduleEditModal());
            modal.$header.hide();
            modal.$body.find(".icon-close").click(function (e) {
                common.stopPropagation(e);
                modal.hide();
            });
            modal.show();
            initEditScheduleClick(modal, that);
            initEditAddEmployeeScheduleDom(modal, that);
            if (pid) {
                var parents = modal.$body.find('.modal-form');
                $("#modalSave").data('id', pid.id);
                initPlanAndStepData(parents, pid, modal);
            } else {
                $("#modalSave").data('id', "");
            }
        });
        /**
         * 中止
         */
        $('#stopSchedule').click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            if (type === '2') {
                return alert('进度未执行禁止操作');
            }
            var remind = Modal('提示', remindModal());
            remind.showClose();
            remind.show();
            var text = $(this).text();
            var content = text === '执行计划' ? '确认执行计划么' : '确认终止进度么';
            var status = text === '执行计划' ? 1 : 3;
            remind.$body.find('.remindContent').text(content);
            remind.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var planId = initEditSchedule.data('pid');
                if (!planId) {
                    return alert('请创建进度');
                }
                projectScheduleManagerFunc.postStopScheduleFunc({planId: planId.id, status: status}, remind);
            });
        })
    }
};

function initPlanAndStepData(parents, obj, modal) {
    projectScheduleRenderTable.renderScheduleSpan(parents, obj);
    projectScheduleApi.getScheduleStepList({planId: obj.id}).then(function (res) {
        var $parents = modal.$body.find('#modalScheduleTable').html('');
        if (res.code === 1) {
            projectScheduleRenderTable.renderModalTable($parents, res.data.data, modal);
        }
    })
}

function initEditScheduleClick(modal, that) {
    var del = modal.$body.find('#modelDel');
    var add = modal.$body.find("#modelAdd");
    var sort = modal.$body.find("#modelSort");
    var save = modal.$body.find("#modalSave");
    var parents = $("#modalScheduleTable");
    var confirm = modal.$body.find('#confirm');
    add.click(function (e) {
        common.stopPropagation(e);
        var count = parents.find('tr').length + 1;
        var dom = $('<tr class="active new">\
                    <td class="border"><input type="checkbox" /></td>\
                    <td class="border">' + count + '</td>\
                    <td class="border">\
                    <input type="text" class="input" placeholder="请填写" name="stepName" data-warn="项目名称" />\
                    </td>\
                    <td class="border">\
                    <div  name="chargeUserName" style="font-size: 12px;color:#009411;cursor:pointer;width: 67px;">选择责任人</div>\
                    </td>\
                    <td class="border">\
                     <input type="text"class="input" placeholder="系统计算" name="planDays" disabled/></td>\
                    <td class="border">\
                     <input type="text" class="input"placeholder="请填写" name="workerCount" data-warn="每天人数" /></td>\
                    <td class="border">\
                      <input style="font-family: Microsoft YaHei" type="date" class="input"placeholder="请填写" name="planBeginTime" data-warn="开始时间" /></td>\
                    <td class="border">\
                     <input style="font-family: Microsoft YaHei"  type="date" class="input" placeholder="请填写" name="planEndTime" data-warn="结束时间" /></td>\
                   </tr>');
        dom.appendTo(parents);
        that.initAddUserChargeName(parents, modal);
    });
    add.trigger('click');
    add.trigger('click');
    add.trigger('click');
    del.click(function (e) {
        common.stopPropagation(e);
        var checked = modal.$body.find('[type=checkbox]:checked');
        if (checked.length === 0) {
            return alert('请选择删除行')
        }
        var ids = [];
        for (var i = 0, length = checked.length; i < length; i++) {
            var checkbox = checked[i];
            var item = $(checkbox).parents('tr').data("item");
            if (item) {
                ids.push(item.id);
            } else {
                $(checkbox).parents('tr').remove();
            }
        }
        for (var j = 0, $length = ids.length; j < $length; j++) {
            var pid = $("#editSchedule").data('pid');
            var planId = pid.id;
            projectScheduleApi.delScheduleStepObj({id: ids[j], planId: planId}).then(function (res) {
                if (res.code === 1) {
                    initPlanAndStepData(modal.$body.find('.modal-form'), pid, modal);
                }
            });
        }
    });
    sort.click(function (e) {
        common.stopPropagation(e);
        var trs = parents.find('tr');
        var datas = [];
        for (var i = 0, length = trs.length; i < length; i++) {
            var tr = trs[i];
            datas.push(initTableInput(tr));
        }
        datas = datas.sort(function (a, b) {
            if (parseInt(a.planBeginTime) > parseInt(b.planBeginTime)) {
                return 1;
            }
            if (parseInt(a.planBeginTime) < parseInt(b.planBeginTime)) {
                return -1;
            }
            return 0;
        });
        var $parents = $('#modalScheduleTable').html('');
        projectScheduleRenderTable.renderModalTable($parents, datas, modal);
    });
    save.click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data("id");
        var data = {};
        var error = false;
        var errorMsg = '';
        var inputs = modal.$body.find('.modal-form input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var name = $(input).attr('name');
            var value = $(input).val();
            var warn = $(input).data('warn');
            data[name] = value;
            if (!value && warn) {
                error = true;
                errorMsg = warn;
                break;
            }
        }
        if (error) {
            return alert('请输入' + errorMsg);
        }
        var user = modal.$body.find('#chargeUserName').data("user");
        if (!user) {
            return alert('请选择项目负责人');
        }
        data.chargeUserNo = user.userNo;
        data.id = id;
        data.planDays = moment(data.planEndTime).diff(moment(data.planBeginTime), 'd');
        if (data.planDays < 0) {
            return alert('开始时间必须小于完工时间');
        }
        var _list = [];
        try {
            _list = initStepData(id);
        } catch (e) {
            return alert(e.message)
        }
        if (id) {
            projectScheduleApi.putScheduleObj(data, function (res) {
                if (res.code === 1) {
                    postStep(_list, id, modal)
                }
            })
        } else {
            projectScheduleApi.postScheduleObj(data, function (res) {
                if (res.code === 1) {
                    var planId = res.data.planId;
                    postStep(_list, planId, modal)
                }
            })
        }
    });
    modal.$body.find('#modalApproval').click(function (e) {
        common.stopPropagation(e);
        if (modal.$body.find('tr.new').length > 0) {
            return alert('请保存添加的进度项目')
        }
        var approval = new approvalProcess('进度审批流程', function () {
            var planId = $("#editSchedule").data('item');
            if (!planId) {
                return alert('请创建进度');
            }
            var item = approval.getSelectData();
            projectScheduleManagerFunc.postApprovalScheduleFunc({planId: planId.id, tmplId: item.id}, approval)
        });
        approval.getApprovalModal(9);
    });
    /**
     * 开始时间变化
     */
    modal.$body.find('.planBeginTime').change(function (e) {
        common.stopPropagation(e);
        var planBeginTime = $(this).val();
        var planEndTime = modal.$body.find('.planEndTime');
        var date = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2]\d|3[0-1])$/;
        var planDays = modal.$body.find('.planDays');
        var currentDay = moment(planBeginTime).diff(moment(), 'd');
        // if (!date.test(planBeginTime) || currentDay < 0) {
        if (!date.test(planBeginTime)) {
            $(this).val('');
            planDays.val('');
            return false;
        }
        if (!date.test(planEndTime.val())) {
            planEndTime.val('');
            return false;
        }
        planEndTime = moment(planEndTime.val()).set('hour', 24).set('minute', 0).set('second', 0);
        planBeginTime = moment(planBeginTime).set('hour', 0).set('minute', 0).set('second', 0);
        var day = moment(planEndTime).diff(moment(planBeginTime), 'd');
        if (day <= 0) {
            $(this).val('');
            planDays.val('');
            return alert('开始日期必须小于结束日期');
        }
        planDays.val(day);
    });
    modal.$body.find('.planEndTime').change(function (e) {
        common.stopPropagation(e);
        var planEndTime = $(this).val();
        var planBeginTime = modal.$body.find('.planBeginTime');
        var date = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2]\d|3[0-1])$/;
        var planDays = modal.$body.find('.planDays');
        var currentDay = moment(planEndTime).diff(moment(), 'd');
        if (!date.test(planEndTime) || currentDay < 0) {
            $(this).val('');
            planDays.val('');
            return false;
        }
        if (!date.test(planBeginTime.val())) {
            planBeginTime.val('');
            return false;
        }
        planEndTime = moment(planEndTime).set('hour', 24).set('minute', 0).set('second', 0);
        planBeginTime = moment(planBeginTime.val()).set('hour', 0).set('minute', 0).set('second', 0);
        var day = moment(planEndTime).diff(moment(planBeginTime), 'd');
        if (day <= 0) {
            $(this).val('');
            planDays.val('');
            return alert('结束日期必须大于开始日期');
        }
        planDays.val(day);
    });
    confirm.click(function (e) {
        common.stopPropagation(e);
        var planId = $("#editSchedule").data('pid');
        planId = planId ? planId.id : '';
        projectScheduleManagerFunc.initScheduleList(planId);
        modal.hide();
    });
}

function initTableInput(dom) {
    var item = {};
    var inputs = $(dom).find('.input');
    var user = $(dom).find('[name=chargeUserName]').data('user');
    if (user) {
        item.chargeUserNo = user.userNo;
        item.chargeUserName = user.userName;
    }
    for (var i = 0, length = inputs.length; i < length; i++) {
        var name = $(inputs[i]).attr('name');
        var value = $(inputs[i]).val();
        var warn = $(inputs[i]).data('warn');
        if (name === 'planBeginTime') {
            if (value) {
                item.planBeginTime = new Date(value).getTime();
            }
        } else if (name === 'planEndTime') {
            if (value) {
                item.planEndTime = new Date(value).getTime();
            }
        } else {
            item[name] = value;
        }
    }
    return item;
}

function initStepData(id) {
    var inputs = $("#modalScheduleTable").find(".input");
    var list = [];
    var item = {};
    var error = false;
    var errMsg = '';
    for (var i = 0, length = inputs.length; i < length; i++) {
        var name = $(inputs[i]).attr('name');
        var value = $(inputs[i]).val();
        var warn = $(inputs[i]).data('warn');
        if (!value && warn) {
            errMsg = warn;
            error = true;
        }
        item[name] = value;
        if ((i + 1) % 5 === 0) {
            item.planId = id;
            var user = $(inputs[i]).parents('tr').find('[name=chargeUserName]').data('user');
            if ($(inputs[i]).parents('tr').data('item')) {
                var itemId = $(inputs[i]).parents('tr').data('item').id;
                item.id = itemId;
            }
            if (!user) {
                error = true;
                errMsg = '请选择责任人';
                break;
            }
            item.chargeUserNo = user.userNo;
            list.push(item);
            item = {};
        }
    }
    if (error) {
        throw new Error('请输入' + errMsg);
    }
    return list;
}

function postStep(list, id, modal) {
    projectScheduleApi.postScheduleStepObj({list: list, planId: id}, function (res) {
        if (res.code === 1) {
            modal.hide();
            projectScheduleManagerFunc.initScheduleList(id);
        }
    })
}


function initEditAddEmployeeScheduleDom() {
    var modal = arguments[0];
    var that = arguments[1];
    modal.$body.find('#chargeUserName').click(function (e) {
        common.stopPropagation(e);
        var user = $(this).data('user');
        var $that = this;
        that.addEmployeeTable(user, $that);
    })
}

/**
 * 初始化table 添加用户信息
 * @param parents
 * @param modal
 */
exports.initAddUserChargeName = function (parents, modal) {
    var that = this;
    parents.find('[name=chargeUserName]').off('click').on('click', function (e) {
        common.stopPropagation(e);
        var user = $(this).data('user');
        var $that = this;
        that.addEmployeeTable(user, $that);
    });
    parents.find('[name=planBeginTime]').off('change').on('change', function (e) {
        common.stopPropagation(e);
        var planBeginTime = $(this).val();
        var totalPlanBeginTime = modal.$body.find('.planBeginTime').val();
        var totalPlanEndTime = modal.$body.find('.planEndTime').val();
        var planDays = $(this).parents('tr').find('[name=planDays]');
        var planEndTime = $(this).parents('tr').find('[name=planEndTime]').val();
        if (!totalPlanBeginTime || !totalPlanEndTime) {
            planDays.val('');
            $(this).val('');
            return alert('请先添加开工日期');
        }
        if (!planBeginTime) {
            planDays.val('');
            return false;
        }
        var currentStart = moment(planBeginTime).diff(moment(totalPlanBeginTime), 'd');
        var currentEnd = moment(planBeginTime).diff(moment(totalPlanEndTime), 'd');
        if (currentStart < 0) {
            planDays.val('');
            $(this).val('');
            return alert('计划开始时间必须大于等于开工开始时间');
        }
        if (currentEnd > 0) {
            planDays.val('');
            $(this).val('');
            return alert('计划开始时间必须小于完工结束时间');
        }
        if (!planEndTime) {
            planDays.val('');
            return false;
        }
        planEndTime = moment(planEndTime).set('hour', 24).set('minute', 0).set('second', 0);
        planBeginTime = moment(planBeginTime).set('hour', 0).set('minute', 0).set('second', 0);
        var day = moment(planEndTime).diff(moment(planBeginTime), 'd');
        if (day <= 0) {
            $(this).val('');
            planDays.val('');
            return alert('开始日期必须小于结束日期');
        }
        planDays.val(day);
        getTotalCount(modal);
    });
    parents.find('[name=planEndTime]').off('change').on('change', function (e) {
        common.stopPropagation(e);
        var planEndTime = $(this).val();
        var planBeginTime = $(this).parents('tr').find('[name=planBeginTime]').val();
        var totalPlanBeginTime = modal.$body.find('.planBeginTime').val();
        var totalPlanEndTime = modal.$body.find('.planEndTime').val();
        var planDays = $(this).parents('tr').find('[name=planDays]');
        if (!totalPlanBeginTime || !totalPlanEndTime) {
            planDays.val('');
            $(this).val('');
            return alert('请先添加开工日期');
        }
        var currentStart = moment(planEndTime).diff(moment(totalPlanBeginTime), 'd');
        var currentEnd = moment(planEndTime).diff(moment(totalPlanEndTime), 'd');
        if (currentStart < 0) {
            planDays.val('');
            $(this).val('');
            return alert('计划完成时间必须大于等于开工开始时间');
        }
        if (currentEnd > 0) {
            planDays.val('');
            $(this).val('');
            return alert('计划完成时间必须小于完工结束时间');
        }
        if (!planEndTime) {
            planDays.val('');
            return false;
        }
        if (!planBeginTime) {
            planDays.val('');
            return false;
        }
        planEndTime = moment(planEndTime).set('hour', 24).set('minute', 0).set('second', 0);
        planBeginTime = moment(planBeginTime).set('hour', 0).set('minute', 0).set('second', 0);
        var day = moment(planEndTime).diff(moment(planBeginTime), 'd');
        if (day <= 0) {
            $(this).val('');
            planDays.val('');
            return alert('开始日期必须小于结束日期');
        }
        planDays.val(day);
        getTotalCount(modal);
    });
    modal.$body.find('[name=workerCount]').keyup(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var dian = /^\d+?$/;
        if (!dian.test(value)) {
            $(this).val('');
        }
        getTotalCount(modal);
    });
};

/**
 * 总工时计算
 * @param modal
 * @returns {number}
 */
function getTotalCount(modal) {
    var total = 0;
    var trs = modal.$body.find('tbody tr');
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        var planDays = tr.find('[name=planDays]').val();
        var workerCount = tr.find('[name=workerCount]').val();
        if (!planDays || !workerCount) {
            continue;
        }
        if (!isNaN(planDays) && !isNaN(workerCount)) {
            total += parseInt(planDays) * parseInt(workerCount);
        }
    }
    modal.$body.find('[name=planWorkDays]').val(total);
}


exports.initAddSchedule = function () {
    var addSchedule = $('.addSchedule');
    if (addSchedule.length > 0 && !addSchedule.data('flag')) {
        addSchedule.data('flag', true);
        var that = this;
        addSchedule.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal(null, scheduleEditModal());
            modal.$header.hide();
            modal.$body.find('.project-title').text('进度添加');
            modal.$body.find(".icon-close").click(function (e) {
                common.stopPropagation(e);
                modal.hide();
            });
            modal.show();
            $("#editSchedule").data('pid', '');
            initEditScheduleClick(modal, that);
            initEditAddEmployeeScheduleDom(modal, that);
        });

    }
};

exports.initSelectSchedule = function (item) {
    var remind = Modal('提示', remindModal());
    remind.showClose();
    remind.show();
    remind.$body.find('.remindContent').text('与该进度计划相关的数据将会被删除,确定删除么?');
    remind.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        projectScheduleManagerFunc.delScheduleFunc(item.id, remind);
    })
};
/**
 * 添加组织机构的人员
 */
exports.addEmployeeTable = function (user, $that) {
    var addOrgEmployee = Modal('选择人员', addOrgEmployeeModal());
    addOrgEmployee.showClose();
    addOrgEmployee.show();
    organizationApi.getOrganizeStrucEmployee().then(function (res) {
        var list = res.data ? res.data : [];
        renderAddEmployeeModalTable(list, addOrgEmployee, user);
    });
    addOrgEmployee.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var checked = addOrgEmployee.$body.find('input[type=checkbox]:checked');
        if (checked.length === 0) {
            return alert('请选择人员');
        }
        if (checked.length > 1) {
            return alert('只能选择一个人员');
        }
        var item = checked.parents('tr').data('item');
        $($that).text(item.userName);
        $($that).data('user', item);
        addOrgEmployee.hide();
    })
};

function renderAddEmployeeModalTable(list, modal, user) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var projPosName = item.projPosName || '无';
        var dom = $('<tr class="small">\
      <td class="border"><input type="checkbox"></td>\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.userName + '</td>\
      <td class="border">' + projPosName + '</td>\
      </tr>');
        dom.data('item', item);
        if (user && item.userNo === user.userNo) {
            dom.find('input').prop('checked', true);
        }
        dom.appendTo(parents);
    }
    renderAddEmployeeModalTableEvent(parents)
}

function renderAddEmployeeModalTableEvent(parents) {
    parents.find('[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        parents.find('[type=checkbox]').prop('checked', false)
        $(this).prop('checked', true)
    })
}

