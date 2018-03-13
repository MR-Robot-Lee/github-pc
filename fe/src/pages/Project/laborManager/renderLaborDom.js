var renderLaborManagerTable = require('./renderLaborManagerTable');
var initLaborManagerFunc = require('./initLaborManagerFunc');

/**
 * 初始化人力动态
 */
exports.initLaborStatusMap = function initLaborStatusMap(data) {
    var list = data.kaoqinAttendCountStatisList;
    var xArr = [];
    var yArr = [];
    if (list.length < 10) {
        for (var i = 0; i < 10; i++) {
            xArr.push('');
        }
    } else {
        xArr.length = list.length;
    }
    for (var i = 0; i < list.length; i++) {
        xArr[i] = list[i].statisTime;
        yArr.push(list[i].statisCount);
    }
    var myChart = echarts.init(document.getElementById('laborStatus'), null, {width: 900, height: 350});
    var line = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['时间']
        },
        xAxis: [
            {
                name: '时间',
                type: 'category',
                data: xArr
            }
        ],
        yAxis: {
            name: '出勤总人数',
            type: 'value'
        },
        series: [
            {
                name: '出勤总人数',
                type: 'line',
                smooth: true,
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        color: "#229aee"
                    }
                },
                data: yArr,
                animationEasing: 'quinticInOut'
            }
        ]
    };
    myChart.setOption(line, false);
    myChart.off('click');
    myChart.on('click', function (param) {
        for (var j = 0; j < list.length; j++) {
            if (param.name === list[j].statisTime) {
                var _data = {};
                _data.startTime = list[j].startTime;
                _data.endTime = list[j].endTime;
            }
        }
        initLaborManagerFunc.getLaborStatusTableFunc(_data);
    })
};

exports.initLaborStructureMap = function initLaborStructureMap(data) {
    var list = data || [];
    var xArr = [];
    var yArr = [];
    if (list.length < 6) {
        for (var i = 0; i < 6; i++) {
            xArr.push('');
        }
    } else {
        xArr.length = list.length;
    }
    for (var i = 0; i < list.length; i++) {
        xArr[i] = list[i].teamName;
        yArr.push(list[i].attendCount);
    }
    var myChart = echarts.init(document.getElementById('laborStructure'), null, {width: 900, height: 350});
    var line = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['出勤人数'],
            show: false
        },
        xAxis: [
            {
                name: '班组',
                type: 'category',
                data: xArr
            }
        ],
        yAxis: {
            name: '出勤人数',
            type: 'value'
        },
        series: [
            {
                name: '出勤人数',
                type: 'bar',
                smooth: true,
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        color: "#229aee"
                    }
                },
                data: yArr
            }
        ]
    };
    myChart.setOption(line, false);
    myChart.off('click');
    myChart.on('click', function (param) {
        var _data = {};
        _data.teamName = param.name;
        _data.attendCount = param.value;
        initLaborManagerFunc.getLaborStructureTableFunc(_data, list);
    })
};