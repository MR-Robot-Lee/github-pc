var initDashbordFunc = require('./initDashbordFunc');
var common = require('../Common');


exports.initOrganizationTableEvent = function (parents) {
  $('#userList').html(' ');
  parents.find('li').click(function (e) {
    common.stopPropagation(e);
    var item = $(this).data('item');
    parents.find('li').removeClass('active');
    $(this).addClass('active');
    if (item.projDeptName) {
      initDashbordFunc.getOrganizationEmployeeListFunc({ projId: item.projId });
    } else {
      var users = item.users || [];
      initDashbordFunc.renderOrganizationUserTable(users);
    }
  });
  parents.find('li:first').click();
};


exports.initOrganizationStructureEvent = function () {
  var budgetMenus = $('.budget-menus');
  if (budgetMenus.length > 0 && !budgetMenus.data('flag')) {
    budgetMenus.data('flag', true);
    budgetMenus.find('.item').click(function (e) {
      common.stopPropagation(e);
      budgetMenus.find('.item').removeClass('active');
      $(this).addClass('active');
      var type = $(this).data('type');
      if (type === 'employee') {
        initDashbordFunc.getDetailUserListFunc();
      } else {
        initDashbordFunc.getProjectOrganizationList();
      }
    });
  }
};

exports.initProjectFinancial = function (page) {
  var searchModal = $('#searchModal');
  if (searchModal.length > 0 && !searchModal.data('flag')) {
    searchModal.data('flag', true);
    searchModal.click(function (e) {
      common.stopPropagation(e);
      var projId = $('#projId').val();
      var status = $('#status').val();
      var fundResc = $('#fundResc').val();
      initDashbordFunc.getNewFinanceFunc({ projId: projId, status: status, fundResc: fundResc, pageNo: 1 }, page);
    });
  }
};

exports.slideshowFunc = function (parents) {
  var lis = parents.find('li');
  if (lis.length > 0) {
    $('.vmcarousel-centered-infitine').vmcarousel({
      centered: true,
      start_item: 1,
      infinite: true
    });
  }
};


exports.initKnowledgeEvent = function (parents1, parents2, parents3) {
  $('#toCommunique').click(function () {
    top.location.href = '/index#/communique';
    top.location.reload();
  })
  $('#toReport').click(function () {
    top.location.href = '/index#/report';
    top.location.reload();
  })
  $('#toKnowledge').click(function () {
    top.location.href = '/index#/knowledge';
    top.location.reload();
  })
  if (parents1) {
    parents1.find('li').click(function (e) {
      common.stopPropagation(e);
      var item = $(this).data('item');
      top.location.href = '/index#/communique?id=' + item.id + '&type=' + item.annTypeId;
      top.location.reload();
    });
  }
  if (parents2) {
    parents2.find('li').click(function (e) {
      common.stopPropagation(e);
      var item = $(this).data('item');
      top.location.href = '/index#/report?id=' + item.id + '&type=' + item.newsType;
      top.location.reload();
    });
  }
  if (parents3) {
    parents3.find('li').click(function (e) {
      common.stopPropagation(e);
      var item = $(this).data('item');
      top.location.href = '/index#/knowledge?id=' + item.id + '&type=' + item.typeId;
      top.location.reload();
    });
  }
};

exports.initPositionDetails = function (){
    var postId = $('.postName').data('postId');
    var desc;
    $('.postName').on('mouseenter',function(e){
        var pageX = e.pageX;
        var pageY = e.pageY;
        desc = $('<div class="job-description"></div>');
        desc.css({'top':pageY+18,'left':pageX});
        desc.appendTo($('.postName'));
        initDashbordFunc.getJobDescFunc(postId);
    });
    $('.postName').on('mousemove',function(e){
        var pageX = e.pageX;
        var pageY = e.pageY;
        desc.css({'top':pageY+18,'left':pageX});
    });
    $('.postName').on('mouseleave',function(){
        $('.job-description').remove();
    });
}