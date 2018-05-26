var common = require('../Common');
var temporaryTaskModal = require('./model/temporaryTaskModal.ejs');
var safeAndQualityManager = require('./model/safeAndQualityManager.ejs');
var Modal = require('../../components/Model');
var projectLogModal = require('./model/projectLogModal.ejs');
var projectMainApi = require('./projectMainApi');
var projectMainRender = require('./projectMainRender');
var UploadAttach = require('../../components/UploadAttach');
var safeAndCivilizationManager = require('./model/safeAndCivilizationManager.ejs');
var taskAndTemporary = require('./model/taskAndTemporary.ejs');
var projectMainFunc = require('./projectMainFunc');
var addEmployee = require('../../components/addEmployee');
var deleteRemind = require('./model/deleteRemind.ejs');
var scheduleManager = require('./scheduleManager/initEvent');


exports.initProject = function (callback) {
    if (!$("#btnSearch").data('flag')) {
        $("#btnSearch").data("flag", true);
        $("#btnSearch").click(function (e) {
            common.stopPropagation(e);
            var data = {};
            var projTypeId = $("#preTypeMain").val();
            var projStatus = $("#preState").val();
            var keywords = $('.keywords').val().trim();
            if (projStatus && projStatus !== 'a') {
                data.projStatus = projStatus;
            }
            if (projTypeId && projTypeId !== 'a') {
                data.projTypeId = projTypeId
            }
            if (keywords) {
                data.keywords = keywords;
            }
            if (callback) {
                callback(data);
            }
        })
    }
};
exports.initPrincipalAndLogo = function () {
    //左上角负责人+logo
    var user = JSON.parse(localStorage.getItem('user'));
    $('#projectPrincipal').html(user.employee.userName);
    if (user.employee.headImageUrl) {
        $('[name="projectPrincipalLogo"]').click(function () {
            window.location.href = '/index#/project';
        }).css({
            'cursor': 'pointer',
            'width': '100%',
            'height': '100%',
            'marginTop': '0px'
        }).attr('src', window.API_PATH + '/customer/' + user.employee.headImageUrl);
    }
}

exports.initMainPageEvent = function initMainPageEvent() {
    //左上角负责人+logo
    var user = JSON.parse(localStorage.getItem('user'));
    $('#projectPrincipal').html(user.employee.userName);
    if (user.employee.headImageUrl) {
        $('[name="projectPrincipalLogo"]').click(function () {
            window.location.href = '/index#/project';
        }).css({
            'cursor': 'pointer',
            'width': '100%',
            'height': '100%',
            'marginTop': '0px'
        }).attr('src', window.API_PATH + '/customer/' + user.employee.headImageUrl);
    }

    var safeManager = $('#safeManager');
    if (safeManager.length > 0 && !safeManager.data("flag")) {
        safeManager.data("flag", true);
        /**
         * 安全进度管理
         */
        safeManager.click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('安全进度管理', safeAndQualityManager());
            modal.show();
            var attach = new UploadAttach(modal.$body.find('#communiqueFile'));
            var user = localStorage.getItem('user');
            user = user ? JSON.parse(user).employee : {};
            modal.$body.find("#employee").val(user.userName);
            var $confirm = modal.$body.find(".confirm");
            $confirm.data("type", 3);
            initConfirmQualifyManager($confirm, modal, attach);
        });
        /**
         * 质量进度 管理
         */
        $("#qualifyManager").click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('质量进度', safeAndQualityManager());
            modal.show();
            modal.showClose();
            var attach = new UploadAttach(modal.$body.find('#communiqueFile'));
            var user = localStorage.getItem('user');
            user = user ? JSON.parse(user).employee : {};
            modal.$body.find("#employee").val(user.userName);
            var $confirm = modal.$body.find(".confirm");
            $confirm.data("type", 4);
            initConfirmQualifyManager($confirm, modal, attach);
        });
        /**
         * 临时任务
         */
        $("#temporaryTask").click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('临时任务', temporaryTaskModal());
            modal.showClose();
            modal.show();
            var $confirm = modal.$body.find(".confirm");
            $confirm.data("type", 2);
            initConfirmClick($confirm, modal);
        });
        /**
         * 新建通知
         */
        $("#newNotice").click(function (e) {
            common.stopPropagation(e);
            var modal = Modal('新建通知', temporaryTaskModal());
            modal.showClose();
            modal.show();
            var $confirm = modal.$body.find(".confirm");
            $confirm.data("type", 1);
            initConfirmClick($confirm, modal);
        });
        /**
         * 施工日志
         */
        // initBuilderDiary();
    }
};
exports._initBuilderDiary = initBuilderDiary;
function initBuilderDiary(){
    $('#weeks').off('click');
    $('#weeks').on('click','.day',function (e) {
        common.stopPropagation(e);
        var date = $(this).data("time");
        var id = $(this).data("id");
        var target = moment(date).format("YYYY-MM-DD").split('-').join('')/1;//点击的日期
        var today = moment().format("YYYY-MM-DD").split('-').join('')/1;//今天的日期

        if (id) {
            // LEE:查看日志的时候，要判断当前用户，如果记录日志的用户和当前登录的用户不是同一人，则无修改日志权限，需隐藏或禁用确定按钮。
            var user = JSON.parse(localStorage.getItem('user') || '{}');
            var modal = Modal('查看日志', projectLogModal());
            modal.showClose();
            modal.show();
            var $confirm = modal.$body.find(".confirm");
            modal.$body.find("input[type=date]").val(moment(date).format("YYYY-MM-DD"));
            modal.$body.find("input[type=date]").attr('disabled', true);
            modal.$body.find("#projName").val($('.project-menu-title span').text());
            projectMainApi.getBlogAuth().then(function (res) {
                if (res.data === 1) {
                }
            })
            projectMainApi.getBlog({
                id: id,
                remarkDate: moment(date).format('YYYYMMDD')
            }, function (res) {
                if (res.code === 1) {
                    initBlogModalData(modal, res.data);
                    $confirm.data("id", res.data.id);
                    console.log('user: ')
                    console.log(user)
                    console.log('res.data: ')
                    console.log(res.data);
                    if(res.data.addUserName !== user.employee.userName) {
                        $confirm.hide();
                    }
                }
            });
            initBlogMenuBtn($confirm, modal, 'check');
        } else if(target <= today){
            var modal = Modal('新建日志', projectLogModal());
            modal.showClose();
            modal.show();
            var user = localStorage.getItem('user');
            user = user ? JSON.parse(user).employee : {};
            modal.$body.find("#projName").val($('.project-menu-title span').text());
            modal.$body.find("input[type=date]").attr('disabled', true);
            modal.$body.find("[name=userName]").val(user.userName);
            var $confirm = modal.$body.find(".confirm");
            $confirm.data("id", "");
            modal.$body.find("input[type=date]").val(moment(date).format("YYYY-MM-DD"));
            initBlogMenuBtn($confirm, modal, 'new');
        }
    });
}

function initConfirmClick($confirm, modal) {
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data("type");
        var title = modal.$body.find("#title").val();
        var content = modal.$body.find("#content").val();
        if (!title) {
            return alert('请输入标题');
        }
        if (!content) {
            return alert('请输入内容');
        }
        projectMainApi.postProjectMain({noticeTitle: title, noticeContent: content, noticeType: type}, function (res) {
            if (res.code === 1) {
                modal.hide();
                if (type === 1) {
                    projectMainApi.getProjectMain({noticeType: 1}, function (res) {
                        projectMainRender.renderProjectMain(res.data.data);
                    })
                } else if (type === 2) {
                    projectMainApi.getProjectMain({noticeType: 2}, function (res) {
                        projectMainRender.renderProjectMain(res.data.data);
                    })
                }
            }
        })
    })
}

function initConfirmQualifyManager($confirm, modal, attach) {
    $confirm.click(function (e) {
        common.stopPropagation(e);
        var type = $(this).data("type");
        var title = modal.$body.find("#title").val();
        var noticeContent = modal.$body.find('[name=content]').val();
        var attaches = attach.getAttaches();
        if (!title) {
            return alert('请输入标题');
        }
        if (!noticeContent) {
            return alert('请输入内容');
        }
        if (typeof attaches === 'boolean') {
            return attaches;
        }
        var flag = true;
        for (var i = 0; i < attaches.length; i++) {
            if (!(attaches[i].attachType == 'png' || attaches[i].attachType == 'PNG' || attaches[i].attachType == 'jpg' || attaches[i].attachType == 'JPG' || attaches[i].attachType == 'jpeg' || attaches[i].attachType == 'JPEG')) {
                flag = false;
                break;
            }
        }
        if (flag === false) {
            return alert('只能上传图片！');
        }
        if (attaches.length > 6) {
            return alert('最多上传6张图片');
        }
        projectMainApi.postProjectMain({
            noticeTitle: title,
            noticeContent: noticeContent,
            noticeType: type,
            attaches: attaches
        }, function (res) {
            if (res.code === 1) {
                modal.hide();
                if (type === 3) {
                    projectMainApi.getProjectMain({noticeType: 3, pageSize: 3}, function (res) {
                        if (res.code === 1) {
                            projectMainRender.renderSafeDom(res.data.data);
                        }
                    })
                } else if (type === 4) {
                    projectMainApi.getProjectMain({noticeType: 4, pageSize: 3}, function (res) {
                        if (res.code === 1) {
                            projectMainRender.renderQualityDom(res.data.data);
                        }
                    })
                }
            }
        })
    })
}

/**
 * 初始化日志按钮
 * 如果没有日志，新建日志，填写日志，提交日志
 */
function initBlogMenuBtn($confirm, modal, type) {
    if (!$confirm.data("flag")) {
        $confirm.data("flag", true);
        $confirm.click(function (e) {
            common.stopPropagation(e);
            var id = $(this).data("id");
            // LEE；新建日志中需要填写的所有项(包含Input和textarea)
            var inputs = $.merge(modal.$body.find("input[type=text]"), modal.$body.find("textarea"));
            // 原来为：var inputs = modal.$body.find("input[type=text]");
            var error = false;
            var errorMsg = '';
            var data = {};
            for (var i = 0, length = inputs.length; i < length; i++) {
                var input = inputs[i];
                var value = $(input).val();
                var name = $(input).attr('name');
                var warn = $(input).data('warn');
                if (warn) {
                    data[name] = value;
                }
                if (warn && !value) {
                    error = true;
                    errorMsg = warn;
                    break;
                }
            }
            /**
             * LEE：textarea的地方原本为input
             */
            data.subProjName1 = $('textarea[name=subProjName1]').val();
            data.subProjContent1 = $('textarea[name=subProjContent1]').val();
            data.subProjName2 = $('textarea[name=subProjName2]').val();
            data.subProjContent2 = $('textarea[name=subProjContent2]').val();
            data.subProjName3 = $('textarea[name=subProjName3]').val();
            data.subProjContent3 = $('textarea[name=subProjContent3]').val();
            if (error) {
                return alert(errorMsg);
            }
            if (modal.$body.find("[name=scheduleType]:checked")) {
                var $value = modal.$body.find("[name=scheduleType]:checked").val();
                if ($value === '1') {
                    data.requireWorker = 0
                }
                data.scheduleType = $value;
            }
            data.remarkDate = modal.$body.find('[name=remarkDate]').val();
            if (!data.remarkDate) {
                return alert('请输入日期');
            }
            data.id = id;
            var isExist = moment(data.remarkDate).format('YYYYMMDD');
            if (!id && $('t-' + isExist).length > 0) {
                return alert('该日期已经存在日志了');
            }
            if(type === 'check'){
                data.id = $confirm.data('id');
            }
            if (data.id) {
                projectMainApi.putBlog(data, function (res) {
                    if (res.code === 1) {
                        modal.hide();
                        var start = $('#weeks').find(".day:first").data("time");
                        var end = $('#weeks').find(".days:last-child").find(".day:last").data("time");
                        projectMainApi.getBlogInterval(start, end, function (res) {
                            res.data = res.data ? res.data : [];
                            projectMainRender.renderWeekBindId(res.data);
                        })
                    }
                })
            } else {
                projectMainApi.postBlog(data, function (res) {
                    if (res.code === 1) {
                        modal.hide();
                        var start = $('#weeks').find(".day:first").data("time");
                        var end = $('#weeks').find(".days:last-child").find(".day:last").data("time");
                        projectMainApi.getBlogInterval(start, end, function (res) {
                            res.data = res.data ? res.data : [];
                            projectMainRender.renderWeekBindId(res.data);
                        });
                    }
                })
            }
        });

        modal.$body.find("[name=scheduleType]").click(function (e) {
            common.stopPropagation(e);
            if ($(this).val() === '1') {
                modal.$body.find("[name=requireWorker]").attr("disabled", true);
                modal.$body.find("[name=requireWorker]").val("");
            } else {
                modal.$body.find("[name=requireWorker]").attr("disabled", false);
            }
        })
    }
}

/**
 * 初始化dom数据
 * 如果有日志，展示日志
 */
function initBlogModalData(modal, obj) {
    // var inputs = modal.$body.find("input[type=text]");
    // 日志中需要展示的所有项
    var inputs = $.merge(modal.$body.find("input[type=text]"), modal.$body.find("textarea"));
    for (var i = 0, length = inputs.length; i < length; i++) {
        var input = inputs[i];
        var name = $(input).attr('name');
        if (name) {
            $(input).val(obj[name]);
        }
    }
    modal.$body.find('[name=userName]').val(obj.addUserName);
    modal.$body.find("[name=scheduleType][value=" + obj.scheduleType + "]").attr("checked", true);
}

/**
 * 初始化系统保存按钮
 * @param list
 */
exports.initSystemSaveBtn = function initSystemSaveBtn() {
    var settingSave = $("#settingSave");
    if (settingSave.length > 0 && !settingSave.data("flag")) {
        settingSave.data("flag", true);
        settingSave.click(function (e) {
            common.stopPropagation(e);
            var inputs = $("#settingSystemData").find("input[type=text]");
            var data = {};
            var error = false;
            var errMsg = '';
            for (var i = 0, length = inputs.length; i < length; i++) {
                var value = $(inputs[i]).val();
                var name = $(inputs[i]).attr("name");
                var warn = $(inputs[i]).data("warn");
                data[name] = value;
                if (warn && !value) {
                    error = true;
                    errMsg = warn;
                    break;
                }
                if (i != inputs.length - 1 && isNaN(value)) {
                    return alert('请输入正确数字');
                }
            }
            if (error) {
                return alert('请输入' + errMsg);
            }
            data.scheduleBeforeHours = 24;
            var excpBudPriceMin = $('[name=excpBudPriceMin]').val();
            var excpBudPriceMax = $('[name=excpBudPriceMax]').val();
            if (excpBudPriceMin <= 0 || excpBudPriceMin > 1 || excpBudPriceMin.length > 4) {
                return alert('最小范围值应在0~1之间(包括1但不包括0)，且最多输入两位小数');
            }
            if (excpBudPriceMax < 1 || excpBudPriceMax >= 10 || excpBudPriceMax.length > 4) {
                return alert('最大范围值应在1~10之间(包括1但不包括10)，且最多输入两位小数');
            }

            data.excpBudPriceMin = excpBudPriceMin;
            data.excpBudPriceMax = excpBudPriceMax;
            var excpQpyType = $("[name=excpQpyType]:checked");
            if (excpQpyType.length === 0) {
                return alert('请选择数量管理方式');
            }
            var settleType = $("[name=settleType]:checked");
            if (settleType.length === 0) {
                return alert('请选择结算方式');
            }
            var projState = $("[name=projState]:checked");
            if (projState.length === 0) {
                return alert('请选择工程状态');
            }
            data.projState = projState.val();
            data.settleType = settleType.val();
            data.excpQpyType = excpQpyType.val();
            var buidLogUserNo = $('[name=buidLogUserNo]').data('user');
            if (!buidLogUserNo) {
                return alert('请选择施工负责人');
            }
            data.buidLogUserNo = buidLogUserNo.userNo;
            data.mtrlAddLimit = 0;
            data.mtrlDirectLimit = 0;
            projectMainApi.postSystemSetting(data, function (res) {
                if (res.code === 1) {
                    window.location.href = '/project/detail/' + $("#projectSchedule").data('id') + '?name=' + $('.project-menu-title span').text();
                }
            })
        });
        $("#confirmSetting").click(function (e) {
            common.stopPropagation(e);
            var subProjName = $("[name=subProjName]").val();
            if (!subProjName) {
                return alert('请输入分部名称');
            }
            projectMainApi.postSubProject({subProjName: subProjName}, function (res) {
                if (res.code === 1) {
                    $("[name=subProjName]").val("");
                    projectMainApi.getSubProject(function (res) {
                        projectMainRender.renderSubProjectDom(res.data.data)
                    })
                }
            })
        });
        $("#cancelSetting").click(function (e) {
            common.stopPropagation(e);
            $("[name=subProjName]").val("");
            $('.project-department-ipt').hide();
            $('.add-project-department').show();
        });
        $('[name=buidLogUserNo]').click(function (e) {
            common.stopPropagation(e);
            var user = $(this).data('user');
            // var that = this;
            // var $addEmployee = new addEmployee('添加负责人', function (data) {
            //     $addEmployee.hide();
            //     var $user = data[0] ? data[0] : null;
            //     $(that).data('user', $user);
            //     $(that).text($user.userName);
            // }, 'single');
            // $addEmployee.getUserTreeList(function () {
            //     var list = [];
            //     if (user) {
            //         list.push(user);
            //     }
            //     $addEmployee.renderSelectData(list);
            // });
            // $addEmployee.show();
            scheduleManager.addEmployeeTable(user, $(this)[0]);

        });
        $('.add-project-department').click(function (e) {
            common.stopPropagation(e);
            $('.project-department-ipt').show();
            $('.project-department-ipt').find('input').focus();
            $(this).hide();
        })
    }
};

exports.initSubProjectBtnDel = function () {
    $('#project-department').find("i").click(function (e) {
        common.stopPropagation(e);
        var that = this;
        var id = $(that).data("id");
        projectMainApi.delSubProject(id, function (res) {
            if (res.code === 1) {
                $(that).parent('div').remove();
            }
        })
    })
};


exports.initMainPageTableEvent = function (parents) {
    parents.find('tr a').click(function (e) {
        common.stopPropagation(e);
        var that = this;
        var modal = Modal('提示', deleteRemind());
        modal.show();
        modal.$body.find('.confirm').click(function () {
            var item = $(that).parents('tr').data('item');
            var trId = item.id;
            modal.$body.find('.span-btn-bc').click();
            projectMainFunc.delProjectMainFunc(trId);
        })
    })
    parents.find('tr').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).data('item');
        var safeAndCivilizationModal = Modal('安全文明详情', safeAndCivilizationManager());
        safeAndCivilizationModal.show();
        safeAndCivilizationModal.showClose();
        initSafeAndCivilizationModalData(safeAndCivilizationModal, item);
    })
};

function initSafeAndCivilizationModalData() {
    var modal = arguments[0];
    var item = arguments[1];
    modal.$body.find('.safe-title').text(item.noticeTitle);
    modal.$body.find('[name=userName]').text(item.userName);
    modal.$body.find('[name=addTime]').text(moment(item.addTime).format('YYYY/MM/DD'));
    modal.$body.find('.modal-content').text(item.noticeContent);
    var list = item.attaches || [];
    var parents = modal.$body.find('.modal-images').html('');
    for (var i = 0, length = list.length; i < length; i++) {
        var $item = list[i];
        var url;
        var HDurl;
        HDurl = $item.attachUrl;
        if ($item.thumbnailUrl) {
            url = $item.thumbnailUrl;
        } else {
            url = $item.attachUrl;
        }
        var dom = $('<a class="imgDesc" target=_blank href="' + window.API_PATH + '/customer' + HDurl + '">\
      <img src="' + window.API_PATH + '/customer' + url + '">\
          </a>');
        dom.appendTo(parents);
    }
    if (list.length === 1) {
        $('.modal-images').addClass('fl');
    } else if (list.length === 2 || list.length === 4) {
        $('.modal-images').removeClass('fl').css({'textAlign': 'center'}).find('a').css('margin', '0 20px');
        $('.modal-images').appendTo($('.model-section'));
    } else if (list.length === 5) {
        $('.modal-images').removeClass('fl').css({'textAlign': 'center'});
        $('.modal-images').appendTo($('.model-section'));
    } else {
        $('.modal-images').appendTo($('.model-section'));
    }

    modal.$body.find('.span-btn').click(function () {
        modal.$close.click();
    })
}

exports.initSafeDomEvent = function (parents, type) {
    parents.find('.item-content').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('.con-item').data('item');
        var safeAndCivilizationModal = Modal(type, safeAndCivilizationManager());
        safeAndCivilizationModal.show();
        safeAndCivilizationModal.showClose();
        initSafeAndCivilizationModalData(safeAndCivilizationModal, item);
        safeAndCivilizationModal.$body.find('span').click(function (e) {
            common.stopPropagation(e);
            safeAndCivilizationModal.$close.click();
        });
    })
};

exports.initTemporaryFloatEvent = function (parents) {
    var len = parents.find('li').length;
    /*游标随鼠标移动*/
    parents.find('.tab-item.tab-show').on('mouseover', function () {
        var num = $(this).data('type');
        var buoy = parents.find('.control-buoy');
        var ul = parents.find('ul');
        ul.css('top', -170 * (num - 1));
        buoy.css('top', 10 + 20 * (num - 1));
    })

    /*固定游标*/
    parents.find('.tab-item.tab-show').on('click', function (e) {
        common.stopPropagation(e);
        parents.find('.tab-item.tab-show').removeClass('active');
        $(this).addClass('active');
        var num = parents.find('.tab-item.active').data('type');
        /*固定两个游标的位置*/
        var buoyFixed;//固定标记
        var buoy;//游标
        buoyFixed = parents.find('.control-buoy-fixed');
        buoy = parents.find('.control-buoy');
        var ul = parents.find('ul');
        ul.css('top', -170 * (num - 1));
        buoyFixed.css('top', 10 + 20 * (num - 1));
        buoy.css('top', 10 + 20 * (num - 1));
    })

    /*离开某区域，游标位置复原*/
    parents.find('.tab-item-container').on('mouseleave', function () {
        var num = parents.find('.tab-item.active').data('type');
        var buoy = parents.find('.control-buoy');
        var ul = parents.find('ul');
        ul.css('top', -170 * (num - 1));
        buoy.css('top', 10 + 20 * (num - 1));
    })

    /*轮播图 初始化*/
    var timer;

    function banner(m) {
        var n = m || 1;
        timer = setInterval(function () {
            n++;
            if (n > len) {
                n = 1;
            }
            parents.find('.tab-item.tab-show').removeClass("active");
            parents.find('.tab-item.tab-show').eq(n - 1).addClass('active');
            var buoyFixed = parents.find('.control-buoy-fixed');
            var buoy = parents.find('.control-buoy');
            var ul = parents.find('ul');
            ul.css('top', -170 * (n - 1));
            buoyFixed.css('top', 10 + 20 * (n - 1));
            buoy.css('top', 10 + 20 * (n - 1));
        }, 3000);
    }

    /*存在一个以上内容时启用轮播图*/
    if (len > 1) {
        /*鼠标不在banner区域时 第一次触发计时器*/
        $('body').one('mousemove', function (e) {
            ;
            if (!(e.pageX > 200 && e.pageX < 960 && e.pageY > 140 && e.pageY < 310)) {
                banner();
            }
        });
        /*轮播图 暂停*/
        parents.on('mouseenter', function () {
            clearInterval(timer);
        })

        /*轮播图 开启*/
        parents.on('mouseleave', function () {
            var m = parents.find('.tab-item.active').data('type');
            banner(m);
        })
    }


    /*点击标题展示详情*/
    parents.find('.banner-container').click(function (e) {
        common.stopPropagation(e);
        var item = $(this).parents('li').data('item');
        var bannerTitleName = $(this).parents('li').find('.bannerTitleName').text() + '详情';
        var safeAndCivilizationModal = Modal(bannerTitleName, safeAndCivilizationManager());
        safeAndCivilizationModal.show();
        safeAndCivilizationModal.showClose();
        initSafeAndCivilizationModalData(safeAndCivilizationModal, item);
    })
};

function clearbox() {//点击空白处清除弹出框
    $('body').click(function () {
        $('.model-project-common.modal-arrow-left').remove(); //复用左边弹出框
        $('.quantity-check-detail').remove(); // 成本预算/工程量核算 查看
        $('.memorandum-detail').remove(); // 成本预算/材料、人工、措施、分包 查看
        $('.sub-project-list').remove(); // 成本预算/打开
        $('.arrow-menu').remove(); // 成本预算/打开
        $('.model-add-supplier').remove();//选择供应商
        $('.Select-render').removeClass('active');
    })
}

clearbox();
