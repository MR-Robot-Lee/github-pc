var initEvent = require('./initEvent');
var ReviewImage = require('../../components/ReviewImage');

exports.renderKnowledgeType = function renderKnowledgeType(list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoKnowledgeTypeTable_main').show();
        $('#noInfoKnowledgeTypeTable').hide();
    } else {
        $('#noInfoKnowledgeTypeTable_main').hide();
        $('#noInfoKnowledgeTypeTable').show();
    }
    var parents = $('#knowledgeTypeTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="trHeightLight-hover">\
                  <td style="padding-left: 20px">' + count + '</td>\
                  <td>' + item.typeName + '</td>\
                  <td>' + item.describe + '</td>\
                  <td>' + moment(item.addTime).format("YYYY/MM/DD") + '</td>\
                  <td>' + item.knowsCount + '</td>\
                  <td>\
                  <a class="confirm-hover" data-type="update">编辑</a>\
                  <div class="icon-line"></div>\
                  <a class="delete-hover" data-type="delete">删除</a>\
                  </td>\
                </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initTableTypeEvent(parents);
};

exports.renderNewKnowledgeSelect = function renderNewKnowledgeSelect(list) {
    list = list || [];
    var parents = $('#knowledgeType').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.typeName);
        dom.val(item.id);
        dom.appendTo(parents);
    }
};


exports.renderAllKnowledgeList = function renderAllKnowledgeList(list) {
    list = list || [];
    if (list.length > 0) {
        $('#allKnowledgeList').show();
        $('[name="noInfoAllKnowledgeList_page"]').show();
        $('#noInfoAllKnowledgeList').hide();
    } else {
        $('#allKnowledgeList').hide();
        $('[name="noInfoAllKnowledgeList_page"]').hide();
        $('#noInfoAllKnowledgeList').show();
    }
    var parents = $('#allKnowledgeList').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<div class="knowledge-item">\
                <div class="item-title" style="color:#333">' + item.title + '<span>' + item.typeName + '</span>' + '</div>\
                <div class="item-content" style="color: #333;">' + item.content + '</div>\
                <div class="item-info">\
                 <label style="color: #999;">编辑人 : </label><span style="color: #666;">' + item.userName + '</span>\
                 <label style="margin-left: 15px;color: #999;">发布于 : </label><span style="color:#666">' + moment(item.addTime).format('YYYY/MM/DD HH:mm:ss') + '</span>\
                 <label style="margin-left: 15px;color: #999;">浏览 : </label><span style="color: #666;">' + item.browseTimes + '</span>\
                 <label style="margin-left: 15px;color: #999;">来源 : </label><span style="color: #666;">' + item.source + '</span>\
                 <label style="margin-left: 15px;color: #999;">原作者 : </label><span style="color: #666;">' + item.author + '</span>\
                 <label style="margin-left: 15px;color: #999;">网址链接 : </label><span style="color: #666;">' + item.linkAddress + '</span>\
               </div>\
              </div>');
        dom.data('item', item);
        dom.appendTo(parents)
    }
    initEvent.initAllKnowledgeTableDetail(parents);
};


exports.renderAllKnowledgeNav = function (list, id, type) {
    list = list || [];
    var parents = $('#knowledgeChildNav').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var $type = '';
        if (type === 'jump') {
            $type = type;
        }
        var dom = $('<li style="cursor: pointer" data-type="' + type + '">\
                  <a >' + item.typeName + '</a>\
                 </li>');
        if (id === item.id) {
            dom.addClass('active');
            $('.employee-name').text(item.typeName);
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initTypeIdFindByKnowledge(parents);
};


/**
 * 绘制附件
 * @param item
 * @returns {*|jQuery|HTMLElement}
 */
exports.renderAttachDom = function (item) {
    var type = item.attachType === "pdf" || item.attachType === 'PDF'
    || item.attachType === 'xls' || item.attachType === 'XLS'
    || item.attachType === 'gbq' || item.attachType === 'GBQ'
    || item.attachType === 'gbq5' || item.attachType === 'GBQ5'
    || item.attachType === 'gtb4' || item.attachType === 'GTB4'
    || item.attachType === 'ppt' || item.attachType === 'PPT'
    || item.attachType === 'pptx' || item.attachType === 'PPTX'
    || item.attachType === 'xlsx' || item.attachType === 'XLSX'
    || item.attachType === 'png' || item.attachType === 'PNG'
    || item.attachType === 'zip' || item.attachType === 'ZIP'
    || item.attachType === 'rar' || item.attachType === 'RAR'
    || item.attachType === 'dwg' || item.attachType === 'DWG'
    || item.attachType === 'txt' || item.attachType === 'TXT'
    || item.attachType === 'video' || item.attachType === 'VIDEO'
    || item.attachType === 'jpeg' || item.attachType === 'JPEG'
    || item.attachType === 'jpg' || item.attachType === 'JPG'
    || item.attachType === 'docx' || item.attachType === 'DOCX'
    || item.attachType === 'doc' || item.attachType === 'DOC'
        ? item.attachType : 'none';
    return $("<div class='attach-item'>\
                    <div class='icon-file " + type + "'></div>\
                    <div class='detail'>\
                     <div class='filename'>" + item.attachName + "</div>\
                     <div class='remove'>\
                      <a class='knowledgeDelete' data-type=" + item.attachUrl + ">删除</a>\
                     </div>\
                    </div>\
                   </div>");
};


exports.initDetailKnowledge = function (item) {
    var addTime = moment(item.addTime).format('YYYY/MM/DD');
    $('[name=title]').text(item.title);
    $('[name=type]').text(item.typeName);
    $('[name=userName]').text(item.userName);
    $('[name=addTime]').text(addTime);
    $('[name=source]').text(item.source);
    $('[name=author]').text(item.author);
    $('[name=browseTimes]').text(item.browseTimes);
    $('[name=linkAddress]').text(item.linkAddress);
    $('[name=summary]').text(item.summary);
    $('.knowledge-content').text(item.content);
    var parents = $('.knowledge-detail .attach-list').html('');
    var list = item.attaches || [];
    var review = '';
    var rank = 0;
    for (var i = 0, length = list.length; i < length; i++) {
        var _item = list[i];
        var review = '';
        var urlList = [];
        var attachType = _item.attachType;
        if (attachType == 'pdf' || attachType == 'txt' || attachType == 'PDF' || attachType == 'TXT') {
            review = '<a href=' + window.API_PATH + "/customer" + _item.attachUrl + ' target="_blank">预览</a>'
        } else if (attachType == 'jpg' || attachType == 'png' || attachType == 'jpeg' || attachType == 'JPG' || attachType == 'PNG' || attachType == 'JPEG') {
            review = '<a class="reviewPic" href="javascript:;">预览</a>'
        }
        var dom = $('<div class="attach-item">\
                   <div class="icon-file ' + attachType + '"></div>\
                   <div class="detail">\
                   <div class="filename">' + _item.attachName + '</div>\
                   <div class="remove">\
                    <a href=' + window.API_PATH + "/customer/attach/download?filePath=" + _item.attachUrl + '>下载</a>\
                    ' + review + '\
                   </div>\
                   </div>\
                   </div>');
        dom.appendTo(parents);
        if (attachType === 'png' || attachType === 'jpg' || attachType === 'PNG' || attachType === 'JPG' || attachType == 'jpeg' || attachType == 'JPEG') {
            dom.find('.reviewPic').data('url', _item.attachUrl);
            dom.find('.reviewPic').data('rank', rank++);
        }
    }
    parents.find('.reviewPic').click(function (e) {
        urlList.length = 0;
        parents.find('.reviewPic').each(function (index, ele) {
            urlList.push($(ele).data('url'));
        })
        var review = new ReviewImage(urlList, '', $(this).data('rank'));
        review.show();
    })
};


exports.initKnowledgeUpdate = function (item, attach) {
    var addTime = moment(item.addTime).format('YYYY/MM/DD');
    $('[name=title]').val(item.title);
    $('[name=type]').val(item.typeName);
    $('[name=userName]').val(item.userName);
    $('[name=addTime]').val(addTime);
    $('[name=source]').val(item.source);
    $('[name=author]').val(item.author);
    $('[name=browseTimes]').val(item.browseTimes);
    $('[name=linkAddress]').val(item.linkAddress);
    $('[name=summary]').val(item.summary);
    $('[name=content]').val(item.content);
    var list = item.attaches || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        attach.appendAttach(item);
    }
};