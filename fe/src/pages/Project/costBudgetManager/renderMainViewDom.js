exports.renderDivisionProjectDom = function renderDivisionProjectDom(list) {
    list = list || [];
    initDivisionMap(list);
    var parents = $("#divisionProjectTable").html('');
    var totalMoney = sumCntrMoney(list);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var expctMoney = 0;
        if (totalMoney > 0) {
            expctMoney = (item.expctMoney / totalMoney * 100).toFixed(2)
        }
        var dom = $('<tr class="small">\
                  <td class="border" title="' + item.subProjName + '"><div style="width:105px;white-space: nowrap;\
                  text-overflow: ellipsis;overflow:hidden;">' + item.subProjName + '</div></td>\
                  <td class="border"><div style="width: 68px;">' + reserveTwoDecimals(item.expctMoney) + '</div></td>\
                  <td class="border">' + reserveTwoDecimals(expctMoney) + '</td>\
                </tr>');
        dom.appendTo(parents);
    }
};

function sumCntrMoney(list) {
    var totalMoney = 0;
    for (var i = 0, length = list.length; i < length; i++) {
        totalMoney += list[i].expctMoney
    }
    return totalMoney;
}

function initDivisionData(list) {
    var datas = [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        datas.push({
            value: item.expctMoney,
            name: item.subProjName
        })
    }
    return datas;
}

function initDivisionMap(list) {
    var datas = initDivisionData(list);
    var divisionMap = echarts.init(document.getElementById('costContract'), null, {width: 268, height: 220});
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

exports.renderDivisionProjectTable = function renderDivisionProjectTable(list) {
    list = list || [];
    var parents = $('#costDivisionTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var budGrossProfit = item.expctMoney === 0 ? 0 : (item.budTotalMoney / item.expctMoney * 100).toFixed(0);
        var budMtrlPrice = item.expctMoney === 0 ? 0 : (item.budMtrlPrice / item.expctMoney * 100).toFixed(0);
        var budSecMtrlPrice = item.expctMoney === 0 ? 0 : (item.budSecMtrlPrice / item.expctMoney * 100).toFixed(0);
        var budLaborPrice = item.expctMoney === 0 ? 0 : (item.budLaborPrice / item.expctMoney * 100).toFixed(0);
        var budMeasurePrice = item.expctMoney === 0 ? 0 : (item.budMeasurePrice / item.expctMoney * 100).toFixed(0);
        var budSubletPrice = item.expctMoney === 0 ? 0 : (item.budSubletPrice / item.expctMoney * 100).toFixed(0);
        var budGrossProfitData = budGrossProfit >= 100 ? 100 : budGrossProfit;
        var budMtrlPriceData = budMtrlPrice >= 100 ? 100 : budMtrlPrice;
        var budSecMtrlPriceData = budSecMtrlPrice >= 100 ? 100 : budSecMtrlPrice;
        var budLaborPriceData = budLaborPrice >= 100 ? 100 : budLaborPrice;
        var budMeasurePriceData = budMeasurePrice >= 100 ? 100 : budMeasurePrice;
        var budSubletPriceData = budSubletPrice >= 100 ? 100 : budSubletPrice;
        var dom = $('<tr class="active">\
                  <td>' + item.subProjName + '</td>\
                  <td>\
                   <div style="width: 100px">\
                   <div class="Progress-Bar-fixed">\
                   <div class="bar-item">\
                   <div class="span-default progress-bc-d38363" style="width: ' + budGrossProfitData + '%"></div>\
                   <div class="progress-desc" style="left: ' + budGrossProfitData + '%">' + budGrossProfit + '%</div>\
                   </div>\
                   </div>\
                   </div>\
                 </td>\
                 <td>\
                  <div style="width: 100px">\
                  <div class="Progress-Bar-fixed">\
                  <div class="bar-item">\
                  <div class="span-default progress-bc-74a084" style="width: ' + budMtrlPriceData + '%"></div>\
                  <div class="progress-desc" style="left: ' + budMtrlPriceData + '%">' + budMtrlPrice + '%</div>\
                  </div>\
                  </div>\
                  </div>\
                </td>\
                <td>\
                 <div style="width: 100px">\
                 <div class="Progress-Bar-fixed">\
                 <div class="bar-item">\
                 <div class="span-default progress-bc-5cc796" style="width: ' + budSecMtrlPriceData + '%"></div>\
                 <div class="progress-desc" style="left: ' + budSecMtrlPriceData + '%">' + budSecMtrlPrice + '%</div>\
                 </div>\
                 </div>\
                 </div>\
                </td>\
                <td>\
                 <div style="width: 100px">\
                 <div class="Progress-Bar-fixed">\
                 <div class="bar-item">\
                 <div class="span-default progress-bc-989abc" style="width: ' + budLaborPriceData + '%"></div>\
                 <div class="progress-desc" style="left: ' + budLaborPriceData + '%">' + budLaborPrice + '%</div>\
                 </div>\
                 </div>\
                 </div>\
                </td>\
                <td>\
                 <div style="width: 100px">\
                 <div class="Progress-Bar-fixed">\
                 <div class="bar-item">\
                 <div class="span-default progress-bc-506774" style="width: ' + budMeasurePriceData + '%"></div>\
                 <div class="progress-desc" style="left: ' + budMeasurePriceData + '%">' + budMeasurePrice + '%</div>\
                 </div>\
                 </div>\
                 </div>\
               </td>\
               <td>\
                <div style="width: 100px">\
                <div class="Progress-Bar-fixed">\
                <div class="bar-item">\
                <div class="span-default progress-bc-61a0a8" style="width: ' + budSubletPriceData + '%"></div>\
                <div class="progress-desc" style="left: ' + budSubletPriceData + '%">' + budSubletPrice + '%</div>\
                </div>\
                </div>\
                </div>\
               </td>\
               <td>' + item.excpCount + '</td>\
              </tr>');
        dom.appendTo(parents);
    }
};
/**
 * 绘制利润
 */
exports.renderProfitDom = function renderProfitDom(obj) {
    var parents = $('#profitDom').html('');
    var budTotalMoney = obj.budTotalMoney || 0;
    var budMtrlPrice = obj.budMtrlPrice || 0;
    var budSecMtrlPrice = obj.budSecMtrlPrice || 0;
    var budLaborPrice = obj.budLaborPrice || 0;
    var budMeasurePrice = obj.budMeasurePrice || 0;
    var budSubletPrice = obj.budSubletPrice || 0;
    var budOverheadPrice = obj.budOverheadPrice || 0;
    var budGrossProfit = obj.budGrossProfit || 0;
    var expctMoney = obj.expctMoney || 0;
    var budGrossProfitTest = expctMoney === 0 ? "0" : ((budGrossProfit / parseFloat(expctMoney)) * 100).toFixed(2);
    var budMtrlPriceTest = budTotalMoney === 0 ? "0" : (budMtrlPrice / parseFloat(budTotalMoney) * 100).toFixed(2);
    var budSecMtrlPriceTest = budTotalMoney === 0 ? "0" : (budSecMtrlPrice / parseFloat(budTotalMoney) * 100).toFixed(2);
    var budLaborPriceTest = budTotalMoney === 0 ? "0" : (budLaborPrice / parseFloat(budTotalMoney) * 100).toFixed(2);
    var budMeasurePriceTest = budTotalMoney === 0 ? "0" : (budMeasurePrice / parseFloat(budTotalMoney) * 100).toFixed(2);
    var budSubletPriceTest = budTotalMoney === 0 ? "0" : (budSubletPrice / parseFloat(budTotalMoney) * 100).toFixed(2);
    var budOverheadPriceTest = budTotalMoney === 0 ? "0" : (budOverheadPrice / parseFloat(budTotalMoney) * 100).toFixed(2);
    var dom = $('<tr class="small">\
      <td class="border" style="width: 70px;">材料费</td>\
      <td class="border"><div>' + reserveTwoDecimals(budMtrlPrice) + '</div></td>\
      <td class="border" style="width: 90px;">' + reserveTwoDecimals(budMtrlPriceTest) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">辅材费</td>\
      <td class="border">' + reserveTwoDecimals(budSecMtrlPrice) + '</td>\
      <td class="border">' + reserveTwoDecimals(budSecMtrlPriceTest) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">人工费</td>\
      <td class="border">' + reserveTwoDecimals(budLaborPrice) + '</td>\
      <td class="border">' + reserveTwoDecimals(budLaborPriceTest) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">措施费</td>\
      <td class="border">' + reserveTwoDecimals(budMeasurePrice) + '</td>\
      <td class="border">' + reserveTwoDecimals(budMeasurePriceTest) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">分包费</td>\
      <td class="border">' + reserveTwoDecimals(budSubletPrice) + '</td>\
      <td class="border">' + reserveTwoDecimals(budSubletPriceTest) + '</td>\
      </tr>\
      <tr class="small">\
      <td class="border">间接费</td>\
      <td class="border">' + reserveTwoDecimals(budOverheadPrice) + '</td>\
      <td class="border">' + reserveTwoDecimals(budOverheadPriceTest) + '</td>\
      </tr>');
    dom.appendTo(parents);
    initDom(obj, budGrossProfitTest, budGrossProfit);
    initProfitDomMap(obj);
};

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

function initDom(obj, budGrossProfitTest, budGrossProfit) {
    /* $('[name=economyTarget]').val(obj.remark1);
     $('[name=decisionSummary]').val(obj.remark2);
     $('[name=riskEstimate]').val(obj.remark3);
     $('[name=importanceMonitor]').val(obj.remark4);*/
    var cntrMoney = obj.cntrMoney ? obj.cntrMoney + '元' : '0元';
    $("#cntrMoney").text(cntrMoney);
    var expctMoney = obj.expctMoney || 0;
    $('.expctMoneys').val(expctMoney);
    $('.budGrossProfit').text(budGrossProfit.toFixed(2) + '元');
    $('.budGrossProfitTest').text(budGrossProfitTest + '%');
    //$('#exceCount').text(obj.excpCount + '项');
    $('#settleType').text(parseSettleType(obj.settleType));
}

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
 * 初始化initProfitDom 地图
 */
function initProfitDomMap(obj) {
    var datas = [
        {value: obj.budMtrlPrice, name: '材料费'},
        {value: obj.budSecMtrlPrice, name: '辅材费'},
        {value: obj.budLaborPrice, name: '人工费'},
        {value: obj.budMeasurePrice, name: '措施费'},
        {value: obj.budSubletPrice, name: '分包费'},
        {value: obj.budOverheadPrice, name: '间接费'}
    ];
    var profitEcharts = echarts.init(document.getElementById('costIncome'), null, {width: 268, height: 220});
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


exports.renderMaterialCheckSubItemTable = function (list, modal) {
    list = list || [];
    var parents = modal.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.subitemNo + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + item.qpyPer + '</td>\
      <td class="border">' + item.qpySubitem + '</td>\
      <td class="border">' + item.totalQpy.toFixed(2) + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};

exports.renderCostBudgetModal = function (obj, modal) {
    modal.$body.find('[name=remark1]').val(obj.remark1);
    modal.$body.find('[name=remark2]').val(obj.remark2);
    modal.$body.find('[name=remark3]').val(obj.remark3);
    modal.$body.find('[name=remark4]').val(obj.remark4);
    var text = '';
    if (obj && obj.addUserName) {
        text = '评估人 : ' + obj.addUserName + ' ' + moment(obj.addTime).format('YYYY/MM/DD');
    } else {
        var user = window.localStorage.getItem('user');
        user = user ? JSON.parse(user) : {employee: {}};
        var userName;
        userName = userName? user.userName : '无';
        text = '评估人 : ' + userName + ' ' + moment().format('YYYY/MM/DD');
    }
    modal.$body.find('.assess-time').text(text);
};
