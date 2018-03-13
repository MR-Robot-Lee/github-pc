var communiqueApi = require('./communiqueApi');
var renderCommuniqueTable = require('./renderCommuniqueTable');
var initEvent = require('./initEvent');
var UploadAttach = require('../../components/UploadAttach');
var Page = require('../../components/Page');
exports.communiqueType = function () {
  communiqueApi.getCommuniqueType().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderCommuniqueTable.renderCommuniqueType(list);
  });
  initEvent.initCommuniqueTypeEvent();
};

exports.initCommuniqueType = function () {
  var attach = new UploadAttach($('#communiqueFile'));
  communiqueApi.getCommuniqueType().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderCommuniqueTable.renderAddCommuniqueSelect(list);
    var id = $('#addCommunique').data('id');
    if (id) {
      communiqueApi.getCommuniqueById(id).then(function (res) {
        renderCommuniqueTable.addCommuniqueDom(res.data, attach);
      })
    }
  });
  initEvent.addCommuniqueEvent(attach);
};
exports.initCommentList = function (id) {
  communiqueApi.getComment({ pId: id }).then(function (res) {
    var list = res.data ? res.data.data : [];
    renderCommuniqueTable.renderCommentList(list);
  })
};
exports.initAllCommunique = function (data) {
  var $page = $('#page').html('');
  var page = new Page($page);
  var that = this;
  communiqueApi.getCommunique(data).then(function (res) {
    var list = res.data ? res.data.data : [];
    renderCommuniqueTable.renderAllCommunique(list);
    page.update({ pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total });
  });
  page.change(function ($data) {
    var typeId = $('#communiqueChildNav li.active').data('item')
    if (typeId) {
      $data.typeId = typeId.id;
    }
    that.initAllCommunique($data, page);
  });
};

/**
 * 获取公告的类型
 */
exports.getCommuniqueTypeFunc = function (id, type) {
  communiqueApi.getCommuniqueType().then(function (res) {
    var list = res.data ? res.data.data : [];
    renderCommuniqueTable.renderCommuniqueTypeNav(list, id, type)
  });
};

/**
 * 通过id获取公告详情
 * @param id
 */
exports.getCommuniqueByIdFunc = function (id) {
  communiqueApi.getCommuniqueById(id).then(function (res) {
    renderCommuniqueTable.renderCommuniqueDetail(res.data);
  });
  initEvent.initCommuniqueDetail(id);
};


exports.getCommuniqueCompetence = function () {
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { permission: {} };
  var add = user.permission['notice:add']
  if (add) {
    $('#addCommunique').show();
  } else {
    $('#addCommunique').hide();
  }
  var type = user.permission['notice:type:*'];
  if (type) {
    $('#communiqueSetting').show();
    $('#knowledgeType').attr('disable',false);
    $('.Competence').show();
    $('#delKnowledge').show();
  } else {
    $('#communiqueSetting').hide();
    $('#knowledgeType').attr('disable',true);
    $('.Competence').hide();
    $('#delKnowledge').hide();
  }
};
