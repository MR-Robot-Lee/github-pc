/**
 * 绘制成本
 * @param attentionCost
 * @param id
 */
exports.renderAttentionCost = function (id, attentionCost) {
    var myChart = this.renderChartFactory(id || 'attentionCost');
    option = {
        title: {
            text: '',
            show: false
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#e5e5e5']
            }
        },
        color: ["#3dcc79", "#f8b62a"],
        legend: {
            data: ['收入','支出'],
            top: 30
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {
                show: true
            },
            axisLabel: {
                show: true
            },
            data: attentionCost.recordTime
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} '
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: ['#e5e5e5']
                }
            },
        }],
        dataZoom: [{
            type: 'inside',
            start: 50,
            end: 100
        }, {
            show: true,
            type: 'slider',
            y: '90%',
            start: 50,
            end: 100
        }],
        series: [{
            name: '收入',
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2,
                }
            },
            data: attentionCost.actRecMoney
        },{
            name: '支出',
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2,
                }
            },
            data: attentionCost.costMoney
        }]
    };
    myChart.setOption(option,false);
};
/**
 * 绘制进度
 * @param data
 * @param id
 */
exports.renderAttentionSchedule = function (id, data) {
    var myChart = this.renderChartFactory(id || 'attentionSchedule');
    placeHolderStyle = {
        normal: {
            label: {
                show: false,
                position: "center"
            },
            labelLine: {
                show: false
            },
            color: "#dedede",
            borderColor: "#dedede",
            borderWidth: 0
        },
        emphasis: {
            color: "#dedede",
            borderColor: "#dedede",
            borderWidth: 0
        }
    };
    option = {
        backgroundColor: '#fff',
        color: ['#fc7a26', '#fff', '#516675', '#fff', "#3dcc79"],
        legend: [{
            show: true,
            orient: 'horizontal',
            icon: 'circle',
            left: 'center',
            top: 'center',
            data: ['不喜欢', '喜欢', '跳过']
        }],
        series: [{
            name: '值',
            type: 'pie',
            clockWise: true, //顺时加载
            hoverAnimation: true, //鼠标移入变大
            radius: [200, 200],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    labelLine: {
                        show: false,
                        length: 50,
                        smooth: 0
                    },
                    borderWidth: 5,
                    shadowBlur: 40,
                    borderColor: "#fc7a26",
                    shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                }
            },
            data: [{
                value: 0,
                name: ''
            }, {
                value: 0,
                name: '',
                itemStyle: placeHolderStyle
            }]
        }, {
            name: '白',
            type: 'pie',
            clockWise: false,
            radius: [180, 180],
            hoverAnimation: true,
            data: [{
                value: 1
            }]
        }, {
            name: '值',
            type: 'pie',
            clockWise: true,
            hoverAnimation: false,
            radius: [52, 53],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        width: 10,
                    },
                    labelLine: {
                        show: true,
                        length: 7,
                        length2: 10,
                        smooth: 0
                    },
                    borderWidth: 2,
                    shadowBlur: 40,
                    borderColor: "#5ccccc",
                    shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                }
            },
            data: [{
                value: parseInt(data.planPer),
                name: '工期\n'+parseInt(data.planPer) + '%'
            }, {
                value: 100 - parseInt(data.planPer),
                name: '',
                itemStyle: placeHolderStyle
            }]
        }, {
            name: '白',
            type: 'pie',
            clockWise: false,
            hoverAnimation: false,
            radius: [45, 45],
            data: [{
                value: 1
            }]
        }, {
            name: '值',
            type: 'pie',
            clockWise: true,
            hoverAnimation: false,
            radius: [30, 43],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false,
                        length: 5,
                        smooth: 0
                    },
                    borderWidth: 5,
                    shadowBlur: 40,
                    borderColor: "#3dcc79",
                    shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                }
            },
            data: [{
                value: parseInt(data.completePer),
                name: ''
            }, {
                value: 100 - parseInt(data.completePer),
                name: '',
                itemStyle: placeHolderStyle
            }]
        }, {
            type: 'pie',
            color: ['', '', ""],
            data: [{
                value: '',
                name: ''
            }, {
                value: '',
                name: ''
            }, {
                value: '',
                name: ''
            }],
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            }
        }, {
            name: '白',
            type: 'pie',
            clockWise: true,
            hoverAnimation: false,
            radius: [20, 30],
            label: {
                normal: {
                    position: 'center'
                }
            },
            data: [{
                value: 1,
                label: {
                    normal: {
                        formatter: '已完成',
                        textStyle: {
                            color: '#666666',
                            fontSize: 12
                        }
                    }
                }
            }, {
                tooltip: {
                    show: false
                },
                label: {
                    normal: {
                        formatter: parseInt(data.completePer)+'%',
                        textStyle: {
                            color: '#666666',
                            fontSize: 12
                        }
                    }
                }
            }]
        }]
    };
    myChart.setOption(option, false);
};
/**
 * 绘制人力
 * @param line
 * @param id
 */
exports.renderAttentionLabor = function (id, list) {
    list = list.attendRequireVOList;
    var statisCount = [];
    var requireCount = [];
    var statisTime = [];
    for(var i = 0; i < list.length; i++){
        var item = list[i];
        statisCount.push(item.statisCount);
        requireCount.push(item.requireCount);
        statisTime.push(item.statisTime);
    }
    var myChart = this.renderChartFactory(id || 'attentionLabor');
    option = {
        title: {
            text: '人力',
            left: '50%',
            textAlign: 'center',
            show: false
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            }
        },
        legend: {
            top: 30,
            orient: 'horizontal',
            data: ['需求','出勤']
        },
        xAxis: {
            type: 'category',
            data: statisTime,
            boundaryGap: true,
            axisTick: {
                show: true
            },
            axisLine: {

            },
            axisLabel: {
                margin: 5,
                textStyle: {
                    fontSize: 12
                },
                show: true
            },
            splitLine: {
                lineStyle: {
                    color: ['#e5e5e5']
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {

            },
            axisTick: {
                show: false
            },
            axisLine: {

            },
            axisLabel: {
                margin: 2,
                textStyle: {
                    fontSize: 12
                },
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: ['#e5e5e5']
                }
            },
            splitNumber: 4

        },

        series: [{
            name: '需求',
            type: 'line',
            smooth: true,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 3,
            data: requireCount,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(199, 237, 250,0.5)'
                    }, {
                        offset: 1,
                        color: 'rgba(199, 237, 250,0.2)'
                    }], false)
                }
            },
            itemStyle: {
                normal: {
                    color: '#f8b62a'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }, {
            name: '出勤',
            type: 'line',
            smooth: true,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 2,
            data: statisCount,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(216, 244, 247,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(216, 244, 247,1)'
                    }], false)
                }
            },
            itemStyle: {
                normal: {
                    color: '#3dcc79'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }],
        dataZoom: [{
            type: 'inside',
            start: 50,
            end: 100
        }, {
            show: true,
            type: 'slider',
            y: '90%',
            start: 50,
            end: 100
        }]
    };
    myChart.setOption(option,false);
};
/**
 * 绘制现场
 * @param data
 * @param id
 */
exports.renderAttentionScene = function (id, data) {
    var myChart = this.renderChartFactory(id || 'attentionScene');
    var lableNormal = {};
    lableNormal.offset = [0, 0];
    lableNormal.show = false;
    lableNormal.formatter = '{a}';
    lableNormal.position = 'left';
    lableNormal.fontSize = 13;
    lableNormal.color = '#777';

    option = {
        'mchartType': '2106',
        'id': '10033',
        tooltip: {
            show: true
        },
        legend: {
            show: true,
            top: 3,
            itemWidth:25,
            itemHeight: 5,
            itemGap: 4,
            align: 'right',
            formatter: '{a|{name}}',
            textStyle: {
                width: 48,
                padding: [0, 0, 0, 12],
                rich: {
                    a: {
                        align: 'right',
                        fontSize: 12,
                        color: '#666'
                    }
                }
            },
            'data': ['安全文明', '快报', '质量进度', '备忘', '任务通知']
        },
        'yAxis': {
            'type': 'category',
            offset: 5,
            'data': [],
            'axisTick': {
                'show': false
            },
            'axisLine': {
                'show': false
            },
            axisLabel: {
                color: '#777',
                fontSize: 12,
                show: false
            }
        },
        'xAxis': [{
            'type': 'value',
            'axisTick': {
                'show': false
            },
            'axisLine': {
                'show': true
            },
            axisLabel: {
                color: '#777',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: ['#e5e5e5']
                }
            }
        }],
        color: ['#8982d9', '#65a3e0', '#5ccccc', '#6cd97e', '#e5b85c'],
        'series': [{
            'type': 'bar',
            name: '安全文明',
            'barWidth': '12',
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                }
            },
            'data': [data.safeCount]
        }, {
            'type': 'bar',
            name: '质量进度',
            'barWidth': '12',
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                }
            },
            'data': [data.qualityCount]
        }, {
            'type': 'bar',
            name: '任务通知',
            'barWidth': '12',
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                }
            },
            'data': [data.noticeCount]
        }, {
            'type': 'bar',
            name: '快报',
            'barWidth': '12',
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                }
            },
            'data': [data.buildNewsCount]
        }, {
            'type': 'bar',
            name: '备忘',
            'barWidth': '12',
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                }
            },
            'data': [data.unusualCount]
        }]
    }
    myChart.setOption(option, false);
};
exports.renderChartFactory = function (id) {
    return echarts.init(document.getElementById(id));
};