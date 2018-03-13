var common = require('../../Common');
var Modal = require('../../../components/Model');
var expectedBillMoneyModal = require('./modal/expectedBillMoneyModal.ejs');
var addChildCatalog = require('./modal/addChildCatalog.ejs');
var costBudgetManagerApi = require('./costBudgetManagerApi');
var initCostBudgetList = require('./initCostBudgetList');
var basicCostAnalysis = require('./modal/basicCostAnalysis.ejs');
var enterpriseDataBase = require('./modal/enterpriseDataBase.ejs');
var accountingQuantityModal = require('./modal/accountingQuantityModal.ejs');
var initEventModal = require('./modal/initEventModal');
var exceptionMemoModal = require('./modal/exceptionMemoModal.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var materialCheckModel = require('./modal/materialCheckModel.ejs');
var quantityCheckModal = require('./modal/quantityCheckModal.ejs');
var EvaluationReportModal = require('./modal/EvaluationReportModal.ejs');
var exceptionRemarkModal = require('./modal/exceptionRemarkModal.ejs');
var adjustPriceModal = require('./modal/adjustPriceModal.ejs');
var projectInitEvent = require('../initEvent');
var copyChildModal = require('./modal/copyChildModal.ejs');
var Page = require('../../../components/Page');


exports.initMainViewClick = function initMainViewClick() {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    var economyTarget = $("#economyTarget");
    if (economyTarget.length > 0 && !economyTarget.data('flag')) {
        economyTarget.data('flag', true);
        economyTarget.click(function (e) {
            common.stopPropagation(e);
            var EvaluationReport = Modal('评估意见', EvaluationReportModal());
            EvaluationReport.show();
            EvaluationReport.showClose();
            initCostBudgetList.getCostEvaluateFuncModal(EvaluationReport);
            var user = window.localStorage.getItem('user');
            user = user ? JSON.parse(user) : {permission: {}};
            var projectData = user.permission['projBudget:*'];
            if (projectData) {
                EvaluationReport.$body.find('.confirm').show();
            } else {
                EvaluationReport.$body.find('.confirm').hide();
            }
            EvaluationReport.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var status = $(this).data('type');
                var remark1 = $('[name=remark1]').val();
                var remark2 = $('[name=remark2]').val();
                var remark3 = $('[name=remark3]').val();
                var remark4 = $('[name=remark4]').val();
                if (!remark1) {
                    return alert('请输入经济指标综合');
                }
                if (!remark2) {
                    return alert('请输入决策参考综述');
                }
                if (!remark3) {
                    return alert('请输入风险评估');
                }
                if (!remark4) {
                    return alert('请输入重点监测');
                }
                costBudgetManagerApi.postCostEvaluate({
                    remark1: remark1,
                    remark2: remark2,
                    remark3: remark3,
                    remark4: remark4,
                    status: status
                }).then(function (res) {
                    if (res.code === 1) {
                        EvaluationReport.hide();
                        $('[name=economyTarget]').val(remark1);
                        $('[name=decisionSummary]').val(remark2);
                        $('[name=riskEstimate]').val(remark3);
                        $('[name=importanceMonitor]').val(remark4);
                    }
                })
            })
        });
        /**
         * 编辑价格
         */
        $("#editPrice").click(function (e) {
            common.stopPropagation(e);
            var expctMoneys = $('.expctMoneys').val();
            var modal = Modal('预期结算金额', expectedBillMoneyModal());
            modal.showClose();
            modal.show();
            $("#modalCntrMoney").text(expctMoneys + '元');
            var list = $('#openSubProject').data('list');
            var ids = renderTableList(list, modal);
            modal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                initEditPriceData(modal, ids);
            });
        });
        /**
         * 打开分部
         */
        $("#openSubProject").click(function (e) {
            common.stopPropagation(e);
            var list = $(this).data("list");
            if ($(this).has('div').length > 0) {
                $(this).find('.sub-project-list').remove();
                $(this).find('.arrow-menu').remove();
            } else {
                var listDom = renderSubProjectList(list);
                var dom = $('<span class="arrow-menu"></span>\
                     <div class="sub-project-list">\
                       <div class="sub-project-lists"></div>\
                     </div>');
                var parents = dom.find('.sub-project-lists').html('');
                parents.append(listDom);
                dom.appendTo($(this));
            }
        });
    }
};

/**
 * 绘制分部列表
 */
function renderSubProjectList(list) {
    list = list || [];
    var listDom = [];
    var id = $('#projectSchedule').data('id');
    var name = $('.project-menu-title span').text();
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        listDom.push($('<div class="sub-project-item" title="' + item.subProjName + '">\
              <i class="icon-circle"></i>\
              <a href="/project/cost/budget/' + id + '?subId=' + item.id + '&name=' + name + '">' + item.subProjName + '</a>\
            </div>'));
    }
    return listDom;
}


function renderTableList(list, modal) {
    list = list || [];
    var data = [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var cntrMoney = item.cntrMoney || '';
        var expctMoney = item.expctMoney || 0;
        var dom = $('<tr class="small">\
                  <td class="border">' + item.subProjName + '</td>\
                  <td class="border">\
                   <input type="text" placeholder="请填写合同金额" name="cntrMoney" data-warn="请填写合同金额" value=' + cntrMoney + '>\
                  </td>\
                  <td class="border">\
                   <input disabled type="text" placeholder="请填写预期金额" name="expctMoney" data-warn="请填写预期金额" value=' + expctMoney + '>\
                  </td>\
                 </tr>');
        data.push(item.id);
        dom.appendTo(parents);
    }
    return data;
}

function initEditPriceData(modal, ids) {
    var inputs = modal.$body.find('input');
    var error = false;
    var errMsg = '';
    var list = [];
    var item = {};
    for (var i = 0, length = inputs.length; i < length; i++) {
        var name = $(inputs[i]).attr('name');
        var value = $(inputs[i]).val();
        var warn = $(inputs[i]).data('warn');
        if (!value) {
            error = true;
            errMsg = warn;
            break;
        }
        item[name] = value;
        var index = (i + 1);
        if (index % 2 === 0) {
            var _index = index / 2 - 1;
            item.subProjId = ids[_index];
            list.push(item);
            item = {};
        }
    }
    if (error) {
        return alert(errMsg);
    }
    costBudgetManagerApi.putDivisionProjectPrice({lists: list}).then(function (res) {
        if (res.code === 1) {
            modal.hide();
            initCostBudgetList.getDivisionProjectFunc();
            initCostBudgetList.getCostEvaluateFunc();
        }
    })
}

/**
 * 创建子目的添加
 */
exports.costBudgetClick = function costBudgetClick($page) {
    var addChild = $('#addChild');
    if (addChild.length > 0 && !addChild.data('flag')) {
        this.costBudgetSubProjectClick();
        addChild.data('flag', true);
        addChild.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('添加子目', addChildCatalog());
            modal.show();
            modal.showClose();
            initChildSubmitData(modal, $page);
        });
        $('.project-list-wrap').click(function (e) {
            common.stopPropagation(e);
            $('#openSubProject').find('.arrow-menu').remove();
            $('#openSubProject').find('.sub-project-list').remove();
        });
        $('#budgetUpdate').click(function (e) {
            common.stopPropagation(e);
            var checkbox = $('#costBudgetTable').find('[type=checkbox]:checked');
            if (checkbox.length === 0) {
                return alert('请选择修改的子目列表');
            }
            if (checkbox.length > 1) {
                return alert('修改只能选择一个');
            }
            var modal = Modal('修改子目', addChildCatalog());
            modal.show();
            modal.showClose();
            initUpdateCatalogData(modal, checkbox);
            initChildSubmitData(modal, $page);
        });
        $('#budgetDel').click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('提示', deleteModal());
            var checkbox = $('#costBudgetTable').find('[type=checkbox]:checked');
            if (checkbox.length === 0) {
                return alert('请选择要删除的子目');
            }
            modal.showClose();
            modal.show();
            modal.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var list = [];
                for (var i = 0; i < checkbox.length; i++) {
                    var item = $(checkbox[i]).parents('tr').data('item');
                    list.push(item.id);
                }
                list = list.join(';')
                costBudgetManagerApi.delSubItem(list).then(function (res) {
                    if (res.code === 1) {
                        initCostBudgetList.getCostBudgetListFunc($page);
                        modal.hide();
                    }
                });
            })
        });
        $('thead [type=checkbox]').click(function (e) {
            common.stopPropagation(e);
            var check = $('#costBudgetTable').find('[type=checkbox]');
            if (check.length === 0) {
                $(this).prop('checked', false);
            }
            if ($(this).prop('checked')) {
                check.prop('checked', true);
            } else {
                check.prop('checked', false);
            }
        });
        $('#budgetImport').click(function (e) {
            common.stopPropagation(e);
            $(this).siblings('input').click();
        });
        $('[type=file]').change(function (e) {
            common.stopPropagation(e);
            var file = this.files[0];
            initCostBudgetList.uploadExcelFunc(file);
            this.value = '';
        });
        $('#copyChild').click(function (e) {
            common.stopPropagation(e);
            $('.copy-child-modal').remove();
            var checkbox = $('#costBudgetTable').find('[type=checkbox]:checked');
            if (checkbox.length === 0) {
                return alert('请选择需要复制的子目列表');
            }
            if (checkbox.length > 1) {
                return alert('只能选择一个复制子目列表');
            }
            var item = checkbox.parents('tr').data('item');
            var copyModal = $(copyChildModal());
            copyModal.appendTo($('body'));
            initCopyChildData(item);
            initCopyChildEvent(copyModal, item, $page);
        })
    }
};

function initCopyChildData(item) {
    $('.copy-item-num').html(item.subitemNo);
    $('.copy-item-sysno').html(item.sysNo);
}

function initCopyChildEvent(modal, item, $page) {
    /*modal拖拽*/
    function drag() {
        var obj = $('.copy-child-title');
        obj.bind('mousedown', start);

        function start(e) {
            var ol = obj.offset().left;
            var ot = obj.offset().top;
            deltaX = e.pageX - ol;
            deltaY = e.pageY - ot;
            $(document).bind({
                'mousemove': move,
                'mouseup': stop
            });
            return false;
        }

        function move(e) {
            modal.css({
                "left": (e.pageX - deltaX),
                "top": (e.pageY - deltaY)
            });
            return false;
        }

        function stop() {
            $(document).unbind({
                'mousemove': move,
                'mouseup': stop
            });
        }
    }

    drag();
    modal.find('.span-btn-bc').click(function (e) {
        modal.remove();
    });
    modal.find('.icon-close').click(function (e) {
        modal.remove();
    });

    modal.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var data = {};
        var copySubitemIds = [];
        modal.find('#pasteItemsList li').each(function (index, ele) {
            copySubitemIds.push($(ele).data('item').id);
        });
        data.copySubitemIds = copySubitemIds;
        data.projId = item.projId;
        data.subProjId = item.subProjId;
        data.subitemId = item.id;
        initCostBudgetList.postCopyChildFunc(data, modal, $page);
    });

}


/**
 * 打开分部
 */
exports.costBudgetSubProjectClick = function () {
    var openSubProject = $("#openSubProject");
    if (openSubProject.length > 0 && !openSubProject.data('flag')) {
        openSubProject.data('flag', true);
        openSubProject.click(function (e) {
            common.stopPropagation(e);
            var list = $(this).data("list");
            if ($(this).has('div').length > 0) {
                $(this).find('.arrow-menu').remove();
                $(this).find('.sub-project-list').remove();
            } else {
                var listDom = renderSubProjectList(list);
                var dom = $('<span class="arrow-menu"></span>\
                     <div class="sub-project-list">\
                       <div class="sub-project-lists"></div>\
                     </div>');
                var parents = dom.find('.sub-project-lists').html('');
                parents.append(listDom);
                dom.appendTo($(this))
            }
        });
    }
};

function initUpdateCatalogData() {
    var modal = arguments[0];
    var checkbox = arguments[1];
    var item = checkbox.parents('tr').data('item');
    var inputs = modal.$body.find('input');
    for (var i = 0, length = inputs.length; i < length; i++) {
        var input = $(inputs[i]);
        var name = input.attr('name');
        input.val(item[name]);
    }
    modal.$body.find('.confirm').data('id', item.id);
}

function initChildSubmitData(modal, $page) {
    modal.$body.find('[name=originQpy]').keyup(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var tr = $(this).parents('tr');
        if (isNaN(value)) {
            tr.find('[name=origTotalPrice]').val('');
            return $(this).val('')
        }
        var price = tr.find('[name=origPrice]').val();
        if (!isNaN(price)) {
            tr.find('[name=origTotalPrice]').val(Math.round(value * price * 100) / 100);
        }
    });
    modal.$body.find('[name=origPrice]').keyup(function (e) {
        common.stopPropagation(e);
        var value = $(this).val();
        var tr = $(this).parents('tr');
        if (isNaN(value)) {
            tr.find('[name=origTotalPrice]').val('');
            return $(this).val('')
        }
        var originQpy = tr.find('[name=originQpy]').val();
        if (!isNaN(originQpy)) {
            tr.find('[name=origTotalPrice]').val(Math.round(value * originQpy * 100) / 100);
        }
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var inputs = modal.$body.find('[type=text]');
        var id = $(this).data('id');
        var error = false;
        var errMsg = '';
        var item = {};
        for (var i = 0, length = inputs.length; i < length; i++) {
            var name = $(inputs[i]).attr('name');
            var warn = $(inputs[i]).data('warn');
            var value = $(inputs[i]).val();
            if (!value) {
                error = true;
                errMsg = warn;
                break;
            }
            item[name] = value;
        }
        if (error) {
            return ('请输入' + errMsg);
        }
        if (id) {
            item.id = id;
            costBudgetManagerApi.putSubItemList(item).then(function (res) {
                if (res.code === 1) {
                    modal.hide();
                    initCostBudgetList.getCostSubProjectFunc();
                    initCostBudgetList.getCostBudgetListFunc($page);
                }
            });
        } else {
            costBudgetManagerApi.postSubItemList(item).then(function (res) {
                if (res.code === 1) {
                    modal.hide();
                    initCostBudgetList.getCostSubProjectFunc();
                    initCostBudgetList.getCostBudgetListFunc($page);
                }
            })
        }
    })
}

/**
 * 初
 * @param parents
 * @param $page
 */
exports.initBudgetTable = function initBudgetTable(parents, $page) {
    parents.find('tr').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        var flag = true;
        $('#pasteItemsList li').each(function (index, ele) {
            if ($(ele).data('item').id == $(that).data('item').id) {
                flag = false;
                return false;
            }
        })
        if (flag) {
            var item = $(this).data('item');
            var dom = $('<li class="clearfix">' +
                '<div class="paste-item-num">' + item.subitemNo + '</div>' +
                '<div class="paste-item-sysno">' + item.sysNo + '</div>' +
                '<div class="paste-item-delete">删除</div>' +
                '</li>');
            dom.find('.paste-item-delete').click(function (e) {
                common.stopPropagation(e);
                $(this).parents('li').remove();
                var num = $('.copy-child-modal').find('#pasteItemsList li').length;
                $('.copy-child-modal').find('.paste-item-totle span').html(num);
            })
            dom.data('item', item);
            dom.appendTo($('.copy-child-modal').find('#pasteItemsList'));
            var _num = $('.copy-child-modal').find('#pasteItemsList li').length;
            $('.copy-child-modal').find('.paste-item-totle span').html(_num);
        }
    });

    parents.find('.budPriceClick').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var modal = Modal('单位成本分析', basicCostAnalysis());
        modal.show();
        var $container = modal.$container.find('.model-inner');
        $container[0].scrollTop = $container[0].scrollHeight - $container[0].clientHeight;
        var user = window.localStorage.getItem('user');
        user = user ? JSON.parse(user) : {permission: {}};
        var projectData = user.permission['projBudget:*'];
        if (projectData) {
            modal.$body.find('.add').show();
            modal.$body.find('.confirm').show();
        } else {
            modal.$body.find('.add').hide();
            modal.$body.find('.confirm').hide();
        }
        initAnalysisModal(modal, item, $page);
        initAnalysisDomData(item, modal);
        initAnalysisDomEvent(modal, $page);
    });
    parents.find('.checkQpyClick').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var accountingModal = Modal('核算量', accountingQuantityModal());
        accountingModal.showClose();
        accountingModal.show();
        var user = window.localStorage.getItem('user');
        user = user ? JSON.parse(user) : {permission: {}};
        var projectData = user.permission['projBudget:*'];
        if (projectData) {
            accountingModal.$body.find('.accountingCount').show();
            accountingModal.$body.find('.settleAccounts').show();
            accountingModal.$body.find('.liquidationQuantity').show();
        } else {
            accountingModal.$body.find('.accountingCount').hide();
            accountingModal.$body.find('.settleAccounts').hide();
            accountingModal.$body.find('.liquidationQuantity').hide();
        }
        initQpyDomData(item, accountingModal);
        initQpyEvent(item, accountingModal, $page);
    });
    parents.find('.exceptionModal').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        if (item.excpCount > 0 && item.excpIds) {
            var exceptionModal = Modal('异常备忘', exceptionMemoModal());
            exceptionModal.showClose();
            exceptionModal.show();
            var confirm = exceptionModal.$body.find('.confirm');
            confirm.data('ids', item.excpIds);
            initCostBudgetList.getExceptionIdListFunc({ids: item.excpIds}, exceptionModal);
            confirm.click(function (e) {
                common.stopPropagation(e);
                initCostBudgetList.getCostBudgetListFunc($page);
                exceptionModal.hide();
            })
        }
    });
    var checkbox = parents.find('[type=checkbox]');
    if (checkbox.length === 0 || checkbox.prop('checked').length === 0) {
        $('thead [type=checkbox]').prop('checked', false);
    }
    parents.find('[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        var checkbox = parents.find('[type=checkbox]:checked');
        if (checkbox.length === 0) {
            $('thead [type=checkbox]').prop('checked', false);
        } else {
            $('thead [type=checkbox]').prop('checked', true);
        }
    });
};

function initAnalysisDomEvent() {
    var modal = arguments[0];
    var $page = arguments[1];
    modal.$body.find('.submit').click(function (e) {
        common.stopPropagation(e);
        var newTrs = modal.$body.find('tr.new').length;
        if (newTrs > 0) {
            return alert('有未保存的项目,确认不需要请删除');
        }
        initCostBudgetList.getCostBudgetListFunc($page, null, modal);
        modal.hide();
    });
}

/**
 * 单击核算初始化modal dom data
 * @param item
 * @param modal
 */
function initQpyDomData(item, modal) {
    modal.$body.find('.descDetail').text(item.subitemDesc);
    modal.$body.find('[name=originQpy]').text(item.originQpy);
    modal.$body.find('[name=unit]').text(item.unit);
    modal.$body.find('[name=checkQpy]').text("0");
    modal.$body.find('.accountingFormula').text(item.checkQpyFormula || '');
}

/**
 * 核算初始化事件
 * @param item
 * @param accountingModal
 */
function initQpyEvent(item, accountingModal, $page) {
    accountingModal.$body.find('.budget-menus a').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('active')) {
            return
        }
        var selectMenus = accountingModal.$body.find('.budget-menus a.active');
        var formula = selectMenus.data('formula');
        if ($('.accountingFormula').val() && $('.accountingFormula').val() !== formula) {
            return alert('该公式还没有计算确定切换么?')
        }
        accountingModal.$body.find('.budget-menus a').removeClass('active');
        $(this).addClass('active');
        accountingModal.$body.find('[name=checkQpy]').text($(this).data('totalSum') || "");
        $('.accountingFormula').val($(this).data('formula'));
    });
    accountingModal.$body.find('.accountingCount').click(function (e) {
        common.stopPropagation(e);
        var value = $('.accountingFormula').val();
        if (!value) {
            return alert('请输入公式');
        }
        var totalSum = 0;
        try {
            totalSum = eval(value);
        } catch (e) {
            return alert('该公式不支持计算')
        }
        var selectMenus = accountingModal.$body.find('.budget-menus a.active');
        selectMenus.data('formula', value);
        selectMenus.data('totalSum', totalSum);
        accountingModal.$body.find('[name=checkQpy]').text(totalSum);
    });
    $('.settleAccounts').click(function (e) {
        common.stopPropagation(e);
        var checkQpy = accountingModal.$body.find('[name=checkQpy]').text();
        var checkQpyFormula = $('.accountingFormula').val();
        if (!checkQpyFormula) {
            return alert('请输入公式并计算');
        }
        if (!checkQpy) {
            return alert('请通过计算公式计算');
        }
        costBudgetManagerApi.postQpy({
            id: item.id,
            checkQpy: checkQpy,
            checkQpyFormula: checkQpyFormula
        }).then(function (res) {
            if (res.code === 1) {
                accountingModal.hide();
                initCostBudgetList.getCostBudgetListFunc($page);
            }
        });
    });
    $('.liquidationQuantity').click(function (e) {
        common.stopPropagation(e);
        var originQpy = accountingModal.$body.find('[name=originQpy]').text();
        if (!originQpy) {
            return alert('创建子目错误请重新创建子目信息');
        }
        costBudgetManagerApi.postQpy({
            id: item.id,
            checkQpy: originQpy,
            checkQpyFormula: originQpy
        }).then(function (res) {
            if (res.code === 1) {
                accountingModal.hide();
                initCostBudgetList.getCostBudgetListFunc($page);
            }
        });
    })
}


/**
 * 材料分析初始化dom
 * @param item
 * @param modal
 */
function initAnalysisDomData(item, modal) {
    modal.$body.find('.descDetail').text(item.subitemDesc);
    modal.$body.find('[name=origPrice]').val(item.origPrice);
    modal.$body.find('[name=budPrice]').val(item.budPrice);
    modal.$body.find('[name=budMtrlPrice]').val(item.budMtrlPrice);
    modal.$body.find('[name=budLaborPrice]').val(item.budLaborPrice);
    modal.$body.find('[name=budMeasurePrice]').val(item.budMeasurePrice);
    modal.$body.find('[name=budSubletPrice]').val(item.budSubletPrice);
    modal.$body.find('[name=budSecMtrlPrice]').val(item.budSecMtrlPrice);
    modal.$body.find('#costAnalysisUnit').next().html(item.unit);
}

/**
 * 获取材料添加的子目
 * @param analysisModal
 * @param item
 */
function initAnalysisModalMaterialSubItemData(analysisModal, item) {
    costBudgetManagerApi.getMaterialSubItemList({subitemId: item.id}).then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = analysisModal.$body.find('tbody').html('');
        initAnalysisMaterialModalTable(parents, list, 'old', analysisModal);
    });
}

function initAnalysisModalLaborSubItemData(analysisModal, item) {
    costBudgetManagerApi.getBudgetLaborSubItem({subitemId: item.id}).then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = analysisModal.$body.find('tbody').html('');
        initAnalysisOthenModalTable(parents, list, 'labor', 'old', analysisModal);
    })
}

function initAnalysisModalStepSubItemData(analysisModal, item) {
    costBudgetManagerApi.getBudgetMeasureItem({subitemId: item.id}).then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = analysisModal.$body.find('tbody').html('');
        initAnalysisOthenModalTable(parents, list, 'step', 'old', analysisModal);
    })
}

function initAnalysisModalSubpackageSubItemData(analysisModal, item) {
    costBudgetManagerApi.getBudgetSubletItem({subitemId: item.id}).then(function (res) {
        var list = res.data ? res.data.data : [];
        var parents = analysisModal.$body.find('tbody').html('');
        initAnalysisOthenModalTable(parents, list, 'subpackage', 'old', analysisModal);
    })
}

/**
 * 材料分析modal 事件处理
 * @param analysisModal
 * @param item
 */
function initAnalysisModal(analysisModal, item) {

    var add = analysisModal.$body.find('.add');
    var confirm = analysisModal.$body.find('.confirm');
    /**
     * 单位成本分析菜单切换
     */
    analysisModal.$body.find('.budget-menus a').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('active')) {
            return
        }
        analysisModal.$body.find('.budget-menus a').removeClass('active');
        $(this).addClass('active');
        var analysisType = $(this).data('type');
        var analysisList = $(this).data('list') || [];
        var tbody = analysisModal.$body.find('tbody').html('');
        if (analysisType === 'material') {
            initAnalysisModalMaterialSubItemData(analysisModal, item);
        } else if (analysisType === 'labor') {
            initAnalysisModalLaborSubItemData(analysisModal, item);
        } else if (analysisType === 'step') {
            initAnalysisModalStepSubItemData(analysisModal, item);
        } else if (analysisType === 'subpackage') {
            initAnalysisModalSubpackageSubItemData(analysisModal, item);
        }
        initAnalysisModalTableThead(analysisModal, analysisType);
        if (analysisType === 'material') {
            initAnalysisMaterialModalTable(tbody, analysisList, 'new', analysisModal);
        } else {
            initAnalysisOthenModalTable(tbody, analysisList, analysisType, 'new', analysisModal);
        }
        initTableInputChange(tbody, analysisModal, analysisType);
    });
    analysisModal.$body.find('.budget-menus a:first-child').click();
    /**
     * 唤起企业库modal
     */
    add.click(function (e) {
        common.stopPropagation(e);
        var newTrs = analysisModal.$body.find('tr.new').length;
        if (newTrs > 0) {
            return alert('请保存当前没有保存的数据,再次添加会丢失当前未保存的数据');
        }
        var $modal = Modal('企业库数据', enterpriseDataBase());
        var type = analysisModal.$body.find('.budget-menus a.active').data('type');
        $modal.showClose();
        $modal.show();
        var analysisisList = getTableNewData(analysisModal);
        $('#' + type + 'EnterpriseModal').data('list', analysisisList);
        initEventModal.initBaseDataModal($modal, type, function (list) {
            $modal.hide();
            var tbody = analysisModal.$body.find('tbody');
            tbody.find('.new').remove();
            if (type === 'material') {
                initAnalysisMaterialModalTable(tbody, list, 'new', analysisModal);
            } else {
                initAnalysisOthenModalTable(tbody, list, type, 'new', analysisModal);
            }
            initTableInputChange(tbody, analysisModal, type);
        }, getTableOldData(analysisModal, type));
        $modal.$body.find('.budget-menus a:not(.active)').addClass('cancel-active');
    });
    /**
     * 添加材料
     */
    confirm.click(function (e) {
        common.stopPropagation(e);
        var _item = analysisModal.$body.find('.budget-menus .item.active');
        var type = $(_item).data('type');
        if ($(this).hasClass('disabled')) {
            return;
        }
        $(this).addClass('disabled');
        if (type === 'material') {
            initMaterialData(item, analysisModal, confirm);
        } else if (type === 'labor') {
            initLaborData(item, analysisModal, confirm);
        } else if (type === 'step') {
            initStepData(item, analysisModal, confirm);
        } else if (type === 'subpackage') {
            initSubletData(item, analysisModal, confirm);
        }
    })
}

/**
 * 获取新添加的 材料 人工 措施 分包
 * @param modal
 * @returns {Array}
 */
function getTableNewData(modal) {
    var trs = modal.$body.find('tbody .new');
    var list = [];
    for (var i = 0, length = trs.length; i < length; i++) {
        var item = $(trs[i]).data('item');
        list.push(item);
    }
    return list;
}

function saveSuccessRemind(modal) {
    var successRemind = $('<div class="success-remind clearfix">' +
        '<div class="remind-logo"></div>' +
        '<div class="remind-words">保存成功</div>' +
        '</div>');
    successRemind.appendTo(modal);
}

function getTableOldData(modal, type) {
    var trs = modal.$body.find('tbody .old');
    var list = [];
    for (var i = 0, length = trs.length; i < length; i++) {
        var item = $(trs[i]).data('item');
        var id = '';
        if (type === 'material') {
            id = item.mtrlId;
        } else if (type === 'step') {
            id = item.measureId
        } else if (type === 'labor') {
            id = item.laborId;
        } else if (type === 'subpackage') {
            id = item.subletId;
        }
        list.push({id: id});
    }
    return list;
}

/**
 * 分包分析
 * @param $item
 * @param modal
 */
function initSubletData($item, modal, confirm) {
    var trs = modal.$body.find('tbody tr');
    var list = [];
    var error = false;
    var errMsg = '';
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        var item = tr.data('item');
        var inputs = tr.find('input');
        var data = {};
        if (tr.data('status') === 'old') {
            data.subletId = item.subletId;
        } else {
            data.subletId = item.id;
        }
        for (var j = 0, $length = inputs.length; j < $length; j++) {
            var value = $(inputs[j]).val();
            var name = $(inputs[j]).attr('name');
            if (!value) {
                error = true;
                errMsg = $(inputs[j]).data('warn');
                break;
            }
            data[name] = value;
        }
        list.push(data);
    }
    if (list.length === 0) {
        confirm.removeClass('disabled');
        return alert('请输入人工分析');
    }
    if (error) {
        confirm.removeClass('disabled');
        return alert(errMsg);
    }
    costBudgetManagerApi.postBudgetSubletItem({subitemId: $item.id, list: list}).then(function (res) {
        if (res.code === 1) {
            confirm.removeClass('disabled');
            saveSuccessRemind(modal.$body);
            initAnalysisModalSubpackageSubItemData(modal, $item);
        }
    }).catch(function () {
        confirm.removeClass('disabled');
    });
}

/**
 * 措施分析
 * @param $item
 * @param modal
 */
function initStepData($item, modal, confirm) {
    var trs = modal.$body.find('tbody tr');
    var list = [];
    var error = false;
    var errMsg = '';
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        var item = tr.data('item');
        var inputs = tr.find('input');
        var data = {};
        if (tr.data('status') === 'old') {
            data.measureId = item.measureId;
        } else {
            data.measureId = item.id;
        }
        for (var j = 0, $length = inputs.length; j < $length; j++) {
            var value = $(inputs[j]).val();
            var name = $(inputs[j]).attr('name');
            if (!value) {
                error = true;
                errMsg = $(inputs[j]).data('warn');
                break;
            }
            data[name] = value;
        }
        list.push(data);
    }
    if (list.length === 0) {
        confirm.removeClass('disabled');
        return alert('请输入人工分析');
    }
    if (error) {
        confirm.removeClass('disabled');
        return alert(errMsg);
    }
    costBudgetManagerApi.postBudgetMeasureItem({subitemId: $item.id, list: list}).then(function (res) {
        if (res.code === 1) {
            confirm.removeClass('disabled');
            saveSuccessRemind(modal.$body);
            initAnalysisModalStepSubItemData(modal, $item);
        }
    }).catch(function () {
        confirm.removeClass('disabled');
    });
}

/**
 * 人力分析
 * @param $item
 * @param modal
 */
function initLaborData($item, modal, confirm) {
    var trs = modal.$body.find('tbody tr');
    var list = [];
    var error = false;
    var errMsg = '';
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        var item = tr.data('item');
        var inputs = tr.find('input');
        var data = {};
        if (tr.data('status') === 'old') {
            data.laborId = item.laborId;
        } else {
            data.laborId = item.id;
        }
        for (var j = 0, $length = inputs.length; j < $length; j++) {
            var value = $(inputs[j]).val();
            var name = $(inputs[j]).attr('name');
            if (!value) {
                error = true;
                errMsg = $(inputs[j]).data('warn');
                break;
            }
            data[name] = value;
        }
        list.push(data);
    }
    if (list.length === 0) {
        confirm.removeClass('disabled');
        return alert('请输入人工分析');
    }
    if (error) {
        confirm.removeClass('disabled');
        return alert(errMsg);
    }
    costBudgetManagerApi.postBudgetLaborSubItem({subitemId: $item.id, list: list}).then(function (res) {
        if (res.code === 1) {
            confirm.removeClass('disabled');
            saveSuccessRemind(modal.$body);
            initAnalysisModalLaborSubItemData(modal, $item);
        }
    }).catch(function (e) {
        confirm.removeClass('disabled');
    });
}

/**
 * 材料分析
 * @param $item
 * @param modal
 */
function initMaterialData($item, modal, confirm) {
    var trs = modal.$body.find('tbody tr');
    var list = [];
    var error = false;
    var errMsg = '';
    for (var i = 0, length = trs.length; i < length; i++) {
        var tr = $(trs[i]);
        var item = tr.data('item');
        var inputs = tr.find('input');
        var data = {};
        if (item.mtrlId) {
            data.mtrlId = item.mtrlId;
        } else {
            data.mtrlId = item.id
        }
        for (var j = 0, $length = inputs.length; j < $length; j++) {
            var value = $(inputs[j]).val();
            var name = $(inputs[j]).attr('name');
            if (!value) {
                error = true;
                errMsg = $(inputs[j]).data('warn');
                break;
            }
            data[name] = value;
        }
        list.push(data);
    }
    if (list.length === 0) {
        confirm.removeClass('disabled');
        return alert('请输入材料分析');
    }
    if (error) {
        confirm.removeClass('disabled');
        return alert(errMsg);
    }
    costBudgetManagerApi.postMaterialSubItemList($item.id, list).then(function (res) {
        if (res.code === 1) {
            confirm.removeClass('disabled');
            saveSuccessRemind(modal.$body);
            initAnalysisModalMaterialSubItemData(modal, $item);
        }
    }).catch(function () {
        confirm.removeClass('disabled');
    })
}

/**
 * 初始化表头数据
 * @param modal
 * @param type
 */
function initAnalysisModalTableThead(modal, type) {
    var list = [];
    if (type === 'material') {
        list = [{name: '序号', value: 45}, {name: '材料名称', value: 80},
            {name: '规格型号', value: 80}, {name: '单位', value: 40}, {name: '单位用量', value: 60}, {name: '材料单价', value: 60},
            {name: '历史均价', value: 60}, {name: '辅材费', value: 80}, {name: '操作', value: 60}];
    } else {
        list = [{name: '序号', value: 45}, {name: '项目名称', value: 80}, {name: '工作内容', value: 120},
            {name: '单位', value: 60}, {name: '单位用量', value: 60}, {name: '单价', value: 60}, {
                name: '历史均价',
                value: 60
            }, {name: '操作', value: 60}];
    }
    var parents = modal.$body.find('thead tr').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        // var dom = $('<th class="border" style="width:' + list[i].value + 'px">' + list[i].name + '</th>');
        var dom = $('<th class="border" style="width:' + list[i].value + 'px">' + list[i].name + '</th>');
        dom.appendTo(parents);
    }
}

/**
 * 初始化表格内容
 * @param parents
 * @param list
 * @param type
 * @param status
 * @param analysisModal
 */
function initAnalysisOthenModalTable(parents, list, type, status, analysisModal) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoAnalysis').hide();
        $('#analysis').show();
    } else {
        $('#noInfoAnalysis').show();
        $('#analysis').hide();
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var name = '';
        if (type === 'labor') {
            name = item.laborName;
        } else if (type === 'step') {
            name = item.measureName;
        } else if (type === 'subpackage') {
            name = item.subletName;
        }
        var dom = $('<tr class="small ' + status + '" data-type="' + type + '" data-status="' + status + '">\
                 <td class="border">' + count + '</td>\
                 <td class="border">' + name + '</td>\
                 <td class="border">' + item.workContent + '</td>\
                 <td class="border">' + item.unit + '</td>\
                 <td class="border">\
                 <input type="text" name="budQpy" placeholder="填写" data-type="number" class="countUnit" data-warn="单位数量"/>\
                 </td>\
                 <td class="border">\
                 <input type="text" name="budPrice" placeholder="填写" class="singlePrice" data-warn="单价"/></td>\
                 <td class="border">' + item.avgPrice + '</td>\
                 <td class="border">\
                  <a class="delete-hover" data-type="delete">删除</a>\
                  <div class="icon-line"></div>\
                  <a class="confirm-hover" data-type="history">历史</a>\
                 </td>\
                </tr>');
        if (item.budQpy) {
            dom.find('[name=budQpy]').val(item.budQpy);
        }
        if (item.budPrice) {
            dom.find('[name=budPrice]').val(item.budPrice);
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initAnalysisMaterialModal(parents, analysisModal);
    initTableInputChange(parents, analysisModal, type);
}

function initAnalysisMaterialModalTable(parents, list, type, analysisModal) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoAnalysis').hide();
        $('#analysis').show();
    } else {
        $('#noInfoAnalysis').show();
        $('#analysis').hide();
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        if (type === 'new') {
            count = count + parents.find('tr').length;
        }
        var dom = $('<tr class="small ' + type + '" data-status=' + type + '>\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">\
                  <input type="text" name="budQpy" placeholder="填写" data-warn="单位数量"  class="countUnit"/>\
                  </td>\
                  <td class="border"><input type="text"  name="budPrice" placeholder="填写" data-warn="单价" class="singlePrice"/></td>\
                  <td class="border">' + item.avgPrice + '</td>\
                  <td class="border"><input type="text" placeholder="填写" name="secMtrlPrice" data-warn="辅材" class="FcPrice"/></td>\
                  <td class="border">\
                   <a class="delete-hover" data-type="delete">删除</a>\
                   <div class="icon-line"></div>\
                   <a class="confirm-hover" data-type="history">历史</a>\
                  </td>\
                 </tr>');
        if (item.budQpy || item.budQpy === 0) {
            dom.find('[name=budQpy]').val(item.budQpy);
        }
        if (item.budPrice || item.budPrice === 0) {
            dom.find('[name=budPrice]').val(item.budPrice);
        }
        if (item.secMtrlPrice || item.secMtrlPrice === 0) {
            dom.find('[name=secMtrlPrice]').val(item.secMtrlPrice);
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initAnalysisMaterialModal(parents, analysisModal);
}

function initAnalysisMaterialModal(parents, analysisModal) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var tr = $(this).parents('tr');
        if (type === 'delete') {
            var delModal = Modal('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDeleteModalEvent(delModal, tr, analysisModal);
        } else {

        }
    })
}

function initDeleteModalEvent() {
    var modal = arguments[0];
    var tr = arguments[1];
    var parentModal = arguments[2];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var status = $(tr).data('status');
        var type = $(tr).data('type') || 'material';
        if (status === 'new') {
            $(tr).remove();
            modal.hide();
            if (type === 'material') {
                FCPriceTotal(parentModal);
            }
            sumMaterialPriceTotalUpdate(parentModal, type);
        } else {
            delAnalysisTable(type, tr, modal, parentModal);
        }
    })
}

function initTableInputChange(tbody, modal, type) {
    tbody.on('keyup', '.countUnit', function (e) {
        common.stopPropagation(e);
        var val = $(this).val();
        $(this).val(val.replace(/。/g, "."));
        val = $(this).val();
        var float = /^\d+(\.\d{1,2})?$/;
        var dian = /^\d+(\.)?$/;
        if (dian.test(val)) {
        } else if (!float.test(val)) {
            $(this).val("");
        }
        var totalPrice = sumMaterialPriceTotal(modal);
        if (type === 'material') {
            modal.$body.find('[name=budMtrlPrice]').val(totalPrice);
        } else if (type === 'labor') {
            modal.$body.find('[name=budLaborPrice]').val(totalPrice);
        } else if (type === 'step') {
            modal.$body.find('[name=budMeasurePrice]').val(totalPrice);
        } else if (type === 'subpackage') {
            modal.$body.find('[name=budSubletPrice]').val(totalPrice);
        }
        costBudgetSumPrice(modal);
    });
    tbody.on('keyup', '.singlePrice', function (e) {
        common.stopPropagation(e);
        var float = /^\d+(\.\d{1,2})?$/;
        var dian = /^\d+(\.)?$/;
        var val = $(this).val();
        $(this).val(val.replace(/。/g, "."));
        val = $(this).val();
        if (dian.test(val)) {
        } else if (!float.test(val)) {
            $(this).val("");
        }
        var totalPrice = sumMaterialPriceTotal(modal);
        if (type === 'material') {
            modal.$body.find('[name=budMtrlPrice]').val(totalPrice);
        } else if (type === 'labor') {
            modal.$body.find('[name=budLaborPrice]').val(totalPrice);
        } else if (type === 'step') {
            modal.$body.find('[name=budMeasurePrice]').val(totalPrice);
        } else if (type === 'subpackage') {
            modal.$body.find('[name=budSubletPrice]').val(totalPrice);
        }
        costBudgetSumPrice(modal);
    });
    if (type === 'material') {
        tbody.on('keyup', '.FcPrice', function (e) {
            common.stopPropagation(e);
            var val = $(this).val();
            var float = /^\d+(\.\d{1,2})?$/;
            var dian = /^\d+(\.)?$/;
            $(this).val(val.replace(/。/g, "."));
            val = $(this).val();
            if (dian.test(val)) {
            } else if (!float.test(val)) {
                $(this).val("");
            }
            FCPriceTotal(modal);
            costBudgetSumPrice(modal);
        });
    }
}

function FCPriceTotal(modal) {
    var totalPrice = sumFcMaterialPriceTotal(modal);
    modal.$body.find('[name=budSecMtrlPrice]').val(totalPrice.toFixed(2));
}

function sumFcMaterialPriceTotal(modal) {
    var count = 0;
    var trs = modal.$body.find('tbody tr');
    for (var i = 0, length = trs.length; i < length; i++) {
        var FcPrice = $(trs[i]).find('.FcPrice').val() || 0;
        count += parseInt(FcPrice);
    }
    return count;
}

/**
 * 获取材料总价格
 * @param modal
 * @returns {number}
 */
function sumMaterialPriceTotal(modal) {
    var count = 0;
    var trs = modal.$body.find('tbody tr');
    for (var i = 0, length = trs.length; i < length; i++) {
        var singlePrice = $(trs[i]).find('.singlePrice').val() || 0;
        var countUnit = $(trs[i]).find('.countUnit').val() || 0;
        count += parseFloat(countUnit) * parseFloat(singlePrice);
    }
    return count;
}

/**
 * 成本核算单价
 * @param modal
 */
function costBudgetSumPrice(modal) {
    var budMtrlPrice = modal.$body.find('[name=budMtrlPrice]').val() || 0;
    var budLaborPrice = modal.$body.find('[name=budLaborPrice]').val() || 0;
    var budMeasurePrice = modal.$body.find('[name=budMeasurePrice]').val() || 0;
    var budSubletPrice = modal.$body.find('[name=budSubletPrice]').val() || 0;
    var budSecMtrlPrice = modal.$body.find('[name=budSecMtrlPrice]').val() || 0;
    if (isNaN(budMtrlPrice) || isNaN(budLaborPrice)
        || isNaN(budMeasurePrice) || isNaN(budSubletPrice) || isNaN(budSecMtrlPrice)) {
        return
    }
    var totalPrice = parseFloat(budMtrlPrice) + parseFloat(budLaborPrice)
        + parseFloat(budMeasurePrice) + parseFloat(budSubletPrice) + parseFloat(budSecMtrlPrice);
    modal.$body.find('.modal-form [name=budPrice]').val(totalPrice.toFixed(2))
}

exports.initMaterialSelect = function initMaterialSelect(parents) {
    parents.change(function (e) {
        common.stopPropagation(e);
        var children = $(this).find('option:selected').data('children');
        var $parents = $('#costMaterialLevel').html('');
        $('<option value="a">材料分类</option>').appendTo($parents);
        if (children) {
            for (var i = 0, length = children.length; i < length; i++) {
                var item = children[i];
                var dom = $('<option></option>');
                if (item.mtrlTypeName.length > 9) {
                    item.mtrlTypeName = item.mtrlTypeName.slice(0, 9) + '...';
                }
                dom.text(item.mtrlTypeName);
                dom.val(item.id);
                dom.appendTo($parents);
            }
        }
    })
};


function delAnalysisTable(type, tr, modal, parentModal) {
    var item = $(tr).data('item');
    if (type === 'material') {
        initCostBudgetList.delMaterialSubItemListFunc({
            subitemId: item.subitemId,
            ids: item.id
        }, tr, modal, function () {
            FCPriceTotal(parentModal);
            sumMaterialPriceTotalUpdate(parentModal, type);
        });
    } else if (type === 'labor') {
        initCostBudgetList.delBudgetLaborSubItemFunc({subitemId: item.subitemId, ids: item.id}, tr, modal, function () {
            sumMaterialPriceTotalUpdate(parentModal, type);
        });
    } else if (type === 'step') {
        initCostBudgetList.delBudgetMeasureItemFunc({subitemId: item.subitemId, ids: item.id}, tr, modal, function () {
            sumMaterialPriceTotalUpdate(parentModal, type);
        })
    } else if (type === 'subpackage') {
        initCostBudgetList.delBudgetSubletItemFunc({subitemId: item.subitemId, ids: item.id}, tr, modal, function () {
            sumMaterialPriceTotalUpdate(parentModal, type);
        })
    }
}


exports.initMaterialTableEvent = function (parents, $type) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var type = $(this).data('type');
        if (type === 'price') {
            var adjustPrice = Modal('单价调整', adjustPriceModal());
            adjustPrice.showClose();
            adjustPrice.show();
            adjustPrice.$body.find('[name=price]').val(item.budPrice);
            adjustPrice.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                var price = adjustPrice.$body.find('[name=price]').val();
                if (!price || isNaN(price)) {
                    return alert('请输入价格');
                }
                var _type = parseType($type);
                var _id = '';
                if ($type === 'labor') {
                    _id = item.laborId;
                } else if ($type === 'step') {
                    _id = item.measureId
                } else if ($type === 'subpackage') {
                    _id = item.subletId;
                } else if ($type === 'material') {
                    _id = item.mtrlId;
                }
                initCostBudgetList.putBudgetPrice({id: _id, price: price, type: _type}, adjustPrice);
            });
        } else {
            parents.find('.width-427').remove();
            var td = $(this).parent('td');
            var materialCheck = $(materialCheckModel());
            materialCheck.appendTo(td);
            initMaterialCheckModal(materialCheck);
            initMaterialCheckModalData(materialCheck, item, type);
        }
    });
};

function parseType(type) {
    switch (type) {
        case 'labor':
            return '3';
        case 'material':
            return '2';
        case 'step':
            return '4';
        case 'subpackage':
            return '5';
    }
}

function initMaterialCheckModal() {
    var modal = arguments[0];
    $('.width-427').click(function (e) {
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
    var type = arguments[2];
    if (type === 'material') {
        initCostBudgetList.getMaterialFindSubItemListFunc({mtrlId: item.mtrlId}, modal);
    } else if (type === 'labor') {
        initCostBudgetList.getLaborFindSubItemListFunc({laborId: item.laborId}, modal);
    } else if (type === 'step') {
        initCostBudgetList.getStepFindSubItemListFunc({measureId: item.measureId}, modal);
    } else if (type === 'subpackage') {
        initCostBudgetList.getSubpackageSubItemListFunc({subletId: item.subletId}, modal);
    }
}

exports.initQuantityTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        parents.find('.quantity-check-detail').remove();
        var td = $(this).parents('td');
        var item = $(this).parents('tr').data('item');
        var quantityCheck = $(quantityCheckModal());
        quantityCheck.appendTo(td);
        initQuantityTableModalEvent(quantityCheck);
        initQuantityTableData(quantityCheck, item);
    });
};

function initQuantityTableModalEvent() {
    var modal = arguments[0];
    $('.quantity-check-detail').click(function (e) {
        common.stopPropagation(e);
    })
    modal.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        $(this).parents('.quantity-check-detail').remove();
    });
}

function initQuantityTableData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.find('.subitemNo').text(item.sysNo);
    modal.find('.subitemDesc').text(item.subitemDesc);
    modal.find('.checkQpyFormula').text(item.checkQpyFormula);
}


function sumMaterialPriceTotalUpdate(modal, type) {
    var totalPrice = sumMaterialPriceTotal(modal);
    if (type === 'material') {
        modal.$body.find('[name=budMtrlPrice]').val(totalPrice);
    } else if (type === 'labor') {
        modal.$body.find('[name=budLaborPrice]').val(totalPrice);
    } else if (type === 'step') {
        modal.$body.find('[name=budMeasurePrice]').val(totalPrice);
    } else if (type === 'subpackage') {
        modal.$body.find('[name=budSubletPrice]').val(totalPrice);
    }
    costBudgetSumPrice(modal);
}

/**
 * 初始化工程量核算搜索事件
 * @param $page
 */
exports.initCommonEvent = function ($page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var keywords = $('[name=keywords]').val().trim();
            var showType = $('.cost-quantity-page a.active').data('type');
            var data = {};
            if (keywords) {
                data.keywords = keywords;
            }
            data.showType = showType;
            initCostBudgetList.getCostQuantityFunc($page, data);
        });
        $('.cost-quantity-page a.search').click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            $('.cost-quantity-page a.search').removeClass('active');
            $(this).addClass('active');
            var keywords = $('[name=keywords]').val().trim();
            var showType = $('.cost-quantity-page a.active').data('type');
            var data = {};
            if (keywords) {
                data.keywords = keywords;
            }
            data.showType = showType;
            initCostBudgetList.getCostQuantityFunc($page, data);
        })
    }
};
/**
 * 材料预算
 * @param $page
 */
exports.initBudgetMaterialEvent = function ($page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var keywords = $('[name=keywords]').val().trim();
            var mtrlCategory = $('#costMaterialType').val();
            var mtrlType = $('#costMaterialLevel').val();
            var data = {};
            if (keywords) {
                data.keywords = keywords;
            }
            if (mtrlCategory && mtrlCategory.trim() !== '' && mtrlCategory !== 'a') {
                data.mtrlCategory = mtrlCategory;
            }
            if (mtrlType && mtrlType.trim() !== '' && mtrlType !== 'a') {
                data.mtrlType = mtrlType;
            }
            initCostBudgetList.getCostMaterialFunc($page, data);
        })
    }
};
/**
 * 人工搜索
 */
exports.initBudgetLaborEvent = function ($page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var data = {};
            var costLaborType = $('#costLaborType').val();
            var keywords = $('[name=keywords]').val().trim();
            if (keywords && keywords.trim() !== '') {
                data.keywords = keywords;
            }
            if (costLaborType && costLaborType.trim() !== '' && costLaborType !== 'a') {
                data.laborType = costLaborType;
            }
            initCostBudgetList.getCostWorkerCountFunc($page, data);
        })
    }
};
/**
 * 措施搜索
 * @param $page
 */
exports.costBudgetStepEvent = function ($page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var data = {};
            var keywords = $('[name=keywords]').val().trim();
            if (keywords && keywords.trim() !== '') {
                data.keywords = keywords;
            }
            var measureType = $('#costStepType').val();
            if (measureType && measureType.trim() !== '' && measureType !== 'a') {
                data.measureType = measureType;
            }
            initCostBudgetList.getCostStepFunc($page, data);
        });
    }
};

exports.costBudgetSubpackageEvent = function ($page) {
    var searchModal = $('#searchModal');
    if (searchModal.length > 0 && !searchModal.data('flag')) {
        searchModal.data('flag', true);
        searchModal.click(function (e) {
            common.stopPropagation(e);
            var data = {};
            var keywords = $('[name=keywords]').val().trim();
            if (keywords && keywords.trim() !== '') {
                data.keywords = keywords;
            }
            var subletType = $('#costSubpackageType').val();
            if (subletType && subletType.trim() !== '' && subletType !== 'a') {
                data.subletType = subletType;
            }
            initCostBudgetList.getCostSubpageageFunc($page, data);
        })
    }
};
/**
 * 异常处理
 * @param parents
 * @param modal 父modal
 */
exports.initBudgetExceptionTableEvent = function (parents, modal, callback) {
    parents.find('.icon-exception').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var exceptionRemark = Modal('编辑备忘', exceptionRemarkModal());
        exceptionRemark.showClose();
        exceptionRemark.show();
        var $body = exceptionRemark.$body;
        $body.find('[name=usedValue]').text(item.usedValue);
        $body.find('[name=sysValue]').text(item.sysValue);
        $body.find('[name=excpValue]').text(item.excpValue);
        $body.find('[name=usedValue]').text(item.usedValue);
        $body.find('textarea').val(item.remark);
        exceptionRemark.$body.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var remark = $body.find('textarea').val();
            if (!remark || remark.trim() === '') {
                return alert('请输入备忘内容');
            }
            initCostBudgetList.postExceptionObjFunc({remark: remark, id: item.id}, exceptionRemark, modal, callback)
        });
    })
};



