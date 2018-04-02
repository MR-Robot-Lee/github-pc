var common = require('../../Common');
var initMaterialManger = require('./initMaterialManager');
var delModal = require('./modal/deleteModal.ejs');
var compareSupplierModal = require('./modal/compareSupplierModal.ejs');
var compareBranchModal = require('./modal/compareBranchModal.ejs');
var renderCostMaterialTable = require('./renderCostMaterialTable');

var updatePurchaseNameModal = require('./modal/updatePurchaseNameModal.ejs');
var Modal = require('../../../components/Model');
var mentionPlanModal = require('./modal/mentionPlanModal.ejs');
var createOrderModal = require('./modal/createOrderModal.ejs');
var waitingOrderModal = require('./modal/waitingOrderModal.ejs');
var rejectOrderModal = require('./modal/rejectOrderModal.ejs');
var checkingOrderModal = require('./modal/checkingOrderModal.ejs');
var checkedOrderModal = require('./modal/checkedOrderModal.ejs');
var manageOrderModal = require('./modal/manageOrderModal.ejs');
var purchaseEditModal = require('./modal/purchaseEditModal.ejs');
var checkAndAcceptModal = require('./modal/checkAndAcceptModal.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var initMaterialManager = require('./initMaterialManager');

var materialPlanOrderList = require('./table/materialPlanOrderList.ejs');
var materialPurchaseOrder = require('./table/materialPurchaseOrder.ejs');
var materialCheckOrder = require('./table/materialCheckOrder.ejs');
var materialCostOrder = require('./table/materialCostOrder.ejs');

var materialBiddingOrder = require('./table/materialBiddingOrder.ejs');
var materialSuccessfulBid = require('./table/materialSuccessfulBid.ejs');

var renderCostMaterialTable = require('./renderCostMaterialTable');
var addSupplierModal = require('./modal/addSupplierModal.ejs');
var addPlanType = require('./modal/addPlanType.ejs');
var checkMeasureModal = require('./modal/checkMeasureModal.ejs');
var checkPlanModal = require('./modal/checkPlanModal.ejs');
var addSummaryModal = require('./modal/addSummaryModal.ejs');

var checkPurchaseModal = require('./modal/checkPurchaseModal.ejs');
var checkDeliveryModal = require('./modal/checkDeliveryModal.ejs');

var selectMaterialModal = require('./modal/selectMaterialModal.ejs');

var addPlanDesModal = require('../contractManager/modal/addAccountingExplain.ejs');
var approvalProcess = require('../../../components/approvalProcess');
var purchaseDetailModal = require('./modal/purchaseDetailModal.ejs');
var biddingDetailModal = require('./modal/biddingDetailModal.ejs');

var addMaterialModal = require('../costBudgetManager/modal/addMaterialModal.ejs');
var chargeApi = require('../../Enterprise/chargeApi');
var editBidSuccessFullModal = require('./modal/editBidSuccessFullModal.ejs');
var getBidSuccessFull = require('./getBidSuccessFullData');
var addSupplier = require('../../../components/addSupplier');
var exceptionRemarkModal = require('../costBudgetManager/modal/exceptionRemarkModal.ejs');
var costBudgetManagerApi = require('../costBudgetManager/costBudgetManagerApi');
var initCostBudgetList = require('../costBudgetManager/initCostBudgetList');
var exceptionMemoModal = require('../costBudgetManager/modal/exceptionMemoModal.ejs');
var materialCostOrderManager = require('./modal/materialCostOrderManager.ejs');
var materialPayOrderNoBudgetManager = require('./modal/materialPayOrderNoBudgetManager.ejs');
var materialPayOrderBudgetManager = require('./modal/materialPayOrderBudgetManager.ejs');
var payMoneyModal = require('./modal/payMoneyModal.ejs');
var materialPurchContractModal = require('./modal/materialPurchContractModal.ejs');
var scheduleManager = require('../scheduleManager/initEvent');
var remindModal = require('./modal/remindMaterialRemoveModal.ejs');
var levelData = require('./levelData');
var getOrganize = require('../organizationManager/organizationApi');
var addOrgEmployeeModal = require('../scheduleManager/modal/addOrgEmployeeModal.ejs');
var costMaterialApi = require('./costMaterialApi');
var costBudgetManagerEventModal = require('../costBudgetManager/modal/initEventModal');
var chargeApi = require('../../Enterprise/chargeApi');
var addTeamModal = require('./modal/addTeamModal.ejs');
var addWorkerModal = require('./modal/addWorkerModal.ejs');
var enterpriseApi = require('../../Enterprise/enterpriseApi');


/**
 * 初始化 材料单计划事件
 * @param parents
 */
exports.initMaterialPlanTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var type = $(this).data('type');
        if (type === 'update') {
            initUpdateModal($(this).parents('td'), parents, item);
        } else if (type === 'delete') {
            var deleteModal = Modal('提示', delModal());
            deleteModal.show();
            deleteModal.showClose();
            initDelModal(deleteModal, item.id);
        } else if (type === 'detail') {
            var detailContentModal = biddingDetailModal();
            if (item.planType === 1) {
                detailContentModal = purchaseDetailModal();
            }
            var detailModal = Modal('详情', detailContentModal);
            detailModal.showClose();
            detailModal.show();
            initMaterialManger.initMaterialDetailById(item.id, 'detail', detailModal);
        }
    });
    parents.find('tr').click(function (e) {
        parents.find('.trHeightLight').removeClass('trHeightLight');
        $(this).addClass('trHeightLight');
        $('.material-plan .icon-close ').click(function () {
            $('.material-plan .cancel ').trigger('click');
            parents.find('.trHeightLight').removeClass('trHeightLight');
        });
        $('.bidding-plan .icon-close ').click(function () {
            $('.bidding-plan .cancel ').trigger('click');
            parents.find('.trHeightLight').removeClass('trHeightLight');
        })
        common.stopPropagation(e);
        var item = $(this).data('item');
        $('.materialManagerNO').text(item.mtrlPlanNo);
        $('.bidPlanName').text(item.mtrlPlanName);
        if (item.planType === 1) {
            $('.material-plan').addClass("active");
            $('.bidding-plan').removeClass("active");
            $('.materialPlanDetail').data('item', item);
            $('.material-plan .budget-menus a:first').click();
        } else {
            $('.bidding-plan').addClass("active");
            $('.material-plan').removeClass("active");
            $('.materialPlanDetail').data('item', item);
            $('.bidding-plan .budget-menus a:first').click();
        }
    })
};

function initUpdateModal(td, parents, item) {
    parents.find('.model-project-common').remove();
    var dom = $(updatePurchaseNameModal());
    dom.appendTo(td);
    dom.find('input').val(item.mtrlPlanName);
    parents.find('.model-project-common').click(function (e) {
        common.stopPropagation(e);
    })
    dom.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        initMaterialManger.initMaterialPlanNameFunc(dom, item.id);
    });
    dom.find('.cancel').click(function (e) {
        common.stopPropagation(e);
        parents.find('.model-project-common').remove();
    })
}

function initDelModal(modal, id) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        initMaterialManger.initDeleteMaterialPlan(modal, id);
    })
}

/**
 * 材料计划事件
 */
exports.initMaterialPlanEvent = function () {
    var materialPlanSearch = $('#materialPlanSearch');
    if (materialPlanSearch.length > 0 && !materialPlanSearch.data('flag')) {
        materialPlanSearch.data('flag', true);

        /**
         * 搜索
         */
        var planType = $('.planType').html('');
        for (var i = 0; i < levelData.length; i++) {
            var item = levelData[i];
            var dom = $('<option></option>');
            dom.text(item.name);
            dom.val(item.id);
            dom.data('item', item.child);
            dom.appendTo(planType);
        }
        planType.change(function (e) {
            common.stopPropagation(e);
            var item = planType.find('option:selected').data('item') || [];
            var planStatus = $('.planStatus').html('');
            for (var j = 0; j < item.length; j++) {
                var $item = item[j];
                var dom = $('<option></option>');
                dom.val($item.id);
                dom.text($item.name);
                dom.appendTo(planStatus);
            }
        });
        planType.change();
        materialPlanSearch.click(function (e) {
            common.stopPropagation(e);
            var planStatus = $('.planStatus').val();
            var keywords = $('.keyword').val().trim();
            var type = $('#myPlanMaterial').hasClass('background-list-gray') ? 1 : 2;
            var planType = $('.planType').val();
            var data = {type: type, planStatus: planStatus, planType: planType};
            if (keywords) {
                data.keywords = keywords;
            }
            initMaterialManger.initMaterialPlan(data);
        });
        var addName = $('.material-manager-modal');
        $('#newPurchasePlan').click(function (e) {
            common.stopPropagation(e);
            addName.show();
            addName.css('left', '147px');
            addName.find('input').val('');
            addName.find('.bold-title').text('采购计划命名:');
            addName.find('.confirm').data('planType', 1);
        });
        $('#newBiddingPlan').click(function (e) {
            common.stopPropagation(e);
            addName.show();
            addName.css('left', '277px');
            addName.find('input').val('');
            addName.find('.bold-title').text('招标计划命名:');
            addName.find('.confirm').data('planType', 2);
        });
        addName.find('.cancel').click(function (e) {
            common.stopPropagation(e);
            addName.hide();
        });
        /**
         * 辅助不被隐藏的
         */
        addName.click(function (e) {
            common.stopPropagation(e);
        });
        addName.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            initMaterialManger.initMaterialPlanNameFunc(addName);
        });
        $('body').click(function (e) {
            common.stopPropagation(e);
            if (!addName.is(':hidden')) {
                addName.hide();
            }
        });
        $('#myPlanMaterial').click(function (e) {
            common.stopPropagation(e);
            var planStatus = $('.planStatus').val();
            var keywords = $('.keyword').val().trim();
            var type = '';
            if ($(this).hasClass('background-list-gray')) {
                $(this).removeClass('background-list-gray');
                type = 2;
            } else {
                $(this).addClass('background-list-gray');
                type = 1;
            }
            var data = {type: type};
            data.planStatus = planStatus;
            if (!keywords) {
                data.keywords = keywords;
            }
            initMaterialManger.initMaterialPlan(data);
        });
        var userNo = '';
        try {
            var user = localStorage.getItem('user');
            userNo = JSON.parse(user).employee.userNo;
            if (!user || !userNo) {
                window.location.href = '/login';
            }
        } catch (e) {
        }
        /**
         * 采购单计划
         */
        $('.bidding-plan .budget-menus a').click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            $('.bidding-plan .budget-menus a').removeClass('active');
            $(this).addClass('active');
            var parents = $('#materialBiddingPlanDetail').html('');
            var item = $('.materialPlanDetail').data('item');
            if (type === 'material-plan') {
                $(materialBiddingOrder()).appendTo(parents);
                initMaterialDetail(parents);
                initMaterialManger.getBidDetailListFunc({mtrlPlanId: item.id, type: 1}, parents);
                initMaterialManger.initMaterialDetailById(item.id, type);
                if (userNo === item.planUserNo) {
                    $('.submitApproval').show();
                    $('.mentionPlan').show()
                } else {
                    $('.submitApproval').hide();
                    $('.mentionPlan').hide()
                }
            } else if (type === 'success-full') {
                $(materialSuccessfulBid()).appendTo(parents);
                initMaterialDetail(parents);
                initMaterialManger.initMaterialDetailById(item.id, type);
                initMaterialManger.getBidDetailListFunc({mtrlPlanId: item.id, type: 2}, parents);
                if (userNo === item.prchUserNo) {
                    $('.biddingPlan').show();
                    $('.directReport').show();
                } else {
                    $('.biddingPlan').hide();
                    $('.directReport').hide();
                }
            }
        });
        /**
         * 材料详情导航切换
         */
        $('.material-plan .budget-menus a').click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            $('.material-plan .budget-menus a').removeClass('active');
            $(this).addClass('active');
            var parents = $('#materialPlanDetail').html('');
            var item = $('.materialPlanDetail').data('item');
            var $type = '';
            if (type === 'material-plan') {// 提计划
                $(materialPlanOrderList()).appendTo(parents);
                $type = 1;
                initMaterialManger.initMaterialDetailById(item.id, type);
                initMaterialDetail(parents);
                if (userNo === item.planUserNo) {
                    $('.submitApproval').show();
                    $('.mentionPlan').show()
                } else {
                    $('.submitApproval').hide();
                    $('.mentionPlan').hide()
                }
            } else if (type === 'purchase-order') {//采购
                console.log(1111);
                $type = 2;
                $(materialPurchaseOrder()).appendTo(parents);
                initMaterialManger.initMaterialDetailById(item.id, type);
                initPurchaseDetail(parents, item);
                if (userNo === item.prchUserNo) {
                    $('#purchaseOrder').show();
                    $('.checkAccept').show()
                } else {
                    $('#purchaseOrder').hide();
                    $('.checkAccept').hide();
                }
            } else if (type === 'check-order') {// 点收单
                $(materialCheckOrder()).appendTo(parents);
                initCheckAndAccept(parents, item);
                initMaterialManger.initMaterialDetailById(item.id, type);
                $type = 3;
                if (userNo === item.checkUserNo) {
                    $('.checkAndAccept').show();
                    $('.rebut').show();
                    $('.material-plan .confirm').show();
                } else {
                    $('.checkAndAccept').hide();
                    $('.rebut').hide();
                    $('.material-plan .confirm').hide();
                }
            } else if (type === 'cost-order') { // 费用单
                $(materialCostOrder()).appendTo(parents);
                initMaterialManger.getMaterialPlanCostFindByPlanIdFunc(item.id);
                initCostOrderList(parents, item);
            }
            console.log(type);
            if (type === 'cost-order') {
                initMaterialManger.initGetCostMaterialList({mtrlPlanId: item.id}, parents);
            } else {
                initMaterialManger.initMaterialPlanDetailList({mtrlPlanId: item.id, type: $type}, parents, type);
            }
        });
    }
};

/**
 * 计划单操作事件 提计划
 * @param parents
 */
function initMaterialDetail(parents) {

    parents.find('.cancel').click(function (e) {
        common.stopPropagation(e);
        $('.plan-page').removeClass("active");
        parents.html('');
    });
    $('.mentionPlan').click(function (e) {
        common.stopPropagation(e);
        var modal = Modal('提计划', mentionPlanModal());
        modal.show();
        modal.showClose();
        var item = parents.data('item');
        initMentionPlanModalEvent(modal, item);
        initMentionPlanModalData(modal, item);
        initMentionPlanModalDom(modal, item);
    });
    $('.directPurchase').click(function (e) {
        common.stopPropagation(e);
        var item = parents.data('item');
        initMaterialManger.initPrchUser({mtrlPlanId: item.id});
    });
    /**
     * 中标编辑
     */
    $('.biddingPlan').click(function (e) {
        common.stopPropagation(e);
        var editBidSuccessFull = Modal('中标编辑', editBidSuccessFullModal());
        editBidSuccessFull.showClose();
        editBidSuccessFull.show();
        var list = getBidSuccessFull.getBidSuccessFullData(parents);
        initMaterialManger.getBidSuccessFullModal(list, editBidSuccessFull);
        initEditBidSuccessFulData(editBidSuccessFull);
    });
    /**
     * 发布
     */
    $('.directReport').click(function (e) {
        common.stopPropagation(e);
        var remindPurchase = Modal('提示', remindModal());
        remindPurchase.show();
        remindPurchase.showClose();
        remindPurchase.$body.find('.confirm').click(function () {
            var item = parents.data('item');
            initMaterialManger.initPostCheckAndAccept({status: 1, mtrlPlanId: item.id}, remindPurchase);
        })
    });
    $('.submitApproval').click(function (e) {
        common.stopPropagation(e);
        var approval = new approvalProcess('材料审批流程', function () {
            var materialItem = $('.materialPlanDetail').data('item');
            var _item = approval.getSelectData();
            initMaterialManger.postPlanApprovaeFunc({tmplId: _item.id, mtrlPlanId: materialItem.id}, approval);
        });
        approval.getApprovalModal(4);
    });
}

/**
 * 中标modal event
 * @param modal
 */
function initEditBidSuccessFulData(modal) {
    var bidPrice = modal.$body.find('[name="bidPrice"]');
    bidPrice.keyup(function () {//实时计算合价
        var bidCountVal = $(this).parent().prev().find('input').val();
        $(this).parent().next().find('input').val(bidCountVal * $(this).val());
    })
    modal.$body.find('a').off('click').on('click', function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'add') {
            var addBidDes = Modal('添加说明', addPlanDesModal());
            addBidDes.showClose();
            addBidDes.show();
            addBidDes.$body.find('.rule').val(item.bidRemark);
            addBidDes.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var remark = addBidDes.$body.find('.rule').val();
                if (addBidDes.$body.find('.rule').val().length >= 100) {
                    return alert('说明内容不能超过100个字');
                }
                // if (!remark) {
                //   return alert('请输入材料说明');
                // }
                item.bidRemark = remark;
                addBidDes.hide();
            });
        }
    })

    modal.$body.find('.confirm').click(function (e) {//中标编辑 保存
        common.stopPropagation(e);
        var trs = modal.$body.find('tbody tr');
        var list = [];
        for (var i = 0; i < trs.length; i++) {
            var bidPrice = $(trs[i]).find("[name=bidPrice]").val() ? 1 : 2; //1 填写 2 未填写
            var supplierType = $(trs[i]).find(".supplierType").html() == '单击选择' ? 2 : 1;
            var bidPlace = $(trs[i]).find("[name=bidPlace]").val() ? 1 : 2;
            if (bidPrice === 1 && supplierType === 1 && bidPlace === 1) { //单价、供货单位、产地品牌 填写完成
                var data = {};
                var supplier = $(trs[i]).find('.supplierList').data('item'); //供货单位
                data.entprName = supplier.entpName;
                data.entprId = supplier.id;
                data.id = $(trs[i]).data('item').id;
                data.bidPrice = $(trs[i]).find("[name=bidPrice]").val(); //单价
                data.bidCount = $(trs[i]).find("[name=bidCount]").val(); //数量
                data.bidPlace = $(trs[i]).find("[name=bidPlace]").val(); //产地/品牌
                data.bidRemark = $(trs[i]).data('item').bidRemark; //说明
                data.bidTaxType = $(trs[i]).find('[name=bidTaxType]').prop('checked') ? 1 : 2; //是否含税
                list.push(data);
            } else if (bidPrice === 2 && supplierType === 2 && bidPlace === 2) { //均未填写
                continue;
            } else { //部分未填写
                if (bidPrice === 2) {
                    return alert('请填写单价');
                }
                if (supplierType === 2) {
                    return alert('请选择供应商');
                }
                if (bidPlace === 2) {
                    return alert('请填写产地/品牌');
                }
            }
        }
        initMaterialManger.postBidSuccessDetail({list: list}, modal);
    });
}

function initMentionPlanModalData() {
    var modal = arguments[0];
    var _item = arguments[1];
    var trs = [];
    if (_item.planType === 1) {
        trs = $('#materialPlanDetail').find('tbody tr');
    } else {
        trs = $('#materialBiddingPlanDetail tbody tr');
    }
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = trs.length; i < length; i++) {
        var item = $(trs[i]).data('item');
        item.count = i + 1;
        renderCostMaterialTable.renderBiddingModalTable(item, parents, 'old');
    }
    initMaterialPlanDetail(parents);
}

/**
 * 初始化提计划modal事件
 */
function initMaterialPlanDetail(parents) {
    parents.find('a').off('click').on('click', function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'add') {
            var addPlanDes = Modal('添加说明', addPlanDesModal());
            addPlanDes.showClose();
            addPlanDes.show();
            addPlanDes.$body.find('.rule').val(item.planRemark);
            addPlanDes.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var remark = addPlanDes.$body.find('.rule').val();
                if (addPlanDes.$body.find('.rule').val().length >= 100) {
                    return alert('说明内容不能超过100个字');
                }
                // if (!remark) {
                //   return alert('请输入材料说明');
                // }
                item.planRemark = remark;
                addPlanDes.hide();
            });
        } else if (type === 'delete') {
            var deleteModal = Modal('提示', delModal());
            deleteModal.showClose();
            deleteModal.show();
            var tr = $(this).parents('tr');
            deleteModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                if (tr.hasClass('new1') || tr.hasClass('new2')) {
                    tr.remove();
                    deleteModal.hide();
                    return false
                }
                var pItem = $('.materialPlanDetail').data('item');
                if (pItem.planType === 1) { // 采购
                    initMaterialManger.delMaterialPlanModalFunc({mtrlPlanId: pItem.id, id: item.id}, deleteModal, tr);
                } else { // 招标
                    initMaterialManger.delMaterialPurchModalFunc({mtrlPlanId: pItem.id, id: item.id}, deleteModal, tr)
                }
            });
        }
    })
    parents.find('[name=planCount]').keyup(function (e) {
        var num = $(this).val();
        if (isNaN(num * 1)) {
            alert('请输入数字');
            $(this).val(num.slice(0, -1));
        }
    })
}

/**
 * 采购单
 * @param parents 存储item 的id
 * @param item 单个材料计划
 */
function initPurchaseDetail(parents, item) {
    var createOrder = $("#createOrder");//生成订单
    var manageOrder = $("#manageOrder");//管理订单
    var purchaseOrder = $("#purchaseOrder");//采购编辑
    createOrder.click(function (e) {
        common.stopPropagation(e);
        var createModal = Modal('生成订单', createOrderModal());
        createModal.show();
        createModal.showClose();
        var list = [];
        $("input.choose").each(function () {
            if ($(this).prop('checked')) {
                list.push($(this).parents('tr').data('item'));
            }
        })
        renderCostMaterialTable.renderCreateOrderTable(list, createModal, item.id);

    })
    manageOrder.click(function (e) {
        common.stopPropagation(e);
        var manageModal = Modal('管理订单', manageOrderModal());
        manageModal.show();
        manageModal.showClose();
        costMaterialApi.getOrder(item.id).then(function (res) {
            if (res.code === 1) {
                console.log(res);
                var list = res.data || [];
            }
            renderCostMaterialTable.renderOrderTable(list, manageModal);
        })
    })
    if (!purchaseOrder.data('flag')) {
        purchaseOrder.data('flag', true);
        parents.find('.cancel').click(function (e) {
            common.stopPropagation(e);
            $('.material-plan').removeClass("active");
        });
        purchaseOrder.click(function (e) {
            common.stopPropagation(e);
            var purchaseModal = Modal('采购编辑', purchaseEditModal());
            purchaseModal.show();
            purchaseModal.showClose();
            initGetPurchasePlan(purchaseModal, parents);
            initPurchaseDetailModalEvent(purchaseModal);
        });
        $('.checkAccept').click(function (e) {
            common.stopPropagation(e);
            var remindPurchase = Modal('提示', remindModal());
            remindPurchase.$body.find('.remind-text').html('确定已完成全部采购编辑？');
            remindPurchase.show();
            remindPurchase.showClose();
            remindPurchase.$body.find('.confirm').click(function () {
                remindPurchase.hide();
                initMaterialManger.initPostCheckAndAccept({status: 1, mtrlPlanId: item.id}, remindPurchase);
            })
        })
    }
}

/**
 * 费用单
 * @param parents
 * @param item
 */
function initCostOrderList(parents, item) {
    parents.find('.costOrder').click(function (e) {
        common.stopPropagation(e);
        initMaterialManger.initPostCostOrder({mtrlPlanId: item.id}, parents);
    });
    parents.find('.cancel').click(function (e) {
        common.stopPropagation(e);
        $('.material-plan').removeClass("active");
    })
}

/**
 * 获取计划的采购订单
 */
function initGetPurchasePlan(modal, parents) {
    var item = parents.data('item');
    modal.$body.find('.checkUserName').text(item.checkUserName || '');
    if (item.realAppearTime) {
        modal.$body.find('.modal-form .purchaseTime').val(moment(item.realAppearTime).format('YYYY-MM-DD'));
    }
    if (item.prchUserName) {
        modal.$body.find('.checkUserName').data('user', {userNo: item.checkUserNo, userName: item.checkUserName});
    }
    initMaterialManger.initMaterialPlanDetailModal({mtrlPlanId: item.id, type: 2}, modal, 'purchase');
}

/**
 * 点收modal 唤起
 */
function initCheckAndAccept(parents, item) {
    var checkAndAccept = $('.checkAndAccept');
    var rebut = $('.rebut');
    if (!checkAndAccept.data('flag')) {
        checkAndAccept.data('flag', true);
        checkAndAccept.click(function (e) {
            common.stopPropagation(e);
            var checkAndModal = Modal('点收', checkAndAcceptModal());
            checkAndModal.show();
            checkAndModal.showClose();
            initGetCheckOrderList(checkAndModal, item);
            initCheckOrderEvent(checkAndModal, item, parents);
        });
        rebut.click(function (e) {
            common.stopPropagation(e);
            var remindPurchase = Modal('提示', remindModal());
            remindPurchase.show();
            remindPurchase.showClose();
            remindPurchase.$body.find('.remind-text').html('确定需要驳回吗？');
            remindPurchase.$body.find('.confirm').click(function () {
                remindPurchase.hide();
                initMaterialManger.initPostCheckAndAccept({mtrlPlanId: item.id, status: 3});
            })
        });
        parents.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var remindPurchase = Modal('提示', remindModal());
            remindPurchase.show();
            remindPurchase.showClose();
            remindPurchase.$body.find('.confirm').click(function () {
                remindPurchase.hide();
                initMaterialManger.initPostCheckAndAccept({mtrlPlanId: item.id, status: 2});
            })
        });

        parents.find('.cancel').click(function (e) {
            common.stopPropagation(e);
            $('.material-plan').removeClass("active");
        });
    }
}

function initGetCheckOrderList(modal, item) {
    if (item.checkTime) {
        modal.$body.find('.acceptTime').val(moment(item.checkTime).format('YYYY-MM-DD'));
    }
    initMaterialManger.initMaterialPlanDetailModal({mtrlPlanId: item.id, type: 3}, modal, 'check');
}

function initCheckOrderEvent(modal, item, parents) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var trs = modal.$body.find('tbody tr');
        // var acceptTime = modal.$body.find('.acceptTime').val();
        //   if (!acceptTime) {
        //   return alert('请输入点收时间');
        // }
        var acceptTime = moment(new Date()).format('YYYY-MM-DD');
        var error = false;
        var errMsg = '';
        var list = [];
        for (var i = 0, length = trs.length; i < length; i++) {
            var data = {};
            var tr = $(trs[i]);
            var $item = tr.data('item');
            var acceptCount = tr.find('input').val();
            data.checkCount = acceptCount;
            data.checkTime = new Date(acceptTime).getTime();
            data.id = $item.id;
            data.checkTotalMoney = $item.prchTotalMoney;
            if (!acceptCount) {
                error = true;
                errMsg = '请输入点收数量';
                break;
            }
            list.push(data);
        }
        initMaterialManger.initPostCheckInfo({
            checkTime: new Date(acceptTime).getTime(),
            list: list,
            mtrlPlanId: item.id
        }, modal, parents);
    });
}

/**
 * 采购单事件
 * @param modal
 */
function initPurchaseDetailModalEvent(modal) {
    modal.$body.find('.checkUserName').click(function (e) {
        common.stopPropagation(e);
        var user = $(this).data('user');
        scheduleManager.addEmployeeTable(user, this);
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var materialItem = $('#materialPlanDetail').data('item');
        initPurchaseEditTbody(modal, materialItem);
    });
}

/**
 * 采购编辑
 * @param modal
 * @param item
 */
function initPurchaseEditTbody(modal, item) {
    var trs = modal.$body.find('tbody tr');
    var list = [];
    var error = false;
    var errMsg = '';
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        var entItem = tr.data('item');
        var prchCount = tr.find('[name=prchCount]').val();
        var prchPrice = tr.find('[name=prchPrice]').val();
        var prchPlace = tr.find('[name=prchPlace]').val();
        var supplierType = tr.find('.supplierType');
        var supplierList = tr.find('.supplierList');
        var entprId = supplierList.data('item') ? supplierList.data('item').id : supplierList.attr('id');
        var entpName = supplierList.data('item') ? supplierList.data('item').entpName : supplierType.text();
        entpName = entpName == '单击选择' ? '' : entpName;
        var planType = tr.find('.planType').data('item');
        var prchTime = tr.find('.purchaseTime').val();
        var prchTaxType = tr.find('input[name=prchTaxType]').prop('checked') ? 1 : 2;
        var totalMoney = tr.find('.totalMoney').text();
        if (!prchCount) {
            errMsg = '请输入数量';
        }
        if (!prchPrice) {
            errMsg = '请输入单价';
        } else if (isNaN(prchCount) || isNaN(prchPrice)) {
            return alert('请输入正确数字');
        }
        if (!entpName) {
            errMsg = '请选择供应商';
        }
        if (!prchPlace) {
            errMsg = '请输入地址/品牌';
        }
        if (!prchTime) {
            errMsg = '请输入采购时间';
        }
        if (!planType) {
            errMsg = '请选择计划款项';
        }
        if (prchCount && prchPrice && totalMoney && entpName && prchPlace && prchTime && planType) {
            list.push({
                acctType: planType.acctType,
                entprId: entprId,
                entprName: entpName,
                id: entItem.id,
                mtrlPlanId: item.id,
                prchCount: prchCount,
                prchPrice: prchPrice,
                prchPlace: prchPlace,
                prchTaxType: prchTaxType,
                prchTime: new Date(prchTime).getTime(),
                prchTotalMoney: totalMoney
            });
        } else if (!entpName && !prchPlace && !prchTime && !planType) {
            continue
        } else {
            error = true;
            break;
        }
    }
    var user = modal.$body.find('.checkUserName').data('user');

    var purchaseTime = modal.$body.find('.modal-form .purchaseTime').val();
    if (error) {
        return alert(errMsg);
    }
    if (!user.userNo) {
        return alert('请选择点收人');
    }
    if (!purchaseTime) {
        return alert('请输入采购到场时间');
    }
    initMaterialManger.initPurchaseEditConfirm({
        checkUserNo: user.userNo,
        realAppearTime: purchaseTime,
        mtrlPlanId: item.id
    }, {list: list, mtrlPlanId: item.id}, modal);
}

/**
 * 提计划modal 数据
 * @param modal
 * @param item
 */
function initMentionPlanModalDom(modal, item) {
    modal.$body.find('.projectName').text(item.mtrlPlanName);
    modal.$body.find('.projectNo').text(item.mtrlPlanNo);
    modal.$body.find('.purchasePeople').text(item.prchUserName || '');
    if (item.planAppearTime) {
        modal.$body.find('input[type=date]').val(moment(item.planAppearTime).format('YYYY-MM-DD'));
    }
    if (item.prchUserName && item.planType === 1) {
        modal.$body.find('.purchasePeople').data('user', {userNo: item.prchUserNo, userName: item.prchUserName});
    } else if (item.prchUserName && item.planType === 2) {
        modal.$body.find('.purchasePeople').data('item', {userNo: item.prchUserNo, userName: item.prchUserName});
    }
    if (item.planType === 1) {
        $('.purchasePeopleLabel').text('采购人');
        $('.purchaseTime').text('计划到场时间');
    } else {
        $('.purchasePeopleLabel').text('招标发布人');
        $('.purchaseTime').text('计划发布时间');
    }
}

/**
 *
 * 提计划事件
 * @param modal
 * @param item
 */
function initMentionPlanModalEvent(modal, item) {
    modal.$body.find('.budgetSelect').click(function (e) {
        common.stopPropagation(e);
        var selectModal = Modal('选择材料', selectMaterialModal());
        selectModal.$header.hide();
        selectModal.show();
        initSelectModalEvent(selectModal, modal);
        initMaterialManger.initMaterialPlanDetail(selectModal);
        initInsideModalEvent(selectModal);
        if (item.planStatus === 1) {
            var newPurchList = getNewTableList(modal, 1);
            var oldPurchList = getOldTableList(modal, 1);
            selectModal.$body.find('.confirm').data('new', newPurchList);
            selectModal.$body.find('.confirm').data('old', oldPurchList);
        } else {
            var newBdList = getNewTableList(modal, 2);
            var oldBdList = getOldTableList(modal, 2);
            selectModal.$body.find('.confirm').data('new', newBdList);
            selectModal.$body.find('.confirm').data('old', oldBdList);
        }
    });
    modal.$body.find('.purchasePeople').click(function (e) {
        common.stopPropagation(e);
        // todo
        if (item.planType === 1) {
            var user = $(this).data('user');
            scheduleManager.addEmployeeTable(user, this);
        } else {
            initMaterialManger.initGetUserTree(modal, '添加招标发布人');
        }
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var item = $('.materialPlanDetail').data('item');
        var userNo = modal.$body.find('.purchasePeople').data('item') || modal.$body.find('.purchasePeople').data('user');
        var time = modal.$body.find('input[type=date]').val();
        if (!time) {
            if (item.planType === 1) {
                return alert('请输入计划到场时间');
            } else {
                return alert('请输入计划招标结果发布时间');
            }
        }
        if (!userNo) {
            if (item.planType === 1) {
                return alert('请选择采购人');
            } else {
                return alert('请选择发布人');
            }
        }
        var list = [];
        var error = false;
        var errMsg = '';
        var trs = modal.$body.find('tbody tr');
        for (var i = 0, length = trs.length; i < length; i++) {
            var data = {};
            for (var j = 0; j < $(trs[i]).find('input').length; j++) {
                var input = $($(trs[i]).find('input')[j]);
                var name = input.attr('name');
                var val = input.val();
                var warn = input.data('warn');
                if (name === 'planCount') {
                    val = Number(val);
                }
                if (isNaN(val)) {
                    return alert('请输入数字');
                }
                data[name] = val;
                if ((val === 'undefined' || val === '') && warn) {
                    error = true;
                    errMsg = warn;
                    break;
                }
            }
            var itemTr = $(trs[i]).data('item');
            data.mtrlPlanId = item.id;
            data.mtrlSource = itemTr.mtrlSource;
            data.planRemark = itemTr.planRemark;
            data.subProjId = itemTr.subProjId;
            data.mtrlId = itemTr.mtrlId;
            if (item.planStatus === 1) {
                data.prchType = 1;
            } else {
                data.prchType = 2;
            }
            list.push(data);
            data = {};
        }
        if (error) {
            return alert(errMsg);
        }
        var $userNo = '';
        try {
            if (userNo instanceof Array) {
                $userNo = userNo[0].userNo
            } else {
                $userNo = userNo.userNo;
            }
        } catch (e) {
        }
        initMaterialManger.initPostPrchUserNoAndCount({
            mtrlPlanId: item.id,
            prchUserNo: $userNo,
            planAppearTime: time,
            projId: data.projId = $('#projectSchedule').data('id')
        }, modal, list, item.planType);
    })
}

/**
 * 选择材料
 */
function initSelectModalEvent() {
    var modal = arguments[0];
    var parentModal = arguments[1];
    /**
     * 关闭选择材料
     */
    modal.$body.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        modal.hide();
    });
    modal.$body.find('.budget-menus .item').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        if ($(this).hasClass('active')) {
            return false;
        }
        modal.$body.find('.budget-menus .item').removeClass('active');
        $(this).addClass('active');
        if (type === 'costBudget') {
            $("#" + type).show();
            $('#enterprise').hide();
        } else {
            $("#" + type).show();
            $('#costBudget').hide();
        }
    });
    modal.$body.find('.budget-menus .item:first-child').click();
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var list = [];
        var subProjectName = modal.$body.find('.subProject option:selected').text();
        var subProjectId = modal.$body.find('.subProject').val();
        if (!subProjectId || subProjectId === 'a') {
            return alert('请选择分部');
        }
        var costBudget = modal.$body.find('#costBudget tbody tr');
        for (var i = 0; i < costBudget.length; i++) {
            var _costBudget = $(costBudget[i]);
            if (_costBudget.find('[type=checkbox]').prop('checked')) {
                var item = _costBudget.data('item');
                item.mtrlSource = 1;
                list.push(item);
            }
        }
        var entList = modal.$body.find('#enterprise tbody tr');
        var entLists = [];
        var error = false;
        var errMsg = '请选择主辅材';
        for (var j = 0; j < entList.length; j++) {
            var _entList = $(entList[j]);
            if (_entList.find('[type=checkbox]').prop('checked')) {
                var $item = _entList.data('item');
                /*if (_entList.find('.active').length === 0) {
                  error = true;
                  break;
                }*/
                $item.mtrlSource = 2;
                $item.mtrlId = $item.id;
                $item.budPrice = $item.avgPrice;
                if (list.length === 0) {
                    entLists.push($item);
                }
                for (var l = 0, _length = list.length; l < _length; l++) {
                    if (list[l].mtrlId !== $item.id && list[l].subProjId !== subProjectId) {
                        entLists.push($item);
                    }
                }
            }
        }
        if (error) {
            return alert(errMsg);
        }
        list = list.concat(entLists);
        var _parents = parentModal.$body.find('tbody');
        var tableActive = $('.materialPlanDetail').data('item');
        var prchType = tableActive.planStatus === 1 ? 1 : 2;
        var price = tableActive.planType === 1 ? 'planPrice' : 'bidPrice';// todo 确定后在改
        var trs = _parents.find('.new' + prchType);
        list = filterDeduplication(trs, list);
        for (var k = 0; k < list.length; k++) {
            var _item = list[k];
            _item.count = k + 1 + trs.length;
            _item.planPrice = _item.budPrice;
            _item.prchType = prchType;
            _item.subProjId = subProjectId;
            _item.subProjName = subProjectName;
            renderCostMaterialTable.renderBiddingModalTable(_item, _parents, 'new');//添加tr数据到dom
        }
        initMaterialPlanDetail(_parents);
        modal.hide();
    });
}

/**
 * 去重复
 */
function filterDeduplication(trs, list) {
    trs = trs || [];
    list = list || [];
    for (var i = 0, length = trs.length; i < length; i++) {
        var item = $(trs[i]).data('item');
        for (var j = 0; j < list.length; j++) {
            if (item.mtrlId === list[j].mtrlId) {
                list.splice(j, 1);
            }
        }
    }
    return list;
}

/**
 * 预算内添加
 * @param modal
 */
function initInsideModalEvent(modal) {
    modal.$body.find('.materialType1').change(function (e) {
        common.stopPropagation(e);
        var childs = $(this).find('option:selected').data('item');
        var parents = modal.$body.find('.materialType2').html('');
        childs = childs || [];
        $('<option value="0">全部</option>').appendTo(parents);
        for (var i = 0, length = childs.length; i < length; i++) {
            var item = childs[i];
            var dom = $('<option></option>');
            dom.text(item.mtrlTypeName);
            dom.val(item.id);
            dom.appendTo(parents);
        }
    });
    modal.$body.find('.searchModal').click(function (e) {
        common.stopPropagation(e);
        var newList = modal.$body.find('.confirm').data('new');
        var oldList = modal.$body.find('.confirm').data('old');
        var subProject = modal.$body.find('.subProject').val();
        var materialType1 = modal.$body.find('#costBudget .materialType1').val();
        var materialType2 = modal.$body.find('#costBudget .materialType2').val();
        // var allowance = modal.$body.find('.allowance').val();
        var keyword = modal.$body.find('#costBudget .keyword').val();
        var data = {};
        if (!subProject || subProject === 'a') {
            return alert('请选择分部名称');
        }
        if (!materialType1 || materialType1 === 'a') {
            return alert('请选择材料一级分类');
        }
        if (!materialType2 || materialType2 === 'a') {
            return alert('请选择材料一级分类');
        }
        if (subProject && subProject !== 'a') {
            data.subProjId = subProject;
        }
        if (materialType1 && materialType1 !== 'a') {
            data.mtrlCategory = materialType1;
        }
        if (materialType2 && materialType2 !== 'a') {
            data.mtrlType = materialType2;
        }
        /*if (allowance && allowance !== 'a') {
          data.qpyType = allowance;
        }*/
        if (keyword) {
            data.keywords = keyword;
        }
        initMaterialManger.initMaterialPlanDetailInside(modal, data, newList, oldList);
    });
    modal.$body.find('thead [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (modal.$body.find('tbody [type=checkbox]').length === 0) {
            $(this).prop('checked', false);
            return false;
        }
        if ($(this).prop('checked')) {
            modal.$body.find('tbody [type=checkbox]').prop('checked', true);
        } else {
            modal.$body.find('tbody [type=checkbox]').prop('checked', false);
        }
    });
    modal.$body.find('.enterpriseSearch').click(function (e) {
        common.stopPropagation(e);
        var newList = modal.$body.find('.confirm').data('new');
        var oldList = modal.$body.find('.confirm').data('old');
        var subProject = modal.$body.find('.subProject').val();
        var materialType1 = modal.$body.find('#enterprise .materialType1').val();
        var materialType2 = modal.$body.find('#enterprise .materialType2').val();
        var keyword = modal.$body.find('#enterprise .keyword').val();
        var data = {};
        if (!subProject || subProject === 'a') {
            return alert('请选择分部名称');
        }
        if (!materialType1 || materialType1 === 'a') {
            return alert('请选择材料一级分类');
        }
        if (!materialType2 || materialType2 === 'a') {
            return alert('请选择材料一级分类');
        }
        if (subProject && subProject !== 'a') {
            data.subProjId = subProject;
        }
        if (materialType1 && materialType1 !== 'a') {
            data.mtrlCategory = materialType1;
        }
        if (materialType2 && materialType2 !== 'a') {
            data.mtrlType = materialType2;
        }
        if (keyword) {
            data.keywords = keyword;
        }
        initMaterialManger.getEnterpriseMaterialFunc(data, modal, newList, oldList);
    });
    modal.$body.find('#newMaterial').click(function (e) {
        var that = this;
        console.log('lalala');
        common.stopPropagation(e);
        $('.material-manager-modal').remove();
        addMaterial = $(addMaterialModal());
        var categorySel = addMaterial.find('.category-sel');//类别选择框(一级)
        var categoryIpt = addMaterial.find('.category-ipt');//类别输入框(一级)
        var typeSel = addMaterial.find('.type-sel');//类型选择框(二级)
        var typeIpt = addMaterial.find('.type-ipt');//类型输入框(二级)
        categorySel.find('ul').css({'maxHeight':'400px'});
        /*添加一级下拉菜单*/
        $(this).next('.fl').find('.materialType1 option').each(function (index, ele) {
            if (index > 0) {
                var dom = $('<li>' + $(ele).html() + '</li>');
                dom.data('item', $(ele).val());
                dom.data('list', $(ele).data('item'));
                dom.appendTo(categorySel.find('ul'));
                /*初始化一级菜单中li的点击事件*/
                costBudgetManagerEventModal._typeListEvent('material', dom, addMaterial, 'Cntr');
            }
        })
        addMaterial.css({'left': '847px', 'top': '-30px'});
        addMaterial.appendTo($('.add-material-modal'));
        /*初始化菜单交互事件*/
        costBudgetManagerEventModal._materialShift(categorySel, categoryIpt, 'materialType');
        costBudgetManagerEventModal._materialShift(typeSel, typeIpt);

        /*预选*/
        var materialType1 = $('.materialType1').eq(1).val();
        var materialType2 = $('.materialType2').eq(1).val();
        categorySel.find('ul li').each(function (index, ele) {
            if ($(ele).data('item') == materialType1) {
                $(ele).click();
            }
        });
        typeSel.find('ul li').each(function (index, ele) {
            if ($(ele).data('item')) {
                if ($(ele).data('item').id == materialType2) {
                    $(ele).click();
                }
            }
        });


        $(this).parents('.model-inner').click(function (e) {
            common.stopPropagation(e);
            addMaterial.remove();
        });
        addMaterial.click(function (e) {
            common.stopPropagation(e);
        });
        addMaterial.find('.cancel').click(function (e) {
            common.stopPropagation(e);
            addMaterial.remove();
        });
        addMaterial.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var data = {};
            var mtrlCategoryName = categoryIpt.find('input').val() || categorySel.children('span').html();
            var mtrlTypeName = typeIpt.find('input').val() || typeSel.children('span').html();
            if (mtrlCategoryName === '选择材料类别') {
                return alert('请选择或新增材料类别');
            }
            if (mtrlTypeName === '选择材料类型') {
                return alert('请选择或新增材料类型');
            }
            /*如果是新建材料，则不用传id*/
            if (categoryIpt.find('input').val()) {
                data.mtrlCategory = '';
            } else {
                data.mtrlCategory = Number($('.material-category').data('item'));
            }
            ;
            if (typeIpt.find('input').val()) {
                data.mtrlType = '';
            } else {
                data.mtrlType = $('.material-type').data('item').id;
            }
            ;
            data.mtrlTypeName = mtrlTypeName;
            data.mtrlCategoryName = mtrlCategoryName;
            data.mtrlName = addMaterial.find('[name=mtrlName]').val();
            data.specBrand = addMaterial.find('[name=specBrand]').val();
            data.unit = addMaterial.find('[name=unit]').val();
            if (!data.mtrlName) {
                return alert('请输入新增材料名称');
            }
            if (!data.specBrand) {
                return alert('请输入新增规格型号')
            }
            if (!data.unit) {
                return alert('请输入新增材料单位');
            }
            chargeApi.postMaterialBaseAll(data, 'material', function (res) {
                if (res.code === 1) {
                    var subProject = $('.subProject').val();
                    addMaterial.remove();
                    $(that).parents('.model-inner').remove();
                    $('.budgetSelect').click();
                    $('.enterprise').click();

                    /*监听数据的加载*/
                    function materialDataListener() {
                        var flag = true;//分部节流阀
                        var _flag = true;//材料分类节流阀
                        var num = 0;//超过4秒停止监听
                        var listenSubP = setInterval(function () {
                            /*监听分部*/
                            if ($('.subProject').find('option').length > 0 && flag) {
                                $('.subProject').val(subProject);
                                flag = false;
                            }
                            /*监听两级下拉菜单*/
                            if ($('.materialType1').eq(1).find('option').length > 0 && _flag && num < 200) {
                                $('.materialType1').eq(1).val(materialType1);
                                /*模拟一级分类的change事件*/
                                var childs = $('.materialType1').eq(1).find('option:selected').data('item');
                                var parents = $('.materialType2').eq(1).html('');
                                childs = childs || [];
                                $('<option value="0">全部</option>').appendTo(parents);
                                for (var i = 0, length = childs.length; i < length; i++) {
                                    var _dom = $('<option></option>');
                                    _dom.text(childs[i].mtrlTypeName);
                                    _dom.val(childs[i].id);
                                    _dom.appendTo(parents);
                                }
                                $('.materialType2').eq(1).val(materialType2);
                                _flag = false;
                            }
                            /*数据加载完成后，点击查询按钮，并清除计时器*/
                            if (!flag && !_flag) {
                                $('.enterpriseSearch').click();
                                clearInterval(listenSubP);
                            }
                            num++;
                        }, 20);
                    }

                    materialDataListener();
                }
            })
        });
    })


    //   common.stopPropagation(e);
    //   var enterprise = $('#enterprise');
    //   if (enterprise.find('.enterprise-add').length > 0) {
    //     return;
    //   }
    //   var addMaterial = $(addMaterialModal());
    //   addMaterial.css('left', 118);
    //   addMaterial.css('top', -32);
    //   addMaterial.find('.triangle-left').css('top', 34);
    //   addMaterial.appendTo(enterprise);
    //   addMaterial.find('.confirm').click(function (e) {
    //     common.stopPropagation(e);
    //     var materialType1 = modal.$body.find('#enterprise .materialType1').val();
    //     var materialType2 = modal.$body.find('#enterprise .materialType2').val();
    //     var mtrlName = addMaterial.find('[name=mtrlName]').val();
    //     var specBrand = addMaterial.find('[name=specBrand]').val();
    //     var unit = addMaterial.find('[name=unit]').val();
    //     if (!materialType1 || materialType1 === 'a') {
    //       return alert('请选择材料类别');
    //     }
    //     if (!materialType2 || materialType2 === 'a') {
    //       return alert('请选择材料分类');
    //     }
    //     if (!mtrlName || mtrlName.trim() === '') {
    //       return alert('请输入材料名称');
    //     }
    //     if (!specBrand || specBrand.trim() === '') {
    //       return alert('请输入规格型号');
    //     }
    //     if (!unit || unit.trim() === '') {
    //       return alert('请输入单位');
    //     }
    //     enterpriseApi.postMaterialBase({
    //       mtrlCategory: materialType1,
    //       mtrlType: materialType2,
    //       mtrlName: mtrlName,
    //       specBrand: specBrand,
    //       unit: unit
    //     }).then(function (res) {
    //       if (res.code === 1) {
    //         enterprise.find('.enterprise-add').remove();
    //         modal.$body.find('.enterpriseSearch').click();
    //       }
    //     })
    //   });
    //   addMaterial.find('.cancel').click(function (e) {
    //     common.stopPropagation(e);
    //     enterprise.find('.enterprise-add').remove();
    //   })
    // });
}

exports.initBesideModalTableEvent = function (modal) {
    var type = modal.$body.find('.page-budget a.active').data('type');
    modal.$body.find('#' + type + ' tbody [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (modal.$body.find('#' + type + ' tbody [type=checkbox]:checked').length === 0) {
            modal.$body.find('#' + type + ' thead [type=checkbox]').prop('checked', false);
        } else {
            modal.$body.find('#' + type + ' thead [type=checkbox]').prop('checked', true);
        }
    });
    modal.$body.find('.radio').click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data('id');
        if ($('.select' + id).hasClass('active') && !$(this).hasClass('active')) {
            $('.select' + id).removeClass('active');
            $(this).addClass('active');
        } else {
            $(this).addClass('active');
        }
    });
};

/**
 * 可计划量
 */
exports.initPlanAmountEvent = function (page) {
    var searchModal = $('.searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        $('.showAllowance').click(function (e) {
            common.stopPropagation(e);
            if ($(this).hasClass('background-list-gray')) {
                $('.showAllowance').addClass('background-list-gray');
                $(this).removeClass('background-list-gray');
            } else {
                $(this).addClass('background-list-gray');
            }
        });
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var keyword = $('.keyword').val().trim();
            var subProject = $('.subProject').val();
            var data = {subProjId: subProject};
            if (keyword) {
                data.keywords = keyword;
            }
            $(".showAllowance").each(function () {
                var hasGray = $(this).hasClass('background-list-gray');
                if (!hasGray) {
                    data.type = $(this).data('type');
                }
            })
            initMaterialManger.initMaterialPlanAmount(data, page, 'check');
        });

    }
    searchModal.click();
};

function parseQpyType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return 2;
        case 2:
            return 1;
    }
}

/**
 * 采购汇总事件
 */
exports.initPurchaseSumEvent = function (page) {
    var searchModal = $('.searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var subProject = $('.subProject').val();
            var costType = $('.costType').val();
            var mtrlType = $('.mtrlType').val();
            var mtrlCategory = $('.mtrlCategory').val();
            var mtrlPlanNo = $('.mtrlPlanNo').val();
            if (!subProject) {
                subProject = $('.subProject option:first').val();
                $('.subProject option:first').attr('selected', true);
            }
            var keyword = $('.keyword').val().trim();
            var data = {};
            if (keyword) {
                data.keywords = keyword;
            }
            data.subProjId = subProject;
            data.mtrlSource = costType;
            data.mtrlType = mtrlType;
            data.mtrlCategory = mtrlCategory;
            data.mtrlPlanNo = mtrlPlanNo;
            if (!data.mtrlPlanNo) {
                delete data.mtrlPlanNo;
            }
            initMaterialManger.initMaterialPurchaseSum(data, page);
        })
    }
    searchModal.click();
    $('.mtrlCategory').change(function () {
        var categoryId = $(this).val();
        initMaterialManager.initMaterialType(categoryId);
    })
};
/**
 * 库存量
 */
exports.initPlanSummaryEvent = function (page) {
    var searchModal = $('.searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        $('.showAllowance').click(function (e) {
            common.stopPropagation(e);
            if ($(this).hasClass('background-list-gray')) {
                $('.showAllowance').addClass('background-list-gray');
                $(this).removeClass('background-list-gray');
            } else {
                $(this).addClass('background-list-gray');
            }
        });
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var subProject = $('.subProject').val();
            if (!subProject) {
                subProject = $('.subProject option:first').val();
                $('.subProject option:first').attr('selected', true);
            }
            var showAllowance = $('.showAllowance.background-list-gray').data('type');
            var keyword = $('.keyword').val().trim();
            var data = {};
            if (keyword) {
                data.keywords = keyword;
            }
            data.subProjId = subProject;
            if (showAllowance) {
                data.type = parseQpyType(showAllowance);
            }
            initMaterialManger.initMaterialPlanSummary(data, page);
        })
    }
    searchModal.click();
};
/**
 * 初始化提计划的table 修改 跟 删除事件
 * @param parents
 */
exports.initMaterialPlanModalTbodyEvent = function (parents) {
    parents.$body.find('tbody a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var deleteModal = Modal('提示', delModal());
        deleteModal.show();
        deleteModal.showClose();
        deleteModal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            initMaterialManger.initDelMaterialDetailModal(item, deleteModal, parents);
        });
    });
};
/**
 * 初始化采购编辑的事件
 * @param parents
 */
exports.initPurchaseEditModalEvent = function (parents) {
    parents.find('[name=prchCount]').keyup(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var tr = $(this).parents('tr');
        var price = tr.find('[name=prchPrice]').val();
        tr.find('.totalMoney').text((value * price).toFixed(2));
    });
    parents.find('[name=prchPrice]').keyup(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var tr = $(this).parents('tr');
        var count = tr.find('[name=prchCount]').val();
        try {
            var sum = value + '*' + count;
            sum = eval(sum);
            tr.find('.totalMoney').text(sum.toFixed(2));
        } catch (e) {
            // return alert('请输入正确的数字');
        }
        tr.find('.totalMoney').text((value * count).toFixed(2));
    });
    /**
     * 供应商
     */
    parents.find('.supplierType').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        parents.find('.model-add-supplier').remove();
        new addSupplier($(this), $(this).next('.supplierList'));
        $('.clear-content').click(function () {//清除内容
            $(that).text('单击选择');
        })
        parents.find('.model-add-supplier').click(function (e) {
            common.stopPropagation(e);
        })
        // $(this).parents('tr').addClass('trHeightLight');//选中行高亮
        var offsetX = $(".Model")[0].offsetLeft;//获取鼠标X坐标
        var offsetY = $(".Model")[0].offsetTop;//获取鼠标Y坐标
        $(this).parent().find('.model-add-supplier').css({'left': e.pageX - offsetX, 'top': e.pageY - offsetY});//弹出框定位
    });
    /**
     * 计划款项
     */
    parents.find('.planType').click(function (e) {
        common.stopPropagation(e);
        parents.find('.modal-add-type').remove();
        var dom = $(addPlanType());
        dom.appendTo($(this).next('.planList'));
        dom.find('.icon-close').click(function (e) {
            common.stopPropagation(e);
            parents.find('.modal-add-type').remove();
        });
        var offsetX = $(".Model")[0].offsetLeft;//获取鼠标X坐标
        var offsetY = $(".Model")[0].offsetTop;//获取鼠标Y坐标
        $(this).parent().find('.modal-add-type').css({'left': e.pageX - offsetX, 'top': e.pageY - offsetY});//弹出框定位
        initPlanTypeEvent(dom, $(this));
    })
    parents.find('.clearPlan').click(function (e) {//采购编辑清除材料内容
        common.stopPropagation(e);
        var that = this;
        var delModal = Modal('提示', deleteModal());
        delModal.showClose();
        delModal.show();
        delModal.$body.find('.enterprise-remind').html('确定清除吗？');
        delModal.$body.find('.confirm').click(function () {
            var data = {};
            var item = $('#materialPlanDetail').data('item');
            var entItem = $(that).parents('tr').data('item');
            data.mtrlPlanId = item.id;
            data.id = entItem.id;
            costMaterialApi.delMaterialPlan2(data).then(function () {
                $(that).parents('tr').find('input').each(function () {
                    $(this).val('');
                })
                $(that).parents('tr').find('.totalMoney').html('系统计算');
                $(that).parents('tr').find('.supplierType').html('单击选择').next().attr('id', '');
                $(that).parents('tr').find('.planType').removeData('item').html('单击选择');
                $(that).parents('tr').find('[name=prchTaxType]').prop('checked', false);
                delModal.$body.find('.span-btn-bc').click();
            })
        })
    })
};

function initPlanTypeEvent(modal, parents) {
    modal.find('li').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('clear-content')) {//清除内容
            parents.text('单击选择');
            parents.removeData('item');
        } else {
            var text = $(this).text();
            var id = $(this).data('id');
            parents.text(text);
            parents.data('item', {acctType: id, text: text});
        }
        modal.remove();
    })
}

/**
 * 供应商分类事件
 * @param modal
 * @param parents
 */
exports.initSupplierModalEvent = function (modal, parents) {
    modal.find('.supplierType li').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        initMaterialManger.initSupplierList({entpType: item.id}, modal, parents);
    });
};
/**
 * 供应商列表事件
 * @param parents
 * @param modal
 */
exports.initSupplierListModalEvent = function (modal, parents) {
    modal.click(function (e) {
        common.stopPropagation(e);
    })
    modal.find('.supplier-detail li').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        parents.data('item', item);
        parents.text(item.entpName);
        modal.remove();
    })
};
/**
 * 绘制费用单 table 事件
 * @param parents
 */
exports.initCostOrderTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var materialCostOrder;
        if (item.acctType === 2) {//应付款项
            materialCostOrder = Modal('材料管理(应付款)费用单', materialCostOrderManager());
            initMaterialManger.initGetMaterialCostOrderDetail({
                costId: item.id,
                mtrlPlanId: item.mtrlPlanId
            }, materialCostOrder, function () {
                materialCostOrder.show();
            });
            initMaterialCostOrderEvent(materialCostOrder, item);
            if (item.status === 1 || item.status === 4) {
                materialCostOrder.$body.find('.importContract').css('display', 'inline-block');
                materialCostOrder.$body.find('.payMoney').css('display', 'inline-block');
                materialCostOrder.$body.find('.approvalMaterial').css('display', 'inline-block');
            } else {
                materialCostOrder.$body.find('.importContract').hide();
                materialCostOrder.$body.find('.payMoney').hide();
                materialCostOrder.$body.find('.approvalMaterial').hide();
            }
        } else if (item.acctType === 1) {//实付款（无合同）
            var materialPayOrder = Modal('材料管理(实付款无合同)费用报销单', materialPayOrderNoBudgetManager());
            if (item.status === 1 || item.status === 4) {
                materialPayOrder.$body.find('.approvalMaterial').css('display', 'inline-block');
            } else {
                materialPayOrder.$body.find('.approvalMaterial').hide();
            }
            initMaterialManger.initGetMaterialCostOrderDetail({
                costId: item.id,
                mtrlPlanId: item.mtrlPlanId
            }, materialPayOrder, function () {
                materialPayOrder.show();
                materialPayOrder.showClose();
            });
            materialPayOrder.$body.find('.approvalMaterial').click(function (e) {
                common.stopPropagation(e);
                var approval = new approvalProcess('材料审批流程', function () {
                    var data = approval.getSelectData();
                    var remark = materialPayOrder.$body.find('[name=remark]').val();
                    var costName = materialPayOrder.$body.find('[name=costName]').val();
                    if (!costName) {
                        return alert('请输入费用单名称');
                    }
                    initMaterialManger.initPostCostOrderName({
                        remark: remark,
                        costName: costName,
                        costId: item.id,
                        tmplId: data.id,
                        status: 2,
                    }, materialPayOrder, approval);
                });
                approval.getApprovalModal(5);
            })
        } else if (item.acctType === 3) {//实付款（有合同）
            materialPayBudgetOrder = Modal('材料管理(实付款有合同)费用报销单', materialPayOrderBudgetManager());
            initMaterialManger.initGetMaterialCostOrderDetail({
                costId: item.id,
                mtrlPlanId: item.mtrlPlanId
            }, materialPayBudgetOrder, function () {
                materialPayBudgetOrder.show();
            });
            initMaterialCostOrderEvent(materialPayBudgetOrder, item);
            if (item.status === 1 || item.status === 4) {//导入合同信息 和 提交审批 的状态展示
                materialPayBudgetOrder.$body.find('.importContract').css('display', 'inline-block');
                materialPayBudgetOrder.$body.find('.payMoney').css('display', 'inline-block');
                materialPayBudgetOrder.$body.find('.approvalMaterial').css('display', 'inline-block');
            } else {
                materialPayBudgetOrder.$body.find('.importContract').hide();
                materialPayBudgetOrder.$body.find('.payMoney').hide();
                materialPayBudgetOrder.$body.find('.approvalMaterial').hide();
            }
        }
    })
};

/**
 * 材料费用事件
 */
function initMaterialCostOrderEvent(materialCostOrder) {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.approvalMaterial').click(function (e) {
        common.stopPropagation(e);
        var entprId = $('.entprName').data('entprId');
        var _entprId = $('#contractInfo .cntrName').data('entprId');
        if (entprId !== _entprId && _entprId) {
            var compSupplierModal = Modal('提示', compareSupplierModal());
            compSupplierModal.show();
            compSupplierModal.showClose();
            compSupplierModal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var approval = new approvalProcess('材料审批流程', function () {
                    var _item = approval.getSelectData();
                    var remark = modal.$body.find('[name=remark]').val();
                    var costName = modal.$body.find('[name=costName]').val();
                    var ensureMoney = modal.$body.find('[name=ensureMoney]').val();
                    var ensureMonth = modal.$body.find('[name=ensureMonth]').val();
                    var contract = modal.$body.find('.importContract').data('item');
                    var bookMoney = modal.$body.find('.payedMoney').data('bookMoney');
                    var bookTaxMoney = modal.$body.find('.payedTaxMoney').data('payedTaxMoney');
                    if (!costName) {
                        return alert('请输入费用单名称');
                    }
                    if (!ensureMoney) {
                        return alert('请输入质保金额')
                    }
                    if (isNaN(ensureMoney)) {
                        return alert('请输入正确的质保金额');
                    }
                    if (!ensureMonth) {
                        return alert('请输入质保期');
                    }
                    if (isNaN(ensureMonth)) {
                        return alert('请输入正确的质保期');
                    }
                    var cntrId = '';
                    if (contract) {
                        cntrId = contract.id;
                    }
                    var $bookMoney = '';
                    if (bookMoney) {
                        $bookMoney = bookMoney
                    }
                    var $bookTaxMoney = '';
                    if (bookMoney) {
                        $bookTaxMoney = bookTaxMoney
                    }

                    initMaterialManger.initPostCostOrderName({
                        remark: remark,
                        costName: costName,
                        bookMoney: $bookMoney,
                        bookTaxMoney: $bookTaxMoney,
                        costId: item.id,
                        ensureMoney: ensureMoney,
                        ensureMonth: ensureMonth,
                        status: 2,
                        cntrId: cntrId,
                        tmplId: _item.id
                    }, materialCostOrder, approval);
                });
                approval.getApprovalModal(5);
                compSupplierModal.hide();
            });
        } else {
            var approval = new approvalProcess('材料审批流程', function () {
                var _item = approval.getSelectData();
                var remark = modal.$body.find('[name=remark]').val();
                var costName = modal.$body.find('[name=costName]').val();
                var ensureMoney = modal.$body.find('[name=ensureMoney]').val();
                var ensureMonth = modal.$body.find('[name=ensureMonth]').val();
                var contract = modal.$body.find('.importContract').data('item');
                var bookMoney = modal.$body.find('.payedMoney').data('bookMoney');
                var bookTaxMoney = modal.$body.find('.payedTaxMoney').data('payedTaxMoney');
                if (!costName) {
                    return alert('请输入费用单名称');
                }
                if (!ensureMoney) {
                    return alert('请输入质保金额')
                }
                if (isNaN(ensureMoney)) {
                    return alert('请输入正确的质保金额');
                }
                if (!ensureMonth) {
                    return alert('请输入质保期');
                }
                if (isNaN(ensureMonth)) {
                    return alert('请输入正确的质保期');
                }
                var cntrId = '';
                if (contract) {
                    cntrId = contract.id;
                }
                var $bookMoney = '';
                if (bookMoney) {
                    $bookMoney = bookMoney
                }
                var $bookTaxMoney = '';
                if (bookMoney) {
                    $bookTaxMoney = bookTaxMoney
                }

                initMaterialManger.initPostCostOrderName({
                    remark: remark,
                    costName: costName,
                    bookMoney: $bookMoney,
                    bookTaxMoney: $bookTaxMoney,
                    costId: item.id,
                    ensureMoney: ensureMoney,
                    ensureMonth: ensureMonth,
                    status: 2,
                    cntrId: cntrId,
                    tmplId: _item.id
                }, materialCostOrder, approval);
            });
            approval.getApprovalModal(5);
        }
    });
    modal.$body.find('.payMoney').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        $(that).removeClass('span-btn-bc');
        var payMoney = Modal('定金', payMoneyModal());
        payMoney.show();
        payMoney.$body.find('.cancel').click(function (e) {
            common.stopPropagation(e);
            modal.$body.find('.model-footer span').addClass('span-btn-bc');
            payMoney.hide();
        });
        payMoney.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var bookMoney = payMoney.$body.find('[name=bookMoney]').val();
            var bookTaxMoney = payMoney.$body.find('[name=bookTaxMoney]').val();
            if (!bookMoney || isNaN(bookMoney)) {
                return alert('请输入正确的支付金额');
            }
            if (!bookTaxMoney || isNaN(bookTaxMoney)) {
                return alert('请输入正确的税票金额');
            }
            modal.$body.find('.model-footer span').addClass('span-btn-bc');
            payMoney.hide();
            modal.$body.find('.payedMoney').data('bookMoney', bookMoney);
            bookMoney = bookMoney ? '已支付金额:(' + bookMoney + ')' : '';
            modal.$body.find('.payedMoney').html(bookMoney);
            modal.$body.find('.payedTaxMoney').data('payedTaxMoney', bookTaxMoney);
            bookTaxMoney = bookTaxMoney ? '已提供税票:(' + bookTaxMoney + ')' : '';
            modal.$body.find('.payedTaxMoney').html(bookTaxMoney);
        })
    });

    /*取消*/
    modal.$body.find('.cancel').click(function (e) {
        common.stopPropagation(e);
        modal.$body.find('.model-footer span').addClass('span-btn-bc');
        modal.hide();
    });

    /*导入合同信息 按钮初始化*/
    modal.$body.find('.importContract').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        $(that).removeClass('span-btn-bc');
        var materialPurchContract = Modal('材料采购合同', materialPurchContractModal());
        materialPurchContract.show();
        initMaterialManger.getMaterialContractListFunc({
            type: 1,
            projId: item.projId,
            subProjId: item.subProjId
        }, materialPurchContract);

        materialPurchContract.$body.find('.cancel').click(function (e) {
            common.stopPropagation(e);
            modal.$body.find('.model-footer span').addClass('span-btn-bc');
            materialPurchContract.hide();
        });

        materialPurchContract.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var radio = materialPurchContract.$body.find('.radio.active');
            if (radio.length === 0) {
                return alert('请选择管理的合同');
            }
            var _item = radio.parents('.contract-item').data('item');
            var subProjName = $('.subProjName').data('subProjName');
            var _subProjName = _item.subProjName;
            if (subProjName !== _subProjName && _subProjName) {
                // var compBranchModal = Modal('提示', compareBranchModal());
                // compBranchModal.show();
                // compBranchModal.showClose();
                // compBranchModal.$body.find('.confirm').click(function(){
                //     compBranchModal.$body.find('.span-btn-bc').click();
                // })
                alert('分部不同，不可关联此合同');
            } else {
                if (_item.cntrName === '无合同') {
                    materialPurchContract.hide();
                    $(that).data('item', '');
                    modal.$body.find('.model-footer span').addClass('span-btn-bc');
                    modal.$body.find('#contractInfo').hide();
                } else {
                    $(that).data('item', _item);
                    modal.$body.find('.model-footer span').addClass('span-btn-bc');
                    modal.$body.find('#contractInfo').show();
                    modal.$body.find('.cntrName').html(_item.cntrName);
                    modal.$body.find('.cntrName').data('entprId', _item.entprId);
                    modal.$body.find('.cntrNo').html(_item.cntrNo);
                    modal.$body.find('.entpName').html(_item.cntrParty);
                    modal.$body.find('.cntrPrice').html(_item.cntrPrice);
                    var taxType = _item.taxType === 1 ? '是' : '否'
                    modal.$body.find('[name=taxType]').html(taxType);
                    var enterpBase = _item.enterpBase || {};
                    var payTypeDesc = _item.payTypeDesc || "无"
                    var ensureMonth = _item.ensureMonth ? _item.ensureMonth + '个月' : '0个月'
                    var ensurePer = _item.ensurePer ? _item.ensurePer + '％' : 0 + '%';
                    modal.$body.find('.contactName').html(enterpBase.contactName);
                    modal.$body.find('.ensureMoney').html(ensurePer);
                    modal.$body.find('.ensureMonth').html(ensureMonth);
                    modal.$body.find('.payTypeDesc').html(payTypeDesc);
                    modal.$body.find('.openBank').html(enterpBase.openBank);
                    modal.$body.find('.openName').html(enterpBase.openName);
                    modal.$body.find('.bankCard').html(enterpBase.bankCard);
                    var costMoney = modal.$body.find('.costMoney').html() || 0;
                    var taxMoney = modal.$body.find('.taxMoney').html() || 0;
                    var payedMoney = _item.prepayMoney || _item.bookMoney || 0;
                    var payableMoney = costMoney - payedMoney;
                    modal.$body.find('.payableMoney').html(payableMoney.toFixed(2));
                    payedMoney = '已支付金额:(' + payedMoney + '元' + ')';
                    modal.$body.find('.payedMoney').html(payedMoney);
                    var payedTaxMoney = _item.prepayTaxMoney || _item.bookTaxMoney || 0;
                    var payableTaxMoney = taxMoney - payedTaxMoney;
                    modal.$body.find('.payableTaxMoney').html(payableTaxMoney);
                    payedTaxMoney = '已提供税票:(' + payedTaxMoney + '元' + ')';
                    modal.$body.find('.payedTaxMoney').html(payedTaxMoney);
                    materialPurchContract.hide();
                }
            }
            ;
        })
    });
}

/**
 * 可执行计划table 事件
 * @param parents
 */
exports.initMaterialPlanAmountTable = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var td = $(this).parents('td');
        var item = $(this).parents('tr').data('item');
        $('.purchaseOrder').remove();
        if (type === 'purchase') {
            var checkModal = $(checkMeasureModal());
            checkModal.appendTo(td);
            initMaterialPlanPurchaseOrder(checkModal, item);
            initMaterialPlanPurchaseEvent(checkModal, parents)
        } else {
            var planModal = $(checkPlanModal());
            planModal.appendTo(td);
            initMaterialPlanPurchaseEvent(planModal, parents);
            initMaterialPlanPurchaseTotalOrder(planModal, item);
        }
    })
};

function initMaterialPlanPurchaseTotalOrder(modal, item) {
    initMaterialManger.initGetPurchaseOrderTotalList({mtrlId: item.mtrlId, subProjId: item.subProjId}, modal)
}

function initMaterialPlanPurchaseEvent(modal, parents) {
    parents.find('.purchaseOrder').click(function (e) {
        common.stopPropagation(e);
    })
    modal.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        parents.find('.purchaseOrder').remove();
    });
}

function initMaterialPlanPurchaseOrder(modal, item) {
    initMaterialManger.initGetPurchaseOrderList({mtrlId: item.mtrlId, subProjId: item.subProjId}, modal);
}

/**
 * 库存量 table 事件初始化
 * @param parents
 */
exports.initSummaryTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var td = $(this).parents('td');
        var item = $(this).parents('tr').data('item');
        if (type === 'summary') {
            $('.purchaseOrder').remove();
            var summaryModal = $(addSummaryModal());
            summaryModal.appendTo(td);
            initSummaryModalData(summaryModal, item);
            initSummaryModalEvent(summaryModal, item, parents);
        } else if (type === 'check') {
            var deliveryModal = Modal('查看出库', checkDeliveryModal());
            deliveryModal.show();
            deliveryModal.showClose();
            initSummaryModalDetailData(deliveryModal, item);
            initMaterialManger.checkSummaryListModal({
                subProjId: item.subProjId,
                mtrlId: item.mtrlId
            }, deliveryModal, item);
        } else {
            var purchaseModal = Modal('查看采购', checkPurchaseModal());
            purchaseModal.show();
            purchaseModal.showClose();
            initMaterialManger.checkPurchaseListModal({subProjId: item.subProjId, mtrlId: item.mtrlId}, purchaseModal);
        }
    })
};

function initSummaryModalEvent(modal, item, parents) {
    modal.click(function (e) {
        common.stopPropagation(e);
    });
    modal.find('.chargeUserName').click(function (e) {//出库单选择批准人
        common.stopPropagation(e);
        var that = this;
        getOrganize.getOrganizeStrucEmployee().then(function (res) {
            if (res.code === 1) {
                var getChargeUserName = Modal('选择批准人', addOrgEmployeeModal());
                getChargeUserName.show();
                getChargeUserName.showClose();
                for (var i = 0; i < res.data.length; i++) {
                    var projPosName = res.data[i].projPosName || '无';
                    var dom = $('<tr>' +
                        '<td class="border"><input type="checkbox"></td>' +
                        '<td class="border">' + (i + 1) + '</td>' +
                        '<td class="border">' + res.data[i].userName + '</td>' +
                        '<td class="border">' + projPosName + '</td>' +
                        '</tr>')
                    dom.data('data', res.data[i]);
                    getChargeUserName.$body.find('tbody').append(dom);
                }
                getChargeUserName.$body.find("input").click(function () {
                    $("input").prop('checked', false).removeClass('active');
                    $(this).prop('checked', true).addClass('active');
                })
                getChargeUserName.$body.find('.confirm').click(function () {
                    var checkInput = getChargeUserName.$body.find('input.active');
                    if (checkInput.length === 0) {
                        return alert('请选择批准人');
                    }
                    var userName = checkInput.parents().next().next().html();
                    $(that).find('input').val(userName);
                    $(that).find('input').data('data', checkInput.parents('tr').data('data'));
                    getChargeUserName.$body.find('.span-btn-bc').click();
                })
            }
        })
    })
    modal.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        parents.find('.purchaseOrder').remove();
    });
    modal.find('.span-btn-bc').click(function (e) {
        common.stopPropagation(e);
        parents.find('.purchaseOrder').remove();
    });
    modal.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        if ($('.entprName').data('data')) {
            var teamId = $('.entprName').data('data').teamId;
        } else {
            var teamId = '';
        }
        if ($('.applyName').data('data')) {
            var applyName = $('.applyName').data('data').workerName;
            var applyUserNo = $('.applyName').data('data').workerNo;
        } else {
            var applyName = '';
            var applyUserNo = '';
        }
        var outCount = $('[name=outCount]').val();
        var chargeUserName = $('[name=chargeUserName]').val();
        if ($('[name=chargeUserName]').data('data')) {
            var chargeUserNo = $('[name=chargeUserName]').data('data').addUserNo;
        } else {
            var chargeUserNo = '';
        }
        var usedSubProjId = item.subProjId;
        var mtrlId = item.mtrlId;
        var remark = $('[name=remark]').val();
        if (!teamId) {
            return alert('请选择班组');
        }
        if (!applyName) {
            return alert('请输入申请人')
        }
        if (!outCount) {
            return alert('请输入领用数量');
        }
        if (isNaN(outCount * 1)) {
            return alert('请输入正确数字');
        }
        if (!chargeUserName) {
            return alert('请选择批准人');
        }
        initMaterialManger.initPostOutBandHandler({
            teamId: teamId,
            applyName: applyName,
            applyUserNo: applyUserNo,
            mtrlId: mtrlId,
            outCount: outCount,
            remark: remark,
            usedSubProjId: usedSubProjId,
            chargeUserName: chargeUserName,
            chargeUserNo: chargeUserNo
        });
    });
    modal.find('.entprName').click(function (e) {
        var that = this;
        common.stopPropagation(e);
        var addTeam = Modal('选择班组', addTeamModal());
        addTeam.show();
        addTeam.showClose();
        enterpriseApi.getAllEntpTeams().then(function (res) {
            var list = res.data || [];
            renderCostMaterialTable.renderAddTeamTable(list, addTeam, that);
        })
    })
    modal.find('.applyName').click(function (e) {
        var that = this;
        common.stopPropagation(e);
        if ($('.entprName').data('data')) {
            var addWorker = Modal('选择人员', addWorkerModal());
            addWorker.show();
            addWorker.showClose();
            var data = {};
            data.teamId = $('.entprName').data('data').teamId;
            costMaterialApi.getWorkers(data).then(function (res) {
                var list = res.data || [];
                renderCostMaterialTable.renderAddWorkerTable(list, addWorker, that);
            })
        } else {
            return alert('请先选择班组');
        }
    })
}

function initSummaryModalData(modal, item) {
    modal.find('[name=mtrlName]').val(item.mtrlName);
    modal.find('[name=mtrlName]').val(item.mtrlName);
    modal.find('[name=mtrlName]').val(item.mtrlName);
    modal.find('[name=subProjName]').val(item.subProjName);
}

/**
 * 查看出库详情
 * @param modal
 * @param item
 */
function initSummaryModalDetailData(modal, item) {
    modal.$body.find('.mtrlName').text(item.mtrlName);
    modal.$body.find('.specBrand').text(item.specBrand);
    modal.$body.find('.unit').text(item.unit);
}

/**
 * 获取还没有保存的材料
 * @param modal
 * @param type 1 新添加计划材料 2 补单计划材料
 * @returns {Array}
 */
function getNewTableList(modal, type) {
    var trs = modal.$body.find('tbody tr.new' + type);
    var list = [];
    for (var i = 0, length = trs.length; i < length; i++) {
        list.push($(trs[i]).data('item'));
    }
    return list;
}

/**
 * 获取已经保存的计划材料
 * @param modal
 * @param type 1 新添加计划材料 2 补单计划材料
 * @returns {Array}
 */
function getOldTableList(modal, type) {
    var trs = modal.$body.find('tbody tr.old' + type);
    var list = [];
    for (var i = 0, length = trs.length; i < length; i++) {
        list.push($(trs[i]).data('item'));
    }
    return list;
}

exports.initBidSuccessFullModalTableEvent = function (parents) {
    parents.find('.clearPlan').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        var delModal = Modal('提示', deleteModal());
        delModal.showClose();
        delModal.show();
        delModal.$body.find('.enterprise-remind').html('确定清除吗？');
        delModal.$body.find('.confirm').click(function () {
            var data = {};
            data.id = $(that).parents('tr').data('item').id;
            data.mtrlPlanId = $('#materialPlanDetail').data('item').id;
            costMaterialApi.delBidSuccessPlan(data).then(function () {

                $(that).parents('tr').find('[name=bidPrice]').val('');
                $(that).parents('tr').find('[name=bidPlace]').val('');
                $(that).parents('tr').find('.supplierType').html('单击选择').next().attr('id', '');
                $(that).parents('tr').find('.planType').removeData('item').html('单击选择');
                $(that).parents('tr').find('[name=bidTaxType]').prop('checked', false);

                delModal.$body.find('.span-btn-bc').click();
            })
        })
    })
    parents.find('.supplierType').click(function (e) {
        common.stopPropagation(e);
        parents.find('.model-add-supplier').remove();
        new addSupplier($(this), $(this).next('.supplierList')); // todo
        var offsetX = $(".Model")[0].offsetLeft;//获取鼠标X坐标
        var offsetY = $(".Model")[0].offsetTop;//获取鼠标Y坐标
        $(this).parent().find('.model-add-supplier').css({'left': e.pageX - offsetX, 'top': e.pageY - offsetY});//弹出框定位
    })
};

/**
 * 异常事件
 * @param parents
 */
exports.initExceptionEvent = function (parents, type) {
    parents.off('click');
    parents.on('click', function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var exceptionModal = Modal('异常列表', exceptionMemoModal());
        exceptionModal.show();
        exceptionModal.showClose();
        if (type === 'plan') {
            var _ids = [];
            _ids[0] = item.planQpyExcpId || item.checkQpyExcpId;
        } else {
            var prchQpyExcpId = item.prchQpyExcpId || item.bidPriceExcpId;
            var prchPriceExcpId = item.prchPriceExcpId || item.bidQpyExcpId;
            var _ids = [];
            if (prchPriceExcpId) {
                _ids.push(prchPriceExcpId);
            }
            if (prchQpyExcpId) {
                _ids.push(prchQpyExcpId);
            }
        }
        var confirm = exceptionModal.$body.find('.confirm');
        _ids = _ids.join(';');
        confirm.data('ids', _ids);
        initCostBudgetList.getExceptionIdListFunc({ids: _ids}, exceptionModal);
        confirm.click(function (e) {
            common.stopPropagation(e);
            exceptionModal.hide();
            $('.budget-menus .item.active').click();
        })
    });
};

/**
 * 材料合同类型
 * @param parents
 */
exports.initMaterialContractEvent = function (parents) {
    parents.find('.radio').click(function (e) {
        common.stopPropagation(e);
        parents.find('.radio').removeClass('active');
        $(this).addClass('active');
    })
};

exports.initAddTeamEvent = function (modal, parent) {
    modal.$body.find('input').change(function () {
        modal.$body.find('input').prop('checked', false);
        if ($(this).prop('checked') === false) {
            $(this).prop('checked', true);
        }
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var data;
        var flag = true;
        modal.$body.find('input').each(function () {
            if ($(this).prop('checked')) {
                data = $(this).parents('tr').data('data');
                flag = false;
                return false;
            }
        })
        if (flag) {
            return alert('请选择班组');
        }
        $(parent).data('data', data);
        $(parent).html(data.teamName);
        modal.$body.find('.span-btn-bc').click();
        $('.applyName').removeData('data').html('单击选择');
    });
}

exports.initAddWorkerEvent = function (modal, parent) {
    modal.$body.find('input').change(function () {
        modal.$body.find('input').prop('checked', false);
        if ($(this).prop('checked') === false) {
            $(this).prop('checked', true);
        }
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var data;
        var flag = true;
        modal.$body.find('input').each(function () {
            if ($(this).prop('checked')) {
                flag = false;
                data = $(this).parents('tr').data('data');
                return false;
            }
        })
        if (flag) {
            return alert('请选择人员');
        }
        $(parent).data('data', data);
        $(parent).html(data.workerName);
        modal.$body.find('.span-btn-bc').click();
    });
}

exports.initCreateOrderEvent = function (modal, id) {
    modal.$body.find('.chooseSup').click(function (e) {
        common.stopPropagation(e);
        new addSupplier($('.checkedSup'), $('body'), {});
        $('.model-add-supplier').css({'left': '30%', 'top': '20%', 'z-index': 10000});
    })
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        if (!modal.$body.find('.checkedSup').html()) {
            return alert('请选择供应商');
        }
        var data = {};
        data.entpId = modal.$body.find('.checkedSup').data('item').id;
        data.acctType = modal.$body.find('select').val();
        data.addMtrlOrderDetailList = [];
        data.mtrlPlanId = id;
        modal.$body.find('tbody tr').each(function () {
            var _data = {};
            console.log($(this).data('item'));
            _data.mtrlId = $(this).data('item').mtrlId;
            _data.mtrlPlanDetailId = $(this).data('item').id;
            _data.orderQpy = $(this).data('item').orderQpy;
            data.addMtrlOrderDetailList.push(_data);
        })
        costMaterialApi.postAddOrder(data).then(function (res) {
            if (res.code === 1) {
                modal.$body.find('.span-btn-bc').click();
            }
        })
    })
    modal.$body.find('input').change(function () {
        if ($(this).data('type') === 'count') {
            $(this).parents('tr').data('item').orderQpy = $(this).val();
        } else if ($(this).data('type') === 'remark') {
            $(this).parents('tr').data('item').remark = $(this).val();
        }
    })
}

exports.initOrderEvent = function (modal) {
    modal.$body.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        // console.log(item);
        if ($(this).data('type') === 'manage') {
            costMaterialApi.getOrderInfo(item.id).then(function(res){
                if(res.code === 1){
                    console.log(res);
                    var data = res.data || {};
                    if (item.orderStatus === 1) {//未报价
                        var _modal = waitingOrderModal();
                    } else if (item.orderStatus === 2) {//待审核
                        var _modal = checkingOrderModal();
                    } else if (item.orderStatus === 3) {//已审核
                        var _modal = checkedOrderModal();
                    } else if (item.orderStatus === 4) {//已拒绝
                        var _modal = rejectOrderModal();
                    }
                    var manageOrder = Modal('订单 : ' + item.orderNo, _modal);
                    manageOrder.show();
                    manageOrder.showClose();
                    renderCostMaterialTable.renderManageOrderTable(manageOrder, data, item.id);
                }
            })

        } else if ($(this).data('type') === 'del') {
            costMaterialApi.putOrderStatus(item.id, 5).then(function(res){
                if(res.code === 1){
                    $(this).parents('tr').nextAll('tr').find('td:first-child').each(function(){
                        $(this).html($(this).html()/1 - 1);
                    });
                    $(this).parents('tr').remove();
                }
            })
        }
    })
}

exports.initPutOrderEvent = function(modal, item){
    modal.$body.find('.confirm').click(function(e){
        common.stopPropagation(e);
        var data = {};
        data.entpId = item.entpId;
        data.acctType = modal.$body.find('select').val();
        data.addMtrlOrderDetailList = [];
        data.mtrlPlanId = item.mtrlPlanId;
        modal.$body.find('tbody tr').each(function () {
            var _data = {};
            _data.mtrlId = $(this).data('item').mtrlId;
            _data.mtrlPlanDetailId = $(this).data('item').mtrlPlanDetailId;
            _data.orderQpy = $(this).data('item').orderQpy;
            data.addMtrlOrderDetailList.push(_data);
        })
        costMaterialApi.putOrder(data, item.id).then(function (res) {
            if (res.code === 1) {
                modal.$body.find('.span-btn-bc').click();
            }
        })
    })
    modal.$body.find('input').change(function () {
        if ($(this).data('type') === 'count') {
            $(this).parents('tr').data('item').orderQpy = $(this).val();
        } else if ($(this).data('type') === 'remark') {
            $(this).parents('tr').data('item').remark = $(this).val();
        }
    })
}

exports.initCheckingOrderEvent = function(modal, data, id){
    modal.$body.find('#refresh').off('click');
    modal.$body.find('#refresh').on('click', function(){
        costMaterialApi.getOrderInfo(id).then(function(res){
            if(res.code === 1){
                var _data = res.data || {};
                renderCostMaterialTable.renderManageOrderTable(modal, _data, id);
            }
        })
    })
    modal.$body.find('a').off('click');
    modal.$body.find('a').on('click', function(){
        var item = $(this).parents('tr').data('item');
        var that = this;
        if($(this).data('type') === 'check'){

        } else if($(this).data('type') === 'reject'){
            costMaterialApi.putOrderDetail(id, item.id, 3).then(function(res){
                if(res.code === 1){
                    $(that).parents('td').html('已拒绝')
                }
            });
        } else if($(this).data('type') === 'deal'){
            costMaterialApi.putOrderDetail(id, item.id, 2).then(function(res){
                if(res.code === 1){
                    $(that).parents('td').html('已成交')
                }
            });
        }
    })
    modal.$body.find('.confirm').off('click');
    modal.$body.find('.confirm').on('click', function(){
        costMaterialApi.putOrderStatus(id, 3).then(function(res){
            if(res.code === 1){
                modal.$body.find('.span-btn-bc').click();
            }
        })
    })
}


