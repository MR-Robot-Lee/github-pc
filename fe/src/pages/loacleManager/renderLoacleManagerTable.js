var initEvent = require('./initEvent');
exports.renderAttentionProjectTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoAttentionTable_main').show();
        $('#noInfoLocaleManager').hide();
    } else {
        $('#noInfoAttentionTable_main').hide();
        $('#noInfoLocaleManager').show();
    }
    var parents = $('#attentionTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var attention = "";
        var type = '';
        var color = '';
        if (item.isFocus === 1) {
            attention = '取消关注';
            type = 'attention';
            color = 'delete-hover fcxxx';
        } else if (item.isFocus === 2) {
            attention = '关注';
            type = 'cancel';
            color = 'confirm-hover fcx';
        }
        var count = i + 1;
        var dom = $('<tr class="active">\
                  <td style="padding-left: 20px">' + count + '</td>\
                  <td>' + '<span class="pro-status ' + parseProjectStatusIcon(item.projState) + '"></span><span style="vertical-align: middle">' + item.projectName + '</span></td>\
                  <td>' + parseState(item.projState) + '</td>\
                  <td><a data-type="' + type + '" class="' + color + '">' + attention + '</a></td>\
                 </tr>');
        dom.data('id', item.projId);
        dom.appendTo(parents);
    }
    initEvent.initSceneProjectTableEvent(parents);
};


function parseProjectStatusIcon(status) {
    status = parseInt(status);
    switch (status) {
        case 0:
        case 1:
            return 'pro-not';
        case 2:
            return 'pro-inProgress';
        case 3:
            return 'pro-lockout';
        case 4:
            return 'pro-completion';
        case 5:
            return 'pro-warranty';
        default:
            return '';
    }
}


function parseState(type) {
    type = parseInt(type);
    switch (type) {
        case 0:
        case 1:
            return '未开工';
        case 2:
            return '在建';
        case 3:
            return '停工';
        case 4:
            return '竣工';
        case 5:
            return '质保';

    }
}

exports.renderLocaleManagerTable = function (list, type, nav) {
    list = list || [];
    if (list.length > 0) {
        $("#noInfoLocaleManager_main").show();
        $("#noInfoLocaleManager").hide();
    } else {
        $("#noInfoLocaleManager_main").hide();
        $("#noInfoLocaleManager").show();
    }
    var parents = $('.locale-manager-list').html('');
    var projDeptNameList = [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var noPic = '';
        var pic = '';
        if (item.imageUrl) {/*有图片*/
            if (item.attaches[0].thumbnailUrl) {/*有压缩*/
                pic = window.API_PATH + '/customer' + item.attaches[0].thumbnailUrl;
            } else {/*无压缩*/
                pic = window.API_PATH + '/customer' + item.imageUrl;
            }
        } else {
            noPic = '暂无图片';
        }
        var noticeTypeName = item.noticeType == 3 ? '安全文明' : '质量进度';
        var dom = $('<div class="clearfix locale-item" >' +
            '<div style="background-image: url(' + pic + ')" class="locale-pic">' + noPic + '</div>' +
            '<div class="locale-container">' +
            '<div class="locale-title" style="color: #333">' + item.noticeTitle + '<span>' + noticeTypeName + '</span>' + '</div>' +
            '<div class="locale-content" style="color: #333">' + item.noticeContent + '</div>' +
            '<div class="locale-desc">' +
            '<label style="margin-right: 30px;color: #666;">' + item.projDeptName + '</label>' +
            '<label style="color: #999;">编辑人 : </label>' +
            '<span style="margin-right: 30px;color: #666;">' + item.userName + '</span>' +
            '<label style="color: #666;">' + moment(item.addTime).format('YYYY/MM/DD HH:mm') + '</label>' +
            '</div>' +
            '</div>' +
            '</div>');
        dom.data("item", {id: item.id, type: type});
        dom.appendTo(parents);
        //选出项目部个数
        var flag = true;
        for (j = -1; j < projDeptNameList.length; j++) {
            if (projDeptNameList[j] == item.projDeptName) {
                flag = false;
            }
        }
        if (flag) {
            projDeptNameList.push(item.projDeptName);
        }
    }
    if ($('.keyword option').length <= 1) {//如果下拉框内无内容则添加项目部
        for (k = 0; k < projDeptNameList.length; k++) {
            var proDom = $('<option value=' + projDeptNameList[k] + '>' + projDeptNameList[k] + '</option>');
            proDom.appendTo($('.keyword'));
        }
    }
    initEvent.initLocaleManagerTableEvent(parents);
};

exports.renderLocaleManagerDetail = function (res) {
    var detailLocale = $('#locale-detail');
    var id = detailLocale.data('id');
    var list = res.data ? res.data.data : [];
    var selectDetail = {};
    var count = -1;
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.id === id) {
            selectDetail = item;
            count = i;
            break;
        }
    }
    $('.locale-detail-title').text(selectDetail.noticeTitle);
    $('.userName').text(selectDetail.userName);
    $('.projDeptName').text(selectDetail.projDeptName);
    $('.projectName').text(parseType(selectDetail.noticeType));
    $('.addTime').text(moment(selectDetail.addTime).format('YYYY/MM/DD HH:mm'));
    var imageDom = $('.local-detail-images').html('');
    var images = selectDetail.attaches || [];
    for (var j = 0, $length = images.length; j < $length; j++) {
        var $item = images[j];
        var HDurl = window.API_PATH + '/customer' + $item.attachUrl;
        if ($item.thumbnailUrl) {
            var url = window.API_PATH + '/customer' + $item.thumbnailUrl;
        } else {
            var url = window.API_PATH + '/customer' + $item.attachUrl;
        }
        var dom = $('<a target=_blank class="local-detail-image" style="background-image: url(' + url + ')"  href=' + HDurl + ' ></a>')
        dom.appendTo(imageDom);
    }
    $('.local-detail-content').text(selectDetail.noticeContent);
    var pageTotal = $('#pageTotal').html('');
    var time = detailLocale.data('time');
    var $type = detailLocale.data('type');
    if (count > 0) {
        var previous = list[count - 1];
        var $domUp = $('<div>\
                  <label style="color: #999">上一篇:</label>\
                  <a>' + previous.noticeTitle + '</a>\
                </div>');
        $domUp.find('a').attr('href', '/locale/manager/detail?id=' + previous.id + '&type=' + $type + '&time=' + time);
        $domUp.appendTo(pageTotal);
    }
    if (list.length > 1) {
        var next = list[count + 1];
        if (next) {
            var $domDown = $('<div style="padding: 5px 0;">\
                         <label style="color: #999">下一篇:</label>\
                         <a>' + next.noticeTitle + '</a>\
                        </div>');
            $domDown.find('a').attr('href', '/locale/manager/detail?id=' + next.id + '&type=' + $type + '&time=' + time);
            $domDown.appendTo(pageTotal);
        }
    }
};

function parseType(type) {
    type = parseInt(type);
    switch (type) {
        case 3:
            return '安全文明';
        case 4:
            return '质量进度';
    }
}