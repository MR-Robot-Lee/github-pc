var request = require('../../helper/request');
var Common = require('../Common');
var Modal = require("../../components/Model");
var addType = require("./modals/addType.ejs");
var deleteModal = require("./modals/deleteModal.ejs");

/**
 * 获取所有的栏目分类
 */
function getReportsList () {
  request.post("/customer/buildNews/findBuildNewsTypeList").then(function (res) {
    var parents = $("#sectionType").html("");
    if (res.code === 1 && res.data) {
      var list = res.data.data || [];
      if (list.length > 0) {
        $('#noInfoSectionType').hide();
        $('#sectionTypeList').show();
      } else {
        $('#noInfoSectionType').show();
        $('#sectionTypeList').hide();
      }
      for (var i = 0; i < list.length; i++) {
        var dom = renderSectionType(list[i],i);
        dom.data("item", list[i]);
        dom.appendTo(parents);
      }
      parents.find(".edit").click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).parents("tr").data("item");
        var addModel = Modal("修改分类", addType());
        addModel.showClose();
        addModel.show();
        addModel.$body.find(".typeName").val(item.newsTypeName);
        addModel.$body.find(".typeDesc").val(item.remark);
        addModel.$body.find(".type-save").data("id", item.id);
        initAddModelEvent(addModel);
      });
      parents.find(".delete").click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).parents("tr").data("item");
        var delModel = Modal('提示', deleteModal());
        delModel.showClose();
        delModel.show();
        delModel.$body.find('.confirm').click(function (e) {
          Common.stopPropagation(e);
          request.post("/customer/buildNews/delBuildNewsType/" + item.id)
            .then(function (res) {
              if (res.code === 1) {
                delModel.hide();
                getReportsList();
              }
            })
        })
      });
      var user = window.localStorage.getItem('user');
      user = user ? JSON.parse(user) : { permission: {} };
      var type = user.permission['buildNews:type:*'];
      if (type) {
        $('#typeHandle').show();
        parents.find('.handler').show();
      } else {
        $('#typeHandle').hide();
        parents.find('.handler').hide();
      }
    }
  })
}

/**
 * 绘制dom
 * @param item
 * @returns {*|jQuery|HTMLElement}
 */
function renderSectionType (item,i) {
  return $('<tr>\
                 <td>'+(i+1)+'</td>\
                <td style="padding-left: 20px">' + item.newsTypeName + '</td>\
                <td>' + item.remark + '</td>\
                 <td>' + new Date(item.addTime).Format("yyyy-MM-dd hh:mm") + '</td>\
                <td>' + item.userName + '</td>\
                <td>' + item.newsCount + '</td>\
                <td class="handler">\
                <a class="edit confirm-hover">编辑</a>\
                <div class="icon-line"></div>\
                <a class="delete delete-hover">删除</a>\
                </td>\
             </tr>');
}

function getReportType () {
  var reportType = $("#reportType");
  if (reportType.length > 0 && !reportType.data("flag")) {
    reportType.data("flag", true);
    /**
     * 获取添加model
     */
    reportType.click(function (e) {
      Common.stopPropagation(e);
      var addModel = Modal("添加分类", addType());
      addModel.showClose();
      addModel.show();
      initAddModelEvent(addModel);
    });
    /**
     * 获取所有数据调用
     */
    getReportsList();
  }
}

function initAddModelEvent (modal) {
  modal.$body.find(".type-save").click(function (e) {
    Common.stopPropagation(e);
    var id = $(this).data("id");
    var $type = modal.$body.find(".typeName").val();
    var $desc = modal.$body.find(".typeDesc").val();
    if (!$type) {
      return alert("请输入栏目名称");
    }
    if (!$desc) {
      return alert("请输入栏目描述");
    }
    if ($desc.length > 36) {
      return alert('输入字符已经有' + $desc.length + '超过36个');
    }
    if (id) {
      request.post("/customer/buildNews/modifyBuildNewsType", {
        body: {
          typeId: id,
          typeName: $type,
          typeDesc: $desc
        }
      }).then(function (res) {
        if (res.code === 1) {
          modal.hide();
          getReportsList();
        }
      })
    } else {
      request.post("/customer/buildNews/addBuildNewsType", {
        body: { typeName: $type, typeDesc: $desc }
      }).then(function (res) {
        if (res.code === 1) {
          modal.hide();
          getReportsList();
        }
      })
    }
  });
}

module.exports = getReportType;