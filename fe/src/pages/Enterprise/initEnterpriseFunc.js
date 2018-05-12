var enterpriseApi = require('./enterpriseApi');
var renderEnterpirseTable = require('./renderEnterpirseTable');
var request = require('../../helper/request');

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
        page.update({ pageNo: pageNo, pageSize: pageSize, total: total });
        page.change(function ($page) {
            that.getMaterialHistoryListFunc({ pageNo: $page.pageNo, pageSize: $page.pageSize }, page);
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
        page.update({ pageNo: pageNo, pageSize: pageSize, total: total });
        //绑定分页修改事件
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getStepListFunc({ pageNo: $page.pageNo, pageSize: $page.pageSize }, page);
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
    // LEE: 获取当月时间段
    var dt = new Date();
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var startTime = year + '/' + month + '/1';
    var endTime = year + '/' + (month + 1) + '/1';
    var start = new Date(startTime).getTime();
    var end = new Date(endTime).getTime();
    data = data || {};
    data.startTime = start;
    data.endTime = end;
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
        page.update({ pageNo: pageNo, pageSize: pageSize, total: total });
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getLaborListFunc({ pageNo: $page.pageNo, pageSize: $page.pageSize }, page);
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
        page.update({ pageNo: pageNo, pageSize: pageSize, total: total });
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getSubpackageList({ pageNo: $page.pageNo, pageSize: $page.pageSize }, page);
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
        page.update({ pageNo: pageNo, pageSize: pageSize, total: total });
        //绑定分页修改事件
        page.change(function ($page) {
            //一旦分页有变动，这里就会回调，然后在这里面执行ajax请求接口刷新数据
            //分页的界面更新是由接口返回的数据驱动的 所以ajax请求完成后需要执行update更新分页界面
            //理论上 接口返回的分页数据应该与 函数里的data相同
            that.getSupplierListFunc({ pageNo: $page.pageNo, pageSize: $page.pageSize }, page);
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
    user = user ? JSON.parse(user) : { permission: {} };
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
    user = user ? JSON.parse(user) : { permission: {} };
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
    user = user ? JSON.parse(user) : { permission: {} };
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
    user = user ? JSON.parse(user) : { permission: {} };
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
        if (type === 'hr') {
            renderEnterpirseTable.renderRegionSelect(data, province, city, district);
        } else if (type === 'supplier') {
            renderEnterpirseTable.renderRegionSelect(data, province, city);
        }
    })
}

exports.getSearchTableFunc = function (modal, type) {
    var allTypeId = {
        enterprise: 1,
        charge: 2,
        step: 3,
        subpackage: 4,
        supplier: 5,
        library: 6,
        hr: 7
    };

    var theadArr = [];
    var tbodyArr = [];

    // 要渲染的表头数据
    theadArr[0] = "材料类别";
    if (type === "enterprise") {
        theadArr.push("材料类型");
    }
    // 除了库和分库之外的其他项
    var restTheadItems = {
        enterprise: ["材料名称", "规格型号", "单位", "均价", "合计金额"],
        charge: ["费用名称", "工作内容", "单位", "均价", "合计金额"],
        step: ["费用名称", "工作内容", "单位", "均价", "合计金额"],
        subpackage: ["费用名称", "工作内容", "单位", "均价", "合计金额"],
        supplier: ["供应商名称", "管理员", "绑定手机", "经营范围", "地址"],
        library: ["工程名称", "工程简称", "工程代码", "管理员", "负责人"],
        hr: ["姓名", "电话", "性别", "出生年月", "籍贯"]
    }
    theadArr = theadArr.concat(restTheadItems[type]);

    // 要渲染的表单数据
    var params = {};
    params.typeId = allTypeId[type];
    params.keywords = modal.$body.find('#keywords').val();
    enterpriseApi.getSearchAllLibraryInfo(params).then(function (res) {
        var result = res.data || {};
        var allAttr = {
            enterprise: ["mtrlCategoryName", "mtrlTypeName", "mtrlName", "specBrand", "unit", "avgPrice", "totalMoney"],
            charge: ["laborTypeName", "laborName", "workContent", "unit", "avgPrice", "totalMoney"],
            step: ["measureTypeName", "measureName", "workContent", "unit", "avgPrice", "totalMoney"],
            subpackage: ["subletTypeName", "subletName", "workContent", "unit", "avgPrice", "totalMoney"],
            supplier: ["entpTypeName", "entpName", "contactName", "phone", "businessScope", { address: ["provinceName", "cityName", "address"] }],
            library: ["projTypeName", "projectName", "projShortTitle", "projectNo", "adminName", "chargeName"],
            hr: ["teamName", "workerName", "phone", "sex", "birthday", { address: ["provinceName", "cityName", "districtName"] }]
        }
        for (var i = 0; i < result.length; i++) {
            var obj = {};
            var item = result[i];
            for (var j = 0; j < allAttr[type].length; j++) {
                var attr = allAttr[type][j];
                if (typeof attr === "string") {
                    if (attr === "sex") {
                        obj[attr] = item[attr] == 1 ? "男" : "女";
                    } else {
                        obj[attr] = item[attr];
                    }
                } else {
                    obj.address = [];
                    for (var k = 0; k < attr.address.length; k++) {
                        var tmp = item[attr.address[k]] ? item[attr.address[k]] : "暂无";
                        obj.address.push(tmp);
                    }
                    obj.address = obj.address.join('-');
                }
            }
            tbodyArr.push(obj);
        }

        var list = [];
        list[0] = theadArr;
        list[1] = tbodyArr;
        list[2] = res.data;
        renderEnterpirseTable.renderSearchTable(list, modal, type);
    })
}