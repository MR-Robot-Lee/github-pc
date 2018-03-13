var request = require('../../helper/request');
var Model = require('../../components/Model');
var Common = require('../Common');
var delProjectEjs = require('./models/delProject.ejs');
var addProjectEjs = require('./models/addProject.ejs');

/**
 * 全部项目
 */
function getProjectAll() {
    var emplyeeSearch = $("#employeeSearch");

    if (!emplyeeSearch.data("flag")) {
        emplyeeSearch.data("flag", true);
        var model = Model("添加项目内容", addProjectEjs());

        /**
         * 删除项目部
         */
        var delModel = Model(null, delProjectEjs());
        delModel.$header.hide();
        delModel.$body.find(".del-confirm").click(function (e) {
            Common.stopPropagation(e);
            if ($(this).data("type") === "employees") {
                request.post("/customer/staff/delProjDept/" + $(this).data("id")).then(function (res) {
                    if (res.code === 1) {
                        emplyeeSearch.click();
                        delModel.hide();
                    } else {
                        return alert(res.desc);
                    }
                })
            }
        });
        /**
         * 获取施工人员个数
         */
        /*request.post("/customer/attend/staticsCounts")
          .then(function (res) {
            if (res.code === 1) {
              $(".allDayManager").text(res.data.todayMananger + "人");
              $(".allDayWorker").text(res.data.todayWorker + "人");
              $(".allYesterdayMan").text(res.data.yestdayMananger + "人");
              $(".allYesterdayWorker").text(res.data.yestdayWorker + "人");
            }
          });*/
        /**
         *获取项目类型
         */
        var preTypeMain = $(".preTypeMain").html("");
        $("<option value='0'>项目类型</option>").appendTo(preTypeMain);

        var itemType = model.$body.find(".itemType").html('');
        $("<option value='0'>请选择</option>").appendTo(itemType);
        request.post("/customer/staff/findProjDeptTypeList")
            .then(function (res) {
                if (res.code === 1 && res.data) {
                    var list = res.data.data || [];
                    for (var i = 0; i < list.length; i++) {
                        var dom = $('<option></option>');
                        dom.text(list[i].projDeptTypeName);
                        dom.val(list[i].id);
                        preTypeMain.append(dom);
                        itemType.append(dom.clone());
                    }
                }
            });
        /**
         * 添加项目部内容
         */
        $("#addProject").click(function (e) {
            Common.stopPropagation(e);
            model.show();
            /**
             * 获取工程类型接口
             */
            var parent = model.$body.find(".preType").html('');
            $('<option value="0">请选择</option>').appendTo(parent);
            request.post('/customer/project/findProjType')
                .then(function (res) {
                    if (res.code === 1 && res.data) {
                        var list = res.data.data || [];
                        for (var i = 0; i < list.length; i++) {
                            var dom = $('<option></option>');
                            dom.text(list[i].projTypeName);
                            dom.val(list[i].projTypeNo);
                            dom.appendTo(parent);
                        }
                    }
                });
            /**
             * 获取工程名称
             */
            var preName = model.$body.find(".preName").html('');
            $('<option value="0">请选择</option>').appendTo(preName);
            var preNo = model.$body.find(".preNo").html('');
            parent.change(function (e) {
                Common.stopPropagation(e);
                var id = $(this).val();
                request.post('/customer/project/findProjByType/' + id)
                    .then(function (res) {
                        if (res.code === 1 && res.data) {
                            var list = res.data.data || [];
                            for (var i = 0; i < list.length; i++) {
                                var dom = $('<option></option>');
                                dom.text(list[i].projectName);
                                dom.val(list[i].projectNo);
                                dom.appendTo(preName);
                            }
                        }
                    });
            });
            preName.change(function (e) {
                Common.stopPropagation(e);
                if (!$(this).val() || $(this).val() === '0') {
                    model.$body.find(".preNo").val("");
                } else {
                    model.$body.find(".preNo").val($(this).val());
                }
            });
        });
        /**
         * 保存项目
         */
        var body = model.$body;
        body.find(".add-save").click(function (e) {
            Common.stopPropagation(e);
            var preType = body.find(".preType").val();
            var preName = body.find(".preName").text();
            var preNo = body.find(".preNo").val();
            var itemName = body.find(".itemName").val();
            var itemType = body.find(".itemType").val();
            if (!preType || preType === "0") {
                return alert("请选择工程类型");
            }
            if (!preName || preName === "0") {
                return alert("请选择工程类型");
            }
            if (!preName || preName === "0") {
                return alert("请选择工程名称");
            }
            if (!preNo) {
                return alert("请选择工程名称");
            }
            if (!itemName) {
                return alert("请输入项目部名称");
            }
            if (!itemType || itemType === "0") {
                return alert("请选择项目分类");
            }
            request.post("/customer/staff/addProjDept",
                {
                    body: {
                        projTypeNo: preType,
                        projectNo: preNo,
                        projectName: preName,
                        projDeptTypeNo: itemType,
                        projDeptName: itemName
                    }
                }).then(function (res) {
                if (res.code === 1) {
                    model.hide();
                    body.find(".preType").val("0");
                    body.find(".preName").val("0");
                    body.find(".preNo").val("");
                    body.find(".itemName").val("");
                    body.find(".itemType").val("0");
                    emplyeeSearch.click();
                }
            })
        });
        /**
         * 获取所有项目
         */

        emplyeeSearch.click(function (e) {
            Common.stopPropagation(e);
            var data = {};
            var preTypeMain = $(".preTypeMain").val();
            var preState = $(".preState").val();
            var keyword = $(".keyword").val();
            if (preTypeMain && preTypeMain !== "0") {
                data["projDeptType"] = preTypeMain;
            }
            if (preState && preState !== "0") {
                data["projStatus"] = preState;
            }
            if (keyword) {
                data["projDeptName"] = keyword;
            }
            request.post("/customer/staff/findProjDeptList", {body: data})
                .then(function (res) {
                    var employees = $("#employees").html("");
                    if (res.code === 1 && res.data) {
                        var list = res.data.data || [];
                        for (var i = 0; i < list.length; i++) {
                            var dom = renderEmpTbody(list[i]);
                            dom.appendTo(employees);
                        }
                        /**
                         * 删除唤起model
                         */
                        employees.find(".employee-delete").click(function (e) {
                            Common.stopPropagation(e);
                            var id = $(this).data("id");
                            var name = $(this).data("name");
                            delModel.$body.find(".del-content").text(name);
                            delModel.$body.find(".del-confirm").data("id", id);
                            delModel.$body.find(".del-confirm").data("type", "employees");
                            delModel.show();
                        })
                    }
                })
        });

        function renderEmpTbody(item) {
            var chargeName = item.chargeName || "";
            var managerName = item.managerName || "";
            return $('<tr>\
      <td>' + item.projDeptName + '</td>\
      <td>' + chargeName + '</td>\
      <td>' + managerName + '</td>\
      <td>' + item.managerCount + '</td>\
      <td>' + item.workerCount + '</td>\
      <td>' + item.workerCount + '</td>\
      <td>fsdfsdf</td>\
      <td>\
      <a class="employee-state" href="/employee/state">人力动态</a>\
      <a class="employee-check" href="/employee/' + item.projDeptNo + '/' + item.projectNo + '">查看</a>\
      <a class="employee-delete" data-id=' + item.projDeptNo + ' data-name=' + item.projDeptName + ' href="javascript:void(0)">删除</a>\
      </td>\
      </tr>');
        }

        emplyeeSearch.click();
    }
}

module.exports = getProjectAll;