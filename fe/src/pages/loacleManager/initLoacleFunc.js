var localleApi = require('./loacleApi');
var renderLocaleManagerTable = require('./renderLoacleManagerTable');


exports.initGetProjectList = function (data, page) {
    var that = this;
    localleApi.getProjectList(data).then(function (res) {
        //var list = res.data ? res.data.data : [];
        var data = res.data ? res.data : '';
        // var list = data ? data.data : [];
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var preState = $('.preState').val();
            var keyword = $('.keyword').val().trim();
            _data.projState = preState;
            if (keyword) {
                _data.keywords = keyword;
            }
            that.initGetProjectList(_data, page);
        });
        renderLocaleManagerTable.renderAttentionProjectTable(list);
    })
};
/**
 * 取消关注
 * @param id
 */
exports.initDelProjectAttention = function (id) {
    localleApi.delAttentionProject(id).then(function (res) {
        if (res.code === 1) {
            $('.btn').click();
        }
    })
};
/**
 * 关注项目
 * @param id
 */
exports.initGetAttentionProject = function (id) {
    localleApi.getAttentionProject(id).then(function (res) {
        if (res.code === 1) {
            $('.btn').click();
        }
    })
};

exports.initGetSceneList = function (data, nav, page) {
    var that = this;
    localleApi.getSceneList(data).then(function (res) {
        var type = '';
        if (data.noticeType === 3) {
            type = 'manager'
        } else if (data.noticeType === 4) {
            type = 'schedule';
        } else if (data.noticeType === 0) {
            type = 'all';
        }
        var $data = res.data ? res.data : '';
        var list = $data ? $data.data : [];
        var pageSize = $data ? $data.pageSize : 10;
        var pageNo = $data ? $data.pageNo : 1;
        var total = $data ? $data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var keyword = $('.keyword').val().trim();
            var noticeType = $('.no-padding li.active').data('type');
            if($('.no-padding li.active').length === 0){
                noticeType = 0;
            }
            var timeType = $('.allReportBtn').find('.item.active').data('id');
            _data.noticeType = noticeType;
            _data.timeType = timeType;
            if (keyword) {
                _data.keywords = keyword;
            }
            that.initGetSceneList(_data, nav, page);
        });
        renderLocaleManagerTable.renderLocaleManagerTable(list, type, nav);
    })
};

exports.initGetSceneListDetailFunc = function () {
    var type = $('#locale-detail').data('type');
    var data = {};
    if (type === 'manager') {
        data.noticeType = 3;
    } else if (type === 'schedule') {
        data.noticeType = 4;
    } else if (type === 'all') {
        data.noticeType = 0;
    }
    data.timeType = $('#locale-detail').data('time');
    localleApi.getSceneList(data).then(function (res) {
        renderLocaleManagerTable.renderLocaleManagerDetail(res);
    });
};

exports.delSceneCancelFunc = function (id) {
    localleApi.delSceneCancel(id).then(function (res) {
        if (res.code === 1) {
            var callback = $('#callback');
            var time = callback.data('time');
            var type = callback.data('type');
            if (type === 'all') {
                type = '';
            }
            window.location.href = '/locale/' + type + '?time=' + time;
        }
    })
}