var Common = require('../Common');
var request = require('../../helper/request');

function reviewReport () {
  var detailCallback = $('#detailCallback');
  var reported = $('#reported');
  var item = detailCallback.data('item');
  if (!item) {
    return false;
  }
  var sectionType = $(".pre-name");//栏目
  var projectDepartment = $(".pre-project");//部门
  var time = $(".pre-time");
  var sender = $(".pre-sender");
  var commentCount = $(".pre-comment");
  var browseCount = $(".pre-browse");
  var title = $(".title");
  var content = $(".preview-content");
  var preImage = $(".preview-image-list").html("");//图片
  var preAttach = $(".preview-attach");//附件
  var user = window.localStorage.getItem('user');
  user = user ? JSON.parse(user) : { employee: {} };
  var userName = user.employee.userName ? user.employee.userName : ''
  sectionType.html("快报栏目 : " + item.sectionTypeText);
  projectDepartment.html("部门 : " + item.projectDepartmentText);
  title.text(item.title);
  sender.html("发稿人 : " + userName);
  time.html("发稿时间 : " + moment().format('YYYY-MM-DD hh:mm'));
  content.text(item.content);
  commentCount.html("评论 : " + 0 + "次");
  browseCount.html("浏览数 : " + 0 + "次");
  var list = item.attachs || [];
  for (var i = 0; i < list.length; i++) {
    var $item = list[i];
    if ($item.attachType === "png" || $item.attachType === "jpg") {
      var dom = renderImageItem($item);
      dom.appendTo(preImage);
    } else {
      var $dom = renderAttachItem($item, (i + 1));
      $dom.appendTo(preAttach);
    }
  }
  reported.click(function (e) {
    Common.stopPropagation(e);
    var id = detailCallback.data('id');
    if (id) {
      request.put('/customer/buildNews/updBuildNews/' + id, {
        body: {
          newsType: item.sectionType,
          projDeptId: item.projectDepartment,
          newsContent: item.content,
          newsTitle: item.title,
          attaches: item.attachs,
          newsStatus: 1
        }
      }).then(function (res) {
        if (res.code === 1) {
          window.location.href = '/report/already';
        }
      })
    } else {
      request.post("/customer/buildNews/addBuildNews", {
        body: {
          newsType: item.sectionType,
          projDeptId: item.projectDepartment,
          newsContent: item.content,
          newsTitle: item.title,
          attaches: item.attachs,
          newsStatus: 1
        }
      }).then(function (res) {
        if (res.code === 1) {
          window.location.href = '/report/already';
        }
      })
    }
  });
  detailCallback.click(function (e) {
    Common.stopPropagation(e);
    window.location.href = '/report/add?data=' + JSON.stringify(detailCallback.data('item')) + '&id=' + detailCallback.data('id');
  })
}

function renderAttachItem (item, i) {
  var type = item.attachType || "xls";
  return $("<div class='UploadAttach__item'>\
                 <div class='pre-attach-name'>附件" + i + "</div>\
                 <div class='icon icon-" + type + "'></div>\
                 <div class='detail'>\
                  <div class='filename'>" + item.attachName + "</div>\
                  <div class='remove'>\
                   <a target='_blank' href=" + window.API_PATH + '/customer/attach/download?filePath=' + item.attachUrl + ">下载</a> <span>|</span><a>预览</a>\
                  </div>\
                 </div>\
               </div>");
}

function renderImageItem (item) {
  var path = window.API_PATH + '/customer' + item.attachUrl;
  var img = $('<div class="preview-img-item img-hover"></div>');
  img.css('background', 'url(' + path + ')').addClass('pre-image');
  return img;
}

module.exports = reviewReport;