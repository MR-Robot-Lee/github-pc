var initEvent = require('./initEvent');
var materialPlanOrderTr = require('./table/materialPlanOrderTr.ejs');
var materialPurchaseOrderTr = require('./table/materialPurchaseOrderTr.ejs');
var materialAcceptOrderTr = require('./table/materialCheckOrderTr.ejs');

var materialCostOrderTr = require('./table/materialCostOrderTr.ejs');
var materialSuccessfulBidTr = require('./table/materialSuccessfulBidTr.ejs');
/**
 * 材料计划table
 * @param list
 */
exports.renderMaterialPlanTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        // $('#noInfoMaterialPlanTable_search').show();
        $('#noInfoMaterialPlanTable_main').show();
        $('.noInfoMaterialPlanTable_page').show();
        $('#noInfoMaterialPlanTable').hide();
    } else {
        // $('#noInfoMaterialPlanTable_search').hide();
        $('#noInfoMaterialPlanTable_main').hide();
        $('.noInfoMaterialPlanTable_page').hide();
        $('#noInfoMaterialPlanTable').show();
    }
    var parents = $('#materialPlanTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var planStatus = '<a class="confirm-hover" data-type="detail">详情</a>';
        if (item.planStatus === 1 || item.planStatus === 4) {
            planStatus = '<a class="confirm-hover" data-type="update">修改</a> <div class="icon-line"></div> <a class="delete-hover" data-type="delete">删除</a>'
        }
        // else if (item.planStatus === 4) {
        //     planStatus = '<a class="confirm-hover" data-type="update">修改</a> <div class="icon-line"></div> <a class="delete-hover" data-type="detail">详情</a>'
        // }
        var dom = $('<tr class="small trHeightLight-hover" style="cursor: pointer;">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlPlanName + '</td>\
                  <td class="border">' + item.mtrlPlanNo + '</td>\
                  <td class="border">' + parsePlanStatus(item.planType, item.planStatus) + '</td>\
                  <td class="border">' + item.planUserName + '</td>\
                  <td class="border">' + moment(item.planTime).format('YYYY/MM/DD') + '</td>\
                  <td class="border" style="position: relative">' + planStatus + '</td>\
                </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialPlanTableEvent(parents);
};

function parsePlanType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '采购计划';
        case 2:
            return '招标计划';
    }
}

function parsePlanStatus(type, status) {
    status = parseInt(status);
    if (type === 1) {
        switch (status) {
            case 0:
                return '全部';
            case 1:
                return '已保存';
            case 2:
                return '审批中';
            case 3:
                return '待采购';
            case 4:
                return '未通过';
            case 5:
                return '待点收';
            case 6:
                return '待生成费用';
            case 7:
                return '已生成费用';
            default:
                return '';
        }
    } else {
        switch (status) {
            case 0:
                return '全部';
            case 1:
                return '已保存';
            case 2:
                return '审批中';
            case 3:
                return '待招标';
            case 4:
                return '未通过';
            case 5:
                return '已发布';
            default:
                return '';
        }
    }
}

/**
 * 绘制计划单table
 * @param list
 * @param parents
 */
exports.renderMaterialPlanOrderTable = function (list, parents) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoPlanList_main').show();
        $('#noInfoPlanList').hide();
        $('#noInfoMaterialManagerOrder_main').show();
        $('#noInfoMaterialManagerOrder').hide();
    } else {
        $('#noInfoPlanList_main').hide();
        $('#noInfoPlanList').show();
        $('#noInfoMaterialManagerOrder_main').hide();
        $('#noInfoMaterialManagerOrder').show();
    }
    var tbody = parents.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var mtrlCategoryName = item.mtrlCategoryName + '-' || '';
        var mtrlTypeName = item.mtrlTypeName || '';
        var type = mtrlCategoryName + mtrlTypeName;
        var dom = $(materialPlanOrderTr({
            count: count,
            name: item.subProjName,
            mtrlTypeName: type,
            mtrlName: item.mtrlName,
            specBrand: item.specBrand,
            unit: item.unit,
            planCount: item.planCount,
            mtrlBudPrice: item.planPrice,
            planTotalMoney: item.planTotalMoney,
            planRemark: item.planRemark
        }));
        if (item.planQpyExcpId) {
            var exception = dom.find('.exception');
            // $('<div class="icon-exception"></div>').appendTo(exception);
            exception.html(1).css('cursor', 'pointer');
            initEvent.initExceptionEvent(exception, 'plan');
        }
        dom.data('item', item);
        dom.appendTo(tbody);
    }
};
/**
 * 材料采购
 * @param list
 * @param parents
 */
exports.renderMaterialPurchaseOrderTable = function (list, parents) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoPurchase_main').show();
        $('#noInfoPurchase').hide();
    } else {
        $('#noInfoPurchase_main').hide();
        $('#noInfoPurchase').show();
    }
    var tbody = parents.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var prchTime = item.prchTime ? moment(item.prchTime).format('YYYY/MM/DD') : '';
        var acctType;
        if (item.acctType === 1) {
            // acctType = '实付款（无合同）';
            acctType = '实付款（采购支付）';
        } else if (item.acctType === 2) {
            // acctType = '应付款项';
            acctType = '应付款（财务挂账）';
        } else if (item.acctType === 3) {
            // acctType = '实付款（有合同）';
            acctType = '实付款（财务支付）';
        } else {
            acctType = '';
        }
        var dom = $(materialPurchaseOrderTr({
            canSelect: item.canSelect,
            count: count,
            mtrlName: item.mtrlName,
            specBrand: item.specBrand,
            unit: item.unit,
            prchCount: item.prchCount,
            prchPrice: item.prchPrice,
            prchTime: prchTime,
            acctType: acctType,
            prchPriceExcpId: item.prchPriceExcpId,
            prchPlace: item.prchPlace,
            entprName: item.entprName,
            prchTotalMoney: item.prchTotalMoney
        }));
        dom.find('[type=checkbox].pruchCheckbox').prop('checked', item.prchTaxType === 1);
        dom.find('[type=checkbox].pruchCheckbox').click(function (e) {
            return false;
        });
        if (item.prchPriceExcpId || item.prchQpyExcpId) {
            var exception = dom.find('.exception');
            exception.html(1).css('cursor', 'pointer');
            initEvent.initExceptionEvent(exception, 'purchase');
        }
        if (item.prchPriceExcpId && item.prchQpyExcpId) {
            var exception = dom.find('.exception');
            exception.html(2).css('cursor', 'pointer');
            initEvent.initExceptionEvent(exception, 'purchase');
        }
        dom.data('item', item);
        dom.appendTo(tbody);
    }
};
/**
 * 材料点收
 * @param list
 * @param parents
 */
exports.renderMaterialAcceptOrderTable = function (list, parents) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoCheckAndAccept_main').show();
        $('#noInfoCheckAndAccept').hide();
    } else {
        $('#noInfoCheckAndAccept_main').hide();
        $('#noInfoCheckAndAccept').show();
    }
    var tbody = parents.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $(materialAcceptOrderTr({
            count: count,
            mtrlName: item.mtrlName,
            specBrand: item.specBrand,
            unit: item.unit,
            prchCount: item.prchCount,
            prchPrice: item.prchPrice,
            prchTime: moment(item.prchTime).format('YYYY/MM/DD'),
            checkQpyExcpId: item.checkQpyExcpId,
            prchPlace: item.prchPlace,
            entprName: item.entprName,
            prchTotalMoney: item.prchTotalMoney,
            checkCount: item.checkCount
        }));
        if (item.checkQpyExcpId) {
            var exception = dom.find('.exception');
            exception.html(1).css('cursor', 'pointer');
            initEvent.initExceptionEvent(exception, 'plan');
        }
        dom.data('item', item);
        dom.appendTo(tbody);
    }
};
/**
 * 绘制费用单列表
 * @param list
 * @param parents
 */
exports.renderCostMaterialOrderList = function (list, parents) {
    list = list || [];
    var $parents = parents.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var acctType;
        if (item.acctType === 1) {
            // acctType = '实付款（无合同）';
            acctType = '实付款（采购支付）';
        } else if (item.acctType === 2) {
            // acctType = '应付款项';
            acctType = '应付款（财务挂账）';
        } else if (item.acctType === 3) {
            // acctType = '实付款（有合同）';
            acctType = '实付款（财务支付）';
        }
        var dom = $(materialCostOrderTr({
            count: count,
            costNo: item.costNo,
            costName: item.costName,
            subProjName: item.subProjName,
            acctType: acctType,
            costMoney: item.costMoney,
            taxMoney: item.taxMoney,
            status: parseCostOrder(item.status),
            entprName: item.entprName,
            prepayMoney: item.prepayMoney || 0
        }));
        dom.data('item', item);
        dom.appendTo($parents);
    }
    initEvent.initCostOrderTableEvent($parents);
};

function parseCostOrder(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '未提交';
        case 2:
            return '审批中';
        case 3:
            return '已同意';
        case 4:
            return '已驳回';
    }
}

exports.renderSuccessfullBidOrderTable = function (list, parents) {
    list = list || [];
    var tbody = parents.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = i + 1;
        var mtrlCategoryName = item.mtrlCategoryName + '-' || '';
        var mtrlTypeName = item.mtrlTypeName || '';
        var type = mtrlCategoryName + mtrlTypeName;
        var bidTaxType = item.bidTaxType === 1 ? '是' : item.bidTaxType === 2 ? '否' : '';
        var dom = $(materialSuccessfulBidTr({
            count: count,
            subProjName: item.subProjName,
            mtrlTypeName: type,
            mtrlName: item.mtrlName,
            specBrand: item.specBrand,
            unit: item.unit,
            bidCount: item.planCount,
            bidPrice: item.bidPrice,
            bidTotalMoney: item.bidTotalMoney,
            bidRemark: item.bidRemark,
            entprName: item.entprName,
            bidPlace: item.bidPlace,
            bidTaxType: bidTaxType
        }));
        if (item.bidPriceExcpId || item.bidQpyExcpId) {
            var exception = dom.find('.exception');
            exception.html(1).css('cursor', 'pointer');
            initEvent.initExceptionEvent(exception, 'purchase');
        }
        dom.data('item', item);
        dom.appendTo(tbody);
    }
};
exports.rendersuccessFullBidOrderTableDom = function (obj) {
    if (obj) {
        $('#costOrderNo').hide();
        $('.materialManagerOrder').show();
    } else {
        $('.materialManagerOrder').hide();
        $('#costOrderNo').show();
    }
};
/**
 * 绘制预算内选材table
 * @param modal
 * @param list
 * @param newList
 */
exports.renderBudgetInsideModalTable = function (modal, list, newList, subProjId) {
    list = list || [];
    newList = newList || [];
    var tbody = modal.$body.find('#costBudget tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var lastQpy = item.lastQpy || item.lastQpy === 0 ? item.lastQpy : '预算外';
        var dom = $('<tr class="active small">\
                  <td class="border"><input type="checkbox"></td>\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlCategoryName + '-' + item.mtrlTypeName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.budQpy + '</td>\
                  <td class="border">' + lastQpy + '</td>\
                  <td class="border">' + item.budPrice + '</td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(tbody);
        for (var j = 0; j < newList.length; j++) {
            var type = newList[j].mtrlSource || newList[j].resourceType;
            if (item.mtrlId === newList[j].mtrlId && type === 1 && (item.subProjId && item.subProjId.toString()) === subProjId) { // todo 测试后再定夺
                dom.find('[type=checkbox]').prop('checked', true);
            }
        }
        if (modal.$body.find('#costBudget tbody [type=checkbox]:checked').length > 0) {
            modal.$body.find('#costBudget thead [type=checkbox]').prop('checked', true);
        }
    }
    initEvent.initBesideModalTableEvent(modal);
};
/**
 * 绘制预算内材料分部名称
 * @param modal
 * @param list
 * @param isFirst 是否全部
 */
exports.renderBudgetInsideModalSelect = function (modal, list, isFirst) {
    var subProject = '';
    if (modal) {
        subProject = modal.$body.find('.subProject').html('');
    } else {
        subProject = $('.subProject').html('');
    }
    list = list || [];

    if (modal) {
        $('<option value="a">请选择分部</option>').appendTo(subProject);
    }
    if (isFirst) {
        $('<option value="0">全部</option>').appendTo(subProject);
    }
    // $('<option value="0">全部</option>').appendTo(subProject);

    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.subProjName);
        dom.appendTo(subProject);
    }
};
exports.renderMaterialType = function (list) {
    var mtrlType = $('.mtrlType').html('');
    list = list || [];
    $('<option value="">全部</option>').appendTo(mtrlType);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.mtrlTypeName);
        dom.appendTo(mtrlType);
    }
};
exports.renderMaterialCategory = function (list) {
    var mtrlCategory = $('.mtrlCategory').html('');
    list = list || [];
    $('<option value="">全部</option>').appendTo(mtrlCategory);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.mtrlCategoryName);
        dom.appendTo(mtrlCategory);
    }
};
/**
 * 绘制预算内材料分类
 * @param modal
 * @param list
 */
exports.renderBudgetInsideModalSelectType = function (modal, list) {
    var materialType1 = modal.$body.find('.materialType1').html('');
    list = list || [];
    $('<option value="0">全部</option>').appendTo(materialType1);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.data('item', item.children);
        dom.text(item.mtrlCategoryName);
        dom.appendTo(materialType1);
    }
};
/**
 * 绘制预算外材料分类
 * @param modal
 * @param list
 */
exports.renderBudgetBeSideModalTable = function (modal, list) {
    var parents = modal.$body.find('tbody').html('');
    list = list || [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small active">\
                  <td class="border"><input type="checkbox"></td>\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlCategoryName + '-' + item.mtrlTypeName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.avgPrice + '</td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initBesideModalTableEvent(modal);
};
/**
 * 提计划绘制table
 * @param list
 * @param modal
 */
exports.renderPlanModal = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = 1 + i;
        var plancount = item.planCount ? item.planCount : '';
        var planRemark = item.planRemark ? item.planRemark : '';
        var price = item.mtrlBudPrice ? item.mtrlBudPrice : '';
        var dom = $('<tr class="active small">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.subProjName + '</td>\
                  <td class="border">' + item.mtrlTypeName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">\
                   <input type="text" data-warn="数量" name="planCount" placeholder="填写" value="' + plancount + '"/>\
                  </td>\
                  <td class="border"><input type="text" data-warn="单价"name="mtrlBudPrice" placeholder="填写" value="' + price + '"/></td>\
                  <td class="border"><input type="text" name="planRemark" placeholder="填写" value="' + planRemark + '"/></td>\
                  <td class="border">\
                   <a data-type="delete">删除</a>\
                  </td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialPlanModalTbodyEvent(modal);
};
/**
 * 采购单 绘制table
 * @param list
 * @param modal
 * @param type
 */
exports.renderPurchaseModal = function (list, modal, type) {
    type = type || 'old';
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = 1 + i;
        var planCount = item.prchCount || '';
        var planPrice = item.prchPrice || '';
        var prchPlace = item.prchPlace || '';
        var planTotalMoney = item.specBrand && item.prchTotalMoney ? '<div class="totalMoney">' + item.prchTotalMoney + '</div>' : '<div class="totalMoney">系统计算</div>';
        var entprName = item.entprName ? '<div class="supplierType" style="cursor:pointer;position: relative">' + item.entprName + '</div>' : '<div class="supplierType" style="cursor:pointer;position: relative">单击选择</div>'
        var prchTime = item.prchTime ? moment(item.prchTime).format('YYYY-MM-DD') : '';
        var dom = $('<tr class="small ' + type + '">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border"><input type="text" placeholder="填写" name="prchCount" value="' + planCount + '"/></td>\
                  <td class="border"><input type="text" placeholder="填写" name="prchPrice" value="' + planPrice + '"/></td>\
                  <td class="border">' + planTotalMoney + '</td>\
                  <td class="border">\
                  ' + entprName + ' \
                  <div id="' + item.entprId + '" class="supplierList"></div>\
                  </td>\
                  <td class="border"><input type="text" placeholder="填写" name="prchPlace" value="' + prchPlace + '"/></td>\
                  <td class="border"><input style="width: 160px; " type="date" class="int int-default int-small14 purchaseTime" value="' + prchTime + '">\
                  <td class="border">\
                  <div style="cursor:pointer;" class="planType">单击选择</div>\
                  <div class="planList"></div>\
                  </td>\
                  <td class="border"><input type="checkbox" name="prchTaxType"/></td>\
                  <td class="border"><div class="clearPlan" style="cursor: pointer;color: #009411;">清除</div></td>\
                 </tr>');
        dom.find('[type=checkbox]').prop('checked', item.prchTaxType === 1);
        if (item.acctType) {
            var prchType;
            if (item.acctType === 1) {
                // prchType = '实付款（无合同）';
                prchType = '实付款（采购支付）';
            } else if (item.acctType === 2) {
                // prchType = '应付款项';
                prchType = '应付款（财务挂账）';
            } else if (item.acctType === 3) {
                // prchType = '实付款（有合同）';
                prchType = '实付款（财务支付）';
            }
            dom.find('.planType').data('item', {acctType: item.prchType, text: prchType})
            dom.find('.planType').text(prchType)
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initPurchaseEditModalEvent(parents);

};
/**
 * 绘制点收modal
 * @param list
 * @param modal
 */
exports.renderAcceptModal = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = i + 1;
        var checkCount = item.checkCount ? item.checkCount : "";
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.mtrlName + '</td>\
      <td class="border">' + item.specBrand + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + item.prchCount + '</td>\
      <td class="border">' + item.prchPrice + '</td>\
      <td class="border">' + item.prchTotalMoney + '</td>\
      <td class="border">' + item.entprName + '</td>\
      <td class="border">' + item.prchPlace + '</td>\
      <td class="border">' + moment(item.prchTime).format('YYYY/MM/DD') + '</td>\
      <td class="border"><input type="text" placeholder="填写" style="width:60px" name="checkCount" value="' + checkCount + '"/></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};
/**
 * 绘制我的任务table
 * @param list
 */
exports.renderMyTaskTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoMyTaskTable_main').show();
        $('[name="noInfoMyTaskTable_page"]').show();
        $('#noInfoMyTaskTable').hide();
    } else {
        $('#noInfoMyTaskTable_main').hide();
        $('[name="noInfoMyTaskTable_page"]').hide();
        $('#noInfoMyTaskTable').show();
    }
    var parents = $('#myTaskTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var end = item.endTime ? moment(item.endTime).format('YYYY/MM/DD') : '未完成'
        var dom = $('<tr class="active small">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.planTypeName + '</td>\
                  <td class="border">' + item.mtrlPlanName + '</td>\
                  <td class="border">' + item.mtrlPlanNo + '</td>\
                  <td class="border">' + item.statusName + '</td>\
                  <td class="border">' + moment(item.beginTime).format('YYYY/MM/DD') + '</td>\
                  <td class="border">' + end + '</td>\
                 </tr>');
        dom.appendTo(parents);
    }
};
/**
 * 可计划量
 * @param list
 */
exports.renderMaterialPlanAmount = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoPlanAmountTable_main').show();
        $('[name="noInfoPlanAmountTable_page"]').show();
        $('#noInfoPlanAmountTable').hide();
    } else {
        $('#noInfoPlanAmountTable_main').hide();
        $('[name="noInfoPlanAmountTable_page"]').hide();
        $('#noInfoPlanAmountTable').show();
    }
    var parents = $('#planAmountTable').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = i + 1;
        var lastQpy = item.lastQpy || item.lastQpy === 0 ? item.lastQpy : '预算外';
        var dom = $('<tr class="small active">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.subProjName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.budQpy + '</td>\
                  <td class="border">' + lastQpy + '</td>\
                  <td class="border" style="position: relative">\
                   <a class="confirm-hover" data-type="purchase">计划单</a>\
                   <d class="icon-line"></d>\
                   <a class="confirm-hover" data-type="total">总量</a>\
                  </td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialPlanAmountTable(parents);
};
/**
 * 采购汇总
 * @param list
 *  <td class="border">' + parseStatus(item.mtrlSource) + '</td>\
 */
exports.renderMaterialPurchaseSumTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoPurchaseSumTable_main').show();
        $('[name="noInfoPurchaseSumTable_page"]').show();
        $('#noInfoPurchaseSumTable').hide();
    } else {
        $('#noInfoPurchaseSumTable_main').hide();
        $('[name="noInfoPurchaseSumTable_page"]').hide();
        $('#noInfoPurchaseSumTable').show();
    }
    var parents = $('#purchaseSumTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var prchTaxType = '<input type="checkbox" checked onclick="return false;" disabled/>';
        if (item.prchTaxType === 2) {
            prchTaxType = '<input type="checkbox" onclick="return false;" disabled/>';
        }
        var dom = $('<tr class="small active">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.prchCount + '</td>\
                  <td class="border">' + item.prchPrice + '</td>\
                  <td class="border">' + item.entprName + '</td>\
                  <td class="border">' + moment(item.prchTime).format('YYYY/MM/DD') + '</td>\
                  <td class="border">\
                  ' + prchTaxType + '\
                  </td>\
                 </tr>');
        dom.appendTo(parents);
    }
};

function parseStatus(status) {
    status = parseInt(status);
    switch (status) {
        case 1:
            return '预算内';
        case 2:
            return '预算外';
        case 3:
            return '辅材';
        default:
            return '';
    }
}

/**
 * 绘制库存量
 * @param list
 */
exports.renderStockPlanTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoPlanSummaryTable_main').show();
        $('[name="noInfoPlanSummaryTable_page"]').show();
        $('#noInfoPlanSummaryTable').hide();
    } else {
        $('#noInfoPlanSummaryTable_main').hide();
        $('[name="noInfoPlanSummaryTable_page"]').hide();
        $('#noInfoPlanSummaryTable').show();
    }
    var parents = $('#planSummaryTable').html('');
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var projMaterial = user.permission['projMaterial:stock:add'];
    if (!projMaterial) {
        $('.stockBorder').hide();
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var stock = '<td class="border" style="position: relative"><a class="confirm-hover" data-type="summary">出库</a></td>'
        if (!projMaterial) {
            stock = ''
        }
        var dom = $('<tr class="small trHeightLight-hover">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.subProjName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.prchCount + '</td>\
                  <td class="border">' + item.lastCount + '</td>\
                  ' + stock + '\
                  <td class="border">\
                   <a class="confirm-hover" data-type="check">查看出库</a>\
                   <div class="icon-line"></div>\
                   <a class="confirm-hover" data-type="purchase">查看采购</a>\
                  </td>\
                  </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initSummaryTableEvent(parents);
};
/**
 * 计划单input 绘制dom
 * @param obj
 */
exports.renderMaterialPlanOrderDom = function (obj) {
    $('#materialPlanDetail').data('item', obj);
    var planAppearTime = '';
    if (obj.planAppearTime) {
        planAppearTime = moment(obj.planAppearTime).format('YYYY-MM-DD')
    }
    var excpCount = obj.excpCount ? obj.excpCount + '项' : '0项';
    $('span[name=excpCount]').text(excpCount);
    $('input[name=planUser]').val(obj.planUserName);
    // LEE: 无采购人和点收人的时候，显示暂无
    $('input[name=prchUser]').val(obj.prchUserName ? obj.prchUserName : "暂无");
    $('input[name=checkUserName]').val(obj.checkUserName ? obj.checkUserName : "暂无");
    $('input[name=planAppearTime]').val(planAppearTime);
    $('input[name=planMoney]').val(obj.planMoney);
    $('input[name=outPlanMoney]').val(obj.outBudPlanMoney);
    $('span[name=approval]').text(parsePlanStatus(obj.planType, obj.planStatus));
};
/**
 * 采购单 input 绘制dom
 * @param obj
 */
exports.renderPurchaseOrderDom = function (obj) {
    var materialPlanDetail = $('#materialPlanDetail');
    materialPlanDetail.data('item', obj);
    var inputs = materialPlanDetail.find('.modal-form input[type=text]');
    for (var i = 0, length = inputs.length; i < length; i++) {
        var input = $(inputs[i]);
        var name = input.attr('name');
        input.val(obj[name] ? obj[name] : i > 1 ? 0.00 : '');
    }
    var realAppearTime = '';
    var prchTime = '';
    if (obj.realAppearTime) {
        realAppearTime = moment(obj.realAppearTime).format('YYYY-MM-DD')
    }
    if (obj.prchTime) {
        prchTime = moment(obj.prchTime).format('YYYY-MM-DD')
    }
    var excpCount = obj.excpCount ? obj.excpCount + '项' : '0项';
    $('span[name=excpCount]').text(excpCount);
    $('span[name=approval]').text(parsePlanStatus(obj.planType, obj.planStatus));
    $('input[name=realAppearTime]').val(realAppearTime);
    $('input[name=prchTime]').val(prchTime);
    // LEE:采购编辑完成确认后，更新点收人,如果没有，设为暂无
    $('input[name=checkUserName]').val(obj.checkUserName ? obj.checkUserName : '暂无');
};
/**
 * 中标
 * @param obj
 */
exports.renderSuccessFullBidDom = function (obj) {
    $('#materialPlanDetail').data('item', obj);
    var planAppearTime = '';
    if (obj.planAppearTime) {
        planAppearTime = moment(obj.planAppearTime).format('YYYY-MM-DD')
    }

    var excpCount = obj.excpCount ? obj.excpCount + '项' : '0项';
    $('span[name=excpCount]').text(excpCount);
    $('input[name=planUser]').val(obj.planUserName);
    $('input[name=prchUser]').val(obj.prchUserName);
    $('input[name=checkUserName]').val(obj.checkUserName);
    $('input[name=planAppearTime]').val(planAppearTime);
    $('input[name=planMoney]').val(obj.planMoney || 0);
    $('input[name=prchMoney]').val(obj.prchMoney || 0);
};
/**
 * 绘制 点收 input dom
 * @param obj
 */
exports.renderAcceptOrderDom = function (obj) {
    var materialPlanDetail = $('#materialPlanDetail');
    materialPlanDetail.data('item', obj);
    var inputs = materialPlanDetail.find('.modal-form input[type=text]');
    for (var i = 0, length = inputs.length; i < length; i++) {
        var input = $(inputs[i]);
        var name = input.attr('name');
        if (name === 'lastMoney') {
            var lastMoney = obj.prchMoney - obj.checkMoney;
            input.val(lastMoney);
        } else {
            input.val(obj[name]);
        }
    }
    var checkTime = '';
    if (obj.checkTime) {
        checkTime = moment(obj.checkTime).format('YYYY-MM-DD');
    }
    $('input[name=checkTime]').val(checkTime);
    $('input[name=checkTaxMoney]').val(obj.checkTaxMoney || 0);
    $('input[name=payableMoney]').val(obj.payableMoney || 0);
    $('[name=approval]').text(parsePlanStatus(obj.planType, obj.planStatus))
};
/**
 * 费用单
 * @param obj
 */
exports.renderMaterialCostOrderTable = function (obj) {
    obj = obj || {};
    var materialPlanDetail = $('#materialPlanDetail');
    var inputs = materialPlanDetail.find('.modal-form input[type=text]');
    for (var i = 0, length = inputs.length; i < length; i++) {
        var input = $(inputs[i]);
        var name = input.attr('name');
        input.val(obj[name]);
    }
    if (obj.addTime) {
        var addTime = moment(obj.addTime).format('YYYY-MM-DD');
    } else {
        var addTime = '-/-/-';
    }
    $('input[name=addTime]').val(addTime);
    $('input[name=unSubmitApprMoney]').val(obj.unSubmitApprMoney || 0);
}
/**
 * 绘制供应商类型
 * @param list
 * @param modal
 * @param $parents
 */
exports.renderSupplierTypeDom = function (list, modal, $parents) {
    list = list || [];
    var parents = modal.find('.supplierType').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<li>\
      <i class="icon-disc-item"></i>\
      <span>' + item.entpTypeName + '</span>\
      <i class="tz-date"></i>\
      </li>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initSupplierModalEvent(modal, $parents);
};
/**
 * 绘制供应商列表
 * @param list
 * @param modal
 * @param $parents
 */
exports.renderSupplierListDom = function (list, modal, $parents) {
    list = list || [];
    var parents = modal.find('.supplier-content-supplier');
    parents.html('');
    parents.show();
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<li>\
      <i class="icon-disc-item"></i>\
      <span>' + item.entpName + '</span>\
      </li>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initSupplierListModalEvent(modal, $parents);
};

exports.renderMaterialCostOrderDom = function (modal, obj, type) {
    obj = obj || {}
    obj.cntr = obj.cntr || {};
    obj.enterPrise = obj.enterPrise || {};
    obj.mtrlPlan = obj.mtrlPlan || {};
    obj.mtrlCost = obj.mtrlCost || {};
    if (!obj.cntr.id) {
        // modal.$body.find('#contractInfo').hide();
    } else {
        modal.$body.find('.openBank').html(obj.enterPrise.openBank);
        modal.$body.find('.openName').html(obj.enterPrise.openName);
        modal.$body.find('.bankCard').html(obj.enterPrise.bankCard);
        modal.$body.find('.contactName').html(obj.enterPrise.contactName);
        modal.$body.find('.cntrName').html(obj.cntr.cntrName);
        modal.$body.find('.cntrNo').html(obj.cntr.cntrNo);
        modal.$body.find('.cntrPrice').html(obj.cntr.cntrPrice);
        modal.$body.find('.payTypeDesc').html(obj.cntr.payTypeDesc);
        modal.$body.find('.ensureMoney').html(obj.cntr.ensurePer + '%');
        modal.$body.find('.ensureMonth').html(obj.cntr.ensureMonth + '个月');
        modal.$body.find('.entpName').html(obj.cntr.cntrParty);
        var taxType = obj.cntr.taxType === 1 ? "是" : '否';
        modal.$body.find('[name=taxType]').html(taxType);
    }
    modal.$body.find('.costNo').html(obj.mtrlCost.costNo);
    modal.$body.find('.subProjName').html(obj.mtrlCost.subProjName);
    modal.$body.find('.subProjName').data('subProjName', obj.mtrlCost.subProjName);
    modal.$body.find('.costMoney').html(obj.mtrlCost.costMoney);
    modal.$body.find('.taxMoney').html(obj.mtrlCost.taxMoney);
    modal.$body.find('.entprName').html(obj.mtrlCost.entprName);
    modal.$body.find('.entprName').data('entprId', obj.mtrlCost.entprId);
    modal.$body.find('.mtrlPlanName').html(obj.mtrlPlan.mtrlPlanName);
    modal.$body.find('.recObjName').html(obj.mtrlPlan.prchUserName);
    modal.$body.find('.chargeUserName').html(obj.mtrlCost.chargeUserName);
    modal.$body.find('.checkUserName').html(obj.mtrlPlan.checkUserName);
    modal.$body.find('.prchUserName').html(obj.mtrlPlan.prchUserName);
    modal.$body.find('.mtrlPlanNo').html(obj.mtrlPlan.mtrlPlanNo);
    modal.$body.find('.checkMoney').html(obj.mtrlPlan.checkMoney);
    modal.$body.find('.checkTaxMoney').html(obj.mtrlPlan.checkTaxMoney);
    modal.$body.find('.payableTaxMoney').html(obj.mtrlCost.payableTaxMoney);
    modal.$body.find('.payableMoney').html(obj.mtrlCost.payableMoney.toFixed(2));
    modal.$body.find('[name=ensureMoney]').val(obj.mtrlCost.ensureMoney);
    modal.$body.find('[name=ensureMonth]').val(obj.mtrlCost.ensureMonth);
    var payedMoney = obj.mtrlCost.prepayMoney || obj.mtrlCost.bookMoney;
    payedMoney = payedMoney ? '已支付金额:(' + payedMoney + '元)' : '已支付金额:(0元)';
    modal.$body.find('.payedMoney').html(payedMoney);
    var payedTaxMoney = obj.mtrlCost.prepayTaxMoney || obj.mtrlCost.bookTaxMoney;
    payedTaxMoney = payedTaxMoney ? '已提供税票:(' + payedTaxMoney + '元)' : '已提供税票:(0元)';
    modal.$body.find('.payedTaxMoney').html(payedTaxMoney);
    var addTime = obj.mtrlCost.addTime ? moment(obj.mtrlCost.addTime).format('YYYY/MM/DD') : '- / - / -'
    modal.$body.find('.project-time').html(addTime);
    if (type === 'cost') {
        modal.$body.find('.ensureMoney').val(obj.cntr.ensurePer + "％");
        modal.$body.find('.ensureMonth').val(obj.cntr.ensureMonth + '个月');
        modal.$body.find('.ensurePayMoney').html(obj.mtrlCost.ensureMoney + "元");
        modal.$body.find('.ensurePayMonth').html(obj.mtrlCost.ensureMonth + "个月");
        modal.$body.find('.remark').html(obj.mtrlCost.remark || '');
        modal.$body.find('.costName').html(obj.mtrlCost.costName);
    } else {
        modal.$body.find('[name=remark]').val(obj.mtrlCost.remark || "");
        modal.$body.find('[name=costName]').val(obj.mtrlCost.costName);
    }
};

exports.renderPruchaseOrderModalTable = function (list, parents) {
    list = list || [];
    var $parents = parents.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.mtrlPlanNo + '</td>\
      <td class="border">' + item.planCount + '</td>\
      </tr>');
        dom.appendTo($parents);
    }
};
/**
 * 绘制计划总量table
 * @param list
 * @param parents
 */
exports.renderPurchaseOrderTotalTable = function (list, parents) {
    list = list || [];
    var $parents = parents.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var totalQpy = parseInt(item.totalQpy * 100) / 100;
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.subitemNo + '</td>\
      <td class="border">' + totalQpy + '</td>\
      </tr>');
        dom.appendTo($parents);
    }
};
/**
 * 绘制查看出库
 * @param list
 * @param modal
 */
exports.renderCheckSummaryModalTable = function (list, modal, $item) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var teamName = item.teamName || '';
        var chargeUserName = item.chargeUserName || '无';
        var dom = $('<tr>\
      <td class="border">' + count + '</td>\
      <td class="border">' + teamName + '</td>\
      <td class="border">' + item.applyName + '</td>\
      <td class="border">' + moment(item.addTime).format('YYYY/MM/DD HH:mm:ss') + '</td>\
      <td class="border">' + item.outCount + '</td>\
      <td class="border">' + chargeUserName + '</td>\
      <td class="border">' + $item.subProjName + '</td>\
      <td class="border">' + item.remark + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
}
/**
 * 绘制查看采购
 * @param list
 * @param modal
 */
exports.renderCheckPurchaseModalTable = function (list, modal, item) {
    list = list || [];
    modal.$body.find('.mtrlName').html(item.mtrlName);
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr>\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.mtrlPlanNo + '</td>\
      <td class="border">' + moment(item.prchTime).format('YYYY/MM/DD') + '</td>\
      <td class="border">' + moment(item.checkTime).format('YYYY/MM/DD') + '</td>\
      <td class="border">' + item.checkCount + '</td>\
      <td class="border">' + item.prchUserName + '</td>\
      <td class="border">' + item.checkUserName + '</td>\
      <td class="border">' + item.prchPrice + '</td>\
      <td class="border">' + item.entprName + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};

/**
 * 绘制招标计划单的提计划
 * @param item
 * @param parents
 * @param type old 保存的 new 添加的
 */
exports.renderBiddingModalTable = function (item, parents, type) {
    type = type || 'old';
    var planCount = item.planCount ? item.planCount : '';
    var prchType = item.prchType || 1;
    var tableActive = $('.materialPlanDetail').data('item');
    var disabled = 'disabled';
    if (tableActive.planStatus === 1 || tableActive.planStatus === 4) {
        disabled = ''
    }
    var mtrlCategoryName = item.mtrlCategoryName + '-' || '';
    var mtrlTypeName = item.mtrlTypeName || '';
    var _type = mtrlCategoryName + mtrlTypeName;
    //var price = tableActive.planType === 1 ? 'planPrice' : 'bidPrice';
    //   var lastQpy = item.lastQpy || '预算外';
    var lastQpy = item.lastQpy || item.lastQpy === 0 ? item.lastQpy : '预算外';
    var dom = $('<tr class="small ' + type + '' + prchType + '">\
      <td class="border">' + item.count + '</td>\
      <td class="border">' + item.subProjName + '</td>\
      <td class="border">' + _type + '</td>\
      <td class="border">' + item.mtrlName + '</td>\
      <td class="border">' + item.specBrand + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border" style="width:80px"><input type="text" placeholder="填写" name="planPrice" value=' + item.planPrice + ' ' + disabled + ' data-warn="请输入单价"></td>\
      <td class="border" style="60px"><input type="text" placeholder="填写" data-warn="请输入数量" name="planCount" value="' + planCount + '"></td>\
      <td class="border">' + lastQpy + '</td>\
      <td class="border">\
      <a class="confirm-hover" data-type="add">添加说明</a>\
      <div class="icon-line"></div>\
      <a class="delete-hover" data-type="delete">删除</a>\
      </td>\
      </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
};
/**
 * 绘制没有保存的企业库信息
 * @param list
 * @param modal
 * @param newList
 * /*<td class="border"><span class="radio select' + item.id + '" data-id=' + item.id + ' data-type="' + 2 + '"></span></td>\
 <td class="border"><span class="radio select' + item.id + '" data-id=' + item.id + ' data-type="' + 3 + '"></span></td>\
 */
exports.renderEnterpriseMaterialModalTable = function (list, modal, newList, subProjId) {
    list = list || [];
    newList = newList || [];
    var parents = modal.$body.find('#enterprise tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">\
      <td class="border"><input type="checkbox"/></td>\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.mtrlCategoryName + '-' + item.mtrlTypeName + '</td>\
      <td class="border">' + item.mtrlName + '</td>\
      <td class="border">' + item.specBrand + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + item.avgPrice + '</td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
        for (var j = 0; j < newList.length; j++) {
            if (list[i].id === newList[j].mtrlId && (newList[j].subProjId && newList[j].subProjId.toString()) === subProjId) {// todo 测试后再定夺
                dom.find('[type=checkbox]').prop('checked', true);
            }
        }
        if (modal.$body.find('#enterprise tbody [type=checkbox]:checked').length > 0) {
            modal.$body.find('#enterprise thead [type=checkbox]').prop('checked', true);
        }
    }
    initEvent.initBesideModalTableEvent(modal);
};

/**
 * 绘制详情
 * @param obj
 * @param modal
 */
exports.renderPurchaseMaterialPlan = function (obj, modal) {
    var list = [];
    var parents = modal.$body.find('tbody').html('');
    if (obj.planType === 2) {
        if (obj.planStatus === 2 || obj.planStatus === 3 || obj.planStatus === 5) {
            list.push({
                name: '计划',
                user: obj.planUserName,
                time: [{name: '计划提交时间', value: moment(obj.planAppearTime).format('YYYY/MM/DD')}, {
                    name: '计划完成时间',
                    value: moment(obj.planAppearTime).format('YYYY/MM/DD')
                }],
                total: [{name: '预计资金', value: obj.planMoney}]
            });
            if (obj.planStatus === 5) {
                list.push({
                    name: '发布',
                    user: obj.prchUserName,
                    time: [{name: '实际发布时间', value: moment(obj.prchTime).format('YYYY/MM/DD')}],
                    total: [{name: '招标合计', value: obj.prchMoney}]
                });
            }
        }
    } else {
        if (obj.planStatus === 2 || obj.planStatus === 3 || obj.planStatus === 5 || obj.planStatus === 6 || obj.planStatus === 7) {
            list.push({
                name: '计划',
                user: obj.planUserName,
                time: [{name: '计划提交时间', value: moment(obj.planTime).format('YYYY/MM/DD')}],
                plan: [{name: '预计资金', value: obj.planMoney}],
                total: [{name: '预算外费用', value: obj.outBudPlanMoney || 0}]
            });
            if (obj.planStatus === 5 || obj.planStatus === 6 || obj.planStatus === 7) {
                list.push({
                    name: '采购',
                    user: obj.prchUserName,
                    time: [{name: '采购提交时间', value: obj.prchTime ? moment(obj.prchTime).format('YYYY/MM/DD') : ' '}],
                    plan: [{name: '实际资金', value: obj.prchMoney}],
                    total: [{name: '', value: ''}]
                });
            }
            if (obj.planStatus === 6 || obj.planStatus === 7) {
                list.push({
                    name: '点收',
                    user: obj.checkUserName,
                    time: [{name: '点收完成时间', value: moment(obj.checkTime).format('YYYY/MM/DD')}],
                    plan: [{name: '点收金额', value: obj.checkMoney}],
                    total: [{name: '含税金额', value: obj.checkTaxMoney || 0}, {
                        name: '应付款金额',
                        value: obj.payableMoney || 0
                    }]
                });
                var costAddTime = moment(obj.addTime).format('YYYY/MM/DD');
                if (!obj.costAddTime) {
                    costAddTime = '-/-/-';
                }
                list.push({
                    name: '费用',
                    user: obj.prchUserName,
                    time: [{name: '费用生成时间', value: costAddTime}],
                    plan: [{name: '生成费用', value: obj.checkMoney}],
                    total: [{name: '未提交审批金额', value: obj.unSubmitApprMoney || 0}]
                });
            }
        }
    }
    for (var i = 0; i < list.length; i++) {
        var tr = $('<tr></tr>');
        for (var key in list[i]) {
            var dom = $('<td class="border"></td>');
            if (list[i][key] instanceof Array) {
                for (var j = 0; j < list[i][key].length; j++) {
                    var child = list[i][key][j];
                    if (child.name) {
                        var _dom = $('<label>' + child.name + ':</label><span style="margin-right: 10px;">' + child.value + '</span>');
                        _dom.appendTo(dom);
                    }
                }
            } else {
                dom = $('<td class="border">' + list[i][key] + '</td>');
            }
            dom.appendTo(tr);
        }
        tr.appendTo(parents);
    }
};

exports.renderBidSuccessFullModalTable = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = i + 1;
        var bidTotalMoney = item.bidTotalMoney || 0
        var bidCount = item.planCount
        var bidPrice = item.bidPrice || ""
        var bidPlace = item.bidPlace || ""
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.mtrlName + '</td>\
      <td class="border">' + item.specBrand + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border"><input disabled type="text" placeholder="填写" name="bidCount" data-warn="数量" value="' + bidCount + '"></td>\
      <td class="border"><input type="text" placeholder="填写" name="bidPrice" data-warn="价钱" value="' + bidPrice + '"></td>\
      <td class="border"><input type="text" placeholder="系统计算" disabled value=' + bidTotalMoney + '></td>\
      <td class="border">\
       <div class="supplierType" style="cursor:pointer;position: relative">单击选择</div>\
       <div class="supplierList"></div>\
      </td>\
      <td class="border"><input type="text" placeholder="填写" name="bidPlace" data-warn="产品、品牌" value="' + bidPlace + '"></td>\
      <td class="border"><a class="confirm-hover" data-type="add">添加说明</a></td>\
      <td class="border"><input type="checkbox" name="bidTaxType"></td>\
      <td class="border"><div class="clearPlan" style="color: #009411;cursor: pointer">清除</div></td>\
      </tr>');
        if (item.entprId && item.entprName) {
            dom.find('.supplierType').text(item.entprName);
            dom.find('.supplierList').data('item', {id: item.entprId, entpName: item.entprName})
        }
        if (item.bidTaxType === 1) {
            dom.find('[type=checkbox][name=bidTaxType]').prop('checked', true)
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initBidSuccessFullModalTableEvent(parents);
};

exports.renderCostMaterialOrderShow = function (obj) {
    if (obj) {
        $('#costOrderNo').hide();
        $('#costOrderContent').show();
    } else {
        $('#costOrderNo').show();
        $('#costOrderContent').hide();
    }
};

exports.renderMaterialContractList = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('.contract-list').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var cntrNo = item.cntrNo || '';
        if (item.cntrNo) {
            var dom = $('<div class="contract-item clearfix">' +
                '<div class="contract-select fl"><span class="radio select"></span></div>' +
                '<div class="contract-content fl">' +
                '<div>分部名称 : <span class="subProjName ellipsis">' + item.subProjName + '</span></div>' +
                '<div>合同名称 : <span>' + item.cntrName + '</span></div>' +
                '<div>编号 : <span>' + cntrNo + '</span></div>' +
                '</div>' +
                '</div>');
        } else {
            var dom = $('<div class="contract-item clearfix">' +
                '<div class="contract-select noCntr-sel fl"><span class="radio select"></span></div>' +
                '<div class="contract-content noCntr-con fl">' +
                '<span>无合同</span>' +
                '</div>' +
                '</div>');
        }

        if (!cntrNo) {
            dom.find('.contractNo').remove();
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialContractEvent(parents);
};

exports.renderAddTeamTable = function (list, modal, parent) {
    list = list || [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr>' +
            '<td class="border">' +
            '<input type="checkbox">' +
            '</td>' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.teamName + '</td>' +
            '<td class="border">' + item.workerCount + '</td>' +
            '</tr>');
        dom.data('data', item);
        dom.appendTo(modal.$body.find('tbody'));
    }
    if ($(parent).data('data')) {
        var teamId = $(parent).data('data').teamId;
        modal.$body.find('tbody tr').each(function () {
            if ($(this).data('data').teamId === teamId) {
                $(this).find('input').prop('checked', true);
            }
        })
    }
    initEvent.initAddTeamEvent(modal, parent);
}

exports.renderAddWorkerTable = function (list, modal, parent) {
    list = list || [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr>' +
            '<td class="border">' +
            '<input type="checkbox">' +
            '</td>' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.workerName + '</td>' +
            '</tr>');
        dom.data('data', item);
        dom.appendTo(modal.$body.find('tbody'));
    }
    if ($(parent).data('data')) {
        var workerNo = $(parent).data('data').workerNo;
        modal.$body.find('tbody tr').each(function () {
            if ($(this).data('data').workerNo === workerNo) {
                $(this).find('input').prop('checked', true);
            }
        })
    }
    initEvent.initAddWorkerEvent(modal, parent);
}

exports.renderCreateOrderTable = function (list, modal, id) {
    modal.$body.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.mtrlName + '</td>' +
            '<td class="border">' + item.specBrand + '</td>' +
            '<td class="border">' + item.unit + '</td>' +
            '<td class="border">' + (item.planCount || '') + '</td>' +
            '<td class="border"><input type="text" data-type="count" value="'+ item.planCount +'"></td>' +
            '<td class="border">' + (item.planRemark || '') + '</td>' +
            '<td class="border"><a href="javascript:;" class="delete-hover">删除</a></td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(modal.$body.find('tbody'));
    }
    initEvent.initCreateOrderEvent(modal, id);
}

exports.renderOrderTable = function (list, modal) {
    modal.$body.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.orderNo + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + moment(item.addTime).format('YYYY/MM/DD') + '</td>' +
            '<td class="border">' + getOrderStatus(item.orderStatus) + '</td>' +
            '<td class="border">' +
            '<a href="javascritp:;" class="confirm-hover" data-type="manage">管理</a>' +
            '<span style="margin: 0 5px;">|</span>' +
            '<a href="javascript:;" class="delete-hover" data-type="del">删除</a>' +
            '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(modal.$body.find('tbody'));
    }
    initEvent.initOrderEvent(modal);
}

function getOrderStatus(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '未报价';
        case 2:
            return '待审核';
        case 3:
            return '已审核';
        case 4:
            return '已拒绝';
        case 5:
            return '已删除';
    }
}

function getAcctType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            // return '实付款(无合同)';
            return '实付款(采购支付)';
        case 2:
            // return '应付账款';
            return '应付账(财务挂账)';
        case 3:
            // return '实付款(有合同)';
            return '实付款(财务支付)';
    }
}

exports.renderManageOrderTable = function (modal, data, id) {
    var list = data.detailVOList || [];
    if (data.orderStatus === 1) {//未报价
        modal.$body.find('.entpName').html(data.entpName);
        modal.$body.find('.contactName').html(data.contactName);
        modal.$body.find('.phone').html(data.phone);
        modal.$body.find('select').val(data.acctType);
        var mtrlStatus = $('<div style="position: absolute;top: 15px;right: 70px;font-weight: bold;">订单状态 : ' + getOrderStatus(data.orderStatus) + '</div>');
        modal.$body.append(mtrlStatus);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.mtrlName + '</td>' +
                '<td class="border">' + item.specBrand + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.planQpy + '</td>' +
                '<td class="border"><input type="text" data-type="count" value=' + item.orderQpy + '></td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '<td class="border"><a href="javascript:;" class="delete-hover">删除</a></td>' +
                '</tr>');
            dom.data('item', item);
            dom.appendTo(modal.$body.find('tbody'));
        }
        initEvent.initPutOrderEvent(modal, data);
    } else if (data.orderStatus === 2) {//待审核
        modal.$body.find('.entpName').html(data.entpName);
        modal.$body.find('.contactName').html(data.contactName);
        modal.$body.find('.phone').html(data.phone);
        modal.$body.find('.acctType').html(getAcctType(data.acctType));
        modal.$body.find('.orderMoney').html(data.orderMoney + '元');
        if (modal.$body.find('.orderStatus').length === 0) {
            var mtrlStatus = $('<div class="orderStatus" style="position: absolute;top: 15px;right: 70px;font-weight: bold;">订单状态 : ' + getOrderStatus(data.orderStatus) + '</div>');
            modal.$body.append(mtrlStatus);
        }
        modal.$body.find('tbody').html('');
        var dealMoney = 0;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var taxType = item.taxType === 1 ? 'checked' : '';
            var status = '';
            if (item.status === 1) {
                status = '<a href="javascript:;" class="delete-hover" data-type="reject">拒绝</a><span style="margin: 0 5px;">|</span><a href="javascript:;" class="confirm-hover" data-type="deal">成交</a>'
            } else if (item.status === 2) {
                status = '已成交';
            } else if (item.status === 3) {
                status = '已拒绝';
            }
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.mtrlName + '</td>' +
                '<td class="border">' + item.specBrand + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.planQpy + '</td>' +
                '<td class="border">' + item.orderQpy + '</td>' +
                '<td class="border">' + item.orderPrice + '</td>' +
                '<td class="border">' + (item.orderQpy * item.orderPrice) + '</td>' +
                '<td class="border">' + item.mtrlPlace + '</td>' +
                '<td class="border"><input type="checkbox" disabled ' + taxType + '></td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '<td class="border">' + status + '</td>' +
                '</tr>');
            if (item.status === 2) {
                dealMoney += (item.orderQpy * item.orderPrice);
            }
            dom.data('item', item);
            dom.appendTo(modal.$body.find('tbody'));
        }
        modal.$body.find('.dealMoney').html(dealMoney + '元');
        initEvent.initCheckingOrderEvent(modal, data, id);
    } else if (data.orderStatus === 3) {//已审核
        modal.$body.find('.entpName').html(data.entpName);
        modal.$body.find('.contactName').html(data.contactName);
        modal.$body.find('.phone').html(data.phone);
        modal.$body.find('.acctType').html(getAcctType(data.acctType));
        modal.$body.find('.orderMoney').html(data.orderMoney + '元');
        if (modal.$body.find('.orderStatus').length === 0) {
            var mtrlStatus = $('<div class="orderStatus" style="position: absolute;top: 15px;right: 70px;font-weight: bold;">订单状态 : ' + getOrderStatus(data.orderStatus) + '</div>');
            modal.$body.append(mtrlStatus);
        }
        modal.$body.find('tbody').html('');
        var dealMoney = 0;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var taxType = item.taxType === 1 ? 'checked' : '';
            var status = '';
            if (item.status === 1) {
                status = '<a href="javascript:;" class="delete-hover" data-type="reject">拒绝</a><span style="margin: 0 5px;">|</span><a href="javascript:;" class="confirm-hover" data-type="deal">成交</a>'
            } else if (item.status === 2) {
                status = '已成交';
            } else if (item.status === 3) {
                status = '已拒绝';
            }
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.mtrlName + '</td>' +
                '<td class="border">' + item.specBrand + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.planQpy + '</td>' +
                '<td class="border">' + item.orderQpy + '</td>' +
                '<td class="border">' + item.orderPrice + '</td>' +
                '<td class="border">' + (item.orderQpy * item.orderPrice) + '</td>' +
                '<td class="border">' + item.mtrlPlace + '</td>' +
                '<td class="border"><input type="checkbox" disabled ' + taxType + '></td>' +
                '<td class="border">' + (item.remark || '') + '</td>' +
                '<td class="border">' + status + '</td>' +
                '</tr>');
            if (item.status === 2) {
                dealMoney += (item.orderQpy * item.orderPrice);
            }
            dom.data('item', item);
            dom.appendTo(modal.$body.find('tbody'));
        }
        modal.$body.find('.dealMoney').html(dealMoney + '元');
    } else if (data.orderStatus === 4) {//已拒绝
        modal.$body.find('.entpName').html(data.entpName);
        modal.$body.find('.contactName').html(data.contactName);
        modal.$body.find('.phone').html(data.phone);
        modal.$body.find('.acctType').html(getAcctType(data.acctType));
        var mtrlStatus = $('<div style="position: absolute;top: 15px;right: 70px;font-weight: bold;">订单状态 : ' + getOrderStatus(data.orderStatus) + '</div>');
        modal.$body.append(mtrlStatus);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var dom = $('<tr class="small">' +
                '<td class="border">' + (i + 1) + '</td>' +
                '<td class="border">' + item.mtrlName + '</td>' +
                '<td class="border">' + item.specBrand + '</td>' +
                '<td class="border">' + item.unit + '</td>' +
                '<td class="border">' + item.planQpy + '</td>' +
                '<td class="border"><input type="text" data-type="count" value=' + item.orderQpy + '></td>' +
                '<td class="border">' + item.remark + '</td>' +
                '</tr>');
            dom.data('item', item);
            dom.appendTo(modal.$body.find('tbody'));
        }
    }
}