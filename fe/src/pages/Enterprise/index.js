var common = require('../Common');
var chargeApi = require('./chargeApi');
var enterpriseApi = require('./enterpriseApi');
var modalEventHandler = require('./modal/modalEventHandler');
var initEnterpriseFunc = require('./initEnterpriseFunc');
var _initEvent = require('./initEvent');
var searchModal = require('./modal/search.ejs');
var Page = require('../../components/Page');
var Model = require('../../components/Model');

function initEvent(type, page) {
    var enterpriseCategory = $("#enterpriseCategory");
    var enterpriseSearch = $("#enterpriseSearch");
    enterpriseCategory.data("type", type);
    if (enterpriseCategory.length > 0 && !enterpriseCategory.data('flag')) {
        enterpriseCategory.data('flag', true);
        $('.container-list-warp').click(function (e) {
            common.stopPropagation(e);
            $('.modal-arrow-left').remove();
        });
        enterpriseCategory.click(function (e) {
            common.stopPropagation(e);
            var type = $(this).data('type');
            modalEventHandler.createChildNav(type, "add");
        });
        enterpriseSearch.click(function (e) {
            common.stopPropagation(e);
            var searchModel = Model('搜索', searchModal());
            searchModel.showClose();
            searchModel.show();
            searchModel.$body.find('.search').click(function (e) {
                common.stopPropagation(e);
                var data = {};
                data.entpType = 84;
                data.pageNo = 1;
                data.pageSize = 10;
                initEnterpriseFunc.getSearchTableFunc(data, searchModel, type)
            })
        })
        /**
         * 新增
         */
        $('#addEnterprise').click(function (e) {
            common.stopPropagation(e);
            var liItem = $("#childNav").find("li.active").data("item");
            if (!liItem) {
                return alert('请创建二级数据');
            }
            var $type = enterpriseCategory.data("type");
            modalEventHandler.putModalEvent("add", $type);
        });
        $("#noInfoAddEnterprise").click(function (e) {
            common.stopPropagation(e);
            $("#addEnterprise").trigger('click');
        })
        /**
         * 移动
         */
        $("#enterpriseMaterial").click(function (e) {
            common.stopPropagation(e);
            var type = enterpriseCategory.data("type");
            if (type !== 'enterprise') {
                return alert('该项不用移动');
            }
            modalEventHandler.moveMaterial(type);
        });
        /**
         * 移动table 数据
         */
        $('#moveEnterpriseData').click(function (e) {
            common.stopPropagation(e);
            var type = enterpriseCategory.data("type");
            modalEventHandler.moveTableData(type)
        });
        $("#btnSearch").click(function (e) {
            common.stopPropagation(e);
            var funType = 'search';
            var item = $("#childNav").find(">li.active").data("item");
            var keyword = $("#keyword").val();
            var type = enterpriseCategory.data("type");
            if (type === 'enterprise') {
                item = $("#childNav").find(">li >ul>li.active").data("item");
            }
            item.keywords = keyword;
            chargeApi.getTableList(item, type, page, funType);
        })
    }
}

function getList(type, page) {
    chargeApi.getChildNav(type, 'get', null, page);
}

module.exports = {
    ready: function (type) {
        var page = new Page($('#page'), {
            pageSize: [10, 20, 30], // 设置每页显示条数按钮
            size: 10, // 默认每页显示多少条
            total: 0
        });
        initEnterpriseFunc.renderCompetence();
        if (type === 'enterprise-material-index') {
            initEnterpriseFunc.getMaterialHistoryListFunc(null, page);
            initEnterpriseFunc.getMaterialPriceMoneyFunc(null);
            _initEvent.initMaterialHistoryEvent(page);
        } else if (type === 'enterprise-step-index') {
            initEnterpriseFunc.getStepListFunc(null, page);
            initEnterpriseFunc.getStepPriceMoneyFunc();
            _initEvent.initStepHistoryEvent(page);
        } else if (type === 'enterprise-subpackage-index') {
            initEnterpriseFunc.getSubpackageList(null, page);
            initEnterpriseFunc.getSubpackagePriceMoneyFunc();
            _initEvent.initSubpackageHistoryEvent(page);
        } else if (type === 'enterprise-charge-index') {
            initEnterpriseFunc.getLaborListFunc(null, page);
            initEnterpriseFunc.getLaborPriceMoneyFunc();
            _initEvent.initLaborHistoryEvent(page);
        } else if (type === 'enterprise-supplier-index') {
            initEnterpriseFunc.getSupplierListFunc(null, page);
            initEnterpriseFunc.getSupplierPriceMoneyFunc();
            _initEvent.initSupplierHistoryEvent(page);
        } else if (type === 'enterprise-hr-index') {
            initEnterpriseFunc.getHrListFunc(null, page);
            initEnterpriseFunc.getHrPriceMoneyFunc();
            _initEvent.initHrHistoryEvent(page);
        } else {
            initEvent(type, page);
            getList(type, page);
            if (type === 'library') {
                initEnterpriseFunc.renderLibriryCompetence()
            } else if (type === 'supplier') {
                initEnterpriseFunc.renderSupplierCompetence()
            } else {
                initEnterpriseFunc.renderEnterpirseCompetence();
            }
        }
    }
};

