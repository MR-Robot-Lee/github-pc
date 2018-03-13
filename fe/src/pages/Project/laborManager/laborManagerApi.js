var request = require('../../../helper/request');

/**
 * 考勤管理 添加/修改考勤设置
 */
exports.getAddKaoqinSet = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.post('/customer/kaoqin/addKaoqinSet', {body: data});
};

/**
 * 考勤管理 查看考勤设置
 */
exports.getKaoqinSet = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getKaoqinSet', {qs: data});
};
/**
 * 考勤管理 查看考勤人员
 */
exports.getKaoqinStaff = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getKaoqinStaff', {qs: data});
};
/**
 * 考勤管理 查询本地设备列表
 */
exports.getLocalMachineList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getLocalMachineList', {qs: data});
};
/**
 * 考勤管理 查看同步供应商列表
 */
exports.getSynchroEntpList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getSynchroEntpList', {qs: data});
};
/**
 * 人员管理 查询供应商列表
 */
exports.getEntpList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getEntpList', {qs: data});
};
/*
*  人员管理 查询所有班组
* */
exports.getAllEntpTeams = function getAllEntpTeams(data) {
    data = data || {};
    return request.get('/customer/machine/getAllEntpTeams', {qs: data});
}
/**
 * 人员管理 条件查询工人信息
 */
exports.getWorkerInfoList = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getWokerInfoList', {qs: data});
};
/**
 * 人员管理 查询某一工人的考勤记录
 */
exports.getWokererKaoqinAttend = function (data) {
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getWokererKaoqinAttend', {qs: data});
};

/*
* 人力动态表格
* */
exports.getKaoqinStatis = function(data){
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getKaoqinStatis', {qs: data});
}
exports.getKaoqinTeamStatis = function(data){
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getKaoqinTeamStatis', {qs: data});
}
//

/*
* 获取今日考勤信息
* */
exports.getTodayKaoqinInfo = function(data){
    data = data || {};
    data.projId = $('#projectSchedule').data('id');
    return request.get('/customer/kaoqin/getTodayKaoqinInfo', {qs: data});
}