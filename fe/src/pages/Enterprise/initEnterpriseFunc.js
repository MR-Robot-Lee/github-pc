var enterpriseApi = require('./enterpriseApi');
var renderEnterpirseTable = require('./renderEnterpirseTable');
/**
 * 获取材料历史列表
 * @param data
 * @param page
 */
exports.getMaterialHistoryListFunc = function (data, page) {
    var that = this;
    enterpriseApi.getMaterialHistoryList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 10;
        var pageSize = res.data ? res.data.pageSize : 1;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        page.change(function ($page) {
            that.getMaterialHistoryListFunc({pageNo: $page.pageNo, pageSize: $page.pageSize}, page);
        });
        renderEnterpirseTable.renderMaterialHistoryTable(list);
    });
};
exports.getMaterialPriceMoneyFunc = function (data) {
    enterpriseApi.getMaterialPriceMoney(data).then(function (res) {
        var obj = res.data ? res.data : {};
        renderEnterpirseTable.renderMaterialHistoryDom(obj);
    })
};
exports.delMaterialHistoryFunc = function (id, modal) {
    enterpriseApi.delMaterialHistory(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var id = $('#materialHistoryId').data('hid');
            window.location.replace('/enterprise/material/detail?id=' + id);
        }
    })
};

/**
 * 措施
 * @param data
 * @param page
 */
exports.getStepListFunc = function (data, page) {
    var that = this;
    enterpriseApi.getStepList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 10;
        var pageSize = res.data ? res.data.pageSize : 1;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getStepListFunc({pageNo: $page.pageNo, pageSize: $page.pageSize}, page);
        });
        renderEnterpirseTable.renderStepHistoryTable(list);
    })
};
exports.getStepPriceMoneyFunc = function (data) {
    enterpriseApi.getStepPriceMoney(data).then(function (res) {
        var obj = res.data ? res.data : {};
        renderEnterpirseTable.renderStepHistoryDom(obj);
    })
};
exports.delStepListFunc = function (id, modal) {
    enterpriseApi.delLaborList(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var id = $('#stepHistoryId').data('hid');
            window.location.replace('/enterprise/step/detail?id=' + id);
        }
    })
};



/**
 * 人力资源
 * @param data
 * @param page
 */
exports.getHrListFunc = function (data, page) {
    // var that = this;
    enterpriseApi.getHrList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        // var pageNo = res.data ? res.data.pageNo : 10;
        // var pageSize = res.data ? res.data.pageSize : 1;
        // var total = res.data ? res.data.total : 0;
        // page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        // //绑定分页修改事件
        // page.change(function ($page) {
        //     //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
        //     //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
        //     //理论上 接口返回的分页数据应该与 函数里的data相同
        //     that.getHrListFunc({pageNo: $page.pageNo, pageSize: $page.pageSize}, page);
        // });
        renderEnterpirseTable.renderHrHistoryTable(list);
    })
};
exports.getHrPriceMoneyFunc = function (data) {
    enterpriseApi.getHrPriceMoney(data).then(function (res) {
        var obj = res.data ? res.data : {};
        renderEnterpirseTable.renderHrHistoryDom(obj);
    })
};
exports.delHrListFunc = function (id, modal) {
    enterpriseApi.delHrList(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var id = $('#hrHistoryId').data('id');
            var workerNo = $('#hrHistoryId').data('workerNo');
            window.location.replace('/enterprise/hr/detail?id=' + id + '&workerNo=' + workerNo);
        }
    })
};



/**
 * 人工费
 * @param data
 * @param page
 */
exports.getLaborListFunc = function (data, page) {
    var that = this;
    enterpriseApi.getLaborList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 10;
        var pageSize = res.data ? res.data.pageSize : 1;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getLaborListFunc({pageNo: $page.pageNo, pageSize: $page.pageSize}, page);
        });
        renderEnterpirseTable.renderLaborHistoryTable(list);
    })
};
exports.getLaborPriceMoneyFunc = function () {
    enterpriseApi.getLaborPriceMoney().then(function (res) {
        var obj = res.data ? res.data : {};
        renderEnterpirseTable.renderLaborHistoryDom(obj);
    })
};
exports.delLaborListFunc = function (id, modal) {
    enterpriseApi.delLaborList(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var id = $('#laborHistoryId').data('hid');
            window.location.replace('/enterprise/charge/detail?id=' + id);
        }
    })
};
/**
 * 分包
 * @param data
 * @param page
 */
exports.getSubpackageList = function (data, page) {
    var that = this;
    enterpriseApi.getSubpackageList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 10;
        var pageSize = res.data ? res.data.pageSize : 1;
        var total = res.data ? res.data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getSubpackageList({pageNo: $page.pageNo, pageSize: $page.pageSize}, page);
        });
        renderEnterpirseTable.renderSubpagckageHistoryTable(list);
    })
};
exports.getSubpackagePriceMoneyFunc = function () {
    enterpriseApi.getSubpackagePriceMoney().then(function (res) {
        var obj = res.data ? res.data : {};
        renderEnterpirseTable.renderSubpagckageHistoryDom(obj);
    })
};

exports.delSubpackageListFunc = function (id, modal) {
    enterpriseApi.delSubpackageList(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var id = $('#subpackageHistoryId').data('hid');
            window.location.replace('/enterprise/subpackage/detail?id=' + id);
        }
    })
};

exports.getSupplierListFunc = function (data, page) {
    var that = this;
    enterpriseApi.getSupplierList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = res.data ? res.data.pageNo : 1;
        var pageSize = res.data ? res.data.pageSize : 0;
        var total = res.data ? res.data.total : 1;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getSupplierListFunc({pageNo: $page.pageNo, pageSize: $page.pageSize}, page);
        });
        renderEnterpirseTable.renderSupplierHistoryTable(list);
    })
};

exports.getSupplierPriceMoneyFunc = function () {
    enterpriseApi.getSupplierObjList().then(function (res) {
        var obj = res.data ? res.data : {};
        renderEnterpirseTable.renderSuppliereHistoryDom(obj);
    })
};

exports.renderCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var enterpriseData = user.permission['cost:get'];
    if (enterpriseData) {
        $('.costGet').show();
    } else {
        $('.costGet').hide();
    }
    var enterpriseSupplier = user.permission['enterprise:get'];
    if (enterpriseSupplier) {
        $('#supplierNav').show();
    } else {
        $('#supplierNav').hide();
    }
    var enterpriseLibrary = user.permission['projDb:get'];
    if (enterpriseLibrary) {
        $('#libraryNav').show();
    } else {
        $('#libraryNav').hide();
    }
};
/**
 * 材料、人工、分包、人工
 */
exports.renderEnterpirseCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var cost = user.permission['cost:*'];
    if (cost) {
        $('#enterpriseCategory').show();
        $('#enterpriseMaterial').show();
        $('#moveEnterpriseData').show();
        $('#addEnterprise').show();
        $('.icon-position').show();
        $('.Competence').show();
    } else {
        $('#enterpriseCategory').hide();
        $('#enterpriseMaterial').hide();
        $('#addEnterprise').hide();
        $('#moveEnterpriseData').hide();
        $('.Competence').hide();
    }
}
/**
 * 供应商
 */
exports.renderSupplierCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var enterprise = user.permission['enterprise:*'];
    if (enterprise) {
        $('#enterpriseCategory').show();
        $('#enterpriseMaterial').show();
        $('#moveEnterpriseData').show();
        $('#addEnterprise').show();
        $('.icon-position').show();
        $('.Competence').show();
    } else {
        $('#enterpriseCategory').hide();
        $('#enterpriseMaterial').hide();
        $('#moveEnterpriseData').hide();
        $('#addEnterprise').hide();
        $('.Competence').hide();
    }
} //
/**
 * 项目库
 */
exports.renderLibriryCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var projDb = user.permission['projDb:*'];
    if (projDb) {
        $('#enterpriseCategory').show();
        $('#enterpriseMaterial').show();
        $('#moveEnterpriseData').show();
        $('.icon-position').show();
        $('#addEnterprise').show();
        $('.Competence').show();
    } else {
        $('#enterpriseCategory').hide();
        $('#enterpriseMaterial').hide();
        $('#moveEnterpriseData').hide();
        $('#addEnterprise').hide();
        $('.Competence').hide();
    }
};
/**
 * 价格波动
 */
exports.getCheckPriceFun = function (parent, item, type) {
    var data = {};
    var request;
    data.pageNo = 1;
    data.pageSize = 10;
    if (type === 'labor') {
        data.laborId = item.id;
        request = enterpriseApi.getLaborCheckPrice(data);
    } else if (type === 'measure') {
        data.measureId = item.id;
        request = enterpriseApi.getMeasureCheckPrice(data);
    } else if (type === 'sublet') {
        data.subletId = item.id;
        request = enterpriseApi.getSubletCheckPrice(data);
    } else if (type === 'material') {
        data.mtrlId = item.id;
        request = enterpriseApi.getMaterialCheckPrice(data);
    }
    request.then(function (res) {
        var arr = res.data ? res.data.data : [];
        var prices = [];
        var date = [];
        for (var i = 0; i < arr.length; i++) {
            var p = arr[i].taxPrice || arr[i].prchPrice;
            var d = new Date(arr[i].prchTime).Format("yyyy-MM-dd");
            prices.unshift(p);
            date.unshift(d);
        }
        var checkId = ($(parent).parents('tr').data('checkId'));
        $('.fluctuations').hide();
        $(parent).next().show();
        initCheckPrice(checkId, prices, date, type);
    });
}

function initCheckPrice(id, data, date, type) {
    var myChart = renderChartFactory(id, type);
    var line = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['出勤', '却少'],
            bottom: '30%'
        },
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    show: true
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#999999'
                    }
                },
                boundaryGap: false,
                data: date
            }
        ],
        yAxis: {
            type: 'value',
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#999999'
                }
            }
        },
        series: [
            {
                name: '价格',
                type: 'line',
                smooth: false,
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        color: "#229aee"
                    }
                },
                data: data,
                animationEasing: 'quinticInOut'
            }
        ]
    };
    myChart.setOption(line, false);
}

function renderChartFactory(id, type) {
    var checkId = '';
    if (type === 'labor') {
        checkId = 'fluctuations-labor-' + id;
    } else if (type === 'measure') {
        checkId = 'fluctuations-measure-' + id;
    } else if (type === 'sublet') {
        checkId = 'fluctuations-sublet-' + id;
    } else if (type === 'material') {
        checkId = 'fluctuations-material-' + id;
    }
    return echarts.init(document.getElementById(checkId));
};

exports.getRegionFunc = function (type, province, city, district) {
    enterpriseApi.getRegion().then(function (res) {
        var data = res.data || {};
        if(type === 'hr'){
            renderEnterpirseTable.renderRegionSelect(data, province, city, district);
        } else if(type === 'supplier'){
            renderEnterpirseTable.renderRegionSelect(data, province, city);
        }
    })
}