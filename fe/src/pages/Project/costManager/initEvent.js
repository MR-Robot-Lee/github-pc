var common = require('../../Common');
var initCostManagerFunc = require('./initCostManagerFunc');
var Model = require('../../../components/Model');
var dataUpdateModal = require('./modal/dataUpdateModal.ejs');
var addCostData = require('./modal/addCostData.ejs');
var updateAccountsModal = require('./modal/updateAccountsModal.ejs');
var deleteModal = require('../costBudgetManager/modal/deleteModal.ejs');
var EvaluationReportModal = require('../costBudgetManager/modal/EvaluationReportModal.ejs');

var MaterialManagerNoCntrCostApply = require('./modal/MaterialManagerNoCntrCostApply.ejs');
var MaterialManagerCntrCostApply = require('./modal/MaterialManagerCntrCostApply.ejs');
var reimbursementOfExpensesModal = require('./modal/reimbursementOfExpensesModal.ejs');
var payableAccountModal = require('./modal/payableAccountModal.ejs');
var AdvanceApplicationModal = require('./modal/AdvanceApplicationModal.ejs');
var applyMoneyModal = require('./modal/applyMoneyModal.ejs');
var duepayModal = require('./modal/duePayModal.ejs');
var approvalProcess = require('../../../components/approvalProcess');
var materialPayOrderManager = require('../materialManager/modal/materialPayOrderNoBudgetManager.ejs');
var materialCostOrderManager = require('../materialManager/modal/materialCostOrderManager.ejs');
var materialPurchContractModal = require('../materialManager/modal/materialPurchContractModal.ejs');
var payAbledMoneyModal = require('./modal/payAbledMoneyModal.ejs');
var checkOutTurnModel = require('./modal/checkOutTurnModal.ejs');
var payMoneyRecordModal = require('./modal/payMoneyRecordModal.ejs');
var materialCostCheckModal = require('./modal/materialCostCheckModal.ejs');
var initMaterialManger = require('../materialManager/initMaterialManager');
var checkApproval = require('../../../components/checkApproval');
var projectInitEvent = require('../initEvent');
var checkPayAbledMoneyModal = require('./modal/checkPayAbledMoneyModal.ejs');
var checkSettleModal = require('./modal/checkSettleModal.ejs');
var costManagerApi = require('./costManagerApi');

/**
 * 财务动态事件
 */
exports.initFinancialStatusEvent = function () {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    var totalReceivableUpdate = $('#totalReceivableUpdate');
    if (totalReceivableUpdate.length > 0 && !totalReceivableUpdate.data('flag')) {
        totalReceivableUpdate.data('flag', true);
        totalReceivableUpdate.click(function (e) {
            common.stopPropagation(e);
            var updateModal = Model('总账更新', dataUpdateModal());
            updateModal.showClose();
            updateModal.show();
            initCostManagerFunc.getOutPutListFunc(updateModal);
            initTotalReceiveAbleUpdateEvent(updateModal);
        });
    }
    $('#editComments').click(function (e) {
        common.stopPropagation(e);
        var EvaluationModal = Model('评估意见', EvaluationReportModal());
        EvaluationModal.showClose();
        EvaluationModal.show();
        initCostManagerFunc.getEditAssessFunc(EvaluationModal);
        var userName = JSON.parse(localStorage.getItem('user')).employee.userName;
        if (userName) {
            $('.assess-time').html('评估人 : ' + userName + ' ' + new Date().Format("yyyy/MM/dd"));
        }
        EvaluationModal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var remark1 = EvaluationModal.$body.find('[name=remark1]').val();
            var remark2 = EvaluationModal.$body.find('[name=remark2]').val();
            var remark3 = EvaluationModal.$body.find('[name=remark3]').val();
            var remark4 = EvaluationModal.$body.find('[name=remark4]').val();
            if (!remark1) {
                return alert('指标完成评估');
            }
            if (!remark2) {
                return alert('决策参考建议');
            }
            if (!remark3) {
                return alert('风险管控评估');
            }
            if (!remark4) {
                return alert('影响成本主要因素');
            }
            initCostManagerFunc.postEditAssessFunc({
                remark1: remark1,
                remark2: remark2,
                remark3: remark3,
                remark4: remark4
            }, EvaluationModal);
        });
    });
};

/**
 * 总账添加数据
 */
function initTotalReceiveAbleUpdateEvent() {
    var modal = arguments[0];
    modal.$body.find('#addCost').click(function (e) {
        common.stopPropagation(e);
        var addCostModal = Model('添加数据', addCostData());
        addCostModal.showClose();
        addCostModal.show();
        addCostModal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var baseType = $('[name=baseType]').val();
            var addTime = $('[name=addTime]').val();
            var outputMoney = $('[name=outputMoney]').val();
            if (!baseType || baseType === 'a') {
                return alert('请选择名称')
            }
            if (!addTime) {
                return alert('请选择时间');
            }
            if (!outputMoney || isNaN(outputMoney)) {
                return alert('请输入正确的金额');
            }
            initCostManagerFunc.postOutPutObjFunc({
                baseType: baseType,
                addTime: addTime,
                outputMoney: outputMoney
            }, addCostModal, modal);
        });
    });

}


/**
 * 费用汇总
 */
exports.initFinancialCostEvent = function (page) {
    var modalSearch = $('#modalSearch');
    if (modalSearch.length > 0 && !modalSearch.data('flag')) {
        modalSearch.data('flag', true);

        modalSearch.click(function (e) {
            common.stopPropagation(e);
            var subProject = $('#subProject').val();
            var from = $('.from').val();
            var keywords = $('.keywords').val().trim();
            var cntrNo = $('.cntrNo ').val().trim();//合同编号
            var mtrlPlanNo = $('.mtrlPlanNo ').val();//材料计划单号
            var data = {
                subProjId: subProject,
                fundResc: from,

            };
            if (cntrNo) {
                data.cntrNo = cntrNo;
            }
            if (mtrlPlanNo) {
                data.mtrlPlanNo = mtrlPlanNo;
            }
            if (keywords) {
                data.keywords = keywords;
            }
            initCostManagerFunc.initFinancialCostFunc(data, page);
        });

        $('.icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
        })
    }
};

/**
 * 应付账款事件
 */
exports.initFinancialPayEvent = function (page) {
    var modalSearch = $('#modalSearch');
    if (modalSearch.length > 0 && !modalSearch.data('flag')) {
        modalSearch.data('flag', true);
        modalSearch.click(function (e) {
            common.stopPropagation(e);
            var subProject = $('#subProject').val();
            var from = $('.from').val();
            var payableStatus = $('.payableStatus').val();
            var keywords = $('.keywords').val().trim();
            var cntrNo = $('.cntrNo ').val().trim();//合同编号
            var data = {
                subProjId: subProject,
                fundResc: from,
                payableStatus: payableStatus
            };
            if (keywords) {
                data.keywords = keywords;
            }
            if (cntrNo) {
                data.cntrNo = cntrNo;
            }
            initCostManagerFunc.initFinancialPayFunc(data, page);
        });
        $('.icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
        });
    }
};

/**
 * 我的财务
 */
exports.initFinancialMeEvent = function (page) {
    var modalSearch = $('#modalSearch');
    if (modalSearch.length > 0 && !modalSearch.data('flag')) {
        modalSearch.data('flag', true);
        modalSearch.click(function (e) {
            common.stopPropagation(e);
            var from = $('.billStatus').val();
            var keywords = $('.keywords').val().trim();
            var cntrNo = $('.cntrNo ').val().trim();
            var fundResc = $('.fundResc ').val();

            var data = {
                billStatus: from
            };
            if (keywords) {
                data.keywords = keywords;
            }
            if (cntrNo) {
                data.cntrNo = cntrNo;
            }
            if (fundResc) {
                data.fundResc = fundResc;
            }
            initCostManagerFunc.initFinancialMeFunc(data, page);
        });
        $('#reimbursementApply').click(function (e) {
            common.stopPropagation(e);
            reimbursementEvent();
        });
        $('#prepayments').click(function (e) {
            common.stopPropagation(e);
            payMoneyEvent();
        });
        $('#duepayments').click(function (e) {
            common.stopPropagation(e);
            var payAbledMoney = Model('应付账款申请', payAbledMoneyModal());
            payAbledMoney.showClose();
            payAbledMoney.show();
            payAbledMoney.$header.hide();
            duepayEvent(payAbledMoney);
            // initPayAbledMoneyData(payAbledMoney, item);
            // initPayAbledMoneyEvent(payAbledMoney, item);
            initPayAbledMoneyEvent(payAbledMoney);
        });
        $('.icon-close').click(function (e) {
            common.stopPropagation(e);
            $('.knowledge-detail').removeClass('active');
        })
    }
};

/**
 * 结算/应付款申请
 * @param item
 */
function duepayEvent(modal) {
    modal.$body.find('.approvalFund').click(function (e) {
        common.stopPropagation(e);
        var payFundModal = Model('申请款项', duepayModal());
        payFundModal.showClose();
        payFundModal.show();
        var data = {
            subProjId: 0,
            fundResc: 0,
            pageSize: 10000,
            payableStatus: 2
        };
        // 获取 申请款项数据
        costManagerApi.getFinancialPayList(data).then(function (res) {
            var list = [];
            var user = JSON.parse(localStorage.getItem('user'));
            for(var j = 0;j < res.data.data.length; j++){
                if(res.data.data[j].chargeUserName === user.employee.userName){
                    list.push(res.data.data[j]);
                }
            }
            for (var i = 0; i < list.length; i++) {
                var dom = $('<tr>' +
                    '<td class="border">' +
                    '<input type="checkbox">' +
                    '</td>' +
                    '<td class="border">' + list[i].fundRescName + '</td>' +
                    '<td class="border">' + list[i].costNo + '</td>' +
                    '<td class="border">' + list[i].costName + '</td>' +
                    '<td class="border">' + list[i].entpName + '</td>' +
                    '<td class="border">' + list[i].settlePrice + '</td>' +
                    '<td class="border">' + list[i].lastPayablePrice + '</td>' +
                    '<td class="border">' +
                    '<a class="confirm-hover" data-type="balance">结算</a>' +
                    '<div style="margin: 0 5px;" class="icon-line"></div>' +
                    '<a class="confirm-hover" data-type="history">历史</a>' +
                    '</td>' +
                    '</tr>');
                dom.data('item', list[i]);
                dom.appendTo($('#approvalFundTable'));
            }
            // 模拟单选
            payFundModal.$body.find('input').change(function(){
                var checked = $(this).prop('checked');
                payFundModal.$body.find('input').prop('checked',false);
                if(checked){
                    $(this).prop('checked',true);
                }
            })
            // 申请款项 确定
            payFundModal.$body.find('.confirm').click(function(e){
                common.stopPropagation(e);
                var flag = true;
                $('#approvalFundTable').find('input').each(function(){
                    if($(this).prop('checked')){
                        flag = false;
                        var item = $(this).parents('tr').data('item');
                        initCostManagerFunc.getFinancePayabledFunc(item.id, modal);
                        $('.approvalFund').data('item',item);
                        payFundModal.hide();
                    }
                })
                if(flag){
                    alert('请选择申请款项');
                }
            })
            // 初始化 结算、历史
            _initFinancialPayAbledEvent($('#approvalFundTable'));
        });
    })
}

/**
 * 预付款申请
 * @param item
 */
function payMoneyEvent(item, pItem) {
    var payModal = Model('预付款申请', payableAccountModal());
    payModal.$header.hide();
    payModal.showClose();
    payModal.show();
    var importContract = payModal.$body.find('.importContract');
    var applyMoney = payModal.$body.find('.applyMoney');
    var confirm = payModal.$body.find('.confirm');
    if (!item) {
        payMoneyClickEvent(importContract, applyMoney, confirm, payModal);
        importContract.show();
        applyMoney.show();
        confirm.show();
    } else if (item.financeMyBill.billStatus === 1) {
        payMoneyClickEvent(importContract, applyMoney, confirm, payModal);
        importContract.show();
        applyMoney.show();
        confirm.show();
    } else if (item.financeMyBill.billStatus === 2 || item.financeMyBill.billStatus === 3 || item.financeMyBill.billStatus === 4) {
        var entp = item.entp || {};
        var cntr = item.cntr || {};
        var financeMyBill = item.financeMyBill;
        if (financeMyBill.billStatus === 4) {
            payMoneyClickEvent(importContract, applyMoney, confirm, payModal, pItem);
            importContract.show();
            applyMoney.show();
            confirm.show();
            $('.payInfo').show();
            importContract.data('item', cntr);
        } else {
            importContract.hide();
            applyMoney.hide();
            confirm.hide();
            $('.payInfo').hide();
        }
        if (cntr.taxType === 1) {
            payModal.$body.find('[name=contractTaxMoney]').val(cntr.cntrPrice);
        } else {
            payModal.$body.find('[name=contractTaxMoney]').val(0);
        }
        payModal.$body.find('[name=cntrNo]').val(cntr.cntrNo);
        payModal.$body.find('[name=cntrPrice]').val(cntr.cntrPrice);
        payModal.$body.find('[name=taxType][value=' + cntr.taxType + ']').prop('checked', true);
        payModal.$body.find('[name=entpName]').val(entp.entpName);
        payModal.$body.find('[name=entpPhone]').val(entp.phone);
        payModal.$body.find('[name=contactName]').val(entp.contactName);
        payModal.$body.find('[name=openBank]').val(entp.openBank);
        payModal.$body.find('[name=openName]').val(entp.openName);
        payModal.$body.find('[name=bankCard]').val(entp.bankCard);
        payModal.$body.find('[name=billMoney]').val(financeMyBill.billMoney);
        payModal.$body.find('[name=taxMoney]').val(financeMyBill.taxMoney);
        payModal.$body.find('[name=costName]').val(financeMyBill.costName);
        var alreadyPayMoney = item.alreadyPayMoney || {};
        payModal.$body.find('[name=prepayMoney]').val(alreadyPayMoney.payMoney);
        payModal.$body.find('[name=prepayTaxMoney]').val(alreadyPayMoney.payTaxMoney);
        totalMoney(payModal);//line-397
    }
}

function payMoneyClickEvent(importContract, applyMoney, confirm, modal, pItem) {
    importContract.click(function (e) {
        common.stopPropagation(e);
        var materialPurchContract = Model('导入合同', materialPurchContractModal());
        materialPurchContract.showClose();
        var contractType = materialPurchContract.$body.find('#contractType');
        contractType.show();
        contractType.find('select').change(function (e) {
            common.stopPropagation(e);
            var value = $(this).val();
            var data = {};
            data.cntrType = value;
            initCostManagerFunc.getFinanceContractPrepayFunc(data, materialPurchContract, function () {
                materialPurchContract.show();
            });
        });
        contractType.find('select').change();
        /**
         * 导入合同
         */
        materialPurchContract.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var radio = materialPurchContract.$body.find('.radio.active');
            if (radio.length === 0) {
                return alert('请选择导入的合同')
            }
            var item = radio.parents('.contract-item').data('item');
            modal.$body.find('[name=cntrNo]').val(item.cntrNo)
            modal.$body.find('[name=cntrPrice]').val(item.cntrPrice)
            if (item.taxType === 1) {
                modal.$body.find('[name=contractTaxMoney]').val(item.cntrPrice);
            } else {
                modal.$body.find('[name=contractTaxMoney]').val(0);
            }
            modal.$body.find('[name=entpName]').val(item.enterpBase.entpName);
            modal.$body.find('[name=contactName]').val(item.enterpBase.contactName);
            modal.$body.find('[name=entpPhone]').val(item.enterpBase.phone);
            modal.$body.find('[name=openBank]').val(item.enterpBase.openBank);
            modal.$body.find('[name=openName]').val(item.enterpBase.openName);
            modal.$body.find('[name=bankCard]').val(item.enterpBase.bankCard);
            modal.$body.find('[name=prepayMoney]').val(item.prepayMoney);
            modal.$body.find('[name=prepayTaxMoney]').val(item.prepayTaxMoney);
            modal.$body.find('[name=taxType][value=' + item.taxType + ']').prop('checked', true);
            totalMoney(modal);
            importContract.data('item', item);
            materialPurchContract.hide();
        });
    });
    applyMoney.click(function (e) {
        common.stopPropagation(e);
        modal.$body.find('#applyMoneyData').html('');
        var applyMoney = $(applyMoneyModal());
        applyMoney.find('.costName').val(modal.$body.find('[name=costName]').val());
        applyMoney.find('.billMoney').val(modal.$body.find('[name=billMoney]').val());
        applyMoney.find('.taxMoney').val(modal.$body.find('[name=taxMoney]').val());
        applyMoney.appendTo(modal.$body.find('#applyMoneyData'));
        applyMoney.find('.icon-close').click(function (e) {
            common.stopPropagation(e);
            modal.$body.find('#applyMoneyData').html('');
        });
        applyMoney.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var costName = applyMoney.find('.costName').val();
            var billMoney = applyMoney.find('.billMoney').val();
            var taxMoney = applyMoney.find('.taxMoney').val();
            if (!costName) {
                return alert('请填写申请单名称');
            }
            if (!billMoney) {
                return alert('请填写本次支付金额');
            }
            if (!taxMoney) {
                return alert('请填写本次提供税票');
            }
            modal.$body.find('[name=costName]').val(costName);
            modal.$body.find('[name=billMoney]').val(billMoney);
            modal.$body.find('[name=taxMoney]').val(taxMoney);
            totalMoney(modal);
            modal.$body.find('#applyMoneyData').html('');
        });
    });
    confirm.click(function (e) {
        common.stopPropagation(e);
        var approval = new approvalProcess('预付款申请审批', function () {
            var _item = approval.getSelectData();
            var id = ''
            if (pItem) {
                id = pItem.id;
            }
            var contrNo = importContract.data('item');
            var costName = modal.$body.find('[name=costName]').val();
            var billMoney = modal.$body.find('[name=billMoney]').val();
            var taxMoney = modal.$body.find('[name=taxMoney]').val();
            if (!_item) {
                return alert('请创建模版');
            }
            if (!contrNo) {
                return alert('请导入合同');
            }
            if (!costName) {
                return alert('请导入申请单名称');
            }
            if (!billMoney) {
                return alert('请导入本次支付金额');
            }
            if (!taxMoney) {
                return alert('请导入本次提供税票');
            }
            if (id) {
                initCostManagerFunc.putMyBillPrepareMoneyFunc({
                    billMoney: billMoney,
                    cntrId: contrNo.id,
                    id: id,
                    costName: costName,
                    costType: 8,
                    taxMoney: taxMoney,
                    tmplId: _item.id
                }, modal, approval)
            } else {
                initCostManagerFunc.postMyBillPrepareMoneyFunc({
                    billMoney: billMoney,
                    cntrId: contrNo.id,
                    costName: costName,
                    costType: 8,
                    taxMoney: taxMoney,
                    tmplId: _item.id
                }, modal, approval)
            }
        });
        approval.getApprovalModal(7)
    })
}

function totalMoney(modal) {
    var totalMoney = 0;
    var totalTaxMoney = 0;
    var prepayMoney = modal.$body.find('[name=prepayMoney]').val();
    var prepayTaxMoney = modal.$body.find('[name=prepayTaxMoney]').val();
    var billMoney = modal.$body.find('[name=billMoney]').val();
    var taxMoney = modal.$body.find('[name=taxMoney]').val();
    if (prepayMoney && billMoney && !isNaN(prepayMoney) && !isNaN(billMoney)) {
        totalMoney = parseFloat(prepayMoney) + parseFloat(billMoney);
        modal.$body.find('[name=totalMoney]').val(totalMoney.toFixed(2))
    }
    if (prepayTaxMoney && taxMoney && !isNaN(prepayTaxMoney) && !isNaN(taxMoney)) {
        totalTaxMoney = parseFloat(prepayTaxMoney) + parseFloat(taxMoney);
        modal.$body.find('[name=totalTaxMoney]').val(totalTaxMoney.toFixed(2))
    }
}

/**
 * 申请金额
 * @param item
 */
function reimbursementEvent(item) {
    var reimbursementModal = Model('间接费报销申请', reimbursementOfExpensesModal());
    reimbursementModal.showClose();
    reimbursementModal.show();
    if (!item) {
        reimbursementModal.$body.find('.confirm').show();
    } else if (item.billStatus === 1 || item.billStatus === 4) {
        reimbursementModal.$body.find('[name=costType]').val(item.overHeadTypeName);
        reimbursementModal.$body.find('[name=costName]').val(item.costName);
        reimbursementModal.$body.find('[name=billMoney]').val(item.billMoney);
        reimbursementModal.$body.find('[name=taxMoney]').val(item.taxMoney);
        reimbursementModal.$body.find('[name=costRemark]').val(item.costRemark);
        reimbursementModal.$body.find('.confirm').show();
    } else if (item.billStatus === 2 || item.billStatus === 3) {
        reimbursementModal.$body.find('[name=subProjId]').attr('disabled', true);
        reimbursementModal.$body.find('[name=costType]').val(item.overHeadTypeName);
        reimbursementModal.$body.find('[name=costType]').attr('disabled', true);
        reimbursementModal.$body.find('[name=costName]').val(item.costName);
        reimbursementModal.$body.find('[name=costName]').attr('disabled', true);
        reimbursementModal.$body.find('[name=billMoney]').val(item.billMoney);
        reimbursementModal.$body.find('[name=billMoney]').attr('disabled', true);
        reimbursementModal.$body.find('[name=taxMoney]').val(item.taxMoney);
        reimbursementModal.$body.find('[name=taxMoney]').attr('disabled', true);
        reimbursementModal.$body.find('[name=costRemark]').val(item.costRemark);
        reimbursementModal.$body.find('[name=costRemark]').attr('disabled', true);
        reimbursementModal.$body.find('.confirm').hide();
    }
    reimbursementModal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var approval = new approvalProcess('费用报销单审批', function () {
            var _item = approval.getSelectData();
            var id = '';
            if (item && item.billStatus === 4) {
                id = item.id;
            }
            var costType = reimbursementModal.$body.find('[name=costType]').val();
            var costName = reimbursementModal.$body.find('[name=costName]').val();
            var billMoney = reimbursementModal.$body.find('[name=billMoney]').val();
            var taxMoney = reimbursementModal.$body.find('[name=taxMoney]').val();
            var costRemark = reimbursementModal.$body.find('[name=costRemark]').val();
            if (!_item) {
                return alert('请创建模版')
            }
            if (!costType || costType === 'a') {
                return alert('请选择费用类别');
            }
            if (!costName) {
                return alert('请收入费用名称');
            }
            if (!billMoney) {
                return alert('请收入报销金额');
            }
            if (!taxMoney) {
                return alert('请输入税票金额');
            }
            if (!costRemark) {
                return alert('请收入费用说明');
            }
            if (id) {
                initCostManagerFunc.putMyBillAccountFunc({
                    billMoney: billMoney,
                    costName: costName,
                    costType: 7,
                    id: id,
                    costRemark: costRemark,
                    overHeadTypeName: costType,
                    taxMoney: taxMoney,
                    tmplId: _item.id
                }, reimbursementModal, approval)
            } else {
                initCostManagerFunc.postMyBillAccountFunc({
                    billMoney: billMoney,
                    costName: costName,
                    costType: 7,
                    costRemark: costRemark,
                    overHeadTypeName: costType,
                    taxMoney: taxMoney,
                    tmplId: _item.id
                }, reimbursementModal, approval);
            }
        });
        approval.getApprovalModal(8);
    });
}

exports.initUpdateAccountModal = function (parents) {
    parents.find('[name=settleMoney]').keyup(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var reNum = /^\d+(\.\d{0,2})?$/;
        if (!reNum.test(value)) {
            $(this).val('');
        }
        var inputs = parents.find('[name=settleMoney]');
        var settleMoneys = 0;
        for (var i = 0; i < inputs.length; i++) {
            var _value = $(inputs[i]).val();
            if (_value) {
                settleMoneys += parseInt(_value);
            }
        }
        parents.find('.settleMoneys').val(settleMoneys);
    })
};

exports.initTotalAccountModal = function (parents, modal) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var id = $(this).parents('tr').data('item').id;
        var delModal = Model('提示', deleteModal());
        delModal.showClose();
        delModal.show();
        delModal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            initCostManagerFunc.delOutPutObjFunc(id, delModal, modal)
        });
    })
};

exports.initFinancialReportEvent = function () {
    var updateAccounts = $('#updateAccounts');
    if (updateAccounts.length > 0 && !updateAccounts.data('flag')) {
        updateAccounts.data('flag', true);
        updateAccounts.click(function (e) {
            common.stopPropagation(e);
            var updateModal = Model('决算更新', updateAccountsModal());
            updateModal.showClose();
            updateModal.show();
            initCostManagerFunc.getUpdateAccountsFunc(updateModal);
            updateModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var trs = updateModal.$body.find('tr.data');
                var list = [];
                var error = false;
                for (var i = 0; i < trs.length; i++) {
                    var item = $(trs[i]).data('item');
                    var settleMoney = $(trs[i]).find('[name=settleMoney]').val();
                    if (!settleMoney) {
                        error = true;
                        break;
                    }
                    list.push({subProjId: item.subProjId, settleMoney: settleMoney})
                }
                if (error) {
                    return alert('请输入分部结算金额');
                }
                initCostManagerFunc.putUpdateAccountsFunc({list: list}, updateModal);
            });
        });

    }
};


/**
 * 初始化费用汇总的 详情 跟 流程
 * @param parents
 */
exports.initFinancialCostSumEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'detail') {
            if (item.fundResc === 1) { // 报销审批
                var reimbursementModal = Model('费用报销申请单', reimbursementOfExpensesModal());
                reimbursementModal.showClose();
                reimbursementModal.show();
                hideModalConfirm(reimbursementModal);
                var subProjName = reimbursementModal.$body.find('[name=subProjName]');
                var costType = reimbursementModal.$body.find('[name=costType]');
                var costName = reimbursementModal.$body.find('[name=costName]');
                var payMoney = reimbursementModal.$body.find('[name=billMoney]');
                var costRemark = reimbursementModal.$body.find('[name=costRemark]');
                var taxMoney = reimbursementModal.$body.find('[name=taxMoney]');
                $('<option>' + item.subProjName + '</option>').appendTo(subProjName);
                subProjName.attr('disabled', true);
                var _costRemark = item.costRemark || '无'
                costType.val(item.overHeadTypeName);
                costName.val(item.costName);
                payMoney.val(item.payMoney);
                costRemark.val(_costRemark);
                taxMoney.val(item.taxMoney);
                costName.attr('disabled', true);
                costType.attr('disabled', true);
                payMoney.attr('disabled', true);
                costRemark.attr('disabled', true);
                taxMoney.attr('disabled', true);
            } else if (item.fundResc === 2) { //应付款来源
                var checkPayAbledMoney = Model('预付款查看', checkPayAbledMoneyModal())
                checkPayAbledMoney.show();
                checkPayAbledMoney.showClose();
                initCostManagerFunc.getFinanceCostFunc(item.id, checkPayAbledMoney);
            } else if (item.fundResc === 3) {
                if (item.cntrId) {
                    var MaterialManagerModal = Model('材料管理(实付款有合同)费用报销单', MaterialManagerCntrCostApply());
                    MaterialManagerModal.showClose();
                    MaterialManagerModal.show();
                    hideModalConfirm(MaterialManagerModal);
                    initCostManagerFunc.getFinanceCostFunc(item.id, null, function (_data) {
                        var financeCost = _data.financeCost || {};
                        var mtrlPlan = _data.mtrlPlan || {};
                        var cntr = _data.cntr || {};
                        var mtrlCost = _data.mtrlCost || {};
                        var entp = _data.entp || {};
                        MaterialManagerModal.$body.find('.subProjName').html(financeCost.subProjName);
                        MaterialManagerModal.$body.find('.costName').html(financeCost.costName);
                        MaterialManagerModal.$body.find('.costNo').html(financeCost.costNo);
                        MaterialManagerModal.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName);//材料单
                        MaterialManagerModal.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo);//材料单
                        MaterialManagerModal.$body.find('.prchUserName').html(mtrlPlan.prchUserName);
                        MaterialManagerModal.$body.find('.recObjName').html(financeCost.operatorName);
                        MaterialManagerModal.$body.find('.costMoney').html(financeCost.payMoney)
                        MaterialManagerModal.$body.find('.taxMoney').html(financeCost.taxMoney);
                        MaterialManagerModal.$body.find('.costRemark').html(financeCost.costRemark || '无');
                        if (cntr.id) {
                            MaterialManagerModal.$body.find('.openBank').html(entp.openBank);
                            MaterialManagerModal.$body.find('.openName').html(entp.openName);
                            MaterialManagerModal.$body.find('.bankCard').html(entp.bankCard);
                            MaterialManagerModal.$body.find('.contactName').html(entp.contactName);
                            MaterialManagerModal.$body.find('.cntrName').html(cntr.cntrName);
                            MaterialManagerModal.$body.find('.cntrNo').html(cntr.cntrNo);
                            MaterialManagerModal.$body.find('.cntrPrice').html(cntr.cntrPrice);
                            MaterialManagerModal.$body.find('.payTypeDesc').html(cntr.payTypeDesc);
                            MaterialManagerModal.$body.find('.ensureMoney').html(cntr.ensurePer + '%');
                            MaterialManagerModal.$body.find('.ensureMonth').html(cntr.ensureMonth + '个月');
                            MaterialManagerModal.$body.find('.entpName').html(cntr.cntrParty);
                            var taxType = cntr.taxType === 1 ? "是" : '否';
                            MaterialManagerModal.$body.find('[name=taxType]').html(taxType);
                        }
                        MaterialManagerModal.$body.find('.costNo').html(mtrlCost.costNo);
                        MaterialManagerModal.$body.find('.subProjName').html(mtrlCost.subProjName);
                        MaterialManagerModal.$body.find('.costMoney').html(mtrlCost.costMoney);
                        MaterialManagerModal.$body.find('.taxMoney').html(mtrlCost.taxMoney);
                        MaterialManagerModal.$body.find('.entprName').html(mtrlCost.entprName);
                        MaterialManagerModal.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName);
                        MaterialManagerModal.$body.find('.recObjName').html(mtrlPlan.prchUserName);
                        MaterialManagerModal.$body.find('.chargeUserName').html(mtrlCost.chargeUserName);
                        MaterialManagerModal.$body.find('.checkUserName').html(mtrlPlan.checkUserName);
                        MaterialManagerModal.$body.find('.prchUserName').html(mtrlPlan.prchUserName);
                        MaterialManagerModal.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo);
                        MaterialManagerModal.$body.find('.checkMoney').html(mtrlPlan.checkMoney);
                        MaterialManagerModal.$body.find('.checkTaxMoney').html(mtrlPlan.checkTaxMoney);
                        MaterialManagerModal.$body.find('.payableTaxMoney').html(mtrlCost.payableTaxMoney);
                        MaterialManagerModal.$body.find('.payableMoney').html(mtrlCost.payableMoney.toFixed(2));
                        MaterialManagerModal.$body.find('[name=ensureMoney]').val(mtrlCost.ensureMoney);
                        MaterialManagerModal.$body.find('[name=ensureMonth]').val(mtrlCost.ensureMonth);
                        var payedMoney = mtrlCost.prepayMoney || mtrlCost.bookMoney;
                        payedMoney = payedMoney ? '已支付金额:(' + payedMoney + '元)' : '已支付金额:(0元)';
                        MaterialManagerModal.$body.find('.payedMoney').html(payedMoney);
                        var payedTaxMoney = mtrlCost.prepayTaxMoney || mtrlCost.bookTaxMoney;
                        payedTaxMoney = payedTaxMoney ? '已提供税票:(' + payedTaxMoney + '元)' : '已提供税票:(0元)';
                        MaterialManagerModal.$body.find('.payedTaxMoney').html(payedTaxMoney);
                        var addTime = mtrlCost.addTime ? moment(mtrlCost.addTime).format('YYYY/MM/DD') : '- / - / -'
                        MaterialManagerModal.$body.find('.project-time').html(addTime);
                        if (type === 'cost') {
                            MaterialManagerModal.$body.find('.ensureMoney').val(cntr.ensurePer + "％");
                            MaterialManagerModal.$body.find('.ensureMonth').val(cntr.ensureMonth + '个月');
                            MaterialManagerModal.$body.find('.ensurePayMoney').html(mtrlCost.ensureMoney + "元");
                            MaterialManagerModal.$body.find('.ensurePayMonth').html(mtrlCost.ensureMonth + "个月");
                            MaterialManagerModal.$body.find('.remark').html(mtrlCost.remark || '');
                            MaterialManagerModal.$body.find('.costName').html(mtrlCost.costName);
                        } else {
                            MaterialManagerModal.$body.find('[name=remark]').val(mtrlCost.remark || "");
                            MaterialManagerModal.$body.find('[name=costName]').val(mtrlCost.costName);
                        }
                    })
                } else {
                    var MaterialManagerNoCntrModal = Model('材料管理(实付款无合同)费用报销单', MaterialManagerNoCntrCostApply());
                    MaterialManagerNoCntrModal.showClose();
                    MaterialManagerNoCntrModal.show();
                    hideModalConfirm(MaterialManagerNoCntrModal);
                    initCostManagerFunc.getFinanceCostFunc(item.id, null, function (_data) {
                        var financeCost = _data.financeCost || {};
                        var mtrlPlan = _data.mtrlPlan || {};
                        MaterialManagerNoCntrModal.$body.find('.subProjName').html(financeCost.subProjName);
                        MaterialManagerNoCntrModal.$body.find('.costName').html(financeCost.costName);
                        MaterialManagerNoCntrModal.$body.find('.costNo').html(financeCost.costNo);
                        MaterialManagerNoCntrModal.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName);//材料单
                        MaterialManagerNoCntrModal.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo);//材料单
                        MaterialManagerNoCntrModal.$body.find('.prchUserName').html(mtrlPlan.prchUserName);
                        MaterialManagerNoCntrModal.$body.find('.recObjName').html(financeCost.operatorName);
                        MaterialManagerNoCntrModal.$body.find('.costMoney').html(financeCost.payMoney)
                        MaterialManagerNoCntrModal.$body.find('.taxMoney').html(financeCost.taxMoney);
                        MaterialManagerNoCntrModal.$body.find('.costRemark').html(financeCost.costRemark || '无');
                    })
                }
            } else if (item.fundResc === 4) {
                var checkpayAbledMoney = Model('材料应付款', payAbledMoneyModal()); //
                checkpayAbledMoney.show();
                checkpayAbledMoney.$body.find('.approvalMoney').hide();
                checkpayAbledMoney.$body.find('.confirm').hide();
                checkpayAbledMoney.$body.find('.payInfo').hide();
                //checkpayAbledMoney.showClose();
                checkpayAbledMoney.$header.hide();
                initCostManagerFunc.getFinanceCostFunc(item.id, checkpayAbledMoney);
            } else if (item.fundResc === 5) { // 结算应付款
                var settleAbledMoney = Model('结算应付款', payAbledMoneyModal());
                settleAbledMoney.$header.hide();
                settleAbledMoney.show();
                settleAbledMoney.$body.find('.approvalMoney').hide();
                settleAbledMoney.$body.find('.confirm').hide();
                settleAbledMoney.$body.find('.payInfo').hide();
                //settleAbledMoney.showClose();
                initCostManagerFunc.getFinanceCostFunc(item.id, settleAbledMoney);
            }
        } else {
            $('.knowledge-detail').addClass('active');
            var innerType = getInnerType(item.fundResc);
            checkApproval.getInnerType(item.mtrlCostId, innerType, parents);
        }
    });
};

function getInnerType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return 8;
        case 2:
            return 7;
        case 3:
            return 5;
        case 4:
            return 6;
        case 5:
            return 6;
    }
}

function hideModalConfirm(modal) {
    modal.$body.find('.confirm').hide();
}

/**
 * 我的财务table 事件
 * @param parents
 */
exports.initFinancialMeTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        var that = this;
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'approval') {
            $('.knowledge-detail').addClass('active');
            var id = ''
            if (item.fundResc === 3) {
                id = item.mtrlCostId
            } else {
                id = item.id;
            }
            var innerType = getInnerType(item.fundResc);
            checkApproval.getInnerType(id, innerType, $('.knowledge-detail'));
        } else {
            if (item.fundResc === 1) { //报销款申请
                reimbursementEvent(item);
            } else if (item.fundResc === 2) {//预付款申请
                initCostManagerFunc.getMyBillDetailFindByIdFunc(item.id, function (_item) {
                    payMoneyEvent(_item, item); // todo
                });
            } else if (item.fundResc === 3) {//实付款申请
                initCostManagerFunc.getMyBillDetailFindByIdFunc(item.id, function (_item) {
                    if (item.cntrId) {//有合同
                        payMoneyMaterialCostOrderEvent(_item);
                    } else {//无合同
                        payMoneyMaterialNoCntrCostOrderEvent(_item);
                    }
                });
            } else if (item.fundResc === 4 || item.fundResc === 5) {//应付款申请
                initCostManagerFunc.getMyBillDetailFindByIdFunc(item.id, function (_item) {
                    _item.financeMyBill.billStatus = 3;
                    var payAbledMoney = Model(null, payAbledMoneyModal());
                    if(item.billStatus === 4){
                        duepayEvent(payAbledMoney);
                        initPayAbledMoneyEvent(payAbledMoney, that);
                    } else {
                        payAbledMoney.$body.find('.payApplyMenus').hide();
                        payAbledMoney.$body.find('.confirm').hide();
                        payAbledMoney.$body.find('.payInfo').hide();
                    }
                    payAbledMoney.$header.hide();
                    payAbledMoney.show();
                    var entp = _item.entp || {};
                    var financeMyBill = _item.financeMyBill || {};
                    var mtrlCost = _item.mtrlCost || {};
                    var settleCost = _item.settleCost || {};
                    var costNo, costMoney, taxMoney;
                    if (item.fundResc === 4) {
                        costNo = mtrlCost.costNo;
                        costMoney = mtrlCost.costMoney;
                        taxMoney = mtrlCost.costMoney;
                    } else if (item.fundResc === 5) {
                        costNo = settleCost.costNo;
                        costMoney = settleCost.costMoney;
                        taxMoney = settleCost.costMoney;
                    }
                    payAbledMoney.$body.find('[name=entpName]').val(entp.entpName);
                    payAbledMoney.$body.find('[name=costNo]').val(costNo);
                    payAbledMoney.$body.find('[name=payablePrice]').val(costMoney);
                    payAbledMoney.$body.find('[name=payableTax]').val(taxMoney);
                    payAbledMoney.$body.find('[name=contactName]').val(entp.contactName);
                    payAbledMoney.$body.find('[name=openName]').val(entp.openName);
                    payAbledMoney.$body.find('[name=openBank]').val(entp.openBank);
                    payAbledMoney.$body.find('[name=bankCard]').val(entp.bankCard);
                    payAbledMoney.$body.find('[name=costName]').val(financeMyBill.costName);
                    payAbledMoney.$body.find('[name=billMoney]').val(financeMyBill.billMoney);
                    payAbledMoney.$body.find('[name=taxMoney]').val(financeMyBill.taxMoney);
                    payAbledMoney.$body.find('[name=entpPhone]').val(entp.phone);
                });
            }
            /*else if () {//应付款申请 1报销 2预付款 3材料实付款 4材料应付款 5结算款
                   initCostManagerFunc.getMyBillDetailFindByIdFunc(item.id, function (_item) {
                     _item.financeMyBill.billStatus = 3;
                     payMoneyEvent(_item, item);
                   });
                 }*/
        }
    })
};

function payMoneyMaterialCostOrderEvent(childItem) {
    var MaterialManagerModal = Model('材料管理(实付款有合同)费用报销单', MaterialManagerCntrCostApply());
    MaterialManagerModal.showClose();
    MaterialManagerModal.show();
    hideModalConfirm(MaterialManagerModal);
    var financeMyBill = childItem.financeMyBill || {};
    var mtrlPlan = childItem.mtrlPlan || {};
    var cntr = childItem.cntr || {};
    var mtrlCost = childItem.mtrlCost || {};
    var entp = childItem.entp || {};
    MaterialManagerModal.$body.find('.subProjName').html(financeMyBill.subProjName);
    MaterialManagerModal.$body.find('[name=costName]').val(financeMyBill.costName);
    MaterialManagerModal.$body.find('.costNo').html(financeMyBill.costNo);
    MaterialManagerModal.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName);//材料单
    MaterialManagerModal.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo);//材料单
    MaterialManagerModal.$body.find('.prchUserName').html(mtrlPlan.prchUserName);
    MaterialManagerModal.$body.find('.recObjName').html(financeMyBill.operatorName);
    MaterialManagerModal.$body.find('.costMoney').html(financeMyBill.payMoney);
    MaterialManagerModal.$body.find('.taxMoney').html(financeMyBill.taxMoney);
    MaterialManagerModal.$body.find('.costRemark').html(mtrlCost.remark || '无');
    if (cntr.id) {
        MaterialManagerModal.$body.find('.openBank').html(entp.openBank);
        MaterialManagerModal.$body.find('.openName').html(entp.openName);
        MaterialManagerModal.$body.find('.bankCard').html(entp.bankCard);
        MaterialManagerModal.$body.find('.contactName').html(entp.contactName);
        MaterialManagerModal.$body.find('.cntrName').html(cntr.cntrName);
        MaterialManagerModal.$body.find('.cntrNo').html(cntr.cntrNo);
        MaterialManagerModal.$body.find('.cntrPrice').html(cntr.cntrPrice);
        MaterialManagerModal.$body.find('.payTypeDesc').html(cntr.payTypeDesc);
        MaterialManagerModal.$body.find('.ensureMoney').html(cntr.ensurePer + '%');
        MaterialManagerModal.$body.find('.ensureMonth').html(cntr.ensureMonth + '个月');
        MaterialManagerModal.$body.find('.entpName').html(cntr.cntrParty);
        var taxType = cntr.taxType === 1 ? "是" : '否';
        MaterialManagerModal.$body.find('[name=taxType]').html(taxType);
    }
    MaterialManagerModal.$body.find('.costNo').html(mtrlCost.costNo);
    MaterialManagerModal.$body.find('.subProjName').html(mtrlCost.subProjName);
    MaterialManagerModal.$body.find('.costMoney').html(mtrlCost.costMoney);
    MaterialManagerModal.$body.find('.taxMoney').html(mtrlCost.taxMoney);
    MaterialManagerModal.$body.find('.entprName').html(mtrlCost.entprName);
    MaterialManagerModal.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName);
    MaterialManagerModal.$body.find('.recObjName').html(mtrlPlan.prchUserName);
    MaterialManagerModal.$body.find('.chargeUserName').html(mtrlCost.chargeUserName);
    MaterialManagerModal.$body.find('.checkUserName').html(mtrlPlan.checkUserName);
    MaterialManagerModal.$body.find('.prchUserName').html(mtrlPlan.prchUserName);
    MaterialManagerModal.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo);
    MaterialManagerModal.$body.find('.checkMoney').html(mtrlPlan.checkMoney);
    MaterialManagerModal.$body.find('.checkTaxMoney').html(mtrlPlan.checkTaxMoney);
    MaterialManagerModal.$body.find('.payableTaxMoney').html(mtrlCost.payableTaxMoney);
    MaterialManagerModal.$body.find('.payableMoney').html(mtrlCost.payableMoney.toFixed(2));
    MaterialManagerModal.$body.find('[name=ensureMoney]').val(mtrlCost.ensureMoney);
    MaterialManagerModal.$body.find('[name=ensureMonth]').val(mtrlCost.ensureMonth);
    var payedMoney = mtrlCost.prepayMoney || mtrlCost.bookMoney;
    payedMoney = payedMoney ? '已支付金额:(' + payedMoney + '元)' : '已支付金额:(0元)';
    MaterialManagerModal.$body.find('.payedMoney').html(payedMoney);
    var payedTaxMoney = mtrlCost.prepayTaxMoney || mtrlCost.bookTaxMoney;
    payedTaxMoney = payedTaxMoney ? '已提供税票:(' + payedTaxMoney + '元)' : '已提供税票:(0元)';
    MaterialManagerModal.$body.find('.payedTaxMoney').html(payedTaxMoney);
    var addTime = mtrlCost.addTime ? moment(mtrlCost.addTime).format('YYYY/MM/DD') : '- / - / -';
    MaterialManagerModal.$body.find('.project-time').html(addTime);
    MaterialManagerModal.$body.find('[name=remark]').val(mtrlCost.remark || '无');

    // MaterialManagerModal.$body.find('.ensureMoney').val(cntr.ensurePer + "％");
    // MaterialManagerModal.$body.find('.ensureMonth').val(cntr.ensureMonth + '个月');
    // MaterialManagerModal.$body.find('.ensurePayMoney').html(mtrlCost.ensureMoney + "元");
    // MaterialManagerModal.$body.find('.ensurePayMonth').html(mtrlCost.ensureMonth + "个月");
    // MaterialManagerModal.$body.find('.costName').html(mtrlCost.costName);
}

function payMoneyMaterialNoCntrCostOrderEvent(childItem) {
    var MaterialManagerNoCntrModal = Model('材料管理(实付款无合同)费用报销单', MaterialManagerNoCntrCostApply());
    MaterialManagerNoCntrModal.showClose();
    MaterialManagerNoCntrModal.show();
    hideModalConfirm(MaterialManagerNoCntrModal);
    var financeMyBill = childItem.financeMyBill || {};
    var mtrlCost = childItem.mtrlCost || {};

    var mtrlPlan = childItem.mtrlPlan || {};
    MaterialManagerNoCntrModal.$body.find('.subProjName').html(financeMyBill.subProjName);
    MaterialManagerNoCntrModal.$body.find('.costName').html(financeMyBill.costName);
    MaterialManagerNoCntrModal.$body.find('.costNo').html(financeMyBill.costNo);
    MaterialManagerNoCntrModal.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName);
    MaterialManagerNoCntrModal.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo);
    MaterialManagerNoCntrModal.$body.find('.prchUserName').html(mtrlPlan.prchUserName);
    MaterialManagerNoCntrModal.$body.find('.recObjName').html(financeMyBill.costName);
    MaterialManagerNoCntrModal.$body.find('.costMoney').html(financeMyBill.billMoney);
    MaterialManagerNoCntrModal.$body.find('.taxMoney').html(financeMyBill.taxMoney);
    MaterialManagerNoCntrModal.$body.find('.costRemark').html(mtrlCost.remark || '无');
}

function payAbleMoneyMaterialCostOrderEvent(item) {
    item = item ? item : {mtrlPlan: {}, financeMyBill: {}, entp: {}};
    var mtrlPlan = item.mtrlPlan;
    var financeMyBill = item.financeMyBill;
    var entp = item.entp;
    var materialCostManager = Model('查看结算', materialCostOrderManager());
    materialCostManager.showClose();
    materialCostManager.show();
    var $body = materialCostManager.$body;
    $body.find('.importContract').hide();
    $body.find('.payMoney').hide();
    $body.find('.approvalMaterial').hide();
    var taxType = entp.taxType === 1 ? '是' : '否';
    materialCostManager.$body.find('[name=taxType]').html(taxType)
    materialCostManager.$body.find('.subProjName').html(mtrlPlan.subProjName);
    materialCostManager.$body.find('[name=costName]').val(financeMyBill.costName);
    materialCostManager.$body.find('.costNo').html(financeMyBill.costNo);
    materialCostManager.$body.find('.prchUserName').html(mtrlPlan.prchUserName);
    materialCostManager.$body.find('.mtrlPlanName').html(mtrlPlan.mtrlPlanName);
    materialCostManager.$body.find('.mtrlPlanNo').html(mtrlPlan.mtrlPlanNo);
    materialCostManager.$body.find('.entprName').html(financeMyBill.recObjName);
    materialCostManager.$body.find('.taxMoney').html(financeMyBill.payableTaxMoney);
    materialCostManager.$body.find('.costMoney').html(financeMyBill.payableMoney.toFixed(2));
    // 合同
    materialCostManager.$body.find('.cntrName').html(entp.cntrName);
    materialCostManager.$body.find('.openBank').html(entp.openBank);
    materialCostManager.$body.find('.bankCard').html(entp.bankCard);
    materialCostManager.$body.find('.openName').html(entp.openName);
    materialCostManager.$body.find('.cntrNo').html(entp.cntrNo);
    materialCostManager.$body.find('.entpName').html(entp.entpName);
    materialCostManager.$body.find('.contactName').html(entp.contactName);
    materialCostManager.$body.find('.cntrName').html(entp.cntrName);
    // 应付账款 todo

}

/**
 * 财务 应付款 事件
 * @param parents
 */
exports.initFinancialPayAbledEvent = _initFinancialPayAbledEvent;
function _initFinancialPayAbledEvent(parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'pay') {
            // 材料 2 结算8
            var payAbledMoney = Model('应付账款申请', payAbledMoneyModal());
            payAbledMoney.showClose();
            payAbledMoney.show();
            payAbledMoney.$header.hide();
            initPayAbledMoneyData(payAbledMoney, item);
            initPayAbledMoneyEvent(payAbledMoney, item);
        } else if (type === 'balance') {
            if (item.fundResc === 4) {
                var materialCostCheck = Model('查看结算', materialCostCheckModal());
                materialCostCheck.$header.hide();
                materialCostCheck.showClose();
                initCheckMaterialManagerEvent(materialCostCheck, item);
            } else if (item.fundResc === 5) {
                var checkOUtTurn = Model('查看结算', checkOutTurnModel());
                checkOUtTurn.$header.hide();
                checkOUtTurn.showClose();
                checkOUtTurn.show();
                initCheckBalancManagerEvent(checkOUtTurn, item);
            }
        } else if (type === 'history') {
            var payMoneyRecord = Model('付款记录', payMoneyRecordModal());
            payMoneyRecord.showClose();
            payMoneyRecord.show();
            initPayMoneyRecordData(payMoneyRecord, item);
        } else if (type === 'approval') {
            var parents = $('.knowledge-detail');
            parents.addClass('active');
            var id = '';
            if (item.fundResc === 4) {
                id = item.mtrlCostId;
            } else {
                id = item.settleCostId;
            }
            var innerType = getPayableInnerType(item.fundResc);
            checkApproval.getInnerType(id, innerType, parents);
        }
    })
};

function getPayableInnerType(type) {
    type = parseInt(type);
    switch (type) {
        case 4:
            return 5;
        case 5:
            return 3;
    }
}

function initPayAbledMoneyData() {
    var modal = arguments[0];
    var item = arguments[1];
    initCostManagerFunc.getFinancePayabledFunc(item.id, modal)
}

function initPayAbledMoneyEvent(modal, that) {
    modal.$body.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        modal.hide();
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var item = $('.approvalFund').data('item');
        if(item){
            var approval = new approvalProcess('应付款申请', function () {
                var _item = approval.getSelectData();
                var costName = modal.$body.find('[name=costName]').val();
                var billMoney = modal.$body.find('[name=billMoney]').val();
                var taxMoney = modal.$body.find('[name=taxMoney]').val();
                if (!costName) {
                    return alert('请输入申请名称');
                }
                if (!billMoney) {
                    return alert('请输入支付金额');
                }
                if (!taxMoney) {
                    return alert('请输入税票金额');
                }
                if (that) {
                    initCostManagerFunc.putFinancialPayFunc({
                        costName: costName,
                        billMoney: billMoney,
                        taxMoney: taxMoney,
                        id: $(that).parents('tr').data('item').id,
                        payableId: item.id,
                        costType: item.fundResc === 4 ? 2 : 8,
                        tmplId: _item.id
                    }, modal, approval)
                } else {
                    initCostManagerFunc.postFinancialPayFunc({
                        costName: costName,
                        billMoney: billMoney,
                        taxMoney: taxMoney,
                        payableId: item.id,
                        costType: item.fundResc === 4 ? 2 : 8,
                        tmplId: _item.id
                    }, modal, approval)
                }
            });
            approval.getApprovalModal(6);
            approval.show()
        } else {
            alert('请先选择申请款项');
        }
    });
    modal.$body.find('.approvalMoney').click(function (e) {
        common.stopPropagation(e);
        var applyMoneyData = modal.$body.find('#applyMoneyData').html('')
        var applyMoney = $(applyMoneyModal());
        applyMoney.appendTo(applyMoneyData);
        applyMoney.css('right', '0px');
        var costName = modal.$body.find('[name=costName]').val();
        var billMoney = modal.$body.find('[name=billMoney]').val();
        var taxMoney = modal.$body.find('[name=taxMoney]').val();
        applyMoney.find('.costName').val(costName);
        applyMoney.find('.billMoney').val(billMoney);
        applyMoney.find('.taxMoney').val(taxMoney);
        applyMoney.find('.icon-close').click(function (e) {
            common.stopPropagation(e);
            applyMoneyData.html('');
        });
        applyMoney.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var costName = applyMoney.find('.costName').val();
            var billMoney = applyMoney.find('.billMoney').val();
            var taxMoney = applyMoney.find('.taxMoney').val();
            if (!costName) {
                return alert('请输入申请名称');
            }
            if (!billMoney || isNaN(billMoney)) {
                return alert('请输入支付金额');
            }
            if (!taxMoney || isNaN(taxMoney)) {
                return alert('请输入税票金额');
            }
            var payAbledMoney = modal.$body.find('[name=payAbledMoney]').val();// 结算金额
            var payTaxAbledMoney = modal.$body.find('[name=payTaxAbledMoney]').val();// 税票金额

            modal.$body.find('[name=costName]').val(costName);
            modal.$body.find('[name=billMoney]').val(billMoney);
            modal.$body.find('[name=taxMoney]').val(taxMoney);
            var payedMoney = parseFloat(payAbledMoney) + parseFloat(billMoney);
            var payedTaxMoney = parseFloat(payTaxAbledMoney) + parseFloat(taxMoney);
            payedMoney = payedMoney ? payedMoney.toFixed(2) : 0;
            payedTaxMoney = payedTaxMoney ? payedTaxMoney.toFixed(2) : 0;
            modal.$body.find('[name=payedMoney]').val(payedMoney);
            modal.$body.find('[name=payedTaxMoney]').val(payedTaxMoney);
            applyMoneyData.html('');
        });
    })
}

/**
 * 历史记录
 */
function initPayMoneyRecordData() {
    var modal = arguments[0];
    var item = arguments[1];
    initCostManagerFunc.getPayabledListHistoryFunc(item.id, modal);
}

/**
 * 结算查看
 */
function initCheckBalancManagerEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        modal.hide();
    });
    initCostManagerFunc.getSettleCostListFunc(item.cntrId, modal);
}

/**
 * 材料结算查看
 */
function initCheckMaterialManagerEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        modal.hide();
    });
    initMaterialManger.initGetMaterialCostOrderDetail({
        costId: item.mtrlCostId,
        mtrlPlanId: item.mtrlPlanId
    }, modal, function () {
        modal.show();
    }, 'cost');
}