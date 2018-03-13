var projectMainApi = require('./projectMainApi');
var projectMainRender = require('./projectMainRender');
var initEvent = require('./initEvent');

var mainPage = {};

mainPage.getNotice = function (data) {
    /**
     * 内部通知 和 临时任务
     */
    projectMainApi.getProjectMain({noticeType: 5, pageSize: 5}, function (res) {
        var list = res.data ? res.data.data : [];
        projectMainRender.renderProjectMain(list);
    });
    /**
     * 质量进度管理
     */
    projectMainApi.getProjectMain({noticeType: 4, pageSize: 3}, function (res) {
        var list = res.data ? res.data.data : [];
        projectMainRender.renderQualityDom(list);
    });
    /**
     * 安全文明管理
     */
    projectMainApi.getProjectMain({noticeType: 3, pageSize: 3}, function (res) {
        var list = res.data ? res.data.data : [];
        projectMainRender.renderSafeDom(list);
    });
    /**
     * 获取系统设置
     */
    projectMainApi.getSystemLogInfo().then(function (res) {
        var list = res.data ? res.data : [];
        projectMainRender.renderSystemSettingDom(list);
    });
    /**
     * 获取日志区间
     */
    this.getLogQj();
};
/**
 * 获取日志区间
 */
mainPage.getLogQj = function () {
    var start = $('#weeks').find(".day:first").data("time");
    var end = $('#weeks').find(".days:last-child").find(".day:last").data("time");
    projectMainApi.getBlogInterval(start, end, function (res) {
        res.data = res.data ? res.data : [];
        projectMainRender.renderWeekBindId(res.data);
        initEvent._initBuilderDiary();
    })
};
/**
 * 是否有权限修改
 */
mainPage.getBlogAuthFunc = function () {
    projectMainApi.getBlogAuth().then(function (res) {
    })
}
/**
 * 获取质量跟安全文明列表
 */
mainPage.getSafeAndQulity = function getSafeAndQulity() {
    var type = '';
    if ($("#safeName").text() === "质量进度管理") {
        type = 4;
    } else if ($("#safeName").text() === "安全文明管理") {
        type = 3;
    } else if ($("#safeName").text() === "内部通知") {
        type = 1;
    } else if ($("#safeName").text() === "临时任务") {
        type = 2;
    }
    projectMainApi.getProjectMain({noticeType: type}, function (res) {
        projectMainRender.renderSafeAndQualityTable(res);
    })
};
/**
 * 获取系统信息
 */
mainPage.getSystemInfo = function getSystemInfo() {
    projectMainApi.getSystemLogInfo().then(function (res) {
        projectMainRender.renderSystemSettingTableDom(res)
    });
};
/**
 * 获取分部信息
 */
mainPage.getSubProjectList = function getSubProjectList() {
    projectMainApi.getSubProject(function (res) {
        projectMainRender.renderSubProjectDom(res.data.data);
    })
};

mainPage.getProjectMainFunc = function getProjectMainFunc(data, modal) {
    projectMainApi.getProjectMain(data, function (res) {
        projectMainRender.renderProjectMainList(res, modal, data);
    })
};

mainPage.getSystemSettingFunc = function () {
    projectMainApi.getSystemSetting().then(function (res) {
        var obj = res.data || {};
        projectMainRender.renderProjectSystemSetting(obj);
    });
};

mainPage.renderCompetenceMainSetting = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var projectGet = user.permission['projMain:*'];
    if (projectGet) {
        $('#systemSettingBtn').show();
    } else {
        $('#systemSettingBtn').hide();
    }
};
/*删除主页中任务、通知等*/
mainPage.delProjectMainFunc = function (id) {
    projectMainApi.delProjectMain(id, function (res) {
        mainPage.getSafeAndQulity();
    });
}
module.exports = mainPage;