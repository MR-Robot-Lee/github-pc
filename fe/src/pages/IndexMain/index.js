var request = require('../../helper/request');
var Common = require('../Common');

function resize() {
    var windowHeight = document.documentElement.clientHeight;
    var headerHeight = $('.IndexMain .header').height();
    var navHeight = $('.IndexMain .nav').height();
    $('.IndexMain .body iframe').height(windowHeight - headerHeight - navHeight - 10);
}

function setIframe(url) {
    if (url === '/system') {
        return
    }
    var dataClass = url;
    if (url.indexOf('#/enterprise') < -1) {
        dataClass = url.indexOf('?') ? url.split('?')[0] : url;
    }
    var targetIframe = $('.iframeParent[data-url="' + dataClass + '"]');
    if (url === '/dashbord') {
        targetIframe.remove();
        targetIframe = $('.iframeParent[data-url="' + url + '"]');
    }
    $('#htmlTitle').text(parseType(url));
    if (targetIframe.length < 1) {
        targetIframe = $('<div class="iframeParent" data-url="' + url + '"><iframe src="' + url + '"></iframe></div>');
        targetIframe.appendTo('.IndexMain .body');
    }
    targetIframe.addClass('active');
    targetIframe.siblings().removeClass('active');
    var targetA = $('.IndexMain .nav a[href="#' + dataClass + '"]');
    targetA.addClass('active');
    targetA.parent().siblings().find('a').removeClass('active');
    resize();
}

function parseType(url) {
    var companyName = '';
    try {
        var user = window.localStorage.getItem('user');
        companyName = user ? JSON.parse(user).employee.companyName : ''
    } catch (e) {
    }
    switch (url) {
        default:
            return companyName;
    }
}

module.exports = {
    ready: function () {
        showOrHideSystem();
        $.isTopWindow = true;
        $(window).resize(resize);
        // window.location.hash
        $('.IndexMain .nav li').click(function () {
            var url = $(this).find('a').attr('href').replace('#', '');
            setIframe(url);
        });
        var hash = window.location.hash;
        if (!hash || hash.indexOf('#/') < 0) {
            $('.IndexMain .nav li').first().click();
        } else {
            setIframe(hash.replace('#', ''));
        }
        loginOut();
        getCompanyList();
    }
};


function loginOut() {
    var user = localStorage.getItem('user');
    user = !user ? {} : JSON.parse(user).employee;

    $('.project-nickname').text(user.companyName);
    $('.login-out').click(function (e) {
        Common.stopPropagation(e);
        $('.company-list-handler').addClass('company-hide');
        if ($(this).hasClass('login-out-hide')) {
            $(this).removeClass('login-out-hide');
        } else {
            $(this).addClass('login-out-hide');
        }
    });
    $('.login-handler').click(function (e) {
        Common.stopPropagation(e);
        var user = '';
        try {
            user = localStorage.getItem('user');
            user = user ? JSON.parse(user).employee.userNo : '';
        } catch (e) {
        }
        if (!user) {
            return alert('系统出错')
        }
        request.get('/customer/index/logout/' + user).then(function (res) {
            if (res.code === 1) {
                window.localStorage.removeItem('user');
                window.location.href = '/login';
            }
        })
    })
}

function getCompanyList() {
    request.get('/customer/index/company').then(function (res) {
        var list = res.data ? res.data : [];
        list.unshift({ companyNo: 0, etpName: '我的阿筑' });
        var parents = $('#companyList').html('');
        for (var i = 0, length = list.length; i < length; i++) {
            var item = list[i];
            var type = 'companyChange';
            if (i === 0) {
                type = 'myAZHU';
            }
            var dom = $('<div class="company-item ' + type + '" data-id="' + item.companyNo + '" title="' + item.etpName + '">\
                    <span class="icon-circle"></span>' + item.etpName + '\
                   </div>');
            dom.data('id', item.companyNo);
            dom.appendTo(parents);
        }
        parents.find('.myAZHU').click(function (e) {
            Common.stopPropagation(e);
            window.location.href = '/company/list';
        });
        parents.find('.companyChange').click(function (e) {
            Common.stopPropagation(e);
            var id = $(this).data('id');
            request.get('/customer/index/change/' + id).then(function (res) {
                if (res.code === 1) {
                    var $data = res.data || {};
                    localStorage.setItem("user", JSON.stringify($data));
                    window.location.href = '/index'
                }
            });
        });
    });
    $('.small-logo').click(function (e) {
        Common.stopPropagation(e);
        $('.login-out').addClass('login-out-hide');
        if ($('.company-list-handler').hasClass('company-hide')) {
            $('.company-list-handler').removeClass('company-hide');
        } else {
            $('.company-list-handler').addClass('company-hide');
        }
    })
    $('body').click(function () {
        $('.company-list-handler').addClass('company-hide');
        $('.login-out').addClass('login-out-hide');
    })
    $(document).click(function () {
        !($('.company-list-handler').hasClass('company-hide')) && $('.company-list-handler').addClass('company-hide');
    })
    var iframe = $('.IndexMain').find('.iframeParent').children('iframe');
    iframe.on('load', function () {
        this.contentDocument.onclick = function () {
            alert("111112");
        }
    })
}

function showOrHideSystem() {
    var user = window.localStorage.getItem('user');
    user = user ? JSON.parse(user) : { permission: {} };
    var sys = user.permission['sys:*'];
    var bid1 = user.permission['bid:get'];
    var bid2 = user.permission['bid:add'];
    var bid3 = user.permission['bid:*'];
    if (sys) {
        $('#system').show();
    } else {
        $('#system').hide();
    }
    if (bid1 || bid2 || bid3) {
        $('#bids').show();
    } else {
        $('#bids').hide();
    }
    var enterpriseData = user.permission['cost:get'];
    var enterpriseSupplier = user.permission['enterprise:get'];
    var enterpriseLibrary = user.permission['projDb:get'];
    if (!enterpriseData && !enterpriseSupplier && !enterpriseLibrary) {
        $('#enterprise').hide();
    } else {
        $('#enterprise').show();
    }
    if (!enterpriseData && enterpriseLibrary) {
        $("#enterprise").find('a').attr('href', $("#enterprise").find('a').attr('href') + '?render=library');
    }
    if (!enterpriseData && enterpriseSupplier) {
        $("#enterprise").find('a').attr('href', $("#enterprise").find('a').attr('href') + '?render=supplier');
    }
}