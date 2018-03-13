var renderLaborDom = require('./renderLaborDom');
var initEvent = require('./initEvent');
var initLaborManagerFunc = require('./initLaborManagerFunc');
var projectInitEvent = require('../initEvent');
var Page = require('../../../components/Page')

/**
 * 人力动态
 */
exports.initLabor = function initLabor() {
    // 初始化地图
    initLaborManagerFunc.getLaborStatusChartFunc();
    initLaborManagerFunc.getLaborStructureChartFunc();
    initEvent.initLaborStatusEvent();
    initLaborManagerFunc.getTodayKaoqinInfoFunc();

};

/**
 * 考勤管理
 */
exports.initAttendance = function initAttendance() {
    initLaborManagerFunc.getLocalDevicesFunc();// 本地设备
    initLaborManagerFunc.getAtdSettingFunc();// 考勤设置
    initLaborManagerFunc.getSyncSupplierFunc();// 同步供应商
};

/**
 * 人员管理
 */
exports.initEmployee = function initEmployee() {
    var page = new Page("#page", {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
    });
    var data = {};
    data.entpId = 0;
    data.teamId = 0;
    data.pageNo = 1;
    data.pageSize = 10;
    initLaborManagerFunc.getEmployeeManagerFunc(data, page);
    initLaborManagerFunc.getEmployeeManagerCheckFunc(data, page);
    initEvent.initEmployeeManagerEvent(data, page);
};