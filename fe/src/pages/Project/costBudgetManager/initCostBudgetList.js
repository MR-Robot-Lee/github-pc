var costBudgetManagerApi = require('./costBudgetManagerApi');
var renderMainViewDom = require('./renderMainViewDom');
var renderTableDom = require('./renderTableDom');
var onScrollDom = require('../../Common/onScrollDom');
/**
 * 获取工程分部列表
 */
exports.getDivisionProjectFunc = function getDivisionProjectFunc(callback) {
    costBudgetManagerApi.getDivisionProjectList().then(function (res) {
        res.data = res.data ? res.data.data : [];
        /**
         * 保存分部
         */
        $("#openSubProject").data('list', res.data);
        renderMainViewDom.renderDivisionProjectDom(res.data);
        renderMainViewDom.renderDivisionProjectTable(res.data);
        if (callback) {
            callback()
        }
    })
};

exports.getCostEvaluateFunc = function getCostEvaluateFunc() {
    costBudgetManagerApi.getCostEvaluate().then(function (res) {
        var obj = res.data ? res.data : {};
        renderMainViewDom.renderProfitDom(obj)
    })
};
/**
 * 获取通过id获取分部内容
 */
exports.getCostSubProjectFunc = function getCostSubProjectFunc() {
    costBudgetManagerApi.getProjectIdFindSubProject().then(function (res) {
        var obj = res.data ? res.data : {};
        renderTableDom.renderSingleSubProjectDom(obj);
    })
};
/**
 * 获取分部列表
 */
exports.getDivisionProjectListFunc = function () {
    costBudgetManagerApi.getDivisionProjectList().then(function (res) {
        res.data = res.data ? res.data.data : [];
        /**
         * 保存分部
         */
        $("#openSubProject").data('list', res.data);
    });
};
/**
 * 获取成本预算列表
 */
exports.getCostBudgetListFunc = function getCostBudgetList($page, data, modal) {
    var that = this;
    costBudgetManagerApi.getSubItemList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var pageNo = 1;
        var pageSize = 0;
        var total = 0;
        if (res.data) {
            pageNo = res.data.pageNo;
            pageSize = res.data.pageSize;
            total = res.data.total;
        }
        $page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        renderTableDom.renderCostBudgetTable(list, $page);
        if (modal) {
            var tableContent = modal.$body.find('.table-content');
            onScrollDom.initDomScrollEvent(null, tableContent, tableContent.find('table'));
        }
        $page.change(function (data) {
            that.getCostBudgetListFunc($page, data);
        })
    })
};
/**
 * 获取人工
 */
exports.getCostWorkerCountFunc = function getCostWorkerCountFunc($page, $data) {
    var that = this;
    costBudgetManagerApi.getBudgetLaborSubProj($data).then(function (res) {
        var list = res.data ? res.data.data.list : [];
        var price = res.data ? (res.data.data.price || 0) : 0;
        $page.update({pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total});
        renderTableDom.renderWorkerCountTable(list, price);
        $page.change(function (data) {
            that.getCostWorkerCountFunc($page, data)
        });
    });
};
/**
 * 获取人力
 */
exports.getCostWorkerCountType = function () {
    costBudgetManagerApi.getBudgetLaborSubType().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderTableDom.renderLaborSelect(list);
    })
};

/**
 * 获取措施
 */
exports.getCostStepFunc = function getCostStepFunc($page, $data) {
    var that = this;
    costBudgetManagerApi.getBudgetStepSubproj($data).then(function (res) {
        var list = res.data ? res.data.data.list : [];
        var price = res.data ? (res.data.data.price || 0) : 0;
        $page.update({pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total});
        renderTableDom.renderStepTable(list, price);
        $page.change(function (data) {
            that.getCostStepFunc($page, data)
        });
    });
};
/**
 * 获取措施类型
 */
exports.getCostStepType = function getCostStepType() {
    costBudgetManagerApi.getBudgetStepSubType().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderTableDom.renderStepSelect(list);
    })
};

/**
 * 获取分包
 */
exports.getCostSubpageageFunc = function getCostSubpageageFunc($page, $data) {
    var that = this;
    costBudgetManagerApi.getBudgetSubpackageSubproj($data).then(function (res) {
        var list = res.data ? res.data.data.list : [];
        var price = res.data ? (res.data.data.price || 0) : 0;
        $page.update({pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total});
        renderTableDom.renderSubpackageTable(list, price);
        $page.change(function (data) {
            that.getCostSubpageageFunc($page, data)
        });
    });
};
/**
 * 获取分包类型
 */
exports.getCostSubpackageType = function getCostSubpackageType() {
    costBudgetManagerApi.getBudgetSubpackageSubType().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderTableDom.renderSubpackageSelect(list)
    })
};
/**
 * 绘制材料
 */
exports.getCostMaterialFunc = function getCostSubpageageFunc($page, $data) {
    var that = this;
    costBudgetManagerApi.getBudgetMaterialList($data).then(function (res) {
        var list = res.data ? res.data.data.list : [];
        var price = res.data ? (res.data.data.price || 0) : 0;
        $page.update({pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total});
        renderTableDom.renderMaterialTable(list, price);
        $page.change(function (data) {
            that.getCostMaterialFunc($page, data);
        })
    });
};
/**
 * 获取材料分类
 */
exports.getCostMaterialType = function getCostMaterialType() {
    costBudgetManagerApi.getBudgetMaterialType().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderTableDom.renderMaterialSelect(list)
    })
};
/**
 * 工程量核算
 */
exports.getCostQuantityFunc = function getCostQuantityFunc($page, $data) {
    var that = this;
    costBudgetManagerApi.getSubItemList($data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderTableDom.renderQuantityTable(list);
        $page.update({pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total});
        $page.change(function (data) {
            that.getCostQuantityFunc($page, data);
        })
    })
};

/**
 * 删除子目里面的材料
 * @param data
 * @param tr
 * @param modal
 */
exports.delMaterialSubItemListFunc = function (data, tr, modal, callback) {
    costBudgetManagerApi.delMaterialSubItemList(data).then(function (res) {
        if (res.code === 1) {
            $(tr).remove();
            modal.hide();
            if (callback) {
                callback();
            }
        }
    })
};

exports.delBudgetLaborSubItemFunc = function (data, tr, modal, callback) {
    costBudgetManagerApi.delBudgetLaborSubItem(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $(tr).remove();
            if (callback) {
                callback();
            }
        }
    })
};

exports.delBudgetMeasureItemFunc = function (data, tr, modal, callback) {
    costBudgetManagerApi.delBudgetMeasureItem(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $(tr).remove();
            if (callback) {
                callback();
            }
        }
    })
};
exports.delBudgetSubletItemFunc = function (data, tr, modal, callback) {
    costBudgetManagerApi.delBudgetSubletItem(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $(tr).remove();
            if (callback) {
                callback();
            }
        }
    })
};


exports.getMaterialFindSubItemListFunc = function (data, modal) {
    costBudgetManagerApi.getMaterialFindSubItemList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderMainViewDom.renderMaterialCheckSubItemTable(list, modal)
    });
};

exports.getLaborFindSubItemListFunc = function (data, modal) {
    costBudgetManagerApi.getLaborFindSubItemList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderMainViewDom.renderMaterialCheckSubItemTable(list, modal)
    })
};

exports.getStepFindSubItemListFunc = function (data, modal) {
    costBudgetManagerApi.getStepFindSubItemList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderMainViewDom.renderMaterialCheckSubItemTable(list, modal)
    })
};

exports.getSubpackageSubItemListFunc = function (data, modal) {
    costBudgetManagerApi.getSubpackageSubItemList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderMainViewDom.renderMaterialCheckSubItemTable(list, modal)
    })
};


exports.getCostEvaluateFuncModal = function (modal) {
    costBudgetManagerApi.getCostEvaluate().then(function (res) {
        var obj = res.data || {};
        renderMainViewDom.renderCostBudgetModal(obj, modal);
    })
};


exports.uploadExcelFunc = function (file) {
    costBudgetManagerApi.uploadExcel(file, function (data) {
        window.location.reload();
    });
};
/**
 * 获取异常
 * @param data
 * @param modal
 * @param callback
 */
exports.getExceptionIdListFunc = function (data, modal, callback) {
    costBudgetManagerApi.getExceptionIdList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderTableDom.rendercostBudgetExceptionTable(list, modal, callback);
    })
};
/**
 * 添加异常信息
 * @param data
 * @param modal
 * @param pModal
 */
exports.postExceptionObjFunc = function (data, modal, pModal) {
    var that = this;
    costBudgetManagerApi.postExceptionObj(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var ids = pModal.$body.find('.confirm').data('ids');
            that.getExceptionIdListFunc({ids: ids}, pModal);
        }
    })
};
/**
 * 修改价格
 * @param data
 * @param modal
 */
exports.putBudgetPrice = function (data, modal) {
    costBudgetManagerApi.putBudgetPrice(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#searchModal').click();
        }
    })
};

/**
 * 添加材料
 * @param data
 * @param modal
 */
exports.postMaterialBaseAllFunc = function (data, modal) {
    costBudgetManagerApi.postMaterialBaseAll(data).then(function (res) {
        if (res.code === 1) {
            modal.remove();

        }
    })
};
/**
 * 复制某一字目的成本预算
 * @param data
 * @returns {Request}
 */
exports.postCopyChildFunc = function (data, modal, $page) {
    var that = this;
    costBudgetManagerApi.postCopyChild(data).then(function (res) {
        if (res.code === 1) {
            modal.remove();
            that.getCostBudgetListFunc($page);
        }
    })
};