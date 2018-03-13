var financialCostTr = require('./tableDom/financialCostTableTr.ejs');
var financialPayTr = require('./tableDom/financialPayTableTr.ejs');
var financialMeTr = require('./tableDom/financialMeTableTr.ejs');
var initEvent = require('./initEvent');
var projectInitEvent = require('../initEvent');

exports.renderFinancialCost = function (list) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo
    list = list || [];
    if (list.length > 0) {
        $("#noInfoFinancialSum_main").show();
        $("#noInfoFinancialSum_search").show();
        $("[name='noInfoFinancialSum_page']").show();
        $("#noInfoFinancialSum").hide();
    } else {
        $("#noInfoFinancialSum_main").hide();
        // $("#noInfoFinancialSum_search").hide();
        $("[name='noInfoFinancialSum_page']").hide();
        $("#noInfoFinancialSum").show();
    }
    var parents = $('#financialSum').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $(financialCostTr({
            count: i + 1,
            fundResc: item.fundResc,
            overHeadTypeName: item.overHeadTypeName,
            subName: item.subProjName,
            fundRescName: item.fundRescName,
            costName: item.costName,
            costNo: item.costNo,
            operatorName: item.operatorName,
            payTime: moment(item.payTime).format('YYYY/MM/DD'),
            payMoney: item.payMoney,
            recType: item.recObjName,
        }));
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initFinancialCostSumEvent(parents);
};

function parsePayMoney(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '现金';
        case 2:
            return '转账';
        case 3:
            return '承兑';
    }
}

/**
 *
 * @param obj
 */
exports.renderCostStatusData = function (obj) {
    if ($('#cntrMoney').length > 0) {
        $('#currentDate').text(moment(obj.produceTime).format('YYYY/MM/DD'));
        $('#cntrMoney').text(obj.contractMoney);
        $('#settleMoney').text(obj.settleMoney);
    } else {
        $('.contractMoney').text(reserveTwoDecimals(obj.contractMoney)) // 合同款 ,
        $('.unProvideTaxMoney').text(reserveTwoDecimals(obj.unProvideTaxMoney)) // 待提供税票金额 ,
        $('.unRelativePrepayMoney').text(reserveTwoDecimals(obj.unRelativePrepayMoney)) // 未关联预付款 ,
        $('.excpMoney').text(reserveTwoDecimals(obj.excpMoney)) // 预期结算款 ,
        $('.outputMoney').text(reserveTwoDecimals(obj.outputMoney)) // 产值 ,
        $('.shouldRecMoney').text(reserveTwoDecimals(obj.shouldRecMoney)) // 应收金额
        $('.actRecMoney').text(reserveTwoDecimals(obj.actRecMoney)) // 实收金额 ,
        $('.costMoney').text(reserveTwoDecimals(obj.costMoney)) // 实付账款 ,
        $('.payableMoney').text(reserveTwoDecimals(obj.payableMoney)) // 应付款 ,
        $('.judgePer').text(obj.judgePer + '%') // 产值/预期
        var costBudgetData = $('#costBudgetData').html('');
        var excpMoney = obj.excpMoney || 0;
        var outputMoney = obj.outputMoney;
        var actRecMoney = obj.actRecMoney;
        var shouldRecMoney = obj.shouldRecMoney;
        actRecMoney = excpMoney === 0 ? 0 : ((actRecMoney / excpMoney) * 100).toFixed(0);
        shouldRecMoney = excpMoney === 0 ? 0 : ((shouldRecMoney / excpMoney) * 100).toFixed(0);
        outputMoney = excpMoney === 0 ? 0 : ((outputMoney / excpMoney) * 100).toFixed(0);
        /*actRecMoney = actRecMoney > 100 ? 100 : actRecMoney;
        shouldRecMoney = shouldRecMoney > 100 ? 100 : shouldRecMoney;
        outputMoney = outputMoney > 100 ? 100 : outputMoney;*/
        var list = [{name: '应收款', id: parseInt(shouldRecMoney), backgroud: '#61A1A6;'}, {
            name: '实收款', backgroud: '#74a082;', top: '',
            id: parseInt(actRecMoney)
        }, {name: '总产值', id: parseInt(outputMoney), backgroud: '#fff;'}];
        list.sort(function (a, b) {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        });
        var dom = $('<div class="Progress-Bar-fixed">\n' +
            '            <div class="fixed-item"></div>\n' +
            '            <div class="fixed-item bottom1">\n' +
            '            </div>\n' +
            '        </div>');
        var _top = 14;
        var _topmark = 16;
        var index;
        var rotate = '';
        var line = '';
        var content = '';
        var bg = '';
        for (var i = 0; i < list.length; i++) {
            var $item = list[i];
            if ($item.id < 20 || $item.id > 90) {
                _top += 14;
            } else {
                _top = 28;
            }
            var itemWidth = $item.id;
            if (i === 0) { // 应收款
                itemWidth += list[1].id;
                index = 2;
            }
            if (i === 1) { // 实收款
                index = 3;
            }
            if (i === 2) { // 总产值
                index = 1;
                _top = -48;
                _topmark = -30;
                rotate = "transform:rotate(180deg)";
                bg = 'zebra';
                line = '<i style="top:' + (_topmark + 14) + 'px;display:inline-block;right:-1px;position:absolute;width: 1px;height: 16px;background-color: #999;"></i>';
                content = '<i class="icon-mark" style="top:' + _topmark + 'px;' + rotate + '"></i>' +
                    '<i class="content" style="top:' + _top + 'px;">' + $item.name + '</i>' + line;
            }

            $('<span class="schedule ' + bg + '" style="width: ' + itemWidth + '%;background-color: ' + $item.backgroud + ';position: absolute;z-index:' + index + '">\n' +
                content +
                '                    </span>\n').appendTo(dom.find('.bottom1'));
        }
        dom.appendTo(costBudgetData);
        var payMoneyData = $('#payMoneyData').html('');
        var targeMoney = obj.targeMoney || 0;//目标
        var costMoney = obj.costMoney;//实付
        var payableMoney = obj.payableMoney;//应付
        var directMoney = obj.directMoney;//动态
        costMoney = excpMoney === 0 ? 0 : ((costMoney / excpMoney) * 100).toFixed(0);
        payableMoney = excpMoney === 0 ? 0 : (( payableMoney / excpMoney) * 100).toFixed(2);
        targeMoney = excpMoney === 0 ? 0 : ((targeMoney / excpMoney) * 100).toFixed(0);
        directMoney = excpMoney === 0 ? 0 : ((directMoney / excpMoney) * 100).toFixed(0);
        // 顺序为  目标 动态 实 应
        var _list = [
            {
                name: '目标成本', backgroud: '#fff;',
                id: parseInt(targeMoney)
            }, {
                name: '动态成本',
                id: parseInt(directMoney),
                backgroud: '#9999BD;'
            }, {
                name: '实付款',
                id: parseInt(costMoney),
                backgroud: '#74a082;'
            }, {
                name: '应付款', backgroud: '#61A1A6;',
                id: parseInt(payableMoney)
            }];

        var payDom = $('<div class="Progress-Bar-fixed">\n' +
            '            <div class="fixed-item"></div>\n' +
            '            <div class="fixed-item bottom1"></div>\n' +
            '        </div>');

        for (var j = 0; j < _list.length; j++) {
            var item = _list[j];
            var top = 28;
            var topmark = 16;
            var _index;
            var _rotate = '';
            var _line = '';
            var _content = '';
            var _bg = '';
            var _itemWidth = item.id;
            if (j === 3) { // 应付款
                _itemWidth += _list[2].id;
                _index = 3;
                _bg = '';
            }
            if (j === 2) { // 实付款
                _index = 4;
                _bg = '';

            }
            if (j === 1) { // 动态成本
                _index = 2;
                _bg = '';
                _content = '<i class="icon-mark" style="top:' + topmark + 'px;' + _rotate + '"></i><i class="content" style="top:' + top + 'px;">' + item.name + '</i>' + _line;
            }
            if (j === 0) { // 目标成本
                _index = 1;
                top = -48;
                topmark = -30;
                _rotate = "transform:rotate(180deg)";
                _bg = 'zebra';
                _line = '<i style="top:' + (topmark + 14) + 'px;display:inline-block;right:-1px;position:absolute;width: 1px;height: 16px;background-color: #999;"></i>';
                _content = '<i class="icon-mark" style="top:' + topmark + 'px;' + _rotate + '"></i><i class="content" style="top:' + top + 'px;">' + item.name + '</i>' + _line;
            }
            var childDom = $('<span class="schedule ' + _bg + '" style="position: absolute;left: 0;width: ' + _itemWidth + '%;background-color: ' + item.backgroud + ';z-index:' + _index + '">' + _content + '\
                   </span>');
            childDom.appendTo(payDom.find('.bottom1'));
        }
        payDom.appendTo(payMoneyData);
    }
};
exports.renderFinancialPay = function (list) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo
    list = list || [];
    if (list.length > 0) {
        $("#noInfoFinancialPay_main").show();
        $("#noInfoFinancialPay_search").show();
        $("[name='noInfoFinancialPay_page']").show();
        $("#noInfoFinancialPay").hide();
    } else {
        $("#noInfoFinancialPay_main").hide();
        // $("#noInfoFinancialPay_search").hide();
        $("[name='noInfoFinancialPay_page']").hide();
        $("#noInfoFinancialPay").show();
    }
    var parents = $('#financialPay').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $(financialPayTr({
            count: i + 1,
            subName: item.subProjName,
            fundRescName: item.fundRescName,
            costNo: item.costNo,
            costName: item.costName,
            chargeUserName: item.chargeUserName,
            entpName: item.entpName,
            settlePrice: item.settlePrice,
            lastPayablePrice: item.lastPayablePrice,
            recObjName: item.recObjName,
            lastBillStatus: parseBillStatus(item.lastBillStatus),
            payableStatus: parsePayAbleStatus(item.payableStatus),
            payTime: moment(item.payTime).format('YYYY/MM/DD'),
            payMoney: item.payMoney,
            recType: item.recType === 1 ? '公司个人' : '供应商 '
        }));
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initFinancialPayAbledEvent(parents);
};

function parsePayAbleStatus(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '审批中';
        case 2:
            return '已确认';
        case 3:
            return '已驳回';
    }
}


/**
 * 我的账单
 * @param list
 */
exports.renderFinancialMe = function (list) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo
    list = list || [];
    if (list.length > 0) {
        $("#noInfoFinancialMe_main").show();
        $("#noInfoFinancialMe_search").show();
        $("[name='noInfoFinancialMe_page']").show();
        $("#noInfoFinancialMe").hide();
    } else {
        $("#noInfoFinancialMe_main").hide();
        $("[name='noInfoFinancialMe_page']").hide();
        $("#noInfoFinancialMe").show();
    }
    var parents = $('#financialMe').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $(financialMeTr({
            count: i + 1,
            costNo: item.costNo,
            // costType: parseCostType(item.overHeadTypeName),
            costType: item.overHeadTypeName,
            fundRescName: item.fundRescName,
            costName: item.costName,
            recObjName: item.recObjName,
            billMoney: item.billMoney,
            addTime: moment(item.addTime).format('YYYY/MM/DD'),
            billStatus: parseBillStatus(item.billStatus)
        }));
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initFinancialMeTableEvent(parents);
};

function parseBillStatus(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '已保存';
        case 2:
            return '审批中';
        case 3:
            return '已完成';
        case 4:
            return '已驳回';
    }
}


function parseCostType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '差旅费';
        case 2:
            return '通讯费';
        case 3:
            return '办公费';
        case 4:
            return '实验检测费';
        case 5:
            return '交通费';
        case 6:
            return '住宿费';
        case 7:
            return '餐费';
        case 8:
            return '招待费';
        case 9:
            return '汽车使用费';
        case 10:
            return '办公用品费';
        case 11:
            return '税金';
        case 12:
            return '管理费';
        case 13:
            return '劳保费';
        case 14:
            return '水电费';
        case 15:
            return '运杂费';
        case 16:
            return '房屋租金';
        case 17:
            return '文宣费';
        case 18:
            return '其他';
    }
}


/**
 * 保留两位小数
 * @param {Number} num 需要处理为只保留两位的数字
 */
function reserveTwoDecimals(num) {
    if (isNaN(num * 1)) {
        return null; // 非数字返回null
    } else {
        return parseInt(num * 100) / 100;
    }
}

exports.renderCostStatusSubTable = function (list) {
    list = list || [];
    var parents = $('#subProjectData').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var directMoney = item.directMoney || '0';
        var mtrlMoney = item.mtrlMoney || '0';
        var laborMoney = item.laborMoney || '0';
        var measureMoney = item.measureMoney || '0';
        var subletMoney = item.subletMoney || '0';
        var directMoneyPer = item.directType == 4 ? '无预算' : item.directMoneyPer + '%';
        var mtrlMoneyPer = item.mtrlType == 4 ? '无预算' : item.mtrlMoneyPer + '%';
        var laborMoneyPer = item.laborType == 4 ? '无预算' : item.laborMoneyPer + '%';
        var measureMoneyPer = item.measureType == 4 ? '无预算' : item.measureMoneyPer + '%';
        var subletMoneyPer = item.subletType == 4 ? '无预算' : item.subletMoneyPer + '%';
        var dom = $('<tr>\
      <td>' + item.subProjName + '</td>\
      <td>\
      <div>\
      <span style="display: inline-block;width: 100px;text-align: right;">' + directMoneyPer + '</span>\
    <div class="icon-line"></div>\
    <div class="' + parseStatusClass(item.directType) + '"></div>\
    <div class="icon-line"></div>\
    <span>' + reserveTwoDecimals(directMoney) + '</span>\
  </div>\
  </td>\
    <td>\
      <div>\
        <span style="display: inline-block;width: 100px;text-align: right;">' + mtrlMoneyPer + '</span>\
        <div class="icon-line"></div>\
        <div class="' + parseStatusClass(item.mtrlType) + '"></div>\
        <div class="icon-line"></div>\
    <span>' + reserveTwoDecimals(mtrlMoney) + '</span>\
      </div>\
    </td>\
    <td>\
      <div>\
        <span style="display: inline-block;width: 100px;text-align: right;">' + laborMoneyPer + '</span>\
        <div class="icon-line"></div>\
        <div class="' + parseStatusClass(item.laborType) + '"></div>\
        <div class="icon-line"></div>\
    <span>' + reserveTwoDecimals(laborMoney) + '</span>\
      </div>\
    </td>\
    <td>\
      <div>\
        <span style="display: inline-block;width: 100px;text-align: right;">' + measureMoneyPer + '</span>\
        <div class="icon-line"></div>\
        <div class="' + parseStatusClass(item.measureType) + '"></div>\
        <div class="icon-line"></div>\
    <span>' + reserveTwoDecimals(measureMoney) + '</span>\
      </div>\
    </td>\
    <td>\
      <div>\
        <span style="display: inline-block;width: 100px;text-align: right;">' + subletMoneyPer + '</span>\
        <div class="icon-line"></div>\
        <div class="' + parseStatusClass(item.subletType) + '"></div>\
        <div class="icon-line"></div>\
    <span>' + reserveTwoDecimals(subletMoney) + '</span>\
      </div>\
    </td>\
  </tr>');
        dom.appendTo(parents)
    }
};

/**
 *
 * 分部图文标记
 * @param list
 */
function initDivisionMap(list) {
    var datas = initDivisionData(list);
    var divisionMap = echarts.init(document.getElementById('costContract'), null, {width: 268, height: 210});
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: datas,
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    divisionMap.setOption(option, false);
}

function initDivisionData(list) {
    var datas = [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        datas.push({
            value: item.settleMoney,
            name: item.subProjName
        })
    }
    return datas;
}

exports.renderCostRiskManagement = function (obj) {
    var RiskManagement = $('#RiskManagement').html('');
    var dom = $('<tr>\n' +
        '            <td style="width: 136px;font-weight: bold;color: #333;">风控项目</td>\n' +
        '            <td style="width: 136px;">动态成本</td>\n' +
        '            <td style="width: 136px;">材料费</td>\n' +
        '            <td style="width: 136px;">人工费</td>\n' +
        '            <td style="width: 136px;">措施费</td>\n' +
        '            <td style="width: 136px;">分包费</td>\n' +
        '            <td style="width: 136px;">间接费</td>\n' +
        '        </tr>');
    dom.appendTo(RiskManagement);
    var directMoneyPer = obj.directType == 4 ? '无预算' : obj.directMoneyPer + '%';
    var mtrlMoneyPer = obj.mtrlType == 4 ? '无预算' : obj.mtrlMoneyPer + '%';
    var laborMoneyPer = obj.laborType == 4 ? '无预算' : obj.laborMoneyPer + '%';
    var measureMoneyPer = obj.measureType == 4 ? '无预算' : obj.measureMoneyPer + '%';
    var subletMoneyPer = obj.subletType == 4 ? '无预算' : obj.subletMoneyPer + '%';
    var overheadMoneyPer = obj.overheadType == 4 ? '无预算' : obj.overheadMoneyPer + '%';
    var second = $('<tr>\n' +
        '            <td style="font-weight: bold;color: #333;">动态成本/目标成本</td>\n' +
        '            <td>' + directMoneyPer + '</td>\n' +
        '            <td>' + mtrlMoneyPer + '</td>\n' +
        '            <td>' + laborMoneyPer + '</td>\n' +
        '            <td>' + measureMoneyPer + '</td>\n' +
        '            <td>' + subletMoneyPer + '</td>\n' +
        '            <td>' + overheadMoneyPer + '</td>\n' +
        '        </tr>');
    second.appendTo(RiskManagement);
    var three = $('<tr>\n' +
        '            <td style="font-weight: bold;color: #333;">风险评估</td>\n' +
        '            <td>\n' +
        '                <div class="' + parseStatusClass(obj.directType) + '"></div>\n' +
        '            </td>\n' +
        '            <td>\n' +
        '                <div class="' + parseStatusClass(obj.mtrlType) + '"></div>\n' +
        '            </td>\n' +
        '            <td>\n' +
        '                <div class="' + parseStatusClass(obj.laborType) + '"></div>\n' +
        '            </td>\n' +
        '            <td>\n' +
        '                <div class="' + parseStatusClass(obj.measureType) + ' "></div>\n' +
        '            </td>\n' +
        '            <td>\n' +
        '                <div class="' + parseStatusClass(obj.subletType) + '"></div>\n' +
        '            </td>\n' +
        '            <td>\n' +
        '                <div class="' + parseStatusClass(obj.overheadType) + '"></div>\n' +
        '            </td>\n' +
        '        </tr>');
    three.appendTo(RiskManagement);
    var directMoney = obj.directMoney || 0
    var mtrlMoney = obj.mtrlMoney || 0
    var laborMoney = obj.laborMoney || 0
    var measureMoney = obj.measureMoney || 0
    var subletMoney = obj.subletMoney || 0
    var overheadMoney = obj.overheadMoney || 0
    directMoney = directMoney.toFixed(2)
    mtrlMoney = mtrlMoney.toFixed(2)
    laborMoney = laborMoney.toFixed(2)
    measureMoney = measureMoney.toFixed(2)
    subletMoney = subletMoney.toFixed(2)
    overheadMoney = overheadMoney.toFixed(2)
    var four = $('<tr>\n' +
        '            <td style="font-weight: bold;color: #333;">动态支出金额</td>\n' +
        '            <td>' + directMoney + '</td>\n' +
        '            <td>' + mtrlMoney + '</td>\n' +
        '            <td>' + laborMoney + '</td>\n' +
        '            <td>' + measureMoney + '</td>\n' +
        '            <td>' + subletMoney + '</td>\n' +
        '            <td>' + overheadMoney + '</td>\n' +
        '        </tr>');
    four.appendTo(RiskManagement);
};

/**
 * 初始化initProfitDom 地图
 */
function initProfitDomMap(datas) {
    var profitEcharts = echarts.init(document.getElementById('costIncome'), null, {width: 268, height: 210});
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: datas,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    profitEcharts.setOption(option, false);
}

function parseStatusClass(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return 'icon-piece piece-bc-009441';
        case 2:
            return 'icon-piece piece-bc-009441';// 原为可控
        case 3:
            return 'icon-piece piece-bc-e33d14';
        case 4:
            return 'icon-piece piece-bc-f8f8f8';
    }
}

exports.renderUpdateAccountModalTable = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    var expctMoney = 0;
    var settleMoney = 0;
    for (var i = 0; i < list.length; i++) {
        var item = list[i]
        expctMoney += item.expctMoney;
        settleMoney += item.settleMoney;
        var dom = $('<tr class="small data">\
      <td class="border">' + item.subProjName + '</td>\
      <td class="border">' + reserveTwoDecimals(item.expctMoney) + '</td>\
      <td class="border"><input type="text" placeholder="填写" name="settleMoney" value="' + item.settleMoney + '"></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    if (list.length > 0) {
        $('<tr class="small">\
      <td class="border">合计</td>\
      <td class="border"><input type="text" placeholder="系统计算" value="' + expctMoney + '"></td>\
      <td class="border"><input type="text" placeholder="系统计算" class="settleMoneys" value="' + settleMoney + '"></td>\
    </tr>').appendTo(parents);
    }
    initEvent.initUpdateAccountModal(parents);
};


exports.renderTotalAccountRender = function (obj, modal) {
    var list = {list1: '总产值', list2: '应收账款', list3: '实收账款'};
    var parents = modal.$body.find('tbody').html('');
    for (var key in obj) {
        var count = 0;
        var outputMoney = 0;
        for (var i = 0; i < obj[key].length; i++) {
            var item = obj[key][i];
            count++;
            var dom = '';
            if (count === 1) {
                outputMoney += item.outputMoney;
                dom = $('<tr class="small">\
         <td class="border" rowspan="' + obj[key].length + '">' + list[key] + '</td>\
          <td class="border">' + count + '</td>\
          <td class="border">' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
          <td class="border">' + reserveTwoDecimals(item.outputMoney) + '</td>\
          <td class="border">\
          <div style="color: #999">' + reserveTwoDecimals(outputMoney) + '</div>\
          </td>\
          <td class="border">\
          <a>删除</a>\
          </td>\
          </tr>')
            } else {
                outputMoney += item.outputMoney;
                dom = $('<tr class="small">\
         <td class="border">' + count + '</td>\
          <td class="border">' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
          <td class="border">' + reserveTwoDecimals(item.outputMoney) + '</td>\
          <td class="border">\
          <div style="color: #999">' + reserveTwoDecimals(outputMoney) + '</div>\
          </td>\
          <td class="border">\
          <a>删除</a>\
          </td>\
          </tr>');
            }
            dom.data('item', item);
            dom.appendTo(parents);
        }
    }
    initEvent.initTotalAccountModal(parents, modal);
};

/**
 * 绘制分部select
 * @param list
 */
exports.renderCostSupProjectSelectDom = function (list, parents) {
    list = list || [];
    parents = parents.html('');
    $('<option value="0">全部</option>').appendTo(parents);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.subProjName);
        dom.appendTo(parents);
    }
}
/**
 * 项目费用构成
 * @param obj
 */
exports.renderCostChangeReport = function (obj) {
    var parents = $('#profitDom').html('');
    var grossProfitMoney = obj.grossProfitMoney || 0;
    var grossProfitMoneyPer = obj.grossProfitMoneyPer || 0;
    $('#grossProfitMoneyPer').text(reserveTwoDecimals(grossProfitMoneyPer) + '%');
    $('#grossProfitMoney').text(reserveTwoDecimals(grossProfitMoney));
    var mtrlMoney = obj.mtrlMoney || 0;
    var mtrlMoneyPer = obj.mtrlMoneyPer || 0;
    var laborMoney = obj.laborMoney || 0;
    var laborMoneyPer = obj.laborMoneyPer || 0;
    var measureMoney = obj.measureMoney || 0;
    var measureMoneyPer = obj.measureMoneyPer || 0;
    var subletMoney = obj.subletMoney || 0;
    var subletMoneyPer = obj.subletMoneyPer || 0;
    var overheadMoney = obj.overheadMoney || 0;
    var overheadMoneyPer = obj.overheadMoneyPer || 0;
    var dom = $('<tr class="small">\
      <td class="border">材料费</td>\
      <td class="border">' + reserveTwoDecimals(mtrlMoney) + '</td>\
      <td class="border">' + reserveTwoDecimals(mtrlMoneyPer) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">人工费</td>\
      <td class="border">' + reserveTwoDecimals(laborMoney) + '</td>\
      <td class="border">' + reserveTwoDecimals(laborMoneyPer) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">措施费</td>\
      <td class="border">' + reserveTwoDecimals(measureMoney) + '</td>\
      <td class="border">' + reserveTwoDecimals(measureMoneyPer) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">分包费</td>\
      <td class="border">' + reserveTwoDecimals(subletMoney) + '</td>\
      <td class="border">' + reserveTwoDecimals(subletMoneyPer) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">间接费</td>\
      <td class="border">' + reserveTwoDecimals(overheadMoney) + '</td>\
      <td class="border">' + reserveTwoDecimals(overheadMoneyPer) + '</td>\
      </tr>');
    dom.appendTo(parents);
    var datas = [
        {value: mtrlMoney, name: '材料费'},
        {value: laborMoney, name: '人工费'},
        {value: measureMoney, name: '措施费'},
        {value: subletMoney, name: '分包费'},
        {value: overheadMoney, name: '间接费'}
    ];
    initProfitDomMap(datas)
};

/**
 * 保留两位小数
 * @param {Number} num 需要处理为只保留两位的数字
 */
function reserveTwoDecimals(num) {
    if (isNaN(num * 1)) {
        return null; // 非数字返回null
    } else {
        return parseInt(num * 100) / 100;
    }
}

/**
 * 工程分部信息
 * @param list
 */
exports.renderCostSubProjectTable = function (list) {
    list = list || [];
    var parents = $("#divisionProjectTable").html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">\
                  <td class="border">' + item.subProjName + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.settleMoney) + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.settleMoneyPer) + '</td>\
                </tr>');
        dom.appendTo(parents);
    }
    initDivisionMap(list);
};
exports.rendercostSubProjectListTable = function (list) {
    list = list || [];
    var parents = $('#costDivisionTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var grossProfitMoneyPer = item.grossProfitMoneyPer ? item.grossProfitMoneyPer + "%" : '0%';
        var mtrlMoneyPer = item.mtrlMoneyPer ? item.grossProfitMoneyPer + "%" : '0%';
        var laborMoneyPer = item.laborMoneyPer ? item.laborMoneyPer : '0%';
        var measureMoneyPer = item.measureMoneyPer ? item.measureMoneyPer : '0%';
        var subletMoneyPer = item.subletMoneyPer ? item.subletMoneyPer : '0%';
        var dom = $('<tr class="active">\n' +
            '                <td>' + item.subProjName + '</td>\n' +
            '                <td>' + grossProfitMoneyPer + '</td>\n' +
            '                <td>' + mtrlMoneyPer + '</td>\n' +
            '                <td>' + laborMoneyPer + '</td>\n' +
            '                <td>' + measureMoneyPer + '</td>\n' +
            '                <td>' + subletMoneyPer + '</td>\n' +
            '            </tr>');
        dom.appendTo(parents);
    }
};

exports.renderCostTransformReport = function (obj, modal) {
    if (modal) {
        modal.$body.find('[name=remark1]').val(obj.remark1);
        modal.$body.find('[name=remark2]').val(obj.remark2);
        modal.$body.find('[name=remark3]').val(obj.remark3);
        modal.$body.find('[name=remark4]').val(obj.remark4);
    } else {
        $('[name=economyTarget]').val(obj.remark1);
        $('[name=decisionSummary]').val(obj.remark2);
        $('[name=riskEstimate]').val(obj.remark3);
        $('[name=importanceMonitor]').val(obj.remark4);
    }
};
/**
 * 预付款申请单 数据
 * @param obj
 * @param modal
 */
exports.renderCostStatusPayMoney = function (obj, modal) {
    var entp = obj.entp || {};
    var cntr = obj.cntr || {};
    var settleCost = obj.settleCost || {};
    var financePayable = obj.financePayable || {};
    var payablePrice = financePayable.payablePrice || 0;
    var lastPayablePrice = financePayable.lastPayablePrice || 0;
    var lastPayableTax = financePayable.lastPayableTax || 0;
    var payableTax = financePayable.payableTax || 0;
    var payAbledMoney = financePayable.settlePrice - lastPayablePrice;
    var payTaxAbledMoney = financePayable.settleTax - lastPayableTax;
    modal.$body.find('[name=costNo]').val(financePayable.costNo);
    modal.$body.find('[name=payablePrice]').val(financePayable.settlePrice);
    modal.$body.find('[name=payableTax]').val(financePayable.settleTax);
    modal.$body.find('[name=entpName]').val(entp.entpName);
    modal.$body.find('.cntrPrice').html(cntr.cntrPrice);
    modal.$body.find('[name=contactName]').val(entp.contactName);
    modal.$body.find('[name=openName]').val(entp.openName);
    modal.$body.find('[name=openBank]').val(entp.openBank);
    modal.$body.find('[name=bankCard]').val(entp.bankCard);
    modal.$body.find('[name=payAbledMoney]').val(payAbledMoney);// 已支付金额
    modal.$body.find('[name=payTaxAbledMoney]').val(payTaxAbledMoney);
    modal.$body.find('[name=payedMoney]').val(payAbledMoney);
    modal.$body.find('[name=payedTaxMoney]').val(payTaxAbledMoney);
    modal.$body.find('[name=entpPhone]').val(entp.phone);
    modal.$body.find('.subProjName').html(cntr.subProjName);
    modal.$body.find('.costName').html(settleCost.costName);
    modal.$body.find('.costNo').html(settleCost.costNo);
    modal.$body.find('.settleName').html(cntr.settleName);
    modal.$body.find('.settleNo').html(cntr.settleNo);
    modal.$body.find('.settUserName').html(settleCost.acctChargeName);
    modal.$body.find('.acctChargeName').html(cntr.settUserName);
    modal.$body.find('.settlePrice').html(cntr.settlePrice + '元');
    modal.$body.find('.taxMoney').html(settleCost.taxMoney + '元');
    modal.$body.find('.cntrName').html(cntr.cntrName || '无');
    modal.$body.find('.cntrNo').html(cntr.cntrNo || '无');
    modal.$body.find('.entpName').html(entp.entpName);
    modal.$body.find('.contactName').html(entp.contactName);
    modal.$body.find('.ensureMoney').html(cntr.ensurePer + '%');
    var taxType = cntr.taxType === 2 ? "否" : '是';
    modal.$body.find('.taxType').html(taxType);
    modal.$body.find('.ensureMonth').html(cntr.ensureMonth + '个月');
    modal.$body.find('.payTypeDesc').html(cntr.payTypeDesc);
    modal.$body.find('.openBank').html(entp.openBank);
    modal.$body.find('.openName').html(entp.openName);
    modal.$body.find('.bankCard').html(entp.bankCard);
    var costMoney = settleCost.costMoney || 0;
    var taxMoney = settleCost.taxMoney || 0;
    var prepayMoney = settleCost.prepayMoney || 0;
    var prepayTaxMoney = settleCost.prepayTaxMoney || 0;
    var payableMoney = costMoney - prepayMoney;
    var payableTaxMoney = taxMoney - prepayTaxMoney;
    modal.$body.find('.payedMoney').html("已支付金额:" + (prepayMoney) + '(元)');
    modal.$body.find('.payedTaxMoney').html("已提供税票:" + (prepayTaxMoney) + '(元)');
    modal.$body.find('.payableMoney').html(payableMoney.toFixed(2) + '元');
    modal.$body.find('.payableTaxMoney').html(payableTaxMoney + '元');
    modal.$body.find('.ensurePayMoney').html(settleCost.ensureMoney + ' 元');
    modal.$body.find('.ensurePayMonth').html(settleCost.ensureMoth + '个月');
    modal.$body.find('.remark').html(settleCost.remark || "");
    var addTime = settleCost.addTime ? moment(settleCost.addTime).format('YYYY/MM/DD') : '- / - / -'
    modal.$body.find('.project-time').html(addTime);
}

exports.renderPayRecordHistoryTable = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">\n' +
            '                <td class="border">' + count + '</td>\n' +
            '                <td class="border">' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\n' +
            '                <td class="border">' + item.costTypeName + '</td>\n' +
            '                <td class="border">' + item.costNo + '</td>\n' +
            '                <td class="border">' + item.applyUserName + '</td>\n' +
            '                <td class="border">' + item.costName + '</td>\n' +
            '                <td class="border">' + item.billMoney + '</td>\n' +
            '                <td class="border">' + item.taxMoney + '</td>\n' +
            '            </tr>');
        dom.appendTo(parents);
    }
};
/**
 * 材料单详情绘制
 * @param obj
 * @param modal
 */
exports.renderCostStatusMaterial = function (obj, modal) {
    var entp = obj.entp || {};
    var financePayable = obj.financePayable || {};
    var mtrlPlan = obj.mtrlPlan || {};
    var addTime = financePayable.addTime ? moment(financePayable.addTime).format('YYYY/MM/DD') : 0
    modal.$body.find('.project-time').text(addTime)
    modal.$body.find('.subProjName').html(financePayable.subProjName)
    modal.$body.find('.costName').html(financePayable.costName)
    modal.$body.find('.costNo').html(financePayable.costNo)
    modal.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName)
    modal.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo)
    modal.$body.find('.prchUserName').html(mtrlPlan.prchUserName)
    modal.$body.find('.costMoney').html(financePayable.payablePrice)
    modal.$body.find('.taxMoney').html(financePayable.payableTax)
    if (entp.cntrId) {
        $('#contractInfo').show();
        modal.$body.find('.entprName').html(entp.entpName);
        modal.$body.find('.cntrName').html(entp.cntrName);
        modal.$body.find('.cntrNo').html(entp.cntrNo);
        modal.$body.find('.entpName').html(entp.entpName);
        modal.$body.find('.contactName').html(entp.contactName);
        modal.$body.find('.cntrPrice').html(entp.cntrPrice);
        modal.$body.find('.ensureMoney').html(entp.ensureMoney);
        modal.$body.find('.ensureMoney').html(entp.ensureMoney);
        modal.$body.find('.openBank').html(entp.openBank)
        modal.$body.find('.openName').html(entp.openName)
        modal.$body.find('.bankCard').html(entp.bankCard)
        modal.$body.find('[name=taxType][value=' + obj.taxType + ']').prop('checked', true);
    } else {
        $('#contractInfo').hide();
    }
    modal.$body.find('.payTypeDesc').html()
    modal.$body.find('.payedMoney').html() // 已支付
    modal.$body.find('.payedTaxMoney').html() // 已支付含税
    modal.$body.find('.payableMoney').html() // 应付款
    modal.$body.find('.payableTaxMoney').html() // 应提供税票
    modal.$body.find('.ensurePayMoney').html() // 暂扣(质保)金额
    modal.$body.find('.ensurePayMonth').html()//暂扣质保(期限)
    modal.$body.find('.remark').html()
};
/**
 * 费用单
 * @param modal
 * @param obj
 */
exports.renderFinancialCostModal = function (modal, obj) {
    var cntr = obj.cntr ? obj.cntr : ''
    var entp = obj.entp ? obj.entp : {};
    var mtrlCost = obj.mtrlCost ? obj.mtrlCost : {};
    var financeCost = obj.financeCost ? obj.financeCost : {};
    var settleCost = obj.settleCost ? obj.settleCost : {};
    var costMoney, taxMoney, costNo;
    costMoney = settleCost.costMoney || mtrlCost.costMoney;
    taxMoney = settleCost.taxMoney || mtrlCost.taxMoney;
    costNo = settleCost.costNo || mtrlCost.costNo;
    if (cntr) {//预付款
        modal.$body.find('[name=cntrPrice]').val(cntr.cntrPrice);//合同编号
        modal.$body.find('[name=cntrNo]').val(cntr.cntrNo);//合同金额
        modal.$body.find('[name=taxType][value=' + cntr.taxType + ']').prop('checked', true);//是否含税
    }
    modal.$body.find('[name=payablePrice]').val(costMoney);//主费用单号
    modal.$body.find('[name=payableTax]').val(taxMoney);//结算金额
    modal.$body.find('[name=costNo]').val(costNo);//税票金额
    modal.$body.find('[name=entpName]').val(entp.entpName);
    modal.$body.find('[name=entpPhone]').val(entp.phone);
    modal.$body.find('[name=contactName]').val(entp.contactName);
    modal.$body.find('[name=openBank]').val(entp.openBank);
    modal.$body.find('[name=openName]').val(entp.openName);
    modal.$body.find('[name=bankCard]').val(entp.bankCard);
    modal.$body.find('[name=costName]').val(financeCost.costName);
    modal.$body.find('[name=billMoney]').val(financeCost.payMoney);
    modal.$body.find('[name=taxMoney]').val(financeCost.taxMoney);
}