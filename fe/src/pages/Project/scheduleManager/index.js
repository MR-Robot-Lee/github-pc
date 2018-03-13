var initEvent = require('./initEvent');
var projectScheduleManagerFunc = require('./projectScheduleManagerFunc');
var projectInitEvent = require('../initEvent');


var schedule = {};
schedule.initSchedule = function () {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo
    initEvent.initEditSchedule();
  projectScheduleManagerFunc.initScheduleList();
  initEvent.initAddSchedule();
};

schedule.initScheduleSecondary = function () {
  projectScheduleManagerFunc.initScheduleList();
  initEvent.initEditSchedule();
  initEvent.initAddSchedule();
};

schedule.renderScheduleCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var projectGet = user.permission['projSchedule:add'];
  if (projectGet) {
    $('.addSchedule').show();
  } else {
    $('.addSchedule').hide();
  }
}
module.exports = schedule;
