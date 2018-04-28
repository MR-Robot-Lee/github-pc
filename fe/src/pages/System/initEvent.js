var common = require('../Common');
var Model = require('../../components/Model');
var addDepartmentModal = require('./modal/addDepartment.ejs');
var editDepartmentModal = require('./modal/eidtDepartment.ejs');
var employeeModal = require('./modal/addEmployee.ejs');
var deleteModal = require('./modal/deleteModal.ejs');
var stopEmployee = require('./modal/stopEmployee.ejs');
var addJobModal = require('./modal/addJobModal.ejs');
var renderSystemTable = require('./renderSystemTable');
var addEmployee = require('../../components/addEmployee');
var $addEmployeeModal = require('./modal/addEmployeeModal.ejs');
var systemFunc = require('./systemFunc');
var immediatelyOrderModal = require('./modal/immediatelyOrderModal.ejs');
var continuedBuyingModal = require('./modal/continuedBuyingModal.ejs');

var addAccountModal = require('./modal/addAccountModal.ejs');
var purchaseStorageModal = require('./modal/purchaseStorageModal.ejs');

var payOrderModal = require('./modal/payOrderModal.ejs');
var receiptOrderModal = require('./modal/receiptOrderModal.ejs');
var dateilOrderModal = require('./modal/detailOrderModal.ejs');
var systemRemindModal = require('./modal/systemRemindModal.ejs');
var ServiceAgreementModal = require('./modal/ServiceAgreementModal.ejs');
exports.initOrganizationStructureEvent = function () {
    var addDepartment = $('.addDepartment');

    if (addDepartment.length > 0 && !addDepartment.data('flag')) {
        addDepartment.data('flag', true);
        addDepartment.click(function (e) {
            common.stopPropagation(e);
            var departmentModal = Model('新增部门', addDepartmentModal());
            departmentModal.show();
            departmentModal.showClose();
            var user = localStorage.getItem('user');
            user = user ? JSON.parse(user).employee : {};
            departmentModal.$body.find('[name=companyName]').val(user.companyName);
            addDepartmentModalEvent(departmentModal);
        });

        $('.editDepartment').click(function (e) {
            common.stopPropagation(e);
            var item = $('#enterpriseNav').find('>ul>li.active').data('item');
            if (!item) {
                return alert('请选择要修改的部门');
            }
            var editDepartment = Model('修改部门', editDepartmentModal());
            editDepartment.show();
            editDepartment.showClose();
            var user = localStorage.getItem('user');
            user = user ? JSON.parse(user).employee : {};
            editDepartment.$body.find('[name=companyName]').val(user.companyName);
            editDepartmentModalData(editDepartment, item);
            editDepartmentModalEvent(editDepartment, item);
        });

        $('.addEmployee').click(function (e) {
            common.stopPropagation(e);
            var addEmploye = Model('新增部门员工', employeeModal());
            addEmploye.showClose();
            addEmploye.show();
            addEmployeeModalData(addEmploye);
            addEmployeeModalEvent(addEmploye);
        });
        $('#btnSearch').click(function (e) {
            common.stopPropagation(e);
            var keywords = $('.keywords').val().trim();
            var operateType = $('.operateType').val();
            var item = $('#enterpriseNav').find('>ul>li.active').data('item');
            var deptId;
            if (item) {
                deptId = item.id;
            } else {
                deptId = $('#enterpriseNav').data('item');
            }
            var data = {deptId: deptId, status: operateType};
            if (keywords) {
                data.keywords = keywords;
            }
            systemFunc.getEmployeeListFunc(data);
        });

        //排序

        $('#sortOrganizationTable').click(function () {
            var trs = [];//绑定事件所用数组
            $('#organizationTable tr').each(function () {
                trs.push(this);
            })
            if ($(this).hasClass('sort-active')) {
                $('#organizationTable tr').attr('draggable', false);
                $(this).html('排序');
                var employeeArr = [];
                $('#organizationTable tr').each(function () {
                    employeeArr.push($(this).attr('id'));
                })
                var employeeIds = employeeArr.join(';');
                var sortArr = [];
                for (var i = 0; i < employeeArr.length; i++) {
                    sortArr.push(i + 1);
                }
                var sortIds = sortArr.join(';');
                var item = $('#enterpriseNav').find('>ul>li.active').data('item') || $('#enterpriseNav').data('item');
                var data = {deptId: item.id, employeeIds: employeeIds, sortIds: sortIds};
                systemFunc.putEmployeeSortFunc(data);
            } else {
                $('#organizationTable tr').attr('draggable', true);
                $(this).html('结束排序');
            }
            $(this).toggleClass('sort-active');
            sortEmployees(trs);
        })
        /*$('.exportEmployee').click(function (e) {
         common.stopPropagation(e);
         var importEmployeeModal = Model('批量导入', importEmployee());
         importEmployeeModal.showClose();
         importEmployeeModal.show();
         })*/
    }
};

function sortEmployees(trs) {//员工排序
    var beginY;
    var first;
    for (var i = 0; i < trs.length; i++) {
        trs[i].ondragstart = function (e) {
            if ($('#sortOrganizationTable').hasClass('sort-active')) {
                first = $(this).prevAll().length + 1;//表示拖动的是第几条数据
                beginY = e.pageY;//获取鼠标初始位置
            }
        }
    }
    for (var i = 0; i < trs.length; i++) {
        trs[i].ondragend = function (e) {
            if ($('#sortOrganizationTable').hasClass('sort-active')) {
                var trs2 = [];//获得重新排序的数组
                $('#organizationTable tr').each(function () {
                    trs2.push(this);
                })
                var num = parseInt((beginY - e.pageY) / 40);
                if (num > 0) {
                    if (num < first) {//向上不超出范围
                        trs2[first - num - 1].before($(this)[0]);
                    }
                } else {
                    if (first - num <= trs.length) {//向下不超出范围
                        trs2[first - num - 1].after($(this)[0]);
                    }
                }
            }
        }
    }
}


function addDepartmentModalEvent() {
    var modal = arguments[0];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var deptName = modal.$body.find('[name=deptName]').val();
        var describes = modal.$body.find('[name=describes]').val();
        var item = $('#enterpriseNav').data('item');
        if (!item) {
            return alert('公司不存在请创建公司');
        }
        if (!deptName) {
            return alert('请输入部门名称');
        }
        systemFunc.addDepartmentFunc({deptName: deptName, describes: describes, pId: item.id}, modal);
    })
}

function editDepartmentModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('[name=deptName]').val(item.deptName);
    modal.$body.find('[name=describes]').val(item.describes);
}

function editDepartmentModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var deptName = modal.$body.find('[name=deptName]').val();
        var describes = modal.$body.find('[name=describes]').val();
        if (!deptName) {
            return alert('请输入部门名称');
        }
        systemFunc.putDepartmentFunc({id: item.id, deptName: deptName, describes: describes, pId: item.pId}, modal);
    });
    modal.$body.find('.delete').click(function (e) {
        common.stopPropagation(e);
        systemFunc.delDepartmentFunc(item.id, modal);
    });
}

function addEmployeeModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    var jobId = item && {id: item.postId};
    var deptId = item ? {id: item.deptId} : $('#enterpriseNav').find('>ul>li.active').data('item');
    systemFunc.getProjectJobSelectList(modal, jobId);
    systemFunc.getDepartmentSelectList(modal, deptId);
}

/**
 * 添加员工信息
 */
function addEmployeeModalEvent() {
    var modal = arguments[0];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var deptName = modal.$body.find('[name=deptName]').val();
        var posName = modal.$body.find('[name=posName]').val();
        var mobile = modal.$body.find('[name=mobile]').val();
        var pwd = modal.$body.find('[name=pwd]').val();
        var name = modal.$body.find('[name=name]').val();
        var sex = modal.$body.find('[name=sex]:checked').val();
        var age = modal.$body.find('[name=age]').val();
        if (!deptName || deptName === 'a') {
            return alert('请选择部门');
        }
        if (!posName || posName === 'a') {
            return alert('请选择职务');
        }
        if (!mobile || mobile.trim() === '') {
            return alert('请输入手机号码');
        }
        if (!pwd) {
            return alert('请输入登录密码');
        }
        if (!name) {
            return alert('请输入姓名');
        }
        if (!sex) {
            return alert('请选择性别');
        }
        if (!age) {
            return alert('请输入员工年龄');
        }
        systemFunc.postEmployeeFunc({
            age: age,
            deptId: deptName,
            postId: posName,
            pwd: pwd,
            name: name,
            sex: sex,
            mobile: mobile
        }, modal);
    })
}

exports.initOrganizationStructureNavEvent = function () {
    var parents = arguments[0];
    var fatherParents = arguments[1];
    parents.find('li').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        fatherParents.find('li').removeClass('active');
        $(this).addClass('active');
        $("#sortOrganizationTable").removeClass('sort-active').html('排序');
        systemFunc.getEmployeeListFunc({deptId: item.id});
    });

    var trs = [];
    parents.find('li').each(function () {
        trs.push(this);
    })
    sortDepartment(trs);

    fatherParents.click(function (e) {
        $("#sortOrganizationTable").removeClass('sort-active').html('排序');
        common.stopPropagation(e);
        var item = $(this).data('item');
        $(this).find('li').removeClass('active');
        $(this).addClass('active');
        systemFunc.getEmployeeListFunc({deptId: item.id});
    });
    if (parents.find('li.active').length === 0) {
        parents.find('li:first').click();
    }
};

function sortDepartment(trs) {//部门排序
    var beginY;
    var first;
    for (var i = 0; i < trs.length; i++) {
        trs[i].ondragstart = function (e) {
            first = $(this).prevAll().length + 1;//表示拖动的是第几条数据
            beginY = e.pageY;//获取鼠标初始位置
        }
    }
    for (var i = 0; i < trs.length; i++) {
        trs[i].ondragend = function (e) {
            var trs2 = [];//获得重新排序的数组
            $('#enterpriseNav>ul>li').each(function () {
                trs2.push(this);
            })
            var num = parseInt((beginY - e.pageY) / 40);
            if (num > 0) {
                if (num < first) {//向上不超出范围
                    trs2[first - num - 1].before($(this)[0]);
                }
            } else {
                if (first - num <= trs.length) {//向下不超出范围
                    trs2[first - num - 1].after($(this)[0]);
                }
            }

            var deptArr = [];
            $('#enterpriseNav>ul>li').each(function () {
                deptArr.push($(this).attr('id'));
            })
            var deptIds = deptArr.join(';');
            var sortArr = [];
            for (var i = 0; i < deptArr.length; i++) {
                sortArr.push(i + 1);
            }
            var sortIds = sortArr.join(';');
            var data = {deptIds: deptIds, sortIds: sortIds};
            systemFunc.putDepartmentSortFunc(data);
        }
    }
}


/**
 * 企业信息事件
 */
exports.initEnterpriseSettingEvent = function () {
    var confirm = $('.confirm');
    if (confirm.length > 0 && !confirm.data('flag')) {
        confirm.data('flag', true);
        confirm.click(function (e) {
            common.stopPropagation(e);
            var etpName = $('[name=etpName]').val();
            var etpTel = $('[name=etpTel]').val();
            var etpLogo = $('[name=etpLogo]').attr('src');
            var etpType = $('[name=entpType]').val();
            var etpPerLevel = '';
            $('.etpPerLevel input').each(function () {
                if ($(this).prop('checked') === true) {
                    etpPerLevel += $(this).val() + ';';
                }
            })
            var etpProvince = $('[name=etpProvince] option:selected').text();
            var provinceId = $('[name=etpProvince]').val();
            var etpCity = $('[name=etpCity] option:selected').text();
            var cityId = $('[name=etpCity]').val();
            var etpEmail = $('[name=etpEmail]').val();
            var etpAddr = $('[name=etpAddr]').val();
            var etpNetAddr = $('[name=etpNetAddr]').val();
            if (!etpName) {
                return alert('请输入企业名称');
            }
            if (!etpTel) {
                return alert('请输入企业电话');
            }
            if (!etpType) {
                return alert('请输入企业性质');
            }
            if (!etpPerLevel) {
                return alert('请输入企业资质');
            }
            if (!etpProvince || etpProvince === '请选择') {
                return alert('请选择企业所在省份');
            }
            if (!etpCity || etpCity === '请选择') {
                return alert('请选择企业所在城市');
            }
            var data = {
                etpName: etpName,
                etpTel: etpTel,
                etpLogo: etpLogo,
                etpType: etpType,
                etpPerLevel: etpPerLevel,
                etpProvince: etpProvince,
                etpCity: etpCity,
                etpEmail: etpEmail,
                etpAddr: etpAddr,
                etpNetAddr: etpNetAddr,
                provinceId: provinceId,
                cityId: cityId
            };
            systemFunc.postCompanyInfoFunc(data);
        });
        $('#upload').change(function (e) {
            common.stopPropagation(e);
            var files = this.files;
            for (var i = 0, length = files.length; i < length; i++) {
                systemFunc.uploadCompanyLogo(files[i]);
            }
            this.value = '';
        });
    }
};

exports.initCompanyContractInfo = function () {
    var confirm = $('.confirm');
    if (confirm.length > 0 && !confirm.data('flag')) {
        confirm.data('flag', true);
        confirm.click(function (e) {
            common.stopPropagation(e);
            var userName = $('[name=userName]').val();
            var sex = $('[name=sex]:checked').val();
            var duty = $('[name=duty]').val();
            var mobilephone = $('[name=mobilephone]').val();
            var email = $('[name=email]').val();
            if (!userName) {
                return alert('请输入联系人姓名！');
            }
            if (!mobilephone) {
                return alert('请输入联系人手机号！');
            }
            if (!(/^1[34578]\d{9}$/.test(mobilephone))) {
                if (!( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(mobilephone))) {
                    return alert('请输入正确的联系方式!');//固话验证
                }
            }
            systemFunc.postCompanyContractInfo({
                userName: userName,
                sex: sex,
                duty: duty,
                mobilephone: mobilephone,
                email: email
            });
        });
    }
};


exports.initCompanyBillboardUpdate = function (parents) {
    var uploadImage = $('#uploadImage');
    if (uploadImage.length > 0 && !uploadImage.data('flag')) {
        uploadImage.data('flag', true);
        uploadImage.change(function (e) {
            common.stopPropagation(e);
            var files = this.files;
            for (var i = 0, length = files.length; i < length; i++) {
                systemFunc.uploadImage(files[i]);
            }
            this.value = '';
        });
        parents.find('.delete').click(function (e) {
            common.stopPropagation(e);
            var item = $(this).parents('.itemList').data('id');
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDeleteModalEvent(delModal, item);
        });
        parents.find('.uploadChange').click(function (e) {
            common.stopPropagation(e);
            var files = $(this).siblings('input[type=file]');
            files.click();
        });
        parents.find('input[type=file]').change(function (e) {
            common.stopPropagation(e);
            var parents = $(this).parents('.itemList');
            var files = this.files;
            for (var i = 0, length = files.length; i < length; i++) {
                systemFunc.resetUploadImage(files[i], parents);
            }
            this.value = '';
        });
    }
};

function initDeleteModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        systemFunc.delPropagationFunc(item.id, modal);
    });
}

exports.initCompanyBillboardUpdateEvent = function () {
    var confirm = $('.confirm');
    if (confirm.length > 0 && !confirm.data('flag')) {

        confirm.data('flag', true);
        confirm.click(function (e) {
            common.stopPropagation(e);
            var divs = $('#imagesList').find('.item');
            var arr = [];
            for (var i = 0, length = divs.length; i < length; i++) {
                var item = $(divs[i]).data('id');
                var data = {};
                data.url = item.attachUrl;
                data.thumbnailUrl = item.thumbnailUrl;
                data.pictureSize = item.attachSize;
                var type = item.attachType;
                var name = item.attachName;
                data.title = name.substring(0, name.length - (type.length + 1));
                arr.push(data);
                // systemFunc.postPropagationFunc(data);
            }
            systemFunc.postPropagationFunc(arr);
        })
    }
};

exports.initSingleBillboardEvent = function (parents) {
    parents.find('.delete').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('.itemList').data('id');
        var delModal = Model('提示', deleteModal());
        delModal.showClose();
        delModal.show();
        initNotUploadedEvent(delModal, item);
    });
};

function initNotUploadedEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        modal.hide();
        $('.v-' + item.id).remove();
    });
}

exports.initOrganizationStructureTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'edit') {
            var addEmploye = Model('修改部门员工', employeeModal());
            addEmploye.showClose();
            addEmploye.show();
            addEmployeeModalData(addEmploye, item);
            initUpdateEmployeeModalEvent(addEmploye, item);
            initUpdateEmployeeModalData(addEmploye, item);
        } else {
            var delModal = Model('提示', stopEmployee());
            delModal.showClose();
            delModal.show();
            var status = item.status === 1 ? '停用' : '启用';
            delModal.$body.find('.enterprise-remind').html('确定' + status + '<span class="span-color-blue">' + item.userName + '</span>使用么');
            if (item.status === 1) {
                delModal.$body.find('#materialEnterpriseModal span:last-child').html('停用原因')
                delModal.$body.find('textarea').attr('placeholder','请输入停用原因');
            } else if (item.status === 2) {
                delModal.$body.find('#materialEnterpriseModal span:last-child').html('启用原因')
                delModal.$body.find('textarea').attr('placeholder','请输入启用原因');
            }
            initOrganizationDelModalEvent(delModal, item);
            initOrganizationDelModalDom(delModal, item);
        }
    });
};

function initUpdateEmployeeModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('[name=age]').val(item.age);
    modal.$body.find('[name=pwd]').val(item.pwd);
    modal.$body.find('[name=name]').val(item.userName);
    modal.$body.find('[name=sex][value=' + item.sex + ']').prop('checked', true);
    modal.$body.find('[name=mobile]').val(item.mobile);
}

function initUpdateEmployeeModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.loginPwd').hide();
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var age = modal.$body.find('[name=age]').val();
        var name = modal.$body.find('[name=name]').val();
        var sex = modal.$body.find('[name=sex]:checked').val();
        var mobile = modal.$body.find('[name=mobile]').val();
        var deptName = modal.$body.find('[name=deptName]').val();
        var posName = modal.$body.find('[name=posName]').val();
        if (!deptName || deptName === 'a') {
            return alert('请选择部门');
        }
        if (!posName || posName === 'a') {
            return alert('请选择职务');
        }
        if (!age) {
            return alert('请输入员工年龄');
        }
        if (!name) {
            return alert('请输入姓名');
        }
        if (!sex) {
            return alert('请选择性别');
        }
        if (!mobile) {
            return alert('请输入手机号码');
        }
        systemFunc.putEmployeeFunc({
            age: age,
            deptId: deptName,
            postId: posName,
            name: name,
            sex: sex,
            mobile: mobile,
            id: item.id
        }, modal);
    })
}


function initOrganizationDelModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var type = item.status === 1 ? 2 : 1;
        var reason = modal.$body.find('textarea').val();
        if (!reason) {
            var status = item.status === 1 ? '停用' : '启用';
            return alert('请输入' + status + '原因');
        }
        systemFunc.stopOrOpenEmployee({empId: item.id, operateType: type, reason: reason}, modal);
    });
    modal.$body.find('.budget-menus a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        modal.$body.find('.budget-menus a').removeClass('active');
        $(this).addClass('active');
        modal.$body.find('.modal-item').hide();
        modal.$body.find('.' + type).show();
    });
    modal.$body.find('.budget-menus a:first').click();
}

function initOrganizationDelModalDom() {
    var modal = arguments[0];
    var item = arguments[1];
    systemFunc.getStopOrOpenEmployee({empId: item.id}, modal);
}

/**
 * 项目职务列表
 */
exports.initProjectJobListEvent = function () {
    var addJob = $('#addJob');
    if (addJob.length > 0 && !addJob.data('flag')) {
        addJob.data('flag', true);
        addJob.click(function (e) {
            common.stopPropagation(e);
            var addJob = Model('新增项目部职务', addJobModal());
            addJob.showClose();
            addJob.show();
            initProjectJobAddJobModalEvent(addJob);
        });
    }
};

function initProjectJobAddJobModalEvent() {
    var modal = arguments[0];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var posName = modal.$body.find('[name=posName]').val();
        var describes = modal.$body.find('[name=describes]').val();
        if (!posName) {
            return alert('请输入职务名称');
        }
        systemFunc.postAddJobFunc({
            posName: posName,
            describes: describes
        }, modal);
    });
}

exports.initProjectJobTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'edit') {
            var addJob = Model('修改项目部职务', addJobModal());
            addJob.showClose();
            addJob.show();
            initEditJobModalEvent(addJob, item);
            initEditJobModalData(addJob, item);
        } else {
            var delModal = Model('提示', deleteModal());
            delModal.showClose();
            delModal.show();
            initDeleteJobModalEvent(delModal, item)
        }
    })
};

function initEditJobModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('[name=posName]').val(item.posName);
    modal.$body.find('[name=describes]').val(item.describes);
}

function initEditJobModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var posName = modal.$body.find('[name=posName]').val();
        var describes = modal.$body.find('[name=describes]').val();
        if (!posName) {
            return alert('请输入职务名称');
        }
        systemFunc.putProjectJobFunc({id: item.id, posName: posName, describes: describes}, modal);
    })
}

function initDeleteJobModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        systemFunc.delProjectJobFunc(item.id, modal);
    });
}

exports.initAddRoleEvent = function () {
    var confirm = $('.confirm');
    if (confirm.length > 0 && !confirm.data('flag')) {
        confirm.data('flag', true);
        confirm.click(function (e) {
            common.stopPropagation(e);
            var id = $(this).data('id');
            var postName = $('[name=postName]').val();
            var describes = $('[name=describes]').val();
            var resources = [];
            if (!postName) {
                return alert('请输入职务名称');
            }
            var addRoleTable = $('#addRoleTable tr [type=checkbox]:checked');
            for (var i = 0, length = addRoleTable.length; i < length; i++) {
                var input = $(addRoleTable[i]);
                var tr = input.parents('tr');
                resources.push(tr.data('item').id);
            }
            // if (resources.length === 0) {
            //   return alert('请给职务赋予权限');
            // }
            if (id) {
                systemFunc.putJobFunc({id: id, postName: postName, describes: describes, resources: resources});
            } else {
                systemFunc.postAddJobListFunc({postName: postName, describes: describes, resources: resources});
            }
        });
    }
};


exports.initEmployeeRoleTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'add') {
            var _addEmployee = Model('添加人员', $addEmployeeModal());
            _addEmployee.showClose();
            _addEmployee.show();
            initAddEmployeeEvent(_addEmployee, item);
        } else if (type === 'edit') {
            window.location.href = '/system/role/add?posId=' + item.postId + '';
        } else if (type === 'delete') {
            var delModal = Model('提示', deleteModal());
            delModal.show();
            delModal.showClose();
            initDeleteEmployeeRoleEvent(delModal, item);
        }
    })
};

function initDeleteEmployeeRoleEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        systemFunc.delJobFunc(item.postId, modal);
    });
}

function initAddEmployeeEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('[name=postName]').val(item.postName);
    var employee = modal.$body.find('#employee');
    try {
        var userString = item.userNos.substr(0, item.userNos.length - 1);
        if (item.employees) {
            employee.text(item.employees);
        }
        employee.data('users', userString.split(';'));
    } catch (e) {
    }
    employee.click(function (e) {
        common.stopPropagation(e);
        var list = $(this).data('users');
        var that = this;
        var $employee = new addEmployee('添加员工', function (data) {
            $(that).data('users', data);
            var userNames = [];
            for (var i = 0, length = data.length; i < length; i++) {
                userNames.push(data[i].userName);
            }
            $(that).text(userNames.join(';'));
            $employee.hide();
        });
        $employee.getUserTreeList(function () {
            $employee.renderSelectData(list);
        }, 'single');
        $employee.show();
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        if (item.sysType === 2) {
            var systemRemind = Model('提示', systemRemindModal());
            systemRemind.show();
            systemRemind.showClose();
            systemRemind.$body.find('.confirm').click(function (e) {
                common.stopPropagation(e);
                addRoleEmployee(employee, item, modal, systemRemind);
            });
        } else {
            addRoleEmployee(employee, item, modal);
        }
    });
}

function addRoleEmployee(employee, item, modal, childModal) {
    var users = employee.data('users') || [];
    var userNos = [];
    for (var i = 0, length = users.length; i < length; i++) {
        userNos.push(users[i].userNo);
    }
    if (userNos.length === 0) {
        return alert('请添加用户');
    }
    systemFunc.putEmployeePost({postId: item.postId, userNos: userNos}, modal, childModal);
}

/**
 * 初始化账户事件处理
 */
exports.initAccountInfoEvent = function () {
    var confirm = $('.confirm');
    if (confirm.length > 0 && !$(confirm[0]).data('flag')) {
        confirm.data('flag', true);
        confirm.click(function (e) {
            common.stopPropagation(e);
            var checkbox = $('#checkbox').prop('checked');
            if (!checkbox) {
                return alert('请同意服务协议');
            }
            var type = $(this).data('type');
            var limitTime = $('.selectType').data('y');
            limitTime = parseDayNum(limitTime);
            var count = $('[name=count]').text();
            var money = $('[name=money]').text();
            var day = $('[name=day]').text();
            if (type === 1) {
                systemFunc.postAccountPayableFunc({count: count, type: type, years: limitTime}, function (res) {
                    if (res.buyOrRenewal === 1) {
                        var immediatelyModal = Model('购买', immediatelyOrderModal());
                        immediatelyModal.showClose();
                        immediatelyModal.show();
                        initImmediatelyModalEvent(res.endTime, count, res.price, immediatelyModal, limitTime);
                    } else if (res.buyOrRenewal === 2) {
                        var continuedModal = Model('续费', continuedBuyingModal());
                        continuedModal.showClose();
                        continuedModal.show();
                        initContinuedModalEvent(res, continuedModal, limitTime);
                    }
                });
            } else if (type === 2) {
                var accountModal = Model('追加帐号', addAccountModal());
                accountModal.showClose();
                accountModal.show();
                initAccountChaseModalEvent(accountModal);
            } else if (type === 3) {
                var purchaseModal = Model('购买存储', purchaseStorageModal());
                purchaseModal.showClose();
                purchaseModal.show();
                initAccountChaseModalEvent(purchaseModal);
            }
        });
        $('.vip-type').click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            var y = $(this).data('y');
            var vipType = $('.vip-type');
            for (var i = 0; i < vipType.length; i++) {
                if (!$(vipType[i]).hasClass('background-list-gray')) {
                    $(vipType[i]).addClass('background-list-gray');
                    $(vipType[i]).removeClass('selectType');
                }
            }
            $(this).removeClass('background-list-gray');
            $(this).addClass('selectType');
            var count = $('.count').text();
            var year = parseDayNum(y);
            var totalMoney = priceFindByCount(count) * parseFloat(type) * year;
            $('[name=money]').text(totalMoney.toFixed(2));
            $('[name=limit]').text(y);
        });
        $('.left').click(function (e) {
            common.stopPropagation(e);
            var count = $('.count').text();
            var selectType = $('.selectType').data('type');
            if (isNaN(count)) {
                return alert('个数错误请刷新页面重新计算');
            }
            count = parseInt(count);
            if (count > 10) {
                --count;
                $('.count').text(count);
            }
            var totalMoney = priceFindByCount(count) * parseFloat(selectType);
            $('[name=money]').text(totalMoney.toFixed(2));
            $('[name=count]').text(count);
        });
        $('.right').click(function (e) {
            common.stopPropagation(e);
            var count = $('.count').text();
            var selectType = $('.selectType').data('type');
            if (isNaN(count)) {
                return alert('个数错误请刷新页面重新计算');
            }
            count = parseInt(count);
            if (10 <= count && count < 100) {
                count++;
                $('.count').text(count);
            }
            var totalMoney = priceFindByCount(count) * parseFloat(selectType);
            $('[name=money]').text(totalMoney.toFixed(2));
            $('[name=count]').text(count);
        });
        $('#checkServiceAgreement').click(function (e) {
            common.stopPropagation(e);
            // todo
            var ServiceAgreement = Model(null, ServiceAgreementModal());
            ServiceAgreement.$header.hide();
            ServiceAgreement.show();
            ServiceAgreement.showClose();
        })
    }
};

function priceFindByCount(count) {
    count = parseInt(count);
    if (count === 10) {
        return 10 * 699;
    } else if (10 < count && count <= 30) {
        return count * 619;
    } else if (30 < count && count <= 60) {
        return count * 549;
    } else if (60 < count && count <= 100) {
        return count * 479;
    } else if (count > 100) {
        return count * 419;
    }
}

function parseDayNum(type) {
    switch (type) {
        case '一年':
            return 1;
        case '二年':
            return 2;
        case '三年':
            return 3;
    }
}


function initImmediatelyModalEvent(limitTime, count, money, immediatelyModal, time) {
    immediatelyModal.$body.find('[name=limitTime]').text(limitTime);
    immediatelyModal.$body.find('[name=count]').text(count + '个');
    immediatelyModal.$body.find('[name=money]').text(money + '元');
    immediatelyModal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        systemFunc.postOrderFunc({type: 1, count: parseInt(count), years: time}, immediatelyModal);
    })
}

function initContinuedModalEvent(res, continuedModal, time) {
    continuedModal.$body.find('[name=endTime]').text(res.endTime);
    continuedModal.$body.find('[name=accCount]').text(res.accCount + '个');
    continuedModal.$body.find('[name=xuEndTime]').text(res.xuEndTime);
    continuedModal.$body.find('[name=xuAccCount]').text(res.xuAccCount + '个');
    continuedModal.$body.find('[name=price]').text(res.price + '元');
    continuedModal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        systemFunc.postOrderFunc({type: 1, count: parseInt(res.xuAccCount), years: time}, continuedModal);
    })
}

/**
 * 追加帐号
 * @param modal
 */
function initAccountChaseModalEvent(modal) {
    var limitTime = $('[name=limitTime]').text();
    modal.$body.find('[name=modal-limit]').text(limitTime);
    modal.$body.find('.modal-left').click(function (e) {
        common.stopPropagation(e);
        if ($(this).parents('.page-account-index').children('div').length === 3) {//子div元素为3个时，类型为追加账号
            var type = 2;
        } else {
            var type = 3;
        }
        var count = modal.$body.find('.count').text();
        if (isNaN(count)) {
            return alert('请输入正确的数字');
        }
        count = parseInt(count);
        if (count > 0) {
            --count;
            modal.$body.find('.count').text(count);
        }
        systemFunc.postAccountPayableFunc({count: count, type: type}, function (data) {
            modal.$body.find('.price').text(data.price)
        });
    });
    modal.$body.find('.modal-right').click(function (e) {
        if ($(this).parents('.page-account-index').children('div').length === 3) {//子div元素为3个时，类型为追加账号
            var type = 2;
        } else {
            var type = 3;
        }
        common.stopPropagation(e);
        var count = modal.$body.find('.count').text();
        if (isNaN(count)) {
            return alert('请输入正确的数字');
        }
        count = parseInt(count);
        if (count >= 0) {
            count++;
            modal.$body.find('.count').text(count);
        }
        systemFunc.postAccountPayableFunc({count: count, type: type}, function (data) {
            modal.$body.find('.price').text(data.price)
        });
    });
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var count = modal.$body.find('.count').text();
        if (count === '0') {
            return alert('请添加要追加的个数');
        }
        systemFunc.postOrderFunc({count: count, type: type}, modal);
    });
}


exports.initOrderTableEvent = function (parents) {
    parents.find('a').click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data('type');
        var item = $(this).parents('tr').data('item');
        if (type === 'pay') {
            var payModal = Model('付款', payOrderModal());
            payModal.showClose();
            payModal.show();
            initPayOrderModalEvent(payModal, item);
        } else if (type === 'detail') {
            var detailModal = Model('详情', dateilOrderModal());
            detailModal.showClose();
            detailModal.show();
            renderSystemTable.initDetailModalData(detailModal, item);
        } else if (type === 'delete') {
            var deleModal = Model('提示', deleteModal());
            deleModal.showClose();
            deleModal.show();
            deleModal.$body.find('.confirm ').click(function (e) {
                common.stopPropagation(e);
                systemFunc.delOrderFindByIdFunc(item.id, deleModal);
            })
        }
    });
    parents.find('.apply').change(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var receiptModal = Model('发票', receiptOrderModal());
        receiptModal.showClose();
        receiptModal.show();
        if ($(this).hasClass('checked')) {
            $(this).prop('checked', true);
            systemFunc.getInvoiceInfoFunc(item.id, receiptModal, item);
            initApplyInvoiceModalEvent(receiptModal, item);
        } else {
            $(this).prop('checked', false);
            initApplyInvoiceModalEvent(receiptModal, item);
        }
    });
    parents.find('.open').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('checked')) {
            $(this).prop('checked', true);
        } else {
            $(this).prop('checked', false);
        }
    })
};

function initPayOrderModalEvent(modal, item) {
    systemFunc.getAdminAccountBankInfoFunc(item.id, modal);
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var payName = modal.$body.find('[name=payName]').val();
        var payBankNo = modal.$body.find('[name=payBankNo]').val();
        var payBankMoney = modal.$body.find('[name=payBankMoney]').val();
        var payType = modal.$body.find('[name=payType]:checked').val();
        if (!payName) {
            return alert('请输入付款方');
        }
        if (!payBankNo) {
            return alert('请输入付款帐号');
        }
        if (!payBankMoney) {
            return alert('请输入实付金额');
        }
        if (!payType) {
            return alert('请选择付款方式');
        }
        systemFunc.postPayMoneyFunc({
            id: item.id,
            payBankMoney: payBankMoney,
            payName: payName,
            payBankNo: payBankNo,
            payType: payType
        }, modal);
    });
}

function initApplyInvoiceModalEvent() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.confirm').click(function (e) {
        common.stopPropagation(e);
        var invoiceTitle = modal.$body.find('[name=invoiceTitle]').val();
        var entpAddress = modal.$body.find('[name=entpAddress]').val();
        var mobile = modal.$body.find('[name=mobile]').val();
        var taxNo = modal.$body.find('[name=taxNo]').val();
        var contactName = modal.$body.find('[name=contactName]').val();
        var expressAddress = modal.$body.find('[name=expressAddress]').val();
        var otherRemark = modal.$body.find('[name=otherRemark]').val();
        if (!invoiceTitle) {
            return alert('请输入发票抬头');
        }
        if (!entpAddress) {
            return alert('请输入企业地址');
        }
        if (!mobile) {
            return alert('请输入联系电话');
        }
        if (!taxNo) {
            return alert('请输入税号');
        }
        if (!contactName) {
            return alert('请输入联系人');
        }
        if (!expressAddress) {
            return alert('请输入邮寄地址');
        }
        systemFunc.applyInvoiceFunc({
            orderId: item.id,
            invoiceTitle: invoiceTitle,
            entpAddress: entpAddress,
            mobile: mobile,
            taxNo: taxNo,
            contactName: contactName,
            expressAddress: expressAddress,
            otherRemark: otherRemark
        }, modal);
    });
}


