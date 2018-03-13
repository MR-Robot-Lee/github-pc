var initEvent = require('./initEvent');
var systemFunc = require('./systemFunc');
exports.renderNavListDom = function (list) {
    list = list || [];
    var parents = $('#enterpriseNav').html('');
    var childParents = $('<ul class="nav-content" style="padding: 0"></ul>');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.pId === 0) {
            $('<a class="system ellipsis" style="height: 38px;line-height: 38px;padding-left: 50px;cursor: pointer">\
    <span class="arrow"></span>' + item.deptName + '\
    </a>').appendTo(parents);
            parents.data('item', item);
        } else {
            var dom = $('<li id="' + item.id + '" draggable=true style="border:none;cursor: pointer;">\
      <a class="system ellipsis" style="height: 38px;line-height: 38px;padding-left: 50px;cursor: pointer">' + item.deptName + '</a>\
      </li>');
            dom.data('item', item);
            dom.appendTo(childParents);
        }
    }
    childParents.appendTo(parents);
    initEvent.initOrganizationStructureNavEvent(childParents, parents);
};

exports.renderEmployeeTable = function (list) {
    list = list || [];
    var parents = $('#organizationTable').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var sex = item.sex === 1 ? '男' : '女';
        var type = item.status === 1 ? '停用' : '启用';
        var dom = $('<tr id="' + item.id + '">\
                  <td><input type="checkbox"></td>\
                  <td>' + item.userName + '</td>\
                  <td>' + sex + '</td>\
                  <td>' + item.deptName + '</td>\
                  <td>' + item.postName + '</td>\
                  <td>' + item.age + '</td>\
                  <td>' + item.mobile + '</td>\
                  <td>\
                   <a class="confirm-hover" data-type="edit">编辑</a>\
                   <div class="icon-line"></div>\
                   <a class="delete-hover" data-type="stop">' + type + '</a>\
                  </td>\
                 </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }

    initEvent.initOrganizationStructureTableEvent(parents);
};


exports.renderCompanyInfoDom = function (obj) {
    $('[name=etpNo]').val(obj.companyNo);
    $('[name=etpName]').val(obj.etpName);
    $('[name=entpType]').val(obj.entpType);
    $('[name=etpTel]').val(obj.etpTel);
    if (obj.etpLogo) {
        $('[name=etpLogo]').attr('src', obj.etpLogo);
    } else {
        $('.etpLogo').show();
    }
    $('[name=entpType]').val(obj.etpType);
    $('[name=etpEmail]').val(obj.etpEmail);
    $('[name=etpAddr]').val(obj.etpAddr);
    $('[name=etpNetAddr]').val(obj.etpNetAddr);
    $('[name=etpProvince]').val(obj.provinceId);
    $('[name=etpProvince]').change();
    $('[name=etpCity]').val(obj.cityId);
    $('input[name=etpPerLevel]').prop('checked', false);
    var etpPerLevel = obj.etpPerLevel.split(';');
    for (var i = 0; i < etpPerLevel.length; i++) {
        $('input[name=etpPerLevel][value=' + etpPerLevel[i] + ']').prop('checked', true);
    }
    // systemFunc.getCompanyQualityFunc(obj.etpPerLevel)
};

exports.renderCompanyContractDom = function (obj) {
    $('[name=userName]').val(obj.userName);
    $('[name=sex][value=' + obj.sex + ']').prop('checked', true);
    $('[name=duty]').val(obj.duty);
    $('[name=mobilephone]').val(obj.mobilephone);
    $('[name=email]').val(obj.email);
};

exports.renderCompanyBillboardUpdate = function (obj) {
    var parents = $('#imagesList');
    var uid = uuid();
    var dom = $('<div class="itemList item v-' + uid + '" style="width:240px; height: 250px;border: 2px solid #ddd;margin-bottom: 10px;\
  box-shadow: 0 0 3px 1px #ececec;float:left;margin-left:20px;">\
    <img src="" style="width:236px; height: 180px;" />\
    <div style="height: 70px;line-height: 70px;text-align: center">\
    <a style="cursor: pointer" class="delete">删除</a>\
    </div>\
    </div>');
    obj.id = uid;
    dom.data('id', obj);
    dom.find('img').attr('src', window.API_PATH + "/customer" + obj.attachUrl);
    dom.appendTo(parents);
    initEvent.initSingleBillboardEvent(dom);
};


exports.renderCompanyBillboardUpdateList = function (list) {
    list = list || {};
    var parents = $('#imagesList').html('');
    $('<div style="width:240px;text-align: center;\
   height: 180px;border: 1px dashed #ddd;\
   position:relative;cursor: pointer;float:left;margin-left: 20px">\
    <div class="icon-add-setting" style="z-index: 1"></div>\
    <input type="file" style="width:240px;left:0; height: 180px;opacity:0;cursor: pointer;position: absolute;z-index: 2" id="uploadImage">\
    </div>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var obj = list[i];
        var dom = $('<div class="itemList v-' + obj.id + '" style="width:240px; height: 250px;margin-bottom: 10px;\
    border: 2px solid #ddd;box-shadow: 0 0 3px 1px #ececec;float:left;margin-left: 20px;">\
    <img src="" style="width:236px; height: 180px;" />\
    <div style="height: 70px;line-height: 70px;text-align: center">\
    <a style="cursor: pointer" class="uploadChange">重新上传</a>\
    <input type="file" style="width: 0;height: 0;">\
    <div class="icon-line"></div>\
    <a style="cursor: pointer" class="delete">删除</a>\
    </div>\
    </div>');
        dom.data('id', obj);
        dom.find('img').attr('src', window.API_PATH + '/customer' + obj.url);
        dom.appendTo(parents);
    }
    initEvent.initCompanyBillboardUpdate(parents);
};

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


exports.renderStopUseReasonTable = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('tbody').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var handler = item.operateType === 1 ? '启用' : '停用';
        var dom = $('<tr class="small">\
      <td>' + handler + '</td>\
      <td>' + item.operateUserName + '</td>\
      <td>' + moment(item.operateTime).format('YYYY/MM/DD HH:mm:ss') + '</td>\
      <td>' + item.reason + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};


exports.renderProjectJobTable = function (list) {
    list = list || [];
    var parents = $('#projectJobTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<tr>\
      <td style="padding-left: 20px;width: 150px;">' + item.posName + '</td>\
      <td>' + item.describes + '</td>\
      <td>\
      <a class="confirm-hover" data-type="edit">编辑</a>\
      <div class="icon-line"></div>\
      <a class="delete-hover" data-type="delete">删除</a>\
      </td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initProjectJobTableEvent(parents);
};
exports.renderProjectJobSelect = function (list, modal, jobId) {
    list = list || [];
    var parents = modal.$body.find('[name=posName]').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');


        if (item.postId != '50') {
            dom.text(item.postName);
            dom.val(item.postId);
            if (jobId && jobId.id === item.postId) {
                dom.attr('selected', true);
            }
            dom.appendTo(parents);
        }
    }
};

exports.renderDepartmentSelect = function (list, modal, deptId) {
    list = list || [];
    var parents = modal.$body.find('[name=deptName]').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.deptName);
        dom.val(item.id);
        if (deptId && deptId.id === item.id) {
            dom.attr('selected', true);
        }
        dom.appendTo(parents);
    }
};
exports.renderRoleResourceTable = function (list) {
    list = list || [];
    var parents = $('#addRoleTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr>\
      <td style="padding-left: 20px;">' + count + '</td>\
      <td>' + item.moduleName + '</td>\
      <td>' + item.pName + '</td>\
      <td><label><input type="checkbox">' + item.resourceName + '</label></td>\
      <td>' + item.resourceDesc + '</td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    //选择全部权限
    $('#addRoleTable input').click(function () {
        var allChoose = true;
        $('#addRoleTable input').each(function () {
            if ($(this).prop('checked') == false) {
                allChoose = false;
            }
        })
        $('#getAllRole').prop('checked', allChoose);
    })
    $('#getAllRole').click(function () {
        var allRole = $(this).prop('checked');
        $('#addRoleTable input').prop('checked', allRole);

    })
};

exports.renderCompanyLogo = function (obj) {
    $('[name=etpLogo]').attr('src', window.API_PATH + '/customer' + obj.attachUrl);
    $('.etpLogo').hide();
};

exports.renderEmployeeRoleTable = function (list) {
    list = list || [];
    var parents = $('#roleEmployeeTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<tr>\
      <td style="padding-left: 20px;">' + item.postName + '</td>\
      <td>' + item.count + '</td>\
      <td>' + item.employees + '</td>\
      <td>\
      <a class="confirm-hover" data-type="add">添加人员</a>\
      <div class="icon-line"></div>\
      <a class="confirm-hover edit" data-type="edit">编辑</a>\
      <div class="icon-line"></div>\
      <a class="delete-hover" data-type="delete">删除</a>\
      </td>\
      </tr>');
        dom.data('item', item);
        if (item.sysType === 2) {
            dom.find('.delete-hover').hide();
            dom.find('.edit').hide();
            dom.find('.icon-line').hide();
        }
        dom.appendTo(parents);
    }
    initEvent.initEmployeeRoleTableEvent(parents);
};

exports.renderAddRoleTable = function (obj) {
    $('[name=postName]').val(obj.posName);
    $('[name=describes]').val(obj.posRemark);
    $('.confirm').data('id', obj.postId);
    var resources = obj.resources;
    var trs = $('#addRoleTable tr');
    for (var j = 0; j < resources.length; j++) {
        if (resources[j].isAuth) {
            var tr = $(trs[j]);
            tr.find('input[type=checkbox]').prop('checked', true);
        }
    }
};
/**
 * 采购方案的绘制
 * @param list
 */
exports.renderPurchaseAccountInfo = function (list) {
    list = list || [];
    var parents = $('#purchaseList').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = '';
        if (i === 0) {
            dom = $('<tr class="small">\
        <td class="border">' + item.accCount + '</td>\
        <td class="border">' + item.price + '</td>\
        <td class="border" rowspan="' + list.length + '"><div style="margin-top:10px;">存储:500MB/人/年</div><br>\
        <div>免费:提供一对一系统搭建咨询服务</div><br><div>免费:参加系统管理员培训课程</div><br><div>免费:提供企业库设计咨询服务</div><br>\
        <div style="margin-bottom:10px;">免费:成功注册后提供3天免费试用期</div></td>\
        </tr>')
        } else {
            dom = $('<tr class="small">\
        <td class="border">' + item.accCount + '</td>\
        <td class="border">' + item.price + '</td>\
        </tr>');
        }
        dom.appendTo(parents);
    }
    if (list.length > 0) {
        $('<tr class="small">\
        <td class="border">不限</td>\
        <td class="border">/</td>\
        <td class="border">电话:029-68255806</td>\
        </tr>').appendTo(parents);
    }
};

/**
 * 绘制账户信息
 * @param obj
 */
exports.renderAccountCompanyInfo = function (obj) {
    var day = obj.limitTime ? moment(obj.limitTime).diff(moment(), 'd') : 0;
    $('[name=etpName]').text(obj.etpName);
    $('[name=companyNo]').text(obj.companyNo);
    obj.maxAccCount ? $('[name=maxAccCount]').text(obj.maxAccCount) : $('[name=maxAccCount]').text('无');
    var limitTime = obj.limitTime ? moment(obj.limitTime).format('YYYY/MM/DD') : 0;
    $('[name=limitTime]').text(limitTime);
    day = day > 0 ? day : 0;
    $('[name=day]').text(day);
    var useSize = obj.attachSize || 0;
    var totalSize = obj.allowSize || 0;
    var pre = useSize / totalSize;
    !isNaN(pre) ? pre = pre * 100 : 0;
    $('.span-default').css('width', pre + '%');
    var useGB = useSize / (1024 * 1024 * 1024);
    var totalGB = totalSize / (1024 * 1024 * 1024);
    useGB = useGB ? useGB.toFixed(5) : 0;
    var last = totalGB - useGB;
    $('[name=allowSize]').text('(共' + totalGB + 'GB,已用' + useGB + 'GB,可用' + last.toFixed(5) + 'GB)');
    $('[name=count]').text(10);
    $('[name=limit]').text('一年');
    $('[name=money]').text(10 * 499);
};


exports.renderOrderListTable = function (list) {
    list = list || [];
    var parents = $('#orderList').html('');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var count = i + 1;
        var checked = '';
        var overed = '';
        if (item.invoiceStatus === 2) {
            checked = 'checked';
        }
        if (item.invoiceStatus === 3) {
            overed = 'checked';
            checked = 'checked';
        }
        var payMoney = item.prepayMoney - item.reduceMoney;
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.orderNo + '</td>\
      <td class="border">' + parseOrderType(item.orderType) + '</td>\
      <td class="border">' + item.acctCount + '</td>\
      <td class="border">' + item.acctYears + '</td>\
      <td class="border">' + item.storageSize + '</td>\
      <td class="border">' + payMoney + '</td>\
      <td class="border">' + parseOrderStatus(item.orderStatus) + '</td>\
      <td class="border"><input type="checkbox" class="apply ' + checked + '" ' + checked + '></td>\
      <td class="border"><input type="checkbox" class="open ' + overed + '"' + overed + '></td>\
      <td class="border">\
      <a data-type="pay">付款</a>\
      <div class="icon-line"></div>\
      <a data-type="delete">删除</a>\
      <div class="icon-line"></div>\
      <a data-type="detail">详情</a>\
      </td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initOrderTableEvent(parents);
};

function parseOrderType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '购买';
        case 2:
            return '续费';
        case 3:
            return '追加';
        case 4:
            return '购买存储 ';
    }
}

function parseOrderStatus(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '已下单';
        case 2:
            return '已付款';
        case 3:
            return '已成交';
    }
}


exports.renderPayOrderObj = function (modal, obj) {
    var order = obj.order || {};
    var account = obj.account || {};
    var payMoney = order.prepayMoney - order.reduceMoney;
    modal.$body.find('[name=acctName]').text(account.acctName);
    modal.$body.find('[name=openBank]').text(account.openBank);
    modal.$body.find('[name=bankNo]').text(account.bankNo);
    modal.$body.find('[name=contactName]').text(account.contactName);
    modal.$body.find('[name=mobile]').text(account.mobile);
    modal.$body.find('[name=orderNo]').text(order.orderNo);
    modal.$body.find('[name=etpName]').text(order.etpName);
    modal.$body.find('[name=mobilephone]').text(order.mobile);
    modal.$body.find('[name=etpTel]').text(order.etpTel);
    modal.$body.find('[name=payBankMoney]').text(payMoney);
    modal.$body.find('[name=userName]').text(order.userName);
    modal.$body.find('[name=payType][value=' + order.payType + ']').prop('checked', true);
    modal.$body.find('[name=payName]').val(order.payName);
    var payBankMoney = order.prepayMoney - order.reduceMoney;
    modal.$body.find('[name=payBankMoney]').val(payBankMoney);
    modal.$body.find('[name=payBankNo]').val(order.payBankNo);
    if (order.orderStatus === 3) {
        modal.$body.find('.confirm').hide();
        modal.$body.find('[name=payName]').prop('disabled', true);
        modal.$body.find('[name=payBankMoney]').prop('disabled', true);
        modal.$body.find('[name=payBankNo]').prop('disabled', true);
        modal.$body.find('[name=payType]').prop('checked', true);
    }
};

/**
 *
 */
exports.initDetailModalData = function () {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('[name=etpName]').text(item.etpName);
    modal.$body.find('[name=orderType]').text(parseOrderType(item.orderType));
    modal.$body.find('[name=orderTime]').text(item.orderTime);
    modal.$body.find('[name=orderNo]').text(item.orderNo);
    modal.$body.find('[name=acctCount]').text(item.acctCount);
    modal.$body.find('[name=acctYears]').text(item.acctYears);
    modal.$body.find('[name=storageSize]').text(item.storageSize);
    modal.$body.find('[name=prepayMoney]').text(item.prepayMoney || 0);
    modal.$body.find('[name=reduceMoney]').text(item.reduceMoney || 0);
    modal.$body.find('[name=orderStatus]').text(parseOrderStatus(item.orderStatus));
    modal.$body.find('[name=payType]').text(payType(item.payType));
    modal.$body.find('[name=payMoney]').text(item.payMoney || 0);
};

function payType(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '银行支付';
        case 2:
            return '其它';
        default:
            return '未支付';
    }
}


exports.renderCompanyQuality = function (list, id) {
    list = list || [];
    var parents = $('[name=etpPerLevel]').html('');
    $('<option value="a">请输入</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.levelName);
        dom.val(item.id);
        dom.appendTo(parents);
        if (id == item.id) {
            dom.attr('selected', true);
        }
    }
};
/**
 * 发票信息
 * @param obj
 * @param modal
 * @param pItem
 */
exports.renderOrderInvocceInfo = function (obj, modal, pItem) {
    modal.$body.find('.confirm').hide();
    modal.$body.find('[name=invoiceTitle]').val(obj.invoiceTitle);
    modal.$body.find('[name=invoiceTitle]').attr('disabled', true);
    modal.$body.find('[name=entpAddress]').val(obj.entpAddress);
    modal.$body.find('[name=entpAddress]').attr('disabled', true);
    modal.$body.find('[name=mobile]').val(obj.mobile);
    modal.$body.find('[name=mobile]').attr('disabled', true);
    modal.$body.find('[name=taxNo]').val(obj.taxNo);
    modal.$body.find('[name=taxNo]').attr('disabled', true);
    modal.$body.find('[name=contactName]').val(obj.contactName);
    modal.$body.find('[name=contactName]').attr('disabled', true);
    modal.$body.find('[name=expressAddress]').val(obj.expressAddress);
    modal.$body.find('[name=expressAddress]').attr('disabled', true);
    modal.$body.find('[name=otherRemark]').val(obj.otherRemark);
    modal.$body.find('[name=otherRemark]').attr('disabled', true);
    modal.$body.find('[name=invoiceCode]').val(obj.invoiceCode);
    modal.$body.find('[name=taxMoney]').val(obj.taxMoney);
    modal.$body.find('[name=expressNo]').val(obj.expressNo);
};