exports.initCalendar = function initCalendar (callback, check) {
  var weekTitle = $('#weekTitle').html('');
  if (weekTitle.length > 0 && !weekTitle.data('flag')) {
    weekTitle.data('flag', true);
    renderTitleDom(weekTitle);
    renderCalendarDomAndData(null, callback);
    renderCalendarHandler(callback, check);
    $('.calendar-show').click(function () {
      window.location.href = '/dashbord/calendar'
    });
  }
};

function renderCalendarHandler (callback, check) {
  var calendarHandler = $(".calendar_title");
  var showDate = calendarHandler.find("span");
  showDate.text(moment().format('YYYY年MM月'));
  showDate.data("date", moment());
  calendarHandler.find("i").click(function () {
    var type = $(this).data("type");
    var $date = showDate.data("date");
    var date = '';
    if (type === 'sub') {
      date = moment($date).subtract(1, 'month');
    } else {
      date = moment($date).add(1, 'month');
    }
    if (check) {
      check(date);
    }
    showDate.text(moment(date).format('YYYY年MM日'));
    showDate.data("date", moment(date));
    renderCalendarDomAndData(date, callback);
  })
}

function renderCalendarDomAndData (date, callback) {
  var weeks = $('#weeks').html('');
  var list = makeDateData(date);
  renderWeekdom(list, weeks, callback);
}
function renderTitleDom (parent) {
  var week = moment().days();
  week = week === 0 ? 7 : week;
  for (var i = 1; i < 8; i++) {
    var dom = $('<div>' + parseNumChinese(i) + '</div>');
    if (week === i) {
      dom.addClass("active");
    }
    dom.appendTo(parent);
  }
}
function parseNumChinese (int) {
  switch (int) {
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    case 6:
      return '六';
    case 7:
      return '日'
  }
}
function makeDateData (currentDate) {
  currentDate = currentDate || moment();
  var startDay = moment(currentDate).startOf("month");
  var startWeek = moment(startDay).days();
  startWeek = startWeek === 0 ? 7 : startWeek;

  var startDate = moment(startDay).subtract(startWeek - 1, 'd');
  var endDay = moment(currentDate).endOf("month");
  var endWeek = moment(endDay).days();
  endWeek = endWeek === 0 ? 7 : endWeek;
  var endDate = moment(endDay).add(7 - endWeek, 'd');
  var days = [];
  var week = [];
  while (startDate.diff(endDate) <= 0) {
    week.push({
      date: moment(startDate),
      is_cur: moment().format('YYYY-MM-DD') === moment(startDate).format("YYYY-MM-DD"),
      is_month: moment().format('YYYY-MM') === moment(startDate).format("YYYY-MM")
    });
    if (week.length === 7) {
      days.push(week);
      week = [];
    }
    startDate.add(1, 'd');
  }
  return days;
}
function renderWeekdom (list, parents, callback) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<div class="days"></div>');
    renderChildDom(item, dom);
    dom.appendTo(parents);
  }
  if (callback) {
    callback();
  }
}
function renderChildDom (list, parents) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var date = item.date.date();
    var dom = $('<div class="day">' + date + '<i class="icon-red"></i></div>');
    dom.data("time", item.date);
    if (!item.is_month) {
      dom.addClass('current')
    }
    if (item.is_cur) {
      dom.addClass('active');
    }
    dom.addClass('t-' + item.date.format("YYYYMMDD"));
    dom.appendTo(parents);
  }
}