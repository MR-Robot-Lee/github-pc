var initEvent = require('./initEvent');
var ReviewImage = require('../../components/ReviewImage');


exports.renderApprovalProcessTypeTable = function (list) {
    list = list || [];
    var parents = $('#processTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="trHeightLight-hover">\
                  <td style="padding-left: 20px">' + count + '</td>\
                  <td>' + item.tmplTypeName + '</td>\
                  <td>' + item.addUserName + '</td>\
                  <td>' + item.childCount + '</td>\
                  <td>\
                   <a class="confirm-hover" data-type="edit">编辑</a>\
                   <div class="icon-line"></div>\
                   <a class="delete-hover" data-type="delete">删除</a>\
                  </td>\
                 </tr>');
        dom.data('item', {id: item.id, name: item.tmplTypeName});
        dom.appendTo(parents);
    }
    initEvent.initProcessTypeTableEvent(parents);
};

exports.renderApprovalProcessSettingTable = function (list) {
    list = list || [];
    var parents = $('#processSettingTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="trHeightLight-hover" style="cursor: pointer;">\
                  <td style="padding-left: 20px">' + count + '</td>\
                  <td>' + item.tmplTypeName + '</td>\
                  <td>' + item.tmplName + '</td>\
                  <td>' + item.remark + '</td>\
                  <td class="clearfix" style="position: relative">\
                   <a class="delete-hover close-temp fl" data-type="close">关闭流程</a>\
                   <a style="display: none;" class="confirm-hover open-temp fl" data-type="open">开启流程</a>\
                   <div class="icon-line fl" style="margin: 0 5px"></div>\
                   <a class="delete-hover fl" data-type="delete">删除</a>\
                  </td>\
                 </tr>');
        if(item.on_off === 2){
            dom.find('.close-temp').hide();
            dom.find('.open-temp').show();
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initApprovalProcessSettingTableEvent(parents);
};

exports.renderApprovalProcessSettingSelect = function (list, parents, init) {
    list = list || [];
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.tmplTypeName);
        dom.val(item.id);
        dom.appendTo(parents);
    }
    if (init) {
        initEvent.initNewApplyDomEvent(parents);
    }
};

exports.renderProjectJobListDom = function (list, modal, level) {
    list = list || [];
    var parents = modal.$body.find('#JobList').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<div class="job-item">\
      <span class="select"></span>\
      <span>' + item.posName + '</span>\
      </div>');
        dom.data('item', {id: item.id, posName: item.posName});
        dom.appendTo(parents);
    }
    initEvent.initProjectJobListDomEvent(parents, level);
};

exports.renderApprovalProcessSettingAddObj = function (obj, nodes) {
    $('#processType').val(obj.tmplType);
    $('[name=tmplName]').val(obj.tmplName);
    $('[name=remark]').val(obj.remark);
    var posIds = obj.copyProjPosIds ? obj.copyProjPosIds.split(";") : [];
    var list = [];
    for (var i = 0; i < posIds.length; i++) {
        var id = posIds[i];
        if (id) {
            list.push({id: id});
        }
    }
    if (obj.copyProjPosNames) {
        $('#carbonCopyJob').data('user', list);
        $('#carbonCopyJob').val(obj.copyProjPosNames);
    }
    var userNos = obj.copyUserNos ? obj.copyUserNos.split(';') : [];
    var listNos = [];
    for (var j = 0; j < userNos.length; j++) {
        var userNo = userNos[j];
        if (userNo) {
            listNos.push({userNo: userNo});
        }
    }
    if (obj.copyUserNames) {
        $('#carbonCopyJob').data('user', listNos);
        $('#carbonCopyJob').val(obj.copyUserNames);
    }
    /*$('#carbonCopyPerson').data('user', listNos);
    $('#carbonCopyPerson').val(obj.copyUserNames);*/
    var levelContent = $('#levelContent').html('');
    for (var k = 0, length = nodes.length; k < length; k++) {
        var item = nodes[k];
        var count = k + 1;
        var dom = $('<div style="margin-left: 113px;margin-top: 10px;" class="item-level">\
                     <div class="approval-input">\
                      <span>第' + count + '级审批</span>\
                      <input type="text" disabled>\
                     </div>\
                     <div class="approval-menu">\
                      <span class="select" data-type="employee">选择人员</span>\
                      <span class="float-left select" data-type="job">选择职务</span>\
                     </div>\
                     <span class="select" data-type="delete" style="cursor:pointer;color:#333;">删除</span>\
                    </div>');
        if (item.nodeType === 2) {
            dom.find('input').data('user', {id: item.apprProjPosId});
        } else {
            dom.find('input').data('user', {userNo: item.apprUserNo});
        }
        var name = item.apprProjPosName || item.apprUserName;
        dom.find('input').val(name);
        dom.appendTo(levelContent);
        initEvent.initAddLevelEvent(dom);
    }
};


exports.renderNewApplyProcessSetting = function (list) {
    list = list || [];
    var parents = $('#processName').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.data('item', item);
        dom.val(item.id);
        dom.text(item.tmplName);
        dom.appendTo(parents);
    }
    initEvent.initNewApplyProcessSettingEvent(parents);
};

exports.renderProcessSettingAndNewApply = function (obj, nodes) {
    $('[name=remark]').text(obj.remark);
    var postLength = obj.copyProjPosNames + obj.copyUserNames;
    postLength = postLength.substr(0, postLength.length - 1);
    var postList = postLength.split(';');
    $('[name=copyUserNames]').text(postList.join('、'));
    nodes = nodes || [];
    var list = [];
    for (var i = 0, length = nodes.length; i < length; i++) {
        var item = nodes[i];
        var name = item.apprProjPosName || item.apprUserName;
        list.push(name);
    }
    $('[name=copyProjPosNames]').text(list.join('->'));
};

exports.renderApprovalProjectDepartmentTable = function (list) {
    list = list || [];
    var parents = $('#projectName').find('select').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.projDeptName);
        dom.val(item.id);
        dom.appendTo(parents);
    }
};

exports.renderProjectSelect = function (list) {
    list = list || [];
    var parents = $('#projId').html('');
    $('<option value="a">全部项目</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        if (item.projectName.length > 13) {
            item.projectName = item.projectName.slice(0, 13) + '...';
        }
        dom.text(item.projectName);
        dom.val(item.projId);
        dom.appendTo(parents);
    }
};

exports.renderMyApplyTable = function (list) {
    // console.log(list);
    list = list || [];
    if (list.length > 0) {
        $('#noInfoMyApplyTable_main').show();
        $('[name="noInfoMyApplyTable_page"]').show();
        $('#noInfoMyApplyTable').hide();
    } else {
        $('#noInfoMyApplyTable_main').hide();
        $('[name="noInfoMyApplyTable_page"]').hide();
        $('#noInfoMyApplyTable').show();
    }
    var parents = $('.my-apply-list').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var apprName = '审批人:';
        var apprStatusClass = '';
        var apprStatusName = '';
        if (item.apprStatus === 1) {
            apprName = '当前审批人:';
            apprStatusClass = 'approvaling';
            apprStatusName = "审批中";
        }
        if (item.apprStatus === 2) {
            apprName = '审批人:';
            apprStatusClass = 'agree';
            apprStatusName = '同意'
        }
        if (item.apprStatus === 3) {
            apprName = '审批人:';
            apprStatusClass = 'no-agree';
            apprStatusName = '不同意'
        }
        var applyName = item.projectName ? item.tmplName + " - " + item.projectName : item.tmplName;
        var dom = $('<div class="apply-item clearfix">\
      <div class="fl apply-status ' + apprStatusClass + '">' + apprStatusName + '</div>\
      <div class="fl apply-info">\
      <div class="apply-title clearfix">\
      <div class="apply-name fl">' + applyName + '</div>\
       <div class="approval-people fr">\
        <label>' + apprName + '</label>\
        <span>' + item.nextApprUserName + '</span>\
       </div>\
      </div>\
      <div class="apply-contents clearfix">\
       <div class="apply-content fl">' + item.applyContent + '</div>\
       <div class="apply-time fr">\
        <label>申请时间:</label>\
        <span>' + moment(item.applyTime).format('YYYY/MM/DD HH:mm:ss') + '</span>\
       </div>\
      </div>\
      </div>\
     </div>');
        dom.data('item', {id: item.id, tmplId: item.tmplId, level: item.nextNodeLevel});
        dom.appendTo(parents);
    }
    initEvent.initMyApplyTableEvent(parents);
};

/**
 *  <div class="apply-bh">
 <label>编号:</label>
 <span></span>
 </div>
 * @param list
 */
exports.renderMyApprovalTable = function (list, page) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoMyApprovalTable_main').show();
        $('[name="noInfoMyApprovalTable_page"]').show();
        $('#noInfoMyApprovalTable').hide();
    } else {
        $('#noInfoMyApprovalTable_main').hide();
        $('[name="noInfoMyApprovalTable_page"]').hide();
        $('#noInfoMyApprovalTable').show();
    }
    var parents = $('.my-apply-list').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var apprStatusClass = '';
        var apprStatusName = item.applyUserName;
        var apprColor = '';
        if (item.apprStatus === 1) {
            apprStatusClass = 'border-4cb951';
            // apprStatusName = item.applyUserName;
            apprColor = 'color-4cb951';
        }
        if (item.apprStatus === 2) {
            apprStatusClass = 'border-41bfb8';
            // apprStatusName = '同意';
            apprColor = 'color-4db992';
        }
        if (item.apprStatus === 3) {
            apprStatusClass = 'border-c89421';
            // apprStatusName = '不同意';
            apprColor = 'color-c89421';
        }
        if (item.apprStatus === 4) {
            apprStatusClass = 'border-239bef';
            // apprStatusName = '未处理';
            apprColor = 'color-239bef';
        }
        var applyName = item.projectName ? item.tmplName + " - " + item.projectName : item.tmplName;
        var dom = $('<div class="apply-item clearfix">\
      <div class="apply-status fl ' + apprStatusClass + '">' + apprStatusName + '</div>\
      <div class="apply-info fl">\
      <div class="apply-title clearfix">\
      <div class="apply-name fl">' + applyName + '</div>\
      <div class="approval-people fr">\
       <label>审批:</label>\
       <span class="' + apprColor + '">' + parseApprovalType(item.apprStatus) + '</span>\
      </div>\
  </div>\
    <div class="apply-contents clearfix">\
      <div class="apply-content fl">' + item.applyContent + '</div>\
      <div class="apply-time fr">\
        <label>申请时间:</label>\
        <span>' + moment(item.applyTime).format('YYYY/MM/DD HH:mm:ss') + '</span>\
      </div>\
    </div>\
  </div>\
  </div>');
        dom.data('item', {id: item.id, tmplId: item.tmplId, level: item.nextNodeLevel});
        dom.appendTo(parents);
    }
    initEvent.initMyApplyTableEvent(parents, page);
};

function parseApprovalType(type) {
    type = parseInt(type);
    switch (type) {
        case 0:
            return '未审批';
        case 1:
            return '审批中';
        case 2:
            return '同意';
        case 3:
            return '不同意';
        case 4:
            return '未处理';
    }
}

function parseApprovalTypeState(type) {
    type = parseInt(type);
    switch (type) {
        case 0:
            return '审批中';
        case 1:
            return '同意';
        case 2:
            return '不同意';
        case 3:
            return '未审批';
        case 4:
            return '未处理';
    }
}

exports.renderApprovalCopyTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoMakeCopyForMe_main').show();
        $('[name=noInfoMakeCopyForMe_page]').show();
        $('#noInfoMakeCopyForMe').hide();
    } else {
        $('#noInfoMakeCopyForMe_main').hide();
        $('[name=noInfoMakeCopyForMe_page]').hide();
        $('#noInfoMakeCopyForMe').show();
    }
    var parents = $('.my-apply-list').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var apprStatusClass = '';
        var apprColor = '';
        if (item.apprStatus === 1) {
            apprStatusClass = 'border-4cb951';
            apprColor = 'color-4cb951';
        }
        if (item.apprStatus === 2) {
            apprStatusClass = 'border-4db992';
            apprColor = 'color-4db992';
        }
        if (item.apprStatus === 3) {
            apprStatusClass = 'border-c89421';
            apprColor = 'color-c89421';
        }
        var dom = $('<div class="apply-item clearfix">\
      <div class="apply-status fl ' + apprStatusClass + '">' + item.applyUserName + '</div>\
      <div class="apply-info fl">\
      <div class="apply-title clearfix">\
      <div class="apply-name fl">' + item.applyUserName + '-' + item.tmplTypeName + '-' + item.tmplName + '</div>\
      <div class="approval-people fr">\
       <label>审批</label>\
       <span class="' + apprColor + '">' + parseApprovalType(item.apprStatus) + '</span>\
      </div>\
  </div>\
    <div class="apply-contents clearfix">\
      <div class="apply-content fl">' + item.applyContent + '</div>\
      <div class="apply-time fr">\
        <label>申请时间:</label>\
        <span>' + moment(item.applyTime).format('YYYY/MM/DD HH:mm:ss') + '</span>\
      </div>\
    </div>\
  </div>\
  </div>');
        dom.data('item', {id: item.id, tmplId: item.tmplId, level: item.nextNodeLevel});
        dom.appendTo(parents);
    }
    initEvent.initMyApplyTableEvent(parents);
};


exports.renderApplySelect = function (list) {
    list = list || [];
    var parents = $('#applyUserNo').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.userName);
        dom.val(item.userNo);
        dom.appendTo(parents);
    }
};

exports.renderApprovalManagerTable = function (list, page) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoApprovalManager_main').show();
        $('[name="noInfoApprovalManager_page"]').show();
        $('#noInfoApprovalManager').hide();
    } else {
        $('#noInfoApprovalManager_main').hide();
        $('[name="noInfoApprovalManager_page"]').hide();
        $('#noInfoApprovalManager').show();
    }
    var parents = $('.my-apply-list').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var apprStatusClass = '';
        var apprStatusName = '';
        var apprColor = '';
        var bdColor = '';
        var sdColor = '';
        if (item.apprStatus === 1) {
            apprStatusClass = 'border-4cb951';
            apprStatusName = '审批中';
            apprColor = 'color-4cb951';
            bdColor = '#4db851';
            sdColor = '#b5c6bc';
        }
        if (item.apprStatus === 2) {
            apprStatusClass = 'border-4db992';
            apprStatusName = '同意';
            apprColor = 'color-4db992';
            bdColor = '#4db892';
            sdColor = '#b5c6b4';
        }
        if (item.apprStatus === 3) {
            apprStatusClass = 'border-c89421';
            apprStatusName = '不同意';
            apprColor = 'color-c89421';
            bdColor = '#969940';
            sdColor = '#c6c6b5';
        }
        var firstItem = '';
        if(i === 0){
            firstItem = '<div style="margin-top: 0px" class="apply-item clearfix">';
        } else {
            firstItem = '<div class="apply-item clearfix">';
        }
        var dom = $(''+firstItem+'\
      <div class="apply-status fl" style="color:' + bdColor + ';border-color: ' + bdColor + ';box-shadow: 0 0 3px 1px ' + sdColor + '">' + item.applyUserName + '</div>\
      <div class="apply-info fl">\
      <div class="apply-title clearfix">\
      <div class="apply-name fl">' + item.applyUserName + '-' + item.tmplTypeName + '-' + item.tmplName + '</div>\
      <div class="approval-people fr">\
      <label>' + "审批状态 :" + '</label>\
      <span class="' + apprColor + '">' + apprStatusName + '</span>\
      </div>\
      </div>\
      <div class="apply-contents clearfix">\
      <div class="apply-content fl">' + item.applyContent + '</div>\
    <div class="apply-time fr">\
      <label>申请时间:</label>\
      <span>' + moment(item.applyTime).format('YYYY/MM/DD HH:mm:ss') + '</span>\
    </div>\
  </div>\
  </div>\
    <!--<a class="delete-manager">删除</a>\-->\
  </div>');
        dom.data('item', {id: item.id, tmplId: item.tmplId, level: item.nextNodeLevel});
        dom.appendTo(parents);
    }
    initEvent.initApprovalManagerTableEvent(parents, page);
};

exports.renderApplyContentAndProcess = function (obj) {
    var userNo = JSON.parse(localStorage.getItem('user')).employee.userNo;
    if (userNo !== obj.nextApprUserNo) {//分级隐藏同意与不同意按钮
        $('[data-type].confirmAgree').parent().hide();
    } else {
        if (obj.apprStatus === 1) {
            $('[data-type].confirmAgree').parent().show();
        } else {
            $('[data-type].confirmAgree').parent().hide();
        }
    }

    $('[name=apprStatus]').text(parseApprovalType(obj.apprStatus));
    $('[name=applyUserName]').text(obj.applyUserName);
    $('[name=applyTime]').text(moment(obj.applyTime).format('YYYY/MM/DD'));
    $('[name=applyContent]').text(obj.applyContent);
    // $('[name=projectName]').text(obj.projectName);
    $('[name=projectName]').text(obj.projectName ? obj.tmplName + ' - ' + obj.projectName : obj.tmplName);
    var attaches = obj.attaches || [];
    var parents = $('.attach-list').html('');
    var rank = 0;
    for (var i = 0, length = attaches.length; i < length; i++) {
        var attach = attaches[i];
        var yl = '';
        var urlList = [];
        if (attach.attachType === 'pdf' || attach.attachType === 'txt' || attach.attachType === 'PDF' || attach.attachType === 'TXT') {
            yl = '<a href=' + window.API_PATH + "/customer" + attach.attachUrl + ' target="_blank">预览</a>';
        } else if (attach.attachType === 'png' || attach.attachType === 'jpg' || attach.attachType === 'PNG' || attach.attachType === 'JPG') {
            yl = '<a class="reviewPic" href="javascript:;">预览</a>';
        }
        var dom = $("<div class='attach-item'>\
                <div class='icon-file " + attach.attachType + "'></div>\
                <div class='detail'>\
                <div class='filename'>" + attach.attachName + "</div>\
                <div class='remove'>\
                <a href=" + window.API_PATH + '/customer/attach/download?filePath=' + attach.attachUrl + ' self' + ">下载</a>\
                 " + yl + "\
                </div>\
                </div>\
                </div>");
        if (attach.attachType === 'png' || attach.attachType === 'jpg' || attach.attachType === 'PNG' || attach.attachType === 'JPG') {
            dom.find('.reviewPic').data('url', attach.attachUrl);
            dom.find('.reviewPic').data('rank', rank++);
        }
        dom.appendTo(parents);
    }
    parents.find('.reviewPic').click(function (e) {
        urlList.length = 0;
        parents.find('.reviewPic').each(function (index, ele) {
            urlList.push($(ele).data('url'));
        })
        var review = new ReviewImage(urlList, '', $(this).data('rank'));
        review.show();
    })

    var histories = obj.histories || [];
    var projectShow = $('#projectShow');
    if (histories.length > 0) {
        if (projectShow.is(':hidden')) {
            projectShow.show();
        }
    } else {
        if (!projectShow.is(':hidden')) {
            projectShow.hide();
        }
    }
    var $parents = $('.approval-process').html('');
    for (var j = 0, $length = histories.length; j < $length; j++) {
        var history = histories[j];
        var statysClass = '';
        if (history.apprStatus === 1) {
            statysClass = 'agree';
            // $($parents[0]).parent().next().hide();//同意的申请隐藏按钮
        } else if (history.apprStatus === 2) {
            statysClass = 'un-agree';
            // $($parents[0]).parent().next().hide();//不同意的申请隐藏按钮
        } else {
            statysClass = 'over';
            // $($parents[0]).parent().next().show();//审批中的申请显示按钮
        }
        var img = history.headImageUrl ? '<img src=' + window.API_PATH + '/customer/' + history.headImageUrl + ' style="width:100%;height:100%;border-radius: 50%;">' : '<span class="images"></span>';
        var apprTime = history.apprTime ? moment(history.apprTime).format('YYYY/MM/DD HH:mm:ss') : '';
        var apprRemark = history.apprRemark ? history.apprRemark : '';
        var postName = history.postName || '无';
        var $dom = $('<div class="approval-process-content clearfix">\
      <i class="icon-approval-status ' + statysClass + '">\
      <i class="line"></i>\
      </i>\
      <div class="content-image fl">\
      ' + img + ' </div>\
      <div class="content-item fl">\
        <div class="user-name">' + history.apprUserName + '</div>\
        <div class="user-job">' + postName + '</div>\
      </div>\
      <div class="status fl">' + parseApprovalTypeState(history.apprStatus) + '</div>\
      <div class="desc fl">' + apprRemark + '</div>\
      <div class="time fl">' + apprTime + '</div>\
  </div>');
        $dom.appendTo($parents);
        if ($dom.find('.desc').height() > 35) {
            $dom.find('.desc').css('lineHeight', 1.5);
        }
    }
};

exports.renderApplyProcessDom = function (obj) {
    var nodes = obj.nodes || [];
    var temp = obj.temp || {};
    var list = [];
    for (var i = 0, length = nodes.length; i < length; i++) {
        var item = nodes[i];
        var name = item.apprUserName || item.apprProjPosName;
        list.push(name);
    }
    $('[name=apprUserName]').text(list.join(' -> '));
    $('[name=remark]').text(temp.remark);
};

/**
 * 绘制审批个数
 * @param data
 */
exports.renderApplyCount = function (data) {
    var applyName = '我的申请';
    if (data.apply > 0) {
        applyName = '我的申请(' + data.apply + ')';
    }
    var approvaName = '我的审批';
    if (data.approve > 0) {
        approvaName = '我的审批(' + data.approve + ')';
    }
    $('.myApproval').text(approvaName);
    $('.myApply').text(applyName);
};

exports.renderProcessSettingCheckDetail = function (obj) {
    var nodes = obj.nodes || [];
    var temp = obj.temp || {};
    $('[name=tmplName]').text(temp.tmplName);
    $('[name=remark]').text(temp.remark);
    $('[name=remark]').attr('title', temp.remark);
    if (temp.copyUserNames) {
        $('[name=copyUserNames]').text(temp.copyUserNames);
    } else {
        $('[name=copyUserNames]').text(temp.copyProjPosNames);
    }
    var _nodes = [];
    for (var i = 0, length = nodes.length; i < length; i++) {
        var count = i + 1;
        var apprUserName = nodes[i].nodeType === 2 ? 'apprProjPosName' : 'apprUserName';
        _nodes.push('第' + count + '级:' + nodes[i][apprUserName]);
    }
    $('[name=copyProjPosNames]').text(_nodes.join('、'));
};

exports.renderCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var temp = user.permission['approve:temp:*'];
    var approve = user.permission['approve:approve:*'];
    if (approve) {
        $('#approvalManager').show();
    } else {
        $('#approvalManager').hide();
    }
    if (temp) {
        $('#approvalType').show();
    } else {
        $('#approvalType').hide();
    }
};