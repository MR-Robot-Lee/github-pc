var initEvent = require('./initEvent');
var UploadAttach = require('../../../components/UploadAttach');
var common = require('../../Common');

/*
* 考勤管理 本地设备表格
* */
exports.renderLocalDevicesTable = function (list) {
    list = list || [];
    var parent = $('#localDeveicesTable').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var status = item.status === 1 ? '考勤中' : '离线';
        var dom = $('<tr>' +
            '<td>' + item.kaoqinName + '</td>' +
            '<td>' + item.serialNo + '</td>' +
            '<td>' + item.machineType + '</td>' +
            '<td>' + item.faceSize + '/' + item.fingerSize + '</td>' +
            '<td>' + status + '</td>' +
            '<td>' + item.workerCount + '</td>' +
            '<td><a href="#" class="confirm-hover">查看</a></td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initLocationMachineTableEvent();
}

/*
* 考勤管理 同步供应商表格
* */
exports.renderSyncSupplierTable = function (list) {
    list = list || [];
    var parent = $('#syncSupplierTable').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var enterpTeamVOS = '';
        for (var j = 0; j < item.enterpTeamVOS.length; j++) {
            enterpTeamVOS += item.enterpTeamVOS[j].teamName + '; ';
        }
        var dom = $('<tr>' +
            '<td>' + item.entpName + '</td>' +
            '<td>' + item.contactName + '</td>' +
            '<td>' + item.phone + '</td>' +
            '<td class="ellipsis">' + enterpTeamVOS + '</td>' +
            '<td><a href="#" class="confirm-hover">开启</a></td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent
}
/*
* 考勤管理 考勤设置
* */
exports.renderAtdSetting = function (data) {
    $('.atd-setting_content input[name=check-statics]').eq(data.kaoqinType - 1).prop('checked', true);
    if (data.kaoqinType === 1) {// 打卡统计
        $('.effective-time').hide();
    } else if (data.kaoqinType === 2) {// 有效打卡统计
        $('.effective-time').show();
        initEvent.effectiveTime($('.effective-time'), data);
    }
    initEvent.initAttendanceEvent(data);
}

/*
* 人员管理 表格
* */
exports.renderEmployeeManagerTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('[name=noInfoEmployeeManagerList_main]').show();
        $('[name=noInfoEmployeeManagerList_page]').show();
        $('#noInfoEmployeeManagerList').hide();
    } else {
        $('[name=noInfoEmployeeManagerList_main]').hide();
        $('[name=noInfoEmployeeManagerList_page]').hide();
        $('#noInfoEmployeeManagerList').show();
    }
    var parent = $('#empManagerTable').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var sex = item.sex === 1 ? '男' : '女';
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.workerName + '</td>' +
            '<td class="border">' + item.phone + '</td>' +
            '<td class="border">' + sex + '</td>' +
            '<td class="border">' + item.birthday + '</td>' +
            '<td class="border">' + item.provinceName + '-' + item.cityName + '-' + item.districtName + '</td>' +
            '<td class="border">' + item.jobName + '</td>' +
            '<td class="border ">' +
            '<a href="javascript:void(0)" class=" confirm-hover" data-type="attend">考勤记录</a>' +
            '<div class="icon-line" style="margin: 0 8px;"></div>' +
            '<a href="javascript:void(0)" class=" confirm-hover" data-type="info">个人信息</a>' +
            '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parent);
    }
    initEvent.initEmpManagerTableEvent();
}
/*
* 全部供应商
* */
exports.allEntpList = function (list) {
    list = list || [];
    var parent = $('.entpSelect').html('<option value="0">请选择供应商</option>');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<option value=' + item.entpId + '>' + item.entpName + '</option>');
        dom.appendTo(parent);
    }
    initEvent.initCheckTeamEvent(parent);
}
/*
* 全部班组
* */
exports.allTeamList = function (list) {
    list = list || [];
    var parent = $('.teamSelect').html('<option value="0">请选择班组</option>');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<option value=' + item.teamId + '>' + item.teamName + '</option>');
        dom.appendTo(parent);
    }
}

/*
* 人员管理 查看考勤记录
* */
exports.renderCheckRecordTable = function (list) {
    list = list || [];
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        var item = moment(list[i].attendTime).format("YYYY-MM-DD");
        var status ='';
        if (list[i].status === 2) {
            status = 'style="color: #009411"';
        }
        list[i].atdTime = '<span ' + status + '>' + moment(list[i].attendTime).format("YYYY-MM-DD HH:mm").split(' ')[1] + '&nbsp;&nbsp;</span>';
        //如果数组中没有数据，或者数组中的时间、供应商、班组、工种有任意一个不同，就插入到新数组最前位置
        if (arr.length === 0
            || moment(arr[0].attendTime).format("YYYY-MM-DD") !== item //打卡时间不同
            || arr[0].entpName !== list[i].entpName //供应商不同
            || arr[0].teamName !== list[i].teamName //班组不同
            || arr[0].jobName !== list[i].jobName) {//工种不同
            arr.unshift(list[i]);
        } else {
            arr[0].atdTime += list[i].atdTime;
        }
    }
    list = arr;
    var parent = $('#checkRecordTable').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="small trHeightLight-hover" style="position: relative;">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + moment(item.attendTime).format("YYYY-MM-DD") + '</td>' +
            // '<td class="border">' + item.entpName + '</td>' +
            // '<td class="border">' + item.teamName + '</td>' +
            // '<td class="border">' + jobName + '</td>' +
            '<td class="border">' + item.atdTime + '</td>' +
            '</tr>');
        dom.data('item',item);
        dom.appendTo(parent);
    }
    initEvent.initRecordHoverEvent(parent);
}

/*
* 人员管理 个人信息
* */
exports.renderWorkerInfoTable = function (item) {
    var parent = $('.check-worker-info');
    var status = item.status === 1 ? '考勤中' : '离线';
    var sex = item.sex === 1 ? '男' : '女';
    parent.find('.project-title').html(item.workerName);
    parent.find('span[name=entpName]').html(item.entpName);
    parent.find('span[name=teamName]').html(item.teamName);
    parent.find('span[name=status]').html(status);
    parent.find('span[name=phone]').html(item.phone);
    parent.find('span[name=sex]').html(sex);
    parent.find('span[name=birthday]').html(item.birthday);
    parent.find('span[name=region]').html(item.provinceName + item.provinceName + item.districtName);
    parent.find('span[name=idNo]').html(item.idNo);
    parent.find('span[name=jobName]').html(item.jobName);
    var attach = new UploadAttach($('[name=photograph]'));
    $('.UploadAttach').find('div').eq(0).hide();
    $('.UploadAttach').find('input').hide();
    if (item.attaches) {
        for (var i = 0, length = item.attaches.length; i < length; i++) {
            attach.TempAttach(item.attaches[i], 'appendAttach');
        }
    }
    parent.click(function (e) {
        common.stopPropagation(e);
    })
    parent.find('.icon-close').click(function () {
        $(this).parents('.check-worker-info').remove();
    })
}
/*
* 本地设备 查看
* @param {Obj} modal 查看弹出框
* @param {Array} list 考勤人员详细数据
* */
exports.renderLocMacTable = function (modal, list) {
    list = list || [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr class="small">' +
            '<td class="border">' + (i + 1) + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.teamName + '</td>' +
            '<td class="border">' + item.workerCount + '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(modal.$body.find('tbody'));
    }
}

/*
* 人力动态
* */
exports.renderLaborStatusTable = function (list, data) {
    list = list || [];
    var parent = $('.labor-status-table table').html('<tr>' +
        '<td>统计周期</td>' +
        '<td style="width: 120px;font-size: 12px" class="period">' + moment(data.startTime).format("YYYY/MM/DD") + ' 至' + '\n' + moment(data.endTime).format("YYYY/MM/DD") + '</td>' +
        '</tr>');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = $('<tr>' +
            '<td>' + item.teamName + '</td>' +
            '<td>' + item.attendCount + '</td>' +
            '</tr>');
        dom.appendTo(parent);
    }
}

/*
* 人力结构
* */
exports.renderLaborStructureTable = function (data, list) {
    data = data || {};
    list = list || [];
    var total = 0;
    var percent = 0;
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        total += item.attendCount;
    }
    percent = parseInt(data.attendCount / total * 10000) / 100 + '%';
    $('.labor-structure-table').find('.team-name').html(data.teamName);
    $('.labor-structure-table').find('.attend-count').html(data.attendCount);
    $('.labor-structure-table').find('.attend-per').html(percent);
}
