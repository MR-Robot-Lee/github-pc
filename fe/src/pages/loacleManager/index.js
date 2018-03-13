var initLocaleFunc = require('./initLoacleFunc');
var initEvent = require('./initEvent');
var Page = require('../../components/Page')
module.exports = {
  ready: function (type) {
    if (type === 'locale-attention') {
      var page = new Page($("#page"), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      })
      initLocaleFunc.initGetProjectList(null, page);
      initEvent.initSceneProjectEvent(page);
    } else if (type === 'locale-all') {
      var page = new Page($("#page"), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      })
      initLocaleFunc.initGetSceneList({ noticeType: 0, timeType: $('#timeType').data('time') }, 'locale-all', page);
      initEvent.initLocaleManagerEvent(page);
    } else if (type === 'locale-manager') {
        var page = new Page($("#page"), {
            pageSize: [10, 20, 30], // 设置每页显示条数按钮
            size: 10, // 默认每页显示多少条
        })
        initLocaleFunc.initGetSceneList({ noticeType: 3, timeType: $('#timeType').data('time') }, 'locale-manager', page);
        initEvent.initLocaleManagerEvent(page);
    } else if (type === 'locale-schedule') {
      var page = new Page($("#page"), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
      })
      initLocaleFunc.initGetSceneList({noticeType: 4, timeType: $('#timeType').data('time')}, 'locale-schedule', page);
      initEvent.initLocaleManagerEvent(page);
    } else if (type === 'locale-detail') {
      initLocaleFunc.initGetSceneListDetailFunc();
      initEvent.initLocaleManagerDetailEvent();
    }
  }
};