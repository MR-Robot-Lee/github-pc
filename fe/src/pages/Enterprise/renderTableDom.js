var modalEventHandler = require('./modal/modalEventHandler');
var initEvent = require('./initEvent');
var chargeApi = require('./chargeApi');
var enterpriseApi = require('./enterpriseApi');
var common = require('../Common');
var checkBankInfo = require('./modal/checkBankInfo.ejs');
var switchModal = require('./modal/switchModal.ejs');
var Model = require('../../components/Model');
/**
 * 绘制人工费库
 * @param list
 */
exports.renderLabourCharge = function renderLabourCharge(list, parents, type, funType) {
    console.log('绘制 ' + type + '库')
    list = list || [];
    if (list.length > 0) {
        $("#noInfoEnterprise_search").show();
        $("[name='noInfoEnterprise_page']").show();
        $(".table-content").show();
        $("#noInfoEnterprise").hide();
    } else {
        $("#noInfoEnterprise_search").hide();
        $("[name='noInfoEnterprise_page']").hide();
        $(".table-content").hide();
        $("#noInfoEnterprise").show();
    }
    if (funType) {
        $("#noInfoEnterprise_search").show();
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = '';
        if (type === 'charge') {
            dom = renderTableChargeDom(item, i);
            dom.data('type', 'charge');
        } else if (type === 'step') {
            dom = renderTableStepDom(item, i);
            dom.data('type', 'step');
        } else if (type === 'subpackage') {
            dom = renderTableSubPackageDom(item, i);
            dom.data('type', 'subpackage');
        } else if (type === 'supplier') {
            dom = renderTableSupplierDom(item, i);
            dom.data('type', 'supplier');
        } else if (type === 'library') {
            dom = renderTableLibraryDom(item, i);
            dom.data('type', 'library');
        } else if (type === 'enterprise') {
            dom = renderMaterialDom(item, i);
        } else if (type === 'hr') {
            dom = renderTableHrDom(item, i);
        }
        dom.data('checkId', i);
        this.renderCompetence(dom, type);
        dom.data('item', item);
        dom.appendTo(parents);
        dom.find('a').click(function (e) {
            common.stopPropagation(e);
            var item = $(this).parents('tr').data('item');
            var $type = $(this).data('type');
            if ($type === 'edit') {
                modalEventHandler.putModalEvent("update", type, item);
            } else if ($type === 'delete') {
                modalEventHandler.delModalEvent(item.id, type);
            } else if ($type === 'supplier-check') {
                var checkInfo = $(checkBankInfo());
                $('.modal-arrow-left').remove();
                if ($(this).hasClass('modal-arrow-left')) {
                    return false;
                }
                checkInfo.appendTo($(this));
                checkInfo.find('[name=openName]').text(item.openName);
                checkInfo.find('[name=openBank]').text(item.openBank);
                checkInfo.find('[name=bankCard]').text(item.bankCard);
            } else if ($type === 'switch') {
                var data = {};
                var that = this;
                var switchRemind = Model('提示', switchModal());
                switchRemind.showClose();
                switchRemind.show();
                switchRemind.$body.find('.confirm').click(function (e) {
                    common.stopPropagation(e);
                    data.companyNo = $(that).parents('tr').data('item').companyNo;
                    data.teamId = $(that).parents('tr').data('item').teamId;
                    data.workerNo = $(that).parents('tr').data('item').workerNo;
                    data.status = $(that).parents('tr').data('item').status === 1 ? 2 : 1;
                    enterpriseApi.postUpdWorkerStatus(data).then(function (res) {
                        if (res.code === 1) {
                            var liItem = $("#childNav").find("li.active").data('item');
                            chargeApi.getTableList(liItem, type);
                            switchRemind.hide();
                        }
                    })
                })
            }
        })
    }
    initTableCheck(parents);
    if (type === 'enterprise') {
        initEvent.initMaterialTableFindByTypeEvent(parents);
    } else if (type === 'charge') {
        initEvent.initChargeTableFindByTypeEvent(parents);
    } else if (type === 'subpackage') {
        initEvent.initSubPackageTableFindByTypeEvent(parents);
    } else if (type === 'step') {
        initEvent.initStepTableFindByTypeEvent(parents);
    } else if (type === 'supplier') {
        initEvent.initSupplierFindByTypeEvent(parents);
    } else if (type === 'hr') {
        initEvent.initHrFindByTypeEvent(parents);
    }
};

/**
 * 绘制人工费table tr
 * @param item
 * @returns {*|jQuery|HTMLElement}
 */
function renderTableChargeDom(item, i) {
    var count = i + 1;
    return $('<tr class="active">\
                   <td class="border"><input type="checkbox" /></td>\
                   <td class="border">' + count + '</td>\
                   <td class="border"><div>' + item.laborName + '</div></td>\
                   <td class="border"><div>' + item.workContent + '</div></td>\
                   <td class="border">' + item.unit + '</td>\
                   <td class="border">' + item.avgPrice + '</td>\
                   <td class="border">' + item.totalMoney + '</td>\
                   <td style="position: relative;" class="border"><a class="confirm-hover">查看</a>\
                   <div class="fluctuations">\
                    <div style="position: absolute;top: 20px;text-align: center;width: 180px;color: #333;">价格走势图</div>\
                    <div style="position: absolute;top: 48px;left: 10px;">价格</div>\
                    <div style="position: absolute;bottom: 40px;left: 25px;color: #999;">( 仅展示仅十次价格变动情况 )</div>\
                    <div style="width: 188px;height: 200px;" id="fluctuations-labor-' + i + '">\
                    </div>\
                    <div style="width: 15px;height: 15px;position: relative;top: -170px;right: -191px;border-right: 1px solid #ccc;border-top: 1px solid #ccc;transform:rotateZ(45deg);background-color: #fff;">\
                    </div>\
                    </div>\
                   </td>\
                   <td class="border">' + item.noTaxCount + '</td>\
                   <td class="border">' + item.taxCount + '</td>\
                   <td class="border Competence"><a href="javascript:void(0)" class="edit edit-a" data-type="edit">修改</a>\
                   <div class="icon-line"></div>\
                   <a href="javascript:void(0)" class="delete delete-hover delete-a" data-type="delete">删除</a></td>\
                </tr>');
}

/**
 * 绘制措施table tr
 * @param item
 * @returns {*|jQuery|HTMLElement}
 */
function renderTableStepDom(item, i) {
    var count = i + 1;
    return $('<tr class="active">\
                 <td class="border"><input type="checkbox" /></td>\
                 <td class="border">' + count + '</td>\
                 <td class="border"><div>' + item.measureName + '</div></td>\
                 <td class="border"><div>' + item.workContent + '</div></td>\
                 <td class="border">' + item.unit + '</td>\
                 <td class="border">' + item.avgPrice + '</td>\
                 <td class="border">' + item.totalMoney + '</td>\
                 <td style="position: relative;" class="border"><a class="confirm-hover">查看</a>\
                 <div class="fluctuations">\
                    <div style="position: absolute;top: 20px;text-align: center;width: 180px;color: #333;">价格走势图</div>\
                    <div style="position: absolute;top: 48px;left: 10px;">价格</div>\
                    <div style="position: absolute;bottom: 40px;left: 25px;color: #999;">( 仅展示仅十次价格变动情况 )</div>\
                    <div style="width: 188px;height: 200px;" id="fluctuations-measure-' + i + '">\
                    </div>\
                    <div style="width: 15px;height: 15px;position: relative;top: -170px;right: -191px;border-right: 1px solid #ccc;border-top: 1px solid #ccc;transform:rotateZ(45deg);background-color: #fff;">\
                    </div>\
                 </div>\
                 </td>\
                 <td class="border">' + item.noTaxCount + '</td>\
                 <td class="border">' + item.taxCount + '</td>\
                 <td class="border Competence"><a href="javascript:void(0)" class="edit edit-a confirm-hover" data-type="edit">修改</a>\
                   <div class="icon-line"></div>\
                   <a href="javascript:void(0)" class="delete delete-a delete-hover" data-type="delete">删除</a></td>\
               </tr>');
}

/**
 * 绘制分包项
 * @returns {*|jQuery|HTMLElement}
 */
function renderTableSubPackageDom(item, i) {
    var count = i + 1;
    return $('<tr class="active">\
             <td class="border"><input type="checkbox" /></td>\
             <td class="border">' + count + '</td>\
             <td class="border"><div>' + item.subletName + '</div></td>\
             <td class="border"><div>' + item.workContent + '</div></td>\
             <td class="border">' + item.unit + '</td>\
             <td class="border">' + item.avgPrice + '</td>\
             <td class="border">' + item.totalMoney + '</td>\
             <td style="position: relative;" class="border"><a class="confirm-hover">查看</a>\
                <div class="fluctuations">\
                    <div style="position: absolute;top: 20px;text-align: center;width: 180px;color: #333;">价格走势图</div>\
                    <div style="position: absolute;top: 48px;left: 10px;">价格</div>\
                    <div style="position: absolute;bottom: 40px;left: 25px;color: #999;">( 仅展示仅十次价格变动情况 )</div>\
                    <div style="width: 188px;height: 200px;" id="fluctuations-sublet-' + i + '">\
                    </div>\
                    <div style="width: 15px;height: 15px;position: relative;top: -170px;right: -191px;border-right: 1px solid #ccc;border-top: 1px solid #ccc;transform:rotateZ(45deg);background-color: #fff;">\
                    </div>\
                </div>\
             </td>\
             <td class="border">' + item.noTaxCount + '</td>\
             <td class="border">' + item.taxCount + '</td>\
             <td class="border Competence">\
             <a href="javascript:void(0)" class="edit edit-a confirm-hover" data-type="edit">修改</a>\
             <div class="icon-line"></div>\
             <a href="javascript:void(0)" class="delete delete-a delete-hover" data-type="delete">删除</a></td>\
            </tr>')
}

/*
* 人力资源库
* */
function renderTableHrDom(item, i) {
    var count = i + 1;
    var sex = item.sex === 1 ? '男' : '女';
    var status = item.status === 1 ? '<a href="javascript:;" class="confirm-hover" data-type="switch">开启</a>' : '<a href="javascript:;" class="delete-hover" data-type="switch">关闭</a>';
    var attachCount = item.attachCount > 0 ? '<span class="icon-red-dot">' + item.attachCount + '</span>' : '';
    var countAtt = item.attachCount > 0 ? '' : 'no-attach';
    return $('<tr class="active">' +
        '<td class="border"><input type="checkbox" /></td>' +
        '<td class="border">' + count + '</td>' +
        '<td class="border">' + item.workerName + '</td>' +
        '<td class="border">' + item.phone + '</td>' +
        '<td class="border">' + sex + '</td>' +
        '<td class="border">' + item.birthday + '</td>' +
        '<td class="border">' + item.provinceName + '-' + item.cityName + '-' + item.districtName + '</td>' +
        '<td class="border"><div class="icon-arrow-gray' + countAtt + '">' + attachCount + '</div></td>' +
        '<td class="border">' + item.jobName + '</td>' +
        '<td class="border">' + status + '</td>' +
        '<td class="border Competence">' +
        '<a href="javascript:void(0)" class="edit edit-a confirm-hover" data-type="edit">修改</a>' +
        '<div class="icon-line" style="margin: 0 5px;"></div>' +
        '<a href="javascript:void(0)" class="delete delete-a delete-hover" data-type="delete">删除</a>' +
        '</td>' +
        '</tr>');
}

/*
* 供应商库
* */
function renderTableSupplierDom(item, i) {
    var count = i + 1;
    var attachCount = item.attachCount > 0 ? '<span class="icon-red-dot">' + item.attachCount + '</span>' : '';
    var countAtt = item.attachCount > 0 ? '' : 'no-attach';
    var provinceName = item.provinceName || '暂无';
    var cityName = item.cityName || '暂无';
    var address = item.address || '暂无';
    return $('<tr class="active">\
    <td class="border"><input type="checkbox" /></td>\
    <td class="border">' + count + '</td>\
    <td class="border"><div>' + item.entpName + '</div></td>\
    <td class="border">' + item.contactName + '</td>\
    <td class="border">' + item.phone + '</td>\
    <td class="border"><div>' + item.businessScope + '</div></td>\
    <td class="border">' + provinceName + '-' + cityName + '-' + address + '</td>\
    <td class="border">' + parseTaxType(item.taxType) + '</td>\
    <td class="border"><div class="icon-arrow-gray  ' + countAtt + '">' + attachCount + '</div></td>\
    <td class="border" style="position: relative"><a class="confirm-hover" data-type="supplier-check">查看</a></td>\
    <td class="border Competence">\
     <a href="javascript:void(0)" class="edit edit-a delete-hover" data-type="edit">修改</a>\
     <div class="icon-line"></div>\
     <a href="javascript:void(0)" class="delete delete-a delete-hover" data-type="delete">删除</a>\
    </td>\
    </tr>');
}

function parseTaxType(status) {
    status = parseInt(status);
    switch (status) {
        case 1:
            return '小规模';
        case 2:
            return '一般纳税人';
        case 3:
            return '个体';
        default:
            return ''
    }
}

function renderTableLibraryDom(item, i) {
    var count = i + 1;
    return $('<tr class="active">\
    <td class="border"><input type="checkbox" /></td>\
    <td class="border">' + count + '</td>\
    <td class="border"><div>' + item.projectName + '</div></td>\
    <td class="border"><div>' + item.projShortTitle + '</div></td>\
    <td class="border">' + item.projectNo + '</td>\
    <td class="border">' + item.adminName + '</td>\
    <td class="border">' + item.chargeName + '</td>\
    <td class="border">' + parseStatus(item.projStatus) + '</td>\
    <td class="border Competence">\
    <a href="javascript:void(0)" class="edit edit-a" data-type="edit">修改</a>\
    </tr>');
}

function parseStatus(status) {
    status = parseInt(status);
    switch (status) {
        case 1:
            return '开启';
        case 2:
            return '关闭';
        default:
            return '';
    }
}

function renderMaterialDom(item, i) {
    var count = i + 1;
    return $('<tr class="active">\
             <td class="border"><input type="checkbox" /></td>\
             <td class="border">' + count + '</td>\
             <td class="border"><div>' + item.mtrlName + '</div></td>\
             <td class="border"><div>' + item.specBrand + '</div></td>\
             <td class="border">' + item.unit + '</td>\
             <td class="border">' + item.avgPrice + '</td>\
             <td class="border">' + item.totalMoney + '</td>\
             <td style="position: relative;" class="border"><a class="confirm-hover">查看</a>\
                <div class="fluctuations">\
                    <div style="position: absolute;top: 20px;text-align: center;width: 180px;color: #333;">价格走势图</div>\
                    <div style="position: absolute;top: 48px;left: 10px;">价格</div>\
                    <div style="position: absolute;bottom: 40px;left: 25px;color: #999;">( 仅展示仅十次价格变动情况 )</div>\
                    <div style="width: 188px;height: 200px;" id="fluctuations-material-' + i + '">\
                    </div>\
                    <div style="width: 15px;height: 15px;position: relative;top: -170px;right: -191px;border-right: 1px solid #ccc;border-top: 1px solid #ccc;transform:rotateZ(45deg);background-color: #fff;">\
                    </div>\
                </div>\
             </td>\
             <td class="border">' + item.noTaxCount + '</td>\
             <td class="border">' + item.taxCount + '</td>\
             <td class="border Competence">\
              <a href="javascript:void(0)" class="edit edit-a confirm-hover" data-type="edit">修改</a>\
              <div class="icon-line"></div>\
              <a href="javascript:void(0)" class="delete delete-a delete-hover" data-type="delete">删除</a>\
             </td>\
           </tr>');
}

function initTableCheck(parents) {
    $("#enterpriseCheck").click(function (e) {
        common.stopPropagation(e);
        parents.find("input[type=checkbox]").prop('checked', this.checked);
    });
    parents.find("input[type=checkbox]").click(function (e) {
        common.stopPropagation(e);
        if (parents.find("input[type=checkbox]:checked").length > 0) {
            $("#enterpriseCheck").prop('checked', true);
        } else {
            $("#enterpriseCheck").prop('checked', false);
        }
    });
}

exports.renderCompetence = function (dom, type) {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var enterprise = user.permission['enterprise:*'];
    var cost = user.permission['cost:*'];// 人工
    var projDb = user.permission['projDb:*'];

    if (type === 'supplier') {
        var Competence1 = dom.find('.Competence');
        if (enterprise) {
            if (dom.find('.icon-position').hasClass('small14')) {
                dom.find('.icon-position').addClass("small14")
            }
            Competence1.show();
        } else {
            Competence1.hide();
            if (dom.find('.icon-position').hasClass('small14')) {
                dom.find('.icon-position').removeClass("small14")
            }
        }
    } else if (type === 'library') {
        var Competence2 = dom.find('.Competence');
        if (projDb) {
            if (dom.find('.icon-position').hasClass('small14')) {
                dom.find('.icon-position').addClass("small14")
            }
            Competence2.show();
        } else {
            Competence2.hide();
            if (dom.find('.icon-position').hasClass('small14')) {
                dom.find('.icon-position').removeClass("small14")
            }
        }
    } else {
        var Competence3 = dom.find('.Competence');
        if (cost) {
            if (dom.find('.icon-position').hasClass('small14')) {
                dom.find('.icon-position').addClass("small14")
            }
            Competence3.show();
        } else {
            if (dom.find('.icon-position').hasClass('small14')) {
                dom.find('.icon-position').removeClass("small14")
            }
            Competence3.hide();
        }
    }
}