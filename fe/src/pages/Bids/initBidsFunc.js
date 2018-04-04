var bidsApi = require('./bidsApi');
var renderBidsTable = require('./renderBidsTable');
var getAllProject = require('../Project/project/projectApi');

/*
* 获取全部招标项目
* */
exports.getAllProjectFunc = function () {
    var data = {};
    data.pageSize = 10000;
    getAllProject.getAllProject(data).then(function (res) {
        var data = res.data.data;
        var parent = $('#allProject');
        for (var i = 0; i < data.length; i++) {
            var dom = $('<option value=' + data[i].id + '>' + data[i].projectName + '</option>');
            dom.data('item', data[i]);
            dom.appendTo(parent);
        }
    });
}

/*
* 查看信息模板列表
* */
exports._getInfoModalListFunc = getInfoModalListFunc;

function getInfoModalListFunc(type, modal, old) {
    bidsApi.getInfoModalList().then(function (res) {
        if (res.code === 1) {
            var data = res.data || {};
            if (type === 'add') {//新建招标中
                renderBidsTable.renderBidsRequireTable(data, modal, old);
            } else {//设置条件中
                renderBidsTable.renderInfoListTable(data);
            }
        }
    });
}

/*
* 添加设置条件
* */
exports.postInfoModalFunc = function (data, modal) {
    bidsApi.postInfoModal(data).then(function (res) {
        if (res.code === 1) {
            modal.$body.find('.span-btn-bc').click();
            getInfoModalListFunc();
        }
    })
}

/*
* 删除某一设置条件
* */
exports.delInfoModalFunc = function (id, modal) {
    bidsApi.delInfoModal(id).then(function (res) {
        if (res.code === 1) {
            modal.$body.find('.span-btn-bc').click();
            getInfoModalListFunc();
        }
    })
}

/*
* 修改某一设置条件
* */
exports.putInfoModalFunc = function (id, data, modal) {
    bidsApi.putInfoModal(id, data).then(function (res) {
        if (res.code === 1) {
            modal.$body.find('.span-btn-bc').click();
            getInfoModalListFunc();
        }
    })
}

/*
* 新建招标
* */
exports.postBidsInfoFunc = function (data) {
    bidsApi.postBidsInfo(data).then(function (res) {
        if (res.code === 1) {
            console.log('ok');
            window.location.href = '/bids';
        }
    })
}

/*
* 查看招标列表
* */
exports.getBidsListFunc = function(data, page){
    var that = this;
    bidsApi.getBidsList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 10;
        var pageSize = res.data ? res.data.pageSize : 1;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        page.change(function (_data) {
            var bidType = $("#allProject").val();
            var projId = $("#allProject").val();
            var bidStatus = $("#allProject").val();
            var keywords = $('.bidStatus').val();
            _data.bidType = bidType;
            _data.projId = projId;
            _data.bidStatus = bidStatus;
            _data.keywords = keywords;
            that.getBidsListFunc(_data, page);
        });
        renderBidsTable.renderBidsList(list);
    })
}

/*
* 查看中标列表
* */
exports.getBidsListFunc = function(data, page){
    var that = this;
    bidsApi.getBidsList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 10;
        var pageSize = res.data ? res.data.pageSize : 1;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        page.change(function (_data) {
            var bidType = $("#allProject").val();
            var projId = $("#allProject").val();
            var bidStatus = $("#allProject").val();
            var keywords = $('.bidStatus').val();
            _data.bidType = bidType;
            _data.projId = projId;
            _data.bidStatus = bidStatus;
            _data.keywords = keywords;
            that.getBidsListFunc(_data, page);
        });
        renderBidsTable.renderBidsList(list);
    })
}

/*
* 招标状态修改
* */
exports.putBidsInfoFunc = function(data){
    bidsApi.putBidsInfo(data).then(function(){

    });
}

/*
* 查看某一招标信息
* */
exports.getBidInfoFunc = function(id){
    bidsApi.getBidInfo(id).then(function(res){
        var data = res.data || {};
        renderBidsTable.renderBidInviteList(data, id);
    });
}