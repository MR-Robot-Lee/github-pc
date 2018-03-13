var approvalApi = require('./approvalApi');
var renderApprovalManagerTable = require('./renderApprovalManagerTable');

exports.getMyApplyListFunc = function (data, page) {
    var that = this;
    approvalApi.getMyApplyList(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            if (tmplType !== 'a') {
                _data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                _data.projId = projId;
            }
            if (apprStatus !== 0) {
                _data.apprStatus = apprStatus;
            }
            that.getMyApplyListFunc(_data, page);
        });
        renderApprovalManagerTable.renderMyApplyTable(list);
    })
};


/**
 * 添加流程类型
 * @param data
 * @param modal
 */
exports.postProcessTypeFunc = function (data, modal) {
    var that = this;
    approvalApi.postApprovalTempType(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getProcessTypeListFunc();
        }
    })
};
/**
 * 获取流程控制列表
 */
exports.getProcessTypeListFunc = function () {
    approvalApi.getApprovalTempType().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderApprovalManagerTable.renderApprovalProcessTypeTable(list);
    })
};
/**
 * 更新流程控制
 * @param data
 * @param modal
 */
exports.putProcessTypeFunc = function (data, modal) {
    var that = this;
    approvalApi.putApprovalTempType(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getProcessTypeListFunc();
        }
    })
};
/**
 * 通过id删除流程类型
 * @param id
 * @param modal
 */
exports.delProcessTypeFunc = function (id, modal) {
    var that = this;
    approvalApi.delApprovalTempType(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getProcessTypeListFunc();
        }
    })
};

exports.getProcessTypeListSelectFunc = function (callback) {
    approvalApi.getApprovalTempType().then(function (res) {
        var list = res.data ? res.data.data : [];
        if (callback) {
            callback();
        }
        var parents = $('#processType').html('');
        renderApprovalManagerTable.renderApprovalProcessSettingSelect(list, parents);
    })
};
/**
 * 添加流程设置
 * @param data
 */
exports.postTempFunc = function (data) {
    approvalApi.postTemp(data).then(function (res) {
        if (res.code === 1) {
            window.location.href = '/approval/setting';
        }
    })
};
exports.getTempListFunc = function (data) {
    approvalApi.getTemp(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderApprovalManagerTable.renderApprovalProcessSettingTable(list);
    });
};
exports.delApprovalTempFunc = function (id, modal) {
    var that = this;
    approvalApi.delApprovalTemp(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getTempListFunc();
        }
    })
};
exports.getProjectJobListFunc = function (modal, level) {
    approvalApi.getProjectJobList().then(function (res) {
        var list = res.data ? res.data : [];
        renderApprovalManagerTable.renderProjectJobListDom(list, modal, level);
    });
};
/**
 * 修改流程设置获取数据
 */
exports.getTempFindByIdFunc = function () {
    var id = $('#processSettingAdd').data('id');
    if (id) {
        approvalApi.getTempFindById(id).then(function (res) {
            var obj = res.data ? res.data.temp : {};
            var nodes = res.data ? res.data.nodes : [];
            renderApprovalManagerTable.renderApprovalProcessSettingAddObj(obj, nodes);
        });
    }
};
/**
 * 修改流程设置
 * @param data
 */
exports.putTempFunc = function (data) {
    approvalApi.putTemp(data).then(function (res) {
        if (res.code === 1) {
            window.location.href = '/approval/setting';
        }
    })
};

exports.getProcessTypeListSearchFunc = function (parents, data) {
    approvalApi.getApprovalTempType(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var parentDom = parents ? parents.html('') : $('#typeId').html('');
        var init = parents ? true : false;
        renderApprovalManagerTable.renderApprovalProcessSettingSelect(list, parentDom, init);
    })
};
/**
 * 新建申请通过流程类型获取流程名称
 * @param data
 */
exports.getNewApplyProcessSettingFunc = function (data) {
    if (data.typeId === 'a') {
        renderApprovalManagerTable.renderNewApplyProcessSetting([]);
    } else {
        approvalApi.getTemp(data).then(function (res) {
            var list = res.data ? res.data.data : [];
            renderApprovalManagerTable.renderNewApplyProcessSetting(list);
        });
    }
};

exports.getProcessSetting = function (id) {
    var that = this;
    approvalApi.getTempFindById(id).then(function (res) {
        var obj = res.data ? res.data.temp : {};
        var nodes = res.data ? res.data.nodes : [];
        renderApprovalManagerTable.renderProcessSettingAndNewApply(obj, nodes);
        if (obj.tmplUsed === 2) {
            that.getProjectDepartmentFunc();
            $('#projectName').show();
        } else if (obj.tmplUsed !== 2) {
            $('#projectName').hide();
        }
        $('#projectName').data('item', obj);
    });
};
/**
 * 获取项目部名称
 */
exports.getProjectDepartmentFunc = function () {
    approvalApi.getProjectDepartment().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderApprovalManagerTable.renderApprovalProjectDepartmentTable(list);
    })
};

exports.postNewApplyFunc = function (data) {
    approvalApi.postNewApply(data).then(function (res) {
        if (res.code === 1) {
            window.location.href = '/approval';
        }
    })
};

exports.getProjectListFunc = function () {
    approvalApi.getProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderApprovalManagerTable.renderProjectSelect(list);
    });
};
/**
 * 我的审批
 * @param data
 * @param page
 */
exports.getMyApprovalFunc = function (data, page) {
    var that = this;
    approvalApi.getMyApproval(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            if (tmplType !== 'a') {
                _data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                _data.projId = projId;
            }
            if (apprStatus !== 0) {
                _data.apprStatus = apprStatus;
            }
            that.getMyApprovalFunc(_data, page);
        });
        renderApprovalManagerTable.renderMyApprovalTable(list, page);
    });
};

exports.getAllUserListFunc = function () {
    approvalApi.getAllUserList().then(function (res) {
        var list = res.data ? res.data : [];
        renderApprovalManagerTable.renderApplySelect(list);
    })
};
/**
 * 抄送给我
 * @param data
 */
exports.getApprovalCopyFunc = function (data, page) {
    var that = this;
    approvalApi.getApprovalCopy(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var tmplType = $('#tmplType').val();
            var projId = $('#projId').val();
            var apprStatus = $('.allReportBtn .item.active').data('id');
            if (tmplType !== 'a') {
                _data.tmplType = tmplType;
            }
            if (projId !== 'a') {
                _data.projId = projId;
            }
            if (apprStatus !== 0) {
                _data.apprStatus = apprStatus;
            }
            that.getApprovalCopyFunc(_data, page);
        });
        renderApprovalManagerTable.renderApprovalCopyTable(list);
    });
};

exports.getCheckAllApprovalListFunc = function (data, page) {
    var that = this;
    approvalApi.getCheckAllApprovalList(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var processType = $('#processType').val();
            var projId = $('#projId').val();
            var processStatus = $('#processStatus').val();
            var startTime = $('[name=startTime]').val();
            var endTime = $('[name=endTime]').val();
            var applyUserNo = $('#applyUserNo').val();
            if (processType && processType !== 'a') {
                _data.tmplType = processType
            }
            if (projId && projId !== 'a') {
                _data.projId = projId
            }
            if (startTime) {
                _data.startTime = startTime;
            }
            if (endTime) {
                _data.endTime = endTime;
            }
            if (applyUserNo && applyUserNo !== 'a') {
                _data.applyUserNo = applyUserNo;
            }
            if (processStatus && processStatus !== '0') {
                _data.apprStatus = processStatus;
            }
            that.getCheckAllApprovalListFunc(_data, page);
        });
        renderApprovalManagerTable.renderApprovalManagerTable(list, page);
    })
};
/**
 * 查看审批
 * @param data
 */
exports.getApplyContentAndProcessFunc = function (data) {
    approvalApi.getApplyContentAndProcess({id: data.id}).then(function (res) {
        var obj = res.data ? res.data : {};
        renderApprovalManagerTable.renderApplyContentAndProcess(obj);
    });
    approvalApi.getTempFindById(data.tmplId).then(function (res) {
        var obj = res.data ? res.data : {};
        renderApprovalManagerTable.renderApplyProcessDom(obj);
    });
};

exports.postApprovalFunc = function (data, modal) {
    approvalApi.postApproval(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approvalApi.getApplyContentAndProcess({id: data.applyId}).then(function (res) {
                var obj = res.data ? res.data : {};
                renderApprovalManagerTable.renderApplyContentAndProcess(obj);
            });
        }
    })
};

exports.delTempFunc = function (id, modal, page) {
    var that = this;
    approvalApi.delTemp(id).then(function (res) {
        if (res.code === 1) {
            that.getCheckAllApprovalListFunc(null, page);
            modal.hide();
        }
    })
};

exports.getApprovalManagerDetail = function () {
    var managerDetail = $('#managerDetail');
    var id = managerDetail.data('id');
    var mid = managerDetail.data('mid');
    approvalApi.getApplyContentAndProcess({id: id}).then(function (res) {
        var obj = res.data ? res.data : {};
        renderApprovalManagerTable.renderApplyContentAndProcess(obj);
    });
    approvalApi.getTempFindById(mid).then(function (res) {
        var obj = res.data ? res.data : {};
        renderApprovalManagerTable.renderApplyProcessDom(obj);
    });
};
/**
 * 获取提醒个数
 */
exports.getRemindCountFunc = function () {
    approvalApi.getRemindCount().then(function (res) {
        var obj = res.data ? res.data : {};
        renderApprovalManagerTable.renderApplyCount(obj);
        renderApprovalManagerTable.renderCompetence();
    })
};
/**
 * 流程设置查看获取数据接口
 * @param id
 */
exports.getTempFindByIdDetailFunc = function (id) {
    approvalApi.getTempFindById(id).then(function (res) {
        var obj = res.data ? res.data : {};
        renderApprovalManagerTable.renderProcessSettingCheckDetail(obj);
    })
};