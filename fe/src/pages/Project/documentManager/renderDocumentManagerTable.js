var initEvent = require('./initEvent');

exports.renderDocumentManagerTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $("#noInfoDocumentManagerTable_main").show();
        $("#noInfoDocumentManagerTable").hide();
    } else {
        $("#noInfoDocumentManagerTable_main").hide();
        $("#noInfoDocumentManagerTable").show();
        $("#noInfoDocumentManagerTable_desc").html('点击上方的"上传"按钮上传文件吧!');
    }
    var parents = $('#documentManagerTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var className = '';
        if (item.fileSuffix === 'doc' || item.fileSuffix === 'DOC' || item.fileSuffix === 'docx' || item.fileSuffix === 'DOCX') {
            className = ' doc'
        } else if (item.fileSuffix === 'xls' || item.fileSuffix === 'XLS') {
            className = ' xls';
        } else if (item.fileSuffix === 'xlsx' || item.fileSuffix === 'XLSX') {
            className = ' xlsx';
        } else if (item.fileSuffix === 'txt' || item.fileSuffix === 'TXT') {
            className = ' txt';
        } else if (item.fileSuffix === 'zip' || item.fileSuffix === 'ZIP') {
            className = ' zip';
        } else if (item.fileSuffix === 'rar' || item.fileSuffix === 'RAR') {
            className = ' rar';
        } else if (item.fileSuffix === 'gbq' || item.fileSuffix === 'GBQ') {
            className = ' gbq';
        } else if (item.fileSuffix === 'gbq5' || item.fileSuffix === 'GBQ5') {
            className = ' gbq';
        } else if (item.fileSuffix === 'gtb4' || item.fileSuffix === 'GTB4') {
            className = ' gbq';
        } else if (item.fileSuffix === 'ppt' || item.fileSuffix === 'PPT' || item.fileSuffix === 'pptx' || item.fileSuffix === 'PPTX') {
            className = ' ppt';
        } else if (item.fileSuffix === 'video' || item.fileSuffix === 'VIDEO') {
            className = ' video';
        } else if (item.fileSuffix === 'pdf' || item.fileSuffix === 'PDF') {
            className = ' pdf';
        } else if (item.fileSuffix === 'jpg' || item.fileSuffix === 'png' || item.fileSuffix === 'JPG' || item.fileSuffix === 'PNG' || item.fileSuffix === 'jpeg' || item.fileSuffix === 'JPEG') {
            className = ' jpeg';
        } else if (item.fileSuffix === 'cad' || item.fileSuffix === 'dwg') {
            className = ' cad';
        } else {
            className = " none"
        }
        var check = '';
        if (item.fileSuffix === 'jpg' || item.fileSuffix === 'png' || item.fileSuffix === 'JPG' || item.fileSuffix === 'PNG' || item.fileSuffix === 'jpeg' || item.fileSuffix === 'JPEG' || item.fileSuffix === 'pdf' || item.fileSuffix === 'txt') {
            check = '<a class="confirm-hover" data-type="download">下载记录</a> <div class="icon-line"></div> <a class="confirm-hover" data-type="review">预览</a> ';
        } else {
            check = '<a class="confirm-hover" data-type="download">下载记录</a>';
        }
        var dom = $('<tr class=" active">\
      <td><input type="checkbox"></td>\
      <td><span class="icon-file' + className + '"></span>' + item.fileName + '</td>\
      <td>' + item.addUserName + '</td>\
      <td>' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
      <td style="position: relative">' + check + '</td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initDocumentManagerTableEvent(parents);
};


exports.renderDocumentManagerNav = function (list, parents, childParent, pid) {
    list = list || [];
    var that = this;
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = '';
        if (childParent) {
            dom = $('<li style="cursor: pointer" class="item" data-type="child" id="cid-' + item.id + '">\
                <a style="padding-left: 30px;"><label style="cursor: pointer" class="content">' + item.fileTypeName + '</label>\
                 <div class="icon-position">\
                  <span class="icon-enterprise-two-edit event" data-type="edit"></span>\
                  <span class="icon-enterprise-two-delete event" data-type="delete"></span>\
                 </div>\
                </a>\
               </li>');
            dom.data('item', {id: item.id, name: item.fileTypeName, pid: pid});
            dom.appendTo(childParent);
            childParent.appendTo(parents);
        } else {
            dom = $('<li style="cursor: pointer" class="item" data-type="parent" id="pid-' + item.id + '">\
                  <a><span style="margin-right: 5px;" class="arrow"></span><label style="cursor: pointer" class="content">' + item.projFileCategoryName + '</label>\
                  <div class="icon-position">\
                   <span class="icon-enterprise-one-add event" data-type="add"></span>\
                   <span class="icon-enterprise-one-edit event" data-type="edit"></span>\
                   <span class="icon-enterprise-one-delete event" data-type="delete"></span>\
                  </div>\
                  </a>\
                  </li>');
            dom.data('item', {id: item.id, name: item.projFileCategoryName});
            dom.appendTo(parents);
        }
        if (item.children) {
            var ulParents = $('<ul class="nav-content no-padding nav-none"></ul>');
            that.renderDocumentManagerNav(item.children, dom, ulParents, item.id);
        }
        var user = window.localStorage.getItem('user');
        user = user ? JSON.parse(user) : {permission: {}};
        var projFileAdd = user.permission['projFile:*'];
        if (projFileAdd) {
            dom.find('.icon-position').addClass('small14');
        } else {
            dom.find('.icon-position').removeClass('small14')
        }
    }
    if ($('#childNav').html()) {
        $('#childNav').show();
        $('#noInfoDocument').hide();
    } else {
        $('#childNav').hide();
        $('#noInfoDocument').show();
        $('#noInfoDocumentManagerTable_desc').html('上传文件前，请先在左边列表中创建分类！');
    }
};


exports.renderMoveSelectDom = function (list) {
    list = list || [];
    var parents = $('#newMaterial').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.fileCategoryName);
        dom.val(item.id);
        dom.appendTo(parents);
    }
};

exports.renderSelectDom = function (list) {
    list = list || [];
    var parents = $('#materialParent').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.projFileCategoryName);
        dom.val(item.id);
        dom.data('item', item.children);
        dom.appendTo(parents);
    }
    initEvent.initMoveSelectEvent(parents);
};

exports.renderSelectTableDom = function (list) {
    list = list || [];
    var parents = $('#materialParent').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.projFileCategoryName);
        dom.val(item.id);
        dom.data('item', item.children);
        dom.appendTo(parents);
    }
    initEvent.initMoveSelectEvent(parents);

    var $parents = $('#newParent').html('');
    $('<option value="a">请选择</option>').appendTo($parents);
    for (var j = 0, $length = list.length; j < $length; j++) {
        var $item = list[j];
        var $dom = $('<option></option>');
        $dom.text($item.projFileCategoryName);
        $dom.val($item.id);
        $dom.data('item', $item.children);
        $dom.appendTo($parents);
    }
    initEvent.initMoveSelectEvent($parents, $('#newChild'));
};


exports.renderDownloadTable = function (list) {
    list = list || [];
    var parents = $('#downLoadTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">\
      <td class="border">' + item.addUserName + '</td>\
      <td class="border">' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};