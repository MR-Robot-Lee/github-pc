var request = require('../../helper/request');
var Model = require('../../components/Model');
var getProjectManager = require("./manager");
var getSetting = require("./setting");
var Common = require('../Common');
var getProjectAll = require("./projectAll");

module.exports = {
  ready: function (type) {
    if (type === "all") {
      getProjectAll();
    } else if (type === "setting") {
      getSetting();
    } else if (type === "detail") {
      getProjectManager();
    }
    var state = document.getElementById('employee-state');
    var str = document.getElementById('employee-str');
    if (state) {
      var myChart = echarts.init(state);
      var line = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['联盟广告']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            name: '时间',
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            name: '人数',
            type: 'value',
            data: [0, 50, 100, 150, 200, 250]
          }
        ],
        series: [
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            smooth: true,
            symbol: 'image://../asset/ico/favicon.png',     // 系列级个性化拐点图形
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#229aee"
              }
            },
            data: [
              10, 30,
              {
                value: 34,
                symbol: 'star',  // 数据级个性化拐点图形
                symbolSize: 15,
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      textStyle: {
                        fontSize: '14',
                        fontFamily: '微软雅黑'
                      }
                    }
                  }
                }
              },
              {
                value: 20,
                symbol: 'none'
              },
              10,
              {
                value: 10,
                symbol: 'emptypin',
                symbolSize: 3
              },
              110
            ]
          }
        ]
      };

      myChart.setOption(line);
      var strChart = echarts.init(str);
      // 指定图表的配置项和数据
      var bar = {
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          name: '项目部门',
          data: ["班组一", "班组二", "班组三", "班组四", "班组五", "班组六"]
        },
        yAxis: {
          name: '工时'
        },
        series: [{
          name: '销量',
          type: 'bar',
          itemStyle: {
            normal: {
              color: function (param) {
                if (param.data >= 100) {
                  return '#18ca0f'
                } else if (param.data >= 80) {
                  return "#229aee";
                } else {
                  return "#ed4e21";
                }
              }
            }
          },
          data: [10, 12, 60, 80, 100, 120]
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      strChart.setOption(bar);
    }
  }
};

