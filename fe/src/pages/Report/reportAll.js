var request = require('../../helper/request');
var Common = require('../Common');
var reportApi = require('./reportApi');

function getAllReport(page) {
    var searchAllReport = $("#searchAllReport");
    if (!searchAllReport.data("flag")) {
        searchAllReport.data("flag", true);
        reportApi.getReportTypeList().then(function (res) {
            var list = res.data ? res.data.data : [];
            var parents = $('.allReportSelect').html('');
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
         * 获取所有的快报内容
         */
        searchAllReport.click(function (e) {
            Common.stopPropagation(e);
            var data = {};
            var sel = $(".allReportSelect").val();
            var keyWord = $(".allReportKeyWord").val();
            var time = $(".allReportBtn").find(".active").data("id");
            if (sel && sel !== "0") {
                data["newsType"] = sel;
            }
            if (time) {
                data["timeType"] = time;
            }
            if (keyWord) {
                data["newsName"] = keyWord;
            }
            initAllReportList(data, page);
        });

        function initAllReportList(data, page){
            request.post("/customer/buildNews/findAllList", {body: data}).then(function (res) {
                var $data = res.data ? res.data : '';
                var pageSize = $data ? $data.pageSize : 10;
                var pageNo = $data ? $data.pageNo : 1;
                var total = $data ? $data.total : 0;
                page.update({pageNo: pageNo, pageSize: pageSize, total: total});
                page.change(function (_data) {
                    var sel = $(".allReportSelect").val();
                    var keyWord = $(".allReportKeyWord").val();
                    var time = $(".allReportBtn").find(".active").data("id");
                    if (sel && sel !== "0") {
                        _data["newsType"] = sel;
                    }
                    if (time) {
                        _data["timeType"] = time;
                    }
                    if (keyWord) {
                        _data["newsName"] = keyWord;
                    }
                    initAllReportList(_data, page);
                });
                var parent = $("#noInfoAllReports_main").html("");
                var $list = res.data ? res.data.data : [];
                if ($list.length > 0) {
                    $('#noInfoAllReports_main').show();
                    $('#noInfoAllReports').hide();
                } else {
                    $('#noInfoAllReports_main').hide();
                    $('#noInfoAllReports').show();
                }
                for (var i = 0; i < $list.length; i++) {
                    var dom = renderAllReport($list[i]);
                    dom.appendTo(parent);
                }
                $(".reports-item").click(function (e) {
                    Common.stopPropagation(e);
                    var itemId = $(this).attr('data-itemId')
                    window.location.href = '/report/detail?id=' + itemId;
                });
            })
        }


        function renderAllReport(item) {
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
                '                            <div class="reports-title" style="color: #333">' + item.newsTitle + '<span>'+item.newsTypeName+'</span>' + '</div>\n' +
                '                            <div class="reports-content" style="color: #333">' + item.newsContent + '</div>\n' +
                '                            <div class="reports-desc" style="padding: 5px 0;" >\n' +
                '                                <label style="color: #999;">部门 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666">' + item.projDeptName + '</span>\n' +
                '                                <label style="color: #999;">发稿人 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666">' + item.userName + '</span>\n' +
                '                                <label style="color: #999;">发稿时间 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666">' + new Date(item.publishTime).Format("yyyy-MM-dd hh:mm") + '</span>\n' +
                '                                <label style="color: #999;">浏览 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666">' + item.readCount + '</span>\n' +
                '                                <label style="color: #999;">评论 :</label>\n' +
                '                                <span style="margin-right: 30px;color: #666">' + item.commentCount + '</span>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </div>')
        }

        var search = $(".allReportBtn").find(".item");
        search.click(function (e) {
            Common.stopPropagation(e);
            search.removeClass("active");
            $(this).addClass("active");
            searchAllReport.click();
        });

        /**
         * 获取所有的数据
         */
        searchAllReport.click();
    }
}

module.exports = getAllReport;