var projectApi = require('./projectApi');
var renderProjectTable = require('./renderProjectTable');

exports.getProjectTypeFunc = function () {
    projectApi.getProjectType().then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = $('#preTypeMain').html('');
        renderProjectTable.renderProjectType(parents, list);
    })
};

exports.getAllProjectFunc = function (data, page) {
    var that = this;
    projectApi.getAllProject(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        if (res.code === 1) {
            page.update({pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total});
        }
        renderProjectTable.renderProjectTable(list, data, page);
    });
    page.change(function ($data) {
        that.getAllProjectFunc($data, page);
    })
};
exports.delAttentionProjectFunc = function (item, page) {
    var that = this;
    projectApi.delAttentionProject(item.id).then(function (res) {
        if (res.code === 1) {
            that.getAllProjectFunc({type: item.type}, page);
            window.location.reload();
        }
    })
};

exports.postAttentionProjectFunc = function (item, page) {
    var that = this;
    projectApi.postAttentionProject(item.id).then(function (res) {
        if (res.code === 1) {
            that.getAllProjectFunc({type: item.type}, page);
        }
    })
};
exports.getAttentionProjectFunc = function (data, page) {
    projectApi.getAttentionProject(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 1;
        var pageSize = res.data ? res.data.pageSize : 10;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        renderProjectTable.renderMyAttentionSchedule(list, page)
    })
};
/*
* 智能硬件
* */
exports.getIntelligentHardwareFunc = _getIntelligentHardwareFunc;

function _getIntelligentHardwareFunc(data, page) {
    projectApi.getMachineList(data).then(function (res) {
        var list = res.data ? res.data : [];
        var pageNo = res.data ? res.data.pageNo : 1;
        var pageSize = res.data ? res.data.pageSize : 10;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        renderProjectTable.renderIntelligentHardwareTable(list, page)
    })
}

/*
* 新添考勤机
* */
exports.postAtdMachineFunc = function (modal, data, page) {
    projectApi.postAtdMachine(data).then(function (res) {
        if (res.code === 1) {
            var _data = {};
            modal.$body.find('.span-btn-bc').click();
            _getIntelligentHardwareFunc(_data, page);
        }
    })
}
/*
* 删除考勤机
* */
exports.delAtdMachineFunc = function (modal, data, page) {
    projectApi.delAtdMachine(data).then(function (res) {
        var _data = {};
        modal.$body.find('.span-btn-bc').click();
        _getIntelligentHardwareFunc(_data, page);
    })
}
/*
* 考勤人员 查看
* */
exports.getAtdGroupFunc = function (modal, machineId) {
    var data = {};
    data.machineId = machineId;
    projectApi.getMachineTeamList(data).then(function (res) {
        var list = res.data ? res.data : [];
        if (res.code === 1) {
            renderProjectTable.renderAtdGroupModal(list, modal);
        }
    })
}
/*
* 设备信息
* */
exports.getAtdMachineInfoFunc = function (modal, machineId) {
    var data = {};
    data.id = machineId;
    projectApi.getMachineInfo(data).then(function (res) {
        var _data = res.data ? res.data : [];
        if (res.code === 1) {
            renderProjectTable.renderMachineInfoModal(_data, modal);
        }
    });
}
/*
* 查询所有工程
* */
exports.getProjectListFunc = function (modal, item) {
    var data = {};
    projectApi.getProjectList(data).then(function (res) {
        var _data = res.data ? res.data : [];
        if (res.code === 1) {
            renderProjectTable.renderAtdLocationModal(_data, modal, item);
        }
    });
}
/*
* 查询所有班组
* @param {obj} modal 选择班组 弹出框
* @param {obj} _modal 考勤机设置 弹出框
* */
exports.getAllEntpTeamsFunc = function (modal, _modal, list) {
    var data = {};
    projectApi.getAllEntpTeams(data).then(function (res) {
        var _data = res.data ? res.data : [];
        if (res.code === 1) {
            renderProjectTable.renderAllEntpTeamsModal(_data, modal, _modal, list);
        }
    });
}
/*
* 考勤机设置
* */
exports.getAtdMachineSettingFunc = function(data, modal, page){
    projectApi.getAtdMachineSetting(data).then(function(res){
        if (res.code === 1) {
            var _data = {};
            modal.$body.find('.span-btn-bc').click();
            _getIntelligentHardwareFunc(_data, page);
        }
    })
}
/*
* 查看考勤班组
* */
exports.getMachineTeamListFunc = function (data, modal) {
    projectApi.getMachineTeamList(data).then(function (res) {
        var _data = res.data ? res.data : [];
        renderProjectTable.renderMachineTeamListModal(_data, modal);
    });
}