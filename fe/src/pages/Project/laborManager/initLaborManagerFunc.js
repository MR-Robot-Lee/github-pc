var laborManagerApi = require('./laborManagerApi');
var renderLaborManagerTable = require('./renderLaborManagerTable');
var renderLaborDom = require('./renderLaborDom');

/*
* 考勤管理 本地设备
* */
exports.getLocalDevicesFunc = function () {
    laborManagerApi.getLocalMachineList().then(function (res) {
        var list = res.data || [];
        renderLaborManagerTable.renderLocalDevicesTable(list);
    });
}
/*
* 考勤管理 考勤设置
* */
exports.getAtdSettingFunc = function () {
    laborManagerApi.getKaoqinSet().then(function (res) {
        var data = res.data || {};
        renderLaborManagerTable.renderAtdSetting(data);
    })
}
/*
* 考勤管理 同步供应商
* */
exports.getSyncSupplierFunc = function () {
    laborManagerApi.getSynchroEntpList().then(function (res) {
        var list = res.data || [];
        renderLaborManagerTable.renderSyncSupplierTable(list);
    });
}
/*
* 人员管理
* */
exports.getEmployeeManagerFunc = function (data, page) {
    var that = this;
    laborManagerApi.getWorkerInfoList(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var entpId = $('.entpSelect').val();
            var teamId = $('.teamSelect').val();
            var keywords = $('.keywords').val().trim();
            _data.entpId = entpId;
            _data.teamId = teamId;
            if (keywords) {
                _data.keywords = keywords;
            } else {
                delete _data.keywords;
            }
            that.getEmployeeManagerFunc(_data, page);
        });
        renderLaborManagerTable.renderEmployeeManagerTable(list);
    })
};
/*
* 人员管理 查询
* */
exports.getEmployeeManagerCheckFunc = function () {
    laborManagerApi.getEntpList().then(function (res) {
        if (res.code === 1) {
            var list = res.data || [];
            renderLaborManagerTable.allEntpList(list);
        }
    });

}

/*
* 人员管理 某工人出勤记录
* */
exports.getWokererKaoqinAttendFunc = function (modal, data) {
    data = data || {};
    data.pageNo = 1;
    data.pageSize = 100000;
    data.workerNo = modal.$body.data('item').workerNo;
    laborManagerApi.getWokererKaoqinAttend(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderLaborManagerTable.renderCheckRecordTable(list);
    })
}

/*
* 人员管理 个人信息
* */
exports.getWorkerInfoFunc = function (item) {
    renderLaborManagerTable.renderWorkerInfoTable(item);
}

/*
* 本地设备 查看
* @param {Obj} modal 查看弹出框
* @param {Number} machineId 考勤机设备ID
* */
exports.getLocMacFunc = function (modal, machineId) {
    var data = {};
    data.machineId = machineId;
    laborManagerApi.getKaoqinStaff(data).then(function (res) {
        var list = res.data || [];
        renderLaborManagerTable.renderLocMacTable(modal, list);
    })
}

/*
* 人力动态 人力动态图表
* */
exports.getLaborStatusChartFunc = function () {
    var data = {};
    data.timeType = $('.timeType').val();
    laborManagerApi.getKaoqinStatis(data).then(function (res) {
        var _data = res.data || {};
        if(_data.statisStartTime){
            var startTime = moment(_data.statisStartTime).format('YYYY/MM/DD')
            var nowTime = moment(new Date()).format('YYYY/MM/DD')
            $('.check-date').html(startTime + ' ~ ' + nowTime);
            var timer = setTimeout(function(){
                $('#structureSearch').click();
            },300);
        }
        renderLaborDom.initLaborStatusMap(_data);
    })
}

/*
* 人力动态 人力动态表格
* */
exports.getLaborStatusTableFunc = function (data) {
    var data = data || {};
    laborManagerApi.getKaoqinTeamStatis(data).then(function (res) {
        var list = res.data || [];
        renderLaborManagerTable.renderLaborStatusTable(list, data);
    })
}

/*
* 人力动态 人力结构图表
* */
exports.getLaborStructureChartFunc = function (current) {
    var data = {};
    if (current) {
        var arr = current.split(' ~ ');
        data.startTime = $.timeStampDate(arr[0]) * 1000;
        var endTime = $.timeStampDate(arr[1]) * 1000;
        data.endTime = endTime + 60 * 60 * 24 * 1000;
    } else {
        var now = parseInt(Date.parse(new Date()) / 1000);
        now = $.timeStampDate(now, 'YYYY-MM-DD');
        data.startTime = $.timeStampDate(now) * 1000;
        data.endTime = data.startTime + 60 * 60 * 24 * 1000;
    }
    laborManagerApi.getKaoqinTeamStatis(data).then(function (res) {
        var _data = res.data || {};
        var total = 0;
        if (current) {
            $('.labor-structure-table .current-time').html(current);
        }
        for (var i = 0; i < _data.length; i++) {
            var item = _data[i];
            total += item.attendCount;
        }
        $('.labor-structure-table').find('.total-count').html(total);
        renderLaborDom.initLaborStructureMap(_data);
    })
}

/*
* 人力动态 人力结构表格
* */
exports.getLaborStructureTableFunc = function (_data, list) {
    renderLaborManagerTable.renderLaborStructureTable(_data, list);
}

/*
* 获取今日考勤信息
* */
exports.getTodayKaoqinInfoFunc = function () {
    laborManagerApi.getTodayKaoqinInfo().then(function (res) {
        var data = res.data || {};
        var attendCount = data.attendCount || 0;
        var requireCount = data.requireCount || 0;
        $('[name="attendCount"]').html(attendCount);
        $('[name="requireCount"]').html(requireCount);
    });
}