var initEvent = require('./initEvent');
var projectInitEvent = require('../initEvent');

exports.renderProcessTable = function (list, page, funType) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    if(list.length > 0){
      $("#noInfoProcessMemorandum_main").show();
      $("#noInfoProcessMemorandum_search").show();
      $("[name='noInfoProcessMemorandum_page']").show();
        $("#noInfoProcessMemorandum").hide();
    }else{
        $("#noInfoProcessMemorandum_main").hide();
        $("#noInfoProcessMemorandum_search").hide();
        $("[name='noInfoProcessMemorandum_page']").hide();
        $("#noInfoProcessMemorandum").show();
    }
    if(funType){
        $("#noInfoProcessMemorandum_search").show();
    }
  var parents = $('#processMemorandum').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var count = i + 1;
    var dom = $('<tr class="trHeightLight-hover">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.remarkTitle + '</td>\
                  <td class="border">' + item.remarkContent + '</td>\
                  <td class="border">' + item.userName + '</td>\
                  <td class="border">' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
                  <td class="border">\
                   <a class=confirm-hover data-type="update">修改</a>\
                   <div class="icon-line process-line"></div>\
                   <a class="delete-hover" data-type="delete">删除</a>\
                 </td>\
               </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
  }
  initEvent.initProcessTableClick(parents, page);
  // initEvent.renderExceptionCompetence();
};

exports.renderExceptionTable = function renderExceptionTable (list, page) {
  list = list || [];
  if(list.length > 0){
    $('#noInfoExceptionMemorandum_main').show();
    $('#noInfoExceptionMemorandum_search').show();
    $('[name="noInfoExceptionMemorandum_page"]').show();
    $('#noInfoExceptionMemorandum').hide();
  }else{
      $('#noInfoExceptionMemorandum_main').hide();
      // $('#noInfoExceptionMemorandum_search').hide();
      $('[name="noInfoExceptionMemorandum_page"]').hide();
      $('#noInfoExceptionMemorandum').show();
  }
  var parents = $('#exceptionMemorandum').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
      var count = i + 1;
    if(!item.remark){
        item.remark = '无';
    }
    if(!item.addUserName){
        item.addUserName = '无';
    }
    var dom = $('<tr class="trHeightLight-hover">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + parseException(item.basicType) + '</td>\
                  <td class="border">' + item.objName + '</td>\
                  <td class="border">' + item.usedValue + '</td>\
                  <td class="border">' + item.sysValue + '</td>\
                  <td class="border">' + item.excpValue + '</td>\
                  <td class="border">' + item.objTypeName + '</td>\
                  <td class="border">' + item.remark + '</td>\
                  <td class="border handle" style="position: relative">\
                   <a class="confirm-hover" data-type="detail">详情</a>\
                   <div class="icon-line edit-line"></div>\
                   <a class="delete-a" data-type="edit">编辑</a>\
                  </td>\
                </tr>');
    dom.data("item", item);
    dom.appendTo(parents);
  }
  initEvent.initExceptionTableClick(parents, page);
  // initEvent.renderExceptionCompetence();
};

function parseException (parse) {
  parse = parseInt(parse);
  switch (parse) {
    case 1:
      return '成本预算';
    case 2:
      return '材料管理';
    case 3:
      return '合同管理';
    case 4:
      return '结算管理';

  }
}