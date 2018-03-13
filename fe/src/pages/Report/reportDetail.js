var request = require('../../helper/request');
var Page = require('../../components/Page');
var Common = require('../Common');


function getDetailReport() {
    var preComment = $("#preComment");
    if (!preComment.data("flag")) {
        preComment.data("flag", true);
        var title = $(".title");//标题
        var sectionType = $(".pre-name");//栏目
        var projectDepartment = $(".pre-project");//部门
        var time = $(".pre-time");
        var sender = $(".pre-sender");
        var commentCount = $(".pre-comment");
        var browseCount = $(".pre-browse");
        var content = $(".preview-content");
        var preImage = $(".preview-image-list").html("");//图片
        var preAttach = $(".preview-attach");//附件
        var detailCallback = $("#detailCallback");
        var $page = new Page($("#commentPage"), {
            pageSize: [10, 20, 30], // 设置每页显示条数按钮
            size: 10, // 默认每页显示多少条
        });
        var id = preComment.data("id");
        if (id) {
            request.post("/customer/buildNews/findBuildNewsById/" + id)
                .then(function (res) {
                    if (res.code === 1 && res.data) {
                        var item = res.data;
                        sectionType.html("快报栏目 : " + item.newsTitle);
                        projectDepartment.html("部门 : " + item.projDeptName);
                        title.text(item.newsTitle);
                        sender.html("发稿人 : " + item.userName);
                        time.html("发稿时间 : " + new Date(item.publishTime).Format('yyyy-MM-dd hh:mm'))
                        content.text(item.newsContent);
                        commentCount.html("评论 : " + item.commentCount + "次");
                        browseCount.html("浏览数 : " + item.readCount + "次");
                        var list = item.attaches || [];
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
                    } else {
                        return alert(res.desc)
                    }
                });

            function getComments(page, pageSize) {
                request.post("/customer/comment/findComments", {
                    body: {
                        pId: id, moduleId: 2, pageNo: page || 1, pageSize: pageSize || 10
                    }
                }).then(function (res) {
                    var commentLists = $(".comment-list").html("");
                    if (res.code === 1 && res.data) {
                        var list = res.data.data || [];
                        for (var i = 0; i < list.length; i++) {
                            var dom = renderCommentList(list[i]);
                            dom.appendTo(commentLists)
                        }
                        $page.update({pageNo: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.total});
                    }
                })
            }

            getComments();
            $page.change(function (data) {
                getComments(data.pageNo, data.pageSize);
            })
        }

        function renderCommentList(item) {
            return $('<div class="msg-item">\
                 <div class="image-url"></div>\
                 <div class="comment-info">\
                  <div class="user-info">\
                   <span>' + item.userName + '</span>\
                   <span>' + item.roleName + '</span>\
                   <span>' + new Date(item.commentTime).Format('yyyy-MM-dd') + '</span>\
                  </div>\
                  <div class="user-comment">' + item.commentContent + '</div>\
                </div>\
                <div class="clr"></div>\
               </div>');
        }

        /**
         * 返回
         */
        detailCallback.click(function (e) {
            Common.stopPropagation(e);
            window.location.href = "/report"
        });
        /**
         * 撤销
         */
        $('#revocation').click(function (e) {
            Common.stopPropagation(e);
            var id = $('#preComment').data('id');
            request.post("/customer/buildNews/cancleBuildNews/" + id)
                .then(function (res) {
                    if (res.code === 1) {
                        window.location.href = "/report"
                    } else {
                        return alert(res.desc);
                    }
                })
        });
        /**
         * 提交评论
         */
        preComment.click(function (e) {
            Common.stopPropagation(e);
            var val = $(".comments-val").val();
            if (!val || val.trim() === '') {
                return alert("请输入评论内容");
            }
            request.post("/customer/comment/addComment", {
                body: {commentContent: val, pId: id, moduleId: 2}
            }).then(function (res) {
                $(".comments-val").val("");
                getComments();
            })
        });

        function renderImageItem(item) {
            var HDurl = window.API_PATH + '/customer' + item.attachUrl;
            if (item.thumbnailUrl) {
                var path = window.API_PATH + '/customer' + item.thumbnailUrl;
            } else {
                var path = window.API_PATH + '/customer' + item.attachUrl;
            }
            var img = $('<a style="display: inline-block" class="preview-img-item img-hover" target=_blank href=' + HDurl + '></a>');
            img.css('background', 'url(' + path + ')').addClass('pre-image');
            return img;
        }

        function renderAttachItem(item, i) {
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
    }
}

module.exports = getDetailReport;