var request = require('../../helper/request');
var UploadImage = require('../../components/UploadImage');
var UploadAttach = require('../../components/UploadAttach');
var Model = require('../../components/Model');
var reviewReportModal = require('./modals/reviewReportModal.ejs');
var Common = require('../Common');

function addUpdateReport() {
    var saveUpdateReport = $("#saveUpdateReport");
    if (!saveUpdateReport.data("flag")) {
        saveUpdateReport.data("flag", true);
        /**
         * 获取基础dom
         */
        var addCancel = $(".report-cancel");//返回上一层
        var sectionType = $(".sectionType");//栏目分类
        var projectDepartment = $(".projectDepartment");//项目部门
        var title = $(".title");//标题
        var content = $(".content");//正文
        var reportImage = $(".reportImage");//图片基础绑定文件
        var reportFile = $(".reportFile");//文件绑定
        var upImage = new UploadImage(reportImage);
        var attach = new UploadAttach(reportFile, true);

        var saveReport = $(".add-save");//保存
        var releaseReport = $(".add-update-release");//发布

        /**
         * 获取基础数据
         */
        request.post("/customer/buildNews/findBuildNewsTypeList").then(function (res) {
            var parents = sectionType.html("");
            $('<option value="0">请选择</option>').appendTo(parents);
            if (res.code === 1 && res.data) {
                var list = res.data.data || [];
                for (var i = 0; i < list.length; i++) {
                    var dom = $("<option></option>");
                    dom.val(list[i].id);
                    dom.text(list[i].newsTypeName);
                    dom.appendTo(parents);
                }
            }
        });
        request.post("/customer/staff/findProjDeptListByUserNo").then(function (res) {
            var parents = projectDepartment.html("");
            $('<option value="0">请选择</option>').appendTo(parents);
            if (res.code === 1 && res.data) {
                var list = res.data.data || [];
                for (var i = 0; i < list.length; i++) {
                    var dom = $("<option></option>");
                    dom.val(list[i].projDeptId);
                    dom.text(list[i].projDeptName);
                    dom.appendTo(parents);
                }
            }
            /**
             * 预览数据回填
             */
            var _item = saveUpdateReport.data('ietm');
            if (_item) {
                sectionType.val(_item.sectionType);
                projectDepartment.val(_item.projectDepartment);
                title.val(_item.title);
                content.val(_item.content);
                var list = _item.attachs || [];
                for (var i = 0; i < list.length; i++) {
                    var $item = list[i];
                    upImage.appendImage($item.attachUrl, $item.remark, $item);
                }
            }
        });
        /**
         * 获取对应id的对象
         */
        var id = saveUpdateReport.data("id");
        if (id) {
            request.post("/customer/buildNews/findBuildNewsById/" + id).then(function (res) {
                if (res.code === 1 && res.data) {
                    var item = res.data;
                    sectionType.val(item.newsType);
                    projectDepartment.val(item.projDeptId);
                    title.val(item.newsTitle);
                    content.val(item.newsContent);
                    var list = item.attaches || [];
                    for (var i = 0; i < list.length; i++) {
                        var $item = list[i];
                        var dom = $('<div class="item UploadImage__image">' +
                            '<div class="image">' +
                            '<img src="https://gc.azhu.co/customer' + $item.attachUrl + '">' +
                            '</div>' +
                            '<div class="descText"></div>' +
                            '<div class="close"><i class="fa fa-times-circle"></i></div>' +
                            '</div>');
                        dom.data('data',$item);
                        $('.UploadImage').prepend(dom);
                        dom.find('.close').click(function(){
                            $(this).parents('.UploadImage__image').remove();
                        })
                        if ($item.remark) {
                            upImage.appendImage($item.attachUrl, $item.remark, $item);
                        } else {
                            // attach.appendAttach($item);
                        }
                    }
                }
            });
        }

        addCancel.click(function (e) {
            Common.stopPropagation(e);
            window.location.href = "/report";
        });

        /**
         * 保存快报方法
         * @param newsStatus
         */
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
            if (!contentValue) {
                return alert("请输入正文内容");
            }
            if (contentValue.length > 3000) {
                return alert('文字已经超过3000个文字');
            }
            if (data.length > 6) {
                return alert("最多上传6张图片");
            }
            if ($('.btn-add').css('display') != 'none') {
                return alert('请确认添加图片');
            }
            if (id) {
                request.put('/customer/buildNews/updBuildNews/' + id, {
                    body: {
                        newsType: sectionTypeValue,
                        projDeptId: projectDepartmentValue,
                        newsContent: contentValue,
                        newsTitle: titleValue,
                        attaches: dataFile.concat(data),
                        newsStatus: newsStatus
                    }
                }).then(function (res) {
                    if (res.code === 1) {
                        if (newsStatus === 1) {
                            window.location.href = '/report/already';
                        } else if (newsStatus === 2) {
                            window.location.href = '/report/unexecuted';
                        }
                    }
                })
            } else {
                request.post("/customer/buildNews/addBuildNews", {
                    body: {
                        newsType: sectionTypeValue,
                        projDeptId: projectDepartmentValue,
                        newsContent: contentValue,
                        newsTitle: titleValue,
                        attaches: dataFile.concat(data),
                        newsStatus: newsStatus
                    }
                }).then(function (res) {
                    if (res.code === 1) {
                        if (newsStatus === 1) {
                            window.location.href = '/report/already';
                        } else if (newsStatus === 2) {
                            window.location.href = '/report/unexecuted';
                        }
                    }
                })
            }
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
        /**
         * 预览界面生成
         */

        saveUpdateReport.click(function (e) {
            e.stopPropagation();
            var id = $(this).data('id');
            var sectionType = $('.sectionType').val();
            var sectionTypeText = $('.sectionType option:selected').text();
            var projectDepartment = $('.projectDepartment').val();
            var projectDepartmentText = $('.projectDepartment option:selected').text();
            var title = $('.title').val();
            var content = $('.content').val();
            var attachs = upImage.getImages();
            if (!sectionType || sectionType === "0") {
                return alert('请选择栏目分类')
            }
            if (!projectDepartment || projectDepartment === "0") {
                return alert('请输入项目部');
            }
            if (!title) {
                return alert('请输入标题');
            }
            if (!content) {
                return alert('请输入快报内容');
            }
            if ($('.btn-add').css('display') != 'none') {
                return alert('请确认添加图片');
            }
            var _data = {
                sectionType: sectionType,
                sectionTypeText: sectionTypeText,
                projectDepartment: projectDepartment,
                projectDepartmentText: projectDepartmentText,
                title: title,
                content: content,
                attachs: attachs
            };
            window.location.href = '/report/review?data=' + JSON.stringify(_data) + '&id=' + id;
        })
    }
}

module.exports = addUpdateReport;