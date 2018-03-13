var initEvent = require('./initEvent');
var contractInitEvent = require('../contractManager/initEvent');
var projectInitEvent = require('../initEvent');

exports.renderBalanceTable = function (list, page) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoBalanceTable_main').show();
        $('#noInfoBalanceTable_search').show();
        $('[name="noInfoBalanceTable_page"]').show();
        $('#noInfoBalanceTable').hide();
    } else {
        $('#noInfoBalanceTable_main').hide();
        // $('#noInfoBalanceTable_search').hide();
        $('[name="noInfoBalanceTable_page"]').hide();
        $('#noInfoBalanceTable').show();
    }
    var parents = $('#balanceTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var handler = '';
        var costNo = item.costNo || '';
        if (item.cntrStatus === 9 || item.cntrStatus === 12) {
            handler = '<a class="confirm-hover" data-type="update">修改</a><div class="icon-line" style="margin: 0 10px;"></div><a class="delete-hover" data-type="delete">删除</a>'
        } else {
            // handler = '<a class="confirm-hover" data-type="detail">详情</a><div class="icon-line" style="margin: 0 10px;"></div><a class="confirm-hover" data-type="approval">审批</a>'
            handler = '<a class="confirm-hover" data-type="detail">详情</a>'
        }
        var cntrNo = item.cntrNo || '';
        var cntrChargeName = item.cntrChargeName || '';
        var dom = $('<tr style="cursor: pointer" class="trHeightLight-hover">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.settleName + '</td>\
      <td class="border">' + item.settleNo + '</td>\
      <td class="border">' + item.settUserName + '</td>\
      <td class="border">' + parseStatus2(item.cntrStatus) + '</td>\
      <td class="border">' + cntrNo + '</td>\
      <td class="border">' + cntrChargeName + '</td>\
      <td class="border">' + costNo + '</td>\
      <td class="border">' + parseStatus3(item.costStatus, item.cntrStatus) + '</td>\
      <td class="border">\
      ' + handler + '\
      </td>\
  </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initBalanceTableEvent(parents, page);
};

function parseStatus3(type, type2) {
    type = parseInt(type);
    if (type === 1) {
        return '费用待提交';
    } else if (type === 2) {
        return '审批中';
    } else if (type === 3) {
        return '已通过';
    } else if (type === 4) {
        return '已驳回';
    } else if( type2 === 11){
        return '费用待生成';
    } else {
        return '';
    }
}

function parseType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '有合同结算';
        case 2:
            return '无合同结算';
    }
}

function parseStatus(status) {
    status = parseInt(status);
    switch (status) {
        // case 3:
        //   return '未结算';
        // case 9:
        //   return '已保存';
        // case 10:
        //   return '结算审批中';
        // case 11:
        //   return '已确认';
        // case 12:
        //   return '未通过';
        case 1:
            return '未结算';
        case 9:
            return '结算已保存';
        case 10:
            return '结算审批中';
        case 11:
            return '结算已完成';
        case 12:
            return '结算被驳回';
        default:
            return '未结算';
    }
}

function parseStatus2(status) {
    status = parseInt(status);
    switch (status) {
        case 3:
            return '未结算';
        case 9:
            return '已保存';
        case 10:
            return '审批中';
        case 11:
            return '已确认';
        case 12:
            return '未通过';
    }
}

/**
 * 绘制所属分部
 * @param list
 * @param first
 * @param callback
 */
exports.renderNewNoContractBalance = function (list, first, callback) {
    list = list || [];
    var parents = $('#subProjId').html('');
    if (first) {
        $('<option value="a">请选择</option>').appendTo(parents);
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.subProjName);
        dom.appendTo(parents);
    }
    if (callback) {
        callback();
    }
};
/**
 * 绘制合同类型
 * @param list
 * @param first
 * @param modal
 * @param callback
 */
exports.renderContractNoBalanceSelect = function (list, first, modal, callback) {
    list = list || [];
    var parents = modal.$body.find('#contractDetail').html('');
    if (first) {
        $('<option value="a">请选择</option>').appendTo(parents);
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.cntrName);
        dom.data('item', item);
        dom.appendTo(parents);
    }
    if (callback) {
        callback(parents);
    }
    initEvent.initNewContractBalanceOrder(parents, modal);
};


exports.renderNoContractBalanceObj = function (obj, attach, level) {
    if (level === 'detail') {
        var cntrType;
        var settlementType;
        if (obj.cntrType === 3) {
            cntrType = '分包合同';
        } else if (obj.cntrType === 4) {
            cntrType = '劳务合同';
        } else if (obj.cntrType === 5) {
            cntrType = '租赁合同';
        } else if (obj.cntrType === 6) {
            cntrType = '加工运输合同';
        }
        if (obj.settlementType === 1) {
            settlementType = '固定总价';
        } else if (obj.settlementType === 2) {
            settlementType = '固定综合单价';
        }
        $('.save').hide();
        $('.budget-menus a').eq(0).addClass('active');
        $('#subProjId').html(obj.subProjId);//所属分部
        $('[name=settleName]').html(obj.settleName);//结算单命名
        $('.settUserNo').text(obj.cntrChargeName);//款项负责人
        $('.supplierType').text(obj.cntrParty);//合作方
        $('[name=settUserName]').html(obj.settUserName);//合同分类
        $('[name=cntrType]').html(cntrType);//合同分类
        $('[name=settlementType]').html(settlementType);//结算方式
        $('[name=cntrPrice]').html(obj.cntrPrice + '元');//约定价格
        $('[name=taxType][value=' + obj.taxType + ']').prop('checked', true);//是否含税
        $('[name=cntrStartTime]').val(obj.cntrStartTime);//合同开始时间
        $('[name=cntrStartTime-check]').html(obj.cntrStartTime);//合同开始时间
        $('[name=cntrEndTime]').val(obj.cntrEndTime);//合同结束时间
        $('[name=cntrEndTime-check]').html(obj.cntrEndTime);//合同结束时间
        $('[name=payTypeDesc]').html(obj.payTypeDesc);//付款方式
        $('[name=ensurePer]').html(obj.ensurePer);//质保金
        $('[name=ensureMonth]').html(obj.ensureMonth);//期限
        $('[name=cntrContent]').html(obj.cntrContent);//工作内容
        $('[name=otherDesc]').html(obj.otherDesc);//其他条款
        $('[name=cntrEndTime]').change();//计算天数
        // var $attach = obj.attaches || [];
        // for (var i = 0, length = $attach.length; i < length; i++) {
        //     attach.appendAttach($attach[i]);
        // }
        $('.UploadAttach>div').eq(0).hide();
        var $attach = obj.attaches || [];
        for (var i = 0, length = $attach.length; i < length; i++) {
            attach.TempAttach($attach[i], 'appendAttach');
        }
    } else {
        $('#subProjId').val(obj.subProjId);//所属分部
        $('[name=settleName]').val(obj.settleName);//结算单命名
        $('.settUserNo').data('user', {userNo: obj.cntrChargeNo, userName: obj.cntrChargeName});
        $('.settUserNo').text(obj.cntrChargeName);
        $('.supplierType').text(obj.cntrParty);
        $('.supplierList').data('item', {id: obj.entprId, entpName: obj.cntrParty});
        $('[name=cntrType]').val(obj.cntrType);
        $('[name=settlementType]').val(obj.settlementType);
        $('[name=cntrPrice]').val(obj.cntrPrice);
        $('[name=taxType][value=' + obj.taxType + ']').prop('checked', true);
        $('[name=cntrStartTime]').val(obj.cntrStartTime);
        $('[name=cntrEndTime]').val(obj.cntrEndTime);
        $('[name=payTypeDesc]').val(obj.payTypeDesc);
        $('[name=ensurePer]').val(obj.ensurePer);
        $('[name=ensureMonth]').val(obj.ensureMonth);
        $('[name=cntrContent]').val(obj.cntrContent);
        $('[name=otherDesc]').val(obj.otherDesc);
        $('[name=cntrEndTime]').change();
        var $attach = obj.attaches || [];
        for (var i = 0, length = $attach.length; i < length; i++) {
            attach.TempAttach($attach[i], 'appendAttach');
        }
    }
};
/**
 * 绘制结算资源table
 * @param list
 */
exports.renderResourceContractTable = function (list) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    if (list.length > 0) {
        $('#noInfoResourceTable_search').show();
        $('#noInfoResourceTable_main').show();
        $('[name="noInfoResourceTable_page"]').show();
        $('#noInfoResourceTable').hide();
    } else {
        // $('#noInfoResourceTable_search').hide();
        $('#noInfoResourceTable_main').hide();
        $('[name="noInfoResourceTable_page"]').hide();
        $('#noInfoResourceTable').show();
    }
    var parents = $('#resourceTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="active small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.cntrNo + '</td>\
      <td class="border">' + item.cntrName + '</td>\
      <td class="border">' + item.entpName + '</td>\
      <td class="border">' + parseStatus(item.cntrStatus) + '</td>\
      <td class="border">' + parseSettleType(item.settleType) + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};

function parseSettleType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '固定总价';
        case 2:
            return '固定综合单价';
    }
}

/**
 * 绘制结算单table
 * @param list
 */
exports.renderBalanceOrderDetailTable = function (list, cntrStatus) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoContractDetail_main').show();
        $('#noInfoContractDetail_footer').show();
        $('#noInfoContractDetail').hide();
    } else {
        $('#noInfoContractDetail_main').hide();
        $('#noInfoContractDetail_footer').hide();
        $('#noInfoContractDetail').show();
    }
    var pItem = $('.contract-detail').data('item');
    var parents = $('#contractDetail').html('');
    var sumSettlePrice = 0
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var handler = '';
        var type = '合同项';
        var dom = '';
        var excpCount = '无';
        var _cntrStatus;
        if (item.excpSettleCount && item.excpSettleCount > 0) {
            excpCount = '<div class="exceptionModal" style="cursor:pointer;color:#de6d0b">' + item.excpSettleCount + '</div>';
        }
        var attachCount = item.attachCount > 0 ? '<span class="icon-red-dot">' + item.attachCount + '</span>' : ''
        var countAtt = item.attachCount > 0 ? '' : 'no-attach'
        var settleQpy = item.settleQpy || 0;
        var settlePrice = item.settlePrice || 0;
        var settleMoney = item.settleMoney || 0;
        sumSettlePrice += settleMoney;
        _cntrStatus = cntrStatus ? cntrStatus : $('#balanceTable .trHeightLight-hover.trHeightLight').data('item').cntrStatus;
        if (_cntrStatus === 9 || _cntrStatus === 12) {
            handler = '<a class="confirm-hover" data-type="balance">结算</a><div class="icon-line" style="margin:0 10px;"></div><a class="confirm-hover" data-type="upload">上传附件</a>';
        } else {
            handler = '<a class="confirm-hover" data-type="balance">结算</a>';
        }
        if (item.baseType === 2) {
            type = '增项';
            handler = '<a class="confirm-hover" data-type="balance">结算</a>\
                   <div class="icon-line"></div>\
                   <a class="confirm-hover" data-type="update">修改</a>\
                   <div class="icon-line"></div>\
                   <a class="delete-hover" data-type="delete">删除</a>';
        }
        if (pItem.baseType === 2) {//无合同
            dom = $('<tr class="small active">\
      <td class="border">' + count + '</td>\
      <td class="border">' + type + '</td>\
      <td class="border">' + item.workName + '</td>\
      <td class="border" title="' + item.workContent + '">\
      <div style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">\
            ' + item.workContent + '</div></td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + settleQpy + '</td>\
      <td class="border">' + settlePrice + '</td>\
      <td class="border">' + settleMoney + '</td>\
      <td class="border"><div class="icon-arrow-gray ' + countAtt + '">' + attachCount + '</div></td>\
      <td class="border">' + handler + '</td>\
      <td class="border">' + excpCount + '</td>\
      </tr>');
        } else {  // 合同项
            var cntrQpy = item.cntrQpy || '';
            var cntrPrice = item.cntrPrice || '';
            dom = $('<tr class="small active">\
      <td class="border">' + count + '</td>\
      <td class="border">' + type + '</td>\
      <td class="border">' + item.workName + '</td>\
      <td class="border" title="' + item.workContent + '">\
      <div style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">\
            ' + item.workContent + '</div></td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + cntrQpy + '</td>\
      <td class="border">' + cntrPrice + '</td>\
      <td class="border">' + settleQpy + '</td>\
      <td class="border">' + settlePrice + '</td>\
      <td class="border">' + settleMoney + '</td>\
      <td class="border"><div class="icon-arrow-gray  ' + countAtt + '">' + attachCount + '</div></td>\
      <td class="border">' + handler + '</td>\
      <td class="border">' + excpCount + '</td>\
      </tr>');
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    $('.settlePrice').text(sumSettlePrice);
    initEvent.initBalanceOrderTableEvent(parents, _cntrStatus);
};
/**
 *
 * @param list
 * @param modal
 */
exports.renderBalanceModalTable = function (list, modal, type) {
    list = list || [];
    var parents = modal.$body.find('#balanceContractModal').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var settleQpy = item.settleQpy || 0;
        var settlePrice = item.settlePrice || 0;
        var dom = '';
        if (type === 1) {
            dom = $('<tr class="small old" >\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.workRealType + '</td>\
      <td class="border">' + item.workName + '</td>\
      <td class="border">' + item.workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border cntrQpy">' + item.cntrQpy + '</td>\
      <td class="border cntrPrice">' + item.cntrPrice + '</td>\
      <td class="border"><input type="text" placeholder="填写" value="' + settleQpy + '" name="settleQpy"></td>\
      <td class="border"><input type="text" placeholder="填写" value="' + settlePrice + '" name="settlePrice"></td>\
      </tr>');
        } else {
            dom = $('<tr class="small old">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.workRealType + '</td>\
      <td class="border">' + item.workName + '</td>\
      <td class="border">' + item.workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border"><input type="text" placeholder="填写" value="' + settleQpy + '" name="settleQpy"></td>\
      <td class="border"><input type="text" placeholder="填写" value="' + settlePrice + '" name="settlePrice"></td>\
      <td class="border"><a class="delete-hover">删除</a></td>\
      </tr>');
        }
        dom.data('item', item.id);
        dom.data('old', item);
        dom.appendTo(parents);
    }
    initEvent.initModalBalanceEvent(parents, modal);
};

exports.renderContractItem = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('#balanceContractModal').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var settleQpy = item.settleQpy || 0;
        var settlePrice = item.settlePrice || 0;
        var dom = '';
        dom = $('<tr class="small old" >\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.workRealType + '</td>\
      <td class="border">' + item.workName + '</td>\
      <td class="border">' + item.workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border cntrQpy">' + item.cntrQpy + '</td>\
      <td class="border cntrPrice">' + item.cntrPrice + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};
/**
 * 绘制费用单详情
 * @param obj
 */
exports.renderBalanceConstOrder = function (obj, modal) {
    obj = obj ? obj : {cntr: {}, entp: {}, settleCost: {}}
    var cntr = obj.cntr;
    var entp = obj.entp;
    var settleCost = obj.settleCost;
    var ensureMoney = cntr.ensurePer || 0
    var ensureMonth = cntr.ensureMonth || 0
    modal.$body.find('.subProjName').html(cntr.subProjName)
    if (JSON.parse(localStorage.getItem('user')).employee.userNo != settleCost.acctChargeNo) {
        modal.$body.find('.confirm').hide();
    } else {
        modal.$body.find('.confirm').show();
    }
    modal.$body.find('[name=costName]').val(settleCost.costName);
    modal.$body.find('.costNo').html(settleCost.costNo);
    modal.$body.find('.settleName').html(cntr.settleName);
    modal.$body.find('.settleNo').html(cntr.settleNo);
    modal.$body.find('.settUserName').html(cntr.settUserName);
    modal.$body.find('.acctChargeName').html(settleCost.acctChargeName);
    modal.$body.find('.settleMoney').html(settleCost.costMoney);
    modal.$body.find('.taxMoney').html(settleCost.taxMoney);
    modal.$body.find('.cntrName').html(cntr.cntrName || '无');
    modal.$body.find('.cntrNo').html(cntr.cntrNo || '无');
    modal.$body.find('.entpName').html(cntr.cntrParty);
    modal.$body.find('.cntrPrice').html(cntr.cntrPrice);
    var taxType = cntr.taxType === 1 ? '是' : '否';
    modal.$body.find('[name="taxType"]').html(taxType);
    modal.$body.find('.ensureMoney').html(ensureMoney + "%");
    modal.$body.find('.ensureMonth').html(ensureMonth + '个月');
    modal.$body.find('.payTypeDesc').html(cntr.payTypeDesc);
    modal.$body.find('.openBank').html(entp.openBank);
    modal.$body.find('.openName').html(entp.openName);
    modal.$body.find('.bankCard').html(entp.bankCard);
    modal.$body.find('.contactName').html(entp.contactName);
    var settleEnsureMoney = settleCost.ensureMoney ? settleCost.ensureMoney : settleCost.ensureMoney === 0 ? 0 : '';
    var settleEnsureMonth = settleCost.ensureMoth ? settleCost.ensureMoth : settleCost.ensureMoth === 0 ? 0 : '';
    modal.$body.find('[name=ensurePayMoney]').val(settleEnsureMoney);
    modal.$body.find('[name=ensurePayMonth]').val(settleEnsureMonth);
    modal.$body.find('[name=remark]').val(settleCost.remark || '');
    var costMoney = settleCost.costMoney || 0;
    var taxMoney = settleCost.taxMoney || 0;
    var prepayMoney = settleCost.prepayMoney || 0;
    var prepayTaxMoney = settleCost.prepayTaxMoney || 0;
    var payableMoney = (costMoney - prepayMoney).toFixed(2);
    var payableTaxMoney = (taxMoney - prepayTaxMoney).toFixed(2);
    modal.$body.find('.payedMoney').html('已支付金额:(' + prepayMoney + '元)');
    modal.$body.find('.payedTaxMoney').html('已提供票税:(' + prepayTaxMoney + '元)');
    modal.$body.find('.payableMoney').html(payableMoney);
    modal.$body.find('.payableTaxMoney').html(payableTaxMoney);
    modal.$body.find('.confirm').data('item', settleCost);
};

/**
 * 绘制附件列表
 * @param list
 * @param modal
 */
exports.renderSubItemAttachModalList = function (list, modal, check) {
    list = list || [];
    var parents = modal.$body.find('.modal-attach-list').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = this.renderAttachItem(item, check);
        dom.appendTo(parents);
    }
};

exports.renderAttachItem = function (item, check) {
    var type = item.attachType;
    var handler;
    if (check) {
        handler = '<a data-type="upload" href="' + window.API_PATH + '/customer/attach/download?filePath=' + item.attachUrl + '">下载</a><div class="icon-line" style="margin: 0 5px;"></div>';
        if (type === 'jpg' || type === 'png' || type === 'pdf' || type === 'txt'
            || type === 'JPG' || type === 'PNG' || type === 'PDF' || type === 'TXT') {
            type = 'jpeg';
            handler = '<a data-type="review">预览</a><div class="icon-line" style="margin: 0 5px;"></div><a data-type="upload"  href="' + window.API_PATH + '/customer/attach/download?filePath=' + item.attachUrl + '">下载</a><div class="icon-line" style="margin: 0 5px;"></div>';
        }
    } else {
        handler = '<a data-type="upload" href="' + window.API_PATH + '/customer/attach/download?filePath=' + item.attachUrl + '">下载</a><div class="icon-line" style="margin: 0 5px;"></div><a data-type="delete">删除</a>';
        if (type === 'jpg' || type === 'png' || type === 'pdf' || type === 'txt'
            || type === 'JPG' || type === 'PNG' || type === 'PDF' || type === 'TXT') {
            type = 'jpeg';
            handler = '<a data-type="review">预览</a><div class="icon-line" style="margin: 0 5px;"></div><a data-type="upload"  href="' + window.API_PATH + '/customer/attach/download?filePath=' + item.attachUrl + '">下载</a><div class="icon-line" style="margin: 0 5px;"></div><a data-type="delete">删除</a>';
        }
    }

    var dom = $("<div class='attach-item' style='border-bottom: 1px solid #f2f2f2;padding-bottom: 10px;'>\
                    <div class='icon-file " + type + "'></div>\
                    <div class='detail'>\
                     <div class='filename'>" + item.attachName + "</div>\
                     <div class='remove'>\
                     " + handler + "\
                     </div>\
                    </div>\
                   </div>");
    dom.data('item', item);
    initEvent.initAttachSubItemEvent(dom);
    return dom;
};

/**
 * 绘制增项附件
 * @param list
 * @param attach
 */
exports.renderAttachModal = function (list, attach) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        attach.TempAttach(item, 'appendAttach');
    }
};


/**
 * 绘制预算添加的modal
 * @param list
 * @param modal
 * @param $list
 */
exports.renderContractBudgetModal = function (list, modal, $list) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var type = item.laborTypeName || item.measureTypeName || item.subletTypeName;
        var name = item.mtrlName || item.laborName || item.measureName || item.subletName;
        var workContent = item.workContent || item.specBrand;
        var lastQpy = item.lastQpy || item.lastQpy === 0 ? item.lastQpy : item.lastBudQpy;
        // var lastQpy = item.lastQpy || '预算外';
        var dom = $('<tr class="small">\
      <td class="border"><input type="checkbox"></td>\
      <td class="border">' + type + '</td>\
      <td class="border">' + name + '</td>\
      <td class="border">' + workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + item.budPrice + '</td>\
      <td class="border">' + lastQpy + '</td>\
      </tr>');
        var workType = '';
        var workId = '';
        if (item.laborTypeName) {
            workType = 3;
            workId = item.laborId;
        } else if (item.measureTypeName) {
            workType = 4;
            workId = item.measureId;
        } else if (item.subletTypeName) {
            workType = 5;
            workId = item.subletId;
        }
        for (var j = 0, $lenght = $list.length; j < $lenght; j++) {
            if (workId === $list[j].workId && workType === $list[j].workType) {
                dom.find('[type=checkbox]').prop('checked', true);
            }
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    // var page = $('#page').html('');
    // var $page = new Page(page, {
    //     pageSize: [10, 20, 30], // 设置每页显示条数按钮
    //     size: 10 // 默认每页显示多少条
    // });
    contractInitEvent.initBudgetModalTbodyEvent(modal);
};

exports.renderBalanceModalDom = function (obj, modal) {
    modal.$body.find('[name=settleQpyFormula]').val(obj.settleQpyFormula)
}