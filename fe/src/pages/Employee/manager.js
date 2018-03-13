var request = require('../../helper/request');
var Model = require('../../components/Model');
var Common = require('../Common');
var addNewEmp = require('./models/addEmployee.ejs');
var delProjectEjs = require('./models/delProject.ejs');
var addEmployee = require('../../components/addEmployee');
/**
 * 项目详情
 */
function getProjectManager () {

  /**
   * projNo 工程编号 projDeptNo; 项目部编号
   */
  var openManager = $("#openManager");
  var menus = $("#menus");
  var table = $(".project-detail-table");
  if (!openManager.data("flag")) {
    /**
     * 管理人员排序
     */
    var container = document.getElementById("projectManagerEmp");
    var sort = Sortable.create(container, {
      animation: 150,
      handle: 'tr',
      onUpdate: function (evt) {
        Common.stopPropagation(evt);
        var trs = $(container).find("tr");
        var sortNo = [];
        var id = [];
        trs.each(function (index, value) {
          sortNo.push(index + 1);
          var item = $(value).data("item");
          id.push(item.id);
        });
        var pro = openManager.data("pro");
        var no = openManager.data("no");
        request.post('/customer/staff/sortManager', {
          body: {
            sortNo: sortNo.join(";"),
            projNo: no,
            projDeptNo: pro,
            id: id.join(";")
          }
        }).then(function (res) {
        })
      }
    });
    $("#selectEmployee").click(function (e) {
      Common.stopPropagation(e);
      /**
       * 选择人员
       */
      var $addEmployee = new addEmployee("选择员工", function (data) {
        var pro = openManager.data("pro");
        var no = openManager.data("no");
        var items = [];
        for (var i = 0, length = data.length; i < length; i++) {
          var item = data[i];
          items.push(item.userNo);
        }
        request.post('/customer/staff/addManager', {
          body: { userNo: items.join(";"), projNo: no, projDeptNo: pro }
        }).then(function (res) {
          if (res.code === 1) {
            $addEmployee.hide();
            getProjectManagerAll(no, pro);
          }
        })
      });
      $addEmployee.reset();
      $addEmployee.show();
      request.post('/customer/user/getTree').then(function (res) {
        $addEmployee.update(res.data); // 更新分级数据
      });
    });

    /**
     * 删除项目部
     */
    var delModel = Model(null, delProjectEjs());
    delModel.$header.hide();
    delModel.$body.find(".del-confirm").click(function (e) {
      Common.stopPropagation(e);
      if ($(this).data("type") === "detail") {
        request.post("/customer/staff/delProjDept/" + $(this).data("id")).then(function (res) {
          if (res.code === 1) {
            delModel.hide();
          } else {
            return alert(res.desc);
          }
        })
      }
    });

    /**
     * 返回操作
     */
    $(".callback").click(function (e) {
      Common.stopPropagation(e);
      window.location.href = "/employee"
    });
    var addModel = Model("添加项目新人员信息", addNewEmp());
    openManager.data("flag", true);
    /**
     * 获取管理人员信息
     */
    openManager.click(function (e) {
      Common.stopPropagation(e);
      var projNo = $(this).data("no");
      var projDeptNo = $(this).data("pro");
      var manager = $(this).data("id");
      menus.find(".active").removeClass("active");
      $(this).addClass("active");
      menus.find('.' + manager).addClass("active");
      table.find(".detail-list").removeClass("active");
      table.find('.' + manager).addClass("active");
      getProjectManagerAll(projNo, projDeptNo);
    });
    /**
     * 唤起添加model
     */
    var modelConfirm = addModel.$body.find(".add-update-save");
    $("#addNewEmployee").click(function (e) {
      Common.stopPropagation(e);
      addModel.show();
      modelConfirm.data("id", "");
    });
    modelConfirm.click(function (e) {
      Common.stopPropagation(e);
      var id = $(this).data("id");
      var pro = openManager.data("pro");
      var no = openManager.data("no");
      var name = addModel.$body.find(".name");
      var sex = addModel.$body.find("input[name='sex']:checked");
      var age = addModel.$body.find(".age");
      var mobile = addModel.$body.find(".mobile");
      var job = addModel.$body.find(".job");
      var nameValue = name.val();
      var sexValue = sex.val();
      var ageValue = age.val();
      var mobileValue = mobile.val();
      var jobValue = job.val();
      if (!nameValue) {
        return alert("请输入新人姓名");
      }
      if (!sexValue) {
        return alert("请选择性别");
      }
      if (!ageValue) {
        return alert("请输入年龄");
      }
      if (isNaN(ageValue)) {
        return alert("请输入正确的年龄")
      }
      if (!mobile) {
        return alert("请输入电话")
      }
      if (!jobValue) {
        return alert("请输入项目部职务");
      }
      if (!no || !pro) {
        return alert("参数错误请返回重新进入");
      }
      if (id) {
        request.post("/customer/staff/modifyManager", {
          body: {
            projNo: no,
            projDeptNo: pro,
            age: ageValue,
            mobile: mobileValue,
            userName: nameValue,
            sex: sexValue,
            position: jobValue,
            id: id
          }
        }).then(function (res) {
          if (res.code === 1) {
            addModel.hide();
            name.val("");
            sex.val("");
            age.val("");
            mobile.val("");
            getProjectManagerAll(no, pro);
          } else {
            return alert(res.desc)
          }
        })
      } else {
        request.post("/customer/staff/addNewManager", {
          body: {
            projNo: no,
            projDeptNo: pro,
            age: ageValue,
            mobile: mobileValue,
            userName: nameValue,
            sex: sexValue,
            position: jobValue
          }
        }).then(function (res) {
          if (res.code === 1) {
            addModel.hide();
            name.val("");
            sex.val("");
            age.val("");
            mobile.val("");
            var projNo = openManager.data("no");
            var projDeptNo = openManager.data("pro");
            getProjectManagerAll(projNo, projDeptNo);
          } else {
            return alert(res.desc);
          }
        });
      }
    });

    function parseSex (sex) {
      switch (sex) {
        case 1:
          return '男';
        case 2:
          return '女';
      }
    }

    function getProjectManagerAll (projNo, projDeptNo) {
      request.post("/customer/staff/findManagers", {
        body: { projNo: projNo, projDeptNo: projDeptNo }
      }).then(function (res) {
        var manager = $("#projectManagerEmp").html("");
        if (res.code === 1 && res.data) {
          renderProjectManagerEmp(manager, res)
        } else {
          return alert(res.desc)
        }
      })
    }

    /**
     * 获取所有数据
     */
    function renderProjectManagerEmp (parentDom, res) {
      var list = res.data.data || [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var position = item.position || "";
        var dom = $('<tr>\
        <td>' + item.userName + '</td>\
        <td>' + position + '</td>\
        <td>' + item.mobile + '</td>\
        <td>' + item.age + '</td>\
        <td> ' + parseSex(item.sex) + '</td>\
      <td>\
      <a class="updateManagerEmp">修改</a>\
      <div class="icon-line"></div>\
      <a class="deleteManagerEmp">删除</a>\
      </td>\
      </tr>');
        dom.data("item", item);
        dom.appendTo(parentDom);
      }
      parentDom.find(".deleteManagerEmp").click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).parents('tr').data("item");
        delModel.$body.find(".del-content").text(item.userName);
        delModel.$body.find(".del-confirm").data("id", item.id);
        delModel.$body.find(".del-confirm").data("type", "detail");
        delModel.show();
      });
      parentDom.find(".updateManagerEmp").click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).parents('tr').data("item");
        addModel.show();
        addModel.title("修改项目人员信息");
        addModel.$body.find(".name").val(item.userName);
        addModel.$body.find("input:radio[value=" + item.sex + "]").attr("checked", true);
        addModel.$body.find(".age").val(item.age);
        addModel.$body.find(".mobile").val(item.mobile);
        addModel.$body.find(".job").val(item.position);
        modelConfirm.data("id", item.id);
      });
    }
  }

  /**
   * 施工人员
   */
  var handlerWorker = $("#handlerWorker");
  if (!handlerWorker.data("flag")) {
    handlerWorker.data("flag", true);
    /**
     * 获取所有dom对象
     */

    handlerWorker.click(function (e) {
      Common.stopPropagation(e);
      var pro = openManager.data("pro");
      var no = openManager.data("no");
      var manager = $(this).data("id");
      menus.find(".active").removeClass("active");
      $(this).addClass("active");
      menus.find('.' + manager).addClass("active");
      table.find(".detail-list").removeClass("active");
      table.find('.' + manager).addClass("active");
      request.post("/customer/staff/findCrews", {
        body: {
          projNo: 10001,
          projDeptNo: 10001
        }
      }).then(function (res) {
        var parent = $("#workerGroup").html('');
        if (res.code === 1 && res.data) {
          var list = res.data.data || [];
          for (var i = 0; i < list.length; i++) {
            var dom = renderWorker(list[i]);
            dom.appendTo(parent);
          }
          /**
           * 获取二级数据
           * @type {T|*|{}}
           */
          var checkMenu = parent.find(".checkMenu");
          checkMenu.click(function (e) {
            Common.stopPropagation(e);
            var pid = $(this).data("pid");
            if ($(this).hasClass("active")) {
              checkMenu.removeClass("active");
              $("#v_" + pid).hide();
              return;
            } else {
              $(this).addClass("active");
              $("#v_" + pid).show();
            }
            var childTable = $("#v_" + pid).find("tbody").html('');
            var pro = openManager.data("pro");
            var no = openManager.data("no");
            var id = $(this).data("id");
            request.post("/customer/staff/findWorkersAttend", {
              body: {
                crewNo: id,
                projNo: no,
                projDeptNo: 10001,
              }
            }).then(function (res) {
              if (res.code === 1 && res.data) {
                var list = res.data.data || [];
                for (var i = 0; i < list.length; i++) {
                  var $dom = renderWorkerDetail(list[i]);
                  $dom.appendTo(childTable);
                }
              }
            })
          })
        }
      })
    });
    function renderWorkerDetail (item) {
      return $('<tr>\
                  <td>fsdf</td>\
                  <td>fsdf</td>\
                  <td>fsdf</td>\
                  <td>fsdf</td>\
                  <td>fsdf</td>\
                  <td>fsdf</td>\
                </tr>');
    }

    function renderWorker (item) {
      return $('<tr>\
                  <td><span class="checkMenu" data-id="' + item.crewNo + '" data-pid="' + item.id + '"></span>' + item.crewName + '</td>\
                  <td>负责人:' + item.crewLeaderName + '</td>\
                  <td>电话:' + item.crewPhone + '</td>\
                  <td>主管:' + item.chargeName + '</td>\
               </tr>\
               <tr class="child-table" id="v_' + item.id + '">\
                 <td colspan="5">\
                 <div class="child-cus-table" >\
                   <table>\
                    <thead>\
                     <tr>\
                      <th>姓名</th>\
                      <th>工种</th>\
                      <th>班组</th>\
                      <th>证件名称</th>\
                      <th>证件号</th>\
                      <th>身份证号</th>\
                    </tr>\
                   </thead>\
                   <tbody></tbody>\
                  </table>\
                 </div>\
                 </td>\
                </tr>');
    }

    /**
     * 默认获取选中数据
     */
    openManager.click();
  }
}

module.exports = getProjectManager;