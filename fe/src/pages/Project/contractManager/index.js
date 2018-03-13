var initEvent = require('./initEvent');
var contractManagerFunc = require('./contractManagerFunc');
var Page = require('../../../components/Page');
exports.initContractSum = function () {
    var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
    });
    contractManagerFunc.initContractSearchSubPro(function () {
        initEvent.initSumContractEvent(page);
        $('#searchModal').click();
    });
};

exports.initContractDetail = function () {
    contractManagerFunc.initFindContractContentById(null);
    var type = $('#contractDetail').data('type');
    if (type === 6) {
        contractManagerFunc.getContractMaterialListFunc('page-detail');
    } else {
        contractManagerFunc.initContractSubItem(null, null, 'page-detail');
    }
    this.renderContractDetailTableThead(type);
};

exports.initBillContractFunc = function () {
    var page = new Page($('#page'), {
        pageSize: [10, 20, 30], // 设置每页显示条数按钮
        size: 10, // 默认每页显示多少条
    });
    contractManagerFunc.initContractSearchSubPro(function () {
        initEvent.initBillContractEvent(page);
        $('.searchModal').click();
    });
};
/**
 * 绘制合同详情
 * @param type
 */
exports.renderContractDetailTableThead = function (type) {
    var thead = $('#contractDetailThead').html('');
    if (type === 6) {
        $('<tr class="small"> \
      <th style="width: 45px" class="border">序号</th>\
      <th class="border">材料分类</th>\
      <th class="border">材料名称</th>\
      <th class="border">规格型号</th>\
      <th style="width: 60px;" class="border">单位</th>\
      <th style="width: 80px;" class="border">数量</th>\
      <th style="width: 60px;" class="border">单价</th>\
      <th class="border" style="width: 70px;">合价</th>\
      <th class="border">说明</th>\
      <th style="width: 60px;" class="border">异常</th>\
      </tr>').appendTo(thead);
    } else {
        $('<tr class="small">\
      <th style="width: 45px;" class="border">序号</th>\
      <th class="border">项目名称</th>\
      <th class="border">工作内容</th>\
      <th style="width: 45px;" class="border">单位</th>\
      <th style="width: 70px;" class="border">核算数量</th>\
      <th style="width: 70px;" class="border">核算单价</th>\
      <th style="width: 70px;" class="border">核算合价</th>\
      <th style="width: 45px;" class="border">查看</th>\
      <th style="width: 70px;" class="border">异常备忘</th>\
      </tr>').appendTo(thead);
    }
};

exports.renderCotractManagerCompetence = function () {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : {permission: {}};
    var projectGet = user.permission['contract:add'];
    if (projectGet) {
        $('#addSettlementContract').show();
        $('#addPurchaseContract').show();
    } else {
        $('#addSettlementContract').hide();
        $('#addPurchaseContract').hide();
    }
}
