var charge = {};
var chargeApi = require('./chargeApi');
var enterpriseApi = require('./enterpriseApi');
var renderTableDom = require('./renderTableDom');
var common = require('../Common');
var modalEventHandler = require('./modal/modalEventHandler');
charge.renderNav = function renderNav(list, type, parents, $dom, childParents, page) {
    list = list || [];
    for (var i = 0, length = list.length; i < length; i++) {
        var item = list[i];
        var name = '';
        if (type === 'charge') {
            name = item.laborTypeName;
        } else if (type === 'step') {
            name = item.measureTypeName;
        } else if (type === 'subpackage') {
            name = item.subletTypeName;
        } else if (type === 'supplier') {
            name = item.entpTypeName;
        } else if (type === 'library') {
            name = item.projTypeName;
        } else if (type === 'enterprise' || type === 'enterprise-level') {
            name = item.mtrlCategoryName || item.mtrlTypeName;
        } else if (type === 'hr') {
            name = item.teamName;
        }
        var dom = $('<li>\
                  <a class="ellipsis" style="padding: 0 60px 0 20px;display: block;" href="javascript:void(0)">\
                   <span style="margin-right: 5px;" class="arrow level hide" data-type="open"></span>' + name + '\
                   <div class="icon-position small14">\
                    <span class="icon-enterprise-one-add level hide" data-type="add"></span>\
                    <span class="icon-enterprise-one-edit handle" data-type="edit"></span>\
                    <span class="icon-enterprise-one-delete handle" data-type="delete"></span>\
                   </div>\
                  </a>\
                  </li>');
        if ((type === 'enterprise' || type === 'enterprise-level') && !$dom) {
            dom.find('.level').css("display", "inline-block");
            dom.find('.level').removeClass('hide');
        } else {
            dom.find('.level').addClass('hide');
            dom.find('.level').hide();
        }
        var child = item.children;
        if (child) {
            var $childDom = $('<ul class="nav-content no-padding nav-none level2"></ul>');
            renderNav(item.children, type, parents, dom, $childDom, page);
        }
        if ($dom) {
            dom.appendTo(childParents);
            childParents.appendTo($dom);
            dom.attr('id', item.id + '-level');
            dom.data("level", "child");
        } else {
            dom.appendTo(parents);
            if (item.id) {
                dom.attr('id', item.id);
            } else {
                dom.attr('id', item.teamId);
            }
            dom.data("level", "parent");
        }
        dom.data('type', type);
        dom.data('item', item);
        renderTableDom.renderCompetence(dom, type);
        dom.click(function (e) {
            common.stopPropagation(e);
            $('.model-project-common.addEmployeeModal').remove();
            var level = $(this).data('level');
            var type = $(this).data('type');
            var item = $(this).data('item');

            // console.log('-0------------');
            // console.log(item);

            var childItem = "";
            if (level === 'child') {
                $(this).parents("ul").find(">li").removeClass("active");
                $(this).addClass("active");
                $(this).parents("ul").find('ul').hide();
                $(this).parents("li").addClass("active");
                $(this).parents("ul").show();
            } else if (level === 'parent' && (type === 'enterprise' || type === 'enterprise-level')) {
                if ($(this).find('li').length == 0) {
                    // $("#noInfoEnterprise_search").hide();
                    $("[name='noInfoEnterprise_page']").hide();
                    $(".table-content").hide();
                    $("#noInfoEnterprise").show();
                    $("#noInfoEnterpriseList").show();
                    $("#noInfoEnterpriseDesc").html('添加数据前，请先创建二级分类！')
                    $("#noInfoAddEnterprise").hide();
                } else {
                    $("#noInfoEnterprise_search").show();
                    $("[name='noInfoEnterprise_page']").show();
                    $(".table-content").show();
                    $("#noInfoEnterprise").hide();
                    $("#noInfoEnterpriseList").hide();
                    $("#noInfoEnterpriseDesc").html('点击下方新增按钮添加数据！')
                    $("#noInfoAddEnterprise").show();
                }
                if ($(this).hasClass('active')) {
                    $(this).parents("ul").find("li").removeClass("active");
                    $(this).parents("ul").find('.arrow').removeClass('active');
                    $(this).parents("ul").find('ul').slideUp(200);
                } else {
                    $(this).parents("ul").find("li").removeClass("active");
                    $(this).parents("ul").find('.arrow').removeClass('active');
                    $(this).parents("ul").find('ul').slideUp();
                    $(this).addClass('active');
                    $(this).find("ul").slideDown(200);
                }
                $(this).find("ul>li:first-child").addClass("active");
                childItem = $(this).find("ul>li:first-child").data("item");
                if (childItem && childItem.children && childItem.children.length > 0) {
                    if ($(this).hasClass("active")) {
                        $(this).find(".arrow").addClass("active");
                    } else {
                        $(this).find(".arrow").removeClass("active");
                    }
                }
            } else {
                $(this).parents('ul').find("li").removeClass("active");
                $(this).addClass("active");
            }
            var name = '';
            if (type === 'charge') {
                name = item.laborTypeName;
            } else if (type === 'step') {
                name = item.measureTypeName;
            } else if (type === 'subpackage') {
                name = item.subletTypeName;
            } else if (type === 'supplier') {
                name = item.entpTypeName;
            } else if (type === 'library') {
                name = item.projTypeName;
            } else if (type === 'enterprise') {
                if (level === 'parent' && item.children.length <= 0) {
                    //todo  待优化
                    $('#enterpriseLibrary').html('');
                    $("#tableTitle").text(item.mtrlCategoryName);
                    var inputs = $("#enterpriseLibrary").find("tr input");
                    for (var i = 0, length = inputs.length; i < length; i++) {
                        $(inputs[i]).prop("checked", false);
                    }
                    return
                } else if (level === 'parent') {
                    item = childItem;
                }
                name = item.mtrlCategoryName || item.mtrlTypeName;
            } else if (type === 'hr') {
                name = item.teamName;

                // LEE: 人力资源库common-header增加所属供应商 
                var entpName = item.entpName;
                var $entpNameDom = $('<span class="entp-name"></span>');
                $entpNameDom.css({
                    marginLeft: '20px',
                    font: "12px MicrosoftYahei",
                    color: "5b5b5b"
                });
                $entpNameDom.text("隶属供应商：" + entpName);
                $('#tableTitle').next('.entp-name').remove();
                $('#tableTitle').after($entpNameDom);
            }

            $("#tableTitle").text(name);

            chargeApi.getTableList(item, type, page)
        });
    }
    if ($("#childNav").html()) {//企业库分级列表空页面展示
        $("#childNav").show();
        $("#noInfoEnterpriseList").hide();
        $("#noInfoEnterpriseDesc").html('点击下方新增按钮添加数据！')
        $("#noInfoAddEnterprise").show();
    } else {
        $("#noInfoEnterpriseDesc").html('添加数据前，请先在左边的列表中创建分类！')
        $("#noInfoAddEnterprise").hide();
        $("#childNav").hide();
        $("#noInfoEnterpriseList").show();
    }
};

charge.initDomSpanClick = function (parents) {
    parents.find('span').click(function (e) {
        common.stopPropagation(e);
        if ($(this).hasClass('hide')) {
            return
        }
        var liDom = $(this).parents("li");
        var $type = $(this).data('type');
        var item = liDom.data('item');
        var type = liDom.data("type");
        var id = liDom.attr("id");
        if (item.id + "-level" === id) {
            type = "enterprise-level";
        }
        if ($type === 'edit') {
            //todo  待优化 item
            modalEventHandler.createChildNav(type, "update", item, item);
        } else if ($type === 'delete') {
            modalEventHandler.delChildNavFindById(item, type);
        } else if ($type === 'add') {
            modalEventHandler.createChildNav("enterprise-level", "add-level", null, item);
        }
    });
};

module.exports = charge;