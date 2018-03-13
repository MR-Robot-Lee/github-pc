var initEvent = require('./initEvent');
var projectDesc = require('./modal/projectDesc.ejs');
var projectInitEvent = require('../initEvent');


/**
 * 保留两位小数
 * @param {Number} num 需要处理为只保留两位的数字
 */
function reserveTwoDecimals (num){
    if(isNaN(num*1)){
        return null; // 非数字返回null
    } else {
        return parseInt(num*100)/100;
    }
}
/**
 * 获取分部列表
 * @param list
 * @param $page
 */
exports.renderCostBudgetTable = function renderCostBudgetTable(list, $page) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo
    list = list || [];
    var parents = $('#costBudgetTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var checkQpy = '<div class="checkQpyClick" style="color: #61b27e;cursor:pointer">单击核算</div>';
        if (item.checkQpy || item.checkQpy == 0) {
            checkQpy = '<div class="checkQpyClick" style="color: #61b27e;cursor:pointer">' + reserveTwoDecimals(item.checkQpy) + '</div>';
        }
        var budPrice = '<div class="budPriceClick" style="color: #61b27e;cursor:pointer">单击分析</div>';
        if (item.budPrice) {
            budPrice = '<div class="budPriceClick" style="color: #61b27e;cursor:pointer">' + reserveTwoDecimals(item.budPrice) + '</div>';
        }
        var budMtrlPrice = '<div  style="color: #999999">系统计算</div>';
        if (item.budMtrlPrice) {
            budMtrlPrice = reserveTwoDecimals(item.budMtrlPrice);
        }
        var budSecMtrlPrice = '<div  style="color: #999999">系统计算</div>';
        if (item.budSecMtrlPrice) {
            budSecMtrlPrice = reserveTwoDecimals(item.budSecMtrlPrice);
        }
        var budLaborPrice = '<div  style="color: #999999">系统计算</div>';
        if (item.budLaborPrice) {
            budLaborPrice = reserveTwoDecimals(item.budLaborPrice);
        }
        var budMeasurePrice = '<div  style="color: #999999">系统计算</div>';
        if (item.budMeasurePrice) {
            budMeasurePrice = reserveTwoDecimals(item.budMeasurePrice);
        }
        var budSubletPrice = '<div  style="color: #999999">系统计算</div>';
        if (item.budSubletPrice) {
            budSubletPrice = reserveTwoDecimals(item.budSubletPrice);
        }
        var excpCount = '无';
        if (item.excpCount && item.excpCount > 0) {
            excpCount = '<div class="exceptionModal" style="cursor:pointer;color: #de6d0b;">' + item.excpCount + '</div>';
        }
        // excpCount = '<div class="exceptionModal" style="cursor:pointer">' + item.excpCount + '</div>';
        var dom = '';
        if (item.subitemNo) {
            dom = $('<tr class="small id_' + item.id + '">\
                   <td class="border">\
                    <input type="checkbox" />\
                   </td>\
                   <td class="border">' + item.subitemNo + '</td>\
                   <td class="border" style="position: relative"><div style="overflow: hidden;white-space: nowrap;width: 160px;" class="subItemDesc">' + item.subitemDesc + '</div></td>\
                   <td class="border" style="width: 40px;">' + item.unit + '</td>\
                   <td class="border" style="width: 40px">' + reserveTwoDecimals(item.originQpy) + '</td>\
                   <td class="border" style="width: 40px;">' + reserveTwoDecimals(item.origPrice) + '</td>\
                   <td class="border" style="width: 60px">' + reserveTwoDecimals(item.origTotalPrice) + '</td>\
                   <td class="border" style="width: 80px">' + checkQpy + '</td>\
                   <td class="border">' + budPrice + '</td>\
                   <td class="border">' + budMtrlPrice + '</td>\
                   <td class="border">' + budSecMtrlPrice + '</td>\
                   <td class="border">' + budLaborPrice + '</td>\
                   <td class="border">' + budMeasurePrice + '</td>\
                   <td class="border">' + budSubletPrice + '</td>\
                   <td class="border">' + excpCount + '</td>\
                   <td class="border">' + item.sysNo + '</td>\
                  </tr>');
        } else {
            dom = $('<tr class="small id_' + item.id + '">\
                   <td class="border">\
                   <input type="checkbox" />\
                   </td>\
                   <td class="border"></td>\
                   <td class="border" style="position: relative"><div style="overflow: hidden;white-space: nowrap;width: 160px;" class="subItemDesc">' + item.subitemDesc + '</div></td>\
                   <td class="border" style="width: 40px;"></td>\
                   <td class="border" style="width: 40px"></td>\
                   <td class="border" style="width: 40px;"></td>\
                   <td class="border" style="width: 60px"></td>\
                   <td class="border" style="width: 80px"></td>\
                   <td class="border"></td>\
                   <td class="border"></td>\
                   <td class="border"></td>\
                   <td class="border"></td>\
                   <td class="border"></td>\
                   <td class="border"></td>\
                   <td class="border"></td>\
                   <td class="border"></td>\
                  </tr>');
        }
        var $projectDesc = $(projectDesc());
        $projectDesc.appendTo(dom.find('.subItemDesc'));
        $projectDesc.find('.material-section').text(item.subitemDesc);
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initBudgetTable(parents, $page);
};

exports.renderSingleSubProjectDom = function renderSingleSubProjectDom(obj) {
    $('#subProjName').text(obj.subProjName);
    $('#subProjNo').text(obj.subProjNo);
    var exepCount = obj.excpCount || 0;
    $('[name=budTotalMoney]').text(obj.budTotalMoney + '元');
    $('[name=budMtrlPrice]').text(obj.budMtrlPrice + '元');
    $('[name=budSecMtrlPrice]').text(obj.budSecMtrlPrice + '元');
    $('[name=budLaborPrice]').text(obj.budLaborPrice + '元');
    $('[name=budMeasurePrice]').text(obj.budMeasurePrice + '元');
    $('[name=budSubletPrice]').text(obj.budSubletPrice + '元');
    $('[name=excpCount]').text(exepCount + '项');
};
/**
 * 绘制人工table
 * @param list
 */
exports.renderWorkerCountTable = function renderWorkerCountTable(list, price) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    $('#laborPrice').text(price + '元');
    var parents = $('#costWorkerCountTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var total = 0;
        if (!isNaN(item.budQpy) && !isNaN(item.budPrice)) {
            total = (item.budQpy * item.budPrice).toFixed(2);
        }
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.laborTypeName + '</td>\
      <td class="border">' + item.laborName + '</td>\
      <td class="border">' + item.workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + reserveTwoDecimals(item.budQpy) + '</td>\
      <td class="border">' + reserveTwoDecimals(item.budPrice) + '</td>\
      <td class="border">' + total + '</td>\
      <td class="border" style="position: relative;width: 60px;"><a data-type="labor">查看</a><div class="icon-line" style="margin: 0 10px;"></div><a data-type="price">调整价格</a></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialTableEvent(parents, 'labor');
};
exports.renderLaborSelect = function (list) {
    list = list || [];
    var parents = $('#costLaborType').html('');
    $('<option value="a">人工类型</option>').appendTo(parents);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.laborTypeName);
        dom.val(item.id);
        dom.appendTo(parents);
    }
};
/**
 * 绘制措施 table
 * @param list
 */
exports.renderStepTable = function renderStepTable(list, price) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    $('#stepPrice').text(price + '元');
    var parents = $('#costStepTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var total = 0;
        if (!isNaN(item.budQpy) && !isNaN(item.budPrice)) {
            total = (item.budQpy * item.budPrice).toFixed(2);
        }
        var dom = $('<tr class="small">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.measureTypeName + '</td>\
                  <td class="border">' + item.measureName + '</td>\
                  <td class="border">' + item.workContent + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.budQpy) + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.budPrice) + '</td>\
                  <td class="border">' + total + '</td>\
                  <td class="border" style="width: 60px;position: relative;"><a data-type="step">查看</a><div class="icon-line" style="margin: 0 10px;"></div><a data-type="price">调整价格</a></td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialTableEvent(parents, 'step');
};
/**
 * 绘制措施
 * @param list
 */
exports.renderStepSelect = function (list) {
    list = list || [];
    var parents = $('#costStepType').html('');
    $('<option value="a">措施类型</option>').appendTo(parents);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.measureTypeName);
        dom.val(item.id);
        dom.appendTo(parents);
    }
};
/**
 * 绘制分包 table
 * @param list
 * @param price
 */
exports.renderSubpackageTable = function (list, price) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    $('#subpackagePrice').text(price + '元');
    var parents = $('#costSubpackageTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var total = 0;
        if (!isNaN(item.budQpy) && !isNaN(item.budPrice)) {
            total = (item.budQpy * item.budPrice).toFixed(2);
        }
        var dom = $('<tr class="small">\
                  <td class="border">' + count + '</td>\
                   <td class="border">' + item.subletTypeName + '</td>\
                  <td class="border">' + item.subletName + '</td>\
                  <td class="border">' + item.workContent + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.budQpy) + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.budPrice) + '</td>\
                  <td class="border">' + total + '</td>\
                  <td class="border" style="width: 60px;position: relative"><a data-type="subpackage">查看</a><div class="icon-line" style="margin: 0 10px;"></div><a data-type="price">调整价格</a></td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialTableEvent(parents, 'subpackage');
};
/**
 * 绘制分包类型
 * @param list
 */
exports.renderSubpackageSelect = function (list) {
    list = list || [];
    var parents = $('#costSubpackageType').html('');
    $('<option value="a">分包类型</option>').appendTo(parents);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.subletTypeName);
        dom.val(item.id);
        dom.appendTo(parents);
    }
};

exports.renderMaterialTable = function renderMaterialTable(list, price) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    $('#materialPrice').text(price + '元');
    var parents = $('#costMaterialTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var total = 0;
        if (!isNaN(item.budQpy) && !isNaN(item.budPrice)) {
            total = (item.budQpy * item.budPrice).toFixed(2);
        }
        var dom = $('<tr class="small">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlCategoryName + '</td>\
                  <td class="border">' + item.mtrlTypeName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.budQpy) + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.budPrice) + '</td>\
                  <td class="border">' + total + '</td>\
                  <td class="border" style="width: 60px;position: relative;"><a data-type="material">查看</a><div class="icon-line" style="margin: 0 10px;"></div><a data-type="price">调整价格</a></td>\
                </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialTableEvent(parents, 'material');
};

/**
 * 绘制分包类型
 * @param list
 */
exports.renderMaterialSelect = function (list) {
    list = list || [];
    var parents = $('#costMaterialType').html('');
    $('<option value="a">材料类别</option>').appendTo(parents);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        if (item.mtrlCategoryName.length > 9) {
            item.mtrlCategoryName = item.mtrlCategoryName.slice(0, 9) + '...';
        }
        dom.text(item.mtrlCategoryName);
        dom.val(item.id);
        dom.data('children', item.children);
        dom.appendTo(parents);
    }
    initEvent.initMaterialSelect(parents);
};

exports.renderQuantityTable = function renderQuantityTable(list) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    var parents = $('#costQuantityTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var checkQpyFormula = item.checkQpyFormula || '';
        var unit;
        var originQpy;
        var checkQpy;
        if(item.sysNo){
            unit = item.unit;
            originQpy = item.originQpy;
            checkQpy = item.checkQpy;
        } else {
            unit = '';
            originQpy = '';
            checkQpy = '';
        }
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.subitemNo + '</td>\
      <td class="border" style="position: relative;"><div style="overflow: hidden;white-space: nowrap;width: 160px;" class="subItemDesc">' + item.subitemDesc + '</div></td>\
      <td class="border">' + unit + '</td>\
      <td class="border">' + originQpy + '</td>\
      <td class="border">' + checkQpy + '</td>\
      <td class="border">' + checkQpyFormula + '</td>\
      <td class="border" style="position: relative;"><a >查看</a></td>\
      </tr>');
        var $projectDesc = $(projectDesc());
        $projectDesc.appendTo(dom.find('.subItemDesc'));
        $projectDesc.find('.material-section').text(item.subitemDesc);
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initQuantityTableEvent(parents);
};


exports.rendercostBudgetExceptionTable = function (list, modal, callback) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var active = '';
        if (item.remark) {
            active = 'active';
        }
        var dom = $('<tr class="small active">\
      <td class="border">' + item.objName + '</td>\
      <td class="border">' + item.usedValue + '</td>\
      <td class="border">' + item.sysValue + '</td>\
      <td class="border">' + item.excpValue + '</td>\
      <td class="border" style="width: 40px;position: relative;">\
      <div class="icon-exception ' + active + '"></div>\
      <span></span>\
      </td>\
      <td class="border">' + item.objTypeName + '</td>\
      <td class="border">' + new Date(item.addTime).Format("yyyy-MM-dd hh:mm") + '</td>\
      <td class="border">' + item.addUserName + '</td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents)
    }
    initEvent.initBudgetExceptionTableEvent(parents, modal, callback);
};

function parseType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '成本预算';
        case 2:
            return '材料管理';
        case 3:
            return '合同管理';
        case 4:
            return '结算管理 ';
    }
}
