var contractApi = require('./contractApi');
var renderContractTable = require('./renderContractTable');
var initEvent = require('./initEvent');
var balanceRender = require('../balanceManager/renderBalanceTable');
var onScrollDom = require('../../Common/onScrollDom')
/**
 * 获取分部列表
 * @param data
 * @param page
 */
exports.initContractSum = function (data, page) {
    var that = this;
    contractApi.getSumContract(data).then(function (res) {
        var $data = res.data ? res.data : '';
        var list = $data ? $data.data : [];
        var pageSize = $data ? $data.pageSize : 10;
        var pageNo = $data ? $data.pageNo : 1;
        var total = $data ? $data.total : 0;
        page.update({pageNo: pageNo, pageSize: pageSize, total: total});
        //绑定分页修改事件
        page.change(function (_data) {
            var contractType = $('.contractType').val();
            var contractStatus = $('.contractStatus').val();
            var subProject = $('.subProject').val();
            var keyword = $('.keyword').val().trim();
            _data.subProjId = subProject;
            _data.cntrType = contractType;
            _data.cntrStatus = contractStatus;
            if (keyword) {
                _data.keywords = keyword;
            }
            that.initContractSum(_data, page);
        });
        renderContractTable.renderShowSumContractData($data);
        renderContractTable.renderSumContractTable(list, page);
    })
};
/**
 * 绘制搜索分部select
 * @param callback
 */
exports.initContractSearchSubPro = function (callback) {
    contractApi.getSubProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = $('.subProject').html('');
        renderContractTable.renderSumContractSearchSelect(parents, list, 'all');
        if (callback) {
            return callback();
        }
    })
};
/**
 * 绘制添加合同的所属分部
 * @param modal
 */
exports.initAddContractModalSubPro = function (modal, callback) {
    contractApi.getSubProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = modal.$body.find('.subProjectModal').html('');
        renderContractTable.renderSumContractSearchSelect(parents, list, 'first');
        if (callback) {
            callback();
        }
    })
};

exports.initGetSupplierTypeList = function (modal, parentModal) {
    contractApi.getSupplierTypeList().then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = modal.find('.supplierType').html('');
        renderContractTable.renderSupplierTypeModal(parents, list);
        initEvent.initSupplierTypeModalEvent(parents, function (item) {
            contractApi.getSupplierList({entpType: item.id}).then(function (res) {
                var $parents = modal.find('.supplier-detail').html('');
                var $list = res.data ? res.data.data : [];
                renderContractTable.renderSupplierListModal($parents, $list);
                initEvent.initSupplierTypeModalEvent($parents, null, parentModal);
            })
        });
    })
};

exports.initGetSupplierList = function (data, modal) {
    contractApi.getSupplierList(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = modal.find('.supplier-detail').html('');
        renderContractTable.renderSupplierListModal(parents, list);
    })
};
/**
 * 添加合同
 * @param data
 * @param $modal
 */
exports.initPostContract = function (data, $modal) {
    contractApi.postResourceContract(data).then(function (res) {
        if (res.code === 1) {
            $modal.hide();
            $('#searchModal').click();
        }
    });
};
/**
 * 更新合同
 * @param data
 * @param $modal
 */
exports.initPutContract = function (data, $modal) {
    contractApi.putResourceContract(data).then(function (res) {
        if (res.code === 1) {
            $modal.hide();
            $('#searchModal').click();
        }
    })
};
/**
 * 通过合同id获取合同内容
 * @param data
 * @param modal
 */
exports.initFindContractContentById = function (data, modal) {
    contractApi.getContractDetailContent(data).then(function (res) {
        if (modal) {
            renderContractTable.renderContractModalDetail(res.data || {}, modal);
        } else {
            renderContractTable.renderContractDetail(res.data || {});
        }
    });
};

/**
 * 通过id删除合同内容
 * @param data
 */
exports.initDeleteContractById = function (data) {
    contractApi.FindStatusResourceContract(data).then(function (res) {
        if (res.code === 1) {
            $('#searchModal').click();
        }
    })
};
/**
 * 核算
 * @param data
 * @param modal
 * @param page
 * @param $list 已存在的集合
 */
exports.initContractBill = function (data, modal, $list, page) {
    var that = this;
    contractApi.getResourceContract(data).then(function (res) {
        if (modal) {
            var list = res.data ? res.data.data : [];
            var _pageSize = res.data ? res.data.pageSize : 10;
            var _total = res.data ? res.data.total : 0;
            renderContractTable.renderContractBudgetModal(list, modal, $list);
            var moreData = modal.$body.find('#costBudget .enterprise-more-data');
            var tableContent = modal.$body.find('#costBudget .table-content');
            onScrollDom.moreData(_pageSize, _total, moreData, tableContent, function (_data) {
                data.pageSize = _data.pageSize;
                that.initContractBill(data, modal, $list);
            });
        } else {
            var $data = res.data ? res.data : '';
            var _list = $data ? $data.data || $data : [];
            var pageSize = $data ? $data.pageSize : 10;
            var pageNo = $data ? $data.pageNo : 1;
            var total = $data ? $data.total : 0;
            page.update({pageNo: pageNo, pageSize: pageSize, total: total});
            //绑定分页修改事件
            page.change(function (_data) {
                var billType = $('.billType').val();
                var subProject = $('.subProject').val();
                _data.type = billType;
                _data.subProjId = subProject;
                that.initContractBill(_data, null, null, page);
            });
            renderContractTable.renderContractBillTable(_list);
            renderContractTable.renderContractBillTableData($data);
            initEvent.initBillContractTableEvent();
        }
    })
};
/**
 * 合同子目获取
 * @param data
 * @param modal
 */
exports.getUsedListFunc = function (data, modal) {
    contractApi.getUsedList(data).then(function (res) {
        var list = res.data ? res.data : [];
        renderContractTable.renderContractChildTable(list, modal);
    })
};
/**
 * 绘制合同总价核算列表
 * @param data
 * @param modal
 * @param type page-detail 是主页 table绘制
 */
exports.initContractSubItem = function (data, modal, type) {
    contractApi.getContractSubItem(data).then(function (res) {
        var list = res.data ? res.data.data : [];
        if (type === 'page-detail') {
            renderContractTable.renderContractDetailTableBlance(list);
            if (list.length > 0) {
                $('#contractTable').show();
            } else {
                $('#contractTable').hide();
            }
        } else {
            renderContractTable.renderContractSubItemModal(modal, list);
        }
    })
};
/**
 * 添加合同详情
 * @param data
 * @param modal
 */
exports.initPostContractDetailContent = function (data, modal) {
    var that = this;
    contractApi.postContractDetailContent(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.initFindContractContentById();
        }
    })
};
/**
 * 中止合同
 * @param id
 */
exports.initStopContract = function (id) {
    contractApi.FindStatusResourceContract({id: id, status: 7}).then(function (res) {
        if (res.code === 1) {
            var id = $('#projectSchedule').data('id');
            var projectName = $('.project-menu-title span').text();
            window.location.href = '/project/contract/sum/' + id + '?name=' + projectName;
        }
    })
};
/**
 * 添加子目
 * @param data
 * @param modal
 * @param parentModal
 */
exports.initPostContractSubItem = function (data, modal, parentModal) {
    var that = this;
    contractApi.postContractSubItem(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.initContractSubItem(null, parentModal);
            that.initFindContractContentById(null, parentModal);
        }
    });
};
/**
 * 修改子目
 * @param data
 * @param modal
 * @param parentModal
 */
exports.initPutContractSubItem = function (data, modal, parentModal) {
    var that = this;
    contractApi.putContractSubItem(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            that.initContractSubItem(null, parentModal);
            that.initFindContractContentById(null, parentModal);
        }
    })
};
/**
 * 删除子目
 * @param data
 * @param parents
 * @param modal 删除modal
 * @param parentModal 父类modal
 */
exports.initDelContractSubItem = function (data, parents, modal, parentModal) {
    var that = this;
    contractApi.delContractSubItem(data).then(function (res) {
        if (res.code === 1) {
            parents.remove();
            that.initContractSubItem(null, null, "page-detail");
            that.initFindContractContentById(null, parentModal);
            modal.hide();
        }
    })
};
/**
 * 删除子目中的单个元素
 * @param data
 * @param parents
 * @param modal
 */
exports.delContractSubItemDetailFunc = function (data, parents, modal) {
    contractApi.delContractSubItemDetail(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            var ids = data.ids;
            for (var i = 0; i < ids.length; i++) {
                $('#v_' + ids[i]).remove();
            }
            parents.find('thead [type=checkbox]').prop('checked', false);
        }
    })
}
/**
 * 提交审批
 * @param data
 * @param modal
 */
exports.postApprovalSubmitFunc = function (data, modal) {
    contractApi.postApprovalSubmit(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
        }
    });
};
/**
 * 获取合同的材料详情
 * @param modal
 * @param type page-detail主页的详情
 */
exports.getContractMaterialListFunc = function (type, modal) {
    contractApi.getContractMaterialList().then(function (res) {
        var list = res.data ? res.data : [];
        if (type === 'page-detail') {
            renderContractTable.renderMaterialDetailContractAccounting(list);
            if (list.length > 0) {
                $('#contractTable').show();
            } else {
                $('#contractTable').hide();
            }
        } else {
            var parents = modal.$body.find('tbody').html('');
            renderContractTable.renderMaterialContractAccounting(list, parents, 'old');
        }
    })
};
/**
 * 添加合同材料
 * @param data
 * @param modal
 */
exports.postContractMaterialFunc = function (data, modal) {
    var that = this;
    contractApi.postContractMaterial(data).then(function (res) {
        if (res.code === 1) {
            that.getContractMaterialListFunc(null, modal);
            var successRemind = $('<div class="success-remind clearfix">' +
                '<div class="remind-logo"></div>' +
                '<div class="remind-words">保存成功</div>' +
                '</div>');
            successRemind.appendTo(modal.$body);
        }
    })
};
/**
 * 绘制select 分部dom
 * @param modal
 * @param subProjId 分部id
 */
exports.getSelectMaterialModalSubProject = function (modal, subProjId) {
    contractApi.getSubProjectList().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderContractTable.renderSelectMaterialModal(list, modal, subProjId);
    });
    contractApi.getMaterialTree().then(function (res) {
        var list = res.data ? res.data.data : [];
        renderContractTable.renderContractSelectMaterialModalSelectType(modal, list)
    });
};
/**
 * 删除材料清单
 * @param modal
 * @param data
 * @param tr
 */
exports.initDelContractCntrMtrl = function (modal, data, tr) {
    contractApi.delContractCntrMtrl(data).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            tr.remove();
        }
    })
};
/**
 * 获取合同子目
 * @param data
 * @param modal
 */
exports.getContractSubItemDetailListFunc = function (data, modal) {
    contractApi.getContractSubItemDetailList(data).then(function (res) {
        var list = res.data ? res.data.list : [];
        var obj = res.data ? res.data.cntrSubitem : {};
        balanceRender.renderContractItem(list, modal);
        renderContractTable.renderContractItemData(obj, modal)
    })
};
/**
 * 除材料以外的合同总价计算
 * @param data
 * @param modal
 */
exports.getContractSubItemDetailListFuncData = function (data, modal) {
    contractApi.getContractSubItemDetailList(data).then(function (res) {
        var list = res.data ? res.data.list : [];
        var obj = res.data ? res.data.cntrSubitem : {};
        var parents = modal.$body.find('#balanceContractModal').html('');
        renderContractTable.renderAddItemTbodyModal(parents, list, 'old');
        renderContractTable.renderContractTotalPriceData(obj, modal)
    });
};