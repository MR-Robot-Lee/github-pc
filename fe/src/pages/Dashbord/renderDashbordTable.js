var initEvent = require('./initEvent');
exports.renderMainNotice = function (obj) {
    var notice = obj.notice ? obj.notice : [];
    var knowledge = obj.knowledge ? obj.knowledge : [];
    var buildNews = obj.buildNews ? obj.buildNews : [];
    if (notice.length != 0) {
        $('#report').css({'height': 'auto', 'maxHeight': '155px'}).parent().parent().css({
            'height': 'auto',
            'maxHeight': '200px'
        });
        var parents1 = $('#report').html('');
        for (var i = 0, length1 = notice.length; i < length1; i++) {
            var item1 = notice[i];
            var dom1 = $('<li style="cursor: pointer">\
                  <i class="icon-disc-item"></i>\
                  <span>' + item1.title + '</span>\
                  <i class="tz-date">' + moment(item1.pblshTime).format('YYYY年MM月DD日') + '</i>\
                 </li>');
            dom1.data('item', item1);
            dom1.appendTo(parents1);
        }
    }
    if (buildNews.length != 0) {
        $('#construction').css({'height': 'auto', 'maxHeight': '155px'}).parent().parent().css({
            'height': 'auto',
            'maxHeight': '200px'
        });
        var parents2 = $('#construction').html('');
        for (var j = 0, length2 = buildNews.length; j < length2; j++) {
            var item2 = buildNews[j];
            var dom2 = $('<li style="cursor: pointer">\
                   <i class="icon-disc-item"></i>\
                   <span>' + item2.newsTitle + '</span>\
                   <i class="tz-date">' + moment(item2.addTime).format('YYYY年MM月DD日') + '</i>\
                  </li>');
            dom2.data('item', item2);
            dom2.appendTo(parents2);
        }
    }
    if (knowledge.length != 0) {
        $('#knowledge').css({'height': 'auto', 'maxHeight': '155px'}).parent().parent().css({
            'height': 'auto',
            'maxHeight': '200px'
        });
        var parents3 = $('#knowledge').html('');
        for (var k = 0, length3 = knowledge.length; k < length3; k++) {
            var item3 = knowledge[k];
            var dom3 = $('<li style="cursor: pointer">\
                   <i class="icon-disc-item"></i>\
                   <span>' + item3.title + '</span>\
                   <i class="tz-date">' + moment(item3.addTime).format('YYYY年MM年DD日') + '</i>\
                  </li>');
            dom3.data('item', item3);
            dom3.appendTo(parents3);
        }
    }
    initEvent.initKnowledgeEvent(parents1, parents2, parents3);
};

exports.renderOrganizationTable = function (list) {
    list = list || [];
    var parents = $('#childNav').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var name = item.deptName || item.projDeptName;
        var dom = $('<li>\
      <a>\
      ' + name + '\
      <div class="icon-position small14">\
      </div>\
      </a>\
      </li>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initOrganizationTableEvent(parents);
};

exports.renderOrganizationUserTableDom = function (list) {
    list = list || [];
    var parents = $('#userList').html('');
    var liItem = $('#childNav li.active').data('item');
    if (list.length < 1) {
        $('#userList').html(' ');
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var sex = item.sex === 1 ? '男' : '女';
        var deptName = liItem.deptName;
        var mobile = item.mobile || " ";
        var phone = item.phone || ' ';
        if (liItem.deptName) {
            $('.OrgDeptName').show();
            $('.OrgPostName').html('职务')
            var dom = $('<tr>\
      <td>' + item.userName + '</td>\
      <td>' + sex + '</td>\
      <td>' + deptName + '</td>\
      <td>' + item.postName + '</td>\
      <td>' + mobile + '</td>\
      </tr>');
        } else {
            $('.OrgDeptName').hide();
            $('.OrgPostName').html('项目部职务')
            var dom = $('<tr>\
      <td>' + item.userName + '</td>\
      <td>' + sex + '</td>\
      <td>' + item.postName + '</td>\
      <td>' + phone + '</td>\
      </tr>');
        }
        dom.appendTo(parents);
    }
};


exports.renderProjectFinancialTable = function (list) {
    list = list || [];
    var parents = $('#projectFinancial').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.projectName + '</td>\
      <td class="border">' + parseRecType(item.fundResc) + '</td>\
      <td class="border">' + item.costNo + '</td>\
      <td class="border">' + item.costName + '</td>\
      <td class="border">' + moment(item.addTime).format('YYYY/MM/DD') + '</td>\
      <td class="border">' + item.recObjName + '</td>\
      <td class="border">' + item.billMoney + '</td>\
      <td class="border">' + parseType(item.billStatus) + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};

function parseRecType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '报销';
        case 2:
            return '预付款';
        case 3:
            return '材料实付款';
        case 4:
            return '材料应付款';
        case 5:
            return '结算应付款';
    }
}

function parseType(billStatus) {
    billStatus = parseInt(billStatus);
    switch (billStatus) {
        case 1:
            return '已保存';
        case 2:
            return '审批中';
        case 3:
            return '已完成';
        case 4:
            return '已驳回';
    }
}

exports.renderProjectNickNameSelect = function (list) {
    list = list || [];
    var parents = $('#projId').html('');
    $('<option value="0">全部</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.projectName);
        dom.val(item.projId);
        dom.appendTo(parents);
    }
};
exports.renderJobRemindNum = function (list) {
    if (list == 0) {
        $('.dashbord-nav').find('.job-remind-num').hide();
    } else {
        $('.dashbord-nav').find('.job-remind-num').text(list).show();
    }
}

exports.renderJobRemindTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoWorkRemind_main').show();
        $('#noInfoWorkRemind').hide();
    } else {
        $('#noInfoWorkRemind_main').hide();
        $('#noInfoWorkRemind').show();
    }
    var parents = $('.job-alert-list').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var img = '';
        if (item.moduleId == 20) {
            img = 'buildlog';
        }
        if (item.moduleId == 13) {
            img = 'institutional';
        }
        if (item.moduleId == 18) {
            img = 'metarial';
        }
        if (item.moduleId == 17) {
            img = 'schedule';
        }
        if (item.moduleId == 10) {
            img = 'settle';
        }
        if (item.moduleId == 9) {
            img = 'contractManager';
        }
        if (item.moduleId == 20) {
            img = 'buildlog';
        }
        if (item.parentName == '项目通知') {
            img = 'notice';
        }
        if (item.parentName == '项目任务') {
            img = 'task';
        }
        var dom = $('<div class="job-item">' +
            '<div class="job-item-header">' +
            '<span class="icon-dashbord-report ' + img + '"></span>' +
            '<span>[' + item.parentName + ']</span>' +
            '</div>' +
            '<div class="job-item-content">' +
            '<div><pre style="margin: 0;font:14px microsoft yahei">' + item.remindContent + '</pre></div>' +
            '<div class="remind-time">提醒时间 : ' + item.addTime + '</div>' +
            '</div>' +
            '</div>')
        dom.appendTo(parents);
    }
};

function parseNumChinese(int) {
    switch (int) {
        case 1:
            return '星期一';
        case 2:
            return '星期二';
        case 3:
            return '星期三';
        case 4:
            return '星期四';
        case 5:
            return '星期五';
        case 6:
            return '星期六';
        case 7:
            return '星期日'
    }
}

exports.renderSelectMinute = function (parents) {
    for (var i = 0; i <= 60; i++) {
        var dom = $('<option></option>');
        dom.text(i);
        dom.val(i);
        dom.appendTo(parents);
    }
};

exports.renderIndexPicture = function (list) {
    list = list || [];
    var parents = $('.vmc-centered').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var picUrl;
        if(item.pictureSize > 51200){
            picUrl = item.thumbnailUrl;
        } else {
            picUrl = item.url;
        }
        var dom = $('<li><img src="' + window.API_PATH + '/customer' + picUrl + '" width="200"/></li>');
        dom.appendTo(parents);
    }
    initEvent.slideshowFunc(parents);
};


exports.renderIndexRemindTable = function (list) {
    list = list || [];
    var parents = $('#job-alert-list').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var moduleContent = "";
        var moduleTime = "";
        var className = "";
        var oper = '';
        var operTitle = '';
        if (item.moduleId == 7) {//公告
            moduleContent = "发布人";
            moduleTime = "发布于";
        } else if (item.moduleId == 2) {//施工快报
            moduleContent = "发布人";
            moduleTime = "发布于";
            className = " construction";
            oper = '工程简称';
            operTitle = ' : ' + item.operTitle;
        } else if (item.moduleId == 4) {//知识
            moduleContent = "发布人";
            moduleTime = "发布于";
            className = " knowledge";
        } else if (item.moduleId == 5) {//文档
            moduleContent = "新建人";
            moduleTime = "新建于";
            className = " file";
            if (item.parentName == "个人文件柜") {
                className = 'myfile';
            }
        } else if (item.moduleId == 6) {//企业库
            moduleContent = "操作人";
            moduleTime = "操作时间";
            className = " enterprise";
            oper = '工程简称';
            operTitle = ' : ' + item.operTitle;
        } else if (item.moduleId == 12) {//项目主页
            moduleContent = "操作人";
            moduleTime = "操作时间";
            className = " systemSetting";
            oper = '工程简称';
            operTitle = ' : ' + item.operTitle;
        } else if (item.moduleId == 13) {//项目机构
            moduleContent = "操作人";
            moduleTime = "操作时间";
            className = " institutional";
            oper = '工程简称';
            operTitle = ' : ' + item.operTitle;
        } else if (item.moduleId == 29 || item.moduleId == 28) {//成本预算
            moduleContent = "操作人";
            moduleTime = "操作时间";
            className = " costManagement";
            oper = '工程简称';
            operTitle = ' : ' + item.operTitle;
        } else if (item.moduleId == 16 || item.moduleId == 30 || item.moduleId == 31) {//项目财务
            moduleContent = "操作人";
            moduleTime = "操作时间";
            className = " finance";
            oper = '工程简称';
            operTitle = ' : ' + item.operTitle;
        } else if (item.moduleId == 17) {//进度管理
            moduleContent = "操作人";
            moduleTime = "操作时间";
            className = " schedule";
            oper = '工程简称';
            operTitle = ' : ' + item.operTitle;
        } else {
            moduleContent = "操作人";
            moduleTime = "操作时间";
        }
        var dom = $('<div class="job-item">' +
            '<div class="job-item-header clearfix">' +
            '<span class="icon-dashbord-report ' + className + '" style="float: left;"></span>' +
            '<span style="float: left;margin-left: 5px;">[' + item.moduleName + ']</span>' +
            '<span style="float: left;margin-left: 10px;">' + item.operLog + '</span>' +
            '<span style="float: right;font-size: 12px;color: #999;">' + item.parentName + '</span>' +
            '</div>' +
            '<div class="job-item-content">' +
            '<span>' + moduleContent + ' : ' + item.operName + '</span>' +
            '<span>' + moduleTime + ' : ' + moment(item.operTime).format('YYYY/MM/DD HH:mm:ss') + '</span>' +
            '<span>' + oper + operTitle + '</span>' +
            '</div>' +
            '</div>')
        dom.appendTo(parents);
    }
};


exports.renderCalendarDom = function (list, parents) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var time = moment(item.remindTime).format('YYYYMMDD');
        var dateTime = $('.' + parents + '-' + time);
        dateTime.find('i').addClass('active');
        dateTime.data('item', item);
        var $parents = dateTime.find('.addContent').html('');
        if ($parents.length > 0) {
            var dom = $('<div style="font-size: 12px;"><span class="contentTime"></span><span style="margin-left: 5px;"class="content"></span></div>');
            dom.find('.content').text(item.remindContent);
            dom.find('.contentTime').text(moment(item.addTime).format('YYYY/MM/DD HH:mm:ss'));
            dom.appendTo($parents);
        }
    }
    var today = $('#weeks').find('div.active');
    var item = today.data('item');
    if (today.find('i').hasClass('active') && localStorage.getItem('work-remind') == '1') {
        var timer = setTimeout(function () {
            localStorage.setItem('work-remind', 0);
            var dom = $('<div class="work-remind">' +
                '<div class="remind-arrow-over"></div>' +
                '<div class="work-remind-title">' +
                '<span>我的台历</span>' +
                '<span class="icon-close"></span>' +
                '</div>' +
                '<div class="work-remind-content">' +
                '<textarea disabled class="int int-default" style="width: 315px;height: 130px;vertical-align: top">' + item.remindContent + '</textarea>' +
                '</div>' +
                '</div>' +
                '<div class="remind-arrow"></div>');
            today.css('position', 'relative');
            dom.appendTo(today);
            $('.work-remind').slideDown(300);
            $('.work-remind').click(function (e) {
                e.stopPropagation();
            }).find('.icon-close').click(function (e) {
                e.stopPropagation();
                $('.work-remind').remove();
                $('.remind-arrow').remove();
            })
        }, 1000)
    }
};

exports.renderJobDescDom = function (list) {
    initEvent.initPositionDetails(list);
}