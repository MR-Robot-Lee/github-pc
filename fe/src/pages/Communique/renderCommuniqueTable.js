var initEvent = require('./initEvent');
var ReviewImage = require('../../components/ReviewImage');


exports.renderCommuniqueType = function (list) {
    list = list || [];
    var parents = $('#communiqueTypeTable').html('');
    if (list.length > 0) {//无信息展示
        $("#communiqueDetailList").show();
        $("#noInfoCommunique").hide();
    } else {
        $("#communiqueDetailList").hide();
        $("#noInfoCommunique").show();
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="active">\
                  <td style="padding-left: 20px">' + count + '</td>\
                  <td>' + item.title + '</td>\
                  <td>' + item.discussion + '</td>\
                  <td>' + moment(item.pblshTime).format('YYYY/MM/DD') + '</td>\
                  <td>' + item.annoCount + '</td>\
                  <td class="Competence">\
                   <a data-type="update" class="edit-a">编辑</a>\
                   <div class="icon-line" style="margin: 0 10px;"></div>\
                   <a data-type="delete" class="delete-a">删除</a>\
                  </td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initCommuniqueTypeTableEvent(parents);
};


exports.renderAddCommuniqueSelect = function (list) {
    list = list || [];
    var parents = $('#communiqueType').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.title);
        dom.val(item.id);
        dom.appendTo(parents);
    }
};

exports.renderAllCommunique = function (list) {
    list = list || [];
    if (list.length > 0) {//无信息展示
        $("#page").show();
        $("#noInfoCommuniqueDetail").hide();
    } else {
        $("#page").hide();
        $("#noInfoCommuniqueDetail").show();
    }
    var parents = $('#allKnowledgeList').html('');
    $('.knowledge-detail').removeClass('active');
    parents.css('width', '100%');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<div class="knowledge-item">\
                  <div class="item-title" style="color: #333333;">' + item.title + '<span style="float: right;margin-right: 20px;font-size: 12px;color: #999999;">' + item.annTypeName + '</span>' + '</div>\
                  <div class="item-content" style="color: #333333;">' + item.content + '</div>\
                  <div class="item-info">\
                   <label style="color: #999;">发布人 : </label><span style="color: #666;">' + item.userName + '</span>\
                   <label style="margin-left: 15px;color: #999;">发布于 : </label><span style="color:#666">' + moment(item.pblshTime).format('YYYY/MM/DD HH:mm:ss') + '</span>\
                   <label style="margin-left: 15px;color: #999;">浏览 : </label><span style="color: #666;">' + item.browCount + '</span>\
                   <label style="margin-left: 15px;color: #999;">评论 : </label><span style="color: #666;">' + item.commCount + '</span>\
                  </div>\
                 </div>');
        dom.data('id', item.id);
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initAllCommuniqueTableEvent(parents);
};

exports.addCommuniqueDom = function (obj, attach) {
    $('#communiqueType').val(obj.annTypeId);
    $('[name=title]').val(obj.title);
    $('[name=content]').val(obj.content);
    var list = obj.attaches || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        attach.appendAttach(item);
    }
};

exports.renderCommentList = function (list) {
    list = list || [];
    var parents = $('.comments-list').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var imgUrl = '<div class="user-header-img"></div>';
        if (item.headImageUrl) {
            imgUrl = '<img class="user-header-img-dom" src="' + window.API_PATH + '/customer' + item.headImageUrl + '" />'
        }
        var dom = $('<div class="comment-item">\
                  ' + imgUrl + '\
                  <div class="user-info">\
                  <div>\
                   <span>' + item.userName + '</span>\
                   <span>' + item.roleName + '</span>\
                   <span class="comment-time">' + moment(item.commentTime).format('YYYY/MM/DD HH:mm') + '</span>\
                  </div>\
                  <div class="comment-content">' + item.commentContent + '</div>\
                 </div>\
                </div>');
        dom.appendTo(parents);
    }
};

exports.renderBrowerModal = function (list, parents) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<tr>\
                 <td style="padding-left: 50px;width: 150px;">' + item.deptName + '</td>\
                 <td style="width: 250px;padding-left: 30px;">' + item.userName + '</td>\
                 <td>' + moment(item.browTime).format('YYYY-MM-DD HH:mm') + '</td>\
               </tr>');
        dom.appendTo(parents);
    }
};

exports.renderUnbrowerModal = function (list, parents) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<tr>\
                 <td style="padding-left: 50px;width: 150px;">' + item.deptName + '</td>\
                 <td style="width: 250px;padding-left: 30px;">' + item.userName + '</td>\
                 <td>-</td>\
               </tr>');
        dom.appendTo(parents);
    }
};

/**
 * 绘制公告详情
 * @param obj
 */
exports.renderCommuniqueDetail = function (obj) {
    $('.knowledge-title').text(obj.title);
    $('[name=type]').text(obj.annTypeName);
    $('[name=type]').attr('title', obj.annTypeName);
    $('[name=userName]').text(obj.userName);
    $('[name=browseTimes]').text(obj.browCount);
    $('[name=source]').text(obj.commCount);
    $('.knowledge-content').text(obj.content);
    $('[name=addTime]').text(moment(obj.pblshTime).format('YYYY-MM-DD HH:mm'));
    var parents = $('.knowledge-detail .attach-list').html('');
    var list = obj.attaches || [];
    parents.data('attaches', list);
    var rank = 0;
    var urlList = [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var yl = '';
        if ( item.attachType === 'pdf' || item.attachType === 'txt' || item.attachType === 'PDF' || item.attachType === 'TXT') {
            yl = '<a href=' + window.API_PATH + "/customer" + item.attachUrl + ' target="_blank">预览</a>';
        } else if(item.attachType === 'png' || item.attachType === 'jpg' || item.attachType === 'PNG' || item.attachType === 'JPG'){
            yl = '<a class="reviewPic" href="javascript:;">预览</a>';
        }
        var attachType = item.attachType;
        var dom = $('<div class="attach-item">\
                   <div class="icon-file ' + attachType + '"></div>\
                   <div class="detail">\
                   <div class="filename">' + item.attachName + '</div>\
                   <div class="remove">\
                    <a href=' + window.API_PATH + '/customer/attach/download?filePath=' + item.attachUrl + '>下载</a>\
                    ' + yl + '\
                   </div>\
                   </div>\
                   </div>');
        /*给预览a标签绑定数据*/
        if(item.attachType === 'png' || item.attachType === 'jpg' || item.attachType === 'PNG' || item.attachType === 'JPG'){
            dom.find('.reviewPic').data('url',item.attachUrl);
            dom.find('.reviewPic').data('rank',rank++);
        }
        dom.appendTo(parents);
    }
    parents.find('.reviewPic').click(function(e){
        urlList.length = 0;
        parents.find('.reviewPic').each(function(index,ele){
            urlList.push($(ele).data('url'));
        })
        var review = new ReviewImage(urlList, '', $(this).data('rank'));
        review.show();
    })
};

exports.renderCommuniqueTypeNav = function (list, id, type) {
    list = list || [];
    var parents = $('#communiqueChildNav').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var $type = '';
        if (type === 'jump') {
            $type = 'jump';
        }
        var dom = $('<li style="height: 43px;cursor: pointer" id="' + item.id + '" data-type="' + $type + '">\
                  <a style="padding-right: 30px;" class="ellipsis">' + item.title + '</a>\
                 </li>');
        if (id === item.id) {
            dom.addClass('active');
            $('.employee-name').text(item.title);
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initTypeIdFindByCommunique(parents);
};