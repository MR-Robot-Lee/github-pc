var common = require('../../../Common/index');
var chargeApi = require('../../../Enterprise/chargeApi');
var enterpriseApi = require('../../../Enterprise/enterpriseApi');
var addMaterialModal = require('./addMaterialModal.ejs');
var addStepModal = require('./addStepModal.ejs');
var onScrollDom = require('../../../Common/onScrollDom');
var initCostBudgetList = require('./../initCostBudgetList');

/**
 * 初始化企业库列表
 * @param modal
 * @param $list
 * @param callback
 * @param type material 材料库 labor 人工费库 step 措施费 subpackage 分包库 supplier 供应商库
 */
exports.initBaseDataModal = function initBaseDataModal(modal, type, callback, $list) {
    modal.$body.find('.budget-menus a').click(function (e) {
        common.stopPropagation(e);
        var $type = $(this).data('type');
        var showName = {material: '新增材料', labor: '新增人工', step: '新增措施', subpackage: '新增分包', supplier: '供应商'}
        if (type && typeof type === 'string' && type !== $type) {
            return;
        }
        if (type && typeof type === 'object' && type.indexOf($type) < 0) {
            return
        }
        if ($(this).hasClass('active')) {
            return;
        } else {
            modal.$body.find('.budget-menus a').removeClass('active');
            $(this).addClass('active');
        }
        modal.$body.find('.enterpriseName').text(showName[$type]);
        chargeApi.getModalNavList($type).then(function (res) {
            $list = $list || [];
            var parents = modal.$body.find('#modalEnterpriseNav').html('');
            renderEnterpriseDataBaseNav(res.data.data, parents, $type);
            initNavClick(parents, $type, modal, $list);
            if (modal.$body.find('#modalEnterpriseNav').find('li').length > 0) {
                parents.find('>li:first-child').click();
            } else {
                modal.$body.find('#modalEnterpriseList').html('');
                modal.$body.find('thead').find('[type=checkbox]').prop('checked', false);
            }
        })
    });
    if (typeof type === 'object' && type.length > 0) {
        $('#' + type[0] + 'EnterpriseModal').click();
    } else if (typeof type === 'string') {
        $('#' + type + 'EnterpriseModal').click();
    } else {
        modal.$body.find('.budget-menus a:first-child').click();
    }
    initSubmitData(modal, callback, type);
    initAddContentDom(type, modal);
};

function renderEnterpriseDataBaseNav(list, parents, type, $childParent) {
    type = type || 'material';
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var name = '';
        if (type === 'labor') {
            name = item.laborTypeName;
        } else if (type === 'step') {
            name = item.measureTypeName;
        } else if (type === 'subpackage') {
            name = item.subletTypeName;
        } else if (type === 'supplier') {
            name = item.entpTypeName;
        } else if (type === 'material') {
            name = item.mtrlCategoryName || item.mtrlTypeName;
        }
        var dom = $('<li>\
                  <a><span class="icon-select-arrow "></span><span style="display: inline-block;width: 150px;vertical-align: middle;" class="ellipsis">' + name + '</span></a>\
                 </li>');
        dom.data('item', item);
        if (item.children) {
            var childParents = $('<ul></ul>');
            renderEnterpriseDataBaseNav(item.children, dom, type, childParents);
        } else {
            dom.find('.icon-select-arrow').remove();
        }
        if ($childParent) {
            dom.appendTo($childParent);
            $childParent.appendTo(parents);
        } else {
            dom.appendTo(parents);
        }
    }
}

function initNavClick(parents, type, modal, $list) {
    parents.find('>li').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data("item");
        if (item.children) {
            parents.find('>li').removeClass('active');
            $(this).addClass('active');
            parents.find('ul').hide();
            parents.find('.icon-select-arrow').removeClass('active');
            if ($(this).find('ul').length === 0) {
                modal.$body.find('#modalEnterpriseList').html('');
                return;
            }
            $(this).find('.icon-select-arrow').addClass('active');
            $(this).find('>ul').show();
            $(this).find('>ul >li:first-child').click();
            return;
        } else {
            parents.find('>li').removeClass('active-fff');
            $(this).addClass('active-fff');
        }
        getTableList(type, item, modal, $list);
    });
    if (parents.find('>li >ul').length > 0) {
        parents.find('>li >ul >li').click(function (e) {
            common.stopPropagation(e);
            parents.find('>li >ul >li').removeClass('active');
            $(this).addClass('active');
            var item = $(this).data('item');
            getTableList(type, item, modal, $list);
        })
    }
}

function renderModalEnterpriseTable(list, type, modal) {
    list = list || [];
    var seleList = modal.$body.find('.budget-menus a.active').data('list') || [];
    var parents = modal.$body.find('#modalEnterpriseList').html('');
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
        } else if (type === 'supplier') {
            name = item.entpName;
        } else if (type === 'material') {
            name = item.mtrlName;
        }
        var specBrand = '';
        if (type === 'material') {
            specBrand = item.specBrand;
        } else {
            specBrand = item.workContent;
        }
        var dom = $('<tr class="small">\
             <td class="border"><input type="checkbox" /></td>\
             <td class="border">' + count + '</td>\
             <td class="border">' + name + '</td>\
             <td class="border">' + specBrand + '</td>\
             <td class="border">' + item.unit + '</td>\
             <td class="border">' + item.avgPrice + '</td>\
            </tr>');
        dom.data('item', item);
        var checked = false;
        for (var j = 0, $length = seleList.length; j < $length; j++) {
            if (item.id === seleList[j].id) {
                checked = true
            }
        }
        dom.find('[type=checkbox]').prop('checked', checked);
        dom.appendTo(parents);
    }
    if (parents.find('[type=checkbox]:checked').length === 0) {
        modal.$body.find('thead [type=checkbox]').prop('checked', false);
    } else {
        modal.$body.find('thead [type=checkbox]').prop('checked', true);
    }
}

function renderModalSupplier(list, modal) {
    list = list || [];
    var seleList = modal.$body.find('.budget-menus a.active').data('list') || [];
    var parents = $('#modalEnterpriseList').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">\
             <td class="border"><input type="checkbox" /></td>\
             <td class="border">' + count + '</td>\
             <td class="border">' + item.entpName + '</td>\
             <td class="border">' + item.contactName + '</td>\
             <td class="border">' + item.phone + '</td>\
             <td class="border">' + item.attachCount + '</td>\
             <td class="border" style="position: relative"><a class="check">查看</a></td>\
            </tr>');
        dom.data('item', item);
        for (var j = 0, $length = seleList.length; j < $length; j++) {
            if (item.id === seleList[j].id) {
                dom.find('[type=checkbox]').prop('checked', true);
            }
        }
        dom.appendTo(parents);
    }
    checkBackInfo(parents);
    if (parents.find('[type=checkbox]:checked').length === 0) {
        modal.$body.find('thead [type=checkbox]').prop('checked', false);
    } else {
        modal.$body.find('thead [type=checkbox]').prop('checked', true);
    }
}

function checkBackInfo(parents) {
    parents.find('.check').click(function (e) {
        common.stopPropagation(e);
        parents.find('.check-bank-info').remove();
        var item = $(this).parents('tr').data('item');
        var td = $(this).parents('td');
        var dom = $('<div class="check-bank-info">\
        <div class="bank-info-section">\
         <div><label>开户名:</label><span>' + item.openName + '</span></div>\
         <div style="margin-top: 10px"><label>开户行:</label>\
         <span>' + item.openBank + '</span></div>\
         <div style="margin-top: 10px"><label>账号:</label>\
         <span>' + item.bankCard + '</span></div>\
        </div>\
         <div class="triangle-left bebebe"></div>\
         <div class="triangle-left ffffff"></div>\
        </div>');
        dom.appendTo(td);
    })
}

/**
 * 绘制表头信息
 * @param type
 */
function renderModalEnterpriseTheadTable(type, modal) {
    var parents = modal.$body.find('#modalEnterpriseThead').html('');
    var list = [];
    if (type === 'labor') {
        list = ['input', '序号', '费用名称', '工作内容', '单位', '均价'];
    } else if (type === 'step') {
        list = ['input', '序号', '费用名称', '工作内容', '单位', '均价'];
    } else if (type === 'subpackage') {
        list = ['input', '序号', '费用名称', '工作内容', '单位', '均价'];
    } else if (type === 'supplier') {
        list = ['input', '序号', '供应商名字', '联系人', '电话', '相关证件', '银行信息'];
    } else if (type === 'material') {
        list = ['input', '序号', '材料名称', '规格型号', '单位', '均价'];
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = '';
        if (item === 'input') {
            dom = $('<th class="border"><input type="checkbox"/></th>');
        } else {
            dom = $('<th class="border">' + item + '</th>');
        }
        dom.appendTo(parents);
    }
}

/**
 * 初始化table checkbox事件
 * todo 数据量大的话 就用接口
 */
function tableCheckEvent(modal) {
    var parents = modal.$body.find('#modalEnterpriseList');
    var menus = modal.$body.find('.budget-menus a.active');
    parents.find('[type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        var list = menus.data('list') || [];
        var $item = $(this).parents('tr').data('item');
        if ($(this).prop('checked')) {
            list.push($item);
        } else {
            list = list.filter(function (item) {
                return item.id !== $item.id
            })
        }
        menus.data('list', list);
        if (parents.find('[type=checkbox]:checked').length === 0) {
            modal.$body.find('thead [type=checkbox]').prop('checked', false);
        } else {
            modal.$body.find('thead [type=checkbox]').prop('checked', true);
        }
    });
    modal.$body.find('thead [type=checkbox]').click(function (e) {
        common.stopPropagation(e);
        if (parents.find('[type=checkbox]').length === 0) {
            $(this).prop('checked', false);
            return;
        }
        var list = menus.data('list') || [];
        var tbodyInput = parents.find('[type=checkbox]');
        if ($(this).prop('checked')) {
            tbodyInput.prop('checked', true);
            for (var i = 0, length = tbodyInput.length; i < length; i++) {
                list.push($(tbodyInput[i]).parents('tr').data('item'));
            }
        } else {
            for (var j = 0, $length = tbodyInput.length; j < $length; j++) {
                var $item = $(tbodyInput[j]).parents('tr').data('item');
                list = list.filter(function (item) {
                    return item.id !== $item.id;
                });
            }
            tbodyInput.prop('checked', false);
        }
        menus.data('list', list);
    })
}

function initSubmitData(modal, callback, $type) {
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var list = [];
        if (typeof $type === 'string') {
            var $menus = $('#' + $type + 'EnterpriseModal');
            var singleList = $menus.data('list');
            list = singleList || [];
        } else if (typeof $type === 'object') {
            for (var j = 0, $length = $type.length; j < $length; j++) {
                var item = {};
                var $item = $type[j];
                item[$item] = $('#' + $item + 'EnterpriseModal').data('list') || [];
                list.push(item);
            }
        } else {
            var menus = modal.$body.find('.budget-menus a');
            for (var i = 0, length = menus.length; i < length; i++) {
                var type = $(menus[i]).data('type');
                var $list = $(menus[i]).data('list');
                var data = {};
                data[type] = $list || [];
                list.push(data);
            }
        }
        if (callback) {
            callback(list)
        }
    })
}

/**
 * 过滤存在的数据
 * @param res
 * @param $list
 */
function filterList(res, $list) {
    var list = res.data ? res.data.data : [];
    for (var i = 0; i < $list.length; i++) {
        for (var j = 0; j < list.length; j++) {
            if ($list[i].id === list[j].id) {
                list.splice(j, 1);
            }
        }
    }
    return list;
}

/**
 * 添加
 */
function initAddContentDom() {
    var type = arguments[0];
    var modal = arguments[1];
    modal.$body.find('#addEnterpriseContent').click(function (e) {
        common.stopPropagation(e);
        $('.material-manager-modal').remove();
        var type = modal.$body.find('.budget-menus a.active').data('type');
        if ($(this).find('.enterprise-add').length > 0) {
            $(this).find('.enterprise-add').remove();
        } else {
            var addMaterial;
            var itemName;//字段名称

            if (type === 'material') {
                addMaterial = $(addMaterialModal());
                itemName = 'mtrlCategoryName';
            } else if (type === 'labor') {
                addMaterial = $(addStepModal());
                itemName = 'laborTypeName';
            } else if (type === 'step') {
                addMaterial = $(addStepModal());
                itemName = 'measureTypeName';
            } else if (type === 'subpackage') {
                addMaterial = $(addStepModal());
                itemName = 'subletTypeName';
            } else if (type === 'supplier') {

            } else {
                return;
            }

            /*添加一级下拉菜单*/
            var categorySel = addMaterial.find('.category-sel ul');
            $('.modal-data-base-nav>ul>li').each(function (index, ele) {
                var dom = $('<li>' + $(ele).data('item')[itemName] + '</li>');
                /*如果是材料库，则获取二级列表数据*/
                if (type === 'material') {
                    var list = [];
                    $(ele).find('li').each(function (index, ele) {
                        list.push(ele);
                    });
                    dom.data('list', list);
                }
                dom.data('item', $(ele).data('item'));
                dom.appendTo(categorySel);
                typeListEvent(type, dom, addMaterial);
            });
            addMaterial.appendTo($(this).parents('.enterprise-data-base-content'));
            submitData(type, addMaterial);
            $('.enterprise-add').click(function (e) {
                common.stopPropagation(e);
            })
            modal.$body.click(function () {
                $('.material-manager-modal.enterprise-add').remove();
            })
        }
    })
}

/*一级菜单中li的点击事件*/
exports._typeListEvent = typeListEvent;

function typeListEvent(type, dom, modal, inCntr) {
    dom.click(function (e) {
        common.stopPropagation(e);
        var item = dom.html();
        var categorySel = modal.find('.category-sel');
        var typeSel = modal.find('.type-sel');
        var typeIpt = modal.find('.type-ipt');
        /*选中后改变select内容，并绑定对应data*/
        modal.find('.category-sel>span').html(item).css('color', '#333');
        modal.find('.material-category').data('item', $(this).data('item'));
        /*重置二级菜单*/
        modal.find('.type-sel>span').html('选择材料类型').css('color', '#757575');
        typeSel.find('ul').find('li:not(.add-new-type)').remove();//清空ul
        typeSel.data('item', {});
        typeSel.show();
        typeIpt.hide();
        typeIpt.find('input').val('');
        typeIpt.find('.back-to-select').show();
        typeIpt.parents('.material-shift').find('.bold-title').removeClass('btn-fine-adj1');
        /*收回下拉菜单*/
        categorySel.toggleClass('border-active');
        categorySel.find('.select-arrow').removeClass('arrow-rotate');
        categorySel.find('ul').hide();
        /*如果是材料库，添加二级菜单*/
        if (type === 'material') {
            typeSel.find('ul').find('.add-new-type').show();
            typeSel.find('ul').find('li:not(.add-new-type)').remove();//清空ul
            var list = dom.data('list');
            for (var i = 0; i < list.length; i++) {//填写二级列表并绑定对应data
                var _item;
                var typeContent;
                if (inCntr) {
                    _item = list[i];
                    typeContent = _item.mtrlTypeName;
                } else {
                    _item = $(list[i]).data('item');
                    typeContent = $(list[i]).find('a span').html();
                }
                var _dom = $('<li>' + typeContent + '</li>');
                _dom.data('item', _item);
                _dom.appendTo(typeSel.find('ul'));
                _dom.click(function () {
                    /*选中后改变select内容，并绑定对应data*/
                    modal.find('.type-sel>span').html($(this).html()).css('color', '#333');
                    modal.find('.material-type').data('item', $(this).data('item'));
                    /*收回下拉菜单*/
                    typeSel.toggleClass('border-active');
                    typeSel.find('.select-arrow').removeClass('arrow-rotate');
                    typeSel.find('ul').hide();
                })
            }
        }
    });
}

/*选择框 和 输入框 的切换*/
exports._materialShift = materialShift;

function materialShift(mtrlSel, mtrlIpt, type) {
    var typeSel = $('.type-sel');//类别选择框(一级)
    var typeIpt = $('.type-ipt');//类别输入框(一级)
    /*点击选择框 展开下拉菜单*/
    mtrlSel.click(function (e) {
        common.stopPropagation(e);
        mtrlSel.toggleClass('border-active');
        mtrlSel.find('.select-arrow').toggleClass('arrow-rotate');
        mtrlSel.find('ul').slideToggle(150);
    });
    mtrlSel.find('ul').click(function (e) {
        common.stopPropagation(e);
    });

    /*点击 新增材料 切换到 输入框*/
    mtrlSel.find('.add-new-type').click(function (e) {
        common.stopPropagation(e);
        mtrlIpt.show().css('display', 'inline-block');
        mtrlIpt.find('input').focus();
        mtrlSel.hide();
        mtrlSel.click();
        typeSel.removeClass('border-active');
        typeSel.find('.select-arrow').removeClass('arrow-rotate');
        typeSel.find('ul').hide();

        $(this).parents('.material-shift').find('.bold-title').addClass('btn-fine-adj1');
        if (type === 'materialType') {
            typeSel.hide();
            typeIpt.show().css('display', 'inline-block');
            typeIpt.find('.back-to-select').hide();
            typeIpt.parents('.material-shift').find('.bold-title').addClass('btn-fine-adj1');
        }
    });
    /*切换回 选择框状态*/
    mtrlIpt.find('.back-to-select').click(function (e) {
        common.stopPropagation(e);
        mtrlSel.show();
        mtrlIpt.hide();
        mtrlIpt.find('input').val('');
        $(this).parents('.material-shift').find('.bold-title').removeClass('btn-fine-adj1');
        if (type === 'materialType') {
            typeSel.show();
            typeIpt.hide();
            typeIpt.find('input').val('');
            typeIpt.find('.back-to-select').show();
            typeIpt.parents('.material-shift').find('.bold-title').removeClass('btn-fine-adj1');
        }
    });
};

/**
 * 提交table数据 // todo 企业库在看
 */
function submitData(type, modal) {
    modal.find('.cancel').click(function (e) {
        common.stopPropagation(e);
        $(this).parents('.enterprise-add').remove();

    });
    var categorySel = modal.find('.category-sel');//类别选择框(一级)
    var categoryIpt = modal.find('.category-ipt');//类别输入框(一级)
    var typeSel = modal.find('.type-sel');//类型选择框(二级)
    var typeIpt = modal.find('.type-ipt');//类型输入框(二级)

    if (type === 'material') {
        materialShift(categorySel, categoryIpt, 'materialType');
        materialShift(typeSel, typeIpt);
        /*预选当前所在栏目*/
        var liActive = $('.modal-data-base-nav>ul>li.active');
        var _liActive = $('.modal-data-base-nav>ul>li.active>ul>li.active');
        var prevNum = liActive.prevAll('li').length;
        var _prevNum = _liActive.prevAll('li').length;
        categorySel.find('ul>li').eq(prevNum + 1).click();
        typeSel.find('ul>li').eq(_prevNum + 1).click();

    } else {
        materialShift(categorySel, categoryIpt);
        /*预选当前所在栏目*/
        var liActive = $('.modal-data-base-nav>ul>li.active-fff');
        var prevNum = liActive.prevAll('li').length;
        categorySel.find('ul>li').eq(prevNum + 1).click();
    }


    modal.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        var data = {};
        if (type === 'material') {
            /*没有新建名的情况下从select中选择已有*/
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
                data.mtrlCategory = $('.material-category').data('item').id;
            }

            if (typeIpt.find('input').val()) {
                data.mtrlType = '';
            } else {
                data.mtrlType = $('.material-type').data('item').id;
            }
            data.mtrlTypeName = mtrlTypeName;
            data.mtrlCategoryName = mtrlCategoryName;
            data.mtrlName = modal.find('[name=mtrlName]').val();
            data.specBrand = modal.find('[name=specBrand]').val();
            data.unit = modal.find('[name=unit]').val();

            if (!data.mtrlName) {
                return alert('请输入新增材料名称');
            }
            if (!data.specBrand) {
                return alert('请输入新增规格型号')
            }
            if (!data.unit) {
                return alert('请输入新增材料单位');
            }
        } else if (type === 'supplier') {

        } else if (type === 'step') {
            var measureCategoryName = categoryIpt.find('input').val() || categorySel.children('span').html();
            if (measureCategoryName === '选择材料类别') {
                return alert('请选择或新增材料类别');
            }
            if (categoryIpt.find('input').val()) {
                data.measureType = '';
            } else {
                data.measureType = $('.material-category').data('item').id;
            }

            data.measureTypeName = measureCategoryName;
            data.measureName = modal.find('[name=mtrlName]').val();
            data.workContent = modal.find('[name=specBrand]').val();
            data.unit = modal.find('[name=unit]').val();
            if (!data.measureName) {
                return alert('请输措施工名称');
            }
            if (!data.workContent) {
                return alert('请输措施作内容')
            }
            if (!data.unit) {
                return alert('请输入单位');
            }
        } else if (type === 'labor') {
            var laborCategoryName = categoryIpt.find('input').val() || categorySel.children('span').html();
            if (laborCategoryName === '选择材料类别') {
                return alert('请选择或新增材料类别');
            }
            if (categoryIpt.find('input').val()) {
                data.laborType = '';
            } else {
                data.laborType = $('.material-category').data('item').id;
            }
            data.laborTypeName = laborCategoryName;
            data.laborName = modal.find('[name=mtrlName]').val();
            data.workContent = modal.find('[name=specBrand]').val();
            data.unit = modal.find('[name=unit]').val();
            if (!data.laborName) {
                return alert('请输入人工名称');
            }
            if (!data.workContent) {
                return alert('请输入工作内容')
            }
            if (!data.unit) {
                return alert('请输入单位');
            }
        } else if (type === 'subpackage') {
            var subletCategoryName = categoryIpt.find('input').val() || categorySel.children('span').html();
            if (subletCategoryName === '选择材料类别') {
                return alert('请选择或新增材料类别');
            }
            if (categoryIpt.find('input').val()) {
                data.subletType = '';
            } else {
                data.subletType = $('.material-category').data('item').id;
            }
            data.subletTypeName = subletCategoryName;
            data.subletName = modal.find('[name=mtrlName]').val();
            data.workContent = modal.find('[name=specBrand]').val();
            data.unit = modal.find('[name=unit]').val();
            if (!data.subletName) {
                return alert('请输入分包名称');
            }
            if (!data.workContent) {
                return alert('请输入工作内容')
            }
            if (!data.unit) {
                return alert('请输入单位');
            }
        }
        chargeApi.postMaterialBaseAll(data, type, function (res) {
            if (res.code === 1) {
                var tempId = $(that).parents('.model-inner').find('.budget-menus>a.active').attr('id');
                $(that).parents('.model-inner').remove();
                $('.page-budget .add').click();
                $('.addEnterprise').click();
                $('#addEnterprise').click();

                /*定时器模仿监听list是否加载完成*/
                var addListListener = setInterval(function(){
                    if($('.modal-data-base-nav>ul>li').length > 0){
                        clearInterval(addListListener);
                        $('#'+tempId).click();
                        /*定时器模仿监听第二次list渲染是否完成*/
                        var _addListListener = setInterval(function(){
                            if($('.modal-data-base-nav>ul>li').length > 0){
                                clearInterval(_addListListener);
                                var categoryId = res.data.categoryId;//一级id
                                $('.modal-data-base-nav>ul>li').each(function(){
                                    if($(this).data('item').id === categoryId){
                                        $(this).click();//一级li点击
                                    }
                                });
                                /*是否有二级类型*/
                                if(type === 'material'){
                                    var typeId = res.data.typeId;//二级id
                                    $('.modal-data-base-nav>ul>li.active').find('li').each(function(index,ele){
                                        /*判断是否有二级列表*/
                                        if($(ele).data('item').id === typeId){
                                            $(ele).click();//二级li点击
                                        }
                                    })
                                }
                            }
                        },100)
                    }
                },100);
            }
        });
    });
}

function getTableList(type, item, modal, $list) {
    chargeApi.getModalTableList(type, item).then(function (res) {
        renderModalEnterpriseTheadTable(type, modal);
        var list = filterList(res, $list);
        if (type === 'supplier') {
            renderModalSupplier(list, modal);
        } else {
            renderModalEnterpriseTable(list, type, modal);
        }
        tableCheckEvent(modal);
        var pageSize = res.data ? res.data.pageSize : 10;
        var total = res.data ? res.data.total : 0;
        var moreData = modal.$body.find('.more-data-load');
        var scrollEvent = modal.$body.find('.table-content');
        scrollEvent.data('flag', false);
        onScrollDom.moreData(pageSize, total, moreData, scrollEvent, function (data) {
            item.pageSize = data.pageSize;
            getTableList(type, item, modal, $list)
        });
        onScrollDom.initDomScrollEvent(null, scrollEvent, scrollEvent.find('table'))
    }).catch(function () {
        modal.$body.find('.table-content').data('flag', false);
    })
}