var costManagerApi = require('./costManagerApi');
var renderCostManagerTable = require('./renderCostManagerTable');
var contractManager = require('../contractManager/contractApi');
var renderCostMaterialTable = require('../materialManager/renderCostMaterialTable')
var projectMainApi = require('../projectMainApi');

exports.initFinancialStatusFunc = function () {
    costManagerApi.getCostStatusList().then(function (res) {
        var obj = res.data ? res.data : {};
        renderCostManagerTable.renderCostStatusData(obj)
    })
};

exports.initFinancialCostFunc = function (data, page) {
    var that = this;
    costManagerApi.getCostSumList(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var subProject = $('#subProject').val();
            var from = $('.from').val();
            var keywords = $('.keywords').val().trim();
            var cntrNo = $('.cntrNo ').val();//合同编号
            var mtrlPlanNo = $('.mtrlPlanNo ').val();//材料计划单号
            _data.subProjId = subProject;
            _data.fundResc = from;

            if (keywords) {
                _data.keywords = keywords;
            }
            that.initFinancialCostFunc(_data, page);
        });
        renderCostManagerTable.renderFinancialCost(list);
    })
};

exports.initFinancialPayFunc = function (data, page) {
    var that = this;
    costManagerApi.getFinancialPayList(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var subProject = $('#subProject').val();
            var from = $('.from').val();
            var payableStatus = $('.payableStatus').val();
            var keywords = $('.keywords').val().trim();
            _data.subProjId = subProject;
            _data.fundResc = from;
            _data.payableStatus = payableStatus;
            if (keywords) {
                _data.keywords = keywords;
            }
            that.initFinancialPayFunc(_data, page);
        });
        renderCostManagerTable.renderFinancialPay(list);
    });
};

exports.initFinancialMeFunc = function (data, page) {
    var that = this;
    costManagerApi.getFinancialMyBill(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var from = $('.billStatus').val();
            var keywords = $('.keywords').val().trim();
            var cntrNo = $('.cntrNo ').val().trim();
            var fundResc = $('.fundResc ').val();
            _data.billStatus = from
            if (keywords) {
                _data.keywords = keywords;
            }
            if (cntrNo) {
                _data.cntrNo = cntrNo;
            }
            if (fundResc) {
                _data.fundResc = fundResc;
            }
            that.initFinancialMeFunc(_data, page);
        });
        renderCostManagerTable.renderFinancialMe(list);
    })
};

/**
 * 添加 总帐数据
 * @param data
 * @param modal
 * @param parentModal
 */
exports.postOutPutObjFunc = function (data, modal, parentModal) {
    var that = this;
    costManagerApi.postOutPutObj(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getOutPutListFunc(parentModal);
        }
    })
};
/**
 * 获取总账列表
 */
exports.getOutPutListFunc = function (modal) {
    costManagerApi.getOutPutList().then(function (res) {
        var list = res.data ? res.data : [];
        renderCostManagerTable.renderTotalAccountRender(list, modal);
    })
};
/**
 * 通过id删除总账列表
 * @param id
 * @param modal 删除提示modal
 * @param parentModal 总账modal
 */
exports.delOutPutObjFunc = function (id, modal, parentModal) {
    var that = this;
    costManagerApi.delOutPutObj(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getOutPutListFunc(parentModal);
            that.initFinancialStatusFunc();
            that.getProcessListFunc();// 分部数据;
        }
    })
};
/**
 * 获取决算的数据
 * @param modal
 */
exports.getUpdateAccountsFunc = function (modal) {
    costManagerApi.getUpdateAccounts().then(function (res) {
        var list = res.data ? res.data : [];
        renderCostManagerTable.renderUpdateAccountModalTable(list, modal)
    })
};
/**
 * 保存决算的数据
 * @param data
 * @param modal
 */
exports.putUpdateAccountsFunc = function (data, modal) {
    var that = this;
    costManagerApi.putUpdateAccounts(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getSettleListFunc();
            that.initFinancialStatusFunc();
        }
    })
};
/**
 * 获取分部列表
 */
exports.getSubProjListFunc = function (callback, parents) {
    contractManager.getSubProjectList().then(function (res) {
        if (res.code === 1) {
            var list = res.data ? res.data.data : [];
            renderCostManagerTable.renderCostSupProjectSelectDom(list, parents);
            if (callback) {
                callback();
            }
        }
    })
};
/**
 * 费用报销款申请
 * @param data
 * @param modal
 * @param approval
 */
exports.postMyBillAccountFunc = function (data, modal, approval) {
    costManagerApi.postMyBillAccount(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approval.hide();
            $('#modalSearch').click();
        }
    })
};
exports.putMyBillAccountFunc = function (data, modal, approval) {
    costManagerApi.putMyBillAccount(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approval.hide();
            $('#modalSearch').click();
        }
    })
}
/**
 * 费用预付款申请
 * @param data
 * @param modal
 * @param approval
 */
exports.postMyBillPrepareMoneyFunc = function (data, modal, approval) {
    costManagerApi.postMyBillPrepareMoney(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approval.hide();
            $('#modalSearch').click();
        }
    })
};
exports.putMyBillPrepareMoneyFunc = function (data, modal, approval) {
    costManagerApi.putMyBillPrepareMoney(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approval.hide();
            $('#modalSearch').click();
        }
    })
};
/**
 * 获取合同列表
 * @param data
 * @param modal
 * @param callback
 */
exports.getFinanceContractPrepayFunc = function (data, modal, callback) {
    costManagerApi.getFinanceContractPrepay(data).then(function (res) {
        var list = res.data ? res.data.data || res.data : [];
        renderCostMaterialTable.renderMaterialContractList(list, modal);
        if (callback) {
            callback();
        }
    })
};
/**
 * 获取账单详情
 * @param id
 * @param callback
 */
exports.getMyBillDetailFindByIdFunc = function (id, callback) {
    costManagerApi.getMyBillDetailFindById(id).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    })
};
/**
 * 获取财务首页 分部数据
 */
exports.getProcessListFunc = function () {
    costManagerApi.getProcessList().then(function (res) {
        var list = res.data ? res.data.list : [];
        var obj = res.data ? res.data.financeProj : {};
        renderCostManagerTable.renderCostStatusSubTable(list);
        renderCostManagerTable.renderCostRiskManagement(obj);
        projectMainApi.getSystemSetting().then(function(res){
            // 隐藏部分信息
            if(res.data.excpQpyType === 2){
                $('#RiskManagement').find('tr').each(function(index,ele){
                    if(index === 1 || index === 2){
                        $(this).hide();
                    }
                })
                $('#subProjectData').find('td').each(function(){
                    if($(this).find('div').length != 0){
                        $(this).children('div').find('*').hide();
                        $(this).children('div').find('*').eq(4).show().css('marginLeft','100px');
                    }
                })
            }
        });
    });
};
/**
 * 成本转报告
 */
exports.getSettleListFunc = function () {
    costManagerApi.getSettleList().then(function (res) {
        var obj = res.data ? res.data.financeProj : {};
        var list = res.data ? res.data.list : [];
        renderCostManagerTable.renderCostChangeReport(obj);
        renderCostManagerTable.renderCostSubProjectTable(list);
        renderCostManagerTable.rendercostSubProjectListTable(list);
    });
};
/**
 * 编辑评估报告
 * @param data
 * @param modal
 */
exports.postEditAssessFunc = function (data, modal) {
    var that = this;
    costManagerApi.postEditAssess(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getEditAssessFunc();
        }
    })
};
/**
 * 获取评估内容
 */
exports.getEditAssessFunc = function (modal) {
    costManagerApi.getEditAssess().then(function (res) {
        var obj = res.data ? res.data : {};
        renderCostManagerTable.renderCostTransformReport(obj, modal);
    })
};
/**
 * 获取结算详情
 * @param id
 * @param modal
 */
exports.getFinancePayabledFunc = function (id, modal) {
    costManagerApi.getFinancePayabled(id).then(function (res) {
        var obj = res.data ? res.data : {};
        renderCostManagerTable.renderCostStatusPayMoney(obj, modal)
    })
};
/**
 * 结算费用页面
 * @param id
 * @param modal
 */
exports.getSettleCostListFunc = function (id, modal) {
    costManagerApi.getSettleCostList(id).then(function (res) {
        var obj = res.data ? res.data : {};
        renderCostManagerTable.renderCostStatusPayMoney(obj, modal)
    });
};
/**
 * 提交财务应用申请
 * @param data
 * @param modal
 * @param approval
 */
exports.postFinancialPayFunc = function (data, modal, approval) {
    costManagerApi.postFinancialPay(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approval.hide();
            $('#modalSearch').click();
        }
    })
};
exports.putFinancialPayFunc = function (data, modal, approval) {
    costManagerApi.putFinancialPay(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approval.hide();
            $('#modalSearch').click();
        }
    })
}
/**
 * 付款记录
 * @param id
 * @param modal
 */
exports.getPayabledListHistoryFunc = function (id, modal) {
    costManagerApi.getPayabledListHistory(id).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostManagerTable.renderPayRecordHistoryTable(list, modal);
    })
};

exports.getPayabledRecordListFunc = function (id, modal) {
    costManagerApi.getPayabledRecordList(id).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostManagerTable.renderPayRecordHistoryTable(list, modal);
    })
};

exports.getFinanceCostFunc = function (id, modal, callback) {
    costManagerApi.getFinanceCost(id).then(function (res) {
        var obj = res.data ? res.data : {};
        if (callback) {
            return callback(obj);
        }
        renderCostManagerTable.renderFinancialCostModal(modal, obj);
    })
};