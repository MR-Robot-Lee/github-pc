var common = require('../../Common');
var contractManagerFunc = require('./contractManagerFunc');
var Model = require('../../../components/Model');
var addContractModal = require('./modal/addContractModal.ejs');
var checkContractDetailModal = require('./modal/checkContractDetailModal.ejs');
var addEmployee = require('../../../components/addEmployee');
var UploadAttach = require('../../../components/UploadAttach');
var checkMeasureModal = require('./modal/checkMeasureModal.ejs');
var addItem = require('./modal/addItem.ejs');
var enterpriseDataBase = require('../costBudgetManager/modal/enterpriseDataBase.ejs');
var initEventModal = require('../costBudgetManager/modal/initEventModal');
var renderContractTable = require('./renderContractTable');
var editContractContentModal = require('./modal/editContractContentModal.ejs');
var contractTotalPriceSum = require('./modal/contractTotalPriceSum.ejs');
var addExplainModal = require('./modal/addExplainModal.ejs');
var addBudgetModal = require('./modal/addBudgetModal.ejs');
var computeRoleModal = require('./modal/computeRoleModal.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var approvalProcess = require('../../../components/approvalProcess');
var materialCheckModel = require('../costBudgetManager/modal/materialCheckModel.ejs');
var contractTotalAccounting = require('./modal/contractTotalAccounting.ejs');
var selectMaterialModal = require('../materialManager/modal/selectMaterialModal.ejs');

var initMaterialManger = require('../materialManager/initMaterialManager');

var addAcountingExplain = require('./modal/addAccountingExplain.ejs');
var exceptionMemoModal = require('../costBudgetManager/modal/exceptionMemoModal.ejs');
var initCostBudgetList = require('../costBudgetManager/initCostBudgetList');
var addSupplier = require('../../../components/addSupplier');
var balanceModal = require('./modal/balanceModal.ejs');
var projectInitEvent = require('../initEvent');
var addMaterialModal = require('../costBudgetManager/modal/addMaterialModal.ejs');
var costBudgetManagerEventModal = require('../costBudgetManager/modal/initEventModal');
var chargeApi = require('../../Enterprise/chargeApi');
var enterpriseApi = require('../../Enterprise/enterpriseApi');


exports.initSumContractEvent = function (page) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var contractType = $('.contractType').val();
            var contractStatus = $('.contractStatus').val();
            var subProject = $('.subProject').val();
            var keyword = $('.keyword').val().trim();
            if (!contractType) {
                return alert('请选择合同类型');
            }
            if (!contractStatus) {
                return alert('请选择合同状态');
            }
            if (!subProject) {
                subProject = $('.subProject option:first').val();
            }
            var data = {
                subProjId: subProject,
                cntrType: contractType,
                cntrStatus: contractStatus
            };
            if (keyword) {
                data.keywords = keyword;
            }
            var searchType = 'search';
            contractManagerFunc.initContractSum(data, page, searchType);
        });
        /**
         * 添加合同
         */
        $('#addSettlementContract').click(function (e) {
            common.stopPropagation(e);
            var addModal = Model('添加结算合同', addContractModal());
            addModal.$body.find('.contractType').html('<option value="0">请选择合同分类</option><option value="3">分包合同</option>\n' +
                '                    <option value="4">劳务合同</option>\n' +
                '                    <option value="5">租赁合同</option>\n' +
                '                    <option value="7">加工运输合同</option>');
            addModal.show();
            addModal.showClose();
            addModal.$body.find('.confirm').data('id', '');
            initAddContractModalData(addModal, {}, 'update');
            initAddContractModalEvent(addModal);
        });
        $('#addPurchaseContract').click(function (e) {
            common.stopPropagation(e);
            var addModal = Model('添加采购合同', addContractModal());
            addModal.$body.find('.contractType').html('<option value="6">材料采购合同</option>').prop('disabled', true);
            addModal.$body.find('.contractType').next('#contractTypeCapion').html('提示：结算合同，费用支付须经结算方式');
            addModal.show();
            addModal.showClose();
            addModal.$body.find('.confirm').data('id', '');
            initAddContractModalData(addModal, {}, 'update');
            initAddContractModalEvent(addModal);
        })
        $('#noInfoAddSettlementContract').click(function (e) {
            common.stopPropagation(e);
            $('#addSettlementContract').trigger('click');
        })
        $('#noInfoAddPurchaseContract').click(function (e) {
            common.stopPropagation(e);

            $('#addPurchaseContract').trigger('click');
        })

    }
};

/**
 * 添加合同事件
 */
function initAddContractModalEvent(modal) {
    modal.$body.find('.contractType').on('change', function () {
        if ($(this).val() == 0) {
            $(this).next('#contractTypeCapion').html('');
        } else if ($(this).val() == 6) {
            $(this).next('#contractTypeCapion').html('提示：非结算合同，费用由采购入库产生');
        } else {
            $(this).next('#contractTypeCapion').html('提示：结算合同，费用支付须经结算方式');
        }
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data('id');
        var title = modal.$body.find('[name=title]').val();
        var user = modal.$body.find('.chargePersonal').data('user');
        var subProjId = modal.$body.find('.subProjectModal').val();
        var contractType = modal.$body.find('.contractType').val();
        var item = modal.$body.find('.supplierList').data('item');
        if (!title) {
            return alert('请输入合同名称');
        }
        if (!user) {
            return alert('请选择负责人');
        }
        if (!subProjId || subProjId === 'a') {
            return alert('请选择分部');
        }
        if (contractType == 0) {
            return alert('请选择合同分类');
        }
        if (!item) {
            return alert('请选择合同方');
        }
        if (id) {
            contractManagerFunc.initPutContract({
                id: id,
                subProjId: subProjId,
                cntrName: title,
                cntrChargeNo: user.userNo,
                entprId: item.id,
                cntrType: contractType
            }, modal);
        } else {
            contractManagerFunc.initPostContract({
                subProjId: subProjId,
                cntrName: title,
                cntrChargeNo: user.userNo,
                entprId: item.id,
                cntrType: contractType
            }, modal);
        }
    });
}

function initAddContractModalData(modal, item, type) {
    if (type === 'delete') {
        contractManagerFunc.initAddContractModalSubPro(modal);
    } else if (type === 'update') {
        contractManagerFunc.initAddContractModalSubPro(modal, function () {
            initUpdateContractModal(modal, item);
        });
    } else if (type === 'detail') {
        contractManagerFunc.initAddContractModalSubPro(modal, function () {
            initDetailContractModal(modal, item);
        });
    }
    modal.$body.find('.chargePersonal').click(function (e) {
        common.stopPropagation(e);
        var $user = $(this).data('user');
        var that = this;
        var employee = new addEmployee('添加款项负责人', function (data) {
            var user = data && data[0];
            $(that).data('user', user);
            $(that).text(user.userName);
            employee.hide();
        }, 'single');
        employee.getUserTreeList(function () {
            var list = [];
            if ($user) {
                list.push($user);
            }
            employee.renderSelectData(list);
        });
        employee.show();
    });
    modal.$body.find('.addContracter').click(function (e) {
        common.stopPropagation(e);
        new addSupplier($(this), $(this).next('.supplierList'));
        $('.model-add-supplier').css('top', '-265px');
    });
}


exports.initSupplierTypeModalEvent = function (parents, callback, modal) {
    parents.click(function (e) {
        common.stopPropagation(e);
    })
    parents.find('li').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        if (callback) {
            callback(item);
        }
        if (modal) {
            modal.$body.find('.addContracter').data('item', item);
            modal.$body.find('.addContracter').text(item.entpName);
            $(this).parents('.model-add-supplier').remove();
        }
    })
};

exports.initContractSumTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'update') {
            var addModal = Model('修改合同', addContractModal());
            addModal.show();
            addModal.showClose();
            initAddContractModalData(addModal, item, 'update');
            initAddContractModalEvent(addModal);
        } else if (type === 'delete') {
            contractManagerFunc.initDeleteContractById({id: item.id}, page);
        } else if (type === 'detail') {
            var addModal = Model('合同详情', addContractModal());
            var checkModal = Model('合同详情', checkContractDetailModal());
            checkModal.show();
            checkModal.showClose();
            initAddContractModalData(checkModal, item, 'detail');
            // initAddContractModalEvent(addModal);
        }
    });
    parents.find('tr').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        window.location.href = '/project/contract/detail/' + item.projId + "?subId=" + item.id + "&name=" + $('.project-menu-title span').text() + "&type=" + item.cntrType;
    });
};

function initUpdateContractModal(modal, item) {
    modal.$body.find('.confirm').data('id', item.id);
    modal.$body.find('[name=title]').val(item.cntrName);
    modal.$body.find('.chargePersonal').data('user', {userNo: item.cntrChargeNo, userName: item.cntrChargeName});
    modal.$body.find('.chargePersonal').text(item.cntrChargeName);
    modal.$body.find('.subProjectModal').val(item.subProjId);
    modal.$body.find('.contractType').val(item.cntrType);
    modal.$body.find('.addContracter').data('item', {id: item.entprId, entpName: item.cntrParty});
    modal.$body.find('.addContracter').text(item.cntrParty);
}

function initDetailContractModal(modal, item) {
    modal.$body.find('.confirm').data('id', item.id);
    modal.$body.find('[name=title]').html(item.cntrName);
    modal.$body.find('.chargePersonal').html(item.cntrChargeName);
    modal.$body.find('.subProjectModal').html(item.subProjName);
    var cntrName;
    if (item.cntrType === 3) {
        cntrName = '分包合同';
    } else if (item.cntrType === 4) {
        cntrName = '劳务合同';
    } else if (item.cntrType === 5) {
        cntrName = '租赁合同';
    } else if (item.cntrType === 6) {
        cntrName = '材料采购合同';
    } else if (item.cntrType === 7) {
        cntrName = '加工运输合同';
    }
    modal.$body.find('.contractType').html(cntrName);
    modal.$body.find('.addContracter').html(item.cntrParty);
}

/**
 * 初始化核算资源事件
 */
exports.initBillContractEvent = function (page) {
    var searchModal = $('.searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var billType = $('.billType').val();
            var subProject = $('.subProject').val();
            contractManagerFunc.initContractBill({subProjId: subProject, type: billType}, null, null, page);
        });
    }
};
/**
 * 初始化核算资源table 事件
 */
exports.initBillContractTableEvent = function () {
    var parents = $('#billContractTable');
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        var td = $(this).parents('td');
        if (type === 'quantity') {
            parents.find('.checkQuly').remove();
            initQuantity(td, item);
        } else {
            parents.find('.width-427').remove();
            var materialCheck = $(materialCheckModel());
            materialCheck.appendTo(td);
            initMaterialCheckModal(materialCheck);
            initMaterialCheckModalData(materialCheck, item);
        }
    })
};

function initMaterialCheckModal() {
    var modal = arguments[0];
    modal.click(function (e) {
        common.stopPropagation(e);
    })
    modal.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        $(this).parents('.width-427').remove();
    })
}

function initMaterialCheckModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    if (item.mtrlId) {
        initCostBudgetList.getMaterialFindSubItemListFunc({mtrlId: item.mtrlId}, modal);
    } else if (item.laborId) {
        initCostBudgetList.getLaborFindSubItemListFunc({laborId: item.laborId, subProjId: item.subProjId}, modal);
    } else if (item.measureId) {
        initCostBudgetList.getStepFindSubItemListFunc({measureId: item.measureId, subProjId: item.subProjId}, modal);
    } else if (item.subletId) {
        initCostBudgetList.getSubpackageSubItemListFunc({subletId: item.subletId, subProjId: item.subProjId}, modal);
    }
}

function initQuantity(parents, item) {
    var modal = $(checkMeasureModal());
    modal.click(function (e) {
        common.stopPropagation(e);
    })
    modal.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        $(this).parents('.checkQuly').remove();
    });
    modal.appendTo(parents);
    var type = '';
    if (item.laborId) {
        type = 3;
    } else if (item.measureId) {
        type = 4;
    } else if (item.subletId) {
        type = 5;
    }
    contractManagerFunc.getUsedListFunc({budWorkId: item.id, subProjId: item.subProjId, workType: type}, modal)
}

/**
 * 合同详情事件
 */
exports.initContractContentDetailEvent = function () {
    var contractFormulation = $('#contractFormulation');
    var compileCntrContent = $('#compileCntrContent');
    var checkTotalPrice = $('#checkTotalPrice');
    var item = contractFormulation.data('item');
    if (contractFormulation.length > 0 && !contractFormulation.data('flag')) {
        contractFormulation.data('flag', true);
        var that = this;
        /**
         * 修改合同跟核算
         */
        compileCntrContent.click(function (e) {
            common.stopPropagation(e);
            var obj = {};
            if($('[name=taxTypePage]').eq(0).prop('checked')){
                obj.taxType = 1;
            } else {
                obj.taxType = 2;
            }
            obj.enterpBase = {};
            obj.cntrPrice = $('[name=cntrPrice]').html()/1;
            if($('[name=settlementType]').html() == '固定总价'){
                obj.settlementType = 1;
            } else {
                obj.settlementType = 2;
            }
            obj.cntrStartTime =  $('[name=cntrStartTime]').html();
            obj.cntrEndTime = $('[name=cntrEndTime]').html();
            obj.cntrContent = $('[name=cntrContent]').html();
            obj.payTypeDesc = $('[name=payTypeDesc]').html();
            obj.ensurePer = $('[name=ensurePer]').html();
            obj.ensureMonth = $('[name=ensureMonth]').html();
            obj.otherDesc = $('[name=otherDesc]').html();
            obj.attaches = [];
            $('.contract-attach-list .attach-item').each(function(index, ele){
                obj.attaches.push($(ele).data('data'));
            })
            initEditContract(obj);
        });

        checkTotalPrice.click(function (e) {
            common.stopPropagation(e);
            if (parseInt(item.cntrType) === 6) {
                initMaterialContractModal(that);
            } else {
                initBalance(that);
            }
        })

        /**
         * 中止合同
         */
        $('#stopContract').click(function (e) {
            common.stopPropagation(e);
            var item = $('#contractFormulation').data('item');
            contractManagerFunc.initStopContract(item.id);
        });
        $('.submitApproval').click(function (e) {
            common.stopPropagation(e);
            var approval = new approvalProcess('合同审批流程', function () {
                var cntrId = $('#contractDetail').data('id');
                var item = approval.getSelectData();
                contractManagerFunc.postApprovalSubmitFunc({cntrId: cntrId, tmplId: item.id}, approval)
            });
            approval.getApprovalModal(1);
        });
    }
};

/**
 * 初始化编辑合同
 * @param item
 */
function initEditContract(item) {
    var editContract = Model('编辑合同内容', editContractContentModal());
    editContract.show();
    editContract.showClose();
    var attach = new UploadAttach($("#reportModal"));
    attach.reset();
    initEditContractEvent(editContract, attach);
    initEditContractModalDom(item, editContract, attach);
}

function initEditContractModalDom(item, modal, attach) {
    var cntrPrice = item.cntrPrice ? item.cntrPrice.toFixed(2) : 0
    modal.$body.find('[name=cntrPrice]').val(cntrPrice);
    modal.$body.find('[name=taxType][value=' + item.taxType + ']').prop('checked', true);
    modal.$body.find('[name=settlementType]').val(item.settlementType);
    modal.$body.find('[name=cntrStartTime]').val(item.cntrStartTime);
    modal.$body.find('[name=cntrEndTime]').val(item.cntrEndTime);
    modal.$body.find('[name=cntrContent]').val(item.cntrContent);
    modal.$body.find('[name=payTypeDesc]').val(item.payTypeDesc);
    modal.$body.find('[name=ensurePer]').val(item.ensurePer);
    modal.$body.find('[name=ensureMonth]').val(item.ensureMonth);
    modal.$body.find('[name=otherDesc]').val(item.otherDesc);
    var $attach = item.attaches || [];
    for (var i = 0, length = $attach.length; i < length; i++) {
        var $item = $attach[i];
        attach.TempAttach($item, 'appendAttach');
    }
    modal.$body.find('[name=cntrEndTime]').change();
}

function initEditContractEvent(modal, attach) {
    modal.$body.find('[name=cntrStartTime]').change(function (e) {
        common.stopPropagation(e);
        var start = $(this).val();
        var end = modal.$body.find('[name=cntrEndTime]').val();
        if (start.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
            && end.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) {
            end = moment(end).set('hour', 24).set('minute', 0).set('second', 0);
            start = moment(start).set('hour', 0).set('minute', 0).set('second', 0);
            var result = moment(end).diff(moment(start), 'days');
            if (result < 0) {
                modal.$body.find('.daysModal').val('');
                $(this).val('');
                return alert('开始时间必须大于结束时间');
            }
            modal.$body.find('.daysModal').val(result);
        }
    });
    modal.$body.find('[name=cntrEndTime]').change(function (e) {
        common.stopPropagation(e);
        var end = $(this).val();
        var start = modal.$body.find('[name=cntrStartTime]').val();
        if (start.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
            && end.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) {
            end = moment(end).set('hour', 24).set('minute', 0).set('second', 0);
            start = moment(start).set('hour', 0).set('minute', 0).set('second', 0);
            var result = moment(end).diff(moment(start), 'days');
            if (result < 0) {
                modal.$body.find('.daysModal').val('');
                $(this).val('');
                return alert('开始时间必须大于结束时间');
            }
            modal.$body.find('.daysModal').val(result);
        }
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var id = $('#contractDetail').data('id');
        var attaches = attach.getAttaches();
        var cntrPrice = modal.$body.find('[name=cntrPrice]').val();
        var taxType = modal.$body.find('[name=taxType]:checked').val();
        var settlementType = modal.$body.find('[name=settlementType]').val();
        var cntrStartTime = modal.$body.find('[name=cntrStartTime]').val();
        var cntrEndTime = modal.$body.find('[name=cntrEndTime]').val();
        var cntrContent = modal.$body.find('[name=cntrContent]').val();
        var payTypeDesc = modal.$body.find('[name=payTypeDesc]').val();
        var ensurePer = modal.$body.find('[name=ensurePer]').val();
        var ensureMonth = modal.$body.find('[name=ensureMonth]').val();
        var otherDesc = modal.$body.find('[name=otherDesc]').val();
        /*if (!cntrPrice) {
          return alert('请输入合同价款');
        }*/
        /*if (isNaN(cntrPrice)) {
          return alert('请输入有效的合同价款');
        }*/

        if (!taxType) {
            return alert('请选择是否含税');
        }
        if (!settlementType || settlementType === 'a') {
            return alert('请选择结算方式');
        }
        if (!cntrStartTime) {
            return alert('请输入结算方式开始时间')
        }
        if (!cntrEndTime) {
            return alert('请输入结算方式结束时间')
        }
        if (!modal.$body.find('.daysModal').val()) {
            return alert('开始时间必须大于结束时间');
        }
        if (!cntrContent) {
            return alert('请输入合同内容');
        }　　　//整数
        if (ensurePer && isNaN(ensurePer)) {
            return alert('请输入正确的质保金');
        }
        var r4 = /^[1-9]\d*|0$/;
        if (ensureMonth && !r4.test(ensureMonth)) {
            return alert('请输入正确的质保期');
        }
        if (!payTypeDesc) {
            return alert('请输入付款方式');
        }
        if (!otherDesc) {
            return alert('请输入其他条款');
        }
        contractManagerFunc.initPostContractDetailContent({
            attaches: attaches,
            cntrPrice: cntrPrice,
            taxType: taxType,
            settlementType: settlementType,
            cntrStartTime: cntrStartTime,
            cntrEndTime: cntrEndTime,
            cntrContent: cntrContent,
            payTypeDesc: payTypeDesc,
            ensurePer: ensurePer,
            ensureMonth: ensureMonth,
            otherDesc: otherDesc,
            status: 1,
            id: id
        }, modal)
    })
}

/**
 * 除材料合同之外的所有合同
 */
function initBalance(that) {
    var contractBalance = Model('合同总价核算', contractTotalPriceSum());
    contractBalance.show();
    contractBalance.showClose();
    initBalanceModalEvent(contractBalance, that);
    initBalanceModalData(contractBalance);
}

/**
 * 材料合同
 */
function initMaterialContractModal(that) {
    var contractMaterial = Model('合同总价核算', contractTotalAccounting());
    contractMaterial.showClose();
    contractMaterial.show();
    var cntrPrice = $('#budgetTotal').text();
    var budPrice = $('#costTotal').text();
    contractMaterial.$body.find('.cntrPrice').text(cntrPrice + '元');
    contractMaterial.$body.find('.budPrice').text(budPrice + '元');
    var total = 0;
    if (!isNaN(budPrice) && !isNaN(cntrPrice)) {
        total = cntrPrice - budPrice;
        total = parseInt(total*100)/100;
    }
    contractMaterial.$body.find('.windControl').text(total + '元');
    contractMaterial.$body.find('#addMaterial').click(function (e) {
        common.stopPropagation(e);
        if (contractMaterial.$body.find('tr.new').length > 0) {
            return alert('您有没有保存的数据请保存后在添加');
        }
        var selMaterialModal = Model('选择材料', selectMaterialModal());
        selMaterialModal.show();
        selMaterialModal.$header.hide();
        initSelectMaterialModalEvent(selMaterialModal, contractMaterial, that);
        initSelectMaterialModalData(selMaterialModal, contractMaterial);
        initInsideModalEvent(selMaterialModal);
    });
    /**
     * 提交材料合同数据
     */
    contractMaterial.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var trs = contractMaterial.$body.find('tbody tr');
        var error = false;
        var errMsg = '';
        var list = [];
        for (var i = 0, length = trs.length; i < length; i++) {
            var tr = $(trs[i]);
            var inputs = tr.find('input[type=text]');
            var data = {};
            /*if (!remark || !remark.trim()) {
              error = true;
              errMsg = '请添加说明';
              break;
            }*/
            data.remark = tr.data('item').remark;
            data.mtrlId = tr.data('item').mtrlId;
            data.resourceType = tr.data('item').resourceType;
            for (var j = 0, inputLength = inputs.length; j < inputLength; j++) {
                var input = $(inputs[j]);
                var value = input.val();
                var warn = input.data('warn');
                var name = input.attr('name');
                if (!value || !value.trim()) {
                    error = true;
                    errMsg = warn;
                    break;
                }
                data[name] = value;
            }
            list.push(data);
        }
        if (error) {
            return alert(errMsg);
        }
        contractManagerFunc.postContractMaterialFunc({list: list}, contractMaterial);
    });
    contractMaterial.$body.find('.quedin').click(function (e) {
        common.stopPropagation(e);
        getContractDetailPage(contractMaterial)
    });
    /**
     * 获取材料清单详情
     */
    contractManagerFunc.getContractMaterialListFunc(null, contractMaterial);
}

function initSelectMaterialModalData() {
    var modal = arguments[0];
    var parentModal = arguments[1];
    var item = $('#contractFormulation').data('item');
    contractManagerFunc.getSelectMaterialModalSubProject(modal, item.subProjId);
    var trsOld = parentModal.$body.find('tbody tr.old');
    var trsNew = parentModal.$body.find('tbody tr.new');
    var listOld = [];
    var listNew = [];
    for (var i = 0, length = trsOld.length; i < length; i++) {
        listOld.push($(trsOld[i]).data('item'));
    }
    for (var j = 0, $length = trsNew.length; j < $length; j++) {
        listNew.push($(trsNew[j]).data('item'));
    }
    modal.$body.find('.confirm').data('old', listOld);
    modal.$body.find('.confirm').data('new', listNew);
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
        $('<option value="a">请选择材料分类</option>').appendTo(parents);
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
        var allowance = modal.$body.find('.allowance').val();
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
        if (allowance && allowance !== 'a') {
            data.qpyType = allowance;
        }
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
        // var subProject = modal.$body.find('.subProject').val();
        var materialType1 = modal.$body.find('#enterprise .materialType1').val();
        var materialType2 = modal.$body.find('#enterprise .materialType2').val();
        var keyword = modal.$body.find('#enterprise .keyword').val();
        var data = {};
        /* if (!subProject || subProject === 'a') {
         return alert('请选择分部名称');
         }*/
        if (!materialType1 || materialType1 === 'a') {
            return alert('请选择材料一级分类');
        }
        if (!materialType2 || materialType2 === 'a') {
            return alert('请选择材料一级分类');
        }
        /*if (subProject && subProject !== 'a') {
         data.subProjId = subProject;
         }*/
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
    modal.$body.click(function (e) {
        common.stopPropagation(e);
        $('.material-manager-modal.enterprise-add').remove();
    })
    modal.$body.find('#newMaterial').click(function (e) {
        var that = this;
        common.stopPropagation(e);
        $('.material-manager-modal').remove();
        addMaterial = $(addMaterialModal());
        var categorySel = addMaterial.find('.category-sel');//类别选择框(一级)
        var categoryIpt = addMaterial.find('.category-ipt');//类别输入框(一级)
        var typeSel = addMaterial.find('.type-sel');//类型选择框(二级)
        var typeIpt = addMaterial.find('.type-ipt');//类型输入框(二级)

        /*添加一级下拉菜单*/
        $(this).next('.fr').find('.materialType1 option').each(function (index, ele) {
            if (index > 0) {
                var dom = $('<li>' + $(ele).html() + '</li>');
                dom.data('item', $(ele).val());
                dom.data('list', $(ele).data('item'));
                dom.appendTo(categorySel.find('ul'));
                /*初始化一级菜单中li的点击事件*/
                costBudgetManagerEventModal._typeListEvent('material', dom, addMaterial, 'Cntr');
            }
        })
        addMaterial.css({'left': '132px', 'top': '-30px'});
        addMaterial.appendTo($('.add-material-modal'));
        /*初始化菜单交互事件*/
        costBudgetManagerEventModal._materialShift(categorySel, categoryIpt, 'materialType');
        costBudgetManagerEventModal._materialShift(typeSel, typeIpt);

        addMaterial.click(function (e) {
            common.stopPropagation(e);
        })
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
                    addMaterial.remove();
                    $(that).parents('.model-inner').remove();
                    $('#addMaterial').click();
                    $('.enterprise').click();
                }
            })
        });
    })
}

/**
 * 初始化选择材料库的事件
 */
function initSelectMaterialModalEvent() {
    var modal = arguments[0];
    var parentModal = arguments[1];
    var that = arguments[2];
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
    /**
     * 把数据保存到父modal
     */
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
                item.resourceType = 1;
                list.push(item);
            }
        }
        var entList = modal.$body.find('#enterprise tbody tr');
        var entLists = [];
        for (var j = 0; j < entList.length; j++) {
            var _entList = $(entList[j]);
            if (_entList.find('[type=checkbox]').prop('checked')) {
                var $item = _entList.data('item');
                $item.mtrlId = $item.id;
                $item.budPrice = $item.avgPrice;
                $item.resourceType = 2;
                if (list.length === 0) {
                    entLists.push($item);
                }
                for (var l = 0, _length = list.length; l < _length; l++) {
                    if (list[l].mtrlId !== $item.id) {
                        entLists.push($item);
                    }
                }
            }
        }
        list = list.concat(entLists);
        var _parents = parentModal.$body.find('tbody');
        _parents.find('.new').remove();
        var oldList = _parents.find('tr').length;
        for (var k = 0; k < list.length; k++) {
            var _item = list[k];
            _item.count = k + 1 + oldList;
            _item.subProjId = subProjectId;
            _item.subProjName = subProjectName;
            renderContractTable.renderMaterialContractAccountintItem(_item, _parents, 'new');
        }
        that.initMaterialContractAccountingTableEvent(_parents.find('.new'));
        modal.hide();
    });
}

/**
 * 初始化 合同总价事件
 * @param modal
 * @param that this
 */
function initBalanceModalEvent(modal) {
    modal.$body.find('.addItem').click(function (e) {
        common.stopPropagation(e);
        var $addItem = Model('添加项', addItem());
        $addItem.show();
        $addItem.showClose();
        initAddItemModalEvent($addItem, modal);
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        getContractDetailPage(modal);
    });
}

function initBalanceModalData(modal) {
    var type = $('#contractDetail').data('type');
    if (type === 6) {
        contractManagerFunc.getContractMaterialListFunc(null, modal);
    } else {
        contractManagerFunc.initContractSubItem(null, modal);
    }
}

function getContractDetailPage(modal) {
    var type = $('#contractDetail').data('type');
    if (type === 6) {
        contractManagerFunc.getContractMaterialListFunc('page-detail', null);
    } else {
        contractManagerFunc.initContractSubItem(null, null, 'page-detail');
    }
    contractManagerFunc.initFindContractContentById(null);
    modal.hide();
}

/**
 * 添加项事件
 * @param modal
 * @param parentModal 合同总价核算的modal
 * @param item
 */
function initAddItemModalEvent(modal, parentModal, item) {
    modal.$body.find('#balanceContractModal').on('keyup', '[name=cntrQpy]', function (e) {//输入单位用量时的实时计算
        common.stopPropagation(e);
        var cntrQpy = $(this).val();
        var adjustPrice = $(this).parent().next().children('[name=adjustPrice]').val();
        var cntrMoney = isNaN(cntrQpy * adjustPrice) ? 0 : (cntrQpy * adjustPrice).toFixed(2)
        $(this).parent().next().next().children('[name=cntrMoney]').val(cntrMoney);
        calculateTotalPrice(modal);
    });
    modal.$body.find('#balanceContractModal').on('keyup', '[name=adjustPrice]', function (e) {//输入单位调整时的实时计算
        common.stopPropagation(e);
        var adjustPrice = $(this).val();
        var cntrQpy = $(this).parent().prev().children('[name=cntrQpy]').val();
        var cntrMoney = isNaN(cntrQpy * adjustPrice) ? 0 : (cntrQpy * adjustPrice).toFixed(2)
        $(this).parent().next().children('[name=cntrMoney]').val(cntrMoney);
        calculateTotalPrice(modal);
    });
    modal.$body.find('thead [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        var length = modal.$body.find('#balanceContractModal [type=checkbox]').length;
        if (length === 0) {
            $(this).prop('checked', false);
        }
        if ($(this).prop('checked')) {
            modal.$body.find('#balanceContractModal [type=checkbox]').prop('checked', true);
        } else {
            modal.$body.find('#balanceContractModal [type=checkbox]').prop('checked', false);
        }
    });
    /**
     * 预算添加
     */
    modal.$body.find('.addBudge').click(function (e) {
        common.stopPropagation(e);
        var addBudget = Model('预算添加', addBudgetModal()); // todo
        addBudget.show();
        addBudget.showClose();
        var contractDetail = $('#contractFormulation').data('item');
        addBudget.$body.find('.subProjName').text(contractDetail.subProjName);
        initBudgetModalEvent(addBudget, modal, contractDetail.subProjId);
    });
    /**
     * 企业库添加
     */
    modal.$body.find('.addEnterprise').click(function (e) {
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
                var preItem = $(preList[j]).data('item');
                preItem.cntrQpy = $(preList[j]).find('[name=cntrQpy]').val();
                preItem.adjustPrice = $(preList[j]).find('[name=adjustPrice]').val();
                oldList.push(preItem);
            }
            var newList = [];
            var newTrs = modal.$body.find('#balanceContractModal tr.new2');
            for (var k = 0; k < newTrs.length; k++) {
                var _preItem = $(newTrs[k]).data('item');
                _preItem.cntrQpy = $(newTrs[k]).find('[name=cntrQpy]').val();
                _preItem.adjustPrice = $(newTrs[k]).find('[name=adjustPrice]').val();
                _preItem.cntrMoney = $(newTrs[k]).find('[name=cntrMoney]').val();
                newList.push(_preItem);
            }
            var newList2 = [];
            var newTrs2 = parentModal.$body.find('#balanceContractModal tr.new1');
            for (var k2 = 0; k2 < newTrs2.length; k2++) {
                var _preItem2 = $(newTrs2[k2]).data('item');
                _preItem2.cntrQpy = $(newTrs2[k2]).find('[name=cntrQpy]').val();
                _preItem2.adjustPrice = $(newTrs2[k2]).find('[name=adjustPrice]').val();
                _preItem2.cntrMoney = $(newTrs2[k2]).find('[name=cntrMoney]').val();
                newList2.push(_preItem2);
            }

            _preList = ArrayCommon(newList2, _preList);
            newList = ArrayDeduplication(newList, _preList);
            var _list = ArrayDeduplicationOld(oldList, newList);
            var parents = modal.$body.find('#balanceContractModal');
            modal.$body.find('#balanceContractModal tr.new1').remove();
            modal.$body.find('#balanceContractModal tr.new2').remove();
            renderContractTable.renderAddItemTbodyModal(parents, _list, 'new1');
        });
        $('#materialEnterpriseModal').css({'pointer-events': 'none', 'color': '#999999'});
        $('#supplierEnterpriseModal').css({'pointer-events': 'none', 'color': '#999999'});
    });
    /**
     * 添加说明
     */
    modal.$body.find('.addDes').click(function (e) {
        common.stopPropagation(e);
        var desModal = Model('添加说明', addExplainModal());
        desModal.show();
        desModal.showClose();
        var that = this;
        var item = $(this).data('item') || {};
        desModal.$body.find('.rule').val(item.calcRule);
        desModal.$body.find('.workContent').val(item.remark);
        desModal.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var rule = desModal.$body.find('.rule').val();
            if (!rule) {
                return alert('请输入计算规则');
            }
            var workContent = desModal.$body.find('.workContent').val();
            if (!workContent) {
                return alert('请输入工作内容');
            }
            $(that).data('item', {calcRule: rule, remark: workContent});
            desModal.hide();
        });
    });
    /**
     * 删除
     */
    modal.$body.find('.delModal').click(function (e) {
        common.stopPropagation(e);
        var inputs = modal.$body.find('#balanceContractModal [type=checkbox]:checked');
        if (inputs.length === 0) {
            return alert('请选择要删除的列表')
        }
        var del = Model('提示', deleteModal());
        del.showClose();
        del.show();
        del.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var ids = [];
            for (var i = 0; i < inputs.length; i++) {
                var tr = $(inputs[i]).parents('tr');
                if (tr.hasClass('old')) {
                    ids.push(tr.data('item').id);
                } else {
                    tr.remove();
                }
            }
            if (ids.length > 0) {
                contractManagerFunc.delContractSubItemDetailFunc({
                    cntrId: item.cntrId,
                    cntrSubitemId: item.id,
                    ids: ids
                }, modal, del);
            } else {
                del.hide();
                modal.$body.find('thead [type=checkbox]').prop('checked', false);
            }
        })
    });
    /**
     * 提交数据
     */
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data('id');
        var des = modal.$body.find('.addDes').data('item');
        var inputs = $('#balanceContractModal').find('input[type=text]');
        var list = [];
        var error = false;
        var errMsg = '';
        var data = {};
        for (var i = 0, length = inputs.length; i < length; i++) {
            var input = $(inputs[i]);
            var value = input.val();
            var warn = input.data('warn');
            var name = input.attr('name');
            if (!value) {
                error = true;
                errMsg = warn;
                break;
            }
            data[name] = value;
            if ((i + 1) % 3 === 0) {
                var enterPriesItem = input.parents('tr').data('item');
                data.workType = enterPriesItem.workType;
                data.workId = enterPriesItem.workId;
                list.push(data);
                data = {};
            }
        }
        if (error) {
            return alert('请输入' + errMsg);
        }

        if (list === 0) {
            return alert('请添加工程用料');
        }
        if (!des) {
            return alert('请添加规则说明');
        }
        var _data = {
            list: list,
            cntrPrice: '',
            cntrQpy: '',
            unit: '',
            workContent: '',
            workName: ''
        };
        _data.calcRule = des.calcRule;
        _data.remark = des.remark;
        var updateError = false;
        var updateMsg = "";
        var updateInput = $('#updateAddItem').find('input[type=text]');
        for (var k = 0, _length = updateInput.length; k < _length; k++) {
            var int = $(updateInput[k]);
            var updateName = int.attr('name');
            var updateWarn = int.data('warn');
            var updateValue = int.val();
            _data[updateName] = updateValue;
            if (!updateValue && updateWarn) {
                updateError = true;
                updateMsg = updateWarn;
                break;
            }
        }
        if (updateError) {
            return alert("请输入" + updateMsg);
        }
        /*if (!modal.$body.find('[name=cntrPrice]').val()) {
          return alert('请点击单价计算')
        }*/
        if (id) {
            _data.id = id;
            contractManagerFunc.initPutContractSubItem(_data, modal, parentModal);
        } else {
            contractManagerFunc.initPostContractSubItem(_data, modal, parentModal);
        }
    });
}

// 实时计算
function calculateTotalPrice(modal) {//计算 综合单价
    var formula = 0;
    modal.$body.find('#balanceContractModal [name=cntrMoney]').each(function () {
        formula += this.value / 1;
    });
    formula = isNaN(formula) ? 0 : formula.toFixed(2)
    modal.$body.find('#updateAddItem [name=cntrPrice]').val(formula);
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

function ArrayCommon(oldList, newList) {
    oldList = oldList || [];
    newList = newList || [];
    for (var i = 0, length = oldList.length; i < length; i++) {
        var item = oldList[i];
        for (var j = 0; j < newList.length; j++) {
            var child = newList[j];
            if (item.workId === child.workId && item.workType === child.workType) {
                newList.splice(j, 1, item);
            }
        }
    }
    return oldList.concat(newList);
}

/**
 * 核算跟企业总数
 * @param oldList
 * @param newList
 * @returns {Array.<T>|string|Buffer}
 */
function ArrayDeduplication(oldList, newList) {
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
    return oldList.concat(newList);
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


/**
 * 初始化预算添加modal 事件
 */
function initBudgetModalEvent(modal, parentModal, subProjId) {
    modal.$body.find('.billType').change(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var oldList = [];
        var preList = parentModal.$body.find('#balanceContractModal tr.new2');
        for (var j = 0; j < preList.length; j++) {
            oldList.push($(preList[j]).data('item'))
        }
        contractManagerFunc.initContractBill({subProjId: subProjId, type: value}, modal, oldList);
    });
    modal.$body.find('.billType').change();
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var trs = modal.$body.find('tbody tr input[type=checkbox]:checked');
        var list = [];
        for (var i = 0, length = trs.length; i < length; i++) {
            var item = $(trs[i]).parents('tr').data('item');
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
        var oldList = [];
        var preList = parentModal.$body.find('#balanceContractModal tr.old');
        for (var j = 0; j < preList.length; j++) {
            var preItem = $(preList[j]).data('item');
            preItem.cntrQpy = $(preList[j]).find('[name=cntrQpy]').val();
            preItem.settlePrice = $(preList[j]).find('[name=settlePrice]').val();
            oldList.push(preItem);
        }
        var newList = [];
        var newTrs = parentModal.$body.find('#balanceContractModal tr.new1');
        for (var k = 0; k < newTrs.length; k++) {
            var _preItem = $(newTrs[k]).data('item');
            _preItem.cntrQpy = $(newTrs[k]).find('[name=cntrQpy]').val();
            _preItem.adjustPrice = $(newTrs[k]).find('[name=adjustPrice]').val();
            _preItem.cntrMoney = $(newTrs[k]).find('[name=cntrMoney]').val();
            newList.push(_preItem);
        }
        var newList2 = [];
        var newTrs2 = parentModal.$body.find('#balanceContractModal tr.new2');
        for (var k2 = 0; k2 < newTrs2.length; k2++) {
            var _preItem2 = $(newTrs2[k2]).data('item');
            _preItem2.cntrQpy = $(newTrs2[k2]).find('[name=cntrQpy]').val();
            _preItem2.adjustPrice = $(newTrs2[k2]).find('[name=adjustPrice]').val();
            _preItem2.cntrMoney = $(newTrs2[k2]).find('[name=cntrMoney]').val();
            newList2.push(_preItem2);
        }
        list = ArrayCommon(newList2, list);
        list = ArrayDeduplication(list, newList);
        var _list = ArrayDeduplicationOld(oldList, list);
        var $parents = parentModal.$body.find('#balanceContractModal');
        parentModal.$body.find('#balanceContractModal tr.new1').remove();
        parentModal.$body.find('#balanceContractModal tr.new2').remove();
        renderContractTable.renderAddItemTbodyModal($parents, _list, 'new2');
        modal.hide();
    })
}

/**
 * 初始化预算添加的方法
 * @param modal
 */
exports.initBudgetModalTbodyEvent = function (modal) {
    modal.$body.find('thead [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if ($(this).prop('checked')) {
            modal.$body.find('tbody [type=checkbox]').prop('checked', true);
        } else {
            modal.$body.find('tbody [type=checkbox]').prop('checked', false);
        }
    });
    modal.$body.find('tbody [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (modal.$body.find('tbody [type=checkbox]:checked').length === 0) {
            modal.$body.find('thead [type=checkbox]').prop('checked', false);
        } else {
            modal.$body.find('thead [type=checkbox]').prop('checked', true);
        }
    });
    if (modal.$body.find('tbody [type=checkbox]:checked').length > 0) {
        modal.$body.find('thead [type=checkbox]').prop('checked', true);
    } else {
        modal.$body.find('thead [type=checkbox]').prop('checked', false);
    }
};
/**
 * 绘制合同总价table 事件
 * @param parents
 * @param modal
 */
exports.initContractTotalSumTableModalEvent = function (parents, modal) {
    parents.find('.exceptionModal').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var exctIds;
        if (item.excpCount > 0 && item.excpIds) {
            exctIds = item.excpIds;
        } else {
            if (!item.excptPriceId) {
                exctIds = item.excptQpyId;
            } else if (!item.excptQpyId) {
                exctIds = item.excptPriceId;
            } else {
                exctIds = item.excptPriceId + ";" + item.excptQpyId;
            }
        }
        var exceptionModal = Model('异常备忘', exceptionMemoModal());
        exceptionModal.showClose();
        exceptionModal.show();
        var confirm = exceptionModal.$body.find('.confirm');
        confirm.data('ids', exctIds);
        var projId = $('#projectSchedule').data('id');
        initCostBudgetList.getExceptionIdListFunc({projId: projId, ids: exctIds}, exceptionModal);
        confirm.click(function (e) {
            common.stopPropagation(e);
            if (item.excpCount > 0 && item.excpIds) {
                contractManagerFunc.initContractSubItem(null, null, 'page-detail');
            } else {
                contractManagerFunc.getContractMaterialListFunc('page-detail', null);
            }
            exceptionModal.hide();
        })
    });
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'delete') {
            var delModal = Model('提示', deleteModal());
            delModal.show();
            delModal.showClose();
            initContractTotalModalEvent(delModal, item, $(this).parents('tr'), modal);
        } else if (type === 'rule') {
            parents.find('.modal-arrow-left').remove();
            var td = $(this).parents('td');
            var dom = $(computeRoleModal());
            dom.appendTo(td);
            dom.find('textarea').val(item.calcRule);
        } else if (type === 'edit') {
            var $addItem = Model('添加项', addItem());
            $addItem.show();
            $addItem.showClose();
            contractManagerFunc.getContractSubItemDetailListFuncData({
                cntrId: item.cntrId,
                cntrSubitemId: item.id
            }, $addItem);
            initAddItemModalEvent($addItem, modal, item);
        }
    });
    var cntrPrice = $('#budgetTotal').text();
    var budPrice = $('#costTotal').text();
    modal.$body.find('.cntrPrice').text(cntrPrice + '元');
    modal.$body.find('.budPrice').text(budPrice + '元');
    var total = 0;
    if (!isNaN(budPrice) && !isNaN(cntrPrice)) {
        total = cntrPrice - budPrice;
        total = parseInt(total*100)/100;
    }
    modal.$body.find('.windControl').text(total + '元');
};

function initContractTotalModalEvent(modal, item, parents, parentModal) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        contractManagerFunc.initDelContractSubItem({id: item.id}, parents, modal, parentModal);
    })
}

/**
 * 初始化
 * @param parents
 */
exports.initMaterialContractAccountingTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var tr = $(this).parents('tr');
        var item = tr.data('item');
        if (type === 'add') {
            var addDec = Model('添加说明', addAcountingExplain());
            addDec.showClose();
            addDec.show();
            initAddDesEventModal(addDec, item);
        } else if (type === 'delete') {
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDeleteEventModal(delModal, tr);
        }
    })
};

/**
 * 添加说明
 */
function initAddDesEventModal() {
    var modal = arguments[0];
    var item = arguments[1];
    if (item.remark) {
        modal.$body.find('.rule').val(item.remark);
    }
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var remark = modal.$body.find('.rule').val();
        if (!remark || !remark.trim()) {
            return alert('请输入操作说明');
        }
        item.remark = remark;
        modal.hide();
    });
}

/**
 * 删除事件
 */
function initDeleteEventModal() {
    var modal = arguments[0];
    var tr = arguments[1];
    var item = tr.data('item');
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        if (item.cntrId) {
            contractManagerFunc.initDelContractCntrMtrl(modal, {id: item.id, cntrId: item.cntrId}, tr);
        } else {
            tr.remove();
        }
    })
}

/**
 * 合同详情 异常处理
 * @param parents
 */
exports.initContractDetailTableEvent = function (parents) {
    parents.find('.exceptionModal').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var exctIds;
        if (item.excpCount > 0 && item.excpIds) {
            exctIds = item.excpIds;
        } else {
            if (!item.excptPriceId) {
                exctIds = item.excptQpyId;
            } else if (!item.excptQpyId) {
                exctIds = item.excptPriceId;
            } else {
                exctIds = item.excptPriceId + ";" + item.excptQpyId;
            }
        }
        var exceptionModal = Model('异常备忘', exceptionMemoModal());
        exceptionModal.showClose();
        exceptionModal.show();
        var confirm = exceptionModal.$body.find('.confirm');
        confirm.data('ids', exctIds);
        var projId = $('#projectSchedule').data('id');
        initCostBudgetList.getExceptionIdListFunc({projId: projId, ids: exctIds}, exceptionModal);
        confirm.click(function (e) {
            common.stopPropagation(e);
            if (item.excpCount > 0 && item.excpIds) {
                contractManagerFunc.initContractSubItem(null, null, 'page-detail');
            } else {
                contractManagerFunc.getContractMaterialListFunc('page-detail', null);
            }
            exceptionModal.hide();
        })
    });
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var balance = Model('合同项', balanceModal());
        balance.showClose();
        balance.show();
        initBalanceCheckModalData(balance, item)
    });
};

function initBalanceCheckModalData(modal, item) {
    contractManagerFunc.getContractSubItemDetailListFunc({cntrId: item.cntrId, cntrSubitemId: item.id}, modal);
}

exports.initCheckboxEvent = function (parents) {
    parents.find('[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (parents.find('[type=checkbox]:checked').length > 0) {
            parents.parents('table').find('thead [type=checkbox]').prop('checked', true);
        } else {
            parents.parents('table').find('thead [type=checkbox]').prop('checked', false);
        }
    })
};