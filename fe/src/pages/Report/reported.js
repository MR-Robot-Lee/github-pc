var request = require("../../helper/request");
var Common = require("../Common");
var Modal = require("../../components/Model");
var reportApi = require('./reportApi');

function getReported(page) {
    var reportedConfirm = $("#reportedConfirm");
    if (reportedConfirm.length > 0 && !reportedConfirm.data("flag")) {
        reportedConfirm.data("flag", true);
        reportApi.getReportTypeList().then(function (res) {
            var list = res.data ? res.data.data : [];
            var parents = $('.ReportSelect').html('');
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
         * 刷新 本周 本月 今天
         * @type {T|*|{}|jQuery}
         */
        var reported = $(".reported").find(".item");
        /**
         * 获取所有的数据
         */
        reportedConfirm.click(function (e) {
            Common.stopPropagation(e);
            var data = {};
            var sel = $(".ReportSelect").val();
            var keyWord = $(".reportedKeyWord").val();
            var time = $(".reported").find(".active").data("id");
            if (sel && sel !== "0") {
                data["newsType"] = sel;
            }
            if (time) {
                data["timeType"] = time;
            }
            if (keyWord) {
                data["newsName"] = keyWord;
            }
            initReportedList(data, page);
        });

        function initReportedList(data, page) {
            request.post("/customer/buildNews/findSendList", {body: data}).then(function (res) {
                var $data = res.data ? res.data : '';
                var pageSize = $data ? $data.pageSize : 10;
                var pageNo = $data ? $data.pageNo : 1;
                var total = $data ? $data.total : 0;
                page.update({pageNo: pageNo, pageSize: pageSize, total: total});
                page.change(function (_data) {
                    var sel = $(".ReportSelect").val();
                    var keyWord = $(".reportedKeyWord").val();
                    var time = $(".reported").find(".active").data("id");
                    if (sel && sel !== "0") {
                        _data["newsType"] = sel;
                    }
                    if (time) {
                        _data["timeType"] = time;
                    }
                    if (keyWord) {
                        _data["newsName"] = keyWord;
                    }
                    initReportedList(_data, page);
                });
                $('#noInfoReported').show();
                var parents = $("#noInfoReported_main").html("");
                if (res.code === 1 && res.data) {
                    var list = res.data.data || [];
                    /*只显示本人相关的快报*/
                    // var user = JSON.parse(localStorage.getItem("user")).employee.userName;
                    // var list = [];
                    // for (var i = 0; i < res.data.data.length; i++) {
                    //     if (res.data.data[i].userName == user) {
                    //         list.push(res.data.data[i]);
                    //     }
                    // }
                    if (list.length > 0) {
                        $('#noInfoReported').hide();
                        $('#noInfoReported_main').show();
                        $('[name=noInfoReported_page]').show();
                    } else {
                        $('#noInfoReported').show();
                        $('#noInfoReported_main').hide();
                        $('[name=noInfoReported_page]').hide();
                    }
                    for (var i = 0; i < list.length; i++) {
                        var dom = renderReported(list[i]);
                        dom.data("item", list[i]);
                        dom.appendTo(parents);
                    }
                }
                parents.find(".reports-item").click(function (e) {
                    Common.stopPropagation(e);
                    var itemId = $(this).attr('data-itemId')
                    window.location.href = '/report/detail?id=' + itemId;
                })
                parents.find(".cancel").click(function (e) {
                    Common.stopPropagation(e);
                    var itemId = $(this).attr('data-itemId');
                    request.post("/customer/buildNews/cancleBuildNews/" + itemId).then(function (res) {
                        if (res.code === 1) {
                            reportedConfirm.click();
                        } else {
                            return alert(res.desc);
                        }
                    })
                })
            })
        }

        function parseAttachCount(st) {
            if (st > 0) {
                return '<span class="icon-arrow"></span>'
            } else {
                return null;
            }
        }

        function renderReported(item) {
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
                '                            <div class="reports-title" style="color: #333;">' + item.newsTitle + '<span>'+item.newsTypeName+'</span>' + '</div>\n' +
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
                '                                <a data-itemId=' + item.id + ' href="javascript:void(0)" class="cancel delete-hover">撤销</a>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </div>')
        }

        reported.click(function (e) {
            Common.stopPropagation(e);
            reported.removeClass("active");
            $(this).addClass("active");
            reportedConfirm.click();
        });
        /**
         * 获取所有的数据
         */
        reportedConfirm.click();
    }
}

module.exports = getReported;