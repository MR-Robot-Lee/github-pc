var initEvent = require('./initEvent');
var common = require('../../Common');

exports.renderProjectType = function renderProjectType(parents, list) {
    $('<option value="a">工程类型</option>').appendTo(parents);
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        if (item.projTypeName.length > 10) {
            item.projTypeName = item.projTypeName.slice(0, 9) + '...';
        }
        dom.text(item.projTypeName);
        dom.appendTo(parents);
    }
};


exports.renderProjectTable = function renderProjectTable(list, data, page) {
    data = data || {};
    list = list || [];
    var parents = $('#contractManager').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var attention = '';
        var type = '';
        var color = '';
        var check = '';
        if (item.isFocus === 1) {
            type = 'cancel';
            color = 'delete-hover fcxxx';
            attention = '取消关注';
        } else {
            type = 'attention';
            color = 'confirm-hover fcx';
            attention = '关注';
        }
        var dom = $('<tr style="cursor: pointer" class="trHeightLight-hover">\
                    <td style="padding-left: 20px;width: 60px">' + (1 + i) + '</td>\
                    <td>' + '<span class="pro-status ' + parseProjectStatusIcon(item.projState) + '"></span><span style="vertical-align: middle">' + item.projectName + '</span></td>\
                    <td>' + item.contractPrice + ' 元' + '</td>\
                    <td>' + item.chargeUserName + '</td>\
                    <td>' + parseProjectStatus(item.projState) + '</td>\
                    <td>\
                     <a data-type="' + type + '" class="' + color + '">' + attention + '</a>\
                     ' + check + '\
                    </td>\
                  </tr>');
        item.type = data.type;
        dom.data('item', item);
        dom.appendTo(parents);
    }
    if (list.length > 0) {
        $("#ProjectList_main").show();
        $("[name='ProjectList_page']").show();
        $("#noInfoProjectList").hide();
    } else {
        $("#ProjectList_main").hide();
        $("[name='ProjectList_page']").hide();
        $("#noInfoProjectList").show();
    }
    $(".spinner").hide();//隐藏加载动画
    initEvent.initAllProjectTableEvent(parents, page);
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

function parseProjectStatus(status) {
    status = parseInt(status);
    switch (status) {
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
        default:
            return '';
    }
}

/**
 * 绘制我的关注项目
 * @param list
 */
exports.renderMyAttentionSchedule = function (list, page) {
    list = list || [];
    if (list.length > 0) {
        $("#noInfoAttentionManager_main").show();
        $("[name='noInfoAttentionManager_page']").show();
        $("#noInfoAttentionManager").hide();
    } else {
        $("#noInfoAttentionManager_main").hide();
        $("[name='noInfoAttentionManager_page']").hide();
        $("#noInfoAttentionManager").show();
    }
    var parents = $('#attentionManager').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var projInfo = item.projInfo || {};//项目详情
        var projScheduleVO = item.projScheduleVO || {};//进度
        var projBudVO = item.projBudVO || {}; // 成本
        var attendVO = item.attendVO || {}; // 成本
        var projNoticeCountVO = item.projNoticeCountVO || {};//现场
        var budJudge = projBudVO.budJudge || '';
        var id = i + 1;

        var fileSize = projNoticeCountVO.projFileSize;
        fileSize = fileSize || 0;
        if (fileSize > 1024 * 1024 * 1024) {
            fileSize = parseInt(fileSize / 1024 / 1024 / 1024 * 100) / 100 + 'G';
        } else if (fileSize > 1024 * 1024) {
            fileSize = parseInt(fileSize / 1024 / 1024 * 100) / 100 + 'MB';
        } else if (fileSize > 1024) {
            fileSize = parseInt(fileSize / 1024 * 100) / 100 + 'KB';
        } else {
            fileSize = fileSize + 'B';
        }

        // var avgScore = projScoreVO.avgScore ? projScoreVO.avgScore : 0;
        // avgScore = (avgScore / 5 * 100).toFixed(0);
        var color = '#333';
        if (projScheduleVO.judgeType === 3) {
            color = 'red';
        }
        var dom = $('<tr style="background-color: #fff;">\
      <td>\
      <div class="attention-content">\
      <div class="attention-title ellipsis" style="border-bottom: 1px solid #ddd;font-size: 14px;padding: 0 20px;color:#333;">' + projInfo.projectName + '</div>\
      <div class="attention-list">\
      <div class="attention-item">\
      <label>价款:</label>\
    <span>' + projInfo.contractPrice + '</span>\
  </div>\
    <div class="attention-item">\
      <label>状态:</label>\
      <span>' + parseProjectStatus(projInfo.projState) + '</span>\
    </div>\
    <div>\
      <label>负责人:</label>\
      <span>' + projInfo.chargeName + '</span>\
    </div>\
  </div>\
    <div style="border-top: 1px solid #ddd" class="attention-handler">取消关注</div>\
  </div>\
  </td>\
    <td style="position: relative">\
      <div id="attentionCost' + id + '" style="width:220px;height: 220px;"></div>\
      <div class="attentionCostDesc" style="position: absolute;bottom: 30px;left: 65px;">\
    </td>\
    <td style="position: relative">\
      <div id="attentionSchedule' + id + '" style="width:220px;height: 220px;"></div>\
      <div class="attentionScheduleDesc" style="position: absolute;bottom: 10px;left: 65px;">\
      进度评估 : <span style="color: ' + color + ';">' + parseJudgeType(projScheduleVO.judgeType) + '</span>\
      </div>\
    </td >\
    <td style="position: relative;text-align: center;">\
      <div id="attentionLabor' + id + '" style="width:220px;height: 220px;"></div>\
      <div class="attentionLaborDesc"style="position: absolute;bottom: 30px;left: 65px;">\
      </div>\
    </td>\
    <td style="position: relative;text-align:center;">\
      <div id="attentionScene' + id + '" style="width:220px;height: 220px;"></div>\
      <div class="attentionSceneDesc" style="position: absolute;bottom: 30px;left: 65px;">\
     </div>\
           <div style="position: absolute;top: 39px;left:146px;font-size: 12px;color: #666;">文档 : ' + fileSize + '</div>\
            </div>\
    </td>\
  </tr>');
        dom.data('item', projInfo);
        dom.appendTo(parents);
        initEvent.initEventMyAttentionChart(id, parents, getCostCoordinate(projBudVO.records), projScheduleVO, projNoticeCountVO, attendVO, page);
    }
};

function parseJudgeType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '正常';
        case 2:
            return '滞后';
        case 3:
            return '严重滞后';
        case 4:
            return '提前';
        default:
            return '';
    }
}

function getCostCoordinate(list) {
    list = list || [];
    var costMoney = [];
    var actRecMoney = [];
    var recordTime = [];

    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        costMoney.push(item.costMoney);
        recordTime.push(moment(item.addTime).format("YYYY/MM/DD"));
        actRecMoney.push(item.actRecMoney);
    }
    return {
        costMoney: costMoney,
        actRecMoney: actRecMoney,
        recordTime: recordTime
    }
}

function getScoreV(list) {
    list = list || [];
    var beginTime = [];
    var projScore = [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        beginTime.push(item.beginTime);
        projScore.push(item.projScore);
    }
    return {beginTime: beginTime, projScore: projScore}
}

/*
* 智能硬件列表
* */
exports.renderIntelligentHardwareTable = function (list, page) {
    initEvent.initAdtMachineTableEvent(page);
    list = list || [];
    if (list.length > 0) {
        $('#noInfoAttentionManager_main').show();
        $('#noInfoAttentionManager').hide();
    } else {
        $('#noInfoAttentionManager_main').hide();
        $('#noInfoAttentionManager').show();
    }
    var parents = $('#adtMachineTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var projectName = item.projectName || '';
        var dom = $('<tr>' +
            '<td style="padding-left: 20px;">' + item.kaoqinName + '</td>' +
            '<td>' + projectName + '</td>' +
            '<td>' + status(item.status) + '</td>' +
            '<td>' + item.workerCount + '</td>' +
            '<td><a href="#" class="confirm-hover" data-type="check">查看</a></td>' +
            '<td>' +
            '<span><a href="#" class="confirm-hover" data-type="setting">设置</a></span>' +
            '<span style="margin: 0 5px;">|</span>' +
            '<span><a href="#" class="confirm-hover" data-type="info">设备信息</a></span>' +
            '<span style="margin: 0 5px;">|</span>' +
            '<span><a href="#" class="delete-hover" data-type="delete">删除</a></span>' +
            '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initAdtMachineTableEvent(page);

    function status(data) {
        switch (data) {
            case 1:
                return '在线';
            case 2:
                return '离线';
        }
    }
}
/*
* 考勤人员 查看
* */
exports.renderAtdGroupModal = function (list, modal) {
    list = list || [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr>' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.teamName + '</td>' +
            '<td class="border">' + item.workerCount + '</td>' +
            '</tr>');
        dom.appendTo(modal.$body.find('#checkAtdMachineTable'));
    }
}
/*
* 设备信息
* @param {obj} data 设备信息详细数据
* @param {obj} modal 设备信息弹出框
* */
exports.renderMachineInfoModal = function (data, modal) {
    data = data || {};
    modal.$body.find('[name=kaoqinName]').html(data.kaoqinName);
    modal.$body.find('[name=serialNo]').html(data.serialNo);
    modal.$body.find('[name=fingerSize]').html(data.fingerSize);
    modal.$body.find('[name=faceSize]').html(data.faceSize);
    modal.$body.find('[name=]').html(data);
    modal.$body.find('[name=machineNo]').html(data.machineNo);
    modal.$body.find('[name=machineVersion]').html(data.machineVersion);
    modal.$body.find('[name=addTime]').html(moment(data.addTime).format("YYYY/MM/DD"));
}
/*
* 考勤地点
* @param {obj} data 详细数据
* @param {obj} modal 考勤机设置 弹出框
* @param {obj} item 考勤机数据
* */
exports.renderAtdLocationModal = function (data, modal, item) {
    data = data || {};
    var parent = modal.$body.find('.check-location');
    for (var i = 0; i < data.length; i++) {
        var _item = data[i];
        var dom = $('<option value=' + _item.projId + '>' + _item.projectName + '</option>');
        dom.data('item', _item);
        dom.appendTo(parent);
    }
    modal.$body.find('.check-location').val(item.projId);
}
/*
* 查询班组
* @param {obj} data 详细数据
* @param {obj} modal 选择班组 弹出框
* @param {obj} _modal 考勤机设置 弹出框
* @param {Array} list 已选班组
* */
exports.renderAllEntpTeamsModal = function (data, modal, _modal, list) {
    data = data || [];
    var parent = modal.$body.find('.group_left ul');
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var dom = $('<li>' +
            '<span class="select id-125"></span>' +
            '<span class="group-name ellipsis">' + item.teamName + '</span>' +
            '</li>')
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initSelectGroupEvent(parent, modal, _modal, list);
}
/*
* 查看考勤班组
* @param {Array} data 已选考勤班组
* @param {obj} modal 考勤机设置 弹出框
* */
exports.renderMachineTeamListModal = function (list, modal) {
    var list = list || [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<div>' + item.teamName + '<a href="#" class="delete-hover">删除</a>' + '</div>');
        dom.data('item', item);
        dom.appendTo(modal.$body.find('.group-list'));
        dom.find('a').click(function (e) {
            common.stopPropagation(e);
            $(this).parent('div').remove();
        })
    }
    initEvent.initAddGroupEvent(modal);
}