var costMaterialApi = require('./costMaterialApi');
var renderCostMaterialTable = require('./renderCostMaterialTable');
var Page = require('../../../components/Page');

var addEmployee = require('../../../components/addEmployee');
var onScrollDom = require('../../Common/onScrollDom');
/**
 * 获取材料计划单
 * @param data
 */
exports.initMaterialPlan = function (data) {
    console.log('data: ')
    console.log(data);
    var $page = $('#page').html('');
    var page = new Page($page, {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
    });
    var that = this;
    costMaterialApi.getMaterialPlan(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        renderCostMaterialTable.renderMaterialPlanTable(list);
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var planStatus = $('.planStatus').val();
            var keywords = $('.keyword').val().trim();
            var type = $('#myPlanMaterial').hasClass('background-list-gray') ? 1 : 2;
            var planType = $('.planType').val();
            _data.type = type;
            _data.planStatus = planStatus;
            _data.planType = planType;
            if (keywords) {
                _data.keywords = keywords;
            }
            that.initMaterialPlan(_data);
        });
    });
};
/**
 * 通过id删除材料计划单
 * @param modal
 * @param id
 */
exports.initDeleteMaterialPlan = function (modal, id) {
    costMaterialApi.delMaterialPlan(id).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#materialPlanSearch').click();
        }
    })
};
/**
 * 初始化添加计划名称
 */
exports.initMaterialPlanNameFunc = function (modal, id) {
    var mtrlPlanName = modal.find('input').val();
    var planType = modal.find('.confirm').data('planType');
    if (!mtrlPlanName) {
        return alert('请输入新增材料名称');
    }
    var that = this;
    if (id) {
        costMaterialApi.putMaterialPlanName({
            mtrlPlanName: mtrlPlanName,
            id: id,
            planType: planType
        }).then(function (res) {
            if (res.code === 1) {
                modal.remove();
                that.initMaterialPlan();
            }
        });
    } else {
        costMaterialApi.postMaterialPlanName({
            mtrlPlanName: mtrlPlanName,
            planType: planType
        }).then(function (res) {
            if (res.code === 1) {
                modal.hide();
                that.initMaterialPlan();
            }
        })
    }
};
/**
 * 绘制计划单详情
 */
exports.initMaterialPlanDetail = function (modal) {
    costMaterialApi.getSubProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderBudgetInsideModalSelect(modal, list)
    });
    costMaterialApi.getMaterialTree().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderBudgetInsideModalSelectType(modal, list)
    });
};
/**
 * 绘制预算内选材tbody
 * @param data
 * @param modal
 * @param newList
 * @param oldList
 */
exports.initMaterialPlanDetailInside = function (modal, data, newList, oldList) {
    var that = this;
    costMaterialApi.getSubProjectMaterial(data).then(function (res) {
        var $data = res.data ? res.data : '';
        var list = $data ? $data.data : [];
        list = filterAddData(list, oldList, data.subProjId);
        renderCostMaterialTable.renderBudgetInsideModalTable(modal, list, newList, data.subProjId);
        var pageSize = $data ? $data.pageSize : '';
        var total = $data ? $data.total : '';
        var moreData = modal.$body.find('#costBudget .enterprise-more-data');
        var tableContent = modal.$body.find('#costBudget .table-content');
        onScrollDom.moreData(pageSize, total, moreData, tableContent, function (_data) {
            data.pageSize = _data.pageSize;
            that.initMaterialPlanDetailInside(modal, data, newList, oldList)
        });
        onScrollDom.initDomScrollEvent(null, tableContent, modal.$body.find('#costBudget table'))
    })
};

function filterAddData(list, oldList, subProjId) {
    oldList = oldList || [];
    var remove = [];
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < oldList.length; j++) {
            if (list[i].mtrlId === oldList[j].mtrlId && (oldList[j].subProjId && subProjId === oldList[j].subProjId.toString())) {
                remove.push(i);
            }
        }
    }
    list = list.filter(function (item, i) {
        return remove.indexOf(i) < 0
    });
    return list;
}

/**
 * 外部分部
 * @param modal
 */
exports.initMaterialBesideSubProject = function (modal) {
    costMaterialApi.getSubProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderBudgetInsideModalSelect(modal, list)
    })
};
/**
 * 我的任务
 */
exports.initMaterialMyTask = function (data, page) {
    var that = this;
    costMaterialApi.getMyTaskList(data).then(function (res) {
        var data = res.data ? res.data : '';
        // var list = data ? data.data : [];
        var list = data ? data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            that.initMaterialMyTask(_data, page);
        });
        renderCostMaterialTable.renderMyTaskTable(list);
    })
};
/**
 * 可计划量
 * @param data
 * @param page
 */
exports.initMaterialPlanAmount = function (data, page, check) {
    var that = this;
    if (check) {
        data.pageSize = 10;
        data.pageNo = 1;
    }
    if (data && data.subProjId) {
        costMaterialApi.getBudgetMaterialSubProj(data).then(function (res) {
            //var list = res.data ? res.data.data.list : [];
            var data = res.data ? res.data : '';
            var list = data ? data.data.list : [];
            var pageSize = data ? data.pageSize : 10;
            var pageNo = data ? data.pageNo : 1;
            var total = data ? data.total : 0;
            page.update({pageNo: pageNo, pageSize: pageSize, total: total});
            //绑定分页修改事件
            page.change(function (_data) {
                _data.subProjId = $('.subProject').val();
                var keyword = $('.keyword').val().trim();
                if (keyword) {
                    _data.keywords = keyword;
                }
                $(".showAllowance").each(function () {
                    var hasGray = $(this).hasClass('background-list-gray');
                    if (!hasGray) {
                        _data.type = $(this).data('type');
                    }
                })
                that.initMaterialPlanAmount(_data, page);
            });
            renderCostMaterialTable.renderMaterialPlanAmount(list);
        });
    }
};
exports.initMaterialPlanAmountSelect = function (callback, isFirst) {
    costMaterialApi.getSubProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderBudgetInsideModalSelect(null, list, isFirst);
        if (callback) {
            callback();
        }
    })
};
exports.initMaterialType = function (categoryId) {//类别类型
    costMaterialApi.getMaterialType(categoryId).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderMaterialType(list);
    })
};
exports.initMaterialCategory = function () {//类别类型
    costMaterialApi.getMaterialCategory().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderMaterialCategory(list);
    })
};
/**
 * 采购汇总
 * @param data
 * @param page
 */
exports.initMaterialPurchaseSum = function (data, page) {
    var that = this;
    costMaterialApi.getPurchaseSumList(data).then(function (res) {
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var subProject = $('.subProject').val();
            var costType = $('.costType').val();
            _data.subProjId = subProject;
            _data.mtrlSource = costType;
            var keyword = $('.keyword').val().trim();
            if (keyword) {
                _data.keywords = keyword;
            }
            that.initMaterialPurchaseSum(_data, page);
        });
        renderCostMaterialTable.renderMaterialPurchaseSumTable(list);
    })
};
/**
 * 库存量
 * @param data
 * @param page
 */
exports.initMaterialPlanSummary = function (data, page) {
    var that = this;
    costMaterialApi.getStockPlan(data).then(function (res) {
        //var list = res.data ? res.data.data : [];
        var data = res.data ? res.data : '';
        var list = data ? data.data : [];
        var pageSize = data ? data.pageSize : 10;
        var pageNo = data ? data.pageNo : 1;
        var total = data ? data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var subProject = $('.subProject').val();
            var keyword = $('.keyword').val().trim();
            if (keyword) {
                _data.keywords = keyword;
            }
            _data.subProjId = subProject;
            var showAllowance = $('.showAllowance.background-list-gray').data('type');
            if (showAllowance) {
                _data.type = showAllowance === 1 ? 2 : 1;
            }
            that.initMaterialPlanSummary(_data, page);
        });
        renderCostMaterialTable.renderStockPlanTable(list);
    })
};
/**
 * 材料计划 计划单table 获取
 * @param data
 * @param parents
 * @param type
 */
exports.initMaterialPlanDetailList = function (data, parents, type) {
    costMaterialApi.getPlanDetail(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        if (type === 'material-plan') {
            renderCostMaterialTable.renderMaterialPlanOrderTable(list, parents);
        } else if (type === 'purchase-order') {
            renderCostMaterialTable.renderMaterialPurchaseOrderTable(list, parents);
        } else if (type === 'check-order') {
            renderCostMaterialTable.renderMaterialAcceptOrderTable(list, parents);
        }
    });
};
/**
 * 计划单获取、采购单、点收
 * @param id
 * @param modal
 * @param type material-plan 采购
 */
exports.initMaterialDetailById = function (id, type, modal) {
    costMaterialApi.getPlanDetailFindByMtrilPlanId(id).then(function (res) {
        var data = res.data || {};
        if (type === 'material-plan') {
            renderCostMaterialTable.renderMaterialPlanOrderDom(data);
        } else if (type === 'purchase-order') {
            // LEE:渲染采购单，同时更新点收人
            renderCostMaterialTable.renderPurchaseOrderDom(data);
        } else if (type === 'check-order') {
            renderCostMaterialTable.renderAcceptOrderDom(data);
        } else if (type === 'detail') {
            renderCostMaterialTable.renderPurchaseMaterialPlan(data, modal);
        } else if (type === 'success-full') { // 中标
            renderCostMaterialTable.renderSuccessFullBidDom(data);
        }
        var materialPlanDetail = $('#materialPlanDetail');
        onScrollDom.initDomScrollEvent(materialPlanDetail.find('.modal-form'), materialPlanDetail, $('.materialManagerOrder'))
    });
};

/**
 * 获取提计划的 modal的数据
 * 采购编辑 modal type 2
 * @param data
 * @param modal
 * @param type plan计划外、计划内 purchase 采购外、采购内
 */
exports.initMaterialPlanDetailModal = function (data, modal, type) {
    costMaterialApi.getPlanDetail(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        if (type === 'plan') {
            renderCostMaterialTable.renderPlanModal(list, modal);
        } else if (type === 'purchase') {
            renderCostMaterialTable.renderPurchaseModal(list, modal);
        } else if (type === 'check') {
            renderCostMaterialTable.renderAcceptModal(list, modal);
        }
    })
};
/**
 * 删除 提计划modal的数据
 * @param data
 * @param ownModal
 * @param parentModal
 */
exports.initDelMaterialDetailModal = function (data, ownModal, parentModal) {
    var that = this;
    costMaterialApi.delPlanDetail(data.id).then(function (res) {
        if (res.code === 1) {
            ownModal.hide();
            var item = $('#materialPlanDetail').data('item');
            that.initMaterialPlanDetailModal({mtrlPlanId: item.id, type: 1}, parentModal, 'plan');
            $('.material-plan .budget-menus a.active').click();
        }
    })
};
/**
 * 添加要买的材料
 * @param data
 * @param modal
 * @param parentModal
 * @param type plan 计划内、计划外 purchase 采购外、采购内
 */
exports.postMaterialPlanDetailFunc = function (data, modal, parentModal, type) {
    var that = this;
    costMaterialApi.postMaterialPlanDetail(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var item = $('.materialPlanDetail').data('item');
            that.initMaterialPlanDetailModal({type: 1, mtrlPlanId: item.id}, parentModal, type);
            $('.material-plan .budget-menus a.active').click();
        }
    });
};
/**
 * 补单添加
 * @param data
 * @param modal
 * @param list
 */
exports.postPlanSupplementFunc = function (data, modal, list) {
    costMaterialApi.postPlanSupplement({
        projId: data.projId,
        mtrlPlanId: data.mtrlPlanId,
        list: list
    }).then(function (res) {
        if (res.code === 1) {
            $('.plan-page .budget-menus a.active').click();
        }
    })
};
/**
 * 获取中标材料详情
 * @param data
 * @param parents
 */
exports.getBidDetailListFunc = function (data, parents) {
    costMaterialApi.getBidDetailList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        if (data.type === 1) {
            renderCostMaterialTable.renderMaterialPlanOrderTable(list, parents);
        } else if (data.type === 2) {
            renderCostMaterialTable.renderSuccessfullBidOrderTable(list, parents);
            renderCostMaterialTable.rendersuccessFullBidOrderTableDom(res.data);
        }
    });
};
/**
 * 中标编辑modal 的数据绘制
 * @param list
 * @param modal
 */
exports.getBidSuccessFullModal = function (list, modal) {
    renderCostMaterialTable.renderBidSuccessFullModalTable(list, modal)
};
/**
 * 删除中标材料
 * @param data
 * @param modal
 */
exports.delBidDetail = function (data, modal) {
    costMaterialApi.getBidDetailList(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
        }
    })
};
/**
 * 添加中标要买的材料
 * @param data
 * @param modal
 */
exports.postBidDetailFunc = function (data, modal) {
    costMaterialApi.postBidDetail(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
        }
    })
};
/**
 * 员工信息modal
 * @param modal
 * @param name
 */
exports.initGetUserTree = function (modal, name) {
    costMaterialApi.getUserTreeList().then(function (res) {
        var list = res.data ? res.data : [];
        var $addEmployee = new addEmployee(name || '添加采购人', function (data) {
            modal.$body.find('.purchasePeople').text(data[0].userName);
            if (name) {
                modal.$body.find('.purchasePeople').data('user', data);
            } else {
                modal.$body.find('.purchasePeople').data('item', data);
            }
            $addEmployee.hide();
        }, 'single');
        $addEmployee.show();
        var $list = []
        if (name) {
            $list = modal.$body.find('.purchasePeople').data('user');
        } else {
            $list = modal.$body.find('.purchasePeople').data('item');
        }
        $addEmployee.update(list);
        if ($list && $list.length > 0) {
            $addEmployee.renderSelectData($list);
        }
    })
};
/**
 * 提交数据跟采购人信息
 * @param data
 * @param modal
 * @param list
 * @param type 1 采购  2 招标 添加材料
 */
exports.initPostPrchUserNoAndCount = function (data, modal, list, type) {
    var prushSuccess = false;
    var countSuccess = false;
    var Interval = setInterval(function () {
        if (prushSuccess && countSuccess) {
            modal.hide();
            if (Interval) {
                clearInterval(Interval);
            }
            if (type === 2) {
                $('.bidding-plan .budget-menus a.active').click();
            } else {
                $('.material-plan .budget-menus a.active').click();
            }
        }
    }, 1000);
    if (type === 1) {
        costMaterialApi.postPlanDetail({
            projId: data.projId,
            mtrlPlanId: data.mtrlPlanId,
            list: list
        }).then(function (res) {
            if (res.code === 1) {
                countSuccess = true;
            }
        }).catch(function (err) {
            if (Interval) {
                clearInterval(Interval);
            }
        })
    } else {
        costMaterialApi.postBidDetail({
            projId: data.projId,
            mtrlPlanId: data.mtrlPlanId,
            list: list
        }).then(function (res) {
            if (res.code === 1) {
                countSuccess = true;
            }
        }).catch(function (err) {
            if (Interval) {
                clearInterval(Interval);
            }
        })
    }
    costMaterialApi.postPurshaseUser(data)
        .then(function (res) {
            if (res.code === 1) {
                prushSuccess = true;
            }
        }).catch(function (error) {
        if (Interval) {
            clearInterval(Interval);
        }
    });
};
/**
 * 材料计划 采购单添加
 * @param data
 * @param modal
 */
exports.initMaterialPlanPurchase = function (data, modal) {
    var that = this;
    costMaterialApi.postPurchaseInfo(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var item = $('#materialPlanDetail').data('item');
            that.initMaterialPlanDetailModal({type: 1, mtrlPlanId: item.id}, modal, 'purchase');
        }
    })
};
/**
 * 只传采购人
 * @param data
 */
exports.initPrchUser = function (data) {
    costMaterialApi.postPurch(data).then(function (res) {
        //todo 更新审批信息
    });
};
/*exports.initMaterialManagerFunc = function initMaterialManager () {
  costMaterialApi.getBudgetMaterialList().then(function (res) {
    renderCostMaterialTable.renderMaterialTable(res.data.data);
  })
};*/
/**
 * 获取供应商类型
 */
exports.initSupplierTypeList = function (modal, parents) {
    costMaterialApi.getSupplierTypeList().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderSupplierTypeDom(list, modal, parents);
    })
};
/**
 * 绘制供应商
 * @param data
 * @param modal
 */
exports.initSupplierList = function (data, modal, parents) {
    costMaterialApi.getSupplierList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderSupplierListDom(list, modal, parents);
    });
};
/**
 * 提交采购信息
 * @param userData
 * @param editData
 * @param modal
 */
exports.initPurchaseEditConfirm = function (userData, editData, modal) {
    var prushSuccess = false;
    var countSuccess = false;
    var Interval = setInterval(function () {
        if (prushSuccess && countSuccess) {
            modal.hide();
            if (Interval) {
                clearInterval(Interval);
            }
            $('.material-plan .budget-menus a.active').click();
        }
    }, 500);
    costMaterialApi.postCheckAndUser(userData).then(function (res) {
        if (res.code === 1) {
            countSuccess = true;
        }
    }).catch(function () {
        if (Interval) {
            clearInterval(Interval);
        }
    });
    costMaterialApi.postPurchaseInfo(editData).then(function (res) {
        if (res.code === 1) {
            prushSuccess = true;
        }
    }).catch(function () {
        if (Interval) {
            clearInterval(Interval);
        }
    });
};
/**
 * 提交点收
 * @param data
 */
exports.initPostCheckAndAccept = function (data, modal) {
    var that = this;
    costMaterialApi.postCheckOverAndAccept(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.initMaterialPlan()
        }
    })
};
/**
 * 点收完成
 * @param data
 * @param ownModal
 * @param parentModal
 */
exports.initPostCheckInfo = function (data, ownModal, parentModal) {
    var that = this;
    costMaterialApi.postCheckInfo(data).then(function (res) {
        if (res.code === 1) {
            ownModal.hide();
            that.initMaterialPlanDetailList({mtrlPlanId: data.mtrlPlanId, type: 3}, parentModal, 'check-order');
        }
    });
};
/**
 * 绘制费用单列表
 * @param data
 * @param parents
 */
exports.initGetCostMaterialList = function (data, parents) {
    costMaterialApi.getCostMaterialList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderCostMaterialOrderList(list, parents);
        renderCostMaterialTable.renderCostMaterialOrderShow(res.data)
    });
};
/**
 * 生成费用单
 * @param data
 * @param parents
 */
exports.initPostCostOrder = function (data, parents) {
    var that = this;
    costMaterialApi.postCostMaterialOrder(data).then(function (res) {
        if (res.code === 1) {
            that.initGetCostMaterialList(data, parents);
        }
    })
};
/**
 * 添加描述及名称
 * @param data
 * @param modal
 * @param approval
 */
exports.initPostCostOrderName = function (data, modal, approval) {
    costMaterialApi.postCostMaterialOrderName(data).then(function (res) {
        if (res.code === 1) {
            if (modal) {
                modal.hide();
            }
            approval.hide();
            $('.material-plan .budget-menus a.active').click();
        }
    })
};
/**
 * 查看费用单详情
 * @param data
 * @param modal
 */
exports.initGetMaterialCostOrderDetail = function (data, modal, callback, type) {
    costMaterialApi.getCheckMaterialCostOrder(data).then(function (res) {
        renderCostMaterialTable.renderMaterialCostOrderDom(modal, res.data, type);
        if (res.code === 1) {
            if (callback) {
                callback();
            }
        }
    });
};
/**
 * 获取计划量中的采购单数据
 * @param data
 * @param parents
 */
exports.initGetPurchaseOrderList = function (data, parents) {
    costMaterialApi.getPalnInfo(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderPruchaseOrderModalTable(list, parents);
    });
};
/**
 * 计划量中的 总量
 * @param data
 * @param parents
 */
exports.initGetPurchaseOrderTotalList = function (data, parents) {
    costMaterialApi.getCheckMaterialFindSubProj(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderPurchaseOrderTotalTable(list, parents);
    })
};
/**
 * 添加出库记录
 * @param data
 */
exports.initPostOutBandHandler = function (data) {
    costMaterialApi.postOutBandHistory(data).then(function (res) {
        if (res.code === 1) {
            $('.searchModal').click();
        }
    })
};
/**
 * 查看出库列表
 * @param data
 * @param modal
 */
exports.checkSummaryListModal = function (data, modal, item) {
    costMaterialApi.getOutBandHistory(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderCheckSummaryModalTable(list, modal, item);
    });
};
/**
 * 查看采购列表
 * @param data
 * @param modal
 */
exports.checkPurchaseListModal = function (data, modal, item) {
    costMaterialApi.getPurchaseInfo(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderCostMaterialTable.renderCheckPurchaseModalTable(list, modal, item);
    })
};
/**
 * 获取企业库材料
 * @param data
 * @param modal
 * @param newList
 * @param oldList
 */
exports.getEnterpriseMaterialFunc = function (data, modal, newList, oldList) {
    var that = this;
    costMaterialApi.getEnterpriseMaterial(data).then(function (res) {
        var $data = res.data ? res.data : '';
        var list = data ? $data.data : [];
        list = filterEnterPrise(list, oldList, data.subProjId);
        renderCostMaterialTable.renderEnterpriseMaterialModalTable(list, modal, newList, data.subProjId);
        var pageSize = $data ? $data.pageSize : '';
        var total = $data ? $data.total : '';
        var moreData = modal.$body.find('#enterprise .enterprise-more-data');
        var tableContent = modal.$body.find('#enterprise .table-content');
        onScrollDom.moreData(pageSize, total, moreData, tableContent, function (_data) {
            _data.mtrlCategory = data.mtrlCategory;
            _data.mtrlType = data.mtrlType;
            that.getEnterpriseMaterialFunc(_data, modal, newList, oldList)
        });
        onScrollDom.initDomScrollEvent(null, tableContent, tableContent.find('table'))
    });
};


/**
 * 过滤已经存在的数据
 * @param list
 * @param oldList
 * @param subProjId
 * @returns {*}
 */
function filterEnterPrise(list, oldList, subProjId) {
    oldList = oldList || [];
    var remove = [];
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < oldList.length; j++) {
            if (list[i].id === oldList[j].mtrlId && (oldList[j].subProjId && subProjId === oldList[j].subProjId.toString())) {
                remove.push(i);
            }
        }
    }
    list = list.filter(function (item, i) {
        return remove.indexOf(i) < 0
    });
    return list;
}

/**
 * 提交审批
 * @param data
 * @param modal
 */
exports.postPlanApprovaeFunc = function (data, modal) {
    costMaterialApi.postPlanApprovae(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            $('#materialPlanSearch').click()
        }
        modal.hide();
    })
};


/**
 * 删除 modal 数据 采购删除
 */
exports.delMaterialPlanModalFunc = function (data, delModal, delTr) {
    costMaterialApi.delMaterialPlanModal(data).then(function (res) {
        if (res.code === 1) {
            delModal.hide();
            delTr.remove();
            $('.material-plan .budget-menus a.active').click();
        }
    })
};
/**
 * 招标删除
 * @param data
 * @param delModal
 * @param delTr
 */
exports.delMaterialPurchModalFunc = function (data, delModal, delTr) {
    costMaterialApi.delMaterialPurchModal(data).then(function (res) {
        if (res.code === 1) {
            delModal.hide();
            delTr.remove();
            $('.material-plan .budget-menus a.active').click();
        }
    })
};
/**
 * 中标信息
 * @param data
 * @param modal
 */
exports.postBidSuccessDetail = function (data, modal) {
    var that = this;
    costMaterialApi.postBidSuccessDetail(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var item = $('.materialPlanDetail').data('item');
            var parents = $('#materialBiddingPlanDetail');
            that.getBidDetailListFunc({mtrlPlanId: item.id, type: 2}, parents);
        }
    })
};
/**
 * 获取材料单总费用
 * @param id
 */
exports.getMaterialPlanCostFindByPlanIdFunc = function (id) {
    costMaterialApi.getMaterialPlanCostFindByPlanId(id).then(function (res) {
        var obj = res.data ? res.data : {};
        renderCostMaterialTable.renderMaterialCostOrderTable(obj);
    })
};
/**
 * 获取合同列表
 * @param data
 * @param modal
 */
exports.getMaterialContractListFunc = function (data, modal) {
    costMaterialApi.getMaterialContractList(data).then(function (res) {
        var list = res.data ? res.data : [];
        renderCostMaterialTable.renderMaterialContractList(list, modal)
    })
};