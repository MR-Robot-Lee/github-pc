var knowledgeApi = require('./knowledgeApi');
var renderKnowledgeTable = require('./renderKnowledgeTable');
var initEvent = require('./initEvent');
var UploadAttach = require('../../components/UploadAttach');
var Page = require('../../components/Page');
/**
 * 知识库类型
 */
exports.initKnowledgeType = function initKnowledgeType () {
  knowledgeApi.getKnowledgeList().then(function (res) {
    var list = res.data ? res.data : [];
    renderKnowledgeTable.renderKnowledgeType(list);
  });
  initEvent.initKnowledgeTypeEvent();
};
/**
 * 添加知识库
 */
exports.initAddKnowledge = function initAddKnowledge () {
  var that = this;
  var attach = new UploadAttach($("#KnowledgeFile"));
  knowledgeApi.getKnowledgeList().then(function (res) {
    var list = res.data ? res.data : [];
    renderKnowledgeTable.renderNewKnowledgeSelect(list);
    var id = $('#addKnowledge').data('id');
    if (id) {
      that.getFindCompanyNoAndIdByKnowledgeUpdate({ id: id }, attach);
    }
  });
  initEvent.addKnowledge(attach);
};
/**
 * 所有知识库
 */
exports.initAllKnowledgeFunc = function initAllKnowledgeFunc ($data) {
  var $page = $('#page').html('');
  var page = new Page($page);
  var that = this;
  knowledgeApi.getKnowledgeAllList($data).then(function (res) {
    if (res.code === 1) {
      page.update({ pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total });
    }
    var list = res.data ? res.data.data : [];
    renderKnowledgeTable.renderAllKnowledgeList(list);
    //绑定分页修改事件
    page.change(function (data) {
      var typeId = $('#knowledgeChildNav li.active').data('item');
      if (typeId) {
        data.typeId = typeId.id;
      }
      that.initAllKnowledgeFunc(data)
    });
  });
};
exports.initAllKnowledgeClickAndNav = function (id, type) {
  initEvent.initAllKnowledgeClick();
  knowledgeApi.getKnowledgeList().then(function (res) {
    var list = res.data ? res.data : [];
    renderKnowledgeTable.renderAllKnowledgeNav(list, id, type);
  })
};
/**
 * 通过id获取单个知识详情
 * @param id
 */
exports.getFindCompanyNoAndIdByKnowledgeFunc = function (id) {
  knowledgeApi.getFindCompanyNoAndIdByKnowledge(id).then(function (res) {
    var obj = res.data ? res.data : {};
    renderKnowledgeTable.initDetailKnowledge(obj);
  });
  initEvent.initKnowledgeEvent(id);
};
/**
 * 通过id获取单个知识并负值dom
 * @param id
 * @param attach
 */
exports.getFindCompanyNoAndIdByKnowledgeUpdate = function (id, attach) {
  knowledgeApi.getFindCompanyNoAndIdByKnowledge(id).then(function (res) {
    var obj = res.data ? res.data : {};
    renderKnowledgeTable.initKnowledgeUpdate(obj, attach);
  })
};

exports.renderCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var type = user.permission['knowledge:type:*']
  if (type) {
      $('#knowledgeNavType').show();
  } else {
      $('#knowledgeNavType').hide();
  }
};




