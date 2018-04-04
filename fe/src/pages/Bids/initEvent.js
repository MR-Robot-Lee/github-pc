var common = require('../Common');
var Modal = require('../../components/Model');
var UploadImage = require('../../components/UploadImage');
var addSupplier = require('../../components/addSupplier');
var UploadAttach = require('../../components/UploadAttach');
var bidRequire = require('./modal/bidRequire.ejs');
var addTypeModal = require('./modal/addTypeModal.ejs');
var enterpriseDataBase = require('../Project/costBudgetManager/modal/enterpriseDataBase.ejs');
var initEventModal = require('../Project/costBudgetManager/modal/initEventModal');
var initBidsFunc = require('./initBidsFunc');
var delModal = require('./modal/delModal.ejs');
var recallModal = require('./modal/recallModal.ejs');
var failureModal = require('./modal/failureModal.ejs');
var renderBidsTable = require('./renderBidsTable');

/*
* 新建招标
* */
exports.initAddBidsEvent = function () {
    //截止时间
    laydate.render({
        elem: "#bidDeadline"
    });

    //附件
    var reportImage = $(".reportImage");
    var upImage = new UploadImage(reportImage);

    //招标要求
    $('a[name=bidRequireSetting]').click(function (e) {
        common.stopPropagation(e);
        var oldArr = [];
        $('#bidRequireSetting').find('tr').each(function () {
            oldArr.push($(this).data('item'));
        });
        var bidReq = Modal('招标要求', bidRequire());
        bidReq.showClose();
        bidReq.show();
        initBidsFunc._getInfoModalListFunc('add', bidReq, oldArr);
        bidReq.$body.find('.confirm').click(function () {
            var arr = [];
            bidReq.$body.find('tbody input').each(function () {
                if ($(this).prop('checked')) {
                    arr.push($(this).parents('tr').data('item'));
                }
            });
            bidReq.$body.find('.span-btn-bc').click();
            renderBidsTable.renderBidsRequireList(arr);
        });
    });

    //招标清单
    $('a[name=bidList]').click(function (e) {
        common.stopPropagation(e);
        if (!$('#bidType').val()) {
            return alert('请先选择招标类型');
        }
        var type = checkBidType($('#bidType').val());
        var enterpriseModal = Modal('企业库数据', enterpriseDataBase());
        enterpriseModal.showClose();
        enterpriseModal.show();
        initEventModal.initBaseDataModal(enterpriseModal, type, function () {
        }, []);
        enterpriseModal.$body.find('.budget-menus a#' + type + 'EnterpriseModal').click();
        enterpriseModal.$body.find('.budget-menus a:not(.active)').addClass('cancel-active');
        var checkedArr = [];//存放勾选数据
        enterpriseModal.$body.find('#modalEnterpriseList').on('change', 'input', function () {
            if ($(this).prop('checked')) {//向数组中加入勾选项
                checkedArr.push($(this).parents('tr').data('item'));
            } else {//从数组中去掉取消勾选的一项
                var checkId = $(this).parents('tr').data('item').id;
                for (var i = 0; i < checkedArr.length; i++) {
                    if (checkId === checkedArr[i].id) {
                        checkedArr.splice(i, 1);
                    }
                }
            }
        });
        enterpriseModal.$body.find('#showTitle').on('change', 'input', function () {
            if ($(this).prop('checked')) {//
                enterpriseModal.$body.find('#modalEnterpriseList tr').each(function () {
                    checkedArr.push($(this).data('item'));
                });
            } else {//
                for (var i = checkedArr.length - 1; i >= 0; i--) {
                    enterpriseModal.$body.find('tr').each(function () {
                        if (checkedArr[i].id === $(this).data('item').id) {
                            checkedArr.splice(i, 1);
                        }
                    });
                }
            }
        });

        enterpriseModal.$body.find('.confirm').click(function (e) {//招标清单 确定
            common.stopPropagation(e);
            enterpriseModal.$body.find('.span-btn-bc').click();
            renderBidsTable.renderBidList(checkedArr, type);
            $('#bidList').parents('table').show();

        })
    });

    //选择供应商
    $('a[name=checkSupplier]').click(function (e) {
        common.stopPropagation(e);
        console.log(1);
        new addSupplier($('.supplierList'), $('.supplierList'), {}, 'bid');
        $('.model-add-supplier').css({'left': '225px', 'top': '30%'});
    });

    //招标类型
    $('#bidType').change(function () {
        $('#bidList').parents('table').hide();
        $('#bidList').html('');
    });

    //投标邀请中的查看和删除事件
    $('#bidInvitation').on('click', 'a', function (e) {
        common.stopPropagation(e);
        var that = this;
        if ($(this).data('type') === 'del') {
            var arr = delItem($('#bidInvitation'), that, 'invite');
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
                    '<td class="border"><a href="javascript:;" class="confirm-hover" data-type="check">查看</a></td>' +
                    '<td class="border"><a href="javascript:;" class="delete-hover" data-type="del">删除</a></td>' +
                    '</tr>');
                dom.data('item', item);
                dom.appendTo(parent);
            }
            var length = parent.find('tr').length;
            if (length === 0) {
                parent.parents('table').hide();
            }
        }
    });

    //初始化发布
    $(".submit").click(function (e) {
        common.stopPropagation(e);
        var data = {};
        if ($("#bidType").val()) {//招标类型
            data.bidType = $("#bidType").val();
        } else {
            return alert('请选择招标类型');
        }
        if ($("[name=bidTitle]").val()) {//标题
            data.bidTitle = $("[name=bidTitle]").val();
        } else {
            return alert('请填写标题');
        }
        if ($("#bidDeadline").html()) {//截止时间
            data.endTime = $.timeStampDate($("#bidDeadline").html()) * 1000;
        } else {
            return alert('请选择截止时间');
        }
        if ($("[name=bidContent]").val()) {//招标内容
            data.bidContent = $("[name=bidContent]").val();
        } else {
            return alert('请填写招标内容');
        }
        var attachs = upImage.getImages();
        data.attachList = attachs;
        data.projId = $('#allProject').val() / 1;//招标项目
        data.projName = $('#allProject').find('option[value=' + data.projId + ']').html();//招标项目
        var requireList = [];//招标要求
        var entpList = [];//投标邀请
        var addBidDetailList = [];//招标清单
        $('#bidRequireSetting').find('tr').each(function () {
            requireList.push($(this).data('item').id);
        });
        $('#bidInvitation').find('tr').each(function () {
            entpList.push($(this).data('item').id);
        });
        var flag = false;
        $('#bidList').find('tr').each(function () {
            var _data = {};
            console.log($(this).data('item'));
            _data.objEnumType = $("#bidType").val()*1 + 1;
            _data.objId = $(this).data('item').id;
            _data.objQpy = $(this).data('item').count / 1;
            if (!_data.objQpy) {
                flag = true;
            }
            _data.remark = $(this).data('item').remark;
            addBidDetailList.push(_data);
        });
        if (flag) {
            return alert('请填写数量');
        }
        data.requireList = requireList;
        data.entpList = entpList;
        data.addBidDetailList = addBidDetailList;
        console.log(data);

        if ($(this).data('type') === 'save') {//保存
            data.bidStatus = 1;
            // initBidsFunc.postBidsInfoFunc(data);

        } else if ($(this).data('type') === 'submit') {//发布
            data.bidStatus = 2;
            initBidsFunc.postBidsInfoFunc(data);

        } else if ($(this).data('type') === 'preview') {//预览
            data._requireList = [];
            data._entpList = [];
            data._addBidDetailList = [];
            $('#bidRequireSetting').find('tr').each(function () {
                data._requireList.push($(this).data('item'));
            });
            $('#bidInvitation').find('tr').each(function () {
                data._entpList.push($(this).data('item'));
            });
            $('#bidList').find('tr').each(function () {
                data._addBidDetailList.push($(this).data('item'));
            });
            prevNewBid(data);
            $('.bid-preview').show();
            $('.bid-add-container').hide();
            $('.employee-name').hide();
            $('.common-header a').show().off('click').on('click', function () {
                if ($(this).data('type') === 'back') {
                    $('.bid-preview').hide();
                    $('.bid-add-container').show();
                    $('.employee-name').show();
                    $('.common-header a').hide();
                } else if ($(this).data('type') === 'submit') {
                    data.bidStatus = 2;
                    initBidsFunc.postBidsInfoFunc(data);
                }
            })
        }
    });
}

function prevNewBid(data) {
    console.log(data);
    $('.detail-title').html(data.bidTitle);
    $('.bid-type').html(data.bidType);
    var projName = data.projName || '';
    $('.bid-projname').html(projName);
    $('.bid-content').html(data.bidContent);
    var endTime = moment(data.endTime).format('YYYY/MM/DD');
    $('.endtime').html(endTime);
    $('#bidRequireSettingPrev').html('');
    $('#bidInvitationPrev').html('');
    $('#bidListPrev').html('');
    $('.images').html('');
    for (var i = 0; i < data.attachList.length; i++) {
        var item = data.attachList[i];
        var dom = $('<div class="fl" style="margin: 0 15px 15px 0;text-align: center;">' +
            '<div style="width: 150px;height: 150px;background-image: url(' + window.API_PATH + '/customer' + item.thumbnailUrl + ');background-size: cover;"></div>' +
            '<div style="width: 150px;" class="ellipsis">' + item.attachName + '</div>' +
            '</div>');
        dom.appendTo($('.images'));
    }
    for (var i = 0; i < data._requireList.length; i++) {
        var item = data._requireList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.requireDesc + '</td>' +
            '</tr>');
        dom.appendTo($('#bidRequireSettingPrev'));
    }
    for (var i = 0; i < data._addBidDetailList.length; i++) {
        var item = data._addBidDetailList[i];
        var remark = item.remark || '';
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.laborName + '</td>' +
            '<td class="border">' + item.workContent + '</td>' +
            '<td class="border">' + item.unit + '</td>' +
            '<td class="border">' + item.avgPrice + '</td>' +
            '<td class="border">' + item.count + '</td>' +
            '<td class="border">' + remark + '</td>' +
            '</tr>');
        dom.appendTo($('#bidListPrev'));
    }
    for (var i = 0; i < data._entpList.length; i++) {
        var item = data._entpList[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.businessScope + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.contactName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border">' + item.taxType + '</td>' +
            '<td class="border">暂无</td>' +
            '<td class="border"><a href="javascript:;" class="confirm-hover">查看</a></td>' +
            '</tr>');
        dom.appendTo($('#bidInvitationPrev'));
    }
}

/*
* 招标要求中的删除事件
* */
exports.initBidsRequireEvent = function () {
    $('#bidRequireSetting').find('a').click(function () {
        var that = this;
        var arr = delItem($('#bidRequireSetting'), that);
        renderBidsTable.renderBidsRequireList(arr);
    });
}
/*
* 招标清单中的删除与输入事件
* */
exports.initBidsListEvent = function (type) {
    $('#bidList').find('a').click(function () {
        var that = this;
        var arr = delItem($('#bidList'), that);
        renderBidsTable._renderBidListTable(arr, type);
    });
    $('#bidList').find('input').on('blur', function () {//失焦时tr得到数量或说明属性
        var iptType = $(this).data('type');
        $(this).parents('tr').data('item')[iptType] = $(this).val();
    });
}

function delItem(modal, that, type) {
    var arr = [];//arr为删除一项后剩下的tr数组
    modal.find('tr').each(function () {
        arr.push($(this).data('item'));
    });
    var index = $(that).parents('tr').prevAll('tr').length;
    arr.splice(index, 1);
    if (type === 'invite') {
        $('.sup-count').html(arr.length);
    }
    return arr;
}

function checkBidType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return 'material';
        case 2:
            return 'labor';
        case 3:
            return 'step';
        case 4:
            return 'subpackage';
        case 5:
            return 'supplier';
    }
}

/*
* 招标公告
* */
exports.initAllBidsEvent = function () {

}

exports.initBidItemEvent = function (parent) {
    var items = $('.bid-item');
    var back = $('.back-to-list');
    items.click(function (e) {
        common.stopPropagation(e);
        var data = {};
        var itemId = $(this).data('item').id;
        $('.bid-item-list').hide();
        $('.bid-item-detail').show();
        $('.employee-name').html('评标');
        $("[name=noInfoBidsList_page]").hide();
        back.show();
        var id = $(this).data('item').id;
        initBidsFunc.getBidInfoFunc(id);//获取投标单位
        $('.failure').off('click').on('click',function(e){//流标事件
            common.stopPropagation(e);
            var failureMod = Modal('提示', failureModal());
            failureMod.showClose();
            failureMod.show();
            failureMod.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                data.id = itemId;
                data.bidStatus = 4;
                initBidsFunc.putBidsInfoFunc(data);
            });
        });
    });
    back.click(function (e) {
        common.stopPropagation(e);
        $('.bid-item-list').show();
        $('.bid-item-detail').hide();
        $('.employee-name').html('招标公告');
        $("[name=noInfoBidsList_page]").show();
        back.hide();
    });
    parent.find('a').click(function(e){
        common.stopPropagation(e);
        console.log($(this).parents('.bid-item').data('item'));
        var data = {};
        var itemId = $(this).parents('.bid-item').data('item').id;
        if($(this).data('type') === 'edit'){
            console.log('edit');
            // window.location.href = '/bids/add';

        } else if($(this).data('type') === 'recall'){//撤销
            var recallMod = Modal('提示', recallModal());
            recallMod.showClose();
            recallMod.show();
            recallMod.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                data.id = itemId;
                data.bidStatus = 1;
                initBidsFunc.putBidsInfoFunc(data);
            });
        } else if($(this).data('type') === 'del'){//删除
            var delBidsRequireModal = Modal('提示', delModal());
            delBidsRequireModal.showClose();
            delBidsRequireModal.show();
            delBidsRequireModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                data.id = itemId;
                data.bidStatus = 9;
                initBidsFunc.putBidsInfoFunc(data);
            });
        }
    })
}
exports.initWinzheBidEvent = function () {
    $('.win-bid').click(function (e) {
        common.stopPropagation(e);
        $('.win-bid').removeClass('span-btn').addClass('span-btn');
        $('.win-the-bid').hide();
        $(this).removeClass('span-btn');
        $(this).parents('.bid-company-item').find('.win-the-bid').show();
        console.log(111);
    });
}

/*
* 中标公示
* */
exports.initBidsNoticeEvent = function () {
    var items = $('.bid-item');
    var back = $('.back-to-list');
    items.click(function (e) {
        common.stopPropagation(e);
        $('.bid-item-list').hide();
        $('.bid-item-detail').show();
        $('.employee-name').html('评标');
        back.show();
    })
    back.click(function (e) {
        common.stopPropagation(e);
        $('.bid-item-list').show();
        $('.bid-item-detail').hide();
        $('.employee-name').html('中标公示');
        back.hide();
    })
}

/*
* 设置
* */
exports.initBidsSettingEvent = function () {
    $(".add-type").click(function (e) {
        common.stopPropagation(e);
        var addType = Modal('添加条件', addTypeModal());
        addType.showClose();
        addType.show();
        addType.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var requireDesc = addType.$body.find('[name=requireDesc]').val();
            initBidsFunc.postInfoModalFunc({requireDesc: requireDesc}, addType);
        });
    });
}
/*
* 设置 编辑和删除事件
* */
exports.initInfoListEvent = function () {
    $('#bidRequireList').find('a').click(function (e) {
        common.stopPropagation(e);
        var requireDesc = $(this).parents('tr').data('item').requireDesc;
        var bidId = $(this).parents('tr').data('item').id;
        if ($(this).data('type') === 'edit') {
            var changeType = Modal('更改条件', addTypeModal());
            changeType.showClose();
            changeType.show();
            changeType.$body.find('[name=requireDesc]').val(requireDesc);
            changeType.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var requireDesc = changeType.$body.find('[name=requireDesc]').val();
                initBidsFunc.putInfoModalFunc(bidId, {requireDesc: requireDesc}, changeType);
            });
        } else if ($(this).data('type') === 'delete') {
            var delBidsRequireModal = Modal('提示', delModal());
            delBidsRequireModal.showClose();
            delBidsRequireModal.show();
            delBidsRequireModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                initBidsFunc.delInfoModalFunc(bidId, delBidsRequireModal);
            });
        }
    });
}