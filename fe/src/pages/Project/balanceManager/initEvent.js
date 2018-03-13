var Model = require('../../../components/Model');
var newContractBalanceModal = require('./modal/newContractBalanceModal.ejs');
var checkContractBalanceModal = require('./modal/checkContractBalanceModal.ejs');
var initBalanceManger = require('./initBalanceManager');
var common = require('../../Common');
var deleteModal = require('./modal/deleteModal.ejs');

var addBalanceItemModal = require('./modal/addBalanceItemModal.ejs');
var enterpriseDataBase = require('../costBudgetManager/modal/enterpriseDataBase.ejs');
var initEventModal = require('../costBudgetManager/modal/initEventModal');

var balanceModal = require('./modal/balanceModal.ejs');
var editBalanceModal = require('./modal/editBalanceModal.ejs');
var noContractBalanceModal = require('./modal/noContractBalanceModal.ejs');
var balanceManagerCostModal = require('./modal/balanceManagerCostModal.ejs');
var approvalProcess = require('../../../components/approvalProcess');
var scheduleManager = require('../scheduleManager/initEvent');
var addSupplier = require('../../../components/addSupplier');
var exceptionMemoModal = require('../costBudgetManager/modal/exceptionMemoModal.ejs');
var initCostBudgetList = require('../costBudgetManager/initCostBudgetList');
var addContractBalanceAttachModal = require('./modal/addContractBalanceAttachModal.ejs');
var contractBalanceAttachModal = require('./modal/contractBalanceAttachModal.ejs');
var UploadAttach = require('../../../components/UploadAttach');
var checkOuturnModal = require('../costManager/modal/checkOutTurnModal.ejs');
var costBalanceOrderModal = require('./modal/costBalanceOrderModal.ejs');
var payMoneyRecordModal = require('../costManager/modal/payMoneyRecordModal.ejs');
var initCostManagerFunc = require('../costManager/initCostManagerFunc');
var remindBalanceRemoveModal = require('./modal/remindBalanceRemoveModal.ejs');
var addBudgetItemModal = require('./modal/addBudgetItemModal.ejs');
var ReviewImage = require('../../../components/ReviewImage');
var projectInitEvent = require('../initEvent');
/**
 * 初始化结算table 事件
 * @param parents
 */
exports.initBalanceTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'update') {
            if (item.baseType === 1) {
                var updateContract = Model('修改合同结算', newContractBalanceModal());
                updateContract.show();
                updateContract.showClose();
                initContractBalanceData(updateContract, function (parents) {
                    parents.find('option:first').text(item.cntrName);
                    parents.attr('disabled', true);
                    updateContract.$body.find('[name=settleName]').val(item.settleName);
                    updateContract.$body.find('[name=cntrNo]').val(item.cntrNo);
                    updateContract.$body.find('[name=cntrChargeName]').val(item.cntrChargeName);
                });
                updateContract.$body.find('.confirm').click(function (e) {
                    common.stopPropagation(e);
                    var settleName = updateContract.$body.find('[name=settleName]').val();
                    if (!settleName) {
                        return alert('请输入结算单名称');
                    }
                    initBalanceManger.putHaveContractBalanceObj({settleName: settleName, id: item.id}, updateContract);
                });
            } else {
                var projId = $('#projectSchedule').data('id');
                var projectTitle = $('.project-menu-title span').text();
                window.location.href = '/project/balance/contract/' + projId + '?id=' + item.id + "&name=" + projectTitle;
            }
        } else if (type === 'delete') {
            var delModal = Model('提示', remindBalanceRemoveModal());
            delModal.show();
            delModal.showClose();
            initBalanceDeleteModalEvent(delModal, item);
        } else if (type === 'detail') {
            if (item.baseType === 1) {
                var checkContract = Model('合同结算详情', checkContractBalanceModal());
                checkContract.show();
                checkContract.showClose();
                var dom = $('<span style="font-weight: normal;font-size: 12px;margin-left: 30px;">结算单编号 : ' + item.settleNo + '</span>');
                checkContract.$header.find('.title').append(dom);
                checkContract.$body.find('#contractDetail').html(item.cntrName);
                checkContract.$body.find('[name=settleName]').html(item.settleName);
                checkContract.$body.find('[name=cntrNo]').html(item.cntrNo);
                checkContract.$body.find('[name=cntrChargeName]').html(item.cntrChargeName);
                checkContract.$body.find('.confirm').hide();
            } else {
                var projId = $('#projectSchedule').data('id');
                var projectTitle = $('.project-menu-title span').text();
                window.location.href = '/project/balance/check/' + projId + '?id=' + item.id + "&name=" + projectTitle + '&type=' + 'detail';
            }
        }

    });
    parents.find('tr').click(function (e) {
        parents.find('tr').removeClass('trHeightLight');
        $(this).addClass('trHeightLight');
        common.stopPropagation(e);
        var item = $(this).data('item');
        $('.contract-detail').show();
        balanceOrderData(item);
        var cntrStatus = item.cntrStatus;
        initBalanceManger.getContractBalanceSubItem({cntrId: item.id}, cntrStatus);
    })
};


function initBalanceCostModalEvent(modal) {
    modal.$body.find('.editBalanceCost').click(function (e) {
        common.stopPropagation(e);
        var editBalance = Model('编辑', editBalanceModal());
        editBalance.showClose();
        editBalance.show();
    })
}

function balanceOrderData(item) {
    $('.settleNo').text(item.settleNo);
    $('.cntrNo').text(item.cntrNo || '无');
    $('.balanceName').text(item.settleName);
    var cntrPrice = item.cntrPrice ? item.cntrPrice + '元' : 0 + '元';
    $('.cntrPrice').text(cntrPrice);
    $('.subProjName').text(item.subProjName);
    $('.subProjName').attr('title', item.subProjName);
    var settlementType = item.settlementType === 1 ? '固定总价' : '固定综合单价';
    $('.settlementType').text(settlementType);
    var taxType = item.taxType === 1 ? '是' : '否';
    $('.contract-detail').find('[name=taxType]').text(taxType);
    $('.contract-detail').data('item', item);
    var parents = $('#contractDetailThead').html('');
    if (item.baseType === 1) {
        var dom = $('<tr class="small">\n' +
            '                    <th style="width: 45px;" class="border">序号</th>\n' +
            '                    <th style="width: 70px;" class="border">子项来源</th>\n' +
            '                    <th class="border">项目名称</th>\n' +
            '                    <th class="border">工作内容</th>\n' +
            '                    <th style="width: 60px;" class="border">单位</th>\n' +
            '                    <th style="width: 60px;" class="border">数量</th>\n' +
            '                    <th style="width: 60px;" class="border">单价</th>\n' +
            '                    <th class="border">结算数量</th>\n' +
            '                    <th class="border">结算单价</th>\n' +
            '                    <th class="border">结算合价</th>\n' +
            '                    <th class="border">附件</th>\n' +
            '                    <th class="border" style="width: 120px;">操作</th>\n' +
            '                    <th class="border" style="width: 70px;">异常备忘</th>\n' +
            '                </tr>')
        dom.appendTo(parents);
    } else {
        var dom = $('<tr class="small">\n' +
            '                    <th style="width: 45px;" class="border">序号</th>\n' +
            '                    <th style="width: 70px;" class="border">子项来源</th>\n' +
            '                    <th class="border">项目名称</th>\n' +
            '                    <th class="border">工作内容</th>\n' +
            '                    <th style="width: 60px;" class="border">单位</th>\n' +
            '                    <th class="border">结算数量</th>\n' +
            '                    <th class="border">结算单价</th>\n' +
            '                    <th class="border">结算合价</th>\n' +
            '                    <th class="border">附件</th>\n' +
            '                    <th class="border" style="width: 120px;">操作</th>\n' +
            '                    <th class="border" style="width: 70px;">异常备忘</th>\n' +
            '                </tr>')
        dom.appendTo(parents);
    }
}

/**
 * 删除
 * @param modal
 * @param item
 */
function initBalanceDeleteModalEvent(modal, item) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        initBalanceManger.delBalanceObj(item.id, modal);
    });
}

exports.initBalanceEvent = function (page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);

        $('.status').change(function () {
            if ($(this).val() == 11) {
                var select = '<option value="1">费用待提交</option>' +
                    '<option value="5">费用待生成</option>' +
                    '<option value="2">审批中</option>' +
                    '<option value="3">已通过</option>' +
                    '<option value="4">已驳回</option>'
                $('.costStatus').append(select);
            } else {
                $('.costStatus').html('<option value="0">全部费用单状态</option>');
            }
        })

        searchModal.click(function (e) {
            common.stopPropagation(e);
            var status = $('.status').val();
            var costStatus = $('.costStatus').val();
            var type = $('.type').val();
            var keywords = $('.keywords').val().trim();
            var data = {};
            if (keywords) {
                data.keywords = keywords;
            }
            data.status = status;
            data.type = type;
            data.costStatus = costStatus;
            initBalanceManger.getBalanceList(data, page);
        });

        $('#myBalance').click(function (e) {
            common.stopPropagation(e);
            var status = $('.status').val();
            var type = $('.type').val();
            var keywords = $('.keywords').val().trim();
            var data = {};
            data.myType = 1;
            if (keywords) {
                data.keywords = keywords;
            }
            data.status = status;
            data.type = type;
            initBalanceManger.getBalanceList(data, page);
        });
        $('#newContract').click(function (e) {
            common.stopPropagation(e);
            var newContract = Model('新建合同结算单', newContractBalanceModal());
            newContract.show();
            newContract.showClose();
            initContractBalanceData(newContract);
            initContractBalanceEvent(newContract);
        });

        $('.costBalanceOrder').click(function (e) {
            common.stopPropagation(e);
            var item = $('.contract-detail').data('item');
            var balanceCostModal = Model('结算管理费用单', costBalanceOrderModal());
            balanceCostModal.showClose();
            balanceCostModal.$header.hide();
            balanceCostModal.$body.find('.confirm').css('display', 'inline-block');
            initBalanceManger.getContractCostOrder({cntrId: item.id}, balanceCostModal, function () {
                balanceCostModal.show();
            });
            var historyList = balanceCostModal.$body.find('.historyList');
            historyList.show();
            historyList.click(function (e) {
                common.stopPropagation(e);
                var payMoneyRecord = Model('付款记录', payMoneyRecordModal());
                payMoneyRecord.showClose();
                payMoneyRecord.show();
                initCostManagerFunc.getPayabledRecordListFunc(item.id, payMoneyRecord);
            });

            /**
             * 提交审批
             */
            balanceCostModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var approval = new approvalProcess('结算费用单审批', function () {
                    var _item = approval.getSelectData();
                    var $item = balanceCostModal.$body.find('.confirm').data('item');
                    var costName = balanceCostModal.$body.find('[name=costName]').val();
                    var ensureMoney = balanceCostModal.$body.find('[name=ensurePayMoney]').val();
                    var ensureMoths = balanceCostModal.$body.find('[name=ensurePayMonth]').val();
                    var remark = balanceCostModal.$body.find('[name=remark]').val();
                    if (!costName) {
                        return alert('请输入费用单名称');
                    }
                    if (!ensureMoney || isNaN(ensureMoney)) {
                        return alert('请输入金额');
                    }
                    if (!ensureMoths || isNaN(ensureMoths)) {
                        return alert('请输入期限');
                    }
                    initBalanceManger.putBalanceCostOrderFunc({
                        status: 2,
                        costName: costName,
                        ensureMoney: ensureMoney,
                        ensureMoths: ensureMoths,
                        remark: remark,
                        id: $item.id,
                        tmplId: _item.id
                    }, balanceCostModal, approval);
                });
                approval.getApprovalModal(3);
                //s approval.show();
            });
        })
    }
    $('.contract-cancel').click(function (e) {
        $(".trHeightLight").removeClass('trHeightLight');
        common.stopPropagation(e);
        $('.contract-detail').hide();

    });
    /**
     * 审批
     */
    $('.approvalData').click(function (e) {
        common.stopPropagation(e);
        var approval = new approvalProcess('结算审批', function () {
            var data = approval.getSelectData();
            var item = $('.contract-detail').data('item');
            initBalanceManger.postBalanceObjFunc({
                status: 2,
                tmplId: data.id,
                cntrId: item.id
            }, approval);
        });
        approval.getApprovalModal(2);
    });
    $('.contract-save').click(function (e) {
        common.stopPropagation(e);
        var item = $('.contract-detail').data('item');
        initBalanceManger.postBalanceObjFunc({
            status: 1,
            cntrId: item.id
        });
    });
    $('.addItem').click(function (e) {
        common.stopPropagation(e);
        var addBalanceModal = Model('增项', addBalanceItemModal());
        addBalanceModal.show();
        addBalanceModal.showClose();
        var communiqueFile = addBalanceModal.$body.find('#communiqueFile');
        var attach = new UploadAttach(communiqueFile);
        initAddBalanceItemModalEvent(addBalanceModal, attach);
    });
};

/**
 * 添加项 modal 提交数据事件
 * @param modal
 */
function initAddBalanceItemModalEvent(modal, attach) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var id = $('.contract-detail').data('item').id;
        var workName = modal.$body.find('[name=workName]').val();
        var unit = modal.$body.find('[name=unit]').val();
        var workContent = modal.$body.find('[name=workContent]').val();
        var calcRule = modal.$body.find('[name=calcRule]').val();
        var remark = modal.$body.find('[name=remark]').val();
        var attaches = attach.getAttaches();
        if (!workName) {
            return alert('请输入项目名称')
        }
        if (!unit) {
            return alert('请输入单位');
        }
        if (!workContent) {
            return alert('请输入工作内容');
        }
        if (!calcRule) {
            return alert('请输入计算规则');
        }
        initBalanceManger.postBalanceAddSubItemObj({
            calcRule: calcRule,
            cntrId: id,
            unit: unit,
            attaches: attaches,
            workContent: workContent,
            workName: workName,
            remark: remark
        }, modal);
    })
}

/**
 * 唤起企业库数据
 */
function initAddItemModalEvent(modal) {
}


function initContractBalanceData(modal, callback) {
    initBalanceManger.getContractNoBalance(modal, null, callback);
}

function initContractBalanceEvent(modal) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var settleName = modal.$body.find('[name=settleName]').val();
        var cntrId = modal.$body.find('#contractDetail').val();
        if (!settleName) {
            return alert('请输入结算单命名');
        }
        if (!cntrId || cntrId === 'a') {
            return alert('请选择关联的合同');
        }
        initBalanceManger.postContractBalanceObj({settleName: settleName, cntrId: cntrId}, modal);
    });
}

exports.initBalanceDetailEvent = function (attach) {
    var save = $('.save');
    attach.reset();
    if (save.length > 0 && !save.data('flag')) {
        save.data('flag', true);
        save.click(function (e) {
            common.stopPropagation(e);
            var id = $("#newNoContract").data('id');
            var subProjId = $('#subProjId').val();
            var settleName = $('[name=settleName]').val();
            var settUserNo = $('.settUserNo').data('user');
            var entprId = $('.supplierList').data('item');
            var cntrType = $('[name=cntrType]').val();
            var settlementType = $('[name=settlementType]').val();
            var cntrPrice = $('[name=cntrPrice]').val();
            var taxType = $('[name=taxType]:checked').val();
            var cntrStartTime = $('[name=cntrStartTime]').val();
            var cntrEndTime = $('[name=cntrEndTime]').val();
            var payTypeDesc = $('[name=payTypeDesc]').val();
            var ensurePer = $('[name=ensurePer]').val();
            var ensureMonth = $('[name=ensureMonth]').val();
            var cntrContent = $('[name=cntrContent]').val();
            var otherDesc = $('[name=otherDesc]').val();
            var attaches = attach.getAttaches();
            if (subProjId === 'a' || !subProjId) {
                return alert('请输入所属分部');
            }
            if (!settleName) {
                return alert('请输入结算单命名');
            }
            if (!settUserNo) {
                return alert('请选择款项负责人');
            }
            settUserNo = settUserNo.userNo;
            if (!entprId) {
                return alert('请选择合作方');
            }
            if (cntrType === 'a' || !cntrType) {
                return alert('请选择合同分类');
            }
            if (settlementType === 'a' || !settlementType) {
                return alert('请输入结算方式');
            }
            if (!cntrPrice) {
                return alert('请输入约定价格');
            }
            if (isNaN(cntrPrice * 1)) {
                return alert('请输入正确约定价格');
            }
            if (!taxType) {
                return alert('请选择是否含税');
            }
            if (!cntrStartTime) {
                return alert('请输入合作开始时间');
            }
            if (!cntrEndTime) {
                return alert('请输入合作结束时间');
            }
            if (!payTypeDesc) {
                return alert('请输入付款方式');
            }
            if (!ensurePer) {
                return alert('请输入质保金');
            }
            if (!ensureMonth) {
                return alert('请输入期限');
            }
            if (!cntrContent) {
                return alert('请输入工作内容');
            }
            if (!otherDesc) {
                return alert('请输入其他条款');
            }
            var data = {
                subProjId: subProjId,
                cntrChargeName: settleName,
                cntrChargeNo: settUserNo,
                entprId: entprId.id,
                cntrType: cntrType,
                settlementType: settlementType,
                cntrPrice: cntrPrice,
                taxType: taxType,
                cntrStartTime: cntrStartTime,
                cntrEndTime: cntrEndTime,
                payTypeDesc: payTypeDesc,
                ensurePer: ensurePer,
                ensureMonth: ensureMonth,
                cntrContent: cntrContent,
                otherDesc: otherDesc,
                attaches: attaches,
                settleName: settleName
            };
            if (id) {
                data.id = id;
                initBalanceManger.putNoContractBalanceObj(data);
            } else {
                initBalanceManger.postNoContractBalanceObj(data);
            }
        });
        $('[name=cntrStartTime]').change(function (e) {
            common.stopPropagation(e);
            var start = $(this).val();
            var end = $('[name=cntrEndTime]').val();
            if (start && end) {
                end = moment(end).set('hour', 24).set('minute', 0).set('second', 0);
                start = moment(start).set('hour', 0).set('minute', 0).set('second', 0);
                var days = moment(end).diff(moment(start), 'days');
                if (days < 0) {
                    $('.days').val('');
                    $(this).val('');
                    return alert('结束时间必须大于开始时间')
                } else {
                    $('.days').val(days);
                }
            }
        });
        $('[name=cntrEndTime]').change(function (e) {
            common.stopPropagation(e);
            var end = $(this).val();
            var start = $('[name=cntrStartTime]').val();
            if (start && end) {
                end = moment(end).set('hour', 24).set('minute', 0).set('second', 0);
                start = moment(start).set('hour', 0).set('minute', 0).set('second', 0);
                var days = moment(end).diff(moment(start), 'days');
                if (days < 0) {
                    $('.days').val('');
                    $(this).val('');
                    return alert('结束时间必须大于开始时间')
                } else {
                    $('.days').val(days);
                }
            }
        });

        $('.settUserNo').click(function (e) {
            common.stopPropagation(e);
            var level = $('#newNoContract').data('level');
            if (level === 'detail') {
                return;
            }
            var user = $(this).data('user');
            scheduleManager.addEmployeeTable(user, this);
        });
        $('.supplierType').click(function (e) {
            common.stopPropagation(e);
            var level = $('#newNoContract').data('level');
            if (level === 'detail') {
                return;
            }
            new addSupplier($(this), $(this).next('.supplierList'));
        })
    }
};
/**
 * 新建合同modal 的关联合同名称change事件
 * @param parents
 * @param modal
 */
exports.initNewContractBalanceOrder = function (parents, modal) {
    parents.change(function (e) {
        common.stopPropagation(e);
        var item = $(this).find('option:selected').data('item');
        if (item) {
            modal.$body.find('[name=cntrNo]').val(item.cntrNo);
            modal.$body.find('[name=cntrChargeName]').val(item.cntrChargeName);
        } else {
            modal.$body.find('[name=cntrNo]').val('');
            modal.$body.find('[name=cntrChargeName]').val('');
        }
    });
};
/**
 * 初始化合同资源结算事件
 */
exports.initResourceContractEvent = function (page) {
    var searchModal = $('.searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var settleStatus = $('.settleStatus').val();
            var keywords = $('.keywords').val().trim();
            if (!settleStatus) {
                return
            }
            var data = {settleStatus: settleStatus, keywords: keywords};
            if (keywords) {
                data.keywords = keywords;
            }
            initBalanceManger.getResourceContractList(data, page);
        })
    }
};

/**
 * 绘制添加项的tbody内容
 * @returns {*|jQuery|HTMLElement}
 */
function renderAddItemModalTable(list, parents, _type, $count) {
    $count = $count || 0
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var type = item.laborTypeName || item.measureTypeName || item.subletTypeName;
        var name = item.laborName || item.measureName || item.subletName;
        var count = $count + i + 1;
        var settleQpy = item.settleQpy || '';
        var $type = item.$type || _type
        var settlePrice = item.settlePrice || '';
        var dom = $('<tr class="small new ' + $type + '">\
    <td class="border">' + count + '</td>\
    <td class="border">' + type + '</td>\
    <td class="border">' + name + '</td>\
    <td class="border">' + item.workContent + '</td>\
    <td class="border">' + item.unit + '</td>\
    <td class="border"><input type="text" placeholder="填写" name="settleQpy" value="' + settleQpy + '"></td>\
    <td class="border"><input type="text" placeholder="填写" name="settlePrice" value="' + settlePrice + '"></td>\
    <td class="border"><a class="delete-hover">删除</a></td>\
    </tr>');
        var workType = '';
        var workId = '';
        if (item.laborTypeName) {
            workType = 3;
            workId = item.laborId
        } else if (item.measureTypeName) {
            workType = 4;
            workId = item.measureId;
        } else if (item.subletTypeName) {
            workId = item.subletId;
            workType = 5;
        }
        if (!workId) {
            workId = item.id;
        }
        dom.data('item', {workId: workId, workType: workType});
        item.workType = workType;
        item.workId = workId;
        dom.data('old', item);
        dom.appendTo(parents);
    }
}

function ArrayDeduplicationObj(oldList, $item) {
    oldList = oldList || [];
    $item = $item || {};
    for (var i = 0; i < oldList.length; i++) {
        var item = oldList[i];
        if (item.workId === $item.workId && item.workType === $item.workType) {
            oldList.splice(i, 1);
        }
    }
    removeSaveEnteripse(oldList)
}

exports.initModalBalanceEvent = function (parents, modal) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var $item = $(this).parents('tr').data('old');
        if ($(this).parents('tr').hasClass('new')) {
            $(this).parents('tr').remove();
            var list = $('#addEnterprise').data('list');
            list = contactEnteripseArray(list);
            ArrayDeduplicationObj(list, $item);
        } else {
            initBalanceManger.delContractSubItemCostFindByIdFunc({
                cntrId: $item.cntrId,
                cntrSubitemId: $item.cntrSubitemId,
                ids: [$item.id]
            }, modal)
        }
    })
};

function contactEnteripseArray(list) {
    list = list || [];
    var $list = [];
    var workType = "";
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        for (var index in item) {
            if (index === 'labor') {
                workType = 3;
            } else if (index === 'step') {
                workType = 4;
            } else if (index === 'subpackage') {
                workType = 5;
            }
            var _list = item[index];
            for (var j = 0; j < _list.length; j++) {
                _list[j].workId = _list[j].id;
                _list[j].workType = workType;
            }
            $list = $list.concat(item);
        }
    }
}

/**
 * 合并数组
 * @param list
 * @returns {Array}
 */
function contactArray(list) {
    var index = ['labor', 'step', 'subpackage'];
    var $list = [];
    var workType = "";
    for (var i = 0; i < list.length; i++) {
        var item = list[i][index[i]];
        if (i === 0) {
            workType = 3;
        } else if (i === 1) {
            workType = 4;
        } else if (i === 2) {
            workType = 5;
        }
        for (var j = 0; j < item.length; j++) {
            item[j].workId = item[j].id;
            item[j].workType = workType;
        }
        $list = $list.concat(item);
    }
    return $list;
}

/**
 * 绘制结算单详情table 事件
 * @param parents
 */
exports.initBalanceOrderTableEvent = function (parents, cntrStatus) {
    var $that = this;
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'balance') {
            if (item.baseType === 1) {
                var balanceCheck = Model('结算', balanceModal());
                balanceCheck.showClose();
                balanceCheck.show();
                initBalanceCheckModalData(balanceCheck, item);
                initBalanceCheckModalEvent(balanceCheck, item, $that);
            } else {
                var noBalanceCheck = Model('结算', noContractBalanceModal());
                noBalanceCheck.showClose();
                noBalanceCheck.show();
                initBalanceCheckModalData(noBalanceCheck, item);
                initBalanceCheckModalEvent(noBalanceCheck, item, $that);
            }
        } else if (type === 'update') {
            var addBalanceModal = Model('修改项', addBalanceItemModal());
            addBalanceModal.showClose();
            addBalanceModal.show();
            var communiqueFile = addBalanceModal.$body.find('#communiqueFile');
            var attach = new UploadAttach(communiqueFile);
            initBalanceItemModalData(addBalanceModal, item, attach);
            initBalanceItemModalEvent(addBalanceModal, item, attach);
        } else if (type === 'delete') {
            var delModal = Model('提示', deleteModal());
            delModal.show();
            delModal.showClose();
            initDeleteModalEvent(delModal, item);
        } else if (type === 'upload') {
            var addContractBalanceAttach = Model('添加附件', addContractBalanceAttachModal());
            addContractBalanceAttach.show();
            addContractBalanceAttach.showClose();
            initBalanceManger.getSubItemAttachFindByCIdAndSid({
                cntrId: item.cntrId,
                cntrSubitemId: item.id
            }, addContractBalanceAttach);
            addContractBalanceAttach.$body.find('input[type=file]').change(function (e) {
                common.stopPropagation(e);
                var file = this.files[0];
                initBalanceManger.uploadImg(file, addContractBalanceAttach);
                this.value = ''
            });
            addContractBalanceAttach.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var listDom = $('.modal-attach-list .attach-item');
                var list = [];
                for (var i = 0, length = listDom.length; i < length; i++) {
                    var _item = $(listDom[i]).data('item');
                    if (_item) {
                        list.push(_item);
                    }
                }
                if (list.length === 0) {
                    return alert('请上传附件');
                }
                initBalanceManger.addSubItemAttachFunc({
                    cntrId: item.cntrId,
                    cntrSubitemId: item.id,
                    attaches: list
                }, addContractBalanceAttach);
            })
        }
    });
    parents.find('.exceptionModal').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        if (item.excpSettleCount > 0 && item.excpSettleIds) {
            var exceptionModal = Model('异常备忘', exceptionMemoModal());
            exceptionModal.showClose();
            exceptionModal.show();
            var confirm = exceptionModal.$body.find('.confirm');
            confirm.data('ids', item.excpSettleIds);
            var projId = $('#projectSchedule').data('id');
            initCostBudgetList.getExceptionIdListFunc({projId: projId, ids: item.excpSettleIds}, exceptionModal);
            confirm.click(function (e) {
                common.stopPropagation(e);
                initBalanceManger.getContractBalanceSubItem({cntrId: item.cntrId}, cntrStatus);
                exceptionModal.hide();
            })
        }
    });
    parents.find('.icon-arrow-gray').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('no-attach')) {
            return false;
        }
        var contractBalance = Model('查看附件', contractBalanceAttachModal());
        contractBalance.showClose();
        contractBalance.show();
        contractBalance.$body.find('.confirm').hide();
        var item = $(this).parents('tr').data('item');
        initBalanceManger.getSubItemAttachFindByCIdAndSid({
            cntrId: item.cntrId,
            cntrSubitemId: item.id
        }, contractBalance, 'check');
    })
};

function initBalanceCheckModalEvent(modal, item, $that) {
    modal.$body.find('.budget-menus a').click(function (e) {
        common.stopPropagation(e);
        modal.$body.find('.budget-menus a').removeClass('active');
        $(this).addClass('active');
        var type = $(this).data('type');
        var child = $('.' + type + 'Item');
        if (type === 'sum') {
            if (child.is(':hidden')) {
                child.show();
                $('.cntrQpyModal').show();
            }
            $('.cntrPriceModal').hide();
            $('.priceItem').hide();
        } else {
            if (child.is(':hidden')) {
                child.show();
                $('.cntrPriceModal').show();
            }
            $('.cntrQpyModal').hide();
            $('.sumItem').hide();
        }
    });
    modal.$body.find('.sumPrice').click(function (e) {
        common.stopPropagation(e);
        var cntrPrices = modal.$body.find('#balanceContractModal').find('tr');
        var error = false;
        var errMsg = '';
        var sum = 0;
        for (var i = 0, length = cntrPrices.length; i < length; i++) {
            var settleQpy = $(cntrPrices[i]).find('[name=settleQpy]').val();
            var settlePrice = $(cntrPrices[i]).find('[name=settlePrice]').val();
            var reg = /^[1-9]\d*|0$/;
            if (!reg.test(settleQpy)) {
                error = true;
                errMsg = '请输入单位含量单价';
                break;
            }
            if (!reg.test(settlePrice)) {
                error = true;
                errMsg = '请输入单价';
                break;
            }
            sum += (parseFloat(settleQpy) * parseFloat(settlePrice));
        }
        if (error) {
            return alert(errMsg);
        }
        modal.$body.find('[name=settleTotalQpy]').val(sum.toFixed(2));
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var settleQpyFormula = $('[name=settleQpyFormula]').val();
        var settleQpyW = $('[name=settleQpyW]').val();
        var purchaseQpy = $('#purchaseQpy').data('cntrQpy') || "settleQpyW";
        if (purchaseQpy === 'cntrQpy' && $('#purchaseQpy').length !== 0) {
            settleQpyW = $('[name=cntrQpy]').val();
            settleQpyFormula = 0;
        } else {
            if (!settleQpyW) {
                return alert('请通过公式计算结算量');
            }
            var formula = 0;
            try {
                formula = eval(settleQpyFormula)
            } catch (e) {
                return alert('请输入正确的计算公式')
            }
            if (formula !== 0 && formula.toString() !== settleQpyW) {
                return alert('计算公式计算结果于结算量不相等');
            }
            $('[name=settleQpyW]').val(settleQpyW)
        }
        var cntrSubitemId = item.id;
        var cntrId = item.cntrId;
        var error = false;
        var errMsg = '';
        var trs = modal.$body.find('#balanceContractModal').find('tr');
        var hasContractList = [];
        var noContractList = [];
        for (var i = 0, length = trs.length; i < length; i++) {
            var tr = $(trs[i]);
            var settleQpy = tr.find('[name=settleQpy]').val();
            var settlePrice = tr.find('[name=settlePrice]').val();
            var $item = tr.data('item');
            var purchContract = modal.$body.find('#purchasePrice').data('cntrQpy') || "settleTotalQpy"
            if (purchContract === 'cntrPrice') {
                settleQpy = tr.find('.cntrQpy').html();
                settlePrice = tr.find('.cntrPrice').html();
            }
            if (typeof $item === 'number') {
                hasContractList.push({id: $item, settleQpy: settleQpy, settlePrice: settlePrice});
            } else {
                noContractList.push({
                    workId: $item.workId,
                    workType: $item.workType,
                    settleQpy: settleQpy,
                    settlePrice: settlePrice
                });
            }
            var reg = /^[1-9]\d*|0$/;
            if (!reg.test(settleQpy)) {
                error = true;
                errMsg = '请输入结算单位含量';
                break;
            }
            if (!reg.test(settlePrice)) {
                error = true;
                errMsg = '请输入结算单价';
                break;
            }
        }
        if (error) {
            return alert(errMsg);
        }
        if (settleQpyFormula !== 0 && !settleQpyFormula) {
            return alert('请输入计算公式');
        }
        /**
         * 添加有合同
         */
        if (hasContractList.length > 0) {
            initBalanceManger.postContractSubItemBalance({
                cntrId: cntrId,
                cntrSubitemId: cntrSubitemId,
                list: hasContractList,
                settleQpy: settleQpyW,
                settleQpyFormula: settleQpyFormula
            }, modal);
        }
        /**
         * 添加增项
         */
        if (noContractList.length > 0) {
            initBalanceManger.postNoContractBalanceSubItem({
                cntrId: cntrId,
                cntrSubitemId: cntrSubitemId,
                list: noContractList,
                settleQpy: settleQpyW,
                settleQpyFormula: settleQpyFormula
            }, modal);
        }
    });
    $('#purchaseQpy').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('background-list-gray')) {
            $(this).removeClass('background-list-gray');
            $(this).data('cntrQpy', 'cntrQpy');
            modal.$body.find('[name=settleQpyW]').val(modal.$body.find('[name=cntrQpy]').val());
        } else {
            $(this).data('cntrQpy', 'settleQpyW');
            $(this).addClass('background-list-gray');
            var settleQpyFormula = $('[name=settleQpyFormula]').val();
            if (!settleQpyFormula) {
                return alert('请输入计算公式');
            }
            var sum = 0;
            try {
                sum = eval(settleQpyFormula);
            } catch (e) {
            }
            modal.$body.find('[name=settleQpyW]').val(sum);
        }
    });
    $('#purchasePrice').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('background-list-gray')) {
            $(this).removeClass('background-list-gray');
            $(this).data('cntrQpy', 'cntrPrice');
            useContractPrice(modal, "cntrPrice")
        } else {
            $(this).addClass('background-list-gray');
            $(this).data('cntrQpy', 'settleTotalQpy');
            useContractPrice(modal, "settleTotalQpy")
        }
    });
    $('.sumFormat').click(function (e) {
        common.stopPropagation(e);
        var settleQpyFormula = $('[name=settleQpyFormula]').val();
        if (!settleQpyFormula) {
            return alert('请输入计算公式');
        }
        var sum = 0;
        try {
            sum = eval(settleQpyFormula);
        } catch (e) {
            return alert('请输入正确的公式');
        }
        modal.$body.find('[name=settleQpyW]').val(sum);
    });
    /**
     * 企业库添加
     */
    $('#addEnterprise').click(function (e) { // todo 保存成功后清空
        common.stopPropagation(e);
        var $modal = Model('企业库数据', enterpriseDataBase());
        $modal.showClose();
        $modal.show();
        var that = this;
        var isExist = $(that).data('list');
        if (isExist && isExist.length === 3) {
            $('#laborEnterpriseModal').data('list', $(that).data('list')[0]['labor']);
            $('#stepEnterpriseModal').data('list', $(that).data('list')[1]['step']);
            $('#subpackageEnterpriseModal').data('list', $(that).data('list')[2]['subpackage']);
        }
        initEventModal.initBaseDataModal($modal, ['labor', 'step', 'subpackage'], function (list) {
            $modal.hide();
            $(that).data('list', list);
            var _preList = contactArray(list);
            var oldList = [];
            var preList = modal.$body.find('#balanceContractModal tr.old');
            for (var j = 0; j < preList.length; j++) {
                var preItem = $(preList[j]).data('old');
                preItem.settleQpy = $(preList[j]).find('[name=settleQpy]').val();
                preItem.settlePrice = $(preList[j]).find('[name=settlePrice]').val();
                oldList.push(preItem);
            }
            var newList = [];
            var newTrs = modal.$body.find('#balanceContractModal tr.new2');
            for (var k = 0; k < newTrs.length; k++) {
                var _preItem = $(newTrs[k]).data('old');
                _preItem.$type = 'new2';
                _preItem.settleQpy = $(newTrs[k]).find('[name=settleQpy]').val();
                _preItem.settlePrice = $(newTrs[k]).find('[name=settlePrice]').val();
                newList.push(_preItem);
            }
            newList = ArrayDeduplication(newList, _preList, true);
            var _list = ArrayDeduplicationOld(oldList, newList);
            var parents = modal.$body.find('#balanceContractModal');
            modal.$body.find('#balanceContractModal tr.new1').remove();
            modal.$body.find('#balanceContractModal tr.new2').remove();
            renderAddItemModalTable(_list, parents, 'new1', preList.length);
            $that.initModalBalanceEvent(parents, $modal, item);

        });
        $modal.$body.find('.budget-menus a#materialEnterpriseModal').addClass('cancel-active');
        $modal.$body.find('.budget-menus a#supplierEnterpriseModal').addClass('cancel-active');
    });
    $('#addBudget').click(function (e) {
        common.stopPropagation(e);
        var addBudget = Model('成本预算', addBudgetItemModal());
        addBudget.show();
        addBudget.showClose();
        addBudget.$body.find('.subProjName').text(item.subProjName);
        addBudgetEvent(addBudget, modal, item.subProjId, $that);
        addBudget.$body.find('.billType').change();
    })
}

/**
 * 采用合同价格
 * @param modal
 * @param type
 */
function useContractPrice(modal, type) {
    var trs = modal.$body.find('#balanceContractModal tr');
    for (var i = 0; i < trs.length; i++) {
        var tr = $(trs[i]);
        if (type === 'cntrPrice') {
            var cntrQpy = tr.find('.cntrQpy').html();
            var cntrPrice = tr.find('.cntrPrice').html();
            tr.find('[name=settleQpy]').val(cntrQpy);
            tr.find('[name=settlePrice]').val(cntrPrice);
        } else {
            tr.find('[name=settleQpy]').val(0);
            tr.find('[name=settlePrice]').val(0);
        }
    }
    if (type === 'cntrPrice') {
        modal.$body.find('[name=settleTotalQpy]').val(modal.$body.find('[name=cntrPrice]').val())
    } else {
        modal.$body.find('[name=settleTotalQpy]').val(0)
    }
}

function addBudgetEvent(modal, parentModal, subProjId, that) { // todo
    modal.$body.find('.billType').change(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var oldList = [];
        var preList = parentModal.$body.find('#balanceContractModal tr.new2');
        for (var j = 0; j < preList.length; j++) {
            oldList.push($(preList[j]).data('old'))
        }
        initBalanceManger.getResourceContractFunc({subProjId: subProjId, type: value}, modal, oldList);
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var trs = modal.$body.find('tbody tr');
        var list = [];
        for (var i = 0, length = trs.length; i < length; i++) {
            var tr = $(trs[i]);
            if (tr.find('input[type=checkbox]:checked').length > 0) {
                var item = tr.data('item');
                var workType = '';
                var workId = '';
                if (item.laborTypeName) {
                    workType = 3;
                    workId = item.laborId
                } else if (item.measureTypeName) {
                    workType = 4;
                    workId = item.measureId;
                } else if (item.subletTypeName) {
                    workId = item.subletId;
                    workType = 5;
                }
                item.workId = workId;
                item.workType = workType;
                list.push(item);
            }
        }
        var oldList = [];
        var preList = parentModal.$body.find('#balanceContractModal tr.old');
        for (var j = 0; j < preList.length; j++) {
            var preItem = $(preList[j]).data('old');
            preItem.settleQpy = $(preList[j]).find('[name=settleQpy]').val();
            preItem.settlePrice = $(preList[j]).find('[name=settlePrice]').val();
            oldList.push(preItem);
        }
        var newList = [];
        var newTrs = parentModal.$body.find('#balanceContractModal tr.new1');
        for (var k = 0; k < newTrs.length; k++) {
            var _preItem = $(newTrs[k]).data('old');
            _preItem.$type = 'new1';
            _preItem.settleQpy = $(newTrs[k]).find('[name=settleQpy]').val();
            _preItem.settlePrice = $(newTrs[k]).find('[name=settlePrice]').val();
            newList.push(_preItem);
        }
        var new2List = []
        var new2Trs = parentModal.$body.find('#balanceContractModal tr.new2');
        for (var m = 0; m < new2Trs.length; m++) {
            var $preItem = $(new2Trs[m]).data('old');
            $preItem.$type = 'new2';
            $preItem.settleQpy = $(new2Trs[m]).find('[name=settleQpy]').val();
            $preItem.settlePrice = $(new2Trs[m]).find('[name=settlePrice]').val();
            new2List.push($preItem);
        }
        list = ArrayDeduplication(list, newList, true);
        list = ArrayDeduplication(new2List, list);
        var _list = ArrayDeduplicationOld(oldList, list);
        var $parents = parentModal.$body.find('#balanceContractModal');
        parentModal.$body.find('#balanceContractModal tr.new1').remove();
        parentModal.$body.find('#balanceContractModal tr.new2').remove();
        renderAddItemModalTable(_list, $parents, 'new2', preList.length);
        that.initModalBalanceEvent($parents, parentModal, item);
        modal.hide();
    })
}

function ArrayDeduplication(oldList, newList, isRemove) {
    oldList = oldList || [];
    newList = newList || [];
    for (var i = 0, length = oldList.length; i < length; i++) {
        var item = oldList[i];
        for (var j = 0; j < newList.length; j++) {
            var child = newList[j];
            if (item.workId === child.workId && item.workType === child.workType) {
                newList.splice(j, 1);
            }
        }
    }
    if (isRemove) {
        removeSaveEnteripse(newList);
    }
    return oldList.concat(newList);
}

function removeSaveEnteripse(list) {
    var data = {}
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.workType === 3) {
            data.labor = data.labor || []
            data.labor.push(item);
        } else if (item.workType === 4) {
            data.step = data.step || []
            data.step.push(item);
        } else if (item.workType === 5) {
            data.subpackage = data.subpackage || [];
            data.subpackage.push(item)
        }
    }
    var $list = [];
    for (var key in data) {
        var $data = {};
        $data[key] = data[key];
        $list.push($data)
    }
    var index = ['labor', 'step', 'subpackage'];
    for (var k = 0; k < index.length; k++) {
        if ($list[k]) {
            continue
        }
        var data = {};
        data[index[k]] = [];
        $list.push(data)
    }
    $('#addEnterprise').data('list', $list);
}

/**
 * 过滤
 * @constructor
 */
function ArrayDeduplicationOld(oldList, newList) {
    oldList = oldList || [];
    newList = newList || [];
    for (var i = 0, length = oldList.length; i < length; i++) {
        var item = oldList[i];
        for (var j = 0; j < newList.length; j++) {
            var child = newList[j];
            if (item.workId === child.workId && item.workType === child.workType) {
                newList.splice(j, 1);
            }
        }
    }
    return newList;
}

function initBalanceCheckModalData(modal, item) {
    modal.$body.find('.workContent').html(item.workContent);
    modal.$body.find('.calcRule').text(item.calcRule);
    modal.$body.find('.remark').text(item.remark);
    // modal.$body.find('.remark').text(item.workContent);
    modal.$body.find('.workName').html(item.workName);
    modal.$body.find('.unit').html(item.unit);
    modal.$body.find('[name=cntrQpy]').val(item.cntrQpy);
    modal.$body.find('[name=settleQpyW]').val(item.settleQpy);
    modal.$body.find('[name=cntrPrice]').val(item.cntrPrice);
    modal.$body.find('[name=settleTotalQpy]').val(item.settlePrice);
    initBalanceManger.getSubitemDetailFindByCIdAndSid({
        cntrId: item.cntrId,
        cntrSubitemId: item.id
    }, modal, item.baseType);
}

/**
 * 删除结算子目内容
 * @param modal
 * @param item
 */
function initDeleteModalEvent(modal, item) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        initBalanceManger.delBalanceSubItem({id: item.id, cntrId: item.cntrId}, modal);
    })
}

function initBalanceItemModalData(modal, item, attach) {
    modal.$body.find('[name=workName]').val(item.workName);
    modal.$body.find('[name=unit]').val(item.unit);
    modal.$body.find('[name=workContent]').val(item.workContent);
    modal.$body.find('[name=calcRule]').val(item.calcRule);
    modal.$body.find('[name=remark]').val(item.remark);
    initBalanceManger.getSubitemDetailFindByCidAndSidAttach({
        cntrId: item.cntrId,
        cntrSubitemId: item.id
    }, attach);
}

function initBalanceItemModalEvent(modal, item, attach) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var workName = modal.$body.find('[name=workName]').val();
        var unit = modal.$body.find('[name=unit]').val();
        var workContent = modal.$body.find('[name=workContent]').val();
        var calcRule = modal.$body.find('[name=calcRule]').val();
        var remark = modal.$body.find('[name=remark]').val();
        var id = item.id;
        var cntrId = item.cntrId;
        var attaches = attach.getAttaches();
        if (!workContent) {
            return alert('请输入项目名称')
        }
        if (!unit) {
            return alert('请输入单位');
        }
        if (!workContent) {
            return alert('请输入工作内容');
        }
        if (!calcRule) {
            return alert('请输入计算规则');
        }
        initBalanceManger.putBalanceAddSubItemObj({
            id: id,
            cntrId: cntrId,
            workContent: workContent,
            workName: workName,
            unit: unit,
            attaches: attaches,
            calcRule: calcRule,
            remark: remark
        }, modal);
    });
}

exports.initAttachSubItemEvent = function (dom) {
    dom.find('a').off('click').on('click', function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var parents = $(this).parents('.attach-item');
        if (type === 'delete') {
            parents.remove();
        } else if (type === 'review') {
            var item = $(this).parents('.attach-item').data('item');
            var review = new ReviewImage(item.attachUrl, '附件查看');
            review.show();
        }
    })
}