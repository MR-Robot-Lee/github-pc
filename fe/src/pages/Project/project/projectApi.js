var request = require('../../../helper/request');

/**
 * 获取所有项目
 * @param data
 */
exports.getAllProject = function getAllProject(data) {
    data = data || {};
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    data.type = data.type || 1;
    return request.get('/customer/project/main/' + data.type, {qs: data})
};

/**
 * 获取我关注的项目
 * @param data
 * @returns {Request}
 */
exports.getAttentionProject = function (data) {
    data = data || {};
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    data.type = 3;
    return request.get('/customer/project/main/focus', {qs: data});
};
/**
 * 通过id删除项目
 * @param id
 * @param callback
 */
exports.delFindByProjectId = function delFindByProjectId(id, callback) {
    request.del(id).then(function (res) {
        if (callback) {
            callback(res);
        }
    })
};
/**
 * 关注项目
 * @param id
 * @returns {Request}
 */
exports.postAttentionProject = function (id) {
    return request.get('/customer/project/main/addFocus/' + id);
};
/**
 * 取消关注
 * @param id
 */
exports.delAttentionProject = function (id) {
    return request.del('/customer/project/main/delFocus/' + id);
};
/**
 * 获取工程类型
 */
exports.getProjectType = function getProjectType() {
    return request.get('/customer/project/type');
};


/*
* 添加考勤机
* */
exports.postAtdMachine = function postAtdMachine(data) {
    data = data || {};
    return request.post('/customer/machine/addMachine', {body: data});
};
/*
* 删除考勤机
* */
exports.delAtdMachine = function delAtdMachine(data) {
    data = data || {};
    return request.del('/customer/machine/delMachine?id=' + data.id);
};
/*
* 查询考勤机列表
* */
exports.getMachineList = function getMachineList(data) {
    data = data || {};
    data.pageNo = data.pageNo || 1;
    data.pageSize = data.pageSize || 10;
    return request.get('/customer/machine/getMachineList', {qs: data});
};
/*
* 查询设备信息
* */
exports.getMachineInfo = function getMachineInfo(data) {
    data = data || {};
    return request.get('/customer/machine/getMachineInfo', {qs: data});
}
/*
* 查看考勤班组
* */
exports.getMachineTeamList = function getMachineTeamList(data) {
    data = data || {};
    return request.get('/customer/machine/getMachineTeamList', {qs: data});
}
/*
* 查询所有班组
* */
exports.getAllEntpTeams = function getAllEntpTeams(data) {
    data = data || {};
    return request.get('/customer/machine/getAllEntpTeams', {body: data});
}
/*
* 查询所有工程
* */
exports.getProjectList = function getProjectList(data) {
    data = data || {};
    return request.get('/customer/machine/getProjectList', {body: data});
}
/*
* 考勤机设置
* */
exports.getAtdMachineSetting = function getAtdMachineSetting(data) {
    data = data || {};
    return request.put('/customer/machine/updMachine', {body: data});
}