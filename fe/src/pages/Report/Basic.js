var request = require('../../helper/request');
var Model = require('../../components/Model');
/**
 * 获取model 里面select 的数据
 */
function getData (addModel) {
  var sectionType = addModel.$body.find(".sectionType");//栏目分类
  var projectDepartment = addModel.$body.find(".projectDepartment");//项目部门
  request.post("/customer/buildNews/findBuildNewsTypeList")
    .then(function (res) {
      var parents = sectionType.html("");
      $('<option value="0">请输入</option>').appendTo(parents);
      if (res.code === 1 && res.data) {
        var list = res.data.data || [];
        for (var i = 0; i < list.length; i++) {
          var dom = $("<option></option>");
          dom.val(list[i].newsTypeNo);
          dom.text(list[i].newsTypeName);
          dom.appendTo(parents);
        }
      }
    });
  request.post("/customer/staff/findProjDeptListByUserNo")
    .then(function (res) {
      var parents = projectDepartment.html("");
      $('<option value="0">请输入</option>').appendTo(parents);
      if (res.code === 1 && res.data) {
        var list = res.data.data || [];
        for (var i = 0; i < list.length; i++) {
          var dom = $("<option></option>");
          dom.val(list[i].projDeptNo);
          dom.text(list[i].projDeptName);
          dom.appendTo(parents);
        }
      }
    });
}
module.exports = getData;