var Common = require('../Common');
var initEnterpriseFunc = require('./initEnterpriseFunc');
var Model = require('../../components/Model');
var deleteModal = require('./modal/deleteModal.ejs');
var ReviewImage = require('../../components/ReviewImage');
var enterpriseApi = require('./enterpriseApi');

/**
 * 人工费
 * @param parents
 */
exports.initChargeTableFindByTypeEvent = function (parents) {
    $('.container').click(function () {
        $('.fluctuations').hide();
    })
    $('.container-list-warp').click(function () {
        $('.fluctuations').hide();
    })
    parents.find('.confirm-hover').click(function (e) {
        Common.stopPropagation(e);
        var parent = this;
        var type = 'labor';
        var item = $(this).parents('tr').data('item');
        initEnterpriseFunc.getCheckPriceFun(parent, item, type);
    })
    parents.find('tr').click(function (e) {
        Common.stopPropagation(e);
        var labor = $('#childNav li.active').attr('id');
        sessionStorage.setItem('labor',labor);
        var item = $(this).data('item');
        window.location.href = '/enterprise/charge/detail?id=' + item.id;
    })
};

/**
 * 措施
 * @param parents
 */
exports.initStepTableFindByTypeEvent = function (parents) {
    $('.container').click(function () {
        $('.fluctuations').hide();
    })
    $('.container-list-warp').click(function () {
        $('.fluctuations').hide();
    })
    parents.find('.confirm-hover').click(function (e) {
        Common.stopPropagation(e);
        var parent = this;
        var type = 'measure';
        var item = $(this).parents('tr').data('item');
        initEnterpriseFunc.getCheckPriceFun(parent, item, type);
    })
    parents.find('tr').click(function (e) {
        Common.stopPropagation(e);
        var step = $('#childNav li.active').attr('id');
        sessionStorage.setItem('step',step);
        var item = $(this).data('item');
        window.location.href = '/enterprise/step/detail?id=' + item.id;
    })
};


/**
 * 供应商
 * @param parents
 */
exports.initSupplierFindByTypeEvent = function (parents) {
    parents.find('tr').click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).data('item');
        var supplier = $('#childNav li.active').attr('id');
        sessionStorage.setItem('supplier',supplier);
        window.location.href = '/enterprise/supplier/detail?id=' + item.id;
    });
    parents.find('.icon-arrow-gray').click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var review = new ReviewImage();
        review.getAttaches({moduleId: 27, pId: item.id}, 'attachUrl');
    })
};

/**
 * 人力资源
 * @param parents
 */
exports.initHrFindByTypeEvent = function (parents) {
    parents.find('tr').click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).data('item');
        var hr = $('#childNav li.active').attr('id');
        sessionStorage.setItem('hr',hr);
        window.location.href = '/enterprise/hr/detail?id=' + item.id + '&workerNo=' + item.workerNo;
    });
    parents.find('.icon-arrow-gray').click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).parents('tr').data('item');
        var review = new ReviewImage();
        review.getAttaches({moduleId: 15, pId: item.id}, 'attachUrl');
    })
};

/**
 * 分包费
 * @param parents
 */
exports.initSubPackageTableFindByTypeEvent = function (parents) {
    $('.container').click(function () {
        $('.fluctuations').hide();
    })
    $('.container-list-warp').click(function () {
        $('.fluctuations').hide();
    })
    parents.find('.confirm-hover').click(function (e) {
        Common.stopPropagation(e);
        var parent = this;
        var type = 'sublet';
        var item = $(this).parents('tr').data('item');
        initEnterpriseFunc.getCheckPriceFun(parent, item, type);
    })
    parents.find('tr').click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).data('item');
        var subpackage = $('#childNav li.active').attr('id');
        sessionStorage.setItem('subpackage',subpackage);
        window.location.replace('/enterprise/subpackage/detail?id=' + item.id);
    })
};
/**
 * 材料费
 * @param parents
 */
exports.initMaterialTableFindByTypeEvent = function (parents) {
    $('.container').click(function () {
        $('.fluctuations').hide();
    })
    $('.container-list-warp').click(function () {
        $('.fluctuations').hide();
    });
    parents.find('.confirm-hover').click(function (e) {
        Common.stopPropagation(e);
        var parent = this;
        var type = 'material';
        var item = $(this).parents('tr').data('item');
        initEnterpriseFunc.getCheckPriceFun(parent, item, type);
    });
    parents.find('tr').click(function (e) {
        Common.stopPropagation(e);
        var item = $(this).data('item');
        var material = $('#childNav>li.active').attr('id');
        var _material = $('#childNav>li.active ul li.active').attr('id');
        sessionStorage.setItem('material',material);
        sessionStorage.setItem('_material',_material);

        window.location.replace('/enterprise/material/detail?id=' + item.id);
    });
};

exports.initMaterialHistoryEvent = function (page) {//材料详情搜索
    $('#modalHistoryModal').click(function (e) {
        Common.stopPropagation(e);
        var data = {};
        var keywords = $('.keywords').val().trim();
        // if (!keywords || keywords.trim() === '') {
        //   return alert('请输入关键字')
        // }
        data.keywords = keywords;
        initEnterpriseFunc.getMaterialHistoryListFunc(data, page);
    });
    $('#callback').click(function (e) {
        Common.stopPropagation(e);
        window.location.replace('/enterprise')
    });
};
exports.initSupplierHistoryEvent = function (page) {//供应商库详情搜索
    $('#modalHistoryModal').click(function (e) {
        Common.stopPropagation(e);
        var data = {};
        var keywords = $('.keywords').val().trim();
        // if (!keywords || keywords.trim() === '') {
        //   return alert('请输入关键字')
        // }
        var enterpriseType = $('.enterpriseType').val();
        if (enterpriseType) {
            data.type = enterpriseType;
        }
        data.keywords = keywords;
        initEnterpriseFunc.getSupplierListFunc(data, page);
    });
    $('#callback').click(function (e) {
        Common.stopPropagation(e);
        window.location.replace('/enterprise/supplier')
    });
};
exports.initStepHistoryEvent = function (page) {//措施详情搜索
    $('#modalHistoryModal').click(function (e) {
        Common.stopPropagation(e);
        var data = {};
        var keywords = $('.keywords').val().trim();
        // if (!keywords || keywords.trim() === '') {
        //   return alert('请输入关键字')
        // }
        data.keywords = keywords;
        initEnterpriseFunc.getStepListFunc(data, page);
    });
    $('#callback').click(function (e) {
        Common.stopPropagation(e);
        window.location.replace('/enterprise/step');
    });
};

exports.initSubpackageHistoryEvent = function (page) {//分包详情搜索
    $('#modalHistoryModal').click(function (e) {
        Common.stopPropagation(e);
        var data = {};
        var keywords = $('.keywords').val().trim();
        // if (!keywords || keywords.trim() === '') {
        //   return alert('请输入关键字')
        // }
        data.keywords = keywords;
        initEnterpriseFunc.getSubpackageList(data, page);
    });
    $('#callback').click(function (e) {
        Common.stopPropagation(e);
        window.location.replace('/enterprise/subpackage')
    });
};

exports.initLaborHistoryEvent = function (page) {//人工费详情搜索
    $('#modalHistoryModal').click(function (e) {
        Common.stopPropagation(e);
        var data = {};
        var keywords = $('.keywords').val().trim();
        // if (!keywords || keywords.trim() === '') {
        //   return alert('请输入关键字')
        // }
        data.keywords = keywords;
        initEnterpriseFunc.getLaborListFunc(data, page);
    });
    $('#callback').click(function (e) {
        Common.stopPropagation(e);
        window.location.replace('/enterprise/charge');
    });
};

exports.initHrHistoryEvent = function (page) {//人力资源详情搜索
    $('.during').jeDate({
        format: 'YYYY/MM',
        isinitVal:true
    });
    $('#modalHistoryModal').click(function (e) {
        Common.stopPropagation(e);
        // var data = {};
        // var keywords = $('.keywords').val().trim();
        // var during = $('.during').html().split(' ~ ');
        // var startTime = '';
        // var endTime = '';
        // if (during.length === 2) {
        //     startTime = $.timeStampDate(during[0])*1000;
        //     endTime = ($.timeStampDate(during[1])+(60*60*24))*1000;// 结束时间应加一天，第二天的0点算作当天的24点
        // }
        // data.startTime = startTime;
        // data.endTime = endTime;
        // data.keywords = keywords;
        // initEnterpriseFunc.getHrListFunc(data, page);
        var startTime = $('.during').html();
        if(startTime){
            var year = startTime.split('/')[0] / 1;
            var month = startTime.split('/')[1] / 1;
            var endTime = '';
            if (month < 10) {
                month = '0' + (month + 1);
            } else if (month === 12) {
                year += 1;
                month = 1;
            }
            startTime = startTime + '/01';
            endTime = year + '/' + month + '/01';
            var start = $.timeStampDate(startTime) * 1000;
            var end = $.timeStampDate(endTime) * 1000;
            var data = {};
            data.startTime = start;
            data.endTime = end;
            initEnterpriseFunc.getHrListFunc(data, page);
            // initLaborManagerFunc.getWokererKaoqinAttendFunc(recordModal, data);
        } else {
            return alert('请选择查询月份');
        }
    });
    $('#callback').click(function (e) {
        Common.stopPropagation(e);
        window.location.replace('/enterprise/hr');
    });
    $('#modalHistoryModal').click();
};

