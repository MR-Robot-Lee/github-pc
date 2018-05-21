var common = require('../Common');
var initLocaleFunc = require('./initLoacleFunc');

exports.initSceneProjectTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var id = $(this).parents('tr').data('id');
        if (type === 'attention') {
            initLocaleFunc.initDelProjectAttention(id);
        } else {
            initLocaleFunc.initGetAttentionProject(id);
        }
    })
};

exports.initSceneProjectEvent = function (page) {
    var btn = $('#employeeSearch');
    if (btn.length > 0 && !btn.data('flag')) {
        btn.data('flag', true);
        btn.click(function (e) {
            common.stopPropagation(e);
            var preState = $('.preState').val();
            var keyword = $('.keyword').val().trim();
            var data = {};
            data.projState = preState;
            if (keyword) {
                data.keywords = keyword;
            }
            data.pageNo = 1;
            initLocaleFunc.initGetProjectList(data, page);
        });
    }
};

exports.initLocaleManagerEvent = function (page) {
    var btn = $('#employeeSearch');
    if (btn.length > 0 && !btn.data('flag')) {
        btn.data('flag', true);
        btn.click(function (e) {
            common.stopPropagation(e);
            var keyword = $('.keyword').val().trim();
            var noticeTitle = $('.noticeTitle').val();
            var noticeType = $('.no-padding li.active').data('type');
            var timeType = $('.allReportBtn').find('.item.active').data('id');
            var data = {};
            data.noticeType = noticeType || 0;
            data.timeType = timeType;
            if (keyword) {
                data.keywords = keyword;
            }
            if (noticeTitle) {
                data.noticeTitle = noticeTitle;
            }
            data.pageNo = 1;
            var nav = '';
            if (noticeType === 4) {
                nav = 'locale-schedule';
            } else if (noticeType === 3) {
                nav = 'locale-manager';
            } else if (noticeType === 0) {
                nav = 'locale-all';
            }
            initLocaleFunc.initGetSceneList(data, nav, page);
        });
        $('.allReportBtn').find('.item').click(function (e) {
            common.stopPropagation(e);
            $('.allReportBtn').find('.item').removeClass('active');
            $(this).addClass('active');
            var keyword = $('.keyword').val().trim();
            // LEE: 现场-现场管理-全部/今日/本周/本月进行现场管理报告的筛选
            // var noticeType = $('.no-padding li.active').data('type');
            var noticeType = $('.no-padding li.active').data('type') || 0;
            var data = {};
            data.noticeType = noticeType;
            data.timeType = $(this).data('id');
            if (keyword) {
                data.keywords = keyword;
            }
            data.pageNo = 1
            var nav = '';
            if (noticeType === 4) {
                nav = 'locale-schedule';
            } else if (noticeType === 3) {
                nav = 'locale-manager';
            } else if (noticeType === 0) {
                nav = 'locale-all';
            }
            initLocaleFunc.initGetSceneList(data, nav, page);
        })
    }
};
exports.initLocaleManagerTableEvent = function (parents) {
    parents.find('.locale-item').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        var type = $(this).data('type');
        var timeType = $('.allReportBtn .item.active').data('id');
        $("#noInfoLocaleManager").hide();
        window.location.href = '/locale/manager/detail?id=' + item.id + "&type=" + item.type + "&time=" + timeType + '&nav=' + type;
    });
};

exports.initLocaleManagerDetailEvent = function () {
    var callback = $('#callback');
    if (callback.length > 0 && !callback.data('flag')) {
        callback.data('flag', true);
        callback.click(function (e) {
            common.stopPropagation(e);
            var time = callback.data('time');
            var type = callback.data('type');
            if (type === 'all') {
                type = '';
            }
            window.location.href = '/locale/' + type + '?time=' + time;
        });
        var user = window.localStorage.getItem('user');
        user = user ? JSON.parse(user) : {permission: {}};
        var scene = user.permission['scene:*'];
        var cancel = $('#cancel');
        if (scene) {
            cancel.show();
            cancel.click(function (e) {
                common.stopPropagation(e);
                var id = $('#locale-detail').data('id');
                initLocaleFunc.delSceneCancelFunc(id);
            });
        } else {
            cancel.hide();
        }
    }
};

