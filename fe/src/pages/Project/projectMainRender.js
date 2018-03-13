var projectMainApi = require('./projectMainApi');
var initEvent = require('./initEvent');
var projectMainFunc = require('./projectMainFunc');
var common = require('../Common');
/**
 * 内部通知 和 临时任务
 * @param list
 */
exports.renderProjectMain = function renderProjectMain (list) {
    var proId = $('#projectSchedule').data('id');
    var proName = $('.project-menu-title span').html();
    var parents = $(".msg-banner");
    list = list || [];
    if(list.length > 0){
      $('#noInfo_banner').hide();
    }else{
      $('#noInfo_banner').show();
    }
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var bannerTitle = '';
    var bannerTitleName = '';
    if(item.noticeType === 1){
        bannerTitleName = '内部通知详情';
        bannerTitle = '<span class="pro-notice pro-adj"></span>' +
            '<span class="bannerTitleName" style="margin-left: 34px;">内部通知</span>' +
            '<a class="banner-more confirm-hover" href="/project/safe/'+proId+'?mainName=内部通知&name='+proName +'">更多</a>'
    } else if(item.noticeType === 2){
        bannerTitleName = '临时任务详情';
        bannerTitle = '<span class="pro-temporarytasks pro-adj"></span>' +
            '<span class="bannerTitleName" style="margin-left: 34px;">临时任务</span>' +
            '<a class="banner-more confirm-hover" href="/project/safe/'+proId+'?mainName=临时任务&name='+proName + '">更多</a>'
    }
      var dom = $('<li class="banner-item" style="position: relative;">' +
          '<div class="banner-title">' + bannerTitle + '</div>' +
          '<div class="banner-container">' +
          '<div class="item-title ellipsis">' + item.noticeTitle + '</div>' +
          '<div class="item-desc ellipsis2">' + item.noticeContent + '</div>' +
          '<div class="item-msg">编辑人 : <span>'+ item.userName +'</span>' + new Date(item.addTime).Format("yyyy-MM-dd hh:mm") + '</div>' +
          '</div>' +
          '</li>');
      dom.data('item', item);
      dom.appendTo(parents.find('ul'));
      parents.find(".tab-item-"+(i+1)).css({'backgroundColor':'transparent','cursor':'pointer'}).addClass('tab-show');
  }
  initEvent.initTemporaryFloatEvent(parents);
};

/**
 * 绘制安全文明管理
 * @param list
 */
exports.renderSafeDom = function renderSafeDom (list) {
  list = list || [];
  if(list.length > 0){
      $('#noInfo_safeManage').hide();
  }else{
      $('#noInfo_safeManage').show();
  }
  var parents = $('#safeManage').html('');
    var length = list.length;
    for (var i = 0; i < length; i++) {
    var item = list[i];
      var img;
      var noPic = '';
        if(item.attaches && item.attaches.length > 0){
            if(item.attaches[0].thumbnailUrl){
                img = window.API_PATH + '/customer' + item.attaches[0].thumbnailUrl;
            } else {
                img = window.API_PATH + '/customer' + item.attaches[0].attachUrl;
            }
        } else {
            noPic = '暂无图片';
            img = '';
        }
      var dom = $('<div class="con-item clearfix">' +
          '<div class="item-pic fl" style="background-image: url('+ img +')">' + noPic + '</div>' +
          '<div class="item-content fl">' +
          '<div class="item-title ellipsis">' + item.noticeTitle + '</div>' +
          '<div class="item-desc ellipsis2">' + item.noticeContent + '</div>' +
          '<div class="item-msg">编辑人 : <span>'+ item.userName +'</span>' + new Date(item.addTime).Format("yyyy-MM-dd hh:mm") + '</div>' +
          '</div>' +
          '</div>');
      if(i === length-1){
        dom.css('border','none');
      }
    dom.data('item', item);
    dom.appendTo(parents);
  }
  initEvent.initSafeDomEvent(parents, '安全文明详情');
};
/**
 * 质量进度管理
 * @param list
 */
exports.renderQualityDom = function renderQualityDom (list) {
    list = list || [];
    if(list.length > 0){
        $('#noInfo_quality').hide();
    }else{
        $('#noInfo_quality').show();
    }
    var parents = $('#Quality').html('');
    var length = list.length;
    for (var i = 0; i < length; i++) {
        var item = list[i];
        var img;
        var noPic = '';
        if(item.attaches && item.attaches.length > 0){
          if(item.attaches[0].thumbnailUrl){
              img = window.API_PATH + '/customer' + item.attaches[0].thumbnailUrl;
          } else {
              img = window.API_PATH + '/customer' + item.attaches[0].attachUrl;
          }
        } else {
            noPic = '暂无图片';
            img = '';
        }
        var dom = $('<div class="con-item clearfix">' +
            '<div class="item-pic fl" style="background-image: url('+ img +')">' + noPic + '</div>' +
            '<div class="item-content fl">' +
            '<div class="item-title ellipsis">' + item.noticeTitle + '</div>' +
            '<div class="item-desc ellipsis2">' + item.noticeContent + '</div>' +
            '<div class="item-msg">编辑人 : <span>'+ item.userName +'</span>' + new Date(item.addTime).Format("yyyy-MM-dd hh:mm") + '</div>' +
            '</div>' +
            '</div>');
        if(i === length-1){
            dom.css('border','none');
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
  initEvent.initSafeDomEvent(parents, '质量进度详情');
};
/**
 * 绘制系统信息
 */
exports.renderSystemSettingDom = function renderSystemSettingDom (list) {
  list = list.data || [];
    if(list.length > 0){
    $('#noInfo_system').hide();
  }else{
    $('#noInfo_system').show();
  }
    var length = list.length > 5 ? 5 : list.length;
    var parents = $('#systemSetting').html('');
  for (var i = 0; i < length; i++) {
    var item = list[i];
    var otherTitle = item.otherTitle || '';
    var dom = $('<div class="con-item">' +
        '<div class="item-title ellipsis">【'+ item.moduleName +'】<span>'+item.operLog+'</span></div>' +
        '<div class="item-desc ellipsis">'+ otherTitle +'</div>' +
        '<div class="item-msg">' +
        '<span>操作人 : </span>' + '<span class="opername">' + item.operName + '</span>' +
        '<span class="opertime">操作时间 : </span>' + new Date(item.operTime).Format("yyyy-MM-dd hh:mm") +
        '</div>' +
        '</div>');
      if(i === length-1){
          dom.css('border','none');
      }
    dom.appendTo(parents);
  }
};


function initFloatPage (total, currentPage, parents, type) {
  var totalPage = parseInt(total / 6);
  if (total % 6 > 0) {
    totalPage = totalPage + 1;
  }
  if (totalPage <= 1) {
    parents.find("a").addClass('disable');
  } else if (currentPage <= 1) {
    parents.find(".up").addClass('disable');
    parents.find(".down").removeClass('disable');
  } else if (1 < currentPage && currentPage <= totalPage) {
    parents.find(".down").addClass('disable');
    parents.find(".up").removeClass('disable');
  }
  if (!parents.data("flag")) {
    parents.data("type", type);
    parents.data("flag", true);
    parents.find('a').click(function (e) {
      common.stopPropagation(e);
      var type = $(this).data("type");
      if ($(this).hasClass("disable")) {
        return;
      }
      if (type === 'up') {
        currentPage = currentPage - 1;
      } else {
        currentPage = currentPage + 1;
      }
      projectMainApi.getProjectMain({ pageNo: currentPage, type: type }, function (res) {
        if (res.code === 1) {
          var $type = parents.data("type");
          if ($type === 1) {
            noticeFloat(res.data.data, res.data);
          } else {
            temporaryFloat(res.data.data, res.data);
          }
        }
      })
    })
  }
}

function temporaryFloat (list, data) {
  list = list || [];
  var parents = $("#temporaryFloat").html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<li>\
                  <i class="icon-disc-item"></i>\
                  <span>' + item.noticeTitle + '</span>\
                  <i class="tz-date">' + moment(item.addTime).format('YYYY年MM月DD日') + '</i>\
                 </li>');
    dom.appendTo(parents);
  }
  initFloatPage(data.total, data.pageNo, $('.temporaryPage'), 2);
}

function noticeFloat (list, data) {
  var parents = $('#noticeFloat').html('');
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<li>\
                 <i class="icon-disc-item"></i>\
                 <span>' + item.noticeTitle + '</span>\
                 <i class="tz-date">' + moment(item.addTime).format('YYYY年MM月DD日') + '</i>\
                </li>');
    dom.appendTo(parents);
  }
  initFloatPage(data.total, data.pageNo, $(".floatPage"), 1);
}

exports.renderWeekBindId = function renderWeekBindId (list) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var day = list[i];
    $("#weeks").find('.t-' + day.remarkDate).find("i").addClass('active');
    $("#weeks").find('.t-' + day.remarkDate).data("id", day.id);
  }
};

/**
 * 绘制安全文明跟质量
 * @param res
 */
exports.renderSafeAndQualityTable = function renderSafeAndQualityTable (res) {
  var list = res.data ? res.data.data : [];
  var safeTable = $("#safeTable").html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var count = i + 1;
    var dom = $('<tr class="active">\
                  <td>' + count + '</td>\
                  <td>' + item.noticeTitle + '</td>\
                  <td>' + item.userName + '</td>\
                  <td>' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
                  <td><a class="delete-hover " href="javascript:;">删除</a></td>\
                </tr>');
    dom.data('item', item);
    dom.appendTo(safeTable);
  }
  initEvent.initMainPageTableEvent(safeTable);
};
/**
 * 绘制系统信息
 */
exports.renderSystemSettingTableDom = function renderSystemSettingTableDom (data) {
  var list = data.data.data;
    var safeTable = $("#settingSystemTable").html('');
    for (var i = 0; i < list.length; i++) {
        var count = i + 1;
        var item = list[i];
        var dom = $('<tr class="active">\
                  <td>' + count + '</td>\
                  <td>' + item.moduleName + '</td>\
                  <td>' + item.operLog + '</td>\
                  <td>' + moment(item.operTime).format('YYYY/MM/DD') + '</td>\
                </tr>');
        dom.data('item', item);
        dom.appendTo(safeTable);
  }
    initEvent.initSystemSettingTableEvent(safeTable);
};
/**
 * 绘制分部dom
 * @param list
 */
exports.renderSubProjectDom = function renderSubProjectDom (list) {
  var parents = $('#project-department').html('');
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<div style="margin-bottom: 5px;">\
                   <span>' + item.subProjName + '</span>\
                   <i data-id=' + item.id + '>删除</i>\
                 </div>');
    dom.appendTo(parents);
  }
  initEvent.initSubProjectBtnDel();
};


exports.renderProjectMainList = function (res, modal, data) {
  modal.$body.find('.model-footer').data('item', res);
  var list = res.data ? res.data.data : [];
  var item = list[0];
  if (item) {
    modal.$body.find('.safe-title').text(item.noticeTitle);
    modal.$body.find('[name=userName]').text(item.userName);
    modal.$body.find('[name=addTime]').text(moment(item.addTime).format('YYYY/MM/DD'));
    modal.$body.find('.modal-content').text(item.noticeContent);
    modal.$body.find('.model-footer').data('count', 0);
  }
  /*上一篇*/
  modal.$body.find('.up').click(function (e) {
    var count = modal.$body.find('.model-footer').data('count');
    var $data = modal.$body.find('.model-footer').data('item');
    var list = $data.data ? $data.data.data : [];
    count--;
    var item = list[count];
    if (item) {
      modal.$body.find('.safe-title').text(item.noticeTitle);
      modal.$body.find('[name=userName]').text(item.userName);
      modal.$body.find('[name=addTime]').text(moment(item.addTime).format('YYYY/MM/DD'));
      modal.$body.find('.modal-content').text(item.noticeContent);
      modal.$body.find('.model-footer').data('count', count);
    } else {
      var pageNo = res.data ? res.data.data.pageNo : 1;
      if (pageNo > 1) {
        pageNo--;
        var _data = { pageNo: pageNo };
        if (data && data.noticeType) {
          _data.noticeType = data.noticeType;
        }
        projectMainFunc.getProjectMainFunc(_data, modal);
      }
    }
  });
  /*下一篇*/
  modal.$body.find('.down').click(function (e) {
    var count = modal.$body.find('.model-footer').data('count');
    var $data = modal.$body.find('.model-footer').data('item');
    var list = $data.data ? $data.data.data : [];
    count++;
    var item = list[count];
    if (item) {
      modal.$body.find('.safe-title').text(item.noticeTitle);
      modal.$body.find('[name=userName]').text(item.userName);
      modal.$body.find('[name=addTime]').text(moment(item.addTime).format('YYYY/MM/DD'));
      modal.$body.find('.modal-content').text(item.noticeContent);
      modal.$body.find('.model-footer').data('count', count);
    } else {
      var total = res.data ? res.data.data.total : 1;
      var pageNo = res.data ? res.data.data.pageNo : 1;
      if (pageNo <= Math.ceil(total / pageNo)) {
        pageNo++;
        var _data = { pageNo: pageNo };
        if (data && data.noticeType) {
          _data.noticeType = data.noticeType;
        }
        projectMainFunc.getProjectMainFunc(_data, modal);
      }
    }
  });
};


exports.renderProjectSystemSetting = function (obj) {
  var inputs = $("#settingSystemData").find("input[type=text]");
  for (var i = 0, length = inputs.length; i < length; i++) {
    var name = $(inputs[i]).attr("name");
    $(inputs[i]).val(obj[name]);
  }
  $("[name=settleType][value=" + obj.settleType + "]").prop('checked', true);
  $("[name=projState][value=" + obj.projState + "]").prop('checked', true);
  var buidLogUserName = obj.buidLogUserName || '';
    $('[name=buidLogUserNo]').text(buidLogUserName);
  $('[name=buidLogUserNo]').data('user', { userNo: obj.buidLogUserNo, userName: obj.buidLogUserName });
  $('[name=excpQpyType][value='+obj.excpQpyType+']').prop('checked',true);
};



