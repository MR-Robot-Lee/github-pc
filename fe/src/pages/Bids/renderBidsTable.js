var initEvent = require('./initEvent');
var UploadAttach = require('../../components/UploadAttach/index');
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
* @param arr 勾选的新数组
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
    console.log(allArr);
    renderBidListTable(allArr, type);
}

exports._renderBidListTable = renderBidListTable;

function renderBidListTable(allArr, type) {
    var thead = $('#bidList').parents('table').find('thead').html('');
    var tbody = $('#bidList');
    tbody.html('');
    //渲染表头
    console.log(allArr);
    if (!allArr.length) {
        $('#bidList').parents('table').hide();
    } else {
        $('#bidList').parents('table').show();
        if (type === 'material') {
            thead.append('<tr class="small">' +
                '<th class="border" style="width: 50px;">序号</th>' +
                '<th class="border">材料名称</th>' +
                '<th class="border">规格型号</th>' +
                '<th class="border">单位</th>' +
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
                '<th class="border" style="width: 50px;">数量</th>' +
                '<th class="border">说明</th>' +
                '<th class="border" style="width: 50px;">操作</th>' +
                '</tr>');
        }
        //渲染表单内容
        for (var i = 0; i < allArr.length; i++) {
            var item = allArr[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + (item.mtrlName || item.laborName || item.measureName || item.subletName || item.objName) + '</td>' +
                '<td class="border">' + (item.specBrand || item.workContent || item.objContent) + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="count" value=' + (item.objQpy || '') + '></td>' +
                '<td class="border"><input type="text" placeholder="填写" data-type="remark" value=' + (item.remark || '') + '></td>' +
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
            '<td class="border">' + getTaxType(item.taxType) + '</td>' +
            '<td class="border"><a href="javascript:;" class="confirm-hover" data-type="check">查看</a></td>' +
            '<td class="border"><a href="javascript:;" class="delete-hover" data-type="del">删除</a></td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initBidsInvitationEvent();
}

/*
* 预览
* */
exports.prevNewBid = function (data) {
    $('.detail-title').html(data.bidTitle);
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    user = user.employee.userName;
    var nowTime = new Date().getTime();
    $('.publishUserName').html(user);
    $('.publishTime').html(moment(nowTime).format('YYYY/MM/DD hh:mm'));
    $('.bid-type').html(getBidType2(data.bidType));
    var projName = data.projName || '';
    $('.bid-projname').html(projName);
    $('.bid-content').html(data.bidContent);
    $('.bid-scale').html(data.bidScale);
    var endTime = moment(data.endTime).format('YYYY/MM/DD hh:mm');
    $('.endtime').html(endTime);
    $('#bidRequireSettingPrev').html('');
    $('#bidInvitationPrev').html('');
    $('#bidListPrev').parents('table').find('thead').html('');
    $('#bidListPrev').html('');
    $('.supplier-count').html(data._entpList.length);
    $('.images').html('');
    /* 附件 */
    for (var i = 0; i < data.attachList.length; i++) {
        var item = data.attachList[i];
        var dom = $('<div class="fl" style="margin: 0 15px 15px 0;text-align: center;">' +
            '<div style="width: 150px;height: 150px;background-image: url(' + window.API_PATH + '/customer' + item.attachUrl + ');background-size: cover;"></div>' +
            '<div style="width: 150px;" class="ellipsis">' + item.attachName + '</div>' +
            '</div>');
        dom.appendTo($('.images'));
    }
    /* 招标要求 */
    for (var i = 0; i < data._requireList.length; i++) {
        var item = data._requireList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.requireDesc + '</td>' +
            '</tr>');
        dom.appendTo($('#bidRequireSettingPrev'));
    }
    /* 招标清单 */
    if (data.bidType == 1) {
        $('#bidListPrev').parents('table').find('thead').append('<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">材料名称</th>' +
            '<th class="border">规格型号</th>' +
            '<th class="border">单位</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>');
    } else if (data.bidType == 2 || data.bidType == 3 || data.bidType == 4) {
        $('#bidListPrev').parents('table').find('thead').append('<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">费用名称</th>' +
            '<th class="border">工作内容</th>' +
            '<th class="border">单位</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>');
    }
    if (data.bidType == 1) { // 材料
        for (var i = 0; i < data._addBidDetailList.length; i++) {
            var item = data._addBidDetailList[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.mtrlName + '</td>' +
                '<td class="border">' + item.specBrand + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + (item.count || '') + '</td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '</tr>');
            dom.appendTo($('#bidListPrev'));
        }
    } else if (data.bidType == 2) { // 人工
        for (var i = 0; i < data._addBidDetailList.length; i++) {
            var item = data._addBidDetailList[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.laborName + '</td>' +
                '<td class="border">' + item.workContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + (item.count || '') + '</td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '</tr>');
            dom.appendTo($('#bidListPrev'));
        }
    } else if (data.bidType == 3) { // 措施
        for (var i = 0; i < data._addBidDetailList.length; i++) {
            var item = data._addBidDetailList[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.measureName + '</td>' +
                '<td class="border">' + item.workContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + (item.count || '') + '</td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '</tr>');
            dom.appendTo($('#bidListPrev'));
        }
    } else if (data.bidType == 4) { // 分包
        for (var i = 0; i < data._addBidDetailList.length; i++) {
            var item = data._addBidDetailList[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.subletName + '</td>' +
                '<td class="border">' + item.workContent + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + (item.count || '') + '</td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '</tr>');
            dom.appendTo($('#bidListPrev'));
        }
    }
    /* 投标邀请 */
    for (var i = 0; i < data._entpList.length; i++) {
        var item = data._entpList[i];
        console.log(item);
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.businessScope + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.contactName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border">' + getTaxType(item.taxType) + '</td>' +
            '<td class="border">暂无</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo($('#bidInvitationPrev'));
    }
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
            bgc = '#4db851';
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
            '<div class="bid-item-con_top" style="color: #5b5b5b;">' + item.bidTitle + '</div>' +
            '<div class="bid-item-con_bottom">' +
            '<span style="color: #888">招标编号 : </span>' +
            '<span style="color: #888">' + item.bidNo + '</span>' +
            '<span style="margin-left: 20px;color: #888"">' + (item.projectName || '') + '</span>' +
            '</div>' +
            '</div>' +
            '<div style="color: #888" class="bid-item-status fl">状态 : <span>' + getBidStatus(item.bidStatus) + '</span></div>' +
            '<div class="bid-item-oparete fr">' + oper + '</div>' +
            '</div>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initBidItemEvent(parent, page);
}

/*
* 中标列表
* */
exports.renderBidsNoticeList = function (list, page) {
    list = list || [];
    if (list.length) {
        $('[name=noInfoBidNoticeList_main]').show();
        $('[name=noInfoBidNoticeList_page]').show();
        $('#noInfoBidNoticeList').hide();
    } else {
        $('[name=noInfoBidNoticeList_main]').hide();
        $('[name=noInfoBidNoticeList_page]').hide();
        $('#noInfoBidNoticeList').show();
    }
    $('.bidnotice-item-list').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<div class="clearfix bid-item">' +
            '<div class="bid-item-type fl">' + getBidType(item.bidType) + '</div>' +
            '<div class="bid-item-con fl">' +
            '<div class="bid-item-con_top" style="color: #5b5b5b;">' + item.bidTitle + '</div>' +
            '<div class="bid-item-con_bottom">' +
            '<span style="color: #888">招标编号 :</span> <span style="margin-right: 20px;color: #888">' + item.bidNo + '</span>' +
            '<span style="color: #888">' + (item.projectName || '') + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="bid-item-oparete fr">' +
            '<a href="javascript:;" class="delete-hover">删除</a>' +
            '</div>' +
            '</div>')
        dom.data('item', item);
        dom.appendTo($('.bidnotice-item-list'))
    }
    initEvent.initBidsNoticeItemEvent(page)
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

function getBidType2(type) {
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
            return '企业服务';
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
    var list = data.bidInviteVOList;
    var parent = $('.con-container').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var bidStatusIcon = '';
        var winbid = '<div style="visibility: hidden" class="win-bid span-btn">中标</div>';
        var winthebid = '<span class="win-the-bid" style="top: 0;right: 0;display: none;"></span>';
        if (item.status === 4) { // 已报价
            bidStatusIcon = '<div class="quote-the-bid"></div>';
            if (data.bidStatus === 2) {
                winbid = '<div class="win-bid span-btn">中标</div>';
            }
        } else if (item.status === 5) { // 已中标
            bidStatusIcon = '<div class="quote-the-bid"></div>';
            winthebid = '<span class="win-the-bid" style="top: 0;right: 0;"></span>';
        } else if (item.status === 3) { // 已拒绝
            bidStatusIcon = '<div class="reject-the-bid"></div>';
        } else if (item.status === 1) { // 未报价
            bidStatusIcon = '<div class="noquote-the-bid"></div>';
        }
        var dom = $('<div class="bid-company-item" style="position: relative;">' +
            '<div style="line-height: 34px;font-weight: bold;color: #333333;">' + item.entpName + '</div>' +
            '<div><label>投标总价 : </label> <span class="biddingMoney">' + (item.biddingMoney || 0) + '</span></div>' +
            '<div><label>管理员 : </label> <span>' + item.contactName + '</span></div>' +
            '<div><label>企业信息 : </label> <a href="javascript:;" style="cursor: pointer;color: #009411;text-decoration: underline" data-type="info">查看</a></div>' +
            '<div><label>投标清单 : </label> <a href="javascript:;" style="cursor: pointer;color: #009411;text-decoration: underline" data-type="check">查看</a></div>' +
            winbid +
            winthebid +
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
    /* 招标要求 */
    for (var i = 0; i < bidRequireList.length; i++) {
        var item = bidRequireList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.requireDesc + '</td>' +
            '</tr>');
        dom.appendTo($('#bidRequireSettingPrev'));
    }
    /* 招标清单 */
    if (type === 1) {
        var thead = '<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">材料名称</th>' +
            '<th class="border">规格型号</th>' +
            '<th class="border">单位</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>'

    } else {
        var thead = '<tr class="small">' +
            '<th class="border" style="width: 50px;">序号</th>' +
            '<th class="border">费用名称</th>' +
            '<th class="border">工作内容</th>' +
            '<th class="border">单位</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>'
    }
    $('#bidListPrev').parents('table').find('thead').html(thead)
    for (var i = 0; i < bidDetailVOList.length; i++) {
        var item = bidDetailVOList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.objName + '</td>' +
            '<td class="border">' + item.objTypeName + '</td>' +
            '<td class="border">' + item.unit + '</td>' +
            '<td class="border">' + item.objQpy + '</td>' +
            '<td class="border">' + (item.remark || '') + '</td>' +
            '</tr>');
        dom.appendTo($('#bidListPrev'));
    }
    /* 投标邀请 */
    $('.sup-count').html(bidInviteVOList.length)
    for (var i = 0; i < bidInviteVOList.length; i++) {
        var item = bidInviteVOList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.entpTypeName + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.contactName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border">' + getTaxType(item.taxType) + '</td>' +
            '<td class="border">暂无</td>' +
            '</tr>');
        dom.appendTo($('#bidInvitationPrev'));
    }
}

function getTaxType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '小规模';
        case 2:
            return '一般纳税人';
        case 3:
            return '个体';
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
            '<td class="border">' + item.entpTypeName + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.contactName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border">' + getTaxType(item.taxType) + '</td>' +
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
    modal.$body.find('.taxType').html(getTaxType(data.taxType));
    modal.$body.find('.openName').html(data.openName);
    modal.$body.find('.openBank').html(data.openBank);
    modal.$body.find('.bankCard').html(data.bankCard);
    modal.$body.find('.attachesList')
    console.log(data.attachList);
    for (var i = 0; i < data.attachList.length; i++) {
        console.log(data.attachList[i].attachUrl);
        var attachUrl = '';
        if (data.attachList[i].attachUrl.indexOf("uploadWechat/wechat") === -1) {
            attachUrl = window.API_PATH + '/customer' + data.attachList[i].attachUrl;
        } else {
            attachUrl = window.API_PATH + data.attachList[i].attachUrl;
        }
        var dom = $('<div class="fl" style="width: 110px;height: 90px;padding: 3px;border: 1px solid #e5e5e5;margin: 0 10px 10px 0;">' +
            '<div style="width: 102px;height: 82px;background-size: contain;background-repeat: no-repeat;background-image: url(' + attachUrl + ')"></div>' +
            '</div>');
        dom.appendTo(modal.$body.find('.attachesList'))
    }
}

/*
* 评标/投标清单
* */
exports.renderBidingInfoList = function (data, modal) {
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
            '<td class="border">' + (item.remark || '') + '</td>' +
            '<td class="border">' + item.biddingPrice + '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(modal.$body.find('tbody'))
    }
}

/*
* 中标详情
* */
exports.renderBidNoticeList = function (bidRequireList, bidDetailVOList, type) {
    $("#bidRequireList").html('');
    $('#bidDetailVOList').html('');
    for (var i = 0; i < bidRequireList.length; i++) {
        var item = bidRequireList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.requireDesc + '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo($("#bidRequireList"));
    }
    $("#bidDetailVOList").parents('table').find('thead').html('');
    if (type === '1') {
        $("#bidDetailVOList").parents('table').find('thead').append('<tr class="small">' +
            '<th class="border" style="width: 45px;">序号</th>' +
            '<th class="border">材料名称</th>' +
            '<th class="border">规格型号</th>' +
            '<th class="border">单位</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>');
    } else {
        $("#bidDetailVOList").parents('table').find('thead').append('<tr class="small">' +
            '<th class="border" style="width: 45px;">序号</th>' +
            '<th class="border">费用名称</th>' +
            '<th class="border">工作内容</th>' +
            '<th class="border">单位</th>' +
            '<th class="border" style="width: 50px;">数量</th>' +
            '<th class="border">说明</th>' +
            '</tr>');
    }
    for (var i = 0; i < bidDetailVOList.length; i++) {
        var item = bidDetailVOList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.objName + '</td>' +
            '<td class="border">' + item.objContent + '</td>' +
            '<td class="border">' + item.unit + '</td>' +
            '<td class="border">' + (item.objQpy || '') + '</td>' +
            '<td class="border">' + (item.remark || '') + '</td>' +
            '</tr>');
        dom.data('item', item);
        $('#bidDetailVOList').append(dom);
    }
}