var modalEventHandler = require('./modal/modalEventHandler')

exports.renderMaterialHistoryTable = function (list) {
    list = list || [];
    var parents = $('#materialHistory').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var taxPrice = item.prchPrice;
        var isTax = item.prchTaxType == 1 ? 'checked' : '';//判断是否含税
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.projShortTitle + '</td>\
      <td class="border">' + item.subProjName + '</td>\
      <td class="border">' + moment(item.prchTime).format('YYYY/MM/DD') + '</td>\
      <td class="border">' + item.prchUserName + '</td>\
      <td class="border">' + item.prchCount + '</td>\
      <td class="border">' + taxPrice + '</td>\
      <td class="border"><input type="checkbox" disabled ' + isTax + '></td>\
      <td class="border">' + item.entprName + '</td>\
      <td class="border">' + item.prchPlace + '</td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};

function parseStatus(type) {
    type = parseInt(type);
    switch (type) {
        case 1:
            return '采用';
        case 2:
            return '不采用'
    }
}

exports.renderStepHistoryTable = function (list) {//措施费
    list = list || [];
    var parents = $('#stepHistory').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var isTax = '';//判断是否含税
        var price = '';
        if (item.taxPrice) {
            price = item.taxPrice;
            isTax = 'checked';
        } else {
            price = item.noTaxPrice;
        }
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.projShortName + '</td>\
      <td class="border">' + item.subProjName + '</td>\
      <td class="border">' + moment(item.purTime).format('YYYY/MM/DD') + '</td>\
      <td class="border">' + item.purUserName + '</td>\
      <td class="border">' + item.purCount + '</td>\
      <td class="border">' + price + '</td>\
      <td class="border"><input type="checkbox" disabled ' + isTax + '></td>\
      <td class="border">' + item.entprName + '</td>\
      <td class="border"></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};


exports.renderLaborHistoryTable = function (list) {//人工费库
    list = list || [];
    var parents = $('#laborHistory').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var isTax = '';//判断是否含税
        var price = '';
        if (item.taxPrice) {
            price = item.taxPrice;
            isTax = 'checked';
        } else {
            price = item.noTaxPrice;
        }
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.projShortName + '</td>\
      <td class="border">' + item.subProjName + '</td>\
      <td class="border">' + moment(item.purTime).format('YYYY/MM/DD') + '</td>\
      <td class="border">' + item.purUserName + '</td>\
      <td class="border">' + item.purCount + '</td>\
      <td class="border">' + price + '</td>\
      <td class="border"><input type="checkbox" disabled ' + isTax + '></td>\
      <td class="border">' + item.entprName + '</td>\
      <td class="border"></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};

exports.renderHrHistoryTable = function (list) {//人力资源库
    list = list || [];
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        var item = moment(list[i].attendTime).format("YYYY-MM-DD");
        var status ='';
        if (list[i].status === 2) {
            status = 'style="color: #de6d0b"';
        }
        list[i].atdTime = '<span ' + status + '>' + moment(list[i].attendTime).format("YYYY-MM-DD HH:mm").split(' ')[1] + '&nbsp;&nbsp;</span>';
        //如果数组中没有数据，或者数组中的时间、供应商、班组、工种有任意一个不同，就插入到新数组最前位置
        if (arr.length === 0
            || moment(arr[0].attendTime).format("YYYY-MM-DD") !== item //打卡时间不同
            || arr[0].entpName !== list[i].entpName //供应商不同
            || arr[0].teamName !== list[i].teamName //班组不同
            || arr[0].jobName !== list[i].jobName) {//工种不同
            arr.unshift(list[i]);
        } else {
            arr[0].atdTime += list[i].atdTime;
        }
    }
    list = arr;
    var parents = $('#hrHistory').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var dom = $('<tr class="small">' +
            '<td class="border">' + count + '</td>' +
            '<td class="border">' + moment(item.attendTime).format("YYYY-MM-DD") + '</td>' +
            '<td class="border">' + item.projShortTitle + '</td>' +
            '<td class="border">' + item.entpName + '</td>' +
            '<td class="border">' + item.teamName + '</td>' +
            '<td class="border">' + item.jobName + '</td>' +
            '<td class="border">' + item.atdTime + '</td>' +
            '</tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};

exports.renderSubpagckageHistoryTable = function (list) {//分包项库
    list = list || [];
    var parents = $('#laborHistory').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var isTax = '';//判断是否含税
        var price = '';
        if (item.taxPrice) {
            price = item.taxPrice;
            isTax = 'checked';
        } else {
            price = item.noTaxPrice;
        }
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.projShortName + '</td>\
      <td class="border">' + item.subProjName + '</td>\
      <td class="border">' + moment(item.purTime).format('YYYY/MM/DD') + '</td>\
      <td class="border">' + item.purUserName + '</td>\
      <td class="border">' + item.purCount + '</td>\
      <td class="border">' + price + '</td>\
      <td class="border"><input type="checkbox" disabled ' + isTax + '></td>\
      <td class="border">' + item.entprName + '</td>\
      <td class="border"></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
};
exports.renderSupplierHistoryTable = function (list) {
    list = list || [];
    var parents = $('#supplierHistory').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var count = i + 1;
        var prchTime = moment(item.prchTime).format('YYYY/MM/DD') || '';
        var dom = $('<tr class="small">\
      <td class="border">' + count + '</td>\
      <td class="border">' + item.projShortTitle + '</td>\
      <td class="border">' + item.subProjName + '</td>\
      <td class="border">' + prchTime + '</td>\
      <td class="border">' + item.prchUserName + '</td>\
      <td class="border">' + item.mtrlTypeName + '</td>\
      <td class="border">' + item.mtrlName + '</td>\
      <td class="border">' + item.specBrand + '</td>\
      <td class="border">' + item.unit + '</td>\
      <td class="border">' + item.prchCount + '</td>\
      <td class="border">' + item.prchPrice + '</td>\
      <td class="border">' + item.prchTotalMoney + '</td>\
      </tr>');
        dom.appendTo(parents);
    }
};
exports.renderMaterialHistoryDom = function (obj) {
    $('[name=mtrlCategory]').text(obj.mtrlCategoryName);
    $('[name=mtrlType]').text(obj.mtrlTypeName);
    $('[name=specBrand]').text(obj.specBrand);
    $('[name=unit]').text(obj.unit);
    $('[name=avgPrice]').text(obj.avgPrice);
    $('[name=totalMoney]').text(obj.totalMoney);
    $('[name=mtrlName]').text(obj.mtrlName);
};

exports.renderStepHistoryDom = function (obj) {
    $('[name=measureType]').text(obj.measureTypeName);
    $('[name=workContent]').text(obj.workContent);
    $('[name=unit]').text(obj.unit);
    $('[name=avgPrice]').text(obj.avgPrice);
    $('[name=totalMoney]').text(obj.totalMoney);
    $('[name=measureName]').text(obj.measureName);
};

exports.renderLaborHistoryDom = function (obj) {
    $('[name=laborType]').text(obj.laborTypeName);
    $('[name=workContent]').text(obj.workContent);
    $('[name=unit]').text(obj.unit);
    $('[name=avgPrice]').text(obj.avgPrice);
    $('[name=totalMoney]').text(obj.totalMoney);
    $('[name=laborName]').text(obj.laborName);
};

exports.renderSubpagckageHistoryDom = function (obj) {
    $('[name=subletType]').text(obj.subletTypeName);
    $('[name=workContent]').text(obj.workContent);
    $('[name=unit]').text(obj.unit);
    $('[name=avgPrice]').text(obj.avgPrice);
    $('[name=totalMoney]').text(obj.totalMoney);
    $('[name=subletName]').text(obj.subletName);
};

exports.renderSuppliereHistoryDom = function (obj) {
    $('[name=totalMoney]').text(obj.totalMoney + '元');
    $('[name=businessScope]').text(obj.businessScope);
    $('[name=entpTypeName]').text(obj.entpTypeName);
    $('[name=entpName]').text(obj.entpName);
};

// 人力资源
exports.renderHrHistoryDom = function (obj) {
    $('#hrHistoryId>.bold-title').html(obj.workerName);
    $('[name=phone]').text(obj.phone);
    $('[name=idNo]').text(obj.idNo);
    $('[name=attendTime]').text(moment(obj.attendTime).format("YYYY-MM-DD"));
    $('[name=attendCount]').text(obj.attendCount);
};


/*
* 省市县三级联动
* @param p 表示省的select
* @param c 表示市的select
* @param d 表示区的select
* */
exports.renderRegionSelect = function (data, p, c, d) {
    var list = data || [];
    if (p) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var provinceDom = $('<option value=' + item.provinceId + '>' + item.provinceName + '</option>');
            provinceDom.data('item', item);
            provinceDom.appendTo(p);
        }
    }
    if (c) {
        p.change(function () {
            c.html('<option value="">市</option>');
            if ($(this).val()) {
                var list2 = p.find('option[value=' + $(this).val() + ']').data('item').cities;
                for (var i = 0; i < list2.length; i++) {
                    var item = list2[i];
                    var cityDom = $('<option value=' + item.cityId + '>' + item.cityName + '</option>');
                    cityDom.data('item', item);
                    cityDom.appendTo(c);
                }
            }
        })
    }
    if (d) {
        c.change(function () {
            d.html('<option value="">县/区</option>')
            if ($(this).val()) {
                var list3 = c.find('option[value=' + $(this).val() + ']').data('item').districts;
                for (var i = 0; i < list3.length; i++) {
                    var item = list3[i];
                    var countryDom = $('<option value=' + item.districtId + '>' + item.districtName + '</option>');
                    countryDom.data('item', item);
                    countryDom.appendTo(d);
                }
            }
        })
    }
}

exports.renderSearchTable = function(list, modal, type){
    var parent = modal.$body.find('tbody');
    for(var i = 0; i < list.length; i++){
        var item = list[i];
        var dom = $('<tr class="small">' +
            '<td class"border">'+item.entpName+'</td>' +
            '<td class"border">'+item.openBank+'</td>' +
            '<td class"border">'+item.openName+'</td>' +
            '<td class"border">'+item.contactName+'</td>' +
            '<td class"border">'+item.bankCard+'</td>' +
            '</tr>');
        dom.data('item',item);
        dom.appendTo(parent);
    }
    modalEventHandler.initSearchTableEvent(modal, type);
}