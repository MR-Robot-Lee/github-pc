var projectScheduleApi = require('./projectScheduleApi');
var projectScheduleRenderTable = require('./projectScheduleRenderTable');
var initEvent = require('./initEvent');
var Select = require('../../../components/Select');
var projectInitEvent = require('../initEvent');

/**
 * 获取计划进度
 */
exports.initScheduleList = function initScheduleList(id) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    var that = this;
    projectScheduleApi.getScheduleList(null, function (res) {
        var editSchedule = $("#editSchedule");
        var scheduleShow = $('#scheduleShow');
        var scheduleHide = $('#scheduleHide');
        if (res.code === 1) {
            /**
             * 获取计划步聚进度
             */
            var list = res.data ? res.data.data : [];
            if (id) {
                for (var i = 0, length = list.length; i < length; i++) {
                    if (list[i].id === id) {
                        editSchedule.data('pid', list[i]);
                        break;
                    }
                }
            } else {
                editSchedule.data('pid', list[0]);
            }
            var parents = $("#scheduleManager").html('');
            if (list.length === 0) {
                return;
            }
            var pid = editSchedule.data('pid');
            projectScheduleRenderTable.renderScheduleSpan($('.page-schedule'), pid);
            that.getScheduleStepListFunc(pid.id, parents);
            var selectSchedule = $('#selectSchedule');
            if (selectSchedule.length > 0) {
                new Select($('#selectSchedule'), list, false, 'id', 'schedName', function (data) {
                    initEvent.initSelectSchedule(data);
                    editSchedule.data('pid', '');
                }, function (data) {
                    editSchedule.data('pid', data);
                    parents = $("#scheduleManager").html('');
                    projectScheduleRenderTable.renderScheduleSpan($('.page-schedule'), data);
                    that.getScheduleStepListFunc(data.id, parents);
                }, pid.id);
            }
            scheduleShow.show();
            scheduleHide.hide();
        } else if (res.code === 7) {
            scheduleShow.hide();
            scheduleHide.show();
        } else {
            editSchedule.data('pid', "");
        }
    });
};

/**
 * 提交审批
 * @param data
 * @param approvalModal
 */
exports.postApprovalScheduleFunc = function (data, approvalModal) {
    projectScheduleApi.postApprovalSchedule(data).then(function (res) {
        if (res.code === 1) {
            approvalModal.hide();
        }
    })
};
/**
 * 中止进度
 * @param data
 * @param modal
 */
exports.postStopScheduleFunc = function (data, modal) {
    projectScheduleApi.postStopSchedule(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
        }
    })
};
/**
 * 通过id删除进度
 * @param planId
 * @param modal
 */
exports.delScheduleFunc = function (planId, modal) {
    var that = this;
    projectScheduleApi.delSchedule(planId).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.initScheduleList();
        }
    })
};
/**
 * 获取所有计划下的步聚
 * @param planId
 * @param parents
 */
exports.getScheduleStepListFunc = function (planId, parents) {
    projectScheduleApi.getScheduleStepList({planId: planId}).then(function (res) {
        var list = res.data ? res.data.data : [];
        projectScheduleRenderTable.renderScheduleTable(parents, list);
    });
};

/**
 * 获取历史记录
 * @param data
 * @param modal
 * @param page
 */
exports.getScheduleHistoryFunc = function (data, modal, page) {
    var that = this;
    projectScheduleApi.getScheduleHistory(data).then(function (res) {
        var _data = res.data ? res.data : '';
        var list = _data ? _data.data : [];
        var pageSize = _data ? _data.pageSize : 10;
        var pageNo = _data ? _data.pageNo : 1;
        var total = _data ? _data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (__data) {
            __data.planId = data.planId;
            __data.stepId = data.stepId;
            that.getScheduleHistoryFunc(__data, modal, page);
        });
        projectScheduleRenderTable.renderScheduleHistoryTable(list, modal);
    })
};