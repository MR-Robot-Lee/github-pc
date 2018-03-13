var common = require('../Common');
var addCalendarContent = require('./models/addSmallCalendarContent.ejs');
var Model = require('../../components/Model');
var renderDashbordTable = require('./renderDashbordTable');
var initDashbordFunc = require('./initDashbordFunc');
exports.initCalendar = function initCalendar () {
  renderCalendarDomAndData();
  renderCalendarHandler()
};

function renderCalendarHandler () {
  var calendarHandler = $(".calendar_title-content");
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
    showDate.text(moment(date).format('YYYY年MM日'));
    showDate.data("date", moment(date));
    renderCalendarDomAndData(date);
  })
}

function renderCalendarDomAndData (date) {
  var weeks = $('#bigWeeks').html('');
  var list = makeDateData(date);
  renderWeekdom(list, weeks);
  initDayEvent(weeks);
  var ceilWidth = document.getElementById('bigWeeks').scrollWidth;
  // weeks.find('.calendar-day').css('width', Math.ceil(ceilWidth / 7));
  weeks.find('.calendar-day').css('width', '142');
  initDashbordFunc.getCalendarCurrentMonthRemindFunc(moment(date).get('M') + 1, 'b');
}

function initDayEvent (weeks) {
  weeks.find('.calendar-day').click(function (e) {
    common.stopPropagation(e);
    var item = $(this).data('item');
    var time = $(this).data('time');
    var addContent = $(this).find('.addContent');
    weeks.find('.model-project-common').remove();
    var addCalendar = Model('台历', addCalendarContent());
    addCalendar.showClose();
    addCalendar.show();
    initDayModalEvent(addCalendar, time, item ,addContent);
    initDayModalData(addCalendar, time, item);
  });
}

function initDayModalData () {
  var modal = arguments[0];
  var item = arguments[2];
  if (item) {
    modal.$body.find('textarea').val(item.remindContent);
    modal.$body.find('.save').data('id', item.id);
  }
}

function initDayModalEvent () {
  var modal = arguments[0];
  var date = arguments[1];
  var item = arguments[2];
  var addContent = arguments[3];
    modal.$body.find('.delete').click(function (e) {
      common.stopPropagation(e);
    if (item) {
      initDashbordFunc.delCalendarRemindFunc(item, modal,addContent);
    }
  });
  modal.$body.find('.save').click(function (e) {
    common.stopPropagation(e);
    var id = $(this).data('id');
    var remindContent = modal.$body.find('textarea').val();
    if (!remindContent) {
      return alert('请输入内容');
    }
   /* var date = modal.$body.find('[type=date]').val();
    // if (!date) {
    //   return alert('请选择提醒时间');
    // }
    var hour = modal.$body.find('#hour').val();
    var minute = modal.$body.find('#minute').val();
    date = moment(date).set('H', hour);
    date = moment(date).set('m', minute);*/
    var remindTime = moment(date).toDate().getTime();
    if (id) {
      initDashbordFunc.putCalendarRemindFunc({
        id: id,
        remindContent: remindContent,
        remindTime: remindTime
      }, modal, 'b');
    } else {
      initDashbordFunc.postCalendarRemindFunc({
        remindContent: remindContent,
        remindTime: remindTime
      }, modal, 'b');
    }
  })
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

function renderWeekdom (list, parents) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<div class="calendar-days"></div>');
    renderChildDom(item, dom);
    dom.appendTo(parents);
  }
}

function renderChildDom (list, parents) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var date = item.date.date();
    var dom = $('<div class="calendar-day">\
                   <span class="current-day">' + date + '</span>\
                   <span class="solar"></span>\
                   <i class="icon-red"></i>\
                   <div style="position: relative;" class="addContent">\
                   </div>\
                 </div>');
    if ((i + 1) % 7 !== 1) {
      dom.addClass('margin-left');
    }
    dom.data("time", item.date);
    var year = moment(item.date).get('year');
    var month = moment(item.date).get('month');
    var day = moment(item.date).date();
    var solar = solar2lunar(year, month + 1, day);
    if (!item.is_month) {
      dom.addClass('current')
    }
    if (item.is_cur) {
      dom.find('.current-day').addClass('current-date');
    }
    dom.find('.solar').text(solar);
    dom.addClass('b-' + item.date.format("YYYYMMDD"));
    dom.appendTo(parents);
  }
}

function solar2lunar (y, m, d) {
  if (y < 1900 || y > 2100) {
    return -1;
  }//年份限定、上限
  if (y == 1900 && m == 1 && d < 31) {
    return -1;
  }//下限
  if (!y) { //未传参  获得当天
    var objDate = new Date();
  } else {
    var objDate = new Date(y, parseInt(m) - 1, d)
  }
  var i, leap = 0, temp = 0;

  //修正ymd参数
  var y = objDate.getFullYear(), m = objDate.getMonth() + 1, d = objDate.getDate();
  var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  var year = i;

  var leap = leapMonth(i); //闰哪个月
  var isLeap = false;

  //效验闰月
  for (i = 1; i < 13 && offset > 0; i++) {
    //闰月
    if (leap > 0 && i == (leap + 1) && isLeap == false) {
      --i;
      isLeap = true;
      temp = leapDays(year); //计算农历闰月天数
    } else {
      temp = monthDays(year, i);//计算农历普通月天数
    }
    //解除闰月
    if (isLeap == true && i == (leap + 1)) {
      isLeap = false;
    }
    offset -= temp;
  }
  if (offset == 0 && leap > 0 && i == leap + 1)
    if (isLeap) {
    } else {
      --i;
    }
  if (offset < 0) {
    offset += temp;
    --i;
  }
  //农历月
  var month = i;
  //农历日
  var day = offset + 1;
  return toChinaDay(day)
}

/**
 * 返回农历y年闰月的天数 若该年没有闰月则返回0
 * @param lunar Year
 * @return Number (0、29、30)
 * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
 */
function leapDays (y) {
  if (leapMonth(y)) {
    return ((lunarInfo()[y - 1900] & 0x10000) ? 30 : 29);
  }
  return (0);
}

function lYearDays (y) {
  var i, sum = 348;
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo()[y - 1900] & i) ? 1 : 0;
  }
  return (sum + leapDays(y));
}

/**
 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
 * @param lunar Year
 * @return Number (0-12)
 * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
 */
function leapMonth (y) { //闰字编码 \u95f0
  return (lunarInfo()[y - 1900] & 0xf);
}

function monthDays (y, m) {
  if (m > 12 || m < 1) {
    return -1
  }//月份参数从1至12，参数错误返回-1
  return ( (lunarInfo()[y - 1900] & (0x10000 >> m)) ? 30 : 29 );
}


/**
 * 农历1900-2100的润大小信息表
 * @Array Of Property
 * @return Hex
 */
function lunarInfo () {
  return [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
    /**Add By JJonline@JJonline.Cn**/
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
    0x0d520]
}


function toChinaDay (d) { //日 => \u65e5
  var s;
  switch (d) {
    case 10:
      s = '\u521d\u5341';
      break;
    case 20:
      s = '\u4e8c\u5341';
      break;
      break;
    case 30:
      s = '\u4e09\u5341';
      break;
      break;
    default :
      s = nStr2()[Math.floor(d / 10)];
      s += nStr1()[d % 10];
  }
  return (s);
}

function nStr2 () {
  return ["\u521d", "\u5341", "\u5eff", "\u5345"]
}

function nStr1 () {
  return ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"]
}