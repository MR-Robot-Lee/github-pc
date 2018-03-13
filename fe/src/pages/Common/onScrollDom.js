var Common = require('../Common');
/**
 * 滚动监测
 * @param titleForm 监听scroll距离上部的dom
 * @param tableContent 滚动scroll 监听
 * @param table 滚动的dom
 */
exports.initDomScrollEvent = function (titleForm, tableContent, table) {
    var tr = $('<tr class="small"></tr>');
    if (titleForm && titleForm[0]) {
        tableContent.css('top', (titleForm[0].offsetHeight + 20));
    }
    $(window).resize(function (e) {
        Common.stopPropagation(e);
        var showTitle = tableContent.find('#showTitle th');
        var hideTitle = tableContent.find('#hideTitle');
        tr.html('');
        showTitle.each(function (index, item) {
            var dom = $('<th class="border">' + $(item).text() + '</th>').css('width', item.offsetWidth);
            dom.appendTo(tr);
        });
        /*if (titleForm && titleForm[0]) {
          var height = titleForm[0].offsetHeight || 84
          tableContent.css('top', (height + 20));
        }*/
        tr.appendTo(hideTitle);
    });
    var count = 0;
    if (!table.is('table')) {
        var $table = table.find('table');
        count = $table[0] && $table[0].offsetTop - table[0].offsetTop;
    }
    tableContent.scroll(function (e) {
        Common.stopPropagation(e);
        var showTitle = tableContent.find('#showTitle th');
        var mainTop = tableContent[0] && tableContent[0].scrollTop;
        var tableTop = table[0] && table[0].offsetTop + showTitle[0].offsetHeight + count;
        var hideTitle = tableContent.find('#hideTitle');
        if (mainTop > tableTop) {
            hideTitle.css('top', (mainTop - tableTop) + showTitle[0].offsetHeight + count);
        }
        if (mainTop > tableTop && hideTitle.is(':hidden')) {
            hideTitle.show();
            hideTitle.html('');
            tr.html('');
            showTitle.each(function (index, item) {
                var dom = $('<th class="border">' + $(item).text() + '</th>').css('width', item.offsetWidth);
                dom.appendTo(tr);
            })
        } else if (mainTop <= tableTop && !hideTitle.is(':hidden')) {
            hideTitle.hide();
        }
        tr.appendTo(hideTitle);
    })
};

exports.moreData = function (pageSize, total, moreData, scrollEvent, callback) {
    pageSize = pageSize || 10;
    total = total || 0;
    var height = scrollEvent.height();
    var scrollHeight = scrollEvent[0].scrollHeight;//&& scrollHeight <= height
    if (total > pageSize) {
        moreData.addClass('active');
    } else {
        moreData.removeClass('active');
    }
    if (scrollEvent) {
        scrollEvent.off('scroll').on('scroll', function (e) {
            Common.stopPropagation(e);
            if (scrollEvent[0].scrollTop + height >= scrollEvent[0].scrollHeight - 4) {
                var flag = scrollEvent.data('flag');
                if (!flag) {
                    scrollEvent.data('flag', true);
                } else {
                    return;
                }

                if (callback) {
                    if (total > pageSize) {
                        pageSize += 10;
                        callback({pageSize: pageSize})
                    }
                }
            }
        });
    }
    if (!moreData.data('flag')) {
        moreData.data('flag', true);
        moreData.click(function (e) {
            Common.stopPropagation(e);
            if (callback) {
                pageSize += 10;
                callback({pageSize: pageSize});
            }
        })
    }
}