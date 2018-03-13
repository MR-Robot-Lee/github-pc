var processMemorandum = require('./modal/processMemorandumModal.ejs');
var delModal = require('./modal/deleteModal.ejs');
var editMemorandumModal = require('./modal/editMemorandumModal.ejs');
var Modal = require('../../../components/Model');
var common = require('../../Common');
var exceptionMemorandumApi = require('./exceptionMemorandumApi');
var init = require('./index');

/**
 * 初始化过程备忘添加按钮
 */
exports.initProcessClick = function initProcessClick (processPage) {

    var addProcess = $("#addProcess");
  if (!addProcess.data("flag")) {
    addProcess.data("flag", true);
    addProcess.click(function (e) {
      common.stopPropagation(e);
      var modal = Modal('新建备忘', processMemorandum());
      modal.showClose();
      modal.show();
      initProcessModalClick(modal, null, processPage);
    });
    $("#searchMemorandum").click(function (e) {
      common.stopPropagation(e);
      var funType = 'search';
      var keyword = $("#keyword").val();
      if (keyword !== 'undefined') {
        keyword = keyword.trim();
      }
      init.initProcess({ keywords: keyword }, processPage,funType);
    })
  }
};

function initProcessModalClick (modal, id, page) {
  modal.$body.find(".confirm").click(function (e) {
    common.stopPropagation(e);
    var remarkTitle = modal.$body.find("input").val();
    var remarkContent = modal.$body.find("textarea").val();
    if (!remarkTitle) {
      return alert('请输入备忘名称');
    }
    if (!remarkContent) {
      return alert('请输入备忘内容')
    }
    if (id) {
      exceptionMemorandumApi.putProcess({ remarkTitle: remarkTitle, remarkContent: remarkContent, id: id })
        .then(function (res) {
          if (res.code === 1) {
            modal.hide();
            init.initProcess(null, page);
          }
        })
    } else {
      exceptionMemorandumApi.postProcess({ remarkTitle: remarkTitle, remarkContent: remarkContent })
        .then(function (res) {
          if (res.code === 1) {
            modal.hide();
            init.initProcess(null, page);
          }
        })
    }
  })
}

/**
 * 初始化过程备忘
 * @param parents
 */
exports.initProcessTableClick = function initProcessTableClick (parents, page) {
  parents.find('a').click(function (e) {
    common.stopPropagation(e);
    var item = $(this).parents('tr').data('item');
    var type = $(this).data('type');
    if (type === 'update') {
      var modal = Modal('修改备忘', processMemorandum());
      modal.showClose();
      modal.show();
      var input = modal.$body.find('input');
      var textarea = modal.$body.find('textarea');
      input.val(item.remarkTitle);
      textarea.val(item.remarkContent);
      initProcessModalClick(modal, item.id, page);
    } else {
      var $modal = Modal('提示', delModal());
      $modal.showClose();
      $modal.show();
      initProcessModalDelClick($modal, item.id, page);
    }
  })
};

function initProcessModalDelClick (modal, id, page) {
  modal.$body.find('.confirm').click(function (e) {
    common.stopPropagation(e);
    exceptionMemorandumApi.delProcess(id).then(function (res) {
      if (res.code === 1) {
        modal.hide();
        init.initProcess(null, page)
      }
    })
  })
}

exports.initExceptionClick = function initExceptionClick (exceptionPage) {
  var selectException = $("#selectException");
  var selectExceptionType = $("#selectExceptionType");
  if (!selectException.data('flag')) {
    selectException.data('flag', true);
    $("#exceptionSearch").click(function (e) {
      common.stopPropagation(e);
      var basicType = selectException.val();
      var keywords = $("#keyword").val();
      var type = selectExceptionType.val();
      var subProject = $('.subProject').val();
      init.initException({ keywords: keywords, basicType: basicType, type: type, subProjId: subProject}, exceptionPage);
    })
  }
};
/**
 * 异常备忘table 按钮初始化
 */
exports.initExceptionTableClick = function initExceptionTableClick (parents, page) {
  parents.find('a').click(function (e) {
    common.stopPropagation(e);
    var item = $(this).parents('tr').data('item');
    var type = $(this).data('type');
    if (type === 'edit') {
      initProcessTableEdit(item, page);
    } else {
      var td = $(this).parents('.handle');
      initDetail(td, item, parents);
    }
  })
};

function initProcessTableEdit (item, page) {
  var modal = Modal('编辑内容', editMemorandumModal());
  modal.showClose();
  modal.show();
  var spans = modal.$body.find('.span');
  for (var i = 0, length = spans.length; i < length; i++) {
    var span = $(spans[i]);
    var name = span.attr('name');
    span.text(item[name])
  }
  modal.$body.find('textarea').val(item.remark);
  modal.$body.find(".confirm").click(function (e) {
    common.stopPropagation(e);
    var remark = modal.$body.find('textarea').val();
    if (!remark) {
      return alert('请输入备忘内容');
    }
    exceptionMemorandumApi.putException({ id: item.id, remark: remark }).then(function (res) {
      if (res.code === 1) {
        modal.hide();
        init.initException(null, page);
      }
    })
  })
}

function initDetail (td, item, parents) {
  parents.find(".memorandum-detail").remove();
  var basicType;
    switch (item.basicType) {
        case 1:
            basicType = "成本预算";
            break;
        case 2:
            basicType = "材料管理";
            break;
        case 3:
            basicType = "合同管理";
            break;
        case 4:
            basicType = "结算管理";
            break;
    }
  var dom = $('<div class="memorandum-detail">\
                <div class="memorandum-title" style="padding: 0 20px;">详情<span class="icon-close" style="margin-right: 10px;"></span></div>\
                <div class="memorandum-section">\
                 <div class="table-content" style="padding: 0 15px 10px 15px">\
                  <table>\
                   <tbody>\
                    <tr class="small">\
                     <td class="border" style="font-weight: bold;width: 70px">异常阶段</td>\
                     <td class="border">' + basicType + '</td>\
                    </tr>\
                    <tr class="small">\
                     <td class="border" style="font-weight: bold">异常部位</td>\
                     <td class="border">' + item.objNo + '</td>\
                    </tr>\
                    <tr class="small">\
                     <td class="border" style="font-weight: bold">名称</td>\
                     <td class="border">' + item.objName + '</td>\
                    </tr>\
                    <tr class="small">\
                     <td class="border" style="font-weight: bold">系统说明</td>\
                     <td class="border">' + item.objTypeName + '</td>\
                    </tr>\
                    <tr class="small">\
                       <td class="border" style="font-weight: bold">产生时间</td>\
                       <td class="border">' + new Date(item.addTime).Format('yyyy-MM-dd hh:mm') + '</td>\
                    </tr>\
                    <tr class="small">\
                       <td class="border" style="font-weight: bold">操作人</td>\
                       <td class="border">' + item.addUserName + '</td>\
                    </tr>\
                   </tbody>\
                  </table>\
                 </div>\
                </div>\
                <div class="triangle-left bebebe"></div>\
                <div class="triangle-left ffffff"></div>\
              </div>');
  dom.appendTo(td);
  dom.click(function(e){
      common.stopPropagation(e);
  })
  dom.find(".icon-close").click(function (e) {
    common.stopPropagation(e);
    $(this).parents('.memorandum-detail').remove();
  })
}

exports.renderExceptionCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var expectionAdd = user.permission['projUnusual:add'];
  if (expectionAdd) {
    $('#addProcess').show();
    $('.delete-a').show();
    $('.edit-line').show();
  } else {
    // $('#addProcess').hide();
    $('.delete-a').hide();
    $('.edit-line').hide();
  }
  var del = user.permission['projUnusual:del'];
  if (del) {
    $('.delete-hover').show();
    $('.process-line').show();
  } else {
    $('.delete-hover').hide();
    $('.process-line').hide();
  }
  if (del && !expectionAdd) {
    $('#addProcess').show();
    $('.delete-a').show();
    $('.edit-line').show();
  }
};

