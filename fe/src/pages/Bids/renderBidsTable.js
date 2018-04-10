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
exports.renderBidsRequireList = _renderBidsRequireList

function _renderBidsRequireList(list) {
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
    if (allArr.length) {
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
    if (type === 'material' && allArr[0].mtrlName) {
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
    } else if (type === 'labor' && allArr[0].laborName) {
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
    } else if (type === 'step' && allArr[0].measureName) {
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
    } else if (type === 'subpackage' && allArr[0].subletName) {
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
    } else {
        tbody.html('');
        for (var i = 0; i < allArr.length; i++) {
            var item = allArr[i];
            var count = item.objQpy || '';
            var remark = item.remark || '';
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.objName + '</td>' +
                '<td class="border">' + item.workContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.bidPrice + '</td>' +
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
* 投标邀请
* */
exports.renderBidsInvitationTable = function (arr) {
    if (arr.length) {
        $('#bidInvitation').parents('table').show()
    } else {
        $('#bidInvitation').parents('table').hide()
    }
    var parent = $('#bidInvitation').html('');
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.businessScope + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.contactName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border">' + item.taxType + '</td>' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border"><a href="javascript:;" class="confirm-hover" data-type="check">查看</a></td>' +
            '<td class="border"><a href="javascript:;" class="delete-hover" data-type="del">删除</a></td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initBidsInvitationEvent();
}

/*
* 招标列表
* */
exports.renderBidsList = function (list, page) {
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
        var oper = '<a href="javascript:;" class="delete-hover" data-type="del">删除</a>';
        if (item.bidStatus === 2) {
        }
        var bgc = '';
        if (item.bidStatus === 1) { // 待发布
            bgc = '#f8b62a';
        } else if (item.bidStatus === 2) { // 招标中
            bgc = '#4bd851';
            oper = '<a href="javascript:;" class="delete-hover" data-type="recall">撤回</a>';
        } else if (item.bidStatus === 3) { // 已截止
            bgc = '#f77260';
        } else if (item.bidStatus === 8) { // 被撤回
            bgc = '#c89321';
        } else if (item.bidStatus === 4) { // 流标
            bgc = '#999999';
        } else if (item.bidStatus === 7) { // 已评标
            bgc = '#4db892';
        }
        var dom = $('<div class="clearfix bid-item">' +
            '<div class="bid-item-type fl" style="background-color: ' + bgc + '">' + getBidType(item.bidType) + '</div>' +
            '<div class="bid-item-con fl">' +
            '<div class="bid-item-con_top">' + item.bidTitle + '</div>' +
            '<div class="bid-item-con_bottom">' +
            '<span>招标编号 : </span>' +
            '<span>' + item.bidNo + '</span>' +
            '<span style="margin-left: 20px;">' + item.projectName + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="bid-item-status fl">状态 : <span>' + getBidStatus(item.bidStatus) + '</span></div>' +
            '<div class="bid-item-oparete fr">' + oper + '</div>' +
            '</div>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initBidItemEvent(parent, page);
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
            return '待发布';
        case 2:
            return '招标中';
        case 3:
            return '已截止';
        case 4:
            return '流标';
        case 7:
            return '已评标';
        case 8:
            return '被撤回';
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
        var bidStatusIcon = '';
        var winbid = '<div style="visibility: hidden" class="win-bid span-btn">中标</div>';
        if (item.status === 4) { // 已报价
            bidStatusIcon = '<div class="quote-the-bid"></div>';
            winbid = '<div class="win-bid span-btn">中标</div>';
        } else if (item.status === 3) { // 已拒绝
            bidStatusIcon = '<div class="reject-the-bid"></div>';
        } else if (item.status === 1) { // 未报价
            bidStatusIcon = '<div class="noquote-the-bid"></div>';
        }
        var dom = $('<div class="bid-company-item" style="position: relative;">' +
            '<div style="line-height: 34px;font-weight: bold;color: #333333;">' + item.entpName + '</div>' +
            '<div><label>投标总价 : </label> <span>123456.78</span></div>' +
            '<div><label>管理员 : </label> <span>' + item.contactName + '</span></div>' +
            '<div><label>企业信息 : </label> <a href="javascript:;" class="confirm-hover" data-type="info">查看</a></div>' +
            '<div><label>投标清单 : </label> <a href="javascript:;" class="confirm-hover" data-type="check">查看</a></div>' +
            winbid +
            '<span class="win-the-bid" style="top: 0;right: 0;display: none;"></span>' +
            bidStatusIcon +
            '</div>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initWinzheBidEvent(id);
}

/*
* 招标公告详情中表格
* @param bidRequireList 招标要求
* @param bidInviteVOList 招标清单
* @param bidDetailVOList 投标邀请
* */
exports.renderBidDetailTable = function (bidRequireList, bidInviteVOList, bidDetailVOList, type) {
    $('#bidRequireSettingPrev').html('');
    $('#bidListPrev').html('');
    $('#bidInvitationPrev').html('');
    for (var i = 0; i < bidRequireList.length; i++) {
        var item = bidRequireList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.requireDesc + '</td>' +
            '</tr>');
        dom.appendTo($('#bidRequireSettingPrev'));
    }
    if (type === 1) {
        var thead = '<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">材料名称</th>' +
            '<th class="border">规格型号</th>' +
            '<th class="border">单位</th>' +
            '<th class="border">均价</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>'
        $('#bidListPrev').parents('table').find('thead').html(thead)
        for (var i = 0; i < bidDetailVOList.length; i++) {
            var item = bidDetailVOList[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.objEnumType + '</td>' +
                '<td class="border">' + item.objName + '</td>' +
                '<td class="border">' + item.objContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.objQpy + '</td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '</tr>');
            dom.appendTo($('#bidListPrev'));
        }
    } else {
        var thead = '<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">费用名称</th>' +
            '<th class="border">工作内容</th>' +
            '<th class="border">单位</th>' +
            '<th class="border">均价</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>'
        $('#bidListPrev').parents('table').find('thead').html(thead)
        for (var i = 0; i < bidDetailVOList.length; i++) {
            var item = bidDetailVOList[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.objEnumType + '</td>' +
                '<td class="border">' + item.objName + '</td>' +
                '<td class="border">' + item.objContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.objQpy + '</td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '</tr>');
            dom.appendTo($('#bidListPrev'));
        }
    }
    for (var i = 0; i < bidInviteVOList.length; i++) {
        var item = bidInviteVOList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.entpType + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.contactName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border"></td>' +
            '<td class="border"></td>' +
            '<td class="border"></td>' +
            '</tr>');
        dom.appendTo($('#bidInvitationPrev'));
    }
}

/*
* 招标公告编辑中表格
* @param bidRequireList 招标要求
* @param bidInviteVOList 招标清单
* @param bidDetailVOList 投标邀请
* */
exports.renderBidEditTable = function (bidRequireList, bidInviteVOList, bidDetailVOList, type) {
    // 招标要求
    _renderBidsRequireList(bidRequireList)
    // 招标清单
    renderBidListTable(bidDetailVOList, type)
    // 投标邀请
    $('#bidInvitation').html('');
    for (var i = 0; i < bidInviteVOList.length; i++) {
        var item = bidInviteVOList[i];
        var tbody = $('#bidInvitation');
        var order = tbody.find('tr').length;
        var dom = $('<tr class="small">' +
            '<td class="border">' + (order + 1) + '</td>' +
            '<td class="border">' + item.businessScope + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.contactName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border">' + item.taxType + '</td>' +
            '<td class="border">' + (order + 1) + '</td>' +
            '<td class="border"><a href="javascript:;" class="confirm-hover" data-type="check">查看</a></td>' +
            '<td class="border"><a href="javascript:;" class="delete-hover" data-type="del">删除</a></td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(tbody);
        tbody.parents('table').show();
        $('.sup-count').html(order + 1);
    }
    initEvent.initBidsInvitationEvent();
}

/*
* 评标/企业信息
* */
exports.renderCompanyInfoTable = function (data, modal) {
    modal.$body.find('.entpName').html(data.entpName);
    modal.$body.find('.contactName').html(data.contactName);
    modal.$body.find('.phone').html(data.phone);
    modal.$body.find('.businessScope').html(data.businessScope);
    modal.$body.find('.region').html(data.provinceName + data.cityName);
    modal.$body.find('.address').html(data.address);
    modal.$body.find('.taxType').html(data.taxType);
    modal.$body.find('.openName').html(data.openName);
    modal.$body.find('.openBank').html(data.openBank);
    modal.$body.find('.bankCard').html(data.bankCard);
}

/*
* 评标/投标清单
* */
exports.renderBidingInfoList = function (data, modal) {
    console.log(data);
    var list = data.biddingList || [];
    modal.$body.find('tbody').html('');
    modal.$body.find('.entpName').html(data.entp.entpName);
    modal.$body.find('.biddingMoney').html(data.entp.biddingMoney);
    modal.$body.find('.contactName').html(data.entp.contactName);
    modal.$body.find('.phone').html(data.entp.phone);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.objName + '</td>' +
            '<td class="border">' + item.objContent + '</td>' +
            '<td class="border">' + item.unit + '</td>' +
            '<td class="border">' + (item.objQpy || '') + '</td>' +
            '<td class="border"><a class="confirm-hover" href="javascript:;">查看</a></td>' +
            '<td class="border">' + item.biddingPrice + '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(modal.$body.find('tbody'))
    }
}