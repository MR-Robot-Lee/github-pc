var initEvent = require('./initEvent');

/*
* 查询设置条件
* */
exports.renderInfoListTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('[name=noInfoBidsRequire_main]').show();
        $('#noInfoBidsRequire').hide();
    } else {
        $('[name=noInfoBidsRequire_main]').hide();
        $('#noInfoBidsRequire').show();
    }
    var parent = $('#bidRequireList').html('');
    var user = JSON.parse(localStorage.getItem('user'));
    var addUserName = user.employee.userName;
    console.log(list);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="trHeightLight-hover">' +
            '<td style="padding-left: 20px;">' + (i + 1) + '</td>' +
            '<td>' + item.requireDesc + '</td>' +
            '<td>' + addUserName + '</td>' +
            '<td>' + moment(item.addTime).format("YYYY-MM-DD") + '</td>' +
            '<td>' +
            '<a href="javascript:;" class="confirm-hover" data-type="edit">编辑</a>' +
            '<div class="icon-line" style="margin: 0 5px;"></div>' +
            '<a href="javascript:;" class="delete-hover" data-type="delete">删除</a>' +
            '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initInfoListEvent();
}

/*
* 新建招标中招标要求
* */
exports.renderBidsRequireTable = function (list, modal, old) {
    list = list || [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">' +
            '<td class="border"><input type="checkbox"></td>' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.requireDesc + '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(modal.$body.find('tbody'));
    }
    for (var j = 0; j < old.length; j++) {
        modal.$body.find('tr').each(function () {
            if ($(this).data('item')) {
                if ($(this).data('item').id === old[j].id) {
                    $(this).find('input').prop('checked', true);
                }
            }
        })
    }
}
exports.renderBidsRequireList = function (list) {
    list = list || [];
    var parent = $("#bidRequireSetting").html('');
    if (list.length > 0) {
        parent.parents('table').show();
    } else {
        parent.parents('table').hide();
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.requireDesc + '</td>' +
            '<td class="border"><a href="javascript:;" class="delete-hover">删除</a></td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initBidsRequireEvent();
}

/*
* 招标清单
* */
exports.renderBidList = function (arr, type) {
    var tbody = $('#bidList');
    var list = [];//已选数组
    tbody.find('tr').each(function () {
        list.push($(this).data('item'));
    })
    var newArr = list.concat(arr);//全部数组
    var allArr = [];//去重数组
    for (var i = 0; i < newArr.length; i++) {
        var flag = true;
        for (var j = 0; j < allArr.length; j++) {
            if (allArr.length > 0 && newArr[i].id === allArr[j].id) {
                flag = false;
            }
        }
        if (flag) {
            allArr.push(newArr[i]);
        }
    }
    renderBidListTable(allArr, type);
}
exports._renderBidListTable = renderBidListTable;

function renderBidListTable(allArr, type) {
    var thead = $('#bidList').parents('table').find('thead').html('');
    var tbody = $('#bidList');
    //渲染表头
    if (allArr.length > 0) {
        $('#bidList').parents('table').show();
    } else {
        $('#bidList').parents('table').hide();
    }
    if (type === 'material') {
        thead.append('<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">材料名称</th>' +
            '<th class="border">规格型号</th>' +
            '<th class="border">单位</th>' +
            '<th class="border">均价</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '<th class="border" style="width: 50px;">操作</th>' +
            '</tr>');
    } else if (type === 'labor' || type === 'step' || type === 'subpackage') {
        thead.append('<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">费用名称</th>' +
            '<th class="border">工作内容</th>' +
            '<th class="border">单位</th>' +
            '<th class="border">均价</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '<th class="border" style="width: 50px;">操作</th>' +
            '</tr>');
    }
    //渲染表单内容
    if (type === 'material') {
        tbody.html('');
        for (var i = 0; i < allArr.length; i++) {
            var item = allArr[i];
            var count = item.count || '';
            var remark = item.remark || '';
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.mtrlName + '</td>' +
                '<td class="border">' + item.specBrand + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.avgPrice + '</td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="count" value=' + count + '></td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="remark" value=' + remark + '></td>' +
                '<td class="border"><a href="javascript:;" class="delete-hover">删除</a></td>' +
                '</tr>');
            dom.data('item', item);
            tbody.append(dom);
        }
    } else if (type === 'labor') {
        tbody.html('');
        for (var i = 0; i < allArr.length; i++) {
            var item = allArr[i];
            var count = item.count || '';
            var remark = item.remark || '';
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.laborName + '</td>' +
                '<td class="border">' + item.workContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.avgPrice + '</td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="count" value=' + count + '></td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="remark" value=' + remark + '></td>' +
                '<td class="border"><a href="javascript:;" class="delete-hover">删除</a></td>' +
                '</tr>');
            dom.data('item', item);
            tbody.append(dom);
        }
    } else if (type === 'step') {
        tbody.html('');
        for (var i = 0; i < allArr.length; i++) {
            var item = allArr[i];
            var count = item.count || '';
            var remark = item.remark || '';
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.measureName + '</td>' +
                '<td class="border">' + item.workContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.avgPrice + '</td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="count" value=' + count + '></td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="remark" value=' + remark + '></td>' +
                '<td class="border"><a href="javascript:;" class="delete-hover">删除</a></td>' +
                '</tr>');
            dom.data('item', item);
            tbody.append(dom);
        }
    } else if (type === 'subpackage') {
        tbody.html('');
        for (var i = 0; i < allArr.length; i++) {
            var item = allArr[i];
            var count = item.count || '';
            var remark = item.remark || '';
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.subletName + '</td>' +
                '<td class="border">' + item.workContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.avgPrice + '</td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="count" value=' + count + '></td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="remark" value=' + remark + '></td>' +
                '<td class="border"><a href="javascript:;" class="delete-hover">删除</a></td>' +
                '</tr>');
            dom.data('item', item);
            tbody.append(dom);
        }
    }
    initEvent.initBidsListEvent(type);
}

/*
* 招标列表
* */
exports.renderBidsList = function (list) {
    console.log(list);
    if (list.length > 0) {
        $("[name=noInfoBidsList_main]").show();
        $("[name=noInfoBidsList_page]").show();
        $("#noInfoBidsList").hide();
    } else {
        $("[name=noInfoBidsList_main]").hide();
        $("[name=noInfoBidsList_page]").hide();
        $("#noInfoBidsList").show();
    }
    var parent = $(".all-bids").html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<div class="clearfix bid-item">' +
            '<div class="bid-item-type fl">' + getBidType(item.bidType) + '</div>' +
            '<div class="bid-item-con fl">' +
            '<div class="bid-item-con_top">' + item.bidTitle + '</div>' +
            '<div class="bid-item-con_bottom">' +
            '<span>招标编号 : </span>' +
            '<span>' + item.bidNo + '</span>' +
            '<span style="margin-left: 20px;">' + item.projectName + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="bid-item-status fl">状态 : <span>' + getBidStatus(item.bidStatus) + '</span></div>' +
            '<div class="bid-item-oparete fr">' +
            '<a href="javascript:;" class="delete-hover" data-type="edit">编辑</a>' +
            '<span style="margin: 0 5px;color: #666;">|</span>' +
            '<a href="javascript:;" class="delete-hover" data-type="recall">撤回</a>' +
            '<span style="margin: 0 5px;color: #666;">|</span>' +
            '<a href="javascript:;" class="delete-hover" data-type="del">删除</a>' +
            '</div>' +
            '</div>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initBidItemEvent(parent);
}

function getBidType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '材料';
        case 2:
            return '人工';
        case 3:
            return '措施';
        case 4:
            return '分包';
        case 5:
            return '企业';
    }
}

function getBidStatus(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '已保存';
        case 2:
            return '招标中';
        case 3:
            return '已截止';
        case 4:
            return '流标';
        case 5:
            return '评审中';
        case 6:
            return '审批中';
        case 7:
            return '审批完成';
        case 8:
            return '被驳回';
        case 9:
            return '已删除';
    }
}

/*
* 投标单位列表
* */
exports.renderBidInviteList = function (data, id) {
    if (data) {
        var list = data.bidInviteVOList;
    }
    var parent = $('.con-container').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        console.log(item);
        var dom = $('<div class="bid-company-item" style="position: relative;">' +
            '<div style="line-height: 34px;font-weight: bold;color: #333333;">' + item.entpName + '</div>' +
            '<div><label>投标总价 : </label> <span>123456.78</span></div>' +
            '<div><label>管理员 : </label> <span>' + item.contactName + '</span></div>' +
            '<div><label>联系电话 : </label> <span>' + item.phone + '</span></div>' +
            '<div><label>税务类型 : </label> <span>一般纳税人</span></div>' +
            '<div><label>营业执照 : </label> <a href="javascript:;" class="confirm-hover">查看执照</a></div>' +
            '<div class="win-bid span-btn">中标</div>' +
            '<span class="win-the-bid" style="top: 0;right: 0;display: none;"></span>' +
            '</div>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initWinzheBidEvent();
}