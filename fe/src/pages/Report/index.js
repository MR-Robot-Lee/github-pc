var getAllReport = require('./reportAll');
var getReportType = require('./sectionType');
var getUnReport = require('./unReport');
var getReport = require('./reported');
var addUpdateReport = require('./addReport');
var Model = require('../../components/Model');
var getDetailReport = require('./reportDetail');
var reviewReport = require('./reviewReport');
var addReport = require('./modals/pushReport.ejs');
var Page = require('../../components/Page')

function renderComp() {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var add = user.permission['buildNews:add'];
    if (add) {
        $('#addNavReport').show();
    } else {
        $('#addNavReport').hide();
    }
    var type = user.permission['buildNews:type:*'];
    if (type) {
        $('#reportType').show();
    } else {
        $('#reportType').hide();
    }
    var revocation = user.permission['buildNews:*'];
    if (revocation) {
        $('#revocation').show();
    } else {
        $('#revocation').hide();
    }
}

module.exports = {
    ready: function (type) {
        renderComp();
        var addModel = Model("", addReport());
        var page = new Page($("#page"), {
            pageSize: [10, 20, 30], // 设置每页显示条数按钮
            size: 10, // 默认每页显示多少条
        })
        if (type === "report") {
            getAllReport(page);
        } else if (type === "section") {
            getReportType(page);
        } else if (type === "unexecuted") {
            getUnReport(addModel,page);
        } else if (type === "already") {
            getReport(page);
        } else if (type === "add") {
            addUpdateReport();
        } else if (type === "detail") {
            getDetailReport();
        } else if (type === 'review') {
            reviewReport();
        }
    }
};