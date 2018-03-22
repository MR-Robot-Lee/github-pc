var initEvent = require('./initEvent');
var projectInitEvent = require('../initEvent');

exports.renderOrganizeStrumentModalTable = function (list, modal, parents, type) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var sex = item.sex === 1 ? '男' : '女';
        var mobile = item.mobile || item.phone;
        var dom = $('<tr class="small ' + type + '">\
      <td class="border">' + item.userName + '</td>\
      <td class="border">\
      <div class="select" style="font-size: 12px;color: #333;cursor: pointer;">单击选择</div>\
      <div class="role"></div>\
      </td>\
      <td class="border">' + sex + '</td>\
      <td class="border">' + item.age + '</td>\
      <td class="border">' + mobile + '</td>\
      <td class="border"><a data-type="delete">删除</a></td>\
      </tr>');
        if (item.projPosId) {
            dom.find('.select').text(item.projPosName);
            dom.find('.select').data('id', item.projPosId);
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initOrganizeStrumentModalEvent(parents);
};

exports.renderOrganizeStrumentOutModalTable = function (list, modal) {
    list = list || [];
    var parents = modal.$body.find('#outsetEmployee').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var sex = item.sex === 1 ? '男' : '女';
        var projPosName = item.projPosName || '无';
        var dom = $('<tr class="small">\
                  <td class="border">' + item.userName + '</td>\
                  <td class="border">' + projPosName + '</td>\
                  <td class="border">' + sex + '</td>\
                  <td class="border">' + item.age + '</td>\
                  <td class="border">' + item.phone + '</td>\
                  <td class="border">\
                   <a data-type="delete" class="delete-a">删除</a>\
                   <div class="icon-line"></div>\
                   <a data-type="update" class="edit-a">修改</a>\
                  </td>\
                </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initOrganizationOutEvent(parents, modal);
    this.renderOrganizeFloatingPopulationTable(list);
};

exports.renderOrganizeFloatingPopulationTable = function (list) {
    list = list || [];
    var parents = $('#addPopula').html('');
    if (list.length < 1) {//无数据隐藏
        $('#addPopula').parent().parent().hide();
        $('#addPopula').parent().parent().prev().hide();
    }
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var sex = item.sex === 1 ? '男' : '女';
        var projPosName = item.projPosName || '无';
        var dom = $('<tr class="small">\
      <td class="border">' + item.userName + '</td>\
      <td class="border">' + projPosName + '</td>\
      <td class="border">' + sex + '</td>\
      <td class="border">' + item.age + '</td>\
      <td class="border">' + item.phone + '</td>\
      <td class="border" style="position: relative"><a data-type="check-detail" class="edit-a">查看</a></td>\
      <td class="border" style="position: relative"><a data-type="check-job" class="edit-a">查看</a></td>\
      </tr>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initOrganizeFloatingPopulationTableEvent(parents);
};

exports.renderOrganizeFloatingJobSelect = function (list, id) {
    list = list || [];
    var parents = $('#projPosId').html('');
    $('<option value="a">请选择</option>').appendTo(parents);
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<option></option>');
        dom.text(item.posName);
        dom.val(item.id);
        dom.appendTo(parents);
        if (id === item.id) {
            parents.find('option[value=' + id + ']').attr('selected', true);
        }
    }
};

exports.renderOrganizeStruEmployeeTable = function (list, data) {
    list = list || [];
    var parents = $('#employeeTable').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        console.log(item);
        var sex = item.sex === 1 ? '男' : '女';
        var projPosName = item.projPosName || '暂无';
        var status = '';
        if(item.status === 2){
            status = '<span style="color: #fff;padding: 2px 8px;background-color: #df5454;margin-left: 5px;border-radius: 3px ">停用</span>';
        }
        var dom = $('<tr class="small">\
      <td class="border">' + item.userName + status + '</td>\
      <td class="border">' + projPosName + '</td>\
      <td class="border">' + sex + '</td>\
      <td class="border">' + item.age + '</td>\
      <td class="border">' + item.phone + '</td>\
      <td class="border job-desc">' + item.postName + '</td>\
      <td class="border" style="position: relative"><a class="edit-a" data-type="check">查看</a><span style="margin: 0 5px;">|</span><a class="edit-a" data-type="replace">任务转移</a></td>\
      </tr>');
        for (var j = 0; j < data.data.length; j++) {
            if (data.data[j].postName == item.postName) {
                dom.data('postId', data.data[j].postId);
                break;
            }
        }
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initOrganizationInEvent(parents);
};

exports.renderOrganizeStruDetail = function (obj) {
    obj = obj[0] ? obj[0] : {};
    $('[name=projDeptName]').text(obj.projDeptName);
    $('[name=chargeName]').text(obj.chargeName);
    if (obj.id) {
        $('#add').hide();
        $('#addContent').hide();
        $('#updateContent').show();
        $('#update').show();
    } else {
        $('#update').hide();
        $('#add').show();
        $('#addContent').show();
        $('#updateContent').hide();
    }
    $('#changeUpdate').data('item', {
        id: obj.id,
        projDeptName: obj.projDeptName,
        chargeNo: obj.chargeNo,
        chargeName: obj.chargeName
    })
};

exports.renderTaskTable = function (list, type) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    list = list || [];
    var parents = $('#taskDistributionTable');
    parents.find('.' + type).remove();
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var positonRemark = item.positonRemark || ' ';
        var dom = $('<tr class="active ' + type + '">\
                  <td>' + item.userName + '</td>\
                  <td>' + positonRemark + '</td>\
                  <td style="position: relative" class="Competence">\
                   <a data-type="edit" class="edit-a">编辑</a>\
                   <div class="icon-line"></div>\
                   <a data-type="delete" class="delete-a">删除</a>\
                  </td>\
                </tr>');
        dom.data('item', {id: item.id, type: type});
        dom.appendTo(parents)
    }
    initEvent.initTaskTableEvent(parents, type);
};

exports.renderOrganizePositionSelect = function (list, parents) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var dom = $('<div class="job-item">\
      <span class="icon-circle"></span>\
      <span>' + item.posName + '</span>\
      </div>');
        dom.data('item', item);
        dom.appendTo(parents);
    }
    initEvent.initOrganizePositionSelectEvent(parents);
};