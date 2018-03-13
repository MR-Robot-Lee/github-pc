var common = require('../../Common');
var initProjectFunc = require('./initProjectFunc');
var renderProjectTable = require('./renderProjectTable');
var renderChart = require('./renderChart');
var Modal = require('../../../components/Model');
var addAtdMachineModal = require('../model/addAtdMachineModal.ejs');
var addAtdGroupModal = require('../model/addAtdGroupModal.ejs');
var machineInfoModal = require('../model/machineInfoModal.ejs');
var checkAtdMachineModal = require('../model/checkAtdMachineModal.ejs');
var setAtdMachineModal = require('../model/setAtdMachineModal.ejs');
var delAtdMachineModal = require('../model/delAtdMachineModal.ejs');
var projectApi = require('./projectApi');


exports.initAllProjectEvent = function (page) {
    var btnSearch = $('#btnSearch');
    if (btnSearch.length > 0 && !btnSearch.data('flag')) {
        btnSearch.click(function (e) {
            common.stopPropagation(e);
            var preTypeMain = $('#preTypeMain').val();
            var preState = $('#preState').val();
            var keywords = $('.keywords').val().trim();
            var data = {};
            if (preTypeMain && preTypeMain !== 'a') {
                data.projTypeId = preTypeMain;
            }
            if (preState && preState !== 'a') {
                data.projStatus = preState;
            }
            if (keywords) {
                data.keywords = keywords;
            }
            initProjectFunc.getAllProjectFunc(data, page);
        })
    }
};

exports.initAttentionProjectEvent = function (page) {
    var btnSearch = $('#btnSearch');
    if (btnSearch.length > 0 && !btnSearch.data('flag')) {
        btnSearch.click(function (e) {
            common.stopPropagation(e);
            var preTypeMain = $('#preTypeMain').val();
            var preState = $('#preState').val();
            var keywords = $('.keywords').val().trim();
            var data = {};
            if (preTypeMain && preTypeMain !== 'a') {
                data.projTypeId = preTypeMain;
            }
            if (preState && preState !== 'a') {
                data.projStatus = preState;
            }
            data.type = 2;
            if (keywords) {
                data.keywords = keywords;
            }
            initProjectFunc.getAllProjectFunc(data, page);
        })
    }
};


exports.initAllProjectTableEvent = function (parents, page) {
    parents.find('tr').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).find('a').data('type');
        var item = $(this).data('item');
        window.open('/project/detail/' + item.id + '?name=' + item.projectName);
    });

    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'cancel') {
            var that = this;
            projectApi.delAttentionProject(item.id).then(function (res) {
                if (res.code === 1) {
                    $(that).html('关注');
                    $(that).attr('class','confirm-hover fcx');
                    $(that).data('type','attention');
                }
            })
        } else if (type === 'attention') {
            var that = this;
            projectApi.postAttentionProject(item.id).then(function (res) {
                if (res.code === 1) {
                    $(that).html('取消关注');
                    $(that).attr('class','delete-hover fcxxx');
                    $(that).data('type','cancel');
                }
            })
        }
    });
    /* parents.find('tr').click(function (e) {
     common.stopPropagation(e);
     var item = $(this).data('item');
     if (item.isFocus === 1) {
     window.open('', '项目管理');
     }
     })*/
};

/**
 * 初始化chart
 * @param list
 * @param parents
 * @param attentionCost
 * @param projScheduleVO
 */
exports.initEventMyAttentionChart = function (id, parents, attentionCost, projScheduleVO, attentionScene, attendVO, page) {
    var data = ['attentionCost', 'attentionSchedule', 'attentionLabor', 'attentionScene'];
    for (var j = 0; j < data.length; j++) {
        if (data[j] === 'attentionCost') {
            renderChart.renderAttentionCost(data[j] + id, attentionCost);
        } else if (data[j] === 'attentionSchedule') {
            renderChart.renderAttentionSchedule(data[j] + id, projScheduleVO);
        } else if (data[j] === 'attentionLabor') {
            renderChart.renderAttentionLabor(data[j] + id, attendVO);
        } else if (data[j] === 'attentionScene') {
            renderChart.renderAttentionScene(data[j] + id, attentionScene);
        }
    }
    parents.find('.attention-handler').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        initProjectFunc.delAttentionProjectFunc({id: item.projId, type: 3}, page)
    });
};

/**
 * 初始化 智能硬件
 */
exports.initEventIntelligentHardware = function (page) {
    $('#addAtdMachine').click(function (e) {
        common.stopPropagation(e);
        var addAtdMacModal = Modal('新添考勤机', addAtdMachineModal());
        addAtdMacModal.showClose();
        addAtdMacModal.show();
        addAtdMacModal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var machineName = addAtdMacModal.$body.find('input[name=machineName]').val();
            var machineNum = addAtdMacModal.$body.find('input[name=machineNum]').val();
            if (!machineName) {
                return alert('请输入设备名称');
            }
            ;
            if (!machineNum) {
                return alert('请输入设备序列号');
            }
            var data = {};
            data.kaoqinName = machineName;
            data.serialNo = machineNum;
            initProjectFunc.postAtdMachineFunc(addAtdMacModal, data, page);
        });
    });
};

exports.initAdtMachineTableEvent = function (page) {
    $('#adtMachineTable').find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        var id = item.id;
        var machineId = item.machineId;
        if (type === 'check') {// 查看
            var addAtdMacModal = Modal('查看', checkAtdMachineModal());
            addAtdMacModal.showClose();
            addAtdMacModal.show();
            initProjectFunc.getAtdGroupFunc(addAtdMacModal, machineId);
        } else if (type === 'setting') {// 设置
            var setAtdMacModal = Modal('考勤机设置', setAtdMachineModal());
            setAtdMacModal.showClose();
            setAtdMacModal.show();
            setAtdMacModal.$body.find('.machine-name').val(item.kaoqinName);// 设备名称
            initProjectFunc.getProjectListFunc(setAtdMacModal, item);// 考勤地点
            initProjectFunc.getMachineTeamListFunc({machineId: machineId}, setAtdMacModal);// 查询考勤班组
            // 考勤机设置 确定
            setAtdMacModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var data = {};
                var list = [];
                var groupList = setAtdMacModal.$body.find('.group-list div');
                groupList.each(function () {
                    list.push($(this).data('item'));
                });
                data.entpTeamVOS = list;
                data.machineId = machineId;
                data.kaoqinName = setAtdMacModal.$body.find('.machine-name').val();
                data.projId = setAtdMacModal.$body.find('.check-location').val();
                if (data.projId === 'a') {
                    return alert('请选择考勤地点');
                }
                initProjectFunc.getAtdMachineSettingFunc(data, setAtdMacModal, page);
            });
        } else if (type === 'info') {// 设备信息
            var AtdMacInfoModal = Modal('设备信息', machineInfoModal());
            AtdMacInfoModal.showClose();
            AtdMacInfoModal.show();
            initProjectFunc.getAtdMachineInfoFunc(AtdMacInfoModal, id);
        } else if (type === 'delete') {// 删除
            var delAtdMacModal = Modal('提示', delAtdMachineModal());
            delAtdMacModal.show();
            delAtdMacModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var data = {};
                data.id = id;
                initProjectFunc.delAtdMachineFunc(delAtdMacModal, data, page);
            });
        }
    })
}
/*
* 添加班组按钮
* @param {obj} modal 考勤机设置 弹出框
* */
exports.initAddGroupEvent = function (modal) {
    modal.$body.find('#addGroup').click(function (e) {
        common.stopPropagation(e);
        var AtdGroupModal = Modal('选择班组', addAtdGroupModal());
        AtdGroupModal.showClose();
        AtdGroupModal.show();
        var groupList = modal.$body.find('.group-list div');
        initProjectFunc.getAllEntpTeamsFunc(AtdGroupModal, modal, groupList);
    });
}

/*
* 选择班组中的事件
* @param {obj} parent 全部班组
* @param {obj} modal 选择班组 弹出框
* @param {obj} _modal 考勤机设置 弹出框
* */
exports.initSelectGroupEvent = function (parent, modal, _modal, list) {
    // 从全部班组中选择
    parent.find('li').click(function (e) {
        common.stopPropagation(e);
        var _parent = parent.parents('.group_left').next('.group_right').find('ul');
        // 添加未选
        if (!$(this).find('.select').hasClass('radioed')) {
            $(this).find('.select').addClass('radioed');
            var radioed = $(this).clone();
            radioed.data('item', $(this).data('item'));
            radioed.appendTo(_parent);
            radioed.append('<i class="remove-group">×</i>');
            // 移除已选
            radioed.find('.remove-group').click(function (e) {
                common.stopPropagation(e);
                $(this).parents('li').remove();
                var groupName = $(this).parents('li').find('.group-name').html();
                parent.find('li').each(function (index, ele) {
                    if ($(this).find('.group-name').html() == groupName) {
                        $(this).find('.select').removeClass('radioed');
                        return false;
                    }
                })
            })
        }
    })
    // 点开选择班组时，回填已经选择的班组
    list = list || [];
    for (var i = 0; i < list.length; i++) {
        var teamId = $(list[i]).data('item').teamId;
        parent.find('li').each(function () {
            if ($(this).data('item').teamId == teamId) {
                $(this).click();
            }
        })
    }

    // 选择班组 确定
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var list = modal.$body.find('.group_right li');
        _modal.$body.find('.group-list').html('');
        list.each(function (index, ele) {
            var item = $(ele).data('item');
            var dom = $('<div>' + item.teamName + '<a href="#" class="delete-hover">删除</a>' + '</div>');
            dom.data('item', item);
            dom.appendTo(_modal.$body.find('.group-list'));
            dom.find('a').click(function (e) {
                common.stopPropagation(e);
                $(this).parent('div').remove();
            })
        })
        modal.$body.find('.span-btn-bc').click();
    })
}
