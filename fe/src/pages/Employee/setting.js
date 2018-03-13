var request = require('../../helper/request');
var Model = require('../../components/Model');
var Common = require('../Common');
var delProjectEjs = require('./models/delProject.ejs');
var addTypeEjs = require('./models/addType.ejs');
/**
 * 类型设置
 */
function getSetting () {
  var model = Model("添加类型", addTypeEjs());
  var settingType = $("#settingType");
  if (!settingType.data("flag")) {
    settingType.data("flag", true);

    settingType.click(function (e) {
      Common.stopPropagation(e);
      model.show();
    });

    /**
     * 删除项目部
     */
    var delModel = Model(null, delProjectEjs());
    delModel.$header.hide();
    delModel.$body.find(".del-confirm").click(function (e) {
      Common.stopPropagation(e);
      if ($(this).data("type") === "setting") {
        request.post("/customer/staff/delProjDeptNo/" + $(this).data("id")).then(function (res) {
          if (res.code === 1) {
            getAllSetting();
            delModel.hide();
          } else {
            return alert(res.desc);
          }
        })
      }
    });
    /**
     * 更新保存类型
     */
    model.$body.find(".type-save").click(function (e) {
      Common.stopPropagation(e);
      var id = $(this).data("id");
      var type = model.$body.find(".typeName");
      var name = type.val();
      var typeDesc = model.$body.find(".typeDesc");
      var desc = typeDesc.val();
      if (!name) {
        return alert("请输入类型名称");
      }
      if (!desc) {
        return alert("请输入类型描述");
      }
      if (id) {
        request.post("/customer/staff/modifyProjDeptType", {
          body: { desc: desc, projDeptTypeNo: id, projDeptTypeName: name }
        }).then(function (res) {
          if (res.code === 1) {
            getAllSetting();
            model.hide();
            type.val("");
            typeDesc.val("");
          } else {
            return alert(res.desc);
          }
        })
      } else {
        request.post("/customer/staff/addProjDeptType",
          { body: { desc: desc, projDeptTypeName: name } })
          .then(function (res) {
            if (res.code === 1) {
              getAllSetting();
              model.hide();
              type.val("");
              typeDesc.val("");
            } else {
              return alert(res.desc);
            }
          })
      }
    });
    function renderTbody (item) {
      return $('<tr data-id="' + item.projDeptTypeNo + '">\
      <td>' + item.projDeptTypeName + '</td>\
      <td>' + item.remark + '</td>\
      <td>' + item.addTime + '</td>\
      <td>' + item.userName + '</td>\
      <td>' + item.companyNo + '</td>\
      <td>\
        <a class="employee-edit" data-name="' + item.projDeptTypeName + '" data-desc="' + item.remark + '">编辑</a>\
        <div class="icon-line"></div>\
        <a class="employee-delete" >删除</a>\
      </td>\
    </tr>');
    }

    function getAllSetting () {
      request.post("/customer/staff/findProjDeptTypeList")
        .then(function (res) {
          var settings = $("#settings").html("");
          if (res.code === 1 && res.data) {
            var list = res.data.data || [];
            for (var i = 0; i < list.length; i++) {
              var dom = renderTbody(list[i]);
              dom.appendTo(settings);
            }
            /**
             * 编辑类型设置
             */
            settings.find(".employee-edit").click(function (e) {
              Common.stopPropagation(e);
              model.show();
              model.$body.find(".typeName").val($(this).data("name"));
              model.$body.find(".typeDesc").text($(this).data("desc"));
              model.$body.find(".type-save").data("id", $(this).parents("tr").data("id"));
            });
            /**
             * 删除类型设置
             */
            settings.find(".employee-delete").click(function (e) {
              Common.stopPropagation(e);
              var id = $(this).parents("tr").data("id");
              var name = $(this).prev().data("name");
              delModel.$body.find(".del-content").text(name);
              delModel.$body.find(".del-confirm").data("id", id);
              delModel.$body.find(".del-confirm").data("type", "setting");
              delModel.show();
            });
          }
        })
    }

    /**
     * 获取所有设置类型接口
     */
    getAllSetting();
  }
}
module.exports = getSetting;