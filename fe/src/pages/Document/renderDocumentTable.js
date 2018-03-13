var initEvent = require('./initEvent');
exports.initAddFileCabinet = function (modal, list, single) {
  list = list || [];
  var $parents = modal.$body.find('#fileCabinetTable').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<tr class="small active">\
                  <td>' + item.userName + '</td>\
                  <td><input type="checkbox" value="1"/></td>\
                  <td><input type="checkbox" value="2"/></td>\
                  <td><input type="checkbox" value="3"/></td>\
                  <td><a class="delete-a">删除</a></td>\
                 </tr>');
    if (single) {
      dom.find('[type=checkbox]').prop('checked', true);
      dom.find('[type=checkbox]').prop('disabled', true);
      dom.data('level', 1);
    }
    if (item.level && item.level === 1) {
      dom.data('level', item.level);
      dom.find('[type=checkbox]').prop('checked', true);
    } else if (item.level && item.level === 2) {
      dom.data('level', item.level);
      dom.find('[type=checkbox][value=2]').prop('checked', true);
    } else if (item.level && item.level === 3) {
      dom.data('level', item.level);
      dom.find('[type=checkbox][value=3]').prop('checked', true);
    }
    dom.data('item', item);
    dom.appendTo($parents);
  }
  modal.$body.find('.confirm').data('list', list);
  modal.$body.find('.delete-a').click(function () {
    $(this).parent().parent().remove();
  })
  initEvent.initTableCheckBoxEvent($parents);
};

exports.renderCompanyFileCabinet = function (list) {
  list = list || [];
  if (list.length > 0) {
    $('#noInfoCompanyFileCabinetTable_main').show();
    $('[name="noInfoCompanyFileCabinetTable_page"]').show();
    $('#noInfoCompanyFileCabinetTable').hide();
  } else {
    $('#noInfoCompanyFileCabinetTable_main').hide();
    $('[name="noInfoCompanyFileCabinetTable_page"]').hide();
    $('#noInfoCompanyFileCabinetTable').show();
  }
  var parents = $('#companyFileCabinetTable').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var file = '<span class="icon-admin"></span>';
    if (item.fileStatus === '2') {
      file = '<span class="icon-file"></span>';
    }

    var dom = $('<tr class="active" style="cursor:pointer">\
                  <td style="padding-left: 20px;">' + file + '<span style="vertical-align: middle">' + item.cbntName + '</span></td>\
                  <td>' + item.userName + '</td>\
                  <td>' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
                  <td>\
                   <a class="confirm-hover" href="javascript:void(0)">查看属性</a>\
                  </td>\
                 </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
  }
  initEvent.initCompanyFileCabinetTableEvent(parents);
  initEvent.initTableTrClickEvent(parents, 'admin-company');
  // initEvent.initCompanyFileCabinetTableTREvent(parents, 'admin-company');
};
exports.renderCompanyFileCabinetDetail = function (list) {
  list = list || [];
    if (list.length > 0) {
    $('#noInfoAdministrationManagerTable_main').show();
    $('#noInfoAdministrationManagerTable').hide();
  } else {
    $('#noInfoAdministrationManagerTable_main').hide();
    $('#noInfoAdministrationManagerTable').show();
  }
  $('thead').find('[type=checkbox]').attr('checked', false);
  var parents = $('#administrationManagerTable').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var file = '';
    if(item.fileType === 'jpg' || item.fileType === 'jpeg'  || item.fileType === 'png' || item.fileType === 'pdf' || item.fileType === 'txt'
        || item.fileType === 'PNG' || item.fileType === 'JPG'  || item.fileType === 'JPEG'  || item.fileType === 'PDF' || item.fileType === 'TXT'){
        file = '<td><a data-type="download" class="edit-a confirm-hover">下载记录</a> | <a data-type="review" class="confirm-hover">预览</a></td>';
    } else {
        file = '<td><a data-type="download" class="edit-a confirm-hover">下载记录</a></td>';
    }
    var fileIcon = '';
    if (item.fileType === 'png' || item.fileType === 'jpg' || item.fileType === 'jpeg' || item.fileType === 'PNG' || item.fileType === 'JPG' || item.fileType === 'JPEG') {
      fileIcon = '<span class="icon-file jpeg"></span>';
    } else if (item.fileType === 'xls' || item.fileType === 'XLS') {
      fileIcon = '<span class="icon-file xls"></span>';
    } else if (item.fileType === 'xlsx' || item.fileType === 'XLSX') {
        fileIcon = '<span class="icon-file xlsx"></span>';
    } else if (item.fileType === 'docx' || item.fileType === 'DOCX') {
        fileIcon = '<span class="icon-file docx"></span>';
    } else if (item.fileType === 'doc' || item.fileType === 'DOC') {
        fileIcon = '<span class="icon-file doc"></span>';
    } else if (item.fileType === 'txt' || item.fileType === 'TXT') {
      fileIcon = '<span class="icon-file txt"></span>';
    } else if (item.fileType === 'pdf' || item.fileType === 'PDF') {
      fileIcon = '<span class="icon-file pdf"></span>';
    } else if (item.fileType === 'rar' || item.fileType === 'RAR') {
        fileIcon = '<span class="icon-file rar"></span>';
    } else if (item.fileType === 'zip' || item.fileType === 'ZIP') {
      fileIcon = '<span class="icon-file zip"></span>';
    } else if (item.fileType === 'video' || item.fileType === 'VIDEO') {
      fileIcon = '<span class="icon-file video"></span>';
    } else if (item.fileType === 'cad' || item.fileType === 'dwg' || item.fileType === 'CAD' || item.fileType === 'DWG') {
      fileIcon = '<span class="icon-file cad"></span>';
    } else if (item.fileType === 'ppt' || item.fileType === 'PPT') {
      fileIcon = '<span class="icon-file ppt"></span>';
    } else if (item.fileType === 'pptx' || item.fileType === 'PPTX') {
        fileIcon = '<span class="icon-file pptx"></span>';
    } else if (item.fileType === 'gbq' || item.fileType === 'gbq5' || item.fileType === 'gtb4' || item.fileType === 'GBQ' || item.fileType === 'GBQ5' || item.fileType === 'GBQ4') {
      fileIcon = '<span class="icon-file gbq"></span>';
    } else {
      fileIcon = '<span class="icon-file none"></span>';
    }
    var type = 'document';
    if (item.fileStatus === 1) {
      file = '<td></td>';
      fileIcon = '<span class="icon-file"></span>';
      type = 'file';
    }
    var dom = $('<tr class="active" data-type="' + type + '">\
                  <td><input type="checkbox" /></td>\
                  <td>' + fileIcon + '<span class="tdFileName">' + item.cbntName + '</span></td>\
                  <td>' + item.userName + '</td>\
                  <td>' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
                  ' + file + '\
                 </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
  }
  //initEvent.initCompanyFileCabinetTableTREvent(parents, $('.document-menus').data('type'));
  initEvent.initCompanyFileCabinetTableAEvent(parents);
  initEvent.initTableTrClickEvent(parents, $('.document-menus').data('type'));
};

exports.initAttributeDom = function (modal, obj) {
  modal.$body.find('[name=cbntSize]').text(getCbntSize(obj.cbntSize));
  modal.$body.find('[name=cbntName]').text(obj.cbntName);
  modal.$body.find('[name=userName]').text(obj.userName + "  " + moment(obj.addTime).format('YYYY-MM-DD HH:mm'));
  modal.$body.find('[name=fileCount]').text(obj.fileCount + '个文件  ' + obj.folderCount + '个文件夹');
  var parents = modal.$body.find('.manager').html('');
  var level1 = obj.level1 || [];
  for (var i = 0, length = level1.length; i < length; i++) {
    var dom = $('<span style="margin-right: 5px"></span>');
    dom.text(level1[i]['userName']);
    dom.appendTo(parents);
  }
  var readWriteparents = modal.$body.find('.readAndWrite').html('');
  var level2 = obj.level2 || [];
  for (var i = 0, length = level2.length; i < length; i++) {
    var dom = $('<span style="margin-right: 5px"></span>');
    dom.text(level2[i]['userName']);
    dom.appendTo(readWriteparents);
  }
  var onlyRead = modal.$body.find('.onlyRead').html('');
  var level3 = obj.level3 || [];
  for (var i = 0, length = level3.length; i < length; i++) {
    var dom = $('<span style="margin-right: 5px"></span>');
    dom.text(level3[i]['userName']);
    dom.appendTo(onlyRead);
  }
};

/**
 * 初始化我的文件柜 列表
 * @param list
 */
exports.renderMyFileCabinetTable = function (list) {
  list = list || [];
    if (list.length > 0) {
        $('#noInfoMyFileCabinetTable_main').show();
    $('#noInfoMyFileCabinetTable').hide();
  } else {
    $('#noInfoMyFileCabinetTable_main').hide();
    $('#noInfoMyFileCabinetTable').show();
  }
  var parents = $('#myFileCabinetTable').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var file = '<span class="icon-admin my-file"></span>';
    var dom = $('<tr class="active">\
                  <td>' + file + '' + item.cbntName + '</td>\
                  <td>' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
                  <td>\
                   <a data-type="update" class="edit-a">编辑</a>\
                   <div class="icon-line"></div>\
                   <a data-type="delete" class="delete-a">删除</a>\
                  </td>\
                 </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
  }
  //initEvent.initCompanyFileCabinetTableTREvent(parents, 'admin-me');
  initEvent.initTableTrClickEvent(parents, 'admin-me');
  initEvent.initMyFileCabinetEvent(parents);
};

/**
 * 初始化文件柜管理
 * @param list
 */
exports.renderFileCabinetManager = function (list) {
  if (list.length > 0) {
    $('#noInfoFileCabinetManager_main').show();
    $('#noInfoFileCabinetManager').hide();
  } else {
    $('#noInfoFileCabinetManager_main').hide();
    $('#noInfoFileCabinetManager').show();
  }
  list = list || [];
  var parents = $('#fileCabinetManager').html('');
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var fileIcon = '<span class="icon-admin"></span>';
    if (item.typeNo === 2) {
      fileIcon = '<span class="icon-admin my-file"></span>'
    }
    var dom = $('<tr style="cursor: pointer" class="active">\
                  <td>' + fileIcon + '' + item.cbntName + '</td>\
                  <td>' + item.userName + '</td>\
                  <td>' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
                  <td>' + getCbntSize(item.cbntSize) + '</td>\
                  <td><a class="checkAttribute confirm-hover">查看属性</a></td>\
                  <td>\
                   <a data-type="update" class="edit-a">编辑</a>\
                   <div class="icon-line"></div>\
                   <a data-type="delete" class="delete-a">删除</a>\
                  </td>\
                 </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
  }
  initEvent.initTableTrClickEvent(parents, 'admin-manager');
  initEvent.initFileCabinetManagerEvent(parents);
};
function getCbntSize(size){
  if(!size){
    return 0;
  }
  if(size < 1024){
    return size + 'B';
  }else if(size < 1024*1024){
    return parseInt(size/1024) + 'KB';
  }else if(size < 1024*1024*1024){
    return parseInt(size/1024/1024*10)/10 + 'MB';
  }else{
    return parseInt(size/1024/1024/1024*10) + 'G';
  }
}
/**
 * 绘制下载记录dom
 * @param list
 * @param parents
 */
exports.renderFileDownloadRecode = function (list, parents) {
  list = list || [];
  for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var dom = $('<tr class="small">\
                  <td style="padding-left: 30px">' + item.deptName + '</td>\
                  <td>' + item.userName + '</td>\
                  <td>' + moment(item.downTime).format('YYYY/MM/DD HH:mm') + '</td>\
                </tr>');
    dom.appendTo(parents);
  }
};

exports.renderMoveFileTable = function (list, parents, pid, child) {
  list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
    var item = list[i];
    var disable = '';
    if (item.fileStatus === 2) {
      disable = 'disabled';
      continue;
    }
    if (pid === 0 && item.parentId === pid) {
      var dom = $('<li data-type="v_' + pid + '" style="margin-top: 5px;cursor:pointer;" data-pid=' + item.id + '>\
                   <span style="width: 10px;height: 10px;display: inline-block;"><i class="icon-document-arrow ' + disable + '"></i></span>\
                   <span class="icon-file"></span>\
                   <a>' + item.cbntName + '</a>\
                 </li>');
      dom.appendTo(parents);
    } else if (item.parentId === pid) {
      var _dom = $('<li data-type="v_' + pid + '" style="margin-top: 5px;cursor:pointer;" data-pid=' + item.id + '>\
                   <span style="width: 10px;height: 10px;display: inline-block;"><i class="icon-document-arrow ' + disable + '"></i></span>\
                   <span class="icon-file"></span>\
                   <a>' + item.cbntName + '</a>\
                 </li>');
      _dom.appendTo(child);
    }
  }
  if (child) {
    child.appendTo(parents);
  }
  initEvent.renderMoveFileTableEvent(parents);
};