var request = require("../../helper/request");
var Modal = require("../../components/Model");
var UploadImage = require('../../components/UploadImage');
var UploadAttach = require('../../components/UploadAttach');
var Common = require("../Common");
var delEjs = require("./modals/deleteModal.ejs");
var reportApi = require('./reportApi');

function getUnReport(addModel, page) {

    var noSendReport = $("#noSendReport");
    if (noSendReport.length > 0 && !noSendReport.data("flag")) {
        noSendReport.data("flag", true);

        reportApi.getReportTypeList().then(function (res) {
            var list = res.data ? res.data.data : [];
            var parents = $('.unReportSelect').html('');
            $('<option value="0">请选择</option>').appendTo(parents);
            for (var i = 0, length = list.length; i < length; i++) {
                var item = list[i];
                var dom = $('<option></option>');
                dom.val(item.id);
                if (item.newsTypeName.length > 9) {
                    item.newsTypeName = item.newsTypeName.slice(0, 9) + '...';
                }
                dom.text(item.newsTypeName);
                dom.appendTo(parents);
            }
        });
        /**
         * 更新未发快报内容
         */
        var reportImage = addModel.$body.find(".reportImage");
        var reportFile = addModel.$body.find(".reportFile");
        var saveReport = addModel.$body.find(".add-save");
        var releaseReport = addModel.$body.find(".add-update-release");
        var preview = addModel.$body.find(".add-update-preview");
        var sectionType = addModel.$body.find(".sectionType");//栏目分类
        var projectDepartment = addModel.$body.find(".projectDepartment");//项目部门
        var title = addModel.$body.find(".title");//标题
        var content = addModel.$body.find(".content");//正文
        var upImage = new UploadImage(reportImage);
        var attach = new UploadAttach(reportFile, true);
        /**
         * 获取所有数据
         */
        noSendReport.click(function (e) {
            Common.stopPropagation(e);
            var data = {};
            var sel = $(".unReportSelect").val();
            var keyWord = $(".unReportKeyWord").val();
            var time = $(".unReportBtn").find(".active").data("id");
            if (sel && sel !== "0") {
                data["newsType"] = sel;
            }
            if (time) {
                data["timeType"] = time;
            }
            if (keyWord) {
                data["newsName"] = keyWord;
            }
            initUnReportList(data, page);
        });

        function initUnReportList(data, page) {
            request.post("/customer/buildNews/findUnsendList", {body: data}).then(function (res) {
                var $data = res.data ? res.data : '';
                var pageSize = $data ? $data.pageSize : 10;
                var pageNo = $data ? $data.pageNo : 1;
                var total = $data ? $data.total : 0;
                page.update({pageNo: pageNo, pageSize: pageSize, total: total});
                page.change(function (_data) {
                    var sel = $(".unReportSelect").val();
                    var keyWord = $(".unReportKeyWord").val();
                    var time = $(".unReportBtn").find(".active").data("id");
                    if (sel && sel !== "0") {
                        _data["newsType"] = sel;
                    }
                    if (time) {
                        _data["timeType"] = time;
                    }
                    if (keyWord) {
                        _data["newsName"] = keyWord;
                    }
                    initUnReportList(_data, page);
                });

                var parents = $("#noInfoUnReported_main").html("");
                $('#noInfoUnReported  ').show();
                if (res.code === 1 && res.data) {
                    // var list = res.data.data || [];
                    var user = JSON.parse(localStorage.getItem("user")).employee.userName;
                    var list = [];
                    for (var i = 0; i < res.data.data.length; i++) {//只显示本人的相关的快报
                        if (res.data.data[i].userName == user) {
                            list.push(res.data.data[i]);
                        }
                    }
                    if (list.length > 0) {
                        $('#noInfoUnReported').hide();
                        $('#noInfoUnReported_main').show();
                    } else {
                        $('#noInfoUnReported').show();
                        $('#noInfoUnReported_main').hide();
                    }
                    for (var i = 0; i < list.length; i++) {
                        var dom = renderUnReport(list[i]);
                        dom.data("item", list[i].id);
                        dom.appendTo(parents);
                    }
                    /**
                     * 撤销
                     */
                    parents.find(".delete").click(function (e) {
                        Common.stopPropagation(e);
                        var item = $(this).parents(".reports-item").data("item");
                        /**
                         *  删除modal
                         */
                        var delModel = Modal('提示', delEjs());
                        delModel.showClose();
                        delModel.show();
                        delModel.$body.find('.confirm').click(function (e) {
                            Common.stopPropagation(e);
                            request.post("/customer/buildNews/delBuildNews/" + item).then(function (res) {
                                if (res.code === 1) {
                                    delModel.hide();
                                    noSendReport.click();
                                }
                            })
                        })
                    });
                    /**
                     * 发布
                     */
                    parents.find(".send").click(function (e) {
                        Common.stopPropagation(e);
                        var item = $(this).parents(".reports-item").data("item");
                        request.post("/customer/buildNews/publishBuildNews/" + item).then(function (res) {
                            if (res.code === 1) {
                                noSendReport.click();
                            }
                        })
                    })
                    parents.find(".reports-item").click(function (e) {
                        Common.stopPropagation(e);
                        var itemId = $(this).attr('data-itemId');
                        var active = $('.nav-content>li.active');
                        window.location.href = '/report/add?type=update&id=' + itemId;
                        $('.nav-content>li').removeClass('active');
                        active.addClass('active');
                    })
                }
            })
        }

        var search = $(".unReportBtn").find(".item");
        search.click(function (e) {
            Common.stopPropagation(e);
            search.removeClass("active");
            $(this).addClass("active");
            noSendReport.click();
        });

        function parseAttachCount(st) {
            if (st > 0) {
                return '<span class="icon-arrow"></span>'
            } else {
                return null;
            }
        }

        function renderUnReport(item) {
            var noPic = '';
            var pic = '';
            if (item.attaches.length > 0) {
                if (item.attaches[0].thumbnailUrl) {
                    pic = window.API_PATH + '/customer/' + item.attaches[0].thumbnailUrl;
                    /*压缩图*/
                } else {
                    pic = window.API_PATH + '/customer/' + item.attaches[0].attachUrl;
                }
            } else {
                noPic = '暂无图片';
            }
            return $('<div class="clearfix reports-item" data-itemId=' + item.id + '>\n' +
                '                        <div style="background-image: url(' + pic + ')" class="reports-pic">' + noPic + '</div>\n' +
                '                        <div class="reports-container">\n' +
                '                            <div class="reports-title" style="color: #333;">' + item.newsTitle + '<span>' + item.newsTypeName + '</span>' + '</div>\n' +
                '                            <div class="reports-content" style="color: #333;">' + item.newsContent + '</div>\n' +
                '                            <div class="reports-desc" style="padding: 5px 0;" >\n' +
                '                                <label style="color: #999;">部门 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666;">' + item.projDeptName + '</span>\n' +
                '                                <label style="color: #999;">发稿人 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666;">' + item.userName + '</span>\n' +
                '                                <label style="color: #999;">发稿时间 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666;">' + new Date(item.publishTime).Format("yyyy-MM-dd hh:mm") + '</span>\n' +
                '                                <label style="color: #999;">浏览 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666;">' + item.readCount + '</span>\n' +
                '                                <label style="color: #999;">评论 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666;">' + item.commentCount + '</span>\n' +
                '                                <a class="send confirm-hover">发布</a>\n' +
                '                                <span style="margin: 0 1px;color: #999;">|</span>\n' +
                '                                <a class="edit confirm-hover" href="/report/add?type=update&id=' + item.id + '">编辑</a>\n' +
                '                                <span style="margin: 0 1px;color: #999;">|</span>\n' +
                '                                <a class="delete delete-hover">删除</a>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </div>')
        }

        /**
         * 获取所有数据
         */
        noSendReport.click();


        function saveReportFunction(newsStatus) {
            var sectionTypeValue = sectionType.val();
            var projectDepartmentValue = projectDepartment.val();
            var titleValue = title.val();
            var contentValue = content.val();
            var data = upImage.getImages();
            var dataFile = attach.getAttaches();
            if (!sectionTypeValue || sectionTypeValue === "0") {
                return alert("请选择栏目分类");
            }
            if (!projectDepartmentValue || projectDepartmentValue === "0") {
                return alert("请选择项目部");
            }
            if (!titleValue) {
                return alert("请输入标题");
            }
            if (!contentValue || contentValue.length > 200) {
                return alert("请输入正文内容");
            }
            if (data.length === 0) {
                return alert("请上传图片")
            }
            if (dataFile.length === 0) {
                return alert("请上传附件")
            }
            request.post("/customer/buildNews/addBuildNews", {
                body: {
                    newsType: sectionTypeValue,
                    projDeptNo: projectDepartmentValue,
                    newsContent: contentValue,
                    newsTitle: titleValue,
                    attaches: dataFile.concat(data),
                    newsStatus: newsStatus
                }
            }).then(function (res) {
                addModel.hide();
            })
        }

        /**
         * 保存快报
         */
        saveReport.click(function (e) {
            Common.stopPropagation(e);
            saveReportFunction($(this).data("id"));
        });
        /**
         * 发布快报
         */
        releaseReport.click(function (e) {
            Common.stopPropagation(e);
            saveReportFunction($(this).data("id"));
        });
    }
}

module.exports = getUnReport;