var initEvent = require('./initEvent');
var projectInitEvent = require('../initEvent');
var ReviewImage = require('../../../components/ReviewImage');

/**
 * 合同汇总table
 * @param list
 */
exports.renderSumContractTable = function (list, page) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoContractSumTable_main').show();
        $('[name="noInfoContractSumTable_page"]').show();
        $('#noInfoContractSumTable').hide();
    } else {
        $('#noInfoContractSumTable_main').hide();
        $('[name="noInfoContractSumTable_page"]').hide();
        $('#noInfoContractSumTable').show();
    }
    var parents = $('#contractSumTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var oper;
        /* 驳回和保存情况下 操作内容是"详情" */
        if (item.cntrStatus === 1 || item.cntrStatus === 4) {
            oper = '<a class="confirm-hover" data-type="update">修改</a>' +
                '<div style="margin: 0 5px;" class="icon-line"></div>' +
                '<a class="delete-hover" data-type="delete">删除</a>';
        } else {
            oper = '<a class="confirm-hover" data-type="detail">详情</a>';
        }
        var associated;
        if(item.associated === 1){
            associated = '';
        } else {
            associated = '<i class="icon-associated"></i>';
        }
        var dom = $('<tr style="cursor: pointer " class="small trHeightLight-hover">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.cntrName + associated + '</td>\
                  <td class="border">' + item.cntrNo + '</td>\
                  <td class="border">' + item.addUserName + '</td>\
                  <td class="border">' + item.cntrChargeName + '</td>\
                  <td class="border">' + item.cntrParty + '</td>\
                  <td class="border">' + parseContractType(item.cntrType) + '</td>\
                  <td class="border">' + parseContractStatus(item.cntrStatus) + '</td>\
                  <td class="border">' + oper + '</td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initContractSumTableEvent(parents);
};
/**
 * 显示隐藏
 * @param obj
 */
exports.renderShowSumContractData = function (obj) {
    if (obj) {
        $('#contractShow').show();
        $('#contractHide').hide();
    } else {
        $('#contractShow').hide();
        $('#contractHide').show();
    }
};

function parseContractType(type) {
    type = parseInt(type);
    switch (type) {
        case 0:
            return '全部';
        case 1:
            return '总包合同';
        case 2:
            return '采购合同';
        case 3:
            return '分包合同';
        case 4:
            return '劳务合同';
        case 5:
            return '租赁合同';
        case 6:
            return '材料采购合同';
        case 7:
            return '加工运输合同';
    }
}

function parseContractStatus(status) {
    status = parseInt(status);
    switch (status) {
        case 0:
            return '全部';
        case 1:
            return '已保存';
        case 2:
            return '审批中';
        case 3:
            return '已确认';
        case 4:
            return '被驳回';
        case 7:
            return '被终止';
        case 11:
            return '已结算';
    }
    return '已结算'
}

/**
 * 搜索 select
 * @param list
 */
exports.renderSumContractSearchSelect = function (parents, list, type) {
    list = list || [];
    if (type === 'first') {
        $('<option value="a">请选择分部</option>').appendTo(parents);
    } else if (type === 'all') {
        $('<option value="0">全部</option>').appendTo(parents);
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.subProjName);
        dom.appendTo(parents);
    }
};
/**
 * 绘制供应商功能类型
 * @param parents
 * @param list
 */
exports.renderSupplierTypeModal = function (parents, list) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<li>\
                   <i class="icon-disc-item"></i>\
                   <span>' + item.entpTypeName + '</span>\
                   <i class="tz-date"></i>\
                  </li>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};
/**
 * 绘制供应商列表
 * @param parents
 * @param list
 */
exports.renderSupplierListModal = function (parents, list) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<li>\
                  <i class="icon-disc-item"></i>\
                  <span>' + item.entpName + '</span>\
                 </li>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};
/**
 * 合同详情上部
 * @param obj
 */
exports.renderContractDetail = function (obj) {
    var enterpBase = obj.enterpBase || {};
    $('.contractName').text(obj.cntrName);
    $('.contractNo').text(obj.cntrNo);
    $('.subProjName').text(obj.subProjName);
    $('.cntrChargeName').text(obj.addUserName);
    $('.contractType').text(parseContractType(obj.cntrType));
    $('.contract-person').text(enterpBase.entpName);
    $('.contract-name').text(enterpBase.contactName);
    $('.contractChargeName').text(obj.cntrChargeName);
    $('.contractPhone').text(enterpBase.phone);
    $('[name=cntrPrice]').html(obj.cntrPrice);//合同价款
    $("[name=taxTypePage][value=" + obj.taxType + "]").prop('checked', true);//是否含税
    var settlementType = obj.settlementType == 1 ? "固定总价" : "固定综合单价";
    $('[name=settlementType]').html(settlementType);//结算方式
    $('[name=cntrStartTime]').html(obj.cntrStartTime);//开始时间
    $('[name=cntrEndTime]').html(obj.cntrEndTime);//结束时间
    $('[name=cntrContent]').html(obj.cntrContent);//工作内容
    $('[name=payTypeDesc]').html(obj.payTypeDesc);//付款方式
    $('[name=ensurePer]').html(obj.ensurePer);//质保金
    $('[name=ensureMonth]').html(obj.ensureMonth);//质保期
    $('[name=otherDesc]').html(obj.otherDesc);//其他条款
    $('#cntrStatus').text(parseContractStatus(obj.cntrStatus));
    if (obj.cntrEndTime && obj.cntrStartTime) {
        var cntrEndTime = moment(obj.cntrEndTime).set('hour', 24).set('minute', 0).set('second', 0);
        var cntrStartTime = moment(obj.cntrStartTime).set('hour', 0).set('minute', 0).set('second', 0);
        $('#days').html(moment(cntrEndTime).diff(cntrStartTime, 'days'));
    }
    var $attach = obj.attaches || [];
    var previewAttach = $(".contract-attach-list").html("");
    var rank = 0;
    var urlList = [];
    for (var j = 0; j < $attach.length; j++) {
        var dom = renderAttachItem($attach[j],rank);
        if($attach[j].attachType === 'png' || $attach[j].attachType === 'jpg' || $attach[j].attachType === 'PNG' || $attach[j].attachType === 'JPG'){
            dom.find('.previewPic').data('url',$attach[j].attachUrl);
            dom.find('.previewPic').data('rank',rank++);
        }
        dom.data('data',$attach[j]);
        dom.appendTo(previewAttach);
    }
    previewAttach.find('.previewPic').click(function(e){
        urlList.length = 0;
        previewAttach.find('.previewPic').each(function(index,ele){
            urlList.push($(ele).data('url'));
        })
        var review = new ReviewImage(urlList, '', $(this).data('rank'));
        review.show();
    })
    $('#contractFormulation').data('item', obj);
    $('.cntrType').text(parseContractType(obj.cntrType));
    var cntrPrice = obj.cntrPrice ? obj.cntrPrice : 0;
    var budPrice = obj.budPrice ? obj.budPrice : 0;
    $('#budgetTotal').text(cntrPrice);
    $('#costTotal').text(budPrice);
    var total = 0;
    if (!isNaN(budPrice) && !isNaN(cntrPrice)) {
        total = cntrPrice - budPrice;
        total = parseInt(total*100)/100;
    }
    $('#windControl').text(total);
    var user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '/login';
        return false;
    }
    user = JSON.parse(user).employee || {};
    if (obj.cntrChargeNo === user.userNo || obj.addUserNo === user.userNo) {
        $('.submitApproval').show();
        $('#contractFormulation').show();
    }
    if (obj.cntrStatus >= 3 && obj.cntrStatus !== 4) {
        $('#stopContract').show();
    }
    initEvent.initContractContentDetailEvent();
};
exports.renderContractModalDetail = function (obj, modal) {
    var cntrPrice = obj.cntrPrice ? obj.cntrPrice : 0;
    var budPrice = obj.budPrice ? obj.budPrice : 0;
    modal.$body.find('.cntrPrice').text(cntrPrice + '元');
    modal.$body.find('.budPrice').text(budPrice + '元');
    var total = 0;
    if (!isNaN(budPrice) && !isNaN(cntrPrice)) {
        total = cntrPrice - budPrice;
        total = parseInt(total*100)/100;
    }
    modal.$body.find('.windControl').text(total + '元');
};

function renderAttachItem(item, rank) {
    var type = item.attachType === "pdf" || item.attachType === "PDF"
    || item.attachType === 'xls' || item.attachType === "XLS"
    || item.attachType === 'ppt' || item.attachType === "PPT"
    || item.attachType === 'pptx' || item.attachType === "PPTX"
    || item.attachType === 'gbq' || item.attachType === "GBQ"
    || item.attachType === 'gbq5' || item.attachType === "GBQ5"
    || item.attachType === 'gtb4' || item.attachType === "GTB4"
    || item.attachType === 'xlsx' || item.attachType === "XLSX"
    || item.attachType === 'png' || item.attachType === "PNG"
    || item.attachType === 'zip' || item.attachType === "ZIP"
    || item.attachType === 'rar' || item.attachType === "RAR"
    || item.attachType === 'cad' || item.attachType === "CAD"
    || item.attachType === 'dwg' || item.attachType === "DWG"
    || item.attachType === 'txt' || item.attachType === "TXT"
    || item.attachType === 'video' || item.attachType === "VIDEO"
    || item.attachType === 'jpeg' || item.attachType === "JPEG"
    || item.attachType === 'jpg' || item.attachType === "JPG"
    || item.attachType === 'docx' || item.attachType === "DOCX"
    || item.attachType === 'doc' || item.attachType === "DOC"
        ? item.attachType : 'none';
    var preview = '';
    if (item.attachType === 'pdf' || item.attachType === 'txt'
        || item.attachType === 'PDF' || item.attachType === 'TXT') {
        preview = '<a style="margin-left: 10px;" href=' + window.API_PATH + "/customer" + item.attachUrl + ' target="_blank">预览</a>';
    } else if (item.attachType === 'png' || item.attachType === 'jpg' || item.attachType === 'jpeg'
        || item.attachType === 'PNG' || item.attachType === 'JPG' || item.attachType === 'JPEG') {
        preview = '<a class="previewPic" style="margin-left: 10px;" href="javascript:;">预览</a>';
    }
    return $("<div class='attach-item'>\
                    <div class='icon-file " + type + "'></div>\
                    <div class='detail'>\
                     <div class='filename'>" + item.attachName + "</div>\
                     <div class='remove'>\
                      <a href='" + window.API_PATH + "/customer/attach/download?filePath=" + item.attachUrl + "'>下载</a>\
                      " + preview + "\
                     </div>\
                    </div>\
                   </div>");
}

/**
 * 合同价款 详情
 * @param obj
 */
exports.renderContractDetailContent = function (obj) {

};
/**
 * 绘制核算列表
 * @param list
 */
exports.renderContractBillTable = function (list) {
    list = list || [];
    if (list.length > 0) {
        $('#noInfoBillContractTable_main').show();
        $('[name="noInfoBillContractTable_page"]').show();
        $('#noInfoBillContractTable').hide();
    } else {
        $('#noInfoBillContractTable_main').hide();
        $('[name="noInfoBillContractTable_page"]').hide();
        $('#noInfoBillContractTable').show();
    }
    var parents = $('#billContractTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var price = item.budPrice;
        if (typeof price !== 'number') {
            if (isNaN(price)) {
                price = 0;
            } else {
                price = parseInt(price);
            }
        }
        var budCount = item.budQpy;
        if (typeof budCount !== 'number') {
            if (isNaN(budCount)) {
                budCount = 0;
            } else {
                budCount = parseInt(budCount);
            }
        }
        var name = item.laborName || item.subletName || item.measureName;
        var type = item.laborTypeName || item.subletTypeName || item.measureTypeName
        var totalPrice = (price * budCount).toFixed(2);
        var lastQpy = item.lastQpy || item.lastQpy === 0 ? item.lastQpy : '预算外';
        var dom = $('<tr class="small trHeightLight-hover">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + type + '</td>\
                  <td class="border">' + name + '</td>\
                  <td class="border">' + item.workContent + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.budQpy + '</td>\
                  <td class="border">' + item.budPrice + '</td>\
                  <td class="border">' + totalPrice + '</td>\
                  <td class="border">' + lastQpy + '</td>\
                  <td class="border" style="position: relative;width: 100px;">\
                   <a class="confirm-hover" data-type="quantity">已用量</a>\
                   <div class="icon-line"></div>\
                   <a class="confirm-hover" data-type="budget">预算量</a>\
                  </td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};
exports.renderContractBillTableData = function (obj) {
    // if (obj) {
    //   $('#contractResourceShow').show();
    //   $('#contractResourceHide').hide();
    // } else {
    //   $('#contractResourceShow').hide();
    //   $('#contractResourceHide').show();
    // }
};
/**
 * 绘制预算添加的modal
 * @param list
 * @param modal
 * @param $list
 */
exports.renderContractBudgetModal = function (list, modal, $list) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var type = item.laborTypeName || item.measureTypeName || item.subletTypeName;
        var name = item.mtrlName || item.laborName || item.measureName || item.subletName;
        var workContent = item.workContent || item.specBrand;
        var lastQpy = item.lastQpy || item.lastQpy === 0 ? item.lastQpy : item.lastBudQpy;
        // var lastQpy = item.lastQpy || '预算外';
        var dom = $('<tr class="small">\
      <td class="border"><input type="checkbox"></td>\
      <td class="border">' + type + '</td>\
      <td class="border">' + name + '</td>\
      <td class="border">' + workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + item.budPrice + '</td>\
      <td class="border">' + lastQpy + '</td>\
      </tr>');
        var id = item.laborId || item.measureId || item.subletId;
        var workType = '';
        if (item.laborId) {
            workType = 3;
        } else if (item.measureId) {
            workType = 4;
        } else if (item.subletId) {
            workType = 5;
        }
        for (var j = 0, $lenght = $list.length; j < $lenght; j++) {
            if (id === $list[j].workId && workType === $list[j].workType) {
                dom.find('[type=checkbox]').prop('checked', true);
            }
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initBudgetModalTbodyEvent(modal);
};
/**
 * 绘制核算用量
 * @param list
 * @param modal
 */
exports.renderContractChildTable = function (list, modal) {
    list = list || [];
    var parents = modal.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.cntrName + '</td>\
                  <td class="border">' + item.cntrNo + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.totalQpy + '</td>\
                  <td class="border">' + item.cntrPrice + '</td>\
                 </tr>');
        dom.appendTo(parents);
    }
};

/**
 * 绘制添加项的内容
 * @param parents
 * @param list
 * @param type old 已经保存的  new1 企业库过来的  new2 预算过来的数据
 */
exports.renderAddItemTbodyModal = function (parents, list, type) {
    list = list || [];
    var total = 0;
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var typeName = item.mtrlTypeName || item.laborTypeName || item.measureTypeName || item.subletTypeName || item.workRealType;
        var Name = item.mtrlName || item.laborName || item.subletName || item.measureName || item.workName;
        // var price = item.budPrice || item.budPrice === 0 ? item.budPrice : item.avgPrice || 0;
        var price = item.budPrice || item.budPrice === 0 ? item.budPrice : "预算外";
        var cntrQpy = item.cntrQpy || 0;
        var adjustPrice = item.adjustPrice ? item.adjustPrice : item.cntrPrice || 0;
        var cntrMoney = item.cntrMoney || 0;
        var id = type === 'old' ? 'v_' + item.id : '';
        if (!item.$type) {
            item.$type = type;
        }
        var dom = $('<tr class="small ' + item.$type + '" id="' + id + '">\
      <td class="border"><input type="checkbox"></td>\
      <td class="border">' + typeName + '</td>\
      <td class="border">' + Name + '</td>\
      <td class="border">' + item.workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + price + '</td>\
      <td class="border"><input type="text" placeholder="填写" name="cntrQpy" data-warn="单位用量" style="width: 80px" value="' + cntrQpy + '"/></td>\
      <td class="border"><input type="text" placeholder="填写" name="adjustPrice" data-warn="单价调整" style="width: 60px" value="' + adjustPrice + '"/></td>\
      <td class="border"><input type="text" placeholder="填写" disabled="true" name="cntrMoney" data-warn="单价" style="width: 80px" value="' + cntrMoney + '"/></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
        total += parseInt(cntrMoney)
    }
    $('#updateAddItem [name=cntrPrice]').val(total.toFixed(2));
    initEvent.initCheckboxEvent(parents);
};
/**
 * 绘制合同总价table 列表
 */
exports.renderContractSubItemModal = function (modal, list) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = i + 1;
        var excpCount = '无';
        if (item.excpCount && item.excpCount > 0) {
            excpCount = '<div class="exceptionModal" style="cursor:pointer;color:#de6d0b">' + item.excpCount + '</div>';
        }
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.workName + '</td>\
      <td class="border">' + item.workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + item.cntrQpy + '</td>\
      <td class="border">' + item.cntrPrice + '</td>\
      <td class="border">' + item.totalMoney + '</td>\
      <td class="border" style="position: relative">\
      <a data-type="edit" class="edit-a">编辑</a>\
      <div class="icon-line"></div>\
      <a data-type="delete" class="delete-a">删除</a>\
      </td>\
      <td class="border">' + excpCount + '</td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initContractTotalSumTableModalEvent(parents, modal);
    // initEvent.initContractDetailTableEvent(parents);
};

/**
 * 保留两位小数
 * @param {Number} num 需要处理为只保留两位的数字
 */
function reserveTwoDecimals (num){
    if(isNaN(num*1)){
        return null; // 非数字返回null
    } else {
        return parseInt(num*100)/100;
    }
}
/**
 *  绘制核算清单table
 * @param list
 */
exports.renderContractDetailTableBlance = function (list) {
    list = list || [];
    var parents = $('#contractDetailTable').html('');
    for (var i = 0; i < list.length; i++) {
        if (list[i].baseType === 1) {
            var item = list[i];
            var count = i + 1;
            var total = parseFloat(item.cntrQpy) * parseFloat(item.cntrPrice);
            total = total ? total : 0;
            var excpCount = '无';
            if (item.excpCount && item.excpCount > 0) {
                excpCount = '<div class="exceptionModal" style="cursor:pointer;color:#de6d0b">' + item.excpCount + '</div>';
            }
            var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.workName + '</td>\
      <td class="border">' + item.workContent + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + reserveTwoDecimals(item.cntrQpy) + '</td>\
      <td class="border">' + reserveTwoDecimals(item.cntrPrice) + '</td>\
      <td class="border">' + reserveTwoDecimals(total)+ '</td>\
      <td class="border"><a class="confirm-hover">查看</a></td>\
      <td class="border">' + excpCount + '</td>\
      </tr>');
            dom.data('item', item);
            dom.appendTo(parents);
        }
    }
    initEvent.initContractDetailTableEvent(parents);
};

/**
 * 绘制分部dom
 * @param list
 * @param modal
 * @param subProjId 已经存在的id
 */
exports.renderSelectMaterialModal = function (list, modal, subProjId) {
    list = list || [];
    var parents = modal.$body.find('.subProject').html('');
    $('<option value="a">请输入</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.text(item.subProjName);
        if (item.id === subProjId) {
            dom.attr('selected', true);
        }
        dom.appendTo(parents);
    }
    if (subProjId) {
        parents.attr('disabled', true);
    }
};

/**
 * 绘制预算内材料分类
 * @param modal
 * @param list
 */
exports.renderContractSelectMaterialModalSelectType = function (modal, list) {
    var materialType1 = modal.$body.find('.materialType1').html('');
    list = list || [];
    $('<option value="0">全部</option>').appendTo(materialType1);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.val(item.id);
        dom.data('item', item.children);
        dom.text(item.mtrlCategoryName);
        dom.appendTo(materialType1);
    }
};


exports.renderMaterialContractAccounting = function (list, parents, type) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var lastQpy;
        var budPrice;
        if (item.resourceType == 1) {
            lastQpy = item.lastBudQpy;
            budPrice = item.budPrice;
        } else if (item.resourceType == 2) {
            lastQpy = '预算外';
            budPrice = '预算外';
        }
        var dom = $('<tr class="small ' + type + '">\
                  <td class="border count">' + count + '</td>\
                  <td class="border">' + item.mtrlTypeName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                   <td class="border"><input type="text" placeholder="填写" name="cntrQpy" data-warn="请输入数量" value=' + item.cntrQpy + '></td>\
                  <td class="border"><input type="text" placeholder="填写" name="cntrPrice" data-warn="请输入单价" value=' + item.cntrPrice + '></td>\
                  <td class="border">' + lastQpy + '</td>\
                  <td class="border">' + budPrice + '</td>\
                  <td class="border">\
                   <a data-type="add" class="confirm-hover">添加说明</a>\
                   <div class="icon-line"></div>\
                   <a data-type="delete" class="delete-hover">删除</a>\
                 </td>\
                </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initMaterialContractAccountingTableEvent(parents);
};

exports.renderMaterialContractAccountintItem = function (item, parents, type) {
    var lastQpy;
    var budPrice;
    if (item.resourceType == 1) {
        lastQpy = item.lastBudQpy;
        budPrice = item.budPrice;
    } else if (item.resourceType == 2) {
        lastQpy = '预算外';
        budPrice = '预算外';
    }
    var dom = $('<tr class="small ' + type + '">\
                  <td class="border count">' + item.count + '</td>\
                  <td class="border">' + item.mtrlTypeName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border"><input type="text" placeholder="填写" name="cntrQpy" data-warn="请输入数量"></td>\
                  <td class="border"><input type="text" placeholder="填写" name="cntrPrice" data-warn="请输入单价"></td>\
                  <td class="border">' + lastQpy + '</td>\
                  <td class="border">' + budPrice + '</td>\
                  <td class="border">\
                   <a data-type="add" class="confirm-hover">添加说明</a>\
                   <div class="icon-line"></div>\
                   <a data-type="delete" class="delete-hover">删除</a>\
                 </td>\
                </tr>');
    dom.data('item', item);
    dom.appendTo(parents);
};
/**
 * 绘制材料合同清单
 * @param list
 */
exports.renderMaterialDetailContractAccounting = function (list) {
    list = list || [];
    var parents = $('#contractDetailTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var excpCount = '无';
        // if (item.excpCount && item.excpCount > 0) {
        //   excpCount = '<div class="exceptionModal" style="cursor:pointer">' + item.excpCount + '</div>';
        // }
        if (item.excptPriceId || item.excptQpyId) {
            excpCount = '<div class="exceptionModal" style="cursor:pointer;color: #de6d0b">1</div>';
        }
        if (item.excptPriceId && item.excptQpyId) {
            excpCount = '<div class="exceptionModal" style="cursor:pointer;color: #de6d0b">2</div>';
        }
        var remark = item.remark || '';
        var dom = $('<tr class="small">\
                  <td class="border">' + count + '</td>\
                  <td class="border">' + item.mtrlTypeName + '</td>\
                  <td class="border">' + item.mtrlName + '</td>\
                  <td class="border">' + item.specBrand + '</td>\
                  <td class="border">' + item.unit + '</td>\
                  <td class="border">' + item.cntrQpy + '</td>\
                  <td class="border">' + item.cntrPrice + '</td>\
                  <td class="border">' + reserveTwoDecimals(item.cntrMoney) + '</td>\
                  <td class="border">' + remark + '</td>\
                  <td class="border">' + excpCount + '</td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initContractDetailTableEvent(parents);
};

/*保留两位小数*/
function reserveTwoDecimals(num) {
    if(num && num != 0){
        return parseInt(num*100)/100;
    } else {
        return num;
    }
}

exports.renderContractItemData = function (item, modal) {
    modal.$body.find('.workContent').html(item.workContent);
    modal.$body.find('.calcRule').text(item.calcRule);
    modal.$body.find('.remark').text(item.remark);
    modal.$body.find('.workName').html(item.workName);
    modal.$body.find('.unit').html(item.unit);
    modal.$body.find('[name=cntrQpy]').val(item.cntrQpy);
    modal.$body.find('[name=settleQpyW]').val(item.settleQpy);
    modal.$body.find('[name=cntrPrice]').val(item.cntrPrice);
    modal.$body.find('[name=settleTotalQpy]').val(item.settlePrice);
};

exports.renderContractTotalPriceData = function (obj, modal) {
    modal.$body.find('[name=workName]').val(obj.workName);
    modal.$body.find('[name=workContent]').val(obj.workContent);
    modal.$body.find('[name=unit]').val(obj.unit);
    modal.$body.find('#updateAddItem [name=cntrQpy]').val(obj.cntrQpy);
    modal.$body.find('[name=cntrPrice]').val(obj.cntrPrice);
    modal.$body.find('.addDes').data('item', {calcRule: obj.calcRule, remark: obj.remark})
    modal.$body.find('.confirm').data('id', obj.id);
};



