var common = require('../../Common');
var Modal = require('../../../components/Model');
var setAttendanceModal = require('./modal/setAttendanceModal.ejs');
var checkLocationMachineModal = require('./modal/checkLocationMachineModal.ejs');
var laborManagerApi = require('./laborManagerApi');
var initLaborManagerFunc = require('./initLaborManagerFunc');
var checkRecordModal = require('./modal/checkRecordModal.ejs');
var checkWorkerInfoModal = require('./modal/checkWorkerInfoModal.ejs');
var Page = require('../../../components/Page');
var renderLaborManagerTable = require('./renderLaborManagerTable');

/*
* 人力动态
* */
exports.initLaborEvent = function () {

}

/*
* 考勤管理
* */
exports.initAttendanceEvent = function (data) {
    $('#attendanceSetting').off('click');
    $('#attendanceSetting').on('click', function (e) {
        common.stopPropagation(e);
        var setAtdModal = Modal('出勤统计设置', setAttendanceModal());
        setAtdModal.showClose();
        setAtdModal.show();
        if (data.kaoqinType) {
            setAtdModal.$body.find('input[name=check-statics2]').eq(data.kaoqinType - 1).prop('checked', true);
        } else {
            setAtdModal.$body.find('input[name=check-statics2]').eq(0).prop('checked', true);
        }

        // 初始化 打卡有效时段
        _effectiveTime(setAtdModal.$body, data);
        if (data.kaoqinType === 1) {// 打卡统计
            setAtdModal.$body.find('.punch-card').hide();
        } else if (data.kaoqinType === 2) {// 有效打卡统计
            setAtdModal.$body.find('.punch-card').show();
        }

        // 选择打卡方式
        setAtdModal.$body.find('input[name=check-statics2]').change(function () {
            if ($('.effective-check').prop('checked')) {
                $('.punch-card').show();
            } else {
                $('.punch-card').hide();
            }
        })

        //选择打卡时段
        laydate.render({
            elem: '.punch-card .start-time',
            type: 'time',
            format: 'HH:mm',
            theme: '#00A680'
        });
        laydate.render({
            elem: '.punch-card .end-time',
            type: 'time',
            format: 'HH:mm',
            theme: '#00A680'
        });
        $('.punch-card .start-time').click(function (e) {
            common.stopPropagation(e);
        })
        $('.punch-card .end-time').click(function (e) {
            common.stopPropagation(e);
        })

        // 初始化 有效时段中的添加与删除
        setAtdModal.$body.find('.punch-card a').click(function (e) {
            common.stopPropagation(e);
            if ($(this).data('type') === 'add') {
                $(this).parents('.clearfix').next().show();
                $(this).parents('.oparate').hide();
            } else if ($(this).data('type') === 'del') {
                $(this).parents('.clearfix').hide();
                $(this).parents('.clearfix').prev().find('.oparate').show();
            }
        })

        // 确定 出勤统计设置
        setAtdModal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var _data = {};
            if (setAtdModal.$body.find('.effective-check').prop('checked')) {
                _data.kaoqinType = 2;
                // 考勤一次
                if (setAtdModal.$body.find('.first-time').css('display') === 'none') {
                    _data.firstStartTime = '';
                    _data.firstEndTime = '';
                } else {
                    _data.firstStartTime = setAtdModal.$body.find('.first-start-time').html();
                    _data.firstEndTime = setAtdModal.$body.find('.first-end-time').html();
                    if (!_data.firstStartTime || !_data.firstEndTime) {
                        return alert('请选择有效时段');
                    }
                }
                // 考勤二次
                if (setAtdModal.$body.find('.second-time').css('display') === 'none') {
                    _data.secondStartTime = '';
                    _data.secondEndTime = '';
                } else {
                    _data.secondStartTime = setAtdModal.$body.find('.second-start-time').html();
                    _data.secondEndTime = setAtdModal.$body.find('.second-end-time').html();
                    if (!_data.secondStartTime || !_data.secondEndTime) {
                        return alert('请选择有效时段');
                    }
                }
                // 考勤三次
                if (setAtdModal.$body.find('.third-time').css('display') === 'none') {
                    _data.thirdStartTime = '';
                    _data.thirdEndTime = '';
                } else {
                    _data.thirdStartTime = setAtdModal.$body.find('.third-start-time').html();
                    _data.thirdEndTime = setAtdModal.$body.find('.third-end-time').html();
                    if (!_data.thirdStartTime || !_data.thirdEndTime) {
                        return alert('请选择有效时段');
                    }
                }
                // 考勤四次
                if (setAtdModal.$body.find('.fourth-time').css('display') === 'none') {
                    _data.fourthStartTime = '';
                    _data.fourthEndTime = '';
                } else {
                    _data.fourthStartTime = setAtdModal.$body.find('.fourth-start-time').html();
                    _data.fourthEndTime = setAtdModal.$body.find('.fourth-end-time').html();
                    if (!_data.fourthStartTime || !_data.fourthEndTime) {
                        return alert('请选择有效时段');
                    }
                }
            } else {
                _data.kaoqinType = 1;
                _data.firstStartTime = '';// 考勤一次
                _data.firstEndTime = '';
                _data.secondStartTime = '';// 考勤二次
                _data.secondEndTime = '';
                _data.thirdStartTime = '';// 考勤三次
                _data.thirdEndTime = '';
                _data.fourthStartTime = '';// 考勤四次
                _data.fourthEndTime = '';
            }
            laborManagerApi.getAddKaoqinSet(_data).then(function (res) {
                if (res.code === 1) {
                    setAtdModal.$body.find('.span-btn-bc').click();
                    initLaborManagerFunc.getAtdSettingFunc();
                }
            });
        })

        // 点击空白隐藏时间列表
        $('.Model').click(function (e) {
            common.stopPropagation(e);
            $('.layui-laydate').remove();
        })
        $('.Model').find('.icon-close').click(function () {
            $('.layui-laydate').remove();
        })
        $('.Model').find('.span-btn').click(function () {
            $('.layui-laydate').remove();
        })
    });
}

exports.effectiveTime = _effectiveTime;

function _effectiveTime(parent, data) {
    // 考勤一次
    parent.find('.first-time').show();
    parent.find('.first-start-time').html(data.firstStartTime);
    parent.find('.first-end-time').html(data.firstEndTime);
    // 考勤二次
    if (data.secondStartTime) {
        parent.find('.second-time').show();
        parent.find('.second-start-time').html(data.secondStartTime);
        parent.find('.second-end-time').html(data.secondEndTime);
    } else {
        parent.find('.second-time').hide();
        parent.find('.second-start-time').html('');
        parent.find('.second-end-time').html('');
    }
    // 考勤三次
    if (data.thirdStartTime) {
        parent.find('.third-time').show();
        parent.find('.third-start-time').html(data.thirdStartTime);
        parent.find('.third-end-time').html(data.thirdEndTime);
    } else {
        parent.find('.third-time').hide();
        parent.find('.third-start-time').html('');
        parent.find('.third-end-time').html('');
    }
    // 考勤四次
    if (data.fourthStartTime) {
        parent.find('.fourth-time').show();
        parent.find('.fourth-start-time').html(data.thirdStartTime);
        parent.find('.fourth-end-time').html(data.thirdEndTime);
    } else {
        parent.find('.fourth-time').hide();
        parent.find('.fourth-start-time').html('');
        parent.find('.fourth-end-time').html('');
    }
}

/*
* 人员管理
* */
exports.initEmployeeManagerEvent = function (data, page) {
    $('.search').click(function (e) {
        common.stopPropagation(e);
        var entpId = $('.entpSelect').val();
        var teamId = $('.teamSelect').val();
        var keywords = $('.keywords').val().trim();
        data.entpId = entpId;
        data.teamId = teamId;
        if (keywords) {
            data.keywords = keywords;
        } else {
            delete data.keywords;
        }
        initLaborManagerFunc.getEmployeeManagerFunc(data, page);
    })
}

/*
* 人员管理 列表中的事件
* */
exports.initEmpManagerTableEvent = function () {
    $('#empManagerTable').find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'attend') {
            var recordModal = Modal('查看考勤记录', checkRecordModal());
            recordModal.showClose();
            recordModal.show();
            recordModal.$body.find('.worker-name').html(item.workerName);
            recordModal.$body.data('item', item);
            recordModal.$body.find('.during').jeDate({
                format: 'YYYY/MM'
            });
            var timestamp = Date.parse(new Date()); // 获取当前时间戳
            var currentDate = moment(timestamp).format('YYYY/MM'); // 获取当前年月
            recordModal.$body.find('.during').html(currentDate)
            recordModal.$body.find('.search').click(function (e) {
                common.stopPropagation(e);
                var startTime = recordModal.$body.find('.during').html();
                if (startTime) {
                    var year = startTime.split('/')[0] / 1;
                    var month = startTime.split('/')[1] / 1;
                    var endTime = '';
                    if (month < 10) {
                        month = '0' + (month + 1);
                    } else if (month === 12) {
                        year += 1;
                        month = 1;
                    }
                    startTime = startTime + '/01';
                    endTime = year + '/' + month + '/01';
                    var start = $.timeStampDate(startTime) * 1000;
                    var end = $.timeStampDate(endTime) * 1000;
                    var data = {};
                    data.startTime = start;
                    data.endTime = end;
                    initLaborManagerFunc.getWokererKaoqinAttendFunc(recordModal, data);
                } else {
                    return alert('请选择查询月份');
                }
            })
            recordModal.$body.find('.search').click();
        } else if (type === 'info') {
            $('.check-worker-info').remove();
            $(this).parents('td').css('position', 'relative');
            $(this).parents('td').append(checkWorkerInfoModal());
            initLaborManagerFunc.getWorkerInfoFunc(item);
        }
    })
}

/*
* 考勤管理 本地设备 查看
* */
exports.initLocationMachineTableEvent = function () {
    $('#localDeveicesTable').find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var machineId = item.machineId;
        var locMacModal = Modal('查看', checkLocationMachineModal());
        locMacModal.showClose();
        locMacModal.show();
        initLaborManagerFunc.getLocMacFunc(locMacModal, machineId);
    })
}

/*
* 考勤管理 同步供应商 同步状态切换
* */
exports.initSyncEntpStatusEvent = function () {
    $('#syncSupplierTable').find('a').click(function (e) {
        common.stopPropagation(e);

    })
}

/*
* 考勤管理 查看考勤记录 悬浮框事件
* */
exports.initRecordHoverEvent = function (parent) {
    var desc;
    parent.find('tr').on('mouseenter', function (e) {
        var item = $(this).data('item');
        var pageX = e.pageX;
        var pageY = e.pageY;
        desc = $('<div class="job-description">' +
            '<div><label>供应商 : </label> ' + item.entpName + '</div>' +
            '<div><label>班组 : </label> ' + item.teamName + '</div>' +
            // '<div><label>工种 : </label> ' + item.jobName + '</div>' +
            '</div>');
        desc.css({'top': pageY - 80, 'left': pageX - parent.offset().left + 40});
        desc.appendTo($(this));
    });
    parent.find('tr').on('mousemove', function (e) {
        var pageX = e.pageX;
        var pageY = e.pageY;
        desc.css({'top': pageY - 80, 'left': pageX - parent.offset().left + 40});
    });
    parent.find('tr').on('mouseleave', function () {
        $('.job-description').remove();
    });
}

/*
* 人力动态 确定按钮初始化
* */
exports.initLaborStatusEvent = function () {
    $('#statusSearch').click(function () {
        initLaborManagerFunc.getLaborStatusChartFunc();
    });
    $('#structureSearch').click(function () {
        var current = $('.check-date').html();
        initLaborManagerFunc.getLaborStructureChartFunc(current);
        $('.labor-structure-table').find('.team-name').html('');
        $('.labor-structure-table').find('.attend-count').html('');
        $('.labor-structure-table').find('.attend-per').html('');
    });
    $(".check-date").jeDate({
        range: " ~ ",
        multiPane: false,
        format: 'YYYY/MM/DD'
    });
    var now = parseInt(Date.parse(new Date()) / 1000);
    now = $.timeStampDate(now, 'YYYY-MM-DD');
    $('.labor-structure-table .current-time').html(now);
}

exports.initCheckTeamEvent = function (parent) {
    parent.change(function () {
        var data = {};
        data.entpId = parent.val();
        laborManagerApi.getAllEntpTeams(data).then(function (res) {
            if (res.code === 1) {
                var list = res.data || [];
                renderLaborManagerTable.allTeamList(list);
            }
        });
    })
}