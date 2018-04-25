var request = require('../../helper/request');
var addSupplierModal = require('./addSupplierModal.ejs');
var Model = require('../../components/Model');
var addSupplierContentModal = require('../../pages/Enterprise/modal/addSupplierMaterialModal.ejs');
var common = require('../../pages/Common');
var UploadAttach = require('../../components/UploadAttach');
var costBudgetManagerEventModal = require('../../pages/Project/costBudgetManager/modal/initEventModal');
var bidEvent = require('../../pages/Bids/initEvent');


function addSupplier(container, bindData, data, type) {
    var that = this;
    if (!(this instanceof addSupplier)) {
        return new addSupplier(container, bindData, data);
    }
    this.$addSupplier = $(addSupplierModal());
    this.$close = this.$addSupplier.find('.icon-close');
    this.$supplierType = this.$addSupplier.find('.supplierType');
    this.$supplierName = this.$addSupplier.find('.supplier-content-supplier');
    this.$container = container;
    this.bindData = bindData;
    var that = this;
    if (typeof bindData === 'object' && bindData.find('.model-add-supplier').length > 0) {
        bindData.find('.model-add-supplier').remove();
    }
    if (typeof bindData === 'object') {
        this.$addSupplier.appendTo(bindData);
    } else if (typeof bindData === 'string') {
        if (bindData === 'undefined' || bindData.trim() === '') {
            throw new Error('没有绑定的dom')
        }
    }
    this.$close.click(function (e) {
        common.stopPropagation(e);
        that.bindData.find('.model-add-supplier').remove();
    });
    this.getSupplierType(type);
    this.$addSupplier.find('.add-supplier').click(function (e) {
        common.stopPropagation(e);
        $('.add-supplier-in-meterial').remove();
        var addSupplierContent = $(addSupplierContentModal());
        var attach = new UploadAttach(addSupplierContent.find('#addSupplierAttach'));
        var categorySel = addSupplierContent.find('.category-sel');//类别选择框(一级)
        var categoryIpt = addSupplierContent.find('.category-ipt');//类别输入框(一级)
        /*添加一级下拉菜单*/
        $('.supplierType.supplierDetail').find('li').each(function (index, ele) {
            var dom = $('<li>' + $(ele).data('item').entpTypeName + '</li>');
            dom.data('item', $(ele).data('item'));
            dom.appendTo(categorySel.find('ul'));
            /*初始化一级菜单中li的点击事件*/
            costBudgetManagerEventModal._typeListEvent('', dom, addSupplierContent);

        });
        /*初始化菜单交互事件*/
        costBudgetManagerEventModal._materialShift(categorySel, categoryIpt);
        /*预选当前所在栏目*/
        var liActive = $('.supplierType.supplierDetail>li.active');
        var prevNum = liActive.prevAll('li').length;
        categorySel.find('ul>li').eq(prevNum + 1).click();
        addSupplierContent.appendTo($('.add-supplier-container'));
        addSupplierContent.find('.confirm').click(function (e) {
            common.stopPropagation(e);
            var item = $('.material-category').data('item');
            var data = {};
            var error = false;
            var caveat = "";
            var entpTypeName;
            var entpType;
            if (categoryIpt.find('input').val()) {
                entpTypeName = categoryIpt.find('input').val();
                entpType = '';
            } else {
                entpTypeName = categorySel.children('span').html();
                entpType = item.id;
            }
            var inputs = addSupplierContent.find('input[type=text]');
            for (var i = 1, length = inputs.length; i < length; i++) {
                var input = inputs[i];
                var name = $(input).attr('name');
                var value = $(input).val();
                if (name === 'phone' && value) {
                    if (!(/^1[34578]\d{9}$/.test(value))) {// 手机号检测
                        return alert('请输入正确电话号码');
                    }
                }
                if (!value) {
                    caveat = $(input).data('caveat');
                    error = true;
                    break;
                }
                data[name] = value;
            }
            if (error) {
                return alert('请输入' + caveat);
            }

            data.entpTypeName = entpTypeName;
            data.entpType = entpType;
            data.businessScope = addSupplierContent.find("textarea").val();
            data.taxType = addSupplierContent.find("[name=taxType]").val();
            if (!data.businessScope) {
                return alert('请输入经营范围');
            }
            if (!data.taxType || data.taxType === 'a') {
                return alert('请选择税务类型');
            }
            data.attachCount = attach.getAttaches().length;
            data.attachList = attach.getAttaches();
            request.post('/customer/enterpise/baseAll', {body: data}).then(function (res) {
                if (res.code === 1) {
                    addSupplierContent.remove();
                    that.getSupplierType();
                    setTimeout(function () {
                        $('.supplierType.supplierDetail').find('li').each(function (index, ele) {
                            if ($(ele).data('item').id === res.data.categoryId) {
                                $(ele).click();
                            }
                        })
                    }, 200)
                }
            });
        })

        $('.model-add-supplier').click(function (e) {
            common.stopPropagation(e);
            addSupplierContent.remove();
        })
        addSupplierContent.click(function (e) {
            common.stopPropagation(e);
        })
        addSupplierContent.find('.span-btn-bc').click(function (e) {
            common.stopPropagation(e);
            addSupplierContent.remove();
        })
    });
}

addSupplier.prototype.getSupplierType = function (type) {
    var parents = this.$supplierType;
    var that = this;
    request.get('/customer/enterpise/type').then(function (res) {
        var list = res.data ? res.data.data : [];
        renderSupplierType(list, parents, that, type);
    });
};
addSupplier.prototype.getSupplierList = function (data, cid, type) {
    var parents = this.$supplierName.html('');
    var that = this;
    request.get('/customer/enterpise/baseByType', {qs: data}).then(function (res) {
        var list = res.data ? res.data.data : [];
        renderSupplierList(list, parents, that, cid, type);
    });
};

/**
 *
 */
function initSupplierListEvent(parents, that, type) {
    parents.click(function (e) {
        common.stopPropagation(e);
    });
    parents.find('li').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        var item = $(this).data('item');
        if (type === 'bid') { // 在招标平台中
            var tbody = $('#bidInvitation');
            var order = tbody.find('tr').length;
            var dom = $('<tr class="small">' +
                '<td class="border">' + (order + 1) + '</td>' +
                '<td class="border">' + item.businessScope + '</td>' +
                '<td class="border">' + item.entpName + '</td>' +
                '<td class="border">' + item.contactName + '</td>' +
                '<td class="border">' + item.phone + '</td>' +
                '<td class="border">' + getTaxType(item.taxType) + '</td>' +
                '<td class="border"><a href="javascript:;" class="confirm-hover" data-type="check">查看</a></td>' +
                '<td class="border"><a href="javascript:;" class="delete-hover" data-type="del">删除</a></td>' +
                '</tr>');
            dom.data('item', item);
            var flag = true;
            tbody.find('tr').each(function(){
                if($(this).data('item').id === $(that).data('item').id){
                    flag = false;
                    return alert('已添加该供应商')
                }
            })
            if(flag){
                dom.appendTo(tbody);
                tbody.parents('table').show();
                $('.sup-count').html(order + 1);
            }
            bidEvent.initBidsInvitationEvent();
        } else {
            if (that.bindData) {
                that.bindData.data('item', item);
                that.$container.data('item', item);
                that.$container.text(item.entpName);
            } else {
                that.$container.data('item', item);
                that.$container.text(item.entpName);
            }
            that.bindData.find('.model-add-supplier').remove();
        }
    });
}

function getTaxType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '小规模';
        case 2:
            return '一般纳税人';
        case 3:
            return '个体';
    }
}

/**
 * 绘制 供应商类型
 * @param list
 * @param parents
 * @param that 点用方法的this
 */
function renderSupplierType(list, parents, that, type) {
    list = list || [];
    parents.html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<li id="p_' + item.id + '">\
      <i class="icon-disc-item"></i>\
      <span>' + item.entpTypeName + '</span>\
      <i class="tz-date"></i>\
      </li>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    that.initSupplierTypeClick(parents, type);
}

addSupplier.prototype.initSupplierTypeClick = function (parents, type) {
    var that = this;
    parents.find('li').click(function (e) {
        $(this).parents('.supplier-content').next().show();
        $(this).parents('.supplier-content').next().next().hide();
        common.stopPropagation(e);
        // $('.supplier-detail').show();
        // $('.supplier-noinfo').hide();
        // $(this).parent().next().show();
        var item = $(this).data('item');
        parents.find('>li').removeClass('active');
        $(this).addClass('active');
        var cid = $(this).data('cid');
        that.getSupplierList({entpType: item.id}, cid, type);
    });
};

function renderSupplierList(list, parents, that, cid, type) {
    parents.html('');
    parents.show();
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var dom = $('<li id="c_' + item.id + '">\
        <i class="icon-disc-item"></i>\
         <span class="supplier-content-num">' + (1 + i) + '</span>\
         <span class="supplier-content-name" style="padding-left: 5px;">' + item.entpName + '</span>\
        </li>');
            if (item.id === cid) {
                dom.addClass('active');
            }
            dom.data('item', item);
            dom.appendTo(parents);
        }
    } else {
        var dom = $('<div style="padding-top: 70px;" class="noInfo">' +
            '    <div class="icon-uninformed"></div>' +
            '    <p>没有符合条件的信息！</p>' +
            '</div>');
        dom.appendTo(parents);
    }

    initSupplierListEvent(parents, that, type);
}

module.exports = addSupplier;