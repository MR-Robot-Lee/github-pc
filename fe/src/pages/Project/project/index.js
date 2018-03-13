var initEvent = require('./initEvent');
var initProjectFunc = require('./initProjectFunc');
var Page = require('../../../components/Page');
exports.allProjectList = function () {
    var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10 // 默认每页显示多少条
    });
    initEvent.initAllProjectEvent(page);
    initProjectFunc.getProjectTypeFunc();
    initProjectFunc.getAllProjectFunc(null, page);
    page.change(function (data) {
        initProjectFunc.getAllProjectFunc(data, page);
    })
};

exports.attentionProject = function () {
    var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10 // 默认每页显示多少条
    });
    initEvent.initAttentionProjectEvent(page);
    initProjectFunc.getProjectTypeFunc();
    initProjectFunc.getAllProjectFunc({type: 3}, page);
    page.change(function (data) {
        data.type = data.type || 3;
        initProjectFunc.getAllProjectFunc(data, page);
    })
};

exports.myAttentionProject = function (data) {
    var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10 // 默认每页显示多少条
    });
    initProjectFunc.getAttentionProjectFunc(data, page);
    page.change(function (data) {
        initProjectFunc.getAttentionProjectFunc(data, page);
    })
};

exports.intelligentHardware = function (data) {
    var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10 // 默认每页显示多少条
    });
    initEvent.initEventIntelligentHardware(page);
    initProjectFunc.getIntelligentHardwareFunc(data,page);
    page.change(function (data) {
        initProjectFunc.getIntelligentHardwareFunc(data, page);
    })
}

// 智能硬件
exports.renderCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var projectGet = user.permission['project:get'];
    var machine = user.permission['machine:*'];
    if (projectGet) {
        $('#allNavProject').show();
    } else {
        $('#allNavProject').hide();
    }
    if (machine) {
        $('#addAtdMachine').show();
    } else {
        $('#addAtdMachine').hide();
    }
}