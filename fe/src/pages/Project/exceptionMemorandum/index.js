var exceptionMemorandumApi = require('./exceptionMemorandumApi');
var exceptionMemorandumRenderTable = require('./exceptionMemorandumRenderTable');
var projectInitEvent = require('../initEvent');


/**
 * 初始化所有的异常事件
 */
exports.initException = function initException (data, page) {
    // projectInitEvent.initPrincipalAndLogo();//左上角logo

    /**
   * 获取异常列表
   */
  var that = this;
  exceptionMemorandumApi.getExceptionList(data).then(function (res) {
    var list = res.data ? res.data.data : [];
    exceptionMemorandumRenderTable.renderExceptionTable(list);
    page.update({ pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total });

    //绑定分页修改事件
    page.change(function ($data) {
        var keywords = $("#keyword").val();
        var basicType = $("#selectException").val();
        var type = $("#selectExceptionType").val();
        $data.keywords = keywords;
        $data.basicType = basicType;
        $data.type = type;
        that.initException($data, page)
    });
  })
    if($('.subProject option').length <= 1){
        exceptionMemorandumApi.getSubProjectList(data).then(function(res){
            var list = res.data ? res.data.data : [];
            for(var i = 0; i < list.length; i++){
                var dom = $('<option value='+list[i].id+'>'+list[i].subProjName+'</option>');
                dom.appendTo($('.subProject'));
            }
        })
    }
};
/**
 * 获取过程备忘
 */
exports.initProcess = function initProcess (data, page, funType) {
  var that = this;
  exceptionMemorandumApi.getProcessList(data).then(function (res) {
    var list = res.data ? res.data.data : [];
    exceptionMemorandumRenderTable.renderProcessTable(list, page, funType);
    page.update({ pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total });

    //绑定分页修改事件
    page.change(function ($data) {
      that.initProcess($data, page)
    });
  })
};


