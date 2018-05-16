var remind = require('./deleteModal.ejs');
var Modal = require('../../../components/Model');
var Region = require('../../../components/Region');
var common = require('../../Common');
var charge = require('../chargeRender');
var chargeApi = require('../chargeApi');
var enterpriseApi = require('../enterpriseApi');
var initEnterpriseFunc = require('../initEnterpriseFunc');
var addModal = require('./enterpriseAdd.ejs');
var stepAdd = require('./stepAdd.ejs');
var addSubPackage = require('./addSubPackage.ejs');
var addProjectModal = require('./addProjectModal.ejs');
var addSupplierModal = require('./addSupplierModal.ejs');
var addType = require('./addType.ejs');
var addGroup = require('./addGroup.ejs');
var addMaterialModal = require('./addMaterialModal.ejs');
var addEmployeeModal = require('./addEmployeeModal.ejs');
var moveMaterialModal = require('./moveMaterialModal.ejs');
var enterpriseRemind = require('./enterpriseRemind.ejs');
var moveTableMaterialModal = require('./moveTableMaterialModal.ejs');
var moveTableModal = require('./moveTableData.ejs');
var addEmployee = require('../../../components/addEmployee');
var UploadAttach = require('../../../components/UploadAttach');
var addSupplier = require('../../../components/addSupplier');
var renderTableDom = require('../renderTableDom');


/**
 * 删除处理
 * @param modal
 */
exports.delModalEvent = function delModalEvent(id, type) {
    var modal = Modal("提示", remind());
    modal.showClose();
    modal.show();
    modal.$body.find(".confirm").click(function (e) {
        common.stopPropagation(e);
        chargeApi.delTableList(id, type, function (res) {
            if (res.code === 1) {
                modal.hide();
                var childItem = $("#childNav").find("li.active").data("item");
                if (childItem.children && $("#childNav").find("li.active").length > 1) {
                    childItem = $($("#childNav").find("li.active")[1]).data("item");
                }
                chargeApi.getTableList(childItem, type)
            }
        })
    })
};
/**
 * 更新数据
 */
exports.putModalEvent = function putModalEvent(change, type, obj) {
    var modal = "";
    if (type === 'charge') {
        modal = Modal(null, addModal());
    } else if (type === 'step') {
        modal = Modal(null, stepAdd());
    } else if (type === 'subpackage') {
        modal = Modal(null, addSubPackage());
    } else if (type === 'supplier') {
        modal = Modal(null, addSupplierModal());
    } else if (type === 'library') {
        modal = Modal(null, addProjectModal());
    } else if (type === 'enterprise') {
        modal = Modal(null, addMaterialModal());
    } else if (type === 'hr') {
        $('.container-list-warp').find('.addEmployeeModal').remove();
        $('.container-list-warp').prepend(addEmployeeModal());
    } else {
        return
    }
    // 初始化弹出框
    if (type === 'hr') { // 人力资源库

        // 初始化 上传附件
        var attach = new UploadAttach($('#employeeFile'));

        // 关闭弹出框
        $('.addEmployeeModal').find('.span-btn-bc').click(function (e) {
            common.stopPropagation(e);
            $('.addEmployeeModal').remove();
        })

        // 初始化 省市县
        var province;
        var city;
        var district;
        province = $('#s_province');
        city = $('#s_city');
        district = $('#s_country');
        initEnterpriseFunc.getRegionFunc(type, province, city, district);

        if (change === 'update') {
            obj = obj || {};
            $('.addEmployeeModal').find('.project-title').html('修改人员');
            $('.addEmployeeModal').find('[name=workerNo]').html(obj.workerNo).parent().show();
            $('.addEmployeeModal').find('[name=workerName]').val(obj.workerName);
            $('.addEmployeeModal').find('[name=phone]').val(obj.phone).prop('disabled', true);
            $('.addEmployeeModal').find('[name=gender]').eq(obj.sex - 1).prop('checked', true);
            var birthDay = obj.birthday.split('-');
            var year = birthDay[0];
            var month = birthDay[1];
            $('.addEmployeeModal').find('[name="birthDay_year"]').val(year);
            $('.addEmployeeModal').find('[name="birthDay_month"]').val(month);
            $('.addEmployeeModal').find('[name=idNo]').val(obj.idNo);
            $('.addEmployeeModal').find('[name=jobName]').val(obj.jobName);
            var timer = setInterval(function () {
                if ($('.addEmployeeModal').find('#s_province option').length > 1) {
                    $('.addEmployeeModal').find('#s_province').val(obj.provinceId);
                    $('.addEmployeeModal').find('#s_province').trigger('change');
                    $('.addEmployeeModal').find('#s_city').val(obj.cityId);
                    $('.addEmployeeModal').find('#s_city').trigger('change');
                    $('.addEmployeeModal').find('#s_country').val(obj.districtId);
                    clearInterval(timer);
                }
            }, 20);

            /*回填附件信息*/
            if (obj.attaches) {
                for (var i = 0, length = obj.attaches.length; i < length; i++) {
                    attach.TempAttach(obj.attaches[i], 'appendAttach');
                }
            }
        }
        // 新增/修改人员 确认提交
        submitEmployeeEvent(change, type, obj, attach);
    } else { // 人力资源外的其他库
        modal.$header.hide();
        modal.$body.find('.project-title').text(change === 'add' ? '添加' : '修改');
        if (change !== "add") {
            modal.$body.find('.projDeptName').hide();
        }
        modal.$body.find('.icon-close').click(function (e) {
            common.stopPropagation(e);
            modal.$model.removeClass('show');
        });
        modal.showClose();
        modal.show();
        var $confirm = modal.$body.find('.confirm');
    }

    if (type === 'supplier') {
        var attach = new UploadAttach(modal.$body.find('#addSupplierAttach'));
        var supplierInputs = modal.$body.find("input[type=text]");
        // 初始化 省市
        var province;
        var city;
        province = modal.$body.find('[name=province]');
        city = modal.$body.find('[name=city]');
        initEnterpriseFunc.getRegionFunc(type, province, city);
        initSupplierLibraryConfirm(modal, $confirm, supplierInputs, attach);// 初始化确定按钮
        $confirm.data("id", '');
        if (change === 'update') {
            initLibraryInputDom(supplierInputs, obj, modal);
            modal.$body.find("textarea[name=businessScope]").val(obj.businessScope);
            modal.$body.find("textarea[name=address]").val(obj.address);
            var timer = setInterval(function () {
                if (modal.$body.find('[name=province ] option').length > 1) {
                    modal.$body.find('[name=province]').val(obj.provinceId);
                    modal.$body.find('[name=province]').trigger('change');
                    modal.$body.find('[name=city]').val(obj.cityId);
                    clearInterval(timer);
                }
            }, 20);
            modal.$body.find("[name=taxType]").val(obj['taxType']);
            $confirm.data("id", obj.id);
            if (obj.attachList) {
                for (var i = 0, length = obj.attachList.length; i < length; i++) {
                    attach.TempAttach(obj.attachList[i], 'appendAttach');
                }
            }
        }
    } else if (type === 'library') {
        /**
         * 项目库更新
         */
        var inputs = modal.$body.find("input[type=text]");
        initProjectLibraryConfirm(modal, $confirm, inputs);
        if (change === "update") {
            $confirm.data("id", obj.id);
            initLibraryInputDom(inputs, obj, modal);
            modal.$body.find("input[type=radio][value=" + obj.projStatus + "]").prop('checked', true);
        } else {
            $confirm.data("id", '');
        }
    } else if (type != 'hr') {
        /**
         * 统一处理 分包 人工 措施 材料
         * @type {T|*|{}}
         */
        var deleteBtn = modal.$body.find('#deleteColumn');
        var column = modal.$body.find('.column');
        var addBtn = modal.$body.find('#addColumn');
        var tables = modal.$body.find('#modalEnterprise');
        var trs = tables.find('tr');
        trs.click(function (e) {
            common.stopPropagation(e);
            if ($(this).hasClass('active-bc')) {
                $(this).removeClass('active-bc');
            } else {
                tables.find('tr').removeClass('active-bc');
                $(this).addClass('active-bc');
            }
        });
        if (change === "update") {
            deleteBtn.hide();
            column.hide();
            addBtn.hide();
            initTableTrData(tables, obj);
            $confirm.data("id", obj.id)
        } else {
            $confirm.data("id", "");
            deleteBtn.show();
            column.show();
            addBtn.show();
            initAddClickEvent(addBtn, tables, type);
            initDeleteClickEvent(deleteBtn, tables);
        }
        initConfirm($confirm, tables, type, modal);
    }
};

function submitEmployeeEvent(change, type, obj, attach) {
    $('.addEmployeeModal').find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var data = {};
        // data.status = $('.addEmployeeModal').find('.status-open').prop('checked') ? 1 : 3; // 考勤状态
        data.workerName = $('.addEmployeeModal').find('[name=workerName]').val(); // 姓名
        data.phone = $('.addEmployeeModal').find('[name=phone]').val(); // 手机号码
        data.sex = $('.addEmployeeModal').find('.gender-male').prop('checked') ? 1 : $('.addEmployeeModal').find('[name=gender]').eq(1).prop('checked') ? 2 : ''; // 性别
        var year = $('.addEmployeeModal').find('[name=birthDay_year]').val();  // 出生年月
        var month = $('.addEmployeeModal').find('[name=birthDay_month]').val();
        data.birthday = year + '-' + month;
        data.provinceId = $('.addEmployeeModal').find('#s_province').val();
        data.provinceName = $('.addEmployeeModal').find('#s_province option[value=' + data.provinceId + ']').html();
        data.cityId = $('.addEmployeeModal').find('#s_city').val();
        data.cityName = $('.addEmployeeModal').find('#s_city option[value=' + data.cityId + ']').html();
        data.districtId = $('.addEmployeeModal').find('#s_country').val();
        data.districtName = $('.addEmployeeModal').find('#s_country option[value=' + data.districtId + ']').html();
        data.idNo = $('.addEmployeeModal').find('[name=idNo]').val(); // 身份证号码
        data.jobName = $('.addEmployeeModal').find('[name=jobName]').val(); // 工种
        var attaches = attach.getAttaches();
        data.attaches = [];
        for (var i = 0; i < attaches.length; i++) {
            var item = attaches[i];
            var attachData = {};
            attachData.attachName = item.attachName;
            attachData.attachSize = item.attachSize;
            attachData.attachType = item.attachType;
            attachData.attachUrl = item.attachUrl;
            attachData.thumbnailUrl = item.thumbnailUrl;
            data.attaches.push(attachData);
        }
        data.teamId = $('#childNav').find('li.active').data('item').teamId;
        if (!data.workerName) {
            return alert('请填写姓名');
        }
        if (!data.phone) {
            return alert('请填写手机号码');
        }
        if (!(/^1[34578]\d{9}$/.test(data.phone))) {
            return alert('请填写正确手机号码');
        }
        if (!data.sex) {
            return alert('请选择性别');
        }
        if (!data.birthday) {
            return alert('请选择出生年月');
        }
        if (!data.provinceId || !data.cityId || !data.districtId) {
            return alert('请选择籍贯');
        }
        if (!data.idNo) {
            return alert('请填写身份证号码');
        }
        if (!data.jobName) {
            return alert('请填写工种');
        }
        if (change === 'update') {
            data.id = obj.id;
            enterpriseApi.putUpdWorkerInfo(data).then(function (res) {
                if (res.code === 1) {
                    $('.addEmployeeModal').remove();
                    var childItem = $("#childNav").find("li.active").data("item");
                    chargeApi.getTableList(childItem, type);
                }
            })
        } else {
            enterpriseApi.postAddWorker(data).then(function (res) {
                if (res.code === 1) {
                    $('.addEmployeeModal').remove();
                    var childItem = $("#childNav").find("li.active").data("item");
                    chargeApi.getTableList(childItem, type);
                }
            })
        }
    })
}


function initTableTrData(tables, data) {
    var inputs = tables.find('tr').find('input');
    for (var i = 0, length = inputs.length; i < length; i++) {
        var input = inputs[i];
        $(input).val(data[$(input).attr('name')]);
    }
}

/**
 * 初始化添加按钮事件
 */
function initAddClickEvent(addBtn, tables, type) {
    addBtn.click(function (e) {
        common.stopPropagation(e);
        var dom = '';
        if (type === 'enterprise') {
            dom = initMaterialDom();
        } else if (type === 'charge') {
            dom = initChargeDom();
        } else if (type === 'step') {
            dom = initStepDom();
        } else if (type === 'subpackage') {
            dom = initSubpackageDom();
        }
        dom.click(function (e) {
            common.stopPropagation(e);
            if ($(this).hasClass('active-bc')) {
                $(this).removeClass('active-bc');
            } else {
                tables.find('tr').removeClass('active-bc');
                $(this).addClass('active-bc');
            }
        });
        var count = tables.find('tr').length + 1;
        dom.find('.order').text(count);
        dom.appendTo(tables);
    });
}

function initMaterialDom() {
    return $('<tr class="small">\
             <td class="border order">1</td>\
             <td class="border">\
              <input type="text" name="mtrlName" placeholder="请填写" />\
             </td>\
             <td class="border">\
              <input type="text" name="specBrand" placeholder="请填写" />\
             </td>\
             <td class="border">\
              <input type="text" name="unit" placeholder="请填写" style="max-width: 40px;min-width: 40px" />\
             </td>\
            </tr>');
}

function initChargeDom() {
    return $('<tr class="small">\
                  <td class="border order">1</td>\
                  <td class="border">\
                   <input type="text" name="laborName" placeholder="请填写" />\
                  </td>\
                  <td class="border">\
                   <input type="text" name="workContent" placeholder="请填写" />\
                  </td>\
                  <td class="border">\
                   <input type="text" placeholder="请填写" name="unit" style="max-width: 40px;min-width: 40px" />\
                  </td>\
                 </tr>')
}

function initStepDom() {
    return $('<tr class="small">\
             <td class="border order">1</td>\
             <td class="border">\
              <input type="text" name="measureName" placeholder="请填写" />\
             </td>\
             <td class="border">\
              <input type="text" name="workContent" placeholder="请填写" />\
             </td>\
             <td class="border">\
              <input type="text" name="unit" placeholder="请填写" style="max-width: 40px;min-width: 40px" />\
             </td>\
           </tr>');
}

function initSubpackageDom() {
    return $('<tr class="small">\
             <td class="border order">1</td>\
             <td class="border">\
              <input type="text" name="subletName" placeholder="请填写" />\
             </td>\
             <td class="border">\
              <input type="text" name="workContent" placeholder="请填写" />\
             </td>\
             <td class="border">\
              <input type="text" name="unit" placeholder="请填写" style="max-width: 40px;min-width: 40px" />\
             </td>\
            </tr>');
}

/**
 * 初始化删除按钮点击事件
 */
function initDeleteClickEvent(deleteBtn, tables) {
    deleteBtn.click(function (e) {
        common.stopPropagation(e);
        var $tr = tables.find('tr');
        var count = $tr.length;
        if (count === 1) {
            return
        }
        var activeTr = tables.find('.active-bc');
        if (activeTr.length === 0) {
            return
        }
        activeTr.remove();
        var newTr = tables.find('tr');
        for (var i = 0, length = newTr.length; i < length; i++) {
            var dom = $(newTr[i]);
            dom.find('.order').text(i + 1);
            dom.appendTo(tables)
        }
    });
}

/**
 * 初始化提交按钮点击事件
 * @param $confirm
 * @param tables
 * @param type
 * @param modal
 */
function initConfirm($confirm, tables, type, modal) {
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data("id");
        var input = tables.find('tr').find('input');
        var liItem = $("#childNav").find("li.active");
        if (!liItem) {
            return alert('请创建二级数据');
        }
        var datas = [];
        var data = {};
        if (type === 'library') {
            liItem = liItem.data("item");
            data.projType = liItem.projType;
        } else if (type === 'charge') {
            liItem = liItem.data("item");
            data.laborType = liItem.id;
        } else if (type === 'step') {
            liItem = liItem.data("item");
            data.measureType = liItem.id;
        } else if (type === 'subpackage') {
            liItem = liItem.data("item");
            data.subletType = liItem.id;
        } else if (type === 'supplier') {
            liItem = liItem.data("item");
            data.entpType = liItem.id;
        } else if (type === 'enterprise') {
            if (liItem.length <= 1) {
                return alert("请创建二级菜单");
            }
            liItem = $(liItem[1]).data("item");
            data.mtrlType = liItem.id;
            data.mtrlCategory = liItem.mtrlCategory;
        }
        for (var i = 0, length = input.length; i < length; i++) {
            var value = $(input[i]).val();
            var name = $(input[i]).attr('name');
            var errName;
            errName = name == 'laborName' ? '费用名称' : name == 'workContent' ? '工作内容' : name == 'unit' ? '单位' : '';
            if (!value) {
                return alert('请输入' + errName);
            }
            data[name] = value;
            if ((i + 1) % 3 === 0) {
                datas.push(data);
                data = {};
                if (type === 'library') {
                    data.projType = liItem.projType;
                } else if (type === 'charge') {
                    data.laborType = liItem.id;
                } else if (type === 'step') {
                    data.measureType = liItem.id;
                } else if (type === 'subpackage') {
                    data.subletType = liItem.id;
                } else if (type === 'supplier') {
                    data.entpType = liItem.id;
                } else if (type === 'enterprise') {
                    data.mtrlType = liItem.id;
                    data.mtrlCategory = liItem.mtrlCategory;
                }
            }
        }
        if (datas.length <= 0) {
            return alert('请创建输入的内容');
        }
        for (var j = 0, $length = datas.length; j < $length; j++) {
            var item = datas[j];
            submitData(id, item, type, modal, liItem);
        }
    })
}

/**
 * 更新提交数据
 * @param id
 */
function submitData(id, item, type, modal, liItem) {
    if (id) {
        item.id = id;
        chargeApi.putTableList(item, type, function (res) {
            if (res.code === 1) {
                modal.hide();
                chargeApi.getTableList(liItem, type)
            }
        })
    } else {
        chargeApi.postTableList(item, type, function (res) {
            if (res.code === 1) {
                modal.hide();
                chargeApi.getTableList(liItem, type)
            }
        })
    }
}

/**
 * 初始化项目库数据
 * @param modal
 * @param $confirm
 */
function initProjectLibraryConfirm(modal, $confirm, inputs) {
    modal.$body.find('#chargeUserNo').click(function (e) {
        common.stopPropagation(e);
        var $user = $(this).data('user');
        var that = this;
        var $addEmployee = new addEmployee('添加负责人', function (data) {
            var user = data && data[0];
            $(that).data('user', user);
            $(that).text(user.userName);
            $addEmployee.hide();
        }, 'single');
        $addEmployee.getUserTreeList(function () {
            var list = [];
            if ($user) {
                list.push($user);
            }
            $addEmployee.renderSelectData(list);
        });
        $addEmployee.show();
    });
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data("id");
        var liItem = $("#childNav").find("li.active").data("item");
        if (!liItem) {
            return alert('请创建二级数据');
        }
        var data = {};
        var error = false;
        var caveat = "";
        for (var i = 0, length = inputs.length; i < length; i++) {
            var input = inputs[i];
            var value = $(input).val();
            var name = $(input).attr("name");
            if (!value) {
                caveat = $(input).attr('data-caveat');
                error = true;
                break;
            }

            data[name] = value;
        }
        if (error && caveat != '项目部名称') {
            return alert('请输入' + caveat);
        }
        var userData = modal.$body.find('#chargeUserNo').data('user');
        if (!userData) {
            return alert('请选择负责人');
        }
        data.chargeUserNo = userData.userNo;
        data.projTypeId = liItem.id;
        data.projStatus = modal.$body.find("input[type=radio]:checked").val();
        data.projDeptName = modal.$body.find("[name='projDeptName']").val();
        submitData(id, data, 'library', modal, liItem);
    })
}

/**
 * 初始化项目库修改dom
 * @param inputs
 * @param obj
 * @param modal
 */
function initLibraryInputDom(inputs, obj, modal) {
    for (var i = 0, length = inputs.length; i < length; i++) {
        var input = inputs[i];
        var name = $(input).attr('name');
        $(input).val(obj[name]);
    }
    modal.$body.find('#chargeUserNo').data("user",
        { userNo: obj.chargeUserNo, userName: obj.chargeName });
    modal.$body.find('#chargeUserNo').text(obj.chargeName);
}

/**
 * 初始化供应商提交按钮事件
 */
function initSupplierLibraryConfirm(modal, $confirm, inputs, attach) {
    // var attach = new UploadAttach(modal.$body.find('#addSupplierAttach'));
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var id = $(this).data("id");
        var liItem = $("#childNav").find("li.active").data("item");
        if (!liItem) {
            return alert('请创建二级数据');
        }
        var data = {};
        var error = false;
        var caveat = "";
        for (var i = 0, length = inputs.length; i < length; i++) {
            var input = inputs[i];
            var name = $(input).attr('name');
            var value = $(input).val();
            if (name === 'phone' && value) {
                if (!(/^1[34578]\d{9}$/.test(value))) {
                    return alert('请输入正确手机号');
                }
            }
            if (!value) {
                caveat = $(input).attr('data-caveat');
                error = true;
                break;
            }
            data[name] = value;
        }
        if (error) {
            return alert('请输入' + caveat);
        }
        data.businessScope = modal.$body.find("textarea[name=businessScope]").val();
        data.address = modal.$body.find("textarea[name=address]").val();
        data.taxType = modal.$body.find("[name=taxType]").val();
        data.provinceId = modal.$body.find("[name=province]").val();
        data.cityId = modal.$body.find("[name=city]").val();
        data.provinceName = modal.$body.find('[name=province] option[value=' + data.provinceId + ']').html();
        data.cityName = modal.$body.find('[name=city] option[value=' + data.cityId + ']').html();
        if (!data.businessScope) {
            return alert('请输入经营范围');
        }
        if (!data.taxType || data.taxType === 'a') {
            return alert('请选择税务类型');
        }
        data.entpType = liItem.id;
        data.attachCount = attach.getAttaches().length;
        data.attachList = attach.getAttaches();
        submitData(id, data, 'supplier', modal, liItem);
    })
}

/**
 * 创建二级菜单
 * @param item 创建数据
 * @param type 那个菜单类型
 * @param change 更新还是创建
 * @param parentItem
 */
exports.createChildNav = function (type, change, item, parentItem) {
    var modal = '';
    var _name = '新建类别';
    var label = '类别名称:';
    if (type === 'enterprise-level') {
        _name = '新建类型';
        label = '类型名称';
    } else if (type === 'hr') {
        _name = '增加班组';
    }

    if (change === 'update' && type === 'enterprise') {
        _name = '修改类别';
    } else if (change === 'update') {
        _name = '修改类型';
        if (type === 'hr') {
            _name = '修改班组';
        }
    }

    if (type === 'hr') {
        modal = Modal(_name, addGroup());
        if (change === 'update') {
            modal.$body.find('.model-item').eq(0).addClass('.model-hide').hide();
            modal.$body.find('.model-item').eq(1).css('paddingTop', '25px');
        }
        modal.show();
        modal.showClose();
        modal.$body.find('.addContracter').click(function (e) {
            common.stopPropagation(e);
            new addSupplier($(this), $(this).next('.supplierList'));
            $('.model-add-supplier').css('top', '-265px');
            $(this).next().find('.add-supplier-container').hide();
        });
    } else {
        modal = Modal(_name, addType());
        modal.show();
        modal.showClose();
        modal.$body.find('label').text(label);
    }
    var $confirm = modal.$body.find("#confirm");
    $confirm.data('type', type);
    $confirm.data('item', item);

    if (parentItem) {
        $confirm.data('parentItem', parentItem);
    } else {
        $confirm.data('parentItem', "");
    }
    if (change === 'update') {
        var name = '';
        if (type === 'charge') {
            name = item.laborTypeName;
        } else if (type === 'step') {
            name = item.measureTypeName;
        } else if (type === 'subpackage') {
            name = item.subletTypeName;
        } else if (type === 'supplier') {
            name = item.entpTypeName;
        } else if (type === 'library') {
            name = item.projTypeName;
        } else if (type === 'enterprise') {
            name = item.mtrlCategoryName;
        } else if (type === 'enterprise-level') {
            name = item.mtrlTypeName;
        } else if (type === 'hr') {
            name = item.teamName;
        }
        modal.$body.find("#type").val(name);
    }
    initAddChildNavSubmit($confirm, modal, change);
};

function initAddChildNavSubmit($confirm, modal, change) {
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).data('item');
        var parentItem = $(this).data('parentItem');
        var value = modal.$body.find("#type").val();
        if (!value) {
            return alert('请输入添加内容');
        }
        var data = {};
        if (type === 'charge') {
            data.laborTypeName = value;
        } else if (type === 'step') {
            data.measureTypeName = value;
        } else if (type === 'subpackage') {
            data.subletTypeName = value;
        } else if (type === 'supplier') {
            data.entpTypeName = value;
        } else if (type === 'library') {
            data.projTypeName = value;
        } else if (type === 'enterprise') {
            data.mtrlCategoryName = value;
        } else if (type === 'enterprise-level') {
            data.mtrlTypeName = value;
            if (change === "add-level") {
                data.mtrlCategory = parentItem.id;
            } else {
                data.mtrlCategory = parentItem.mtrlCategory;
            }
        } else if (type === 'hr') {
            if (modal.$body.find('.model-item').eq(0).hasClass('.model-hide')) {
                data.teamName = value;
            } else {
                if (!modal.$body.find('.supplierList').data('item')) {
                    return alert('请选择供应商');
                }
                data.entpId = modal.$body.find('.supplierList').data('item').id;
                data.teamName = value;
            }
        }
        if (item) {
            if (type === 'hr') {
                data.teamId = item.teamId;
            } else {
                data.id = item.id;
            }
            chargeApi.putChildNav(data, type, function (res) {
                if (res.code === 1) {
                    modal.hide();
                    chargeApi.getChildNav(type, change, data)
                }
            })
        } else {
            chargeApi.postChildNav(data, type, function (res) {
                if (res.code === 1) {
                    modal.hide();
                    chargeApi.getChildNav(type, change, data)
                }
            })
        }
    })
}

/**
 * 通过id删除二级的内容
 */
exports.delChildNavFindById = function delChildNavFindById(item, type) {
    var modal = Modal("提示", remind());
    modal.showClose();
    modal.show();
    modal.$body.find(".confirm").click(function (e) {
        common.stopPropagation(e);
        var id = item.id;
        if (type === 'hr') {
            id = item.teamId;
        }
        chargeApi.delChildNav(id, type, function (res) {
            if (res.code === 1) {
                modal.hide();
                chargeApi.getChildNav(type, 'get', item);
            }
        })
    })
};

/**
 * 移动数据
 */
exports.moveMaterial = function moveMaterial(type) {
    var modal = Modal(null, moveMaterialModal());
    modal.$header.hide();
    modal.show();
    modal.$body.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        modal.$model.removeClass('show');
    });
    var $confirm = modal.$body.find(".confirm");
    var materialParent = modal.$body.find("#materialParent").html('');
    var materialChild = modal.$body.find("#materialChild").html('');
    var newMaterial = modal.$body.find("#newMaterial").html('');
    initMoveTable(materialParent, materialChild, newMaterial, type);
    initMoveChange(materialParent, materialChild);
    initMoveClick($confirm, materialParent, materialChild, newMaterial, modal);
};

function initMoveChange(materialParent, materialChild) {
    materialParent.change(function (e) {
        common.stopPropagation(e);
        var items = $(this).find("option:selected").data("item");
        if (!items || items.length === 0) {
            materialChild.html('');
            $("<option value='a'>请选择</option>").appendTo(materialChild);
            return;
        }
        for (var i = 0, length = items.length; i < length; i++) {
            var $item = items[i];
            var dom = $('<option></option>');
            dom.val($item.id);
            dom.text($item.mtrlTypeName);
            dom.appendTo(materialChild);
        }
    })
}

function initMoveClick($confirm, materialParent, materialChild, newMaterial, modal) {
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var parentValue = materialParent.val();
        var childValue = materialChild.val();
        var newValue = newMaterial.val();
        if (parentValue === 'a') {
            return alert('请选择移出数据');
        }
        if (childValue === 'a') {
            return alert('请选择移出数据');
        }
        if (newValue === 'a') {
            return alert('请选择移出数据');
        }
        var data = {
            oldCategoryId: parentValue,
            typeId: childValue,
            newCategoryId: newValue
        };
        chargeApi.moveMaterialData(data, function (res) {
            if (res.code === 1) {
                modal.hide();
                chargeApi.getChildNav("enterprise", "update", { mtrlCategory: newValue, id: childValue });
            }
        })
    })
}

/**
 * 移动table数据
 * @param type
 */
exports.moveTableData = function moveTableData(type) {
    var trs = $("#enterpriseLibrary").find('tr');
    var checkbox = $(".table-content").find("input[type=checkbox]");
    if (trs.length === 0 || !checkbox.prop('checked')) {
        var remind = Modal('', enterpriseRemind());
        remind.$header.hide();
        remind.$body.find('.icon-close').click(function (e) {
            common.stopPropagation(e);
            remind.$model.removeClass('show');
        });
        remind.show();
        return;
    }
    var modal = '';
    if (type === 'enterprise') {
        modal = Modal(null, moveTableMaterialModal());
    } else {
        modal = Modal(null, moveTableModal());
    }
    modal.$header.hide();
    modal.$body.find('.icon-close').click(function (e) {
        common.stopPropagation(e);
        modal.$model.removeClass('show');
    });
    modal.show();
    var confirm = modal.$body.find(".confirm");
    var materialParent = modal.$body.find("#materialParent").html('');
    var newMaterial = modal.$body.find("#newMaterial").html('');
    $("<option value='a'>请选择</option>").appendTo(newMaterial);
    initMoveTable(materialParent, null, null, type);
    initTableConfirm(confirm, type, modal, materialParent, newMaterial);
    if (type === 'enterprise') {
        initMoveChange(materialParent, newMaterial);
    }
};

/**
 * 初始化提交按钮 更新
 */
function initTableConfirm($confirm, type, modal, materialParent, newMaterial) {
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var trs = $("#enterpriseLibrary").find("tr input[type=checkbox]:checked");
        var li = $("#childNav").find("li.active");
        var valueParent = materialParent.val();
        var newValue = newMaterial.val();
        if (valueParent === 'a' || newValue === 'a') {
            return alert('请选择要搬移的菜单项');
        }
        if (type === 'hr') {// 人力资源库
            var nos = [];
            for (var i = 0, length = trs.length; i < length; i++) {
                nos.push($(trs[i]).parents("tr").data("item").workerNo);
            }
            nos = nos.join(";");
            var liItem = li.data("item");
            var data = { id: nos, oid: liItem.teamId, nid: parseInt(valueParent) };
            console.log('data1: ');
            console.log(data);
            if (data.oid == data.nid) {
                return alert("移动目标已经在列表中");
            }
        } else {// 非人力资源库
            var ids = [];
            for (var i = 0, length = trs.length; i < length; i++) {
                ids.push($(trs[i]).parents("tr").data("item").id);
            }
            ids = ids.join(";");

            var liItem = li.data("item");
            var data = { id: ids, oid: liItem.id, nid: parseInt(valueParent) };
            console.log('data2: ');
            console.log(data);
            /**
             * LEE :更改前代码如下：
             * if (data.oid == data.nid) {
                return alert("移动目标已经在列表中");
               }
               if (newValue && type === 'enterprise') {
                   data.ncid = parseInt(newValue);
                   data.ocid = $(li[1]).data("item").id;
               }
             */
            if (data.oid == data.nid && type !== 'enterprise') {
                return alert("移动目标已经在列表中");
            } 
            if (newValue && type === 'enterprise') {
                data.ncid = parseInt(newValue);
                data.ocid = $(li[1]).data("item").id;
                if(data.ncid === data.ocid) {
                    return alert("移动的目标已经在列表中");
                }
            }
        }

        chargeApi.moveTableOther(type, data, function (res) {
            if (res.code === 1) {
                modal.hide();
                if (data.ncid) {
                    $('#' + data.ncid + '-level').click();
                } else {
                    $('#' + data.nid).click();
                }
                var inputs = $(".table-content").find("tr input[type=checkbox]:checked");
                for (var i = 0, length = inputs.length; i < length; i++) {
                    $(inputs[i]).prop("checked", false);
                }
            }
        });
    })
}

/**
 * 初始化选中的二级菜单
 * @param materialParent
 * @param materialChild
 * @param newMaterial
 */
function initMoveTable(materialParent, materialChild, newMaterial, type) {
    var $initDom = $("<option value='a'>请选择</option>");
    $initDom.appendTo(materialChild);
    $initDom.clone().appendTo(materialParent);
    $initDom.clone().appendTo(newMaterial);
    chargeApi.getMaterialList(type, function (data) {
        for (var i = 0, length = data.length; i < length; i++) {
            var item = data[i];
            var name = '';
            if (type === 'charge') {
                name = item.laborTypeName;
            } else if (type === 'step') {
                name = item.measureTypeName;
            } else if (type === 'subpackage') {
                name = item.subletTypeName;
            } else if (type === 'supplier') {
                name = item.entpTypeName;
            } else if (type === 'library') {
                name = item.projTypeName;
            } else if (type === 'enterprise') {
                name = item.mtrlCategoryName;
            } else if (type === 'hr') {
                name = item.teamName;
            }
            var dom = $('<option></option>');
            dom.data("item", item.children);
            if (type === 'hr') {
                dom.val(item.teamId);
            } else {
                dom.val(item.id);
            }
            dom.text(name);
            dom.appendTo(materialParent);
            if (newMaterial) {
                dom.clone().appendTo(newMaterial);
            }
        }
    });
}

exports.initSearchTableEvent = function (modal, type) {
    modal.$body.find('tbody tr').click(function (e) {
        common.stopPropagation(e);
        var parent = $('#enterpriseLibrary').html('');
        var data = $(this).data('item');
        modal.hide();
        var list = [];
        list.push(data);

        // console.log('data');
        // console.log(data);

        // 点击每条数据，对应的分类高亮显示
        var firstLevelDom = $('.child-span-right').find('#childNav > li');
        var secondLevelDom = firstLevelDom.find('.level2 > li');
        // 一二级分类先前高亮显示的元素
        var $firstPrevActive = $('.child-span-right').find('#childNav > li.active');
        var $secondPrevActive = firstLevelDom.find('.level2 > li.active');
        //  各个库回滚到顶部要用到
        var commonHeaderHeight = $('.child-span-right .common-header').outerHeight();

        if (firstLevelDom.length > 0) {
            firstLevelDom.each(function (index, element) {
                var $ele = $(element);
                var level1ID = $ele.attr('id');
                if (level1ID == (data.mtrlCategory || data.laborType || data.measureType || data.subletType || data.entpType || data.projTypeId || data.teamId)) {
                    if (!$ele.hasClass('active')) {
                        $firstPrevActive.find('> .level2') && $firstPrevActive.find('> .level2').hide();
                        $ele.find('> .level2') && $ele.find('> .level2').show();
                        $ele.addClass('active').siblings().removeClass('active');
                        var top = $ele.offset().top - commonHeaderHeight + $ele.scrollTop();
                        $ele.parent().animate({ scrollTop: top }, 300);
                    }
                    if (secondLevelDom.length > 0) {
                        secondLevelDom.each(function (index, element) {
                            var $e = $(element);
                            var level2ID = $e.attr('id');
                            if (parseInt(level2ID) == data.mtrlType) {
                                $secondPrevActive.removeClass('active');
                                $e.addClass('active');
                            }
                        })
                    }
                }
            })
        }
        // 二次搜索时的滚到顶部不能准确定位；
        // charge.addActiveToList(data, type);
        renderTableDom.renderLabourCharge(list, parent, type);
    })
}
