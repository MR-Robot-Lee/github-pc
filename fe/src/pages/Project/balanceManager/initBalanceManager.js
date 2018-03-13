var balanceApi = require('./balanceApi');
var renderBalanceTable = require('./renderBalanceTable');

/**
 * 获取结算列表
 * @param data
 * @param page
 */
exports.getBalanceList = function (data, page) {
    var that = this;
    balanceApi.getBalanceList(data).then(function (res) {
        // var list = res.data ? res.data.data : [];
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var status = $('.status').val();
            var type = $('.type').val();
            var costStatus = $('.costStatus').val();
            var keywords = $('.keywords').val().trim();
            if (keywords) {
                _data.keywords = keywords;
            }
            _data.status = status;
            _data.type = type;
            _data.costStatus = costStatus;
            that.getBalanceList(_data, page);
        });
        renderBalanceTable.renderBalanceTable(list, page);
    })
};
/**
 *通过id删除对应的结算单
 * @param id
 * @param modal
 */
exports.delBalanceObj = function (id, modal) {
    balanceApi.delContractBalance(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#searchModal').click();
        }
    })
};
/**
 *
 * @param data
 * @param modal
 */
exports.putHaveContractBalanceObj = function (data, modal) {
    balanceApi.putHaveContractBalance(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#searchModal').click();
        }
    })
};
/**
 * 获取分部
 * @param first true 默认有第一个
 * @param callback
 */
exports.getSupProjList = function (first, callback) {
    first = first || true;
    balanceApi.getSubProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderBalanceTable.renderNewNoContractBalance(list, first, callback);
    })
};
/**
 * 添加无合同结算
 * @param data
 */
exports.postNoContractBalanceObj = function (data) {
    balanceApi.postNoContractBalance(data).then(function (res) {
        if (res.code === 1) {
            var id = $('#projectSchedule').data('id');
            var projectTitle = $('.project-menu-title span').text();
            window.location.href = '/project/balance/index/' + id + '?name=' + projectTitle;
        }
    })
};
/**
 * 修改无合同结算
 * @param data
 */
exports.putNoContractBalanceObj = function (data) {
    balanceApi.putNoContractBalance(data).then(function (res) {
        if (res.code === 1) {
            var id = $('#projectSchedule').data('id');
            var projectTitle = $('.project-menu-title span').text();
            window.location.href = '/project/balance/index/' + id + '?name=' + projectTitle;
        }
    })
};
/**
 * 添加有合同的结算
 * @param data
 * @param modal
 */
exports.postContractBalanceObj = function (data, modal) {
    balanceApi.postHaveContractBalance(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#searchModal').click();
        }
    })
};

/**
 * 获取未结算的列表
 */
exports.getContractNoBalance = function (modal, first, callback) {
    first = first || true;
    balanceApi.getContractNoBalanceList().then(function (res) {
        var list = res.data ? res.data : [];
        renderBalanceTable.renderContractNoBalanceSelect(list, first, modal, callback);
    });
};
/**
 * 通过id获取无合同结算的内容
 * @param data
 * @param attach
 * @param level
 */
exports.getNoContractBalanceObj = function (data, attach, level) {
    balanceApi.getBalanceFindById(data).then(function (res) {
        var obj = res.data ? res.data : {};
        renderBalanceTable.renderNoContractBalanceObj(obj, attach, level);
    });
};
/**
 * 通过结算id获取合同子目
 * @param data
 */
exports.getContractBalanceSubItem = function (data, cntrStatus) {
    balanceApi.getContractSubItemFindByCntrId(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderBalanceTable.renderBalanceOrderDetailTable(list, cntrStatus);
    })
};
/**
 * 获取合同资源列表
 * @param data
 * @param page
 */
exports.getResourceContractList = function (data, page) {
    var that = this;
    balanceApi.putResourceContract(data).then(function (res) {
        //var list = res.data ? res.data.data : [];
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var settleStatus = $('.settleStatus').val();
            var keywords = $('.keywords').val().trim();
            if (!settleStatus) {
                return
            }
            _data.settleStatus = settleStatus;
            _data.keywords = keywords;
            if (keywords) {
                _data.keywords = keywords;
            }
            that.getResourceContractList(_data, page);
        });
        renderBalanceTable.renderResourceContractTable(list);
    })
};
/**
 * 添加项
 * @param data
 * @param modal
 */
exports.postBalanceAddSubItemObj = function (data, modal) {
    var that = this;
    balanceApi.postBalanceAddSubItem(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getContractBalanceSubItem({cntrId: data.cntrId});
        }
    })
};
/**
 * 通过id 更新结算子目
 * @param data
 * @param modal
 */
exports.putBalanceAddSubItemObj = function (data, modal) {
    var that = this;
    balanceApi.putBalanceAddSubItem(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getContractBalanceSubItem({cntrId: data.cntrId});
        }
    })
};
/**
 * 通过id删除添加的项
 * @param data
 * @param modal
 */
exports.delBalanceSubItem = function (data, modal) {
    var that = this;
    balanceApi.delContractSubItemFindById({cntrId: data.cntrId, id: data.id}).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getContractBalanceSubItem({cntrId: data.cntrId});
        }
    })
};
/**
 * 通过 结算id跟子目id 获取对应的结算数据
 * @param data
 * @param modal
 * @param type 1 合同项  2 增项
 */
exports.getSubitemDetailFindByCIdAndSid = function (data, modal, type) {
    balanceApi.getCntrSubItemDetailFindById(data).then(function (res) {
        var list = res.data ? res.data.subitemDetails : [];
        var obj = res.data ? res.data.cntrSubitem : {};
        renderBalanceTable.renderBalanceModalTable(list, modal, type);
        renderBalanceTable.renderBalanceModalDom(obj, modal);
    });
};
/**
 * 删除
 * @param data
 * @param modal
 */
exports.delContractSubItemCostFindByIdFunc = function (data, modal) {
    var that = this
    balanceApi.delContractSubItemCostFindById(data).then(function (res) {
        if (res.code === 1) {
            that.getSubitemDetailFindByCIdAndSid(data, modal, 2) // 2为增项
        }
    })
}
/**
 * 获取预算内添加
 * @param data
 * @param modal
 * @param _list 已经存在的数据
 */
exports.getResourceContractFunc = function (data, modal, _list) {
    balanceApi.getResourceContract(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderBalanceTable.renderContractBudgetModal(list, modal, _list);
    })
};
/**
 * 增项附件
 * @param data
 * @param attach
 */
exports.getSubitemDetailFindByCidAndSidAttach = function (data, attach) {
    balanceApi.getCntrSubItemDetailFindById(data).then(function (res) {
        var list = res.data ? res.data.attaches : [];
        renderBalanceTable.renderAttachModal(list, attach);
    })
};
/**
 * 通过结算id跟子目id获取子目中的附件信息
 * @param data
 * @param modal
 */
exports.getSubItemAttachFindByCIdAndSid = function (data, modal, check) {
    balanceApi.getCntrSubItemDetailFindById(data).then(function (res) {
        var list = res.data ? res.data.attaches : [];
        renderBalanceTable.renderSubItemAttachModalList(list, modal, check);
    });
};
/**
 * 添加结算信息
 * @param data
 * @param modal
 */
exports.postContractSubItemBalance = function (data, modal) {
    var that = this;
    balanceApi.postContractSubItemBalance(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.getContractBalanceSubItem({cntrId: data.cntrId});
        }
    });
};
/**
 * 无合同添加
 * @param data
 * @param modal
 */
exports.postNoContractBalanceSubItem = function (data, modal) {
    var that = this;
    balanceApi.postContractOutSubItemBalance(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#addEnterprise').data('list', []);
            that.getContractBalanceSubItem({cntrId: data.cntrId});
        }
    })
};
/**
 * 获取费用单信息
 * @param data
 */
exports.getContractCostOrder = function (data, modal, callback) {
    balanceApi.getBalanceCostOrder(data).then(function (res) {
        var obj = res.data ? res.data : {};
        renderBalanceTable.renderBalanceConstOrder(obj, modal);
        if (res.code === 1) {
            if (callback) {
                callback();
            }
        }
    })
};
/**
 * 保存结算
 * @param data
 * @param approval
 */
exports.postBalanceObjFunc = function (data, approval) {
    var that = this;
    balanceApi.postBalanceObj(data).then(function (res) {
        if (res.code === 1) {
            if (approval) {
                approval.hide();
                that.getContractBalanceSubItem({cntrId: data.cntrId});
                $('#searchModal').click();
            }
        }
    });
};

exports.uploadImg = function (file, modal) {
    var req = balanceApi.uploadImg(file, function (pro) {
    });
    req.then(function (res) {
        var parents = modal.$body.find('.modal-attach-list');
        var dom = renderBalanceTable.renderAttachItem(res.data || {});
        dom.appendTo(parents);
    });
};
/**
 * 保存附件
 * @param data
 * @param modal
 */
exports.addSubItemAttachFunc = function (data, modal) {
    balanceApi.addSubItemAttach(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
        }
    })
};
/**
 * 结算费用审批
 * @param data
 * @param modal
 * @param approval
 */
exports.putBalanceCostOrderFunc = function (data, modal, approval) {
    balanceApi.putBalanceCostOrder(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            approval.hide();
            // todo;
        }
    })
}